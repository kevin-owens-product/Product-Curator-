/**
 * Challenge Service
 *
 * Manages the full lifecycle of challenges: creation, discovery,
 * submission, judging, scoring, and winner announcement.
 */

import { v4 as uuid } from 'uuid';
import {
  Challenge,
  ChallengeSubmission,
  JudgeScore,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  SubmitToChallengeRequest,
  ScoreSubmissionRequest,
  ChallengeFilterOptions,
} from '../models/challenge';
import { ChallengeStatus, SubmissionStatus } from '../models/types';
import { InMemoryStore } from '../utils/store';
import {
  NotFoundError,
  ValidationError,
  DeadlinePassedError,
  ForbiddenError,
} from '../utils/errors';
import { requireFields, validateDateRange, validateScoreRange, isBeforeDeadline } from '../utils/validation';

export class ChallengeService {
  private challenges = new InMemoryStore<Challenge>();
  private submissions = new InMemoryStore<ChallengeSubmission>();
  private judgeScores = new InMemoryStore<JudgeScore>();

  /**
   * Create a new challenge.
   */
  createChallenge(request: CreateChallengeRequest): Challenge {
    requireFields({
      title: request.title,
      problem_statement: request.problem_statement,
      success_criteria: request.success_criteria,
      opens_at: request.opens_at,
      closes_at: request.closes_at,
      sponsor_id: request.sponsor_id,
    });

    validateDateRange(request.opens_at, request.closes_at, ['opens_at', 'closes_at']);
    validateDateRange(request.closes_at, request.judging_ends_at, ['closes_at', 'judging_ends_at']);

    const challenge: Challenge = {
      id: uuid(),
      tenant_id: request.tenant_id,
      workspace_id: request.workspace_id || null,
      title: request.title,
      problem_statement: request.problem_statement,
      context: request.context,
      success_criteria: request.success_criteria,
      type: request.type,
      difficulty: request.difficulty,
      tags: request.tags || [],
      status: ChallengeStatus.Draft,
      opens_at: request.opens_at,
      closes_at: request.closes_at,
      judging_ends_at: request.judging_ends_at,
      sponsor_id: request.sponsor_id,
      created_by: request.created_by,
      judges: request.judges,
      reward_type: request.reward_type,
      reward_description: request.reward_description,
      points_value: request.points_value,
      winning_submissions: [],
      total_submissions: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.challenges.create(challenge);
  }

  /**
   * Get a challenge by ID.
   */
  getChallenge(challengeId: string): Challenge {
    const challenge = this.challenges.getById(challengeId);
    if (!challenge) throw new NotFoundError('Challenge', challengeId);
    return challenge;
  }

  /**
   * Update a challenge.
   */
  updateChallenge(challengeId: string, updates: UpdateChallengeRequest): Challenge {
    const challenge = this.getChallenge(challengeId);

    if (challenge.status === ChallengeStatus.Completed) {
      throw new ValidationError('Cannot update a completed challenge');
    }

    const updated = this.challenges.update(challengeId, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError('Challenge', challengeId);
    return updated;
  }

  /**
   * Publish a draft challenge (set to open).
   */
  publishChallenge(challengeId: string): Challenge {
    const challenge = this.getChallenge(challengeId);
    if (challenge.status !== ChallengeStatus.Draft) {
      throw new ValidationError('Only draft challenges can be published');
    }
    return this.updateChallenge(challengeId, { status: ChallengeStatus.Open });
  }

  /**
   * Discover challenges with filtering, sorting, and pagination.
   */
  discoverChallenges(filters: ChallengeFilterOptions): { challenges: Challenge[]; total: number } {
    let results = this.challenges.getAll();

    // Apply filters
    if (filters.type) {
      results = results.filter(c => c.type === filters.type);
    }
    if (filters.difficulty) {
      results = results.filter(c => c.difficulty === filters.difficulty);
    }
    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    } else {
      // Default: only show open challenges
      results = results.filter(c => c.status === ChallengeStatus.Open);
    }
    if (filters.workspace_id) {
      results = results.filter(c => c.workspace_id === null || c.workspace_id === filters.workspace_id);
    }
    if (filters.reward_type) {
      results = results.filter(c => c.reward_type === filters.reward_type);
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(c => filters.tags!.some(t => c.tags.includes(t)));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(
        c => c.title.toLowerCase().includes(search) || c.problem_statement.toLowerCase().includes(search)
      );
    }

    // Sort
    switch (filters.sort_by) {
      case 'closing_soon':
        results.sort((a, b) => new Date(a.closes_at).getTime() - new Date(b.closes_at).getTime());
        break;
      case 'most_submissions':
        results.sort((a, b) => b.total_submissions - a.total_submissions);
        break;
      case 'highest_reward':
        results.sort((a, b) => b.points_value - a.points_value);
        break;
      case 'newest':
      default:
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    const total = results.length;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    results = results.slice(offset, offset + limit);

    return { challenges: results, total };
  }

  /**
   * Submit a solution to a challenge.
   */
  submitToChallenge(request: SubmitToChallengeRequest): ChallengeSubmission {
    const challenge = this.getChallenge(request.challenge_id);

    if (challenge.status !== ChallengeStatus.Open) {
      throw new ValidationError('Challenge is not open for submissions');
    }
    if (!isBeforeDeadline(challenge.closes_at)) {
      throw new DeadlinePassedError('challenge submissions');
    }

    requireFields({
      creation_id: request.creation_id,
      solution_summary: request.solution_summary,
    });

    const submission: ChallengeSubmission = {
      id: uuid(),
      challenge_id: request.challenge_id,
      creation_id: request.creation_id,
      submitted_by: request.submitted_by,
      team_members: request.team_members || [],
      solution_summary: request.solution_summary,
      demo_url: request.demo_url || null,
      presentation_url: request.presentation_url || null,
      status: SubmissionStatus.Submitted,
      judge_scores: [],
      average_score: 0,
      judge_feedback: null,
      submitted_at: new Date().toISOString(),
    };

    this.submissions.create(submission);

    // Update challenge submission count
    this.challenges.update(request.challenge_id, {
      total_submissions: challenge.total_submissions + 1,
    });

    return submission;
  }

  /**
   * Get all submissions for a challenge.
   */
  getChallengeSubmissions(challengeId: string): ChallengeSubmission[] {
    return this.submissions.find(s => s.challenge_id === challengeId);
  }

  /**
   * Get a specific submission.
   */
  getSubmission(submissionId: string): ChallengeSubmission {
    const submission = this.submissions.getById(submissionId);
    if (!submission) throw new NotFoundError('ChallengeSubmission', submissionId);
    return submission;
  }

  /**
   * Score a submission as a judge.
   */
  scoreSubmission(request: ScoreSubmissionRequest): JudgeScore {
    const submission = this.getSubmission(request.submission_id);
    const challenge = this.getChallenge(submission.challenge_id);

    // Verify judge is authorized
    if (!challenge.judges.includes(request.judge_id)) {
      throw new ForbiddenError('User is not a judge for this challenge');
    }

    // Verify no self-judging
    if (request.judge_id === submission.submitted_by) {
      throw new ForbiddenError('Judges cannot score their own submissions');
    }

    // Validate scores
    for (const [criterion, score] of Object.entries(request.criteria_scores)) {
      validateScoreRange(score, 1, 10, criterion);
    }

    const { innovation, feasibility, impact, presentation } = request.criteria_scores;
    const overallScore = (innovation + feasibility + impact + presentation) / 4;

    const judgeScore: JudgeScore = {
      id: uuid(),
      submission_id: request.submission_id,
      judge_id: request.judge_id,
      criteria_scores: request.criteria_scores,
      overall_score: overallScore,
      feedback: request.feedback,
      scored_at: new Date().toISOString(),
    };

    this.judgeScores.create(judgeScore);

    // Update submission with new score
    const allScores = this.judgeScores.find(js => js.submission_id === request.submission_id);
    const avgScore = allScores.reduce((sum, s) => sum + s.overall_score, 0) / allScores.length;

    this.submissions.update(request.submission_id, {
      judge_scores: allScores,
      average_score: Math.round(avgScore * 100) / 100,
      status: SubmissionStatus.UnderReview,
    });

    return judgeScore;
  }

  /**
   * Move challenge to judging phase.
   */
  startJudging(challengeId: string): Challenge {
    const challenge = this.getChallenge(challengeId);
    if (challenge.status !== ChallengeStatus.Open) {
      throw new ValidationError('Only open challenges can move to judging');
    }
    return this.updateChallenge(challengeId, { status: ChallengeStatus.Judging });
  }

  /**
   * Select winners for a challenge.
   */
  selectWinners(
    challengeId: string,
    winners: { submission_id: string; status: SubmissionStatus }[]
  ): Challenge {
    const challenge = this.getChallenge(challengeId);
    if (challenge.status !== ChallengeStatus.Judging) {
      throw new ValidationError('Challenge must be in judging phase to select winners');
    }

    const winningIds: string[] = [];

    for (const winner of winners) {
      const submission = this.getSubmission(winner.submission_id);
      if (submission.challenge_id !== challengeId) {
        throw new ValidationError(`Submission ${winner.submission_id} does not belong to this challenge`);
      }

      this.submissions.update(winner.submission_id, { status: winner.status });

      if (
        winner.status === SubmissionStatus.Winner ||
        winner.status === SubmissionStatus.RunnerUp ||
        winner.status === SubmissionStatus.HonorableMention
      ) {
        winningIds.push(winner.submission_id);
      }
    }

    // Mark non-winning submissions
    const allSubmissions = this.getChallengeSubmissions(challengeId);
    for (const sub of allSubmissions) {
      if (!winners.find(w => w.submission_id === sub.id)) {
        this.submissions.update(sub.id, { status: SubmissionStatus.NotSelected });
      }
    }

    return this.updateChallenge(challengeId, {
      status: ChallengeStatus.Completed,
    });
  }

  /**
   * Cancel a challenge.
   */
  cancelChallenge(challengeId: string): Challenge {
    return this.updateChallenge(challengeId, { status: ChallengeStatus.Canceled });
  }

  /**
   * Get challenges closing soon.
   */
  getClosingSoon(tenantId: string, days: number = 7): Challenge[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return this.challenges
      .find(
        c =>
          c.tenant_id === tenantId &&
          c.status === ChallengeStatus.Open &&
          new Date(c.closes_at) <= cutoff &&
          new Date(c.closes_at) > new Date()
      )
      .sort((a, b) => new Date(a.closes_at).getTime() - new Date(b.closes_at).getTime());
  }
}
