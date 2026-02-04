/**
 * Leaderboard & Analytics Service
 *
 * Provides leaderboard views across multiple dimensions, engagement
 * analytics, and health metrics for the gamification system.
 */

import { v4 as uuid } from 'uuid';
import {
  Leaderboard,
  LeaderboardEntry,
  UserGamificationProfile,
  LeaderboardQuery,
} from '../models/gamification';
import { LeaderboardScope, LeaderboardMetric, ProfileVisibility } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError } from '../utils/errors';
import { PointsService } from './points.service';
import { BadgeService } from './badge.service';
import { StreakService } from './streak.service';

/** Engagement health metrics */
export interface EngagementMetrics {
  weekly_active_creators_pct: number;
  challenge_participation_pct: number;
  hackathon_attendance_pct: number;
  streak_retention_pct: number;
  points_gini_coefficient: number;
  total_users: number;
  active_users: number;
}

/** Analytics summary for admins */
export interface GamificationAnalytics {
  participation_rate: number;
  points_distribution: { min: number; max: number; median: number; mean: number };
  most_common_badges: { badge_name: string; count: number }[];
  engagement_trend: { period: string; active_users: number }[];
  top_challenges_by_participation: { challenge_id: string; title: string; submissions: number }[];
}

export class LeaderboardService {
  private leaderboards = new InMemoryStore<Leaderboard>();
  private userDisplayNames = new Map<string, string>();

  constructor(
    private pointsService: PointsService,
    private badgeService: BadgeService,
    private streakService: StreakService
  ) {
    this.initializeDefaultLeaderboards();
  }

  /**
   * Register a user's display name for leaderboards.
   */
  registerUser(userId: string, displayName: string): void {
    this.userDisplayNames.set(userId, displayName);
  }

  /**
   * Get leaderboard entries based on query parameters.
   */
  getLeaderboard(query: LeaderboardQuery): { entries: LeaderboardEntry[]; total: number; userEntry?: LeaderboardEntry } {
    const topUsers = this.pointsService.getTopUsers(1000);
    let entries: LeaderboardEntry[] = topUsers.map((up, index) => ({
      user_id: up.user_id,
      rank: index + 1,
      score: this.getMetricScore(up.user_id, query.metric, query.scope),
      display_name: this.userDisplayNames.get(up.user_id) || `User ${up.user_id.slice(0, 8)}`,
      level: up.current_level,
      trend: 'stable' as const,
      previous_rank: null,
    }));

    // Re-sort by actual metric if not default points
    if (query.metric !== LeaderboardMetric.Points) {
      entries.sort((a, b) => b.score - a.score);
      entries.forEach((e, i) => { e.rank = i + 1; });
    }

    const total = entries.length;
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    let userEntry: LeaderboardEntry | undefined;
    if (query.user_id) {
      userEntry = entries.find(e => e.user_id === query.user_id);
    }

    entries = entries.slice(offset, offset + limit);

    return { entries, total, userEntry };
  }

  /**
   * Get a full gamification profile for a user.
   */
  getUserProfile(userId: string, tenantId: string): UserGamificationProfile {
    const points = this.pointsService.getUserPoints(userId);
    const levelInfo = this.pointsService.calculateLevel(points.total_points);
    const badges = this.badgeService.getUserBadges(userId);
    const streaks = this.streakService.getUserStreaks(userId);
    const recentPoints = this.pointsService.getTransactionHistory(userId, 10);
    const rank = this.pointsService.getUserRank(userId);

    return {
      user_id: userId,
      tenant_id: tenantId,
      total_points: points.total_points,
      current_level: levelInfo.level,
      current_title: levelInfo.title,
      points_to_next_level: levelInfo.pointsToNext,
      badges: badges,
      featured_badges: badges.slice(0, 3).map(b => b.badge_id),
      streaks,
      total_creations: 0, // Would come from creation service
      total_graduations: 0,
      challenges_entered: 0,
      challenges_won: 0,
      hackathons_participated: 0,
      hackathons_won: 0,
      leaderboard_positions: {
        'all-time': rank,
      },
      recent_points: recentPoints,
    };
  }

