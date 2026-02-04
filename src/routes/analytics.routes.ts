/**
 * Analytics API routes.
 */

import { Router } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createAnalyticsRoutes(analyticsService: AnalyticsService): Router {
  const router = Router();

  // Executive dashboard
  router.get('/executive/:tenantId', asyncHandler(async (req, res) => {
    const dashboard = analyticsService.getExecutiveDashboard(req.params.tenantId);
    res.json(dashboard);
  }));

  // Squad analytics
  router.get('/squad/:tenantId/:workspaceId', asyncHandler(async (req, res) => {
    const analytics = analyticsService.getSquadAnalytics(req.params.tenantId, req.params.workspaceId);
    res.json(analytics);
  }));

  // Individual analytics
  router.get('/individual/:userId', asyncHandler(async (req, res) => {
    const analytics = analyticsService.getIndividualAnalytics(req.params.userId);
    res.json(analytics);
  }));

  // Engagement analytics
  router.get('/engagement/:tenantId', asyncHandler(async (req, res) => {
    const analytics = analyticsService.getEngagementAnalytics(req.params.tenantId);
    res.json(analytics);
  }));

  return router;
}
