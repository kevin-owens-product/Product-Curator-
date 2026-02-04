/**
 * Incident Attribution API routes.
 */

import { Router } from 'express';
import { IncidentService } from '../services/incident.service';
import { PointsService } from '../services/points.service';
import { PointAction } from '../models/types';
import { asyncHandler } from '../middleware/errorHandler';

export function createIncidentRoutes(
  incidentService: IncidentService,
  pointsService: PointsService
): Router {
  const router = Router();

  // Ingest incident
  router.post('/', asyncHandler(async (req, res) => {
    const incident = incidentService.ingestIncident(req.body);
    // Deduct points from primary owner
    if (incident.primary_owner !== 'unassigned') {
      try {
        pointsService.awardPoints({
          user_id: incident.primary_owner,
          tenant_id: req.body.tenant_id,
          action: PointAction.IncidentDeduction,
          source_type: 'incident',
          source_id: incident.id,
        });
      } catch {
        // Ignore deduction errors
      }
    }
    res.status(201).json(incident);
  }));

  // Get incident
  router.get('/:id', asyncHandler(async (req, res) => {
    const incident = incidentService.getIncident(req.params.id);
    res.json(incident);
  }));

  // Acknowledge
  router.post('/:id/acknowledge', asyncHandler(async (req, res) => {
    const incident = incidentService.acknowledgeIncident(req.params.id);
    res.json(incident);
  }));

  // Resolve
  router.post('/:id/resolve', asyncHandler(async (req, res) => {
    const incident = incidentService.resolveIncident(
      req.params.id,
      req.body.notes,
      req.body.root_cause,
      req.body.post_mortem_url
    );
    res.json(incident);
  }));

  // My incidents
  router.get('/owner/:ownerId', asyncHandler(async (req, res) => {
    const incidents = incidentService.getMyIncidents(req.params.ownerId);
    res.json(incidents);
  }));

  // List incidents
  router.get('/tenant/:tenantId', asyncHandler(async (req, res) => {
    const incidents = incidentService.getIncidents(req.params.tenantId, {
      severity: req.query.severity as any,
      resolved: req.query.resolved === 'true' ? true : req.query.resolved === 'false' ? false : undefined,
    });
    res.json(incidents);
  }));

  // Analytics
  router.get('/analytics/:tenantId', asyncHandler(async (req, res) => {
    const analytics = incidentService.getAnalytics(req.params.tenantId);
    res.json(analytics);
  }));

  return router;
}
