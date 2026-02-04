/**
 * Anti-Gaming & Fairness Service
 *
 * Prevents abuse of the gamification system through:
 * - Activity rate limiting (diminishing returns)
 * - Anomaly detection
 * - Moderation tools
 * - Fairness mechanisms (normalization, handicaps)
 */

import { v4 as uuid } from 'uuid';
import { PointAction } from '../models/types';
import { ValidationError, ForbiddenError } from '../utils/errors';

/** Configuration for rate limiting */
interface RateLimitConfig {
  action: PointAction;
  max_per_day: number;
  diminishing_after: number; // points reduce after this many actions/day
  diminishing_factor: number; // multiplier per additional action (e.g., 0.5 = half points)
}

/** Flagged activity record */
interface FlaggedActivity {
  id: string;
  user_id: string;
  reason: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  flagged_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  action_taken: string | null;
}

/** Moderation action record */
interface ModerationAction {
  id: string;
  user_id: string;
  action: 'warn' | 'point_adjustment' | 'disqualify' | 'suspend' | 'ban';
  reason: string;
  points_adjusted: number;
  performed_by: string;
  performed_at: string;
}

/** User activity counts for rate limiting */
interface DailyActivityCount {
  user_id: string;
  date: string;
  action_counts: Record<string, number>;
}

export class AntiGamingService {
  private rateLimits: RateLimitConfig[] = [
    { action: PointAction.CreateCreation, max_per_day: 20, diminishing_after: 5, diminishing_factor: 0.5 },
    { action: PointAction.SubmitForCuration, max_per_day: 15, diminishing_after: 5, diminishing_factor: 0.5 },
    { action: PointAction.QualityCuration, max_per_day: 30, diminishing_after: 10, diminishing_factor: 0.7 },
    { action: PointAction.ReferColleague, max_per_day: 5, diminishing_after: 2, diminishing_factor: 0.3 },
  ];

  private dailyCounts = new Map<string, DailyActivityCount>();
  private flaggedActivities: FlaggedActivity[] = [];
  private moderationActions: ModerationAction[] = [];
  private bannedUsers = new Set<string>();
  private suspendedUsers = new Set<string>();

