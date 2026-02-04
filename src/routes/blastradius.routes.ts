/**
 * Blast Radius Engine API routes.
 */

import { Router } from 'express';
import { BlastRadiusService } from '../services/blastradius.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createBlastRadiusRoutes(blastRadiusService: BlastRadiusService): Router {
  const router = Router();

  // Analyze creation
  router.post('/analyze', asyncHandler(async (req, res) => {
    const assessment = blastRadiusService.analyzeCreation(req.body);
    res.status(201).json(assessment);
  }));

  // Get assessment
  router.get('/:id', asyncHandler(async (req, res) => {
    const assessment = blastRadiusService.getAssessment(req.params.id);
    res.json(assessment);
  }));

  // Get assessment by creation
  router.get('/creation/:creationId', asyncHandler(async (req, res) => {
    const assessment = blastRadiusService.getAssessmentByCreation(req.params.creationId);
    res.json(assessment || { message: 'No assessment found' });
  }));

  // Add manual input
  router.post('/:id/manual-input', asyncHandler(async (req, res) => {
    const assessment = blastRadiusService.addManualInput(req.params.id, req.body);
    res.json(assessment);
  }));

  // Override tier
  router.post('/:id/override-tier', asyncHandler(async (req, res) => {
    const assessment = blastRadiusService.overrideTier(req.params.id, req.body.tier, req.body.notes);
    res.json(assessment);
  }));

  // Generate visualization
  router.get('/:id/visualization', asyncHandler(async (req, res) => {
    const viz = blastRadiusService.generateVisualization(req.params.id);
    res.json(viz);
  }));

  return router;
}
