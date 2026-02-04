/**
 * Gamification Settings Service
 *
 * Manages tenant-level gamification configuration, workspace-level
 * overrides, and individual user preferences.
 */

import {
  GamificationSettings,
  WorkspaceGamificationOverrides,
  DEFAULT_GAMIFICATION_SETTINGS,
  UpdateGamificationSettingsRequest,
} from '../models/settings';
import { UserGamificationPreferences } from '../models/gamification';
import { NotFoundError } from '../utils/errors';

export class SettingsService {
  private tenantSettings = new Map<string, GamificationSettings>();
  private workspaceOverrides = new Map<string, WorkspaceGamificationOverrides>();
  private userPreferences = new Map<string, UserGamificationPreferences>();

  /**
   * Get settings for a tenant, creating defaults if needed.
   */
  getTenantSettings(tenantId: string): GamificationSettings {
    let settings = this.tenantSettings.get(tenantId);
    if (!settings) {
      settings = { tenant_id: tenantId, ...DEFAULT_GAMIFICATION_SETTINGS };
      this.tenantSettings.set(tenantId, settings);
    }
    return { ...settings };
  }

  /**
   * Update tenant-level settings.
   */
  updateTenantSettings(tenantId: string, updates: UpdateGamificationSettingsRequest): GamificationSettings {
    const current = this.getTenantSettings(tenantId);
    const updated: GamificationSettings = { ...current, ...updates };
    this.tenantSettings.set(tenantId, updated);
    return { ...updated };
  }

  /**
   * Get effective settings for a workspace (tenant + overrides).
   */
  getEffectiveSettings(tenantId: string, workspaceId: string): GamificationSettings {
    const tenantSettings = this.getTenantSettings(tenantId);
    const overrides = this.workspaceOverrides.get(workspaceId);

    if (!overrides) return tenantSettings;

    return {
      ...tenantSettings,
      points_enabled: overrides.points_enabled ?? tenantSettings.points_enabled,
      badges_enabled: overrides.badges_enabled ?? tenantSettings.badges_enabled,
      levels_enabled: overrides.levels_enabled ?? tenantSettings.levels_enabled,
      leaderboards_enabled: overrides.leaderboards_enabled ?? tenantSettings.leaderboards_enabled,
      streaks_enabled: overrides.streaks_enabled ?? tenantSettings.streaks_enabled,
    };
  }

  /**
   * Set workspace-level overrides.
   */
  setWorkspaceOverrides(workspaceId: string, tenantId: string, overrides: Partial<WorkspaceGamificationOverrides>): WorkspaceGamificationOverrides {
    const existing = this.workspaceOverrides.get(workspaceId) || {
      workspace_id: workspaceId,
      tenant_id: tenantId,
      points_enabled: null,
      badges_enabled: null,
      levels_enabled: null,
      leaderboards_enabled: null,
      streaks_enabled: null,
      custom_badges: [],
      workspace_leaderboard_enabled: true,
    };

    const updated = { ...existing, ...overrides };
    this.workspaceOverrides.set(workspaceId, updated);
    return { ...updated };
  }

  /**
   * Get user preferences.
   */
  getUserPreferences(userId: string): UserGamificationPreferences {
    let prefs = this.userPreferences.get(userId);
    if (!prefs) {
      prefs = {
        user_id: userId,
        show_on_leaderboard: true,
        profile_public: true,
        achievement_notifications: true,
        weekly_digest: true,
        show_level_badge: true,
        featured_badges: [],
      };
      this.userPreferences.set(userId, prefs);
    }
    return { ...prefs };
  }

  /**
   * Update user preferences.
   */
  updateUserPreferences(userId: string, updates: Partial<UserGamificationPreferences>): UserGamificationPreferences {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...updates };
    this.userPreferences.set(userId, updated);
    return { ...updated };
  }

  /**
   * Check if a specific feature is enabled for a context.
   */
  isFeatureEnabled(tenantId: string, workspaceId: string | null, feature: keyof Pick<GamificationSettings, 'points_enabled' | 'badges_enabled' | 'levels_enabled' | 'leaderboards_enabled' | 'streaks_enabled'>): boolean {
    if (workspaceId) {
      const effective = this.getEffectiveSettings(tenantId, workspaceId);
      return effective[feature];
    }
    return this.getTenantSettings(tenantId)[feature];
  }
}
