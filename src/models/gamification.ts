/**
 * Gamification data models.
 *
 * Core gamification entities including points, levels, badges,
 * streaks, leaderboards, and user gamification profiles.
 */

import {
  BadgeRarity,
  BadgeCriteriaType,
  StreakType,
  LeaderboardScope,
  LeaderboardMetric,
  PointAction,
  ProfileVisibility,
} from './types';

// ─── Points ──────────────────────────────────────────────────────────────────

export interface PointTransaction {
  id: string;
  user_id: string;
  tenant_id: string;

  action: PointAction;
  points: number;
  description: string;

  // Context
  source_type: string | null; // e.g. 'challenge', 'hackathon', 'creation'
  source_id: string | null;

  created_at: string;
}

export interface UserPoints {
  user_id: string;
  tenant_id: string;
  total_points: number;
  current_level: number;
  points_this_month: number;
  points_this_quarter: number;
  points_this_year: number;
  last_updated: string;
}

// ─── Levels ──────────────────────────────────────────────────────────────────

export interface Level {
  id: string;
  tenant_id: string;

  level_number: number;
  title: string;
  points_required: number;

  // Perks
  perks: LevelPerk[];

  // Visual
  badge_icon: string;
  badge_color: string;
}

export interface LevelPerk {
  type: string;
  description: string;
  config: Record<string, unknown>;
}

/** Default level definitions */
export const DEFAULT_LEVELS: Omit<Level, 'id' | 'tenant_id'>[] = [
  { level_number: 1, title: 'Newcomer', points_required: 0, perks: [], badge_icon: 'seedling', badge_color: '#9CA3AF' },
  { level_number: 2, title: 'Creator', points_required: 100, perks: [], badge_icon: 'pencil', badge_color: '#6B7280' },
  { level_number: 3, title: 'Builder', points_required: 300, perks: [{ type: 'access', description: 'Access to advanced challenges', config: {} }], badge_icon: 'hammer', badge_color: '#3B82F6' },
  { level_number: 4, title: 'Contributor', points_required: 750, perks: [{ type: 'role', description: 'Can mentor in hackathons', config: {} }], badge_icon: 'star', badge_color: '#10B981' },
  { level_number: 5, title: 'Innovator', points_required: 1500, perks: [{ type: 'priority', description: 'Priority curation queue', config: {} }], badge_icon: 'lightbulb', badge_color: '#8B5CF6' },
  { level_number: 6, title: 'Leader', points_required: 3000, perks: [{ type: 'sponsor', description: 'Can sponsor challenges', config: {} }], badge_icon: 'crown', badge_color: '#F59E0B' },
  { level_number: 7, title: 'Architect', points_required: 6000, perks: [{ type: 'judge', description: 'Judge eligibility', config: {} }], badge_icon: 'building', badge_color: '#EF4444' },
  { level_number: 8, title: 'Visionary', points_required: 10000, perks: [{ type: 'spotlight', description: 'Feature in org spotlight', config: {} }], badge_icon: 'telescope', badge_color: '#EC4899' },
  { level_number: 9, title: 'Legend', points_required: 20000, perks: [{ type: 'recognition', description: 'Permanent recognition', config: {} }], badge_icon: 'trophy', badge_color: '#F97316' },
  { level_number: 10, title: 'Founder', points_required: 50000, perks: [{ type: 'hall_of_fame', description: 'Hall of fame', config: {} }], badge_icon: 'gem', badge_color: '#FFD700' },
];

// ─── Default Point Values ────────────────────────────────────────────────────

export const DEFAULT_POINT_VALUES: Record<PointAction, number> = {
  [PointAction.CreateCreation]: 10,
  [PointAction.SubmitForCuration]: 15,
  [PointAction.CreationGraduates]: 50,
  [PointAction.CreationKilled]: 10,
  [PointAction.OwnProductionAsset]: 5,
  [PointAction.ZeroIncidents]: 20,
  [PointAction.SubmitToChallenge]: 25,
  [PointAction.WinChallenge]: 200,
  [PointAction.RunnerUp]: 100,
  [PointAction.HonorableMention]: 50,
  [PointAction.CompleteHackathon]: 75,
  [PointAction.WinHackathon]: 300,
  [PointAction.HelpAsMentor]: 30,
  [PointAction.QualityCuration]: 20,
  [PointAction.Streak7Days]: 25,
  [PointAction.Streak30Days]: 100,
  [PointAction.FirstCreation]: 50,
  [PointAction.FirstGraduation]: 100,
  [PointAction.ReferColleague]: 25,
};

// ─── Badges ──────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  tenant_id: string | null; // null for system badges

  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;

  // Criteria
  criteria_type: BadgeCriteriaType;
  criteria_config: Record<string, unknown>;

  // Visibility
  hidden: boolean; // surprise badges
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;

  // Context
  trigger_event: string;
}

// ─── Streaks ─────────────────────────────────────────────────────────────────

export interface Streak {
  id: string;
  user_id: string;

  streak_type: StreakType;
  current_count: number;
  longest_count: number;

  last_activity_at: string;
  streak_started_at: string;
}

// ─── Leaderboards ────────────────────────────────────────────────────────────

export interface Leaderboard {
  id: string;
  tenant_id: string;
  workspace_id: string | null;

  name: string;
  description: string;

  // Scope
  scope: LeaderboardScope;
  metric: LeaderboardMetric;

  // Visibility
  visibility: ProfileVisibility;

  // Display
  show_top_n: number;
  show_user_position: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  rank: number;
  score: number;
  display_name: string;
  level: number;
  trend: 'up' | 'down' | 'stable';
  previous_rank: number | null;
}

// ─── User Gamification Profile ───────────────────────────────────────────────

export interface UserGamificationProfile {
  user_id: string;
  tenant_id: string;

  // Points & Level
  total_points: number;
  current_level: number;
  current_title: string;
  points_to_next_level: number;

  // Badges
  badges: UserBadge[];
  featured_badges: string[]; // top 3 badge IDs to display

  // Streaks
  streaks: Streak[];

  // Stats
  total_creations: number;
  total_graduations: number;
  challenges_entered: number;
  challenges_won: number;
  hackathons_participated: number;
  hackathons_won: number;

  // Leaderboard positions
  leaderboard_positions: Record<string, number>;

  // Recent activity
  recent_points: PointTransaction[];
}

// ─── User Preferences ────────────────────────────────────────────────────────

export interface UserGamificationPreferences {
  user_id: string;

  // Visibility
  show_on_leaderboard: boolean;
  profile_public: boolean;

  // Notifications
  achievement_notifications: boolean;
  weekly_digest: boolean;

  // Display
  show_level_badge: boolean;
  featured_badges: string[]; // badge IDs
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface AwardPointsRequest {
  user_id: string;
  tenant_id: string;
  action: PointAction;
  source_type?: string;
  source_id?: string;
  description?: string;
  override_points?: number; // override default point value
}

export interface LeaderboardQuery {
  tenant_id: string;
  workspace_id?: string;
  scope: LeaderboardScope;
  metric: LeaderboardMetric;
  limit?: number;
  offset?: number;
  user_id?: string; // to include user's position
}
