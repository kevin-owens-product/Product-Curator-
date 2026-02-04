/**
 * Streak Service
 *
 * Tracks user activity streaks across various dimensions:
 * daily active, weekly creation, challenge participation,
 * curation participation, and quality streaks.
 */

import { v4 as uuid } from 'uuid';
import { Streak } from '../models/gamification';
import { StreakType, PointAction } from '../models/types';
import { InMemoryStore } from '../utils/store';

const STREAK_WINDOW_MS: Record<StreakType, number> = {
  [StreakType.DailyActive]: 48 * 60 * 60 * 1000, // 48h grace window
  [StreakType.WeeklyCreation]: 14 * 24 * 60 * 60 * 1000, // 14 days
  [StreakType.CurationParticipation]: 14 * 24 * 60 * 60 * 1000,
  [StreakType.ChallengeSubmission]: 30 * 24 * 60 * 60 * 1000,
  [StreakType.QualityStreak]: 0, // no time window, based on consecutive outcomes
};

export class StreakService {
  private streaks = new InMemoryStore<Streak>();

  /**
   * Record activity for a user, updating relevant streaks.
   * Returns any streaks that were incremented.
   */
  recordActivity(userId: string, action: PointAction): Streak[] {
    const updatedStreaks: Streak[] = [];
    const relevantTypes = this.getRelevantStreakTypes(action);

    for (const streakType of relevantTypes) {
      const streak = this.updateStreak(userId, streakType);
      if (streak) updatedStreaks.push(streak);
    }

    return updatedStreaks;
  }

  /**
   * Get all streaks for a user.
   */
  getUserStreaks(userId: string): Streak[] {
    return this.streaks.find(s => s.user_id === userId);
  }

  /**
   * Get a specific streak for a user.
   */
  getStreak(userId: string, streakType: StreakType): Streak | null {
    return this.streaks.findOne(
      s => s.user_id === userId && s.streak_type === streakType
    ) || null;
  }

  /**
   * Check if a streak is still active (not broken).
   */
  isStreakActive(streak: Streak): boolean {
    const window = STREAK_WINDOW_MS[streak.streak_type];
    if (window === 0) return true; // non-time-based streaks
    const elapsed = Date.now() - new Date(streak.last_activity_at).getTime();
    return elapsed < window;
  }

  /**
   * Break a streak (e.g., quality streak broken by a kill).
   */
  breakStreak(userId: string, streakType: StreakType): Streak | null {
    const streak = this.streaks.findOne(
      s => s.user_id === userId && s.streak_type === streakType
    );
    if (!streak) return null;

    const updated = this.streaks.update(streak.id, {
      current_count: 0,
      streak_started_at: new Date().toISOString(),
    });
    return updated || null;
  }

  /**
   * Get streak leaders across all users.
   */
  getStreakLeaders(streakType: StreakType, limit: number = 10): Streak[] {
    return this.streaks
      .find(s => s.streak_type === streakType)
      .filter(s => this.isStreakActive(s))
      .sort((a, b) => b.current_count - a.current_count)
      .slice(0, limit);
  }

  /**
   * Check streaks for all users and break any that have expired.
   * Returns the number of streaks broken.
   */
  checkAndBreakExpiredStreaks(): number {
    let broken = 0;
    for (const streak of this.streaks.getAll()) {
      if (streak.current_count > 0 && !this.isStreakActive(streak)) {
        this.streaks.update(streak.id, {
          current_count: 0,
          streak_started_at: new Date().toISOString(),
        });
        broken++;
      }
    }
    return broken;
  }

  /**
   * Get milestone thresholds that were just crossed.
   */
  checkMilestones(streak: Streak): number[] {
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    return milestones.filter(m => streak.current_count === m);
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private updateStreak(userId: string, streakType: StreakType): Streak | null {
    let streak = this.streaks.findOne(
      s => s.user_id === userId && s.streak_type === streakType
    );

    const now = new Date().toISOString();

    if (!streak) {
      // Create new streak
      const newStreak: Streak = {
        id: uuid(),
        user_id: userId,
        streak_type: streakType,
        current_count: 1,
        longest_count: 1,
        last_activity_at: now,
        streak_started_at: now,
      };
      this.streaks.create(newStreak);
      return newStreak;
    }

    // Check if streak is still active
    if (this.isStreakActive(streak)) {
      // For daily streaks, only increment once per day
      if (streakType === StreakType.DailyActive) {
        const lastActivity = new Date(streak.last_activity_at);
        const today = new Date();
        if (
          lastActivity.getFullYear() === today.getFullYear() &&
          lastActivity.getMonth() === today.getMonth() &&
          lastActivity.getDate() === today.getDate()
        ) {
          // Already recorded today, just update timestamp
          this.streaks.update(streak.id, { last_activity_at: now });
          return null;
        }
      }

      const newCount = streak.current_count + 1;
      const updated = this.streaks.update(streak.id, {
        current_count: newCount,
        longest_count: Math.max(streak.longest_count, newCount),
        last_activity_at: now,
      });
      return updated || null;
    } else {
      // Streak is broken, start new
      const updated = this.streaks.update(streak.id, {
        current_count: 1,
        last_activity_at: now,
        streak_started_at: now,
      });
      return updated || null;
    }
  }

  private getRelevantStreakTypes(action: PointAction): StreakType[] {
    const types: StreakType[] = [StreakType.DailyActive]; // all actions contribute to daily

    switch (action) {
      case PointAction.CreateCreation:
        types.push(StreakType.WeeklyCreation);
        break;
      case PointAction.SubmitToChallenge:
        types.push(StreakType.ChallengeSubmission);
        break;
      case PointAction.QualityCuration:
        types.push(StreakType.CurationParticipation);
        break;
      case PointAction.CreationGraduates:
        types.push(StreakType.QualityStreak);
        break;
    }

    return types;
  }
}
