import { ChallengeService } from '../src/services/challenge.service';
import { ChallengeType, Difficulty, ChallengeStatus, RewardType, SubmissionStatus } from '../src/models/types';
import { CreateChallengeRequest } from '../src/models/challenge';

describe('ChallengeService', () => {
  let service: ChallengeService;

  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const validRequest: CreateChallengeRequest = {
    tenant_id: 'tenant1',
    title: 'Reduce Dashboard Load Time',
    problem_statement: 'Dashboard takes 30+ seconds to load',
    context: 'Users are complaining',
    success_criteria: 'Under 3 seconds',
    type: ChallengeType.TechnicalDebt,
    difficulty: Difficulty.Advanced,
    tags: ['performance', 'frontend'],
    opens_at: futureDate(1),
    closes_at: futureDate(30),
    judging_ends_at: futureDate(45),
    sponsor_id: 'sponsor1',
    created_by: 'admin1',
    judges: ['judge1', 'judge2'],
    reward_type: RewardType.Points,
    reward_description: '500 points',
    points_value: 500,
  };

  beforeEach(() => {
    service = new ChallengeService();
  });

  describe('createChallenge', () => {
    it('should create a challenge in draft status', () => {
      const challenge = service.createChallenge(validRequest);

      expect(challenge.id).toBeDefined();
      expect(challenge.title).toBe('Reduce Dashboard Load Time');
      expect(challenge.status).toBe(ChallengeStatus.Draft);
      expect(challenge.total_submissions).toBe(0);
    });

    it('should reject missing required fields', () => {
      expect(() =>
        service.createChallenge({ ...validRequest, title: '' })
      ).toThrow('title is required');
    });

    it('should validate date ranges', () => {
      expect(() =>
        service.createChallenge({
          ...validRequest,
          opens_at: futureDate(30),
          closes_at: futureDate(1),
        })
      ).toThrow('opens_at must be before closes_at');
    });
  });

  describe('publishChallenge', () => {
    it('should publish a draft challenge', () => {
      const challenge = service.createChallenge(validRequest);
      const published = service.publishChallenge(challenge.id);
      expect(published.status).toBe(ChallengeStatus.Open);
    });

    it('should reject publishing non-draft challenges', () => {
      const challenge = service.createChallenge(validRequest);
      service.publishChallenge(challenge.id);
      expect(() => service.publishChallenge(challenge.id)).toThrow();
    });
  });

  describe('discoverChallenges', () => {
    it('should filter by status', () => {
      const c1 = service.createChallenge(validRequest);
      service.publishChallenge(c1.id);
      service.createChallenge({ ...validRequest, title: 'Draft Challenge' });

      const result = service.discoverChallenges({ status: ChallengeStatus.Open });
      expect(result.challenges.length).toBe(1);
      expect(result.challenges[0].title).toBe('Reduce Dashboard Load Time');
    });

    it('should filter by difficulty', () => {
      const c1 = service.createChallenge(validRequest);
      service.publishChallenge(c1.id);
      const c2 = service.createChallenge({ ...validRequest, difficulty: Difficulty.Starter });
      service.publishChallenge(c2.id);

      const result = service.discoverChallenges({ status: ChallengeStatus.Open, difficulty: Difficulty.Advanced });
      expect(result.challenges.length).toBe(1);
    });

    it('should search by keyword', () => {
      const c1 = service.createChallenge(validRequest);
      service.publishChallenge(c1.id);

      const result = service.discoverChallenges({ status: ChallengeStatus.Open, search: 'dashboard' });
      expect(result.challenges.length).toBe(1);
    });

    it('should paginate results', () => {
      for (let i = 0; i < 5; i++) {
        const c = service.createChallenge({ ...validRequest, title: `Challenge ${i}` });
        service.publishChallenge(c.id);
      }

      const result = service.discoverChallenges({ status: ChallengeStatus.Open, limit: 2, offset: 0 });
      expect(result.challenges.length).toBe(2);
      expect(result.total).toBe(5);
    });
  });

  describe('submissions', () => {
    it('should submit to an open challenge', () => {
      const challenge = service.createChallenge(validRequest);
      service.publishChallenge(challenge.id);

      const submission = service.submitToChallenge({
        challenge_id: challenge.id,
        creation_id: 'creation1',
        submitted_by: 'user1',
        solution_summary: 'Implemented caching layer',
      });

      expect(submission.id).toBeDefined();
      expect(submission.status).toBe(SubmissionStatus.Submitted);
    });

    it('should reject submission to non-open challenge', () => {
      const challenge = service.createChallenge(validRequest);

      expect(() =>
        service.submitToChallenge({
          challenge_id: challenge.id,
          creation_id: 'creation1',
          submitted_by: 'user1',
          solution_summary: 'My solution',
        })
      ).toThrow('Challenge is not open for submissions');
    });
  });

  describe('judging', () => {
    it('should score a submission', () => {
      const challenge = service.createChallenge(validRequest);
      service.publishChallenge(challenge.id);

      const submission = service.submitToChallenge({
        challenge_id: challenge.id,
        creation_id: 'creation1',
        submitted_by: 'user1',
        solution_summary: 'My solution',
      });

      service.startJudging(challenge.id);

      const score = service.scoreSubmission({
        submission_id: submission.id,
        judge_id: 'judge1',
        criteria_scores: { innovation: 8, feasibility: 7, impact: 9, presentation: 8 },
        feedback: 'Good work',
      });

      expect(score.overall_score).toBe(8); // (8+7+9+8)/4
    });

    it('should prevent self-judging', () => {
      const challenge = service.createChallenge({
        ...validRequest,
        judges: ['user1', 'judge2'],
      });
      service.publishChallenge(challenge.id);

      const submission = service.submitToChallenge({
        challenge_id: challenge.id,
        creation_id: 'creation1',
        submitted_by: 'user1',
        solution_summary: 'My solution',
      });

      service.startJudging(challenge.id);

      expect(() =>
        service.scoreSubmission({
          submission_id: submission.id,
          judge_id: 'user1',
          criteria_scores: { innovation: 10, feasibility: 10, impact: 10, presentation: 10 },
          feedback: 'Perfect',
        })
      ).toThrow('Judges cannot score their own submissions');
    });

    it('should select winners and complete challenge', () => {
      const challenge = service.createChallenge(validRequest);
      service.publishChallenge(challenge.id);

      const sub1 = service.submitToChallenge({
        challenge_id: challenge.id,
        creation_id: 'c1',
        submitted_by: 'user1',
        solution_summary: 'Solution 1',
      });

      const sub2 = service.submitToChallenge({
        challenge_id: challenge.id,
        creation_id: 'c2',
        submitted_by: 'user2',
        solution_summary: 'Solution 2',
      });

      service.startJudging(challenge.id);

      const completed = service.selectWinners(challenge.id, [
        { submission_id: sub1.id, status: SubmissionStatus.Winner },
        { submission_id: sub2.id, status: SubmissionStatus.RunnerUp },
      ]);

      expect(completed.status).toBe(ChallengeStatus.Completed);

      const s1 = service.getSubmission(sub1.id);
      const s2 = service.getSubmission(sub2.id);
      expect(s1.status).toBe(SubmissionStatus.Winner);
      expect(s2.status).toBe(SubmissionStatus.RunnerUp);
    });
  });
});
