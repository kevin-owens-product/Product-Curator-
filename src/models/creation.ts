import { CreationStatus } from './types';

export interface Creation {
  id: string;
  tenant_id: string;
  workspace_id: string;
  title: string;
  description: string;
  problem_statement: string;
  creator_id: string;
  status: CreationStatus;
  repository_url: string | null;
  prototype_url: string | null;
  documentation_url: string | null;
  curation_submission_id: string | null;
  challenge_id: string | null;
  similar_creations: string[];
  collaborators: string[];
  related_production_assets: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCreationRequest {
  tenant_id: string;
  workspace_id: string;
  title: string;
  description: string;
  problem_statement?: string;
  creator_id: string;
  repository_url?: string;
  prototype_url?: string;
  documentation_url?: string;
  challenge_id?: string;
}

export interface UpdateCreationRequest {
  title?: string;
  description?: string;
  problem_statement?: string;
  repository_url?: string;
  prototype_url?: string;
  documentation_url?: string;
  status?: CreationStatus;
}

export interface CreationFilter {
  workspace_id?: string;
  status?: CreationStatus;
  creator_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
