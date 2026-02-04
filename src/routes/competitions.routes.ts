/**
 * Competition API routes.
 *
 * Endpoints for competition management, sprints, tournaments,
 * and competition leaderboards.
 */

import { Router } from 'express';
import { CompetitionService } from '../services/competition.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createCompetitionRoutes(competitionService: CompetitionService): Router {
  const router = Router();

  // ─── Competition CRUD ──────────────────────────────────────────────────

  // Create competition
  router.post('/', asyncHandler(async (req, res) => {
    const competition = competitionService.createCompetition(req.body);
    res.status(201).json(competition);
  }));

  // Create sprint
  router.post('/sprints', asyncHandler(async (req, res) => {
    const sprint = competitionService.createSprint(req.body);
    res.status(201).json(sprint);
  }));

  // Get competition
  router.get('/:id', asyncHandler(async (req, res) => {
    const competition = competitionService.getCompetition(req.params.id);
    res.json(competition);
  }));

  // Discover competitions
  router.get('/', asyncHandler(async (req, res) => {
    const filters = {
      type: req.query.type as any,
      status: req.query.status as any,
      search: req.query.search as string,
      sort_by: req.query.sort_by as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = competitionService.discoverCompetitions(filters);
    res.json(result);
  }));

  // Start competition
  router.post('/:id/start', asyncHandler(async (req, res) => {
    const competition = competitionService.startCompetition(req.params.id);
    res.json(competition);
  }));

  // Complete competition
  router.post('/:id/complete', asyncHandler(async (req, res) => {
    const competition = competitionService.completeCompetition(req.params.id);
    res.json(competition);
  }));

  // ─── Participation ─────────────────────────────────────────────────────

  // Join competition
  router.post('/:id/join', asyncHandler(async (req, res) => {
    const entry = competitionService.joinCompetition(req.params.id, req.body.user_id);
    res.status(201).json(entry);
  }));

  // Update score
  router.post('/:id/score', asyncHandler(async (req, res) => {
    const entry = competitionService.updateScore(
      req.params.id,
      req.body.user_id,
      req.body.score_increment,
      req.body.metadata
    );
    res.json(entry);
  }));

  // Get user entry
  router.get('/:id/entry/:userId', asyncHandler(async (req, res) => {
    const entry = competitionService.getUserEntry(req.params.id, req.params.userId);
    res.json(entry);
  }));

  // Get leaderboard
  router.get('/:id/leaderboard', asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const entries = competitionService.getLeaderboard(req.params.id, limit, offset);
    res.json(entries);
  }));

  // ─── Tournaments ───────────────────────────────────────────────────────

  // Create tournament bracket
  router.post('/:id/tournament', asyncHandler(async (req, res) => {
    const bracket = competitionService.createTournament({
      competition_id: req.params.id,
      ...req.body,
    });
    res.status(201).json(bracket);
  }));

  // Get bracket
  router.get('/:id/bracket', asyncHandler(async (req, res) => {
    const bracket = competitionService.getBracket(req.params.id);
    res.json(bracket);
  }));

  // Record match result
  router.post('/:id/matches/:matchId/result', asyncHandler(async (req, res) => {
    const match = competitionService.recordMatchResult(
      req.params.matchId,
      req.body.winner_id,
      req.body.score_a,
      req.body.score_b
    );
    res.json(match);
  }));

  return router;
}
