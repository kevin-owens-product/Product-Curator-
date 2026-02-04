/**
 * Admin Console API routes.
 */

import { Router } from 'express';
import { AdminService } from '../services/admin.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createAdminRoutes(adminService: AdminService): Router {
  const router = Router();

  // Feature Flags
  router.post('/feature-flags', asyncHandler(async (req, res) => {
    const flag = adminService.createFeatureFlag(req.body);
    res.status(201).json(flag);
  }));

  router.get('/feature-flags', asyncHandler(async (req, res) => {
    const flags = adminService.getFeatureFlags();
    res.json(flags);
  }));

  router.get('/feature-flags/:id', asyncHandler(async (req, res) => {
    const flag = adminService.getFeatureFlag(req.params.id);
    res.json(flag);
  }));

  router.post('/feature-flags/:id/toggle', asyncHandler(async (req, res) => {
    const flag = adminService.toggleFeatureFlag(req.params.id, req.body.enabled);
    res.json(flag);
  }));

  router.post('/feature-flags/:id/tenant-override', asyncHandler(async (req, res) => {
    const flag = adminService.setFlagForTenant(req.params.id, req.body.tenant_id, req.body.enabled);
    res.json(flag);
  }));

  router.post('/feature-flags/:id/rollout', asyncHandler(async (req, res) => {
    const flag = adminService.setPercentageRollout(req.params.id, req.body.percentage);
    res.json(flag);
  }));

  // Check flag
  router.get('/feature-flags/:id/check', asyncHandler(async (req, res) => {
    const enabled = adminService.isFlagEnabled(req.params.id, req.query.tenant_id as string);
    res.json({ enabled });
  }));

  // Impersonation
  router.post('/impersonate', asyncHandler(async (req, res) => {
    const result = adminService.impersonate(req.body.admin_id, req.body.target_user_id, req.body.reason);
    res.json(result);
  }));

  router.get('/impersonation-log', asyncHandler(async (req, res) => {
    const log = adminService.getImpersonationLog();
    res.json(log);
  }));

  // System Health
  router.get('/system-health', asyncHandler(async (req, res) => {
    const health = adminService.getSystemHealth();
    res.json(health);
  }));

  return router;
}
