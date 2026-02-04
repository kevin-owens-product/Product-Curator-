/**
 * Hackathon API routes.
 *
 * Endpoints for hackathon management, registration, team formation,
 * mentor support, and live event features.
 */

import { Router } from 'express';
import { HackathonService } from '../services/hackathon.service';
import { PointsService } from '../services/points.service';
import { PointAction, HackathonStatus } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createHackathonRoutes(
  hackathonService: HackathonService,
  pointsService: PointsService
): Router {
  const router = Router();

  // ─── Hackathon CRUD ────────────────────────────────────────────────────

  // Create hackathon
  router.post('/', asyncHandler(async (req, res) => {
    const hackathon = hackathonService.createHackathon(req.body);
    res.status(201).json(hackathon);
  }));

  // Get hackathon
  router.get('/:id', asyncHandler(async (req, res) => {
    const hackathon = hackathonService.getHackathon(req.params.id);
    res.json(hackathon);
  }));

  // List hackathons for a tenant
  router.get('/tenant/:tenantId', asyncHandler(async (req, res) => {
    const status = req.query.status as HackathonStatus | undefined;
    const hackathons = hackathonService.listHackathons(req.params.tenantId, status);
    res.json(hackathons);
  }));

  // Update hackathon status
  router.patch('/:id/status', asyncHandler(async (req, res) => {
    const hackathon = hackathonService.updateStatus(req.params.id, req.body.status);
    res.json(hackathon);
  }));

  // Add track
  router.post('/:id/tracks', asyncHandler(async (req, res) => {
    const track = hackathonService.addTrack(req.params.id, req.body.name, req.body.description);
    res.status(201).json(track);
  }));

  // Add prize
  router.post('/:id/prizes', asyncHandler(async (req, res) => {
    const prize = hackathonService.addPrize(req.params.id, req.body);
    res.status(201).json(prize);
  }));

  // ─── Registration ──────────────────────────────────────────────────────

  // Register for hackathon
  router.post('/:id/register', asyncHandler(async (req, res) => {
    const registration = hackathonService.register({
      hackathon_id: req.params.id,
      ...req.body,
    });
    res.status(201).json(registration);
  }));

  // Find teammates
  router.get('/:id/teammates', asyncHandler(async (req, res) => {
    const filters = {
      skills: req.query.skills ? (req.query.skills as string).split(',') : undefined,
      track_id: req.query.track_id as string | undefined,
    };
    const teammates = hackathonService.findTeammates(req.params.id, filters);
    res.json(teammates);
  }));

  // ─── Teams ─────────────────────────────────────────────────────────────

  // Create team
  router.post('/:id/teams', asyncHandler(async (req, res) => {
    const team = hackathonService.createTeam({
      hackathon_id: req.params.id,
      ...req.body,
    });
    res.status(201).json(team);
  }));

  // Join team
  router.post('/:hackathonId/teams/:teamId/join', asyncHandler(async (req, res) => {
    const team = hackathonService.joinTeam(
      req.params.hackathonId,
      req.params.teamId,
      req.body.user_id
    );
    res.json(team);
  }));

  // Get teams
  router.get('/:id/teams', asyncHandler(async (req, res) => {
    const teams = hackathonService.getTeams(req.params.id);
    res.json(teams);
  }));

  // Get specific team
  router.get('/:hackathonId/teams/:teamId', asyncHandler(async (req, res) => {
    const team = hackathonService.getTeam(req.params.teamId);
    res.json(team);
  }));

  // ─── Mentor Support ────────────────────────────────────────────────────

  // Request mentor help
  router.post('/:id/mentor-requests', asyncHandler(async (req, res) => {
    const request = hackathonService.requestMentorHelp({
      hackathon_id: req.params.id,
      ...req.body,
    });
    res.status(201).json(request);
  }));

  // Get mentor queue
  router.get('/:id/mentor-queue', asyncHandler(async (req, res) => {
    const queue = hackathonService.getMentorQueue(req.params.id);
    res.json(queue);
  }));

  // Claim mentor request
  router.post('/:id/mentor-requests/:requestId/claim', asyncHandler(async (req, res) => {
    const result = hackathonService.claimMentorRequest(
      req.params.requestId,
      req.body.mentor_id
    );

    // Award mentor points
    pointsService.awardPoints({
      user_id: req.body.mentor_id,
      tenant_id: req.body.tenant_id,
      action: PointAction.HelpAsMentor,
      source_type: 'hackathon',
      source_id: req.params.id,
    });

    res.json(result);
  }));

  // Complete mentor request
  router.post('/:id/mentor-requests/:requestId/complete', asyncHandler(async (req, res) => {
    const result = hackathonService.completeMentorRequest(
      req.params.requestId,
      req.body.rating
    );
    res.json(result);
  }));

  // ─── Live Dashboard ────────────────────────────────────────────────────

  // Get live stats
  router.get('/:id/live-stats', asyncHandler(async (req, res) => {
    const stats = hackathonService.getLiveStats(req.params.id);
    res.json(stats);
  }));

  return router;
}
