import { CompetitionService } from '../src/services/competition.service';
import { CompetitionType, CompetitionStatus, ScoringModel, Eligibility, LeaderboardVisibility, TournamentFormat } from '../src/models/types';

describe('CompetitionService', () => {
  let service: CompetitionService;

  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  beforeEach(() => {
    service = new CompetitionService();
  });

  describe('createCompetition', () => {
    it('should create a competition', () => {
      const competition = service.createCompetition({
        tenant_id: 'tenant1',
        name: 'Q1 Innovation Cup',
        description: 'Quarterly innovation competition',
        rules: 'Standard rules',
        type: CompetitionType.Seasonal,
        starts_at: futureDate(1),
        ends_at: futureDate(90),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      expect(competition.id).toBeDefined();
      expect(competition.status).toBe(CompetitionStatus.Upcoming);
    });
  });

  describe('createSprint', () => {
    it('should create a sprint competition', () => {
      const sprint = service.createSprint({
        tenant_id: 'tenant1',
        name: 'Best Coherence Improvement',
        description: 'Weekly sprint',
        theme: 'coherence',
        duration_days: 7,
        scoring_model: ScoringModel.Points,
        scoring_criteria: { metric: 'coherence_improvements' },
        auto_reset: true,
        cumulative_tracking: true,
      });

      expect(sprint.type).toBe(CompetitionType.Sprint);
      expect(sprint.ends_at).not.toBeNull();
    });
  });

  describe('participation', () => {
    it('should allow users to join a competition', () => {
      const competition = service.createCompetition({
        tenant_id: 't1',
        name: 'Test',
        description: 'Test',
        rules: 'Rules',
        type: CompetitionType.Ongoing,
        starts_at: new Date().toISOString(),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      service.startCompetition(competition.id);

      const entry = service.joinCompetition(competition.id, 'user1');
      expect(entry.user_id).toBe('user1');
      expect(entry.score).toBe(0);
    });

    it('should prevent duplicate joins', () => {
      const comp = service.createCompetition({
        tenant_id: 't1',
        name: 'Test',
        description: 'Test',
        rules: 'Rules',
        type: CompetitionType.Ongoing,
        starts_at: new Date().toISOString(),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      service.startCompetition(comp.id);
      service.joinCompetition(comp.id, 'user1');

      expect(() => service.joinCompetition(comp.id, 'user1')).toThrow('already joined');
    });
  });

  describe('scoring', () => {
    it('should update scores and recalculate rankings', () => {
      const comp = service.createCompetition({
        tenant_id: 't1',
        name: 'Test',
        description: 'Test',
        rules: 'Rules',
        type: CompetitionType.Ongoing,
        starts_at: new Date().toISOString(),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      service.startCompetition(comp.id);
      service.joinCompetition(comp.id, 'user1');
      service.joinCompetition(comp.id, 'user2');

      service.updateScore(comp.id, 'user1', 50);
      service.updateScore(comp.id, 'user2', 100);

      const leaderboard = service.getLeaderboard(comp.id);
      expect(leaderboard[0].user_id).toBe('user2');
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[1].user_id).toBe('user1');
      expect(leaderboard[1].rank).toBe(2);
    });
  });

  describe('tournaments', () => {
    it('should create a tournament bracket', () => {
      const comp = service.createCompetition({
        tenant_id: 't1',
        name: 'Tournament',
        description: 'Bracket tournament',
        rules: 'Rules',
        type: CompetitionType.Tournament,
        starts_at: new Date().toISOString(),
        scoring_model: ScoringModel.JudgeScore,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      const bracket = service.createTournament({
        competition_id: comp.id,
        format: TournamentFormat.SingleElimination,
        participant_ids: ['user1', 'user2', 'user3', 'user4'],
        participant_type: 'user',
        seeding: 'random',
      });

      expect(bracket.rounds.length).toBe(2); // 4 participants = 2 rounds
      expect(bracket.rounds[0].matches.length).toBe(2); // 2 first-round matches
      expect(bracket.rounds[1].matches.length).toBe(1); // 1 final match
    });

    it('should reject tournament creation for non-tournament competitions', () => {
      const comp = service.createCompetition({
        tenant_id: 't1',
        name: 'Sprint',
        description: 'Not a tournament',
        rules: 'Rules',
        type: CompetitionType.Sprint,
        starts_at: new Date().toISOString(),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      expect(() =>
        service.createTournament({
          competition_id: comp.id,
          format: TournamentFormat.SingleElimination,
          participant_ids: ['user1', 'user2'],
          participant_type: 'user',
          seeding: 'random',
        })
      ).toThrow('must be of type tournament');
    });
  });

  describe('lifecycle', () => {
    it('should transition through competition states', () => {
      const comp = service.createCompetition({
        tenant_id: 't1',
        name: 'Test',
        description: 'Test',
        rules: 'Rules',
        type: CompetitionType.Seasonal,
        starts_at: new Date().toISOString(),
        ends_at: futureDate(90),
        scoring_model: ScoringModel.Points,
        eligibility: Eligibility.All,
        leaderboard_visibility: LeaderboardVisibility.Public,
      });

      expect(comp.status).toBe(CompetitionStatus.Upcoming);

      const started = service.startCompetition(comp.id);
      expect(started.status).toBe(CompetitionStatus.Active);

      const completed = service.completeCompetition(comp.id);
      expect(completed.status).toBe(CompetitionStatus.Completed);
    });
  });
});
