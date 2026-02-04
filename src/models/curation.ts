import { CurationDecision, CurationSubmissionStatus, ChangeTier } from './types';

export interface CurationSubmission {
  id: string;
  creation_id: string;
  submitted_by: string;
  submitted_at: string;
  // The Five Questions
  q1_should_exist: string;
  q2_what_breaks: string;
  q3_does_it_fit: string;
  q4_who_owns: string;
  q5_burden: string;
  blast_radius_assessment_id: string | null;
  proposed_tier: ChangeTier;
  assigned_curator: string | null;
  status: CurationSubmissionStatus;
  decision: CurationDecision | null;
  decision_rationale: string | null;
  decision_at: string | null;
  decided_by: string | null;
  iteration_count: number;
  previous_submissions: string[];
  points_awarded: number;
}

export interface SubmitForCurationRequest {
  creation_id: string;
  submitted_by: string;
  tenant_id: string;
  q1_should_exist: string;
  q2_what_breaks: string;
  q3_does_it_fit: string;
  q4_who_owns: string;
  q5_burden: string;
  proposed_tier: ChangeTier;
  blast_radius_assessment_id?: string;
}

export interface CurationDecisionRequest {
  decided_by: string;
  decision: CurationDecision;
  decision_rationale: string;
  curator_notes?: string;
}

export interface CurationQueueFilter {
  status?: CurationSubmissionStatus;
  tier?: ChangeTier;
  workspace_id?: string;
  assigned_curator?: string;
  limit?: number;
  offset?: number;
}

/** Points awarded per curation decision type */
export const CURATION_DECISION_POINTS: Record<CurationDecision, number> = {
  [CurationDecision.Graduate]: 50,
  [CurationDecision.Iterate]: 0,
  [CurationDecision.Kill]: 10,
  [CurationDecision.Park]: 5,
};
