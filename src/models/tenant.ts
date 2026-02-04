import { SubscriptionPlan, SubscriptionStatus, DataResidencyRegion } from './types';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  default_locale: string;
  timezone: string;
  logo_url: string | null;
  primary_color: string | null;
  custom_domain: string | null;
  data_residency_region: DataResidencyRegion;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  plan?: SubscriptionPlan;
  default_locale?: string;
  timezone?: string;
  data_residency_region?: DataResidencyRegion;
}

export interface CreateWorkspaceRequest {
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface OnboardingChecklist {
  items: { key: string; label: string; completed: boolean }[];
  progress: number;
}
