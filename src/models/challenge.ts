/**
 * Challenge data models.
 *
 * A Challenge is a well-defined problem seeking creative solutions.
 * Challenges focus energy on specific organizational needs including
 * customer problems, technical debt, coherence issues, strategic
 * initiatives, efficiency gains, and moonshots.
 */

import {
  ChallengeType,
  ChallengeStatus,
  Difficulty,
  RewardType,
  SubmissionStatus,
  CriteriaScores,
} from './types';

export interface Challenge {
  id: string;
  tenant_id: string;
  workspace_id: string | null; // null = org-wide

  // Content
  title: string;
  problem_statement: string;
  context: string;
  success_criteria: string;

  // Categorization
  type: ChallengeType;
  difficulty: Difficulty;
  tags: string[];

  // Timing
  status: ChallengeStatus;
  opens_at: string;
  closes_at: string;
  judging_ends_at: string;

  // Ownership
  sponsor_id: string;
  created_by: string;
  judges: string[];

  // Rewards
  reward_type: RewardType;
  reward_description: string;
  points_value: number;

  // Results
  winning_submissions: string[];
  total_submissions: number;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  creation_id: string;

  // Team
  submitted_by: string;
  team_members: string[];

  // Content
  solution_summary: string;
  demo_url: string | null;
  presentation_url: string | null;

  // Judging
  status: SubmissionStatus;
  judge_scores: JudgeScore[];
  average_score: number;
  judge_feedback: string | null;

  // Metadata
  submitted_at: string;
}

export interface JudgeScore {
  id: string;
  submission_id: string;
  judge_id: string;

  // Scoring
  criteria_scores: CriteriaScores;
  overall_score: number;
  feedback: string;

  scored_at: string;
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface CreateChallengeRequest {
  tenant_id: string;
  workspace_id?: string;
  title: string;
  problem_statement: string;
  context: string;
  success_criteria: string;
  type: ChallengeType;
  difficulty: Difficulty;
  tags?: string[];
  opens_at: string;
  closes_at: string;
  judging_ends_at: string;
  sponsor_id: string;
  created_by: string;
  judges: string[];
  reward_type: RewardType;
  reward_description: string;
  points_value: number;
}

export interface UpdateChallengeRequest {
  title?: string;
  problem_statement?: string;
  context?: string;
  success_criteria?: string;
  type?: ChallengeType;
  difficulty?: Difficulty;
  tags?: string[];
  status?: ChallengeStatus;
  opens_at?: string;
  closes_at?: string;
  judging_ends_at?: string;
  judges?: string[];
  reward_type?: RewardType;
  reward_description?: string;
  points_value?: number;
}

export interface SubmitToChallengeRequest {
  challenge_id: string;
  creation_id: string;
  submitted_by: string;
  team_members?: string[];
  solution_summary: string;
  demo_url?: string;
  presentation_url?: string;
}

export interface ScoreSubmissionRequest {
  submission_id: string;
  judge_id: string;
  criteria_scores: CriteriaScores;
  feedback: string;
}

export interface ChallengeFilterOptions {
  type?: ChallengeType;
  difficulty?: Difficulty;
  status?: ChallengeStatus;
  workspace_id?: string;
  reward_type?: RewardType;
  tags?: string[];
  search?: string;
  sort_by?: 'newest' | 'closing_soon' | 'most_submissions' | 'highest_reward';
  limit?: number;
  offset?: number;
}
