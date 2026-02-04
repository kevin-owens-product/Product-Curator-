/**
 * Billing & Subscriptions Service
 *
 * Manages subscriptions, plan enforcement, usage tracking, and invoices.
 */

import { v4 as uuid } from 'uuid';
import { Subscription, Invoice, PlanLimits, PLAN_LIMITS, UsageDashboard, ChangePlanRequest } from '../models/billing';
import { SubscriptionPlan, SubscriptionStatus, InvoiceStatus } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class BillingService {
  private subscriptions = new InMemoryStore<Subscription>();
  private invoices = new InMemoryStore<Invoice>();

  createSubscription(tenantId: string, plan: SubscriptionPlan = SubscriptionPlan.Free): Subscription {
    const now = new Date().toISOString();
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const sub: Subscription = {
      id: uuid(),
      tenant_id: tenantId,
      plan,
      status: plan === SubscriptionPlan.Free ? SubscriptionStatus.Active : SubscriptionStatus.Trialing,
      current_period_start: now,
      current_period_end: periodEnd,
      trial_ends_at: plan !== SubscriptionPlan.Free ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      users_count: 0,
      workspaces_count: 0,
      creations_this_month: 0,
      production_assets_count: 0,
      created_at: now,
      updated_at: now,
    };

    return this.subscriptions.create(sub);
  }

  getSubscription(tenantId: string): Subscription {
    const sub = this.subscriptions.findOne(s => s.tenant_id === tenantId);
    if (!sub) throw new NotFoundError('Subscription', tenantId);
    return sub;
  }

  changePlan(tenantId: string, request: ChangePlanRequest): Subscription {
    const sub = this.getSubscription(tenantId);
    sub.plan = request.new_plan;
    sub.updated_at = new Date().toISOString();
    this.subscriptions.update(sub.id, sub);
    return sub;
  }

  cancelSubscription(tenantId: string): Subscription {
    const sub = this.getSubscription(tenantId);
    sub.status = SubscriptionStatus.Canceled;
    sub.updated_at = new Date().toISOString();
    this.subscriptions.update(sub.id, sub);
    return sub;
  }

  checkLimit(tenantId: string, resource: keyof PlanLimits, currentCount: number): { allowed: boolean; limit: number | null; current: number } {
    const sub = this.getSubscription(tenantId);
    const limits = PLAN_LIMITS[sub.plan];
    const limit = limits[resource];
    return { allowed: limit === null || currentCount < limit, limit, current: currentCount };
  }

  updateUsage(tenantId: string, usage: Partial<Pick<Subscription, 'users_count' | 'workspaces_count' | 'creations_this_month' | 'production_assets_count'>>): void {
    const sub = this.getSubscription(tenantId);
    Object.assign(sub, usage, { updated_at: new Date().toISOString() });
    this.subscriptions.update(sub.id, sub);
  }

  getUsageDashboard(tenantId: string): UsageDashboard {
    const sub = this.getSubscription(tenantId);
    const limits = PLAN_LIMITS[sub.plan];
    const alerts: string[] = [];

    const checkAlert = (name: string, current: number, limit: number | null) => {
      if (limit !== null && current >= limit * 0.8) {
        alerts.push(`${name}: ${current}/${limit} (${Math.round(current / limit * 100)}% used)`);
      }
    };

    checkAlert('Users', sub.users_count, limits.users);
    checkAlert('Workspaces', sub.workspaces_count, limits.workspaces);
    checkAlert('Creations', sub.creations_this_month, limits.creations_per_month);

    return {
      plan: sub.plan,
      limits,
      current_usage: {
        users: sub.users_count,
        workspaces: sub.workspaces_count,
        creations_this_month: sub.creations_this_month,
        production_assets: sub.production_assets_count,
        challenges_this_month: 0,
        hackathons_this_year: 0,
      },
      alerts,
    };
  }

  getInvoices(tenantId: string): Invoice[] {
    return this.invoices.find(i => i.tenant_id === tenantId)
      .sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime());
  }
}
