/**
 * Gamification settings and configuration models.
 *
 * Supports tenant-level settings, workspace-level overrides,
 * and individual user preferences for the gamification system.
 */

import { ProfileVisibility } from './types';
import { Level } from './gamification';

export interface GamificationSettings {
  tenant_id: string;

  // Feature toggles
  points_enabled: boolean;
  badges_enabled: boolean;
  levels_enabled: boolean;
  leaderboards_enabled: boolean;
  streaks_enabled: boolean;

  // Privacy
  leaderboard_visibility: 'public' | 'opt_in' | 'disabled';
  profile_visibility: ProfileVisibility;

  // Points economy
  point_values: Record<string, number>; // override defaults
  point_decay_enabled: boolean;
  point_decay_rate: number;

  // Levels
  custom_levels: Level[] | null; // null = use defaults

  // Rewards
  rewards_store_enabled: boolean;

  // Notifications
  achievement_notifications: boolean;
  digest_emails: boolean;
}

export interface WorkspaceGamificationOverrides {
  workspace_id: string;
  tenant_id: string;

  // Feature overrides (null = inherit from tenant)
  points_enabled: boolean | null;
  badges_enabled: boolean | null;
  levels_enabled: boolean | null;
  leaderboards_enabled: boolean | null;
  streaks_enabled: boolean | null;

  // Workspace-specific
  custom_badges: string[]; // badge IDs specific to workspace
  workspace_leaderboard_enabled: boolean;
}

// ─── Default Settings ────────────────────────────────────────────────────────

export const DEFAULT_GAMIFICATION_SETTINGS: Omit<GamificationSettings, 'tenant_id'> = {
  points_enabled: true,
  badges_enabled: true,
  levels_enabled: true,
  leaderboards_enabled: true,
  streaks_enabled: true,
  leaderboard_visibility: 'public',
  profile_visibility: ProfileVisibility.Public,
  point_values: {},
  point_decay_enabled: false,
  point_decay_rate: 0,
  custom_levels: null,
  rewards_store_enabled: false,
  achievement_notifications: true,
  digest_emails: true,
};

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface UpdateGamificationSettingsRequest {
  points_enabled?: boolean;
  badges_enabled?: boolean;
  levels_enabled?: boolean;
  leaderboards_enabled?: boolean;
  streaks_enabled?: boolean;
  leaderboard_visibility?: 'public' | 'opt_in' | 'disabled';
  profile_visibility?: ProfileVisibility;
  point_values?: Record<string, number>;
  point_decay_enabled?: boolean;
  point_decay_rate?: number;
  rewards_store_enabled?: boolean;
  achievement_notifications?: boolean;
  digest_emails?: boolean;
}
