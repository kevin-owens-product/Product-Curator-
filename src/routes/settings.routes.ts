/**
 * Gamification Settings API routes.
 *
 * Endpoints for tenant settings, workspace overrides,
 * and user preferences.
 */

import { Router } from 'express';
import { SettingsService } from '../services/settings.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createSettingsRoutes(settingsService: SettingsService): Router {
  const router = Router();

  // ─── Tenant Settings ───────────────────────────────────────────────────

  // Get tenant settings
  router.get('/tenant/:tenantId', asyncHandler(async (req, res) => {
    const settings = settingsService.getTenantSettings(req.params.tenantId);
    res.json(settings);
  }));

  // Update tenant settings
  router.patch('/tenant/:tenantId', asyncHandler(async (req, res) => {
    const settings = settingsService.updateTenantSettings(req.params.tenantId, req.body);
    res.json(settings);
  }));

  // ─── Workspace Overrides ───────────────────────────────────────────────

  // Get effective settings for workspace
  router.get('/effective/:tenantId/:workspaceId', asyncHandler(async (req, res) => {
    const settings = settingsService.getEffectiveSettings(
      req.params.tenantId,
      req.params.workspaceId
    );
    res.json(settings);
  }));

  // Set workspace overrides
  router.patch('/workspace/:workspaceId', asyncHandler(async (req, res) => {
    const overrides = settingsService.setWorkspaceOverrides(
      req.params.workspaceId,
      req.body.tenant_id,
      req.body
    );
    res.json(overrides);
  }));

  // Check if feature is enabled
  router.get('/feature/:tenantId/:feature', asyncHandler(async (req, res) => {
    const workspaceId = req.query.workspace_id as string | undefined;
    const enabled = settingsService.isFeatureEnabled(
      req.params.tenantId,
      workspaceId || null,
      req.params.feature as any
    );
    res.json({ feature: req.params.feature, enabled });
  }));

  // ─── User Preferences ─────────────────────────────────────────────────

  // Get user preferences
  router.get('/user/:userId', asyncHandler(async (req, res) => {
    const prefs = settingsService.getUserPreferences(req.params.userId);
    res.json(prefs);
  }));

  // Update user preferences
  router.patch('/user/:userId', asyncHandler(async (req, res) => {
    const prefs = settingsService.updateUserPreferences(req.params.userId, req.body);
    res.json(prefs);
  }));

  return router;
}
