/**
 * Badge & Achievements Service
 *
 * Manages badge definitions, evaluates criteria, awards badges to users,
 * and provides badge discovery and display features.
 */

import { v4 as uuid } from 'uuid';
import { Badge, UserBadge } from '../models/gamification';
import { BadgeRarity, BadgeCriteriaType } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';

/** Structure for badge criteria evaluation context */
export interface BadgeEvaluationContext {
  user_id: string;
  total_creations: number;
  total_graduations: number;
  consecutive_graduations: number;
  challenges_submitted: number;
  challenges_won: number;
  consecutive_challenge_wins: number;
  hackathons_completed: number;
  hackathons_won: number;
  streak_daily: number;
  streak_weekly: number;
  mentor_sessions: number;
  curation_reviews: number;
  total_points: number;
  all_time_rank: number;
  join_date: string;
}

export class BadgeService {
  private badges = new InMemoryStore<Badge>();
  private userBadges = new InMemoryStore<UserBadge & { id: string }>();

  constructor() {
    this.initializeDefaultBadges();
  }

  /**
   * Create a custom badge.
   */
  createBadge(badge: Omit<Badge, 'id'>): Badge {
    const newBadge: Badge = { id: uuid(), ...badge };
    return this.badges.create(newBadge);
  }

  /**
   * Get a badge by ID.
   */
  getBadge(badgeId: string): Badge {
    const badge = this.badges.getById(badgeId);
    if (!badge) throw new NotFoundError('Badge', badgeId);
    return badge;
  }

  /**
   * Get all badges, optionally filtered.
   */
  getAllBadges(filters?: { rarity?: BadgeRarity; tenant_id?: string; hidden?: boolean }): Badge[] {
    let badges = this.badges.getAll();
    if (filters?.rarity) {
      badges = badges.filter(b => b.rarity === filters.rarity);
    }
    if (filters?.tenant_id) {
      badges = badges.filter(b => b.tenant_id === null || b.tenant_id === filters.tenant_id);
    }
    if (filters?.hidden !== undefined) {
      badges = badges.filter(b => b.hidden === filters.hidden);
    }
    return badges;
  }

  /**
   * Get all badges earned by a user.
   */
  getUserBadges(userId: string): (UserBadge & { badge: Badge })[] {
    const userBadges = this.userBadges.find(ub => ub.user_id === userId);
    return userBadges.map(ub => {
      const badge = this.badges.getById(ub.badge_id);
      return { ...ub, badge: badge! };
    }).filter(ub => ub.badge);
  }

  /**
   * Award a specific badge to a user.
   */
  awardBadge(userId: string, badgeId: string, triggerEvent: string): UserBadge {
    const badge = this.badges.getById(badgeId);
    if (!badge) throw new NotFoundError('Badge', badgeId);

    // Check if user already has this badge
    const existing = this.userBadges.findOne(
      ub => ub.user_id === userId && ub.badge_id === badgeId
    );
    if (existing) {
      throw new ConflictError(`User already has badge '${badge.name}'`);
    }

    const userBadge: UserBadge & { id: string } = {
      id: uuid(),
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
      trigger_event: triggerEvent,
    };

    return this.userBadges.create(userBadge);
  }

  /**
   * Evaluate all badge criteria for a user and award any newly earned badges.
   * Returns the list of newly awarded badges.
   */
  evaluateAndAwardBadges(context: BadgeEvaluationContext): UserBadge[] {
    const newlyAwarded: UserBadge[] = [];
    const existingBadgeIds = new Set(
      this.userBadges
        .find(ub => ub.user_id === context.user_id)
        .map(ub => ub.badge_id)
    );

    for (const badge of this.badges.getAll()) {
      if (existingBadgeIds.has(badge.id)) continue;
      if (this.checkCriteria(badge, context)) {
        try {
          const awarded = this.awardBadge(
            context.user_id,
            badge.id,
            `Auto-evaluated: ${badge.criteria_type}`
          );
          newlyAwarded.push(awarded);
        } catch {
          // Already has badge or other conflict, skip
        }
      }
    }

    return newlyAwarded;
  }

  /**
   * Check if a user has a specific badge.
   */
  userHasBadge(userId: string, badgeId: string): boolean {
    return !!this.userBadges.findOne(
      ub => ub.user_id === userId && ub.badge_id === badgeId
    );
  }

