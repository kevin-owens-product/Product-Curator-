/**
 * Gamification API routes.
 *
 * Endpoints for points, badges, streaks, levels, leaderboards,
 * user profiles, and analytics.
 */

import { Router } from 'express';
import { PointsService } from '../services/points.service';
import { BadgeService } from '../services/badge.service';
import { StreakService } from '../services/streak.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { AntiGamingService } from '../services/antigaming.service';
import { LeaderboardScope, LeaderboardMetric } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createGamificationRoutes(
  pointsService: PointsService,
  badgeService: BadgeService,
  streakService: StreakService,
  leaderboardService: LeaderboardService,
  antiGamingService: AntiGamingService
): Router {
  const router = Router();

  // ─── Points ────────────────────────────────────────────────────────────

  // Award points
  router.post('/points/award', asyncHandler(async (req, res) => {
    // Check rate limits and anti-gaming
    const multiplier = antiGamingService.checkAction(req.body.user_id, req.body.action);
    if (multiplier === 0) {
      res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Daily limit reached for this action' } });
      return;
    }

    const overridePoints = req.body.override_points
      ? Math.round(req.body.override_points * multiplier)
      : undefined;

    const transaction = pointsService.awardPoints({
      ...req.body,
      override_points: overridePoints,
    });

    // Record for anti-gaming
    antiGamingService.recordAction(req.body.user_id, req.body.action);

    // Update streaks
    streakService.recordActivity(req.body.user_id, req.body.action);

    res.status(201).json(transaction);
  }));

  // Get user points
  router.get('/points/:userId', asyncHandler(async (req, res) => {
    const points = pointsService.getUserPoints(req.params.userId);
    const levelInfo = pointsService.calculateLevel(points.total_points);
    res.json({ ...points, ...levelInfo });
  }));

  // Get point transaction history
  router.get('/points/:userId/history', asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const history = pointsService.getTransactionHistory(req.params.userId, limit, offset);
    res.json(history);
  }));

  // Get user rank
  router.get('/points/:userId/rank', asyncHandler(async (req, res) => {
    const rank = pointsService.getUserRank(req.params.userId);
    res.json({ user_id: req.params.userId, rank });
  }));

  // ─── Levels ────────────────────────────────────────────────────────────

  // Get all levels
  router.get('/levels', asyncHandler(async (req, res) => {
    const levels = pointsService.getLevels();
    res.json(levels);
  }));

  // ─── Badges ────────────────────────────────────────────────────────────

  // Get all badges
  router.get('/badges', asyncHandler(async (req, res) => {
    const badges = badgeService.getAllBadges({
      rarity: req.query.rarity as any,
      tenant_id: req.query.tenant_id as string,
    });
    res.json(badges);
  }));

  // Get badge by ID
  router.get('/badges/:id', asyncHandler(async (req, res) => {
    const badge = badgeService.getBadge(req.params.id);
    res.json(badge);
  }));

  // Create custom badge
  router.post('/badges', asyncHandler(async (req, res) => {
    const badge = badgeService.createBadge(req.body);
    res.status(201).json(badge);
  }));

  // Get user's badges
  router.get('/badges/user/:userId', asyncHandler(async (req, res) => {
    const badges = badgeService.getUserBadges(req.params.userId);
    res.json(badges);
  }));

  // Award badge to user
  router.post('/badges/award', asyncHandler(async (req, res) => {
    const userBadge = badgeService.awardBadge(
      req.body.user_id,
      req.body.badge_id,
      req.body.trigger_event
    );
    res.status(201).json(userBadge);
  }));

  // Evaluate badges for user
  router.post('/badges/evaluate', asyncHandler(async (req, res) => {
    const newBadges = badgeService.evaluateAndAwardBadges(req.body);
    res.json(newBadges);
  }));

  // Get badge count by rarity
  router.get('/badges/user/:userId/rarity-counts', asyncHandler(async (req, res) => {
    const counts = badgeService.getUserBadgeCountByRarity(req.params.userId);
    res.json(counts);
  }));

  // ─── Streaks ───────────────────────────────────────────────────────────

  // Get user's streaks
  router.get('/streaks/:userId', asyncHandler(async (req, res) => {
    const streaks = streakService.getUserStreaks(req.params.userId);
    res.json(streaks);
  }));

  // Get streak leaders
  router.get('/streaks/leaders/:streakType', asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leaders = streakService.getStreakLeaders(req.params.streakType as any, limit);
    res.json(leaders);
  }));

  // ─── Leaderboards ─────────────────────────────────────────────────────

  // Get leaderboard
  router.get('/leaderboards', asyncHandler(async (req, res) => {
    const result = leaderboardService.getLeaderboard({
      tenant_id: req.query.tenant_id as string,
      workspace_id: req.query.workspace_id as string,
      scope: (req.query.scope as LeaderboardScope) || LeaderboardScope.AllTime,
      metric: (req.query.metric as LeaderboardMetric) || LeaderboardMetric.Points,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      user_id: req.query.user_id as string,
    });
    res.json(result);
  }));

  // Get leaderboard definitions
  router.get('/leaderboards/definitions', asyncHandler(async (req, res) => {
    const definitions = leaderboardService.getLeaderboardDefinitions();
    res.json(definitions);
  }));

  // ─── Profile ───────────────────────────────────────────────────────────

  // Get user gamification profile
  router.get('/profile/:userId', asyncHandler(async (req, res) => {
    const tenantId = req.query.tenant_id as string || 'default';
    const profile = leaderboardService.getUserProfile(req.params.userId, tenantId);
    res.json(profile);
  }));

  // Register user display name
  router.post('/profile/register', asyncHandler(async (req, res) => {
    leaderboardService.registerUser(req.body.user_id, req.body.display_name);
    res.status(200).json({ success: true });
  }));

  // ─── Analytics ─────────────────────────────────────────────────────────

  // Get engagement metrics
  router.get('/analytics/engagement/:tenantId', asyncHandler(async (req, res) => {
    const metrics = leaderboardService.getEngagementMetrics(req.params.tenantId);
    res.json(metrics);
  }));

  // Get analytics summary
  router.get('/analytics/summary/:tenantId', asyncHandler(async (req, res) => {
    const analytics = leaderboardService.getAnalytics(req.params.tenantId);
    res.json(analytics);
  }));

  // ─── Anti-Gaming (Admin) ───────────────────────────────────────────────

  // Get pending flags
  router.get('/moderation/flags', asyncHandler(async (req, res) => {
    const flags = antiGamingService.getPendingFlags();
    res.json(flags);
  }));

  // Review flag
  router.post('/moderation/flags/:flagId/review', asyncHandler(async (req, res) => {
    const flag = antiGamingService.reviewFlag(
      req.params.flagId,
      req.body.reviewer_id,
      req.body.status,
      req.body.action_taken
    );
    res.json(flag);
  }));

  // Suspend user
  router.post('/moderation/suspend', asyncHandler(async (req, res) => {
    const action = antiGamingService.suspendUser(
      req.body.user_id,
      req.body.reason,
      req.body.performed_by
    );
    res.json(action);
  }));

  // Unsuspend user
  router.post('/moderation/unsuspend', asyncHandler(async (req, res) => {
    antiGamingService.unsuspendUser(req.body.user_id);
    res.json({ success: true });
  }));

  // Get moderation history
  router.get('/moderation/history/:userId', asyncHandler(async (req, res) => {
    const history = antiGamingService.getModerationHistory(req.params.userId);
    res.json(history);
  }));

  return router;
}
