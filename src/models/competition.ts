/**
 * Competition data models.
 *
 * Competitions are ongoing or periodic contests that drive sustained engagement.
 * Types include sprints (weekly/bi-weekly), seasonal (quarterly),
 * ongoing (continuous), and tournaments (bracket-style).
 */

import {
  CompetitionType,
  CompetitionStatus,
  ScoringModel,
  Eligibility,
  LeaderboardVisibility,
  CompetitionEntryStatus,
  TournamentFormat,
  MatchStatus,
} from './types';

export interface Competition {
  id: string;
  tenant_id: string;

  // Content
  name: string;
  description: string;
  rules: string;

  // Type and timing
  type: CompetitionType;
  status: CompetitionStatus;
  starts_at: string;
  ends_at: string | null; // null for ongoing

  // Scoring
  scoring_model: ScoringModel;
  scoring_criteria: Record<string, unknown>;

  // Participation
  eligibility: Eligibility;
  eligible_workspaces: string[];
  eligible_roles: string[];

  // Leaderboard
  leaderboard_visibility: LeaderboardVisibility;

  // Prizes
  prizes: CompetitionPrize[];

  // Metadata
  created_at: string;
}

export interface CompetitionPrize {
  id: string;
  competition_id: string;
  place: string;
  category: string | null;
  description: string;
  value: string;
  points_value: number;
}

export interface CompetitionEntry {
  id: string;
  competition_id: string;
  user_id: string;

  // Scoring
  score: number;
  rank: number;

  // Contributions
  creation_ids: string[];
  challenge_wins: string[];
  points_earned: number;

  // Status
  status: CompetitionEntryStatus;

  // Timestamps
  joined_at: string;
  last_activity_at: string;
}

export interface TournamentBracket {
  id: string;
  competition_id: string;

  // Structure
  rounds: TournamentRound[];
  current_round: number;

  // Format
  format: TournamentFormat;
  seeds: TournamentSeed[];
}

export interface TournamentRound {
  round_number: number;
  matches: TournamentMatch[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TournamentSeed {
  seed_number: number;
  participant_id: string;
  participant_type: 'user' | 'team';
}

export interface TournamentMatch {
  id: string;
  bracket_id: string;
  round: number;

  participant_a: string;
  participant_b: string;

  // Challenge they compete on
  challenge_id: string;

  // Results
  winner: string | null;
  score_a: number;
  score_b: number;

  status: MatchStatus;
  scheduled_at: string;
  completed_at: string | null;
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface CreateCompetitionRequest {
  tenant_id: string;
  name: string;
  description: string;
  rules: string;
  type: CompetitionType;
  starts_at: string;
  ends_at?: string;
  scoring_model: ScoringModel;
  scoring_criteria?: Record<string, unknown>;
  eligibility: Eligibility;
  eligible_workspaces?: string[];
  eligible_roles?: string[];
  leaderboard_visibility: LeaderboardVisibility;
}

export interface CreateSprintRequest {
  tenant_id: string;
  name: string;
  description: string;
  theme: string;
  duration_days: number;
  scoring_model: ScoringModel;
  scoring_criteria: Record<string, unknown>;
  auto_reset: boolean;
  cumulative_tracking: boolean;
}

export interface CreateTournamentRequest {
  competition_id: string;
  format: TournamentFormat;
  participant_ids: string[];
  participant_type: 'user' | 'team';
  seeding: 'random' | 'ranked' | 'manual';
  manual_seeds?: TournamentSeed[];
}

export interface CompetitionFilterOptions {
  type?: CompetitionType;
  status?: CompetitionStatus;
  eligibility?: Eligibility;
  search?: string;
  sort_by?: 'newest' | 'ending_soon' | 'most_participants';
  limit?: number;
  offset?: number;
}
