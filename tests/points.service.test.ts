import { PointsService } from '../src/services/points.service';
import { PointAction } from '../src/models/types';

describe('PointsService', () => {
  let service: PointsService;

  beforeEach(() => {
    service = new PointsService();
  });

  describe('awardPoints', () => {
    it('should award default points for an action', () => {
      const tx = service.awardPoints({
        user_id: 'user1',
        tenant_id: 'tenant1',
        action: PointAction.CreateCreation,
      });

      expect(tx.points).toBe(10);
      expect(tx.user_id).toBe('user1');
      expect(tx.action).toBe(PointAction.CreateCreation);
    });

    it('should accumulate points for a user', () => {
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.CreateCreation });
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.SubmitForCuration });

      const points = service.getUserPoints('user1');
      expect(points.total_points).toBe(25); // 10 + 15
    });

    it('should allow overriding point values', () => {
      const tx = service.awardPoints({
        user_id: 'user1',
        tenant_id: 't1',
        action: PointAction.CreateCreation,
        override_points: 50,
      });

      expect(tx.points).toBe(50);
    });

    it('should reject non-positive points', () => {
      expect(() =>
        service.awardPoints({
          user_id: 'user1',
          tenant_id: 't1',
          action: PointAction.CreateCreation,
          override_points: -5,
        })
      ).toThrow('Points must be positive');
    });
  });

  describe('calculateLevel', () => {
    it('should return Newcomer for 0 points', () => {
      const level = service.calculateLevel(0);
      expect(level.level).toBe(1);
      expect(level.title).toBe('Newcomer');
    });

    it('should return Creator at 100 points', () => {
      const level = service.calculateLevel(100);
      expect(level.level).toBe(2);
      expect(level.title).toBe('Creator');
    });

    it('should return Builder at 300 points', () => {
      const level = service.calculateLevel(300);
      expect(level.level).toBe(3);
      expect(level.title).toBe('Builder');
    });

    it('should return Founder at 50000 points', () => {
      const level = service.calculateLevel(50000);
      expect(level.level).toBe(10);
      expect(level.title).toBe('Founder');
      expect(level.pointsToNext).toBe(0);
    });

    it('should calculate points to next level correctly', () => {
      const level = service.calculateLevel(150);
      expect(level.level).toBe(2);
      expect(level.pointsToNext).toBe(150); // 300 - 150
    });
  });

  describe('getUserRank', () => {
    it('should rank users by total points', () => {
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.WinChallenge }); // 200
      service.awardPoints({ user_id: 'user2', tenant_id: 't1', action: PointAction.CreateCreation }); // 10
      service.awardPoints({ user_id: 'user3', tenant_id: 't1', action: PointAction.WinHackathon }); // 300

      expect(service.getUserRank('user3')).toBe(1);
      expect(service.getUserRank('user1')).toBe(2);
      expect(service.getUserRank('user2')).toBe(3);
    });
  });

  describe('getTransactionHistory', () => {
    it('should return all transactions for a user', () => {
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.CreateCreation });
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.WinChallenge });

      const history = service.getTransactionHistory('user1');
      expect(history.length).toBe(2);
      const actions = history.map(h => h.action);
      expect(actions).toContain(PointAction.CreateCreation);
      expect(actions).toContain(PointAction.WinChallenge);
    });

    it('should support pagination', () => {
      for (let i = 0; i < 5; i++) {
        service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.CreateCreation });
      }

      const page = service.getTransactionHistory('user1', 2, 1);
      expect(page.length).toBe(2);
    });
  });

  describe('pointDecay', () => {
    it('should not decay when disabled', () => {
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.WinChallenge });
      const affected = service.applyPointDecay();
      expect(affected).toBe(0);
    });

    it('should decay points when enabled', () => {
      service.configure({ point_decay_enabled: true, point_decay_rate: 0.1 } as any);
      service.awardPoints({ user_id: 'user1', tenant_id: 't1', action: PointAction.WinChallenge });

      const before = service.getUserPoints('user1').total_points;
      service.applyPointDecay();
      const after = service.getUserPoints('user1').total_points;

      expect(after).toBeLessThan(before);
    });
  });
});
