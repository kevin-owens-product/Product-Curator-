import { AntiGamingService } from '../src/services/antigaming.service';
import { PointAction } from '../src/models/types';

describe('AntiGamingService', () => {
  let service: AntiGamingService;

  beforeEach(() => {
    service = new AntiGamingService();
  });

  describe('checkAction', () => {
    it('should allow actions within limits', () => {
      const multiplier = service.checkAction('user1', PointAction.CreateCreation);
      expect(multiplier).toBe(1.0);
    });

    it('should return diminishing multiplier after threshold', () => {
      // Record 5 creation actions (the diminishing_after threshold)
      for (let i = 0; i < 5; i++) {
        service.recordAction('user1', PointAction.CreateCreation);
      }

      const multiplier = service.checkAction('user1', PointAction.CreateCreation);
      expect(multiplier).toBeLessThan(1.0);
      expect(multiplier).toBeGreaterThan(0);
    });

    it('should block banned users', () => {
      service.banUser('user1', 'abuse', 'admin1');
      expect(() => service.checkAction('user1', PointAction.CreateCreation)).toThrow('banned');
    });

    it('should block suspended users', () => {
      service.suspendUser('user1', 'investigation', 'admin1');
      expect(() => service.checkAction('user1', PointAction.CreateCreation)).toThrow('suspended');
    });
  });

  describe('moderation', () => {
    it('should flag suspicious activity', () => {
      const flag = service.flagActivity('user1', 'test_flag', 'Testing flag system', 'medium');
      expect(flag.id).toBeDefined();
      expect(flag.status).toBe('pending');
    });

    it('should list pending flags sorted by severity', () => {
      service.flagActivity('user1', 'low_issue', 'Low severity', 'low');
      service.flagActivity('user2', 'high_issue', 'High severity', 'high');
      service.flagActivity('user3', 'medium_issue', 'Medium severity', 'medium');

      const flags = service.getPendingFlags();
      expect(flags[0].severity).toBe('high');
      expect(flags[1].severity).toBe('medium');
      expect(flags[2].severity).toBe('low');
    });

    it('should review and resolve flags', () => {
      const flag = service.flagActivity('user1', 'issue', 'Details', 'high');
      const reviewed = service.reviewFlag(flag.id, 'admin1', 'dismissed');

      expect(reviewed!.status).toBe('dismissed');
      expect(reviewed!.reviewed_by).toBe('admin1');
    });

    it('should record moderation actions', () => {
      service.suspendUser('user1', 'abuse', 'admin1');
      const history = service.getModerationHistory('user1');

      expect(history.length).toBe(1);
      expect(history[0].action).toBe('suspend');
    });
  });

  describe('suspension and ban', () => {
    it('should suspend and unsuspend users', () => {
      service.suspendUser('user1', 'temp', 'admin1');
      expect(() => service.checkAction('user1', PointAction.CreateCreation)).toThrow('suspended');

      service.unsuspendUser('user1');
      const multiplier = service.checkAction('user1', PointAction.CreateCreation);
      expect(multiplier).toBe(1.0);
    });
  });

  describe('judge eligibility', () => {
    it('should prevent self-judging', () => {
      expect(service.checkJudgeEligibility('user1', 'user1', [])).toBe(false);
    });

    it('should prevent team member judging', () => {
      expect(service.checkJudgeEligibility('judge1', 'user1', ['judge1', 'user2'])).toBe(false);
    });

    it('should allow unrelated judges', () => {
      expect(service.checkJudgeEligibility('judge1', 'user1', ['user2', 'user3'])).toBe(true);
    });
  });

  describe('score normalization', () => {
    it('should apply new joiner boost', () => {
      const normalized = service.normalizeScore(100, { new_joiner: true });
      expect(normalized).toBe(125); // 25% boost
    });

    it('should normalize for team size', () => {
      const solo = service.normalizeScore(100, { team_size: 1 });
      const team = service.normalizeScore(100, { team_size: 4 });
      expect(team).toBeLessThan(solo);
    });
  });
});
