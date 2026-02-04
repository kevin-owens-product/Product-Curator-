/**
 * Tenant & Workspace API routes.
 */

import { Router } from 'express';
import { TenantService } from '../services/tenant.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createTenantRoutes(tenantService: TenantService): Router {
  const router = Router();

  router.post('/', asyncHandler(async (req, res) => {
    const tenant = tenantService.createTenant(req.body);
    res.status(201).json(tenant);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const tenant = tenantService.getTenant(req.params.id);
    res.json(tenant);
  }));

  router.patch('/:id', asyncHandler(async (req, res) => {
    const tenant = tenantService.updateTenant(req.params.id, req.body);
    res.json(tenant);
  }));

  router.get('/', asyncHandler(async (req, res) => {
    const tenants = tenantService.listTenants();
    res.json(tenants);
  }));

  // Workspaces
  router.post('/:tenantId/workspaces', asyncHandler(async (req, res) => {
    const workspace = tenantService.createWorkspace({ tenant_id: req.params.tenantId, ...req.body });
    res.status(201).json(workspace);
  }));

  router.get('/:tenantId/workspaces', asyncHandler(async (req, res) => {
    const workspaces = tenantService.listWorkspaces(req.params.tenantId);
    res.json(workspaces);
  }));

  router.get('/:tenantId/workspaces/:workspaceId', asyncHandler(async (req, res) => {
    const workspace = tenantService.getWorkspace(req.params.workspaceId);
    res.json(workspace);
  }));

  // Onboarding
  router.get('/:tenantId/onboarding', asyncHandler(async (req, res) => {
    const checklist = tenantService.getOnboardingChecklist(req.params.tenantId);
    res.json(checklist);
  }));

  return router;
}
