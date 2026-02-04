/**
 * Tenant & Workspace Service
 *
 * Manages tenant lifecycle, workspace management, and onboarding.
 */

import { v4 as uuid } from 'uuid';
import { Tenant, Workspace, CreateTenantRequest, CreateWorkspaceRequest, OnboardingChecklist } from '../models/tenant';
import { SubscriptionPlan, SubscriptionStatus, DataResidencyRegion } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';

export class TenantService {
  private tenants = new InMemoryStore<Tenant>();
  private workspaces = new InMemoryStore<Workspace>();

  createTenant(request: CreateTenantRequest): Tenant {
    if (!request.name || !request.slug) {
      throw new ValidationError('Name and slug are required');
    }

    const existing = this.tenants.findOne(t => t.slug === request.slug);
    if (existing) throw new ConflictError(`Slug '${request.slug}' is already taken`);

    const now = new Date().toISOString();
    const tenant: Tenant = {
      id: uuid(),
      name: request.name,
      slug: request.slug,
      plan: request.plan || SubscriptionPlan.Free,
      subscription_status: SubscriptionStatus.Trialing,
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      default_locale: request.default_locale || 'en-US',
      timezone: request.timezone || 'UTC',
      logo_url: null,
      primary_color: null,
      custom_domain: null,
      data_residency_region: request.data_residency_region || DataResidencyRegion.US,
      created_at: now,
      updated_at: now,
    };

    return this.tenants.create(tenant);
  }

  getTenant(id: string): Tenant {
    const tenant = this.tenants.getById(id);
    if (!tenant) throw new NotFoundError('Tenant', id);
    return tenant;
  }

  getTenantBySlug(slug: string): Tenant {
    const tenant = this.tenants.findOne(t => t.slug === slug);
    if (!tenant) throw new NotFoundError('Tenant', slug);
    return tenant;
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant {
    const tenant = this.getTenant(id);
    const updated = { ...tenant, ...updates, updated_at: new Date().toISOString() };
    this.tenants.update(id, updated);
    return updated;
  }

  listTenants(): Tenant[] {
    return this.tenants.getAll();
  }

  createWorkspace(request: CreateWorkspaceRequest): Workspace {
    if (!request.name || !request.slug) {
      throw new ValidationError('Name and slug are required');
    }
    this.getTenant(request.tenant_id);

    const existing = this.workspaces.findOne(
      w => w.tenant_id === request.tenant_id && w.slug === request.slug
    );
    if (existing) throw new ConflictError(`Workspace slug '${request.slug}' exists in this tenant`);

    const now = new Date().toISOString();
    const workspace: Workspace = {
      id: uuid(),
      tenant_id: request.tenant_id,
      name: request.name,
      slug: request.slug,
      description: request.description || null,
      created_at: now,
      updated_at: now,
    };

    return this.workspaces.create(workspace);
  }

  getWorkspace(id: string): Workspace {
    const ws = this.workspaces.getById(id);
    if (!ws) throw new NotFoundError('Workspace', id);
    return ws;
  }

  listWorkspaces(tenantId: string): Workspace[] {
    return this.workspaces.find(w => w.tenant_id === tenantId);
  }

  getWorkspaceCount(tenantId: string): number {
    return this.workspaces.find(w => w.tenant_id === tenantId).length;
  }

  getOnboardingChecklist(tenantId: string): OnboardingChecklist {
    const items = [
      { key: 'first_creation', label: 'Create your first creation', completed: false },
      { key: 'invite_members', label: 'Invite team members', completed: false },
      { key: 'connect_github', label: 'Connect source control (GitHub)', completed: false },
      { key: 'designate_curators', label: 'Designate Production Curators', completed: false },
      { key: 'setup_slack', label: 'Set up Slack notifications', completed: false },
      { key: 'first_curation', label: 'Submit first curation', completed: false },
      { key: 'first_challenge', label: 'Run first challenge', completed: false },
    ];
    const completed = items.filter(i => i.completed).length;
    return { items, progress: (completed / items.length) * 100 };
  }
}
