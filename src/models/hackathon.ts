/**
 * Hackathon data models.
 *
 * A Hackathon is an organized, time-boxed event where individuals or teams
 * compete to build solutions. Hackathons can be virtual or in-person,
 * themed or open, and range from hours (mini-hack) to days (full event).
 */

import {
  HackathonStatus,
  HackathonFormat,
  RegistrationStatus,
  TeamStatus,
  PrizePlace,
} from './types';

export interface Hackathon {
  id: string;
  tenant_id: string;

  // Content
  name: string;
  description: string;
  theme: string | null;
  rules: string;

  // Timing
  status: HackathonStatus;
  registration_opens_at: string;
  registration_closes_at: string;
  starts_at: string;
  ends_at: string;
  judging_ends_at: string;

  // Format
  format: HackathonFormat;
  max_team_size: number;
  min_team_size: number;

  // Tracks
  tracks: HackathonTrack[];

  // Challenges within hackathon
  challenge_ids: string[];

  // Participation
  registrations: HackathonRegistration[];
  max_participants: number | null;

  // Prizes
  prizes: HackathonPrize[];

  // Logistics
  location: string | null;
  virtual_platform_url: string | null;
  slack_channel: string | null;

  // Sponsors
  organizers: string[];
  mentors: string[];
  judges: string[];

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface HackathonTrack {
  id: string;
  hackathon_id: string;
  name: string;
  description: string;
  specific_challenge_ids: string[];
  prize_ids: string[];
}

export interface HackathonRegistration {
  id: string;
  hackathon_id: string;

  // Participant
  user_id: string;
  team_id: string | null;
  track_id: string | null;

  // Status
  status: RegistrationStatus;
  registered_at: string;

  // Preferences
  looking_for_team: boolean;
  skills: string[];
  interests: string[];
}

export interface HackathonTeam {
  id: string;
  hackathon_id: string;

  name: string;
  members: string[];
  captain_id: string;
  track_id: string | null;

  // Submissions
  submission_ids: string[];

  // Status
  status: TeamStatus;
}

export interface HackathonPrize {
  id: string;
  hackathon_id: string;
  track_id: string | null;

  place: PrizePlace;
  category: string | null;
  description: string;
  value: string;
  points_value: number;
}

export interface MentorHelpRequest {
  id: string;
  hackathon_id: string;
  team_id: string;
  requested_by: string;
  description: string;
  status: 'pending' | 'claimed' | 'completed' | 'canceled';
  mentor_id: string | null;
  queue_position: number;
  requested_at: string;
  claimed_at: string | null;
  completed_at: string | null;
  rating: number | null;
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface CreateHackathonRequest {
  tenant_id: string;
  name: string;
  description: string;
  theme?: string;
  rules: string;
  registration_opens_at: string;
  registration_closes_at: string;
  starts_at: string;
  ends_at: string;
  judging_ends_at: string;
  format: HackathonFormat;
  max_team_size: number;
  min_team_size: number;
  max_participants?: number;
  location?: string;
  virtual_platform_url?: string;
  slack_channel?: string;
  organizers: string[];
  mentors?: string[];
  judges: string[];
}

export interface RegisterForHackathonRequest {
  hackathon_id: string;
  user_id: string;
  track_id?: string;
  looking_for_team: boolean;
  skills: string[];
  interests: string[];
}

export interface CreateTeamRequest {
  hackathon_id: string;
  name: string;
  captain_id: string;
  track_id?: string;
}

export interface RequestMentorHelpRequest {
  hackathon_id: string;
  team_id: string;
  requested_by: string;
  description: string;
}

export interface HackathonSubmissionRequest {
  hackathon_id: string;
  team_id: string;
  creation_id: string;
  challenge_ids: string[];
  demo_url?: string;
  presentation_url?: string;
  solution_summary: string;
}
