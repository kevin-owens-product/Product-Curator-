import { PatternCategory, PatternStatus, CoherenceFlagType, CoherenceFlagSeverity, CoherenceFlagStatus } from './types';

export interface Pattern {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: PatternCategory;
  documentation_url: string;
  examples: string[];
  production_assets_using: string[];
  status: PatternStatus;
  introduced_at: string;
  deprecated_at: string | null;
}

export interface CoherenceFlag {
  id: string;
  production_asset_id: string;
  flagged_by: string;
  flagged_at: string;
  type: CoherenceFlagType;
  description: string;
  severity: CoherenceFlagSeverity;
  status: CoherenceFlagStatus;
  resolved_at: string | null;
  resolution_notes: string | null;
}

export interface CreatePatternRequest {
  tenant_id: string;
  name: string;
  description: string;
  category: PatternCategory;
  documentation_url: string;
  examples?: string[];
}

export interface CreateCoherenceFlagRequest {
  production_asset_id: string;
  flagged_by: string;
  type: CoherenceFlagType;
  description: string;
  severity: CoherenceFlagSeverity;
}

export interface CoherenceScore {
  overall: number;
  pattern_compliance_rate: number;
  open_flags_weighted: number;
  duplicate_functionality_count: number;
  architectural_drift_count: number;
}