  /**
   * Check if an action is allowed and calculate the effective point multiplier.
   * Returns the multiplier (0-1) for the action's points, or throws if blocked.
   */
  checkAction(userId: string, action: PointAction): number {
    // Check if user is banned or suspended
    if (this.bannedUsers.has(userId)) {
      throw new ForbiddenError('User is banned from gamification activities');
    }
    if (this.suspendedUsers.has(userId)) {
      throw new ForbiddenError('User is suspended from gamification activities');
    }

    const config = this.rateLimits.find(rl => rl.action === action);
    if (!config) return 1.0; // No rate limit configured

    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}:${today}`;
    const dailyCount = this.getDailyCount(userId, today);
    const actionCount = dailyCount.action_counts[action] || 0;

    // Hard cap
    if (actionCount >= config.max_per_day) {
      this.flagActivity(userId, 'rate_limit_hit', `User hit daily limit for ${action}: ${actionCount}/${config.max_per_day}`, 'low');
      return 0;
    }

    // Diminishing returns
    if (actionCount >= config.diminishing_after) {
      const excessActions = actionCount - config.diminishing_after;
      return Math.max(0.1, Math.pow(config.diminishing_factor, excessActions + 1));
    }

    return 1.0;
  }

  /**
   * Record an action (called after points are awarded).
   */
  recordAction(userId: string, action: PointAction): void {
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = this.getDailyCount(userId, today);
    dailyCount.action_counts[action] = (dailyCount.action_counts[action] || 0) + 1;
    this.setDailyCount(userId, today, dailyCount);

    // Check for suspicious patterns
    this.detectAnomalies(userId, action, dailyCount);
  }

  /**
   * Flag suspicious activity for review.
   */
  flagActivity(userId: string, reason: string, details: string, severity: 'low' | 'medium' | 'high'): FlaggedActivity {
    const flag: FlaggedActivity = {
      id: uuid(),
      user_id: userId,
      reason,
      details,
      severity,
      status: 'pending',
      flagged_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      action_taken: null,
    };

    this.flaggedActivities.push(flag);
    return flag;
  }

  /**
   * Review a flagged activity.
   */
  reviewFlag(flagId: string, reviewerId: string, status: 'dismissed' | 'action_taken', actionTaken?: string): FlaggedActivity | null {
    const flag = this.flaggedActivities.find(f => f.id === flagId);
    if (!flag) return null;

    flag.status = status;
    flag.reviewed_at = new Date().toISOString();
    flag.reviewed_by = reviewerId;
    flag.action_taken = actionTaken || null;

    return flag;
  }

  /**
   * Get pending flagged activities.
   */
  getPendingFlags(): FlaggedActivity[] {
    return this.flaggedActivities
      .filter(f => f.status === 'pending')
      .sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }

  /**
   * Adjust a user's points (admin moderation action).
   */
  adjustPoints(userId: string, points: number, reason: string, performedBy: string): ModerationAction {
    const action: ModerationAction = {
      id: uuid(),
      user_id: userId,
      action: 'point_adjustment',
      reason,
      points_adjusted: points,
      performed_by: performedBy,
      performed_at: new Date().toISOString(),
    };

    this.moderationActions.push(action);
    return action;
  }

  /**
   * Suspend a user from gamification.
   */
  suspendUser(userId: string, reason: string, performedBy: string): ModerationAction {
    this.suspendedUsers.add(userId);

    const action: ModerationAction = {
      id: uuid(),
      user_id: userId,
      action: 'suspend',
      reason,
      points_adjusted: 0,
      performed_by: performedBy,
      performed_at: new Date().toISOString(),
    };

    this.moderationActions.push(action);
    return action;
  }

  /**
   * Unsuspend a user.
   */
  unsuspendUser(userId: string): void {
    this.suspendedUsers.delete(userId);
  }

  /**
   * Ban a user from gamification (extreme).
   */
  banUser(userId: string, reason: string, performedBy: string): ModerationAction {
    this.bannedUsers.add(userId);

    const action: ModerationAction = {
      id: uuid(),
      user_id: userId,
      action: 'ban',
      reason,
      points_adjusted: 0,
      performed_by: performedBy,
      performed_at: new Date().toISOString(),
    };

    this.moderationActions.push(action);
    return action;
  }

  /**
   * Get moderation history for a user.
   */
  getModerationHistory(userId: string): ModerationAction[] {
    return this.moderationActions.filter(a => a.user_id === userId);
  }

  /**
   * Check if a user can judge (conflict of interest check).
   */
  checkJudgeEligibility(judgeId: string, submittedBy: string, teamMembers: string[]): boolean {
    // Judge cannot be the submitter or a team member
    if (judgeId === submittedBy) return false;
    if (teamMembers.includes(judgeId)) return false;
    return true;
  }

  /**
   * Calculate normalized score (adjusting for team size, tenure).
   */
  normalizeScore(rawScore: number, factors: { team_size?: number; tenure_months?: number; new_joiner?: boolean }): number {
    let normalized = rawScore;

    // Team size normalization (larger teams get slightly less per person)
    if (factors.team_size && factors.team_size > 1) {
      normalized = rawScore * (1 + Math.log2(factors.team_size)) / factors.team_size;
    }

    // New joiner boost (first 30 days)
    if (factors.new_joiner) {
      normalized *= 1.25; // 25% bonus
    }

    return Math.round(normalized * 100) / 100;
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private getDailyCount(userId: string, date: string): DailyActivityCount {
    const key = `${userId}:${date}`;
    return this.dailyCounts.get(key) || {
      user_id: userId,
      date,
      action_counts: {},
    };
  }

  private setDailyCount(userId: string, date: string, count: DailyActivityCount): void {
    const key = `${userId}:${date}`;
    this.dailyCounts.set(key, count);
  }

  private detectAnomalies(userId: string, action: PointAction, dailyCount: DailyActivityCount): void {
    const totalActions = Object.values(dailyCount.action_counts).reduce((s, c) => s + c, 0);

    // Spike detection: too many total actions in a day
    if (totalActions > 100) {
      this.flagActivity(
        userId,
        'activity_spike',
        `Unusually high activity: ${totalActions} total actions today`,
        'medium'
      );
    }

    // Rapid-fire detection: many of the same action
    const actionCount = dailyCount.action_counts[action] || 0;
    const limit = this.rateLimits.find(rl => rl.action === action);
    if (limit && actionCount > limit.max_per_day * 0.8) {
      this.flagActivity(
        userId,
        'approaching_limit',
        `User at ${actionCount}/${limit.max_per_day} for ${action}`,
        'low'
      );
    }
  }
}
