/**
 * Challenge API routes.
 *
 * Endpoints for challenge CRUD, discovery, submission, judging, and results.
 */

import { Router } from 'express';
import { ChallengeService } from '../services/challenge.service';
import { PointsService } from '../services/points.service';
import { PointAction, SubmissionStatus } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createChallengeRoutes(
  challengeService: ChallengeService,
  pointsService: PointsService
): Router {
  const router = Router();

  // ─── Challenge CRUD ────────────────────────────────────────────────────

  // Create challenge
  router.post('/', asyncHandler(async (req, res) => {
    const challenge = challengeService.createChallenge(req.body);
    res.status(201).json(challenge);
  }));

  // Get challenge by ID
  router.get('/:id', asyncHandler(async (req, res) => {
    const challenge = challengeService.getChallenge(req.params.id);
    res.json(challenge);
  }));

  // Update challenge
  router.patch('/:id', asyncHandler(async (req, res) => {
    const challenge = challengeService.updateChallenge(req.params.id, req.body);
    res.json(challenge);
  }));

  // Publish challenge
  router.post('/:id/publish', asyncHandler(async (req, res) => {
    const challenge = challengeService.publishChallenge(req.params.id);
    res.json(challenge);
  }));

  // Cancel challenge
  router.post('/:id/cancel', asyncHandler(async (req, res) => {
    const challenge = challengeService.cancelChallenge(req.params.id);
    res.json(challenge);
  }));

  // ─── Discovery ─────────────────────────────────────────────────────────

  // Discover challenges
  router.get('/', asyncHandler(async (req, res) => {
    const filters = {
      type: req.query.type as any,
      difficulty: req.query.difficulty as any,
      status: req.query.status as any,
      workspace_id: req.query.workspace_id as string,
      reward_type: req.query.reward_type as any,
      search: req.query.search as string,
      sort_by: req.query.sort_by as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = challengeService.discoverChallenges(filters);
    res.json(result);
  }));

  // Get challenges closing soon
  router.get('/closing-soon/:tenantId', asyncHandler(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const challenges = challengeService.getClosingSoon(req.params.tenantId, days);
    res.json(challenges);
  }));

  // ─── Submissions ───────────────────────────────────────────────────────

  // Submit to challenge
  router.post('/:id/submissions', asyncHandler(async (req, res) => {
    const submission = challengeService.submitToChallenge({
      challenge_id: req.params.id,
      ...req.body,
    });

    // Award points for submission
    pointsService.awardPoints({
      user_id: req.body.submitted_by,
      tenant_id: req.body.tenant_id,
      action: PointAction.SubmitToChallenge,
      source_type: 'challenge',
      source_id: req.params.id,
    });

    res.status(201).json(submission);
  }));

  // Get challenge submissions
  router.get('/:id/submissions', asyncHandler(async (req, res) => {
    const submissions = challengeService.getChallengeSubmissions(req.params.id);
    res.json(submissions);
  }));

  // Get specific submission
  router.get('/:challengeId/submissions/:submissionId', asyncHandler(async (req, res) => {
    const submission = challengeService.getSubmission(req.params.submissionId);
    res.json(submission);
  }));

  // ─── Judging ───────────────────────────────────────────────────────────

  // Start judging phase
  router.post('/:id/judging/start', asyncHandler(async (req, res) => {
    const challenge = challengeService.startJudging(req.params.id);
    res.json(challenge);
  }));

  // Score a submission
  router.post('/:challengeId/submissions/:submissionId/score', asyncHandler(async (req, res) => {
    const score = challengeService.scoreSubmission({
      submission_id: req.params.submissionId,
      ...req.body,
    });
    res.status(201).json(score);
  }));

  // Select winners
  router.post('/:id/winners', asyncHandler(async (req, res) => {
    const challenge = challengeService.selectWinners(req.params.id, req.body.winners);

    // Award points to winners
    for (const winner of req.body.winners) {
      const submission = challengeService.getSubmission(winner.submission_id);
      let action: PointAction;
      if (winner.status === SubmissionStatus.Winner) {
        action = PointAction.WinChallenge;
      } else if (winner.status === SubmissionStatus.RunnerUp) {
        action = PointAction.RunnerUp;
      } else if (winner.status === SubmissionStatus.HonorableMention) {
        action = PointAction.HonorableMention;
      } else {
        continue;
      }

      pointsService.awardPoints({
        user_id: submission.submitted_by,
        tenant_id: req.body.tenant_id,
        action,
        source_type: 'challenge',
        source_id: req.params.id,
      });
    }

    res.json(challenge);
  }));

  return router;
}
