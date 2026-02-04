/**
 * Points & Levels Service
 *
 * Manages the points economy: awarding points for actions, tracking totals,
 * calculating levels, and supporting optional point decay.
 */

import { v4 as uuid } from 'uuid';
import {
  PointTransaction,
  UserPoints,
  Level,
  DEFAULT_LEVELS,
  DEFAULT_POINT_VALUES,
} from '../models/gamification';
import { GamificationSettings } from '../models/settings';
import { PointAction } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AwardPointsRequest } from '../models/gamification';

export class PointsService {
  private transactions = new InMemoryStore<PointTransaction & { id: string }>();
  private userPoints = new Map<string, UserPoints>();
  private levels: Omit<Level, 'id' | 'tenant_id'>[] = [...DEFAULT_LEVELS];
  private pointValues: Record<PointAction, number> = { ...DEFAULT_POINT_VALUES };
  private settings: { decayEnabled: boolean; decayRate: number } = {
    decayEnabled: false,
    decayRate: 0,
  };

  /**
   * Award points to a user for a specific action.
   */
  awardPoints(request: AwardPointsRequest): PointTransaction {
    const points = request.override_points ?? this.getPointValue(request.action);

    if (points <= 0) {
      throw new ValidationError('Points must be positive');
    }

    const transaction: PointTransaction = {
      id: uuid(),
      user_id: request.user_id,
      tenant_id: request.tenant_id,
      action: request.action,
      points,
      description: request.description || this.getDefaultDescription(request.action),
      source_type: request.source_type || null,
      source_id: request.source_id || null,
      created_at: new Date().toISOString(),
    };

    this.transactions.create(transaction);
    this.updateUserPoints(request.user_id, request.tenant_id, points);

    return transaction;
  }

  /**
   * Get the current point total and level for a user.
   */
  getUserPoints(userId: string): UserPoints {
    const points = this.userPoints.get(userId);
    if (!points) {
      return {
        user_id: userId,
        tenant_id: '',
        total_points: 0,
        current_level: 1,
        points_this_month: 0,
        points_this_quarter: 0,
        points_this_year: 0,
        last_updated: new Date().toISOString(),
      };
    }
    return { ...points };
  }

  /**
   * Get point transaction history for a user.
   */
  getTransactionHistory(userId: string, limit: number = 50, offset: number = 0): PointTransaction[] {
    const all = this.transactions
      .find(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return all.slice(offset, offset + limit);
  }

  /**
   * Calculate the level for a given point total.
   */
  calculateLevel(totalPoints: number): { level: number; title: string; pointsToNext: number } {
    let currentLevel = this.levels[0];
    let nextLevel: typeof currentLevel | null = null;

    for (let i = 0; i < this.levels.length; i++) {
      if (totalPoints >= this.levels[i].points_required) {
        currentLevel = this.levels[i];
        nextLevel = this.levels[i + 1] || null;
      } else {
        break;
      }
    }

    return {
      level: currentLevel.level_number,
      title: currentLevel.title,
      pointsToNext: nextLevel ? nextLevel.points_required - totalPoints : 0,
    };
  }

  /**
   * Get all level definitions.
   */
  getLevels(): Omit<Level, 'id' | 'tenant_id'>[] {
    return [...this.levels];
  }

  /**
   * Apply point decay across all users (called periodically).
   */
  applyPointDecay(): number {
    if (!this.settings.decayEnabled || this.settings.decayRate <= 0) {
      return 0;
    }

    let usersAffected = 0;
    for (const [userId, points] of this.userPoints.entries()) {
      const decayAmount = Math.floor(points.total_points * this.settings.decayRate);
      if (decayAmount > 0) {
        points.total_points = Math.max(0, points.total_points - decayAmount);
        const levelInfo = this.calculateLevel(points.total_points);
        points.current_level = levelInfo.level;
        points.last_updated = new Date().toISOString();
        this.userPoints.set(userId, points);
        usersAffected++;
      }
    }

    return usersAffected;
  }

  /**
   * Configure the points economy.
   */
  configure(settings: Partial<GamificationSettings>): void {
    if (settings.point_values) {
      this.pointValues = { ...this.pointValues, ...settings.point_values } as Record<PointAction, number>;
    }
    if (settings.point_decay_enabled !== undefined) {
      this.settings.decayEnabled = settings.point_decay_enabled;
    }
    if (settings.point_decay_rate !== undefined) {
      this.settings.decayRate = settings.point_decay_rate;
    }
  }

  /**
   * Get the top N users by points.
   */
  getTopUsers(limit: number = 10): UserPoints[] {
    return Array.from(this.userPoints.values())
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, limit);
  }

  /**
   * Get points ranking for a specific user.
   */
  getUserRank(userId: string): number {
    const sorted = Array.from(this.userPoints.values())
      .sort((a, b) => b.total_points - a.total_points);
    const index = sorted.findIndex(p => p.user_id === userId);
    return index === -1 ? sorted.length + 1 : index + 1;
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private getPointValue(action: PointAction): number {
    return this.pointValues[action] ?? 0;
  }

  private updateUserPoints(userId: string, tenantId: string, points: number): void {
    const existing = this.userPoints.get(userId) || {
      user_id: userId,
      tenant_id: tenantId,
      total_points: 0,
      current_level: 1,
      points_this_month: 0,
      points_this_quarter: 0,
      points_this_year: 0,
      last_updated: new Date().toISOString(),
    };

    existing.total_points += points;
    existing.points_this_month += points;
    existing.points_this_quarter += points;
    existing.points_this_year += points;

    const levelInfo = this.calculateLevel(existing.total_points);
    existing.current_level = levelInfo.level;
    existing.last_updated = new Date().toISOString();

    this.userPoints.set(userId, existing);
  }

  private getDefaultDescription(action: PointAction): string {
    const descriptions: Record<PointAction, string> = {
      [PointAction.CreateCreation]: 'Created a new creation',
      [PointAction.SubmitForCuration]: 'Submitted creation for curation',
      [PointAction.CreationGraduates]: 'Creation graduated successfully',
      [PointAction.CreationKilled]: 'Creation killed with learnings captured',
      [PointAction.OwnProductionAsset]: 'Monthly production asset ownership bonus',
      [PointAction.ZeroIncidents]: 'Monthly zero incidents bonus',
      [PointAction.SubmitToChallenge]: 'Submitted solution to challenge',
      [PointAction.WinChallenge]: 'Won a challenge',
      [PointAction.RunnerUp]: 'Challenge runner-up',
      [PointAction.HonorableMention]: 'Challenge honorable mention',
      [PointAction.CompleteHackathon]: 'Completed a hackathon',
      [PointAction.WinHackathon]: 'Won a hackathon',
      [PointAction.HelpAsMentor]: 'Helped as a mentor',
      [PointAction.QualityCuration]: 'Quality curation decision',
      [PointAction.Streak7Days]: '7-day activity streak bonus',
      [PointAction.Streak30Days]: '30-day activity streak bonus',
      [PointAction.FirstCreation]: 'First creation bonus',
      [PointAction.FirstGraduation]: 'First graduation milestone',
      [PointAction.ReferColleague]: 'Referred a colleague who created',
    };
    return descriptions[action] || 'Points awarded';
  }
}
