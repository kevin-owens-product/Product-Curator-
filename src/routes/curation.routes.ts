/**
 * Curation Workflow API routes.
 */

import { Router } from 'express';
import { CurationService } from '../services/curation.service';
import { PointsService } from '../services/points.service';
import { PointAction } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createCurationRoutes(
  curationService: CurationService,
  pointsService: PointsService
): Router {
  const router = Router();

  // Submit for curation
  router.post('/submissions', asyncHandler(async (req, res) => {
    const submission = curationService.submitForCuration(req.body);
    pointsService.awardPoints({
      user_id: req.body.submitted_by,
      tenant_id: req.body.tenant_id || '',
      action: PointAction.SubmitForCuration,
      source_type: 'curation_submission',
      source_id: submission.id,
    });
    res.status(201).json(submission);
  }));

  // Get submission
  router.get('/submissions/:id', asyncHandler(async (req, res) => {
    const submission = curationService.getSubmission(req.params.id);
    res.json(submission);
  }));

  // Get curation queue
  router.get('/queue', asyncHandler(async (req, res) => {
    const filter = {
      status: req.query.status as any,
      tier: req.query.tier ? parseInt(req.query.tier as string) : undefined,
      assigned_curator: req.query.assigned_curator as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = curationService.getCurationQueue(filter);
    res.json(result);
  }));

  // Claim submission for review
  router.post('/submissions/:id/claim', asyncHandler(async (req, res) => {
    const submission = curationService.claimSubmission(req.params.id, req.body.curator_id);
    res.json(submission);
  }));

  // Decide curation
  router.post('/submissions/:id/decide', asyncHandler(async (req, res) => {
    const submission = curationService.decideCuration(req.params.id, req.body);
    pointsService.awardPoints({
      user_id: req.body.decided_by,
      tenant_id: req.body.tenant_id || '',
      action: PointAction.QualityCuration,
      source_type: 'curation_submission',
      source_id: submission.id,
    });
    res.json(submission);
  }));

  // Resubmit
  router.post('/submissions/:id/resubmit', asyncHandler(async (req, res) => {
    const submission = curationService.resubmit(req.params.id, req.body);
    res.status(201).json(submission);
  }));

  // Analytics
  router.get('/analytics', asyncHandler(async (req, res) => {
    const analytics = curationService.getCurationAnalytics(req.query.tenant_id as string);
    res.json(analytics);
  }));

  return router;
}