  /**
   * Get badge count by rarity for a user.
   */
  getUserBadgeCountByRarity(userId: string): Record<BadgeRarity, number> {
    const counts: Record<BadgeRarity, number> = {
      [BadgeRarity.Common]: 0,
      [BadgeRarity.Uncommon]: 0,
      [BadgeRarity.Rare]: 0,
      [BadgeRarity.Epic]: 0,
      [BadgeRarity.Legendary]: 0,
    };

    const userBadges = this.userBadges.find(ub => ub.user_id === userId);
    for (const ub of userBadges) {
      const badge = this.badges.getById(ub.badge_id);
      if (badge) counts[badge.rarity]++;
    }

    return counts;
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private checkCriteria(badge: Badge, context: BadgeEvaluationContext): boolean {
    const config = badge.criteria_config;
    const field = config.field as string;
    const threshold = config.threshold as number;

    switch (badge.criteria_type) {
      case BadgeCriteriaType.Count:
        return this.getContextValue(context, field) >= threshold;

      case BadgeCriteriaType.Streak:
        return this.getContextValue(context, field) >= threshold;

      case BadgeCriteriaType.Milestone:
        return this.getContextValue(context, field) >= threshold;

      case BadgeCriteriaType.Special: {
        const rule = config.rule as string;
        return this.evaluateSpecialRule(rule, context);
      }

      default:
        return false;
    }
  }

  private getContextValue(context: BadgeEvaluationContext, field: string): number {
    const value = (context as unknown as Record<string, unknown>)[field];
    return typeof value === 'number' ? value : 0;
  }

  private evaluateSpecialRule(rule: string, context: BadgeEvaluationContext): boolean {
    switch (rule) {
      case 'early_adopter': {
        const joinDate = new Date(context.join_date);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        return joinDate <= cutoff;
      }
      case 'perfect_record':
        return context.total_graduations >= 10 && context.total_creations === context.total_graduations;
      case 'quality_master':
        return context.total_graduations >= 20 &&
          (context.total_graduations / Math.max(context.total_creations, 1)) >= 0.9;
      case 'community_champion':
        return context.all_time_rank <= 10;
      case 'founders_circle':
        return context.all_time_rank <= 3;
      default:
        return false;
    }
  }

  private initializeDefaultBadges(): void {
    const defaults: Omit<Badge, 'id'>[] = [
      // Creation badges
      { tenant_id: null, name: 'First Steps', description: 'Create your first creation', icon: 'footprints', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Creator', description: 'Create 10 creations', icon: 'pencil', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 10 }, hidden: false },
      { tenant_id: null, name: 'Prolific', description: 'Create 50 creations', icon: 'pen-fancy', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 50 }, hidden: false },
      { tenant_id: null, name: 'Machine', description: 'Create 100 creations', icon: 'robot', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 100 }, hidden: false },
      { tenant_id: null, name: 'Legend', description: 'Create 500 creations', icon: 'scroll', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 500 }, hidden: false },

      // Quality badges
      { tenant_id: null, name: 'Graduated', description: 'First creation graduates', icon: 'graduation-cap', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_graduations', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Consistent', description: '5 consecutive graduations', icon: 'check-double', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'consecutive_graduations', threshold: 5 }, hidden: false },
      { tenant_id: null, name: 'Perfect Record', description: '10 graduations, 0 kills', icon: 'award', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'perfect_record' }, hidden: false },
      { tenant_id: null, name: 'Quality Master', description: '90%+ graduation rate (min 20)', icon: 'shield-check', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'quality_master' }, hidden: false },

      // Challenge badges
      { tenant_id: null, name: 'Challenger', description: 'Submit to first challenge', icon: 'flag', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_submitted', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Competitor', description: 'Submit to 5 challenges', icon: 'swords', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_submitted', threshold: 5 }, hidden: false },
      { tenant_id: null, name: 'Victor', description: 'Win first challenge', icon: 'medal', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Triple Crown', description: 'Win 3 challenges', icon: 'crown', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 3 }, hidden: false },
      { tenant_id: null, name: 'Champion', description: 'Win 10 challenges', icon: 'trophy', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 10 }, hidden: false },
      { tenant_id: null, name: 'Undefeated', description: 'Win 5 challenges in a row', icon: 'fire', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'consecutive_challenge_wins', threshold: 5 }, hidden: false },

      // Streak badges
      { tenant_id: null, name: 'Week Warrior', description: '7-day active streak', icon: 'calendar-week', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 7 }, hidden: false },
      { tenant_id: null, name: 'Month Master', description: '30-day active streak', icon: 'calendar', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 30 }, hidden: false },
      { tenant_id: null, name: 'Quarter Queen', description: '90-day active streak', icon: 'calendar-check', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 90 }, hidden: false },
      { tenant_id: null, name: 'Year Legend', description: '365-day active streak', icon: 'calendar-star', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 365 }, hidden: false },

      // Hackathon badges
      { tenant_id: null, name: 'Hackathon Survivor', description: 'Complete a hackathon', icon: 'laptop-code', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'hackathons_completed', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Hackathon Victor', description: 'Win a hackathon', icon: 'rocket', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'hackathons_won', threshold: 1 }, hidden: false },

      // Mentorship badges
      { tenant_id: null, name: 'Helping Hand', description: 'Help as a mentor', icon: 'hand-holding', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'mentor_sessions', threshold: 1 }, hidden: false },
      { tenant_id: null, name: 'Super Mentor', description: 'Help 10 hackathon teams', icon: 'hands-helping', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'mentor_sessions', threshold: 10 }, hidden: false },

      // Curation badges
      { tenant_id: null, name: 'Wise Judge', description: 'Review as a curator', icon: 'gavel', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'curation_reviews', threshold: 1 }, hidden: false },
      { tenant_id: null, name: '100 Reviews', description: 'Complete 100 curation reviews', icon: 'book-open', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'curation_reviews', threshold: 100 }, hidden: false },

      // Special badges
      { tenant_id: null, name: 'Early Adopter', description: 'Join in the first month', icon: 'clock', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'early_adopter' }, hidden: true },
      { tenant_id: null, name: 'Community Champion', description: 'Top 10 all-time points', icon: 'users', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'community_champion' }, hidden: false },
      { tenant_id: null, name: "Founder's Circle", description: 'Top 3 all-time points', icon: 'gem', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'founders_circle' }, hidden: false },
    ];

    for (const badge of defaults) {
      this.badges.create({ id: uuid(), ...badge });
    }
  }
}