  /**
   * Calculate engagement health metrics.
   */
  getEngagementMetrics(tenantId: string): EngagementMetrics {
    const allUsers = this.pointsService.getTopUsers(10000);
    const totalUsers = allUsers.length;

    // Active users: those who earned points this month
    const activeUsers = allUsers.filter(u => u.points_this_month > 0).length;

    // Points distribution for Gini coefficient
    const pointValues = allUsers.map(u => u.total_points).sort((a, b) => a - b);
    const gini = this.calculateGiniCoefficient(pointValues);

    return {
      weekly_active_creators_pct: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      challenge_participation_pct: 0, // Would require cross-service query
      hackathon_attendance_pct: 0,
      streak_retention_pct: 0,
      points_gini_coefficient: gini,
      total_users: totalUsers,
      active_users: activeUsers,
    };
  }

  /**
   * Get analytics summary for admins.
   */
  getAnalytics(tenantId: string): GamificationAnalytics {
    const allUsers = this.pointsService.getTopUsers(10000);
    const pointValues = allUsers.map(u => u.total_points);

    const sorted = [...pointValues].sort((a, b) => a - b);
    const sum = sorted.reduce((s, v) => s + v, 0);

    return {
      participation_rate: allUsers.length > 0
        ? (allUsers.filter(u => u.points_this_month > 0).length / allUsers.length) * 100
        : 0,
      points_distribution: {
        min: sorted[0] || 0,
        max: sorted[sorted.length - 1] || 0,
        median: sorted[Math.floor(sorted.length / 2)] || 0,
        mean: allUsers.length > 0 ? Math.round(sum / allUsers.length) : 0,
      },
      most_common_badges: [],
      engagement_trend: [],
      top_challenges_by_participation: [],
    };
  }

  /**
   * Get all leaderboard definitions.
   */
  getLeaderboardDefinitions(): Leaderboard[] {
    return this.leaderboards.getAll();
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private getMetricScore(userId: string, metric: LeaderboardMetric, scope: LeaderboardScope): number {
    const points = this.pointsService.getUserPoints(userId);

    switch (metric) {
      case LeaderboardMetric.Points:
        switch (scope) {
          case LeaderboardScope.Monthly: return points.points_this_month;
          case LeaderboardScope.Quarterly: return points.points_this_quarter;
          case LeaderboardScope.Yearly: return points.points_this_year;
          default: return points.total_points;
        }
      default:
        return points.total_points;
    }
  }

  private calculateGiniCoefficient(values: number[]): number {
    if (values.length === 0) return 0;
    const n = values.length;
    const sum = values.reduce((s, v) => s + v, 0);
    if (sum === 0) return 0;

    let numerator = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        numerator += Math.abs(values[i] - values[j]);
      }
    }

    return numerator / (2 * n * sum);
  }

  private initializeDefaultLeaderboards(): void {
    const defaults: Omit<Leaderboard, 'id'>[] = [
      { tenant_id: 'system', workspace_id: null, name: 'All-Time Points', description: 'Overall points leaderboard', scope: LeaderboardScope.AllTime, metric: LeaderboardMetric.Points, visibility: ProfileVisibility.Public, show_top_n: 100, show_user_position: true },
      { tenant_id: 'system', workspace_id: null, name: 'Monthly Points', description: 'Points earned this month', scope: LeaderboardScope.Monthly, metric: LeaderboardMetric.Points, visibility: ProfileVisibility.Public, show_top_n: 50, show_user_position: true },
      { tenant_id: 'system', workspace_id: null, name: 'Weekly Points', description: 'Points earned this week', scope: LeaderboardScope.Weekly, metric: LeaderboardMetric.Points, visibility: ProfileVisibility.Public, show_top_n: 25, show_user_position: true },
      { tenant_id: 'system', workspace_id: null, name: 'Creations This Quarter', description: 'Most creations this quarter', scope: LeaderboardScope.Quarterly, metric: LeaderboardMetric.Creations, visibility: ProfileVisibility.Public, show_top_n: 50, show_user_position: true },
      { tenant_id: 'system', workspace_id: null, name: 'Challenge Wins', description: 'Most challenge victories', scope: LeaderboardScope.Yearly, metric: LeaderboardMetric.ChallengeWins, visibility: ProfileVisibility.Public, show_top_n: 50, show_user_position: true },
      { tenant_id: 'system', workspace_id: null, name: 'Hackathon Victories', description: 'Most hackathon wins', scope: LeaderboardScope.AllTime, metric: LeaderboardMetric.HackathonWins, visibility: ProfileVisibility.Public, show_top_n: 25, show_user_position: true },
    ];

    for (const lb of defaults) {
      this.leaderboards.create({ id: uuid(), ...lb });
    }
  }
}
