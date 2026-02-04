/**
 * Creation Registry API routes.
 */

import { Router } from 'express';
import { CreationService } from '../services/creation.service';
import { PointsService } from '../services/points.service';
import { PointAction } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createCreationRoutes(
  creationService: CreationService,
  pointsService: PointsService
): Router {
  const router = Router();

  // Create a creation
  router.post('/', asyncHandler(async (req, res) => {
    const creation = creationService.createCreation(req.body);
    pointsService.awardPoints({
      user_id: req.body.creator_id,
      tenant_id: req.body.tenant_id,
      action: PointAction.CreateCreation,
      source_type: 'creation',
      source_id: creation.id,
    });
    res.status(201).json(creation);
  }));

  // Get creation by ID
  router.get('/:id', asyncHandler(async (req, res) => {
    const creation = creationService.getCreation(req.params.id);
    res.json(creation);
  }));

  // Update creation
  router.patch('/:id', asyncHandler(async (req, res) => {
    const creation = creationService.updateCreation(req.params.id, req.body);
    res.json(creation);
  }));

  // Update status
  router.post('/:id/status', asyncHandler(async (req, res) => {
    const creation = creationService.updateStatus(req.params.id, req.body.status);
    res.json(creation);
  }));

  // Discover creations
  router.get('/', asyncHandler(async (req, res) => {
    const filter = {
      workspace_id: req.query.workspace_id as string,
      status: req.query.status as any,
      creator_id: req.query.creator_id as string,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = creationService.discoverCreations(filter);
    res.json(result);
  }));

  // Search creations
  router.get('/search/:tenantId', asyncHandler(async (req, res) => {
    const results = creationService.searchCreations(req.query.q as string, req.params.tenantId);
    res.json(results);
  }));

  // Find similar
  router.get('/:id/similar', asyncHandler(async (req, res) => {
    const similar = creationService.findSimilar(req.params.id);
    res.json(similar);
  }));

  // Collaborators
  router.post('/:id/collaborators', asyncHandler(async (req, res) => {
    const creation = creationService.addCollaborator(req.params.id, req.body.user_id);
    res.json(creation);
  }));

  router.delete('/:id/collaborators/:userId', asyncHandler(async (req, res) => {
    const creation = creationService.removeCollaborator(req.params.id, req.params.userId);
    res.json(creation);
  }));

  return router;
}
