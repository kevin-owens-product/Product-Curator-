/**
 * Billing & Subscriptions API routes.
 */

import { Router } from 'express';
import { BillingService } from '../services/billing.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createBillingRoutes(billingService: BillingService): Router {
  const router = Router();

  // Create subscription
  router.post('/subscriptions', asyncHandler(async (req, res) => {
    const sub = billingService.createSubscription(req.body.tenant_id, req.body.plan);
    res.status(201).json(sub);
  }));

  // Get subscription
  router.get('/subscriptions/:tenantId', asyncHandler(async (req, res) => {
    const sub = billingService.getSubscription(req.params.tenantId);
    res.json(sub);
  }));

  // Change plan
  router.post('/subscriptions/:tenantId/change-plan', asyncHandler(async (req, res) => {
    const sub = billingService.changePlan(req.params.tenantId, req.body);
    res.json(sub);
  }));

  // Cancel subscription
  router.post('/subscriptions/:tenantId/cancel', asyncHandler(async (req, res) => {
    const sub = billingService.cancelSubscription(req.params.tenantId);
    res.json(sub);
  }));

  // Check limit
  router.get('/limits/:tenantId/:resource', asyncHandler(async (req, res) => {
    const currentCount = parseInt(req.query.current as string) || 0;
    const result = billingService.checkLimit(req.params.tenantId, req.params.resource as any, currentCount);
    res.json(result);
  }));

  // Usage dashboard
  router.get('/usage/:tenantId', asyncHandler(async (req, res) => {
    const dashboard = billingService.getUsageDashboard(req.params.tenantId);
    res.json(dashboard);
  }));

  // Invoices
  router.get('/invoices/:tenantId', asyncHandler(async (req, res) => {
    const invoices = billingService.getInvoices(req.params.tenantId);
    res.json(invoices);
  }));

  return router;
}
