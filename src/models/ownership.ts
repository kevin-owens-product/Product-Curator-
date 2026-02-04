import { ProductionAssetType, ProductionAssetStatus } from './types';

export interface ProductionAsset {
  id: string;
  tenant_id: string;
  workspace_id: string;
  name: string;
  description: string;
  type: ProductionAssetType;
  owner_id: string;
  ownership_started_at: string;
  ownership_history: OwnershipRecord[];
  graduated_from: string | null;
  graduated_at: string | null;
  repository: string;
  code_paths: string[];
  dependencies: string[];
  dependents: string[];
  status: ProductionAssetStatus;
  health_score: number;
  last_incident_at: string | null;
  patterns_used: string[];
  coherence_flags: string[];
  documentation_url: string;
  runbook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OwnershipRecord {
  id: string;
  production_asset_id: string;
  owner_id: string;
  started_at: string;
  ended_at: string | null;
  transfer_reason: string | null;
  transferred_to: string | null;
}

export interface CreateProductionAssetRequest {
  tenant_id: string;
  workspace_id: string;
  name: string;
  description: string;
  type: ProductionAssetType;
  owner_id: string;
  graduated_from?: string;
  repository: string;
  code_paths?: string[];
  documentation_url: string;
  runbook_url?: string;
}

export interface TransferOwnershipRequest {
  new_owner_id: string;
  transfer_reason: string;
}

export interface OwnershipAuditFilter {
  tenant_id: string;
  workspace_id?: string;
  orphaned_only?: boolean;
  stale_days?: number;
}
