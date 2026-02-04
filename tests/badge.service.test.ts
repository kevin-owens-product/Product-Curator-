import { BadgeService, BadgeEvaluationContext } from '../src/services/badge.service';
import { BadgeRarity, BadgeCriteriaType } from '../src/models/types';

describe('BadgeService', () => {
  let service: BadgeService;

  beforeEach(() => {
    service = new BadgeService();
  });

  describe('initialization', () => {
    it('should have default badges loaded', () => {
      const badges = service.getAllBadges();
      expect(badges.length).toBeGreaterThan(20);
    });

    it('should include badges of all rarities', () => {
      const badges = service.getAllBadges();
      const rarities = new Set(badges.map(b => b.rarity));
      expect(rarities.has(BadgeRarity.Common)).toBe(true);
      expect(rarities.has(BadgeRarity.Uncommon)).toBe(true);
      expect(rarities.has(BadgeRarity.Rare)).toBe(true);
      expect(rarities.has(BadgeRarity.Epic)).toBe(true);
      expect(rarities.has(BadgeRarity.Legendary)).toBe(true);
    });
  });

  describe('createBadge', () => {
    it('should create a custom badge', () => {
      const badge = service.createBadge({
        tenant_id: 'tenant1',
        name: 'Custom Badge',
        description: 'A custom badge',
        icon: 'star',
        rarity: BadgeRarity.Rare,
        criteria_type: BadgeCriteriaType.Count,
        criteria_config: { field: 'total_creations', threshold: 5 },
        hidden: false,
      });

      expect(badge.id).toBeDefined();
      expect(badge.name).toBe('Custom Badge');
    });
  });

  describe('awardBadge', () => {
    it('should award a badge to a user', () => {
      const badges = service.getAllBadges();
      const badge = badges[0];

      const userBadge = service.awardBadge('user1', badge.id, 'manual_award');
      expect(userBadge.user_id).toBe('user1');
      expect(userBadge.badge_id).toBe(badge.id);
    });

    it('should prevent duplicate badge awards', () => {
      const badges = service.getAllBadges();
      const badge = badges[0];

      service.awardBadge('user1', badge.id, 'first_award');
      expect(() =>
        service.awardBadge('user1', badge.id, 'second_award')
      ).toThrow(/already has badge/);
    });
  });

  describe('evaluateAndAwardBadges', () => {
    it('should award First Steps badge for 1 creation', () => {
      const context: BadgeEvaluationContext = {
        user_id: 'user1',
        total_creations: 1,
        total_graduations: 0,
        consecutive_graduations: 0,
        challenges_submitted: 0,
        challenges_won: 0,
        consecutive_challenge_wins: 0,
        hackathons_completed: 0,
        hackathons_won: 0,
        team_hackathons_completed: 0,
        individual_hackathons_won: 0,
        streak_daily: 0,
        streak_weekly: 0,
        mentor_sessions: 0,
        curation_reviews: 0,
        submissions_judged: 0,
        confirmed_flags: 0,
        total_points: 10,
        all_time_rank: 100,
        join_date: new Date().toISOString(),
      };

      const awarded = service.evaluateAndAwardBadges(context);
      const badgeNames = awarded.map(ub => {
        const badge = service.getBadge(ub.badge_id);
        return badge.name;
      });

      expect(badgeNames).toContain('First Steps');
    });

    it('should award multiple badges when criteria are met', () => {
      const context: BadgeEvaluationContext = {
        user_id: 'user2',
        total_creations: 10,
        total_graduations: 1,
        consecutive_graduations: 0,
        challenges_submitted: 1,
        challenges_won: 1,
        consecutive_challenge_wins: 0,
        hackathons_completed: 1,
        hackathons_won: 0,
        team_hackathons_completed: 0,
        individual_hackathons_won: 0,
        streak_daily: 7,
        streak_weekly: 0,
        mentor_sessions: 1,
        curation_reviews: 0,
        submissions_judged: 0,
        confirmed_flags: 0,
        total_points: 500,
        all_time_rank: 50,
        join_date: new Date().toISOString(),
      };

      const awarded = service.evaluateAndAwardBadges(context);
      expect(awarded.length).toBeGreaterThan(3);
    });
  });

  describe('getUserBadges', () => {
    it('should return all badges for a user with badge details', () => {
      const badges = service.getAllBadges();
      service.awardBadge('user1', badges[0].id, 'test');
      service.awardBadge('user1', badges[1].id, 'test');

      const userBadges = service.getUserBadges('user1');
      expect(userBadges.length).toBe(2);
      expect(userBadges[0].badge).toBeDefined();
      expect(userBadges[0].badge.name).toBeDefined();
    });
  });

  describe('getUserBadgeCountByRarity', () => {
    it('should count badges by rarity', () => {
      const badges = service.getAllBadges();
      const commonBadges = badges.filter(b => b.rarity === BadgeRarity.Common);

      for (const badge of commonBadges.slice(0, 3)) {
        service.awardBadge('user1', badge.id, 'test');
      }

      const counts = service.getUserBadgeCountByRarity('user1');
      expect(counts[BadgeRarity.Common]).toBe(3);
      expect(counts[BadgeRarity.Legendary]).toBe(0);
    });
  });
});
