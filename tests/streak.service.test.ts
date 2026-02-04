import { StreakService } from '../src/services/streak.service';
import { PointAction, StreakType } from '../src/models/types';

describe('StreakService', () => {
  let service: StreakService;

  beforeEach(() => {
    service = new StreakService();
  });

  describe('recordActivity', () => {
    it('should create a new streak on first activity', () => {
      const streaks = service.recordActivity('user1', PointAction.CreateCreation);
      expect(streaks.length).toBeGreaterThan(0);

      const userStreaks = service.getUserStreaks('user1');
      expect(userStreaks.length).toBeGreaterThan(0);
    });

    it('should track daily active streak', () => {
      service.recordActivity('user1', PointAction.CreateCreation);

      const streak = service.getStreak('user1', StreakType.DailyActive);
      expect(streak).not.toBeNull();
      expect(streak!.current_count).toBe(1);
    });

    it('should track weekly creation streak', () => {
      service.recordActivity('user1', PointAction.CreateCreation);

      const streak = service.getStreak('user1', StreakType.WeeklyCreation);
      expect(streak).not.toBeNull();
      expect(streak!.current_count).toBe(1);
    });
  });

  describe('breakStreak', () => {
    it('should reset streak count to 0', () => {
      service.recordActivity('user1', PointAction.CreateCreation);
      service.breakStreak('user1', StreakType.DailyActive);

      const streak = service.getStreak('user1', StreakType.DailyActive);
      expect(streak!.current_count).toBe(0);
    });

    it('should preserve longest count', () => {
      // Record multiple activities to build streak
      service.recordActivity('user1', PointAction.SubmitToChallenge);
      service.recordActivity('user1', PointAction.SubmitToChallenge);

      const before = service.getStreak('user1', StreakType.ChallengeSubmission);
      const longestBefore = before!.longest_count;

      service.breakStreak('user1', StreakType.ChallengeSubmission);

      const after = service.getStreak('user1', StreakType.ChallengeSubmission);
      expect(after!.current_count).toBe(0);
      expect(after!.longest_count).toBe(longestBefore);
    });
  });

  describe('getStreakLeaders', () => {
    it('should return streak leaders sorted by count', () => {
      // Create streaks for multiple users
      service.recordActivity('user1', PointAction.SubmitToChallenge);
      service.recordActivity('user1', PointAction.SubmitToChallenge);
      service.recordActivity('user2', PointAction.SubmitToChallenge);

      const leaders = service.getStreakLeaders(StreakType.ChallengeSubmission);
      expect(leaders.length).toBe(2);
      expect(leaders[0].user_id).toBe('user1');
    });
  });

  describe('checkMilestones', () => {
    it('should identify milestone thresholds', () => {
      const streak = {
        id: '1',
        user_id: 'user1',
        streak_type: StreakType.DailyActive,
        current_count: 7,
        longest_count: 7,
        last_activity_at: new Date().toISOString(),
        streak_started_at: new Date().toISOString(),
      };

      const milestones = service.checkMilestones(streak);
      expect(milestones).toContain(7);
    });

    it('should return empty for non-milestone counts', () => {
      const streak = {
        id: '1',
        user_id: 'user1',
        streak_type: StreakType.DailyActive,
        current_count: 5,
        longest_count: 5,
        last_activity_at: new Date().toISOString(),
        streak_started_at: new Date().toISOString(),
      };

      const milestones = service.checkMilestones(streak);
      expect(milestones.length).toBe(0);
    });
  });
});
