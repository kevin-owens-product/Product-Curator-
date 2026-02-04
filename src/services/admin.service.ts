/**
 * Admin Console Service
 *
 * Platform administration: tenant management, user lookup,
 * system health, and feature flags.
 */

import { v4 as uuid } from 'uuid';
import { FeatureFlag } from '../models/featureflag';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class AdminService {
  private featureFlags = new InMemoryStore<FeatureFlag>();
  private impersonationLog: { admin_id: string; target_user_id: string; reason: string; timestamp: string }[] = [];

  // Feature Flags
  createFeatureFlag(data: { name: string; description: string; enabled?: boolean; plan_availability?: string[] }): FeatureFlag {
    const now = new Date().toISOString();
    const flag: FeatureFlag = {
      id: uuid(),
      name: data.name,
      description: data.description,
      enabled: data.enabled ?? false,
      tenant_overrides: {},
      percentage_rollout: null,
      plan_availability: data.plan_availability || [],
      created_at: now,
      updated_at: now,
    };
    return this.featureFlags.create(flag);
  }

  getFeatureFlags(): FeatureFlag[] {
    return this.featureFlags.getAll();
  }

  getFeatureFlag(id: string): FeatureFlag {
    const flag = this.featureFlags.getById(id);
    if (!flag) throw new NotFoundError('FeatureFlag', id);
    return flag;
  }

  toggleFeatureFlag(id: string, enabled: boolean): FeatureFlag {
    const flag = this.getFeatureFlag(id);
    flag.enabled = enabled;
    flag.updated_at = new Date().toISOString();
    this.featureFlags.update(id, flag);
    return flag;
  }

  setFlagForTenant(flagId: string, tenantId: string, enabled: boolean): FeatureFlag {
    const flag = this.getFeatureFlag(flagId);
    flag.tenant_overrides[tenantId] = enabled;
    flag.updated_at = new Date().toISOString();
    this.featureFlags.update(flagId, flag);
    return flag;
  }

  setPercentageRollout(flagId: string, percentage: number): FeatureFlag {
    if (percentage < 0 || percentage > 100) throw new ValidationError('Percentage must be 0-100');
    const flag = this.getFeatureFlag(flagId);
    flag.percentage_rollout = percentage;
    flag.updated_at = new Date().toISOString();
    this.featureFlags.update(flagId, flag);
    return flag;
  }

  isFlagEnabled(flagId: string, tenantId?: string): boolean {
    const flag = this.featureFlags.getById(flagId);
    if (!flag) return false;
    if (tenantId && tenantId in flag.tenant_overrides) {
      return flag.tenant_overrides[tenantId];
    }
    if (flag.percentage_rollout !== null) {
      const hash = this.simpleHash(tenantId || 'global');
      return hash < flag.percentage_rollout;
    }
    return flag.enabled;
  }

  // Impersonation
  impersonate(adminId: string, targetUserId: string, reason: string): { token: string } {
    if (!reason) throw new ValidationError('Reason is required for impersonation');
    this.impersonationLog.push({
      admin_id: adminId,
      target_user_id: targetUserId,
      reason,
      timestamp: new Date().toISOString(),
    });
    return { token: `impersonation_${uuid()}` };
  }

  getImpersonationLog(): typeof this.impersonationLog {
    return [...this.impersonationLog];
  }

  // System Health
  getSystemHealth(): {
    status: string;
    uptime_seconds: number;
    memory_usage_mb: number;
    active_connections: number;
    error_rate: number;
  } {
    return {
      status: 'healthy',
      uptime_seconds: Math.floor(process.uptime()),
      memory_usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      active_connections: 0,
      error_rate: 0,
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 100;
  }
}
