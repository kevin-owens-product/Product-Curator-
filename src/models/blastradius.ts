import { ChangeTier } from './types';

export interface BlastRadiusAssessment {
  id: string;
  creation_id: string;
  assessed_by: string;
  assessed_at: string;
  detected_dependencies: string[];
  detected_database_impacts: DatabaseImpact[];
  detected_api_changes: APIChange[];
  estimated_tier: ChangeTier;
  curator_notes: string | null;
  curator_tier_override: ChangeTier | null;
  curator_concerns: string[];
  affects_auth: boolean;
  affects_billing: boolean;
  affects_data_model: boolean;
  new_external_dependency: boolean;
  breaking_api_change: boolean;
}

export interface DatabaseImpact {
  table_name: string;
  operation: 'read' | 'write' | 'schema_change';
  description: string;
}

export interface APIChange {
  endpoint: string;
  change_type: 'new' | 'modified' | 'deprecated' | 'removed';
  breaking: boolean;
  description: string;
}

export interface AnalyzeCreationRequest {
  creation_id: string;
  assessed_by: string;
  repository_url?: string;
  code_paths?: string[];
}

export interface ManualBlastRadiusInput {
  additional_systems?: string[];
  non_code_impacts?: string[];
  customer_facing_changes?: string[];
  known_risks?: string[];
}

/** Tier recommendation thresholds */
export const TIER_RECOMMENDATION_RULES = {
  tier4_triggers: ['affects_auth', 'affects_billing', 'affects_data_model', 'breaking_api_change'] as const,
  tier3_threshold_dependencies: 4,
  tier2_threshold_dependencies: 2,
};
