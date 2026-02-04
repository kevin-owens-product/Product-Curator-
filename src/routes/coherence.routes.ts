/**
 * Coherence Dashboard API routes.
 */

import { Router } from 'express';
import { CoherenceService } from '../services/coherence.service';
import { PointsService } from '../services/points.service';
import { PointAction } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createCoherenceRoutes(
  coherenceService: CoherenceService,
  pointsService: PointsService
): Router {
  const router = Router();

  // Create pattern
  router.post('/patterns', asyncHandler(async (req, res) => {
    const pattern = coherenceService.createPattern(req.body);
    res.status(201).json(pattern);
  }));

  // Get patterns
  router.get('/patterns/:tenantId', asyncHandler(async (req, res) => {
    const patterns = coherenceService.getPatterns(req.params.tenantId, req.query.category as string);
    res.json(patterns);
  }));

  // Deprecate pattern
  router.post('/patterns/:id/deprecate', asyncHandler(async (req, res) => {
    const pattern = coherenceService.deprecatePattern(req.params.id);
    res.json(pattern);
  }));

  // Flag coherence issue
  router.post('/flags', asyncHandler(async (req, res) => {
    const flag = coherenceService.flagCoherenceIssue(req.body);
    res.status(201).json(flag);
  }));

  // Resolve flag
  router.post('/flags/:id/resolve', asyncHandler(async (req, res) => {
    const flag = coherenceService.resolveFlag(req.params.id, req.body.status, req.body.notes);
    // Award points if confirmed
    if (req.body.award_points && req.body.flagged_by) {
      pointsService.awardPoints({
        user_id: req.body.flagged_by,
        tenant_id: req.body.tenant_id || '',
        action: PointAction.FlagConfirmedCoherenceIssue,
        source_type: 'coherence_flag',
        source_id: flag.id,
      });
    }
    res.json(flag);
  }));

  // Get open flags
  router.get('/flags', asyncHandler(async (req, res) => {
    const flags = coherenceService.getOpenFlags(req.query.tenant_id as string);
    res.json(flags);
  }));

  // Coherence score
  router.get('/score/:tenantId', asyncHandler(async (req, res) => {
    const score = coherenceService.computeCoherenceScore(req.params.tenantId);
    res.json(score);
  }));

  return router;
}
