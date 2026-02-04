export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tenant_overrides: Record<string, boolean>;
  percentage_rollout: number | null;
  plan_availability: string[];
  created_at: string;
  updated_at: string;
}
