/**
 * Ownership Registry API routes.
 */

import { Router } from 'express';
import { OwnershipService } from '../services/ownership.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createOwnershipRoutes(ownershipService: OwnershipService): Router {
  const router = Router();

  // Register production asset
  router.post('/assets', asyncHandler(async (req, res) => {
    const asset = ownershipService.createAsset(req.body);
    res.status(201).json(asset);
  }));

  // Get asset
  router.get('/assets/:id', asyncHandler(async (req, res) => {
    const asset = ownershipService.getAsset(req.params.id);
    res.json(asset);
  }));

  // Get my assets
  router.get('/my-assets/:ownerId', asyncHandler(async (req, res) => {
    const assets = ownershipService.getMyAssets(req.params.ownerId);
    res.json(assets);
  }));

  // Transfer ownership
  router.post('/assets/:id/transfer', asyncHandler(async (req, res) => {
    const asset = ownershipService.transferOwnership(req.params.id, req.body);
    res.json(asset);
  }));

  // Deprecate asset
  router.post('/assets/:id/deprecate', asyncHandler(async (req, res) => {
    const asset = ownershipService.deprecateAsset(req.params.id);
    res.json(asset);
  }));

  // Search directory
  router.get('/directory/:tenantId', asyncHandler(async (req, res) => {
    const results = ownershipService.searchDirectory(req.query.q as string, req.params.tenantId);
    res.json(results);
  }));

  // Audit
  router.get('/audit/:tenantId', asyncHandler(async (req, res) => {
    const filter = {
      tenant_id: req.params.tenantId,
      workspace_id: req.query.workspace_id as string,
      stale_days: req.query.stale_days ? parseInt(req.query.stale_days as string) : undefined,
    };
    const result = ownershipService.auditOwnership(filter);
    res.json(result);
  }));

  return router;
}
