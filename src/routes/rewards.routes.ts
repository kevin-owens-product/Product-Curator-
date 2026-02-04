/**
 * Rewards & Recognition API routes.
 *
 * Endpoints for the rewards store, claiming rewards, and fulfillment.
 */

import { Router } from 'express';
import { RewardService } from '../services/reward.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createRewardRoutes(rewardService: RewardService): Router {
  const router = Router();

  // ─── Reward Store ──────────────────────────────────────────────────────

  // Create reward
  router.post('/', asyncHandler(async (req, res) => {
    const reward = rewardService.createReward(req.body);
    res.status(201).json(reward);
  }));

  // Get reward
  router.get('/:id', asyncHandler(async (req, res) => {
    const reward = rewardService.getReward(req.params.id);
    res.json(reward);
  }));

  // Browse rewards store
  router.get('/', asyncHandler(async (req, res) => {
    const query = {
      tenant_id: req.query.tenant_id as string,
      type: req.query.type as any,
      max_cost: req.query.max_cost ? parseInt(req.query.max_cost as string) : undefined,
      featured_only: req.query.featured_only === 'true',
      available_only: req.query.available_only !== 'false', // default true
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = rewardService.browseRewards(query);
    res.json(result);
  }));

  // Deactivate reward
  router.post('/:id/deactivate', asyncHandler(async (req, res) => {
    const reward = rewardService.deactivateReward(req.params.id);
    res.json(reward);
  }));

  // ─── Claims ────────────────────────────────────────────────────────────

  // Claim reward
  router.post('/claim', asyncHandler(async (req, res) => {
    const claim = rewardService.claimReward(req.body);
    res.status(201).json(claim);
  }));

  // Get user's claims
  router.get('/claims/user/:userId', asyncHandler(async (req, res) => {
    const claims = rewardService.getUserClaims(req.params.userId);
    res.json(claims);
  }));

  // Get pending claims (admin)
  router.get('/claims/pending/:tenantId', asyncHandler(async (req, res) => {
    const claims = rewardService.getPendingClaims(req.params.tenantId);
    res.json(claims);
  }));

  // Fulfill claim (admin)
  router.post('/claims/:claimId/fulfill', asyncHandler(async (req, res) => {
    const claim = rewardService.fulfillClaim(req.params.claimId, req.body.notes);
    res.json(claim);
  }));

  return router;
}
