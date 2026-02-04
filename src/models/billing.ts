import { SubscriptionPlan, SubscriptionStatus, InvoiceStatus } from './types';

export interface Subscription {
  id: string;
  tenant_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  users_count: number;
  workspaces_count: number;
  creations_this_month: number;
  production_assets_count: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  period_start: string;
  period_end: string;
  due_date: string;
  paid_at: string | null;
  pdf_url: string | null;
}

export interface PlanLimits {
  users: number | null;
  workspaces: number | null;
  creations_per_month: number | null;
  production_assets: number | null;
  challenges_per_month: number | null;
  hackathons_per_year: number | null;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SubscriptionPlan.Free]: { users: 5, workspaces: 1, creations_per_month: 50, production_assets: 100, challenges_per_month: 2, hackathons_per_year: null },
  [SubscriptionPlan.Starter]: { users: 25, workspaces: 3, creations_per_month: 250, production_assets: 500, challenges_per_month: 10, hackathons_per_year: 2 },
  [SubscriptionPlan.Professional]: { users: null, workspaces: 10, creations_per_month: null, production_assets: null, challenges_per_month: null, hackathons_per_year: null },
  [SubscriptionPlan.Enterprise]: { users: null, workspaces: null, creations_per_month: null, production_assets: null, challenges_per_month: null, hackathons_per_year: null },
};

export interface UsageDashboard {
  plan: SubscriptionPlan;
  limits: PlanLimits;
  current_usage: {
    users: number;
    workspaces: number;
    creations_this_month: number;
    production_assets: number;
    challenges_this_month: number;
    hackathons_this_year: number;
  };
  alerts: string[];
}

export interface ChangePlanRequest {
  new_plan: SubscriptionPlan;
}
