/**
 * Audit Log API routes.
 */

import { Router } from 'express';
import { AuditService } from '../services/audit.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createAuditRoutes(auditService: AuditService): Router {
  const router = Router();

  // Search audit log
  router.get('/:tenantId', asyncHandler(async (req, res) => {
    const filter = {
      tenant_id: req.params.tenantId,
      actor_id: req.query.actor_id as string,
      action: req.query.action as string,
      resource_type: req.query.resource_type as string,
      from_date: req.query.from_date as string,
      to_date: req.query.to_date as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const result = auditService.search(filter);
    res.json(result);
  }));

  // Export audit log
  router.get('/:tenantId/export', asyncHandler(async (req, res) => {
    const entries = auditService.exportAuditLog(req.params.tenantId);
    res.json(entries);
  }));

  return router;
}
