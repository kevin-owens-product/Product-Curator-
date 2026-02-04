/**
 * User Management Service
 *
 * Manages users, invitations, roles, and workspace memberships.
 */

import { v4 as uuid } from 'uuid';
import { User, WorkspaceMembership, OrganizationRole, Invitation, InviteUserRequest, UpdateUserRoleRequest } from '../models/user';
import { UserStatus, AuthProvider, OrgRole, WorkspaceRole } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';

export class UserService {
  private users = new InMemoryStore<User>();
  private memberships = new InMemoryStore<WorkspaceMembership>();
  private orgRoles = new InMemoryStore<OrganizationRole>();
  private invitations = new InMemoryStore<Invitation>();

  createUser(data: { tenant_id: string; email: string; name: string; auth_provider?: AuthProvider; org_role?: OrgRole }): User {
    const existing = this.users.findOne(u => u.tenant_id === data.tenant_id && u.email === data.email);
    if (existing) throw new ConflictError(`User with email ${data.email} already exists`);

    const now = new Date().toISOString();
    const user: User = {
      id: uuid(),
      tenant_id: data.tenant_id,
      email: data.email,
      name: data.name,
      avatar_url: null,
      auth_provider: data.auth_provider || AuthProvider.Email,
      external_id: null,
      locale: 'en-US',
      timezone: 'UTC',
      total_points: 0,
      level_id: 1,
      current_streak: 0,
      longest_streak: 0,
      status: UserStatus.Active,
      last_active_at: now,
      created_at: now,
      updated_at: now,
    };

    this.users.create(user);

    this.orgRoles.create({
      id: uuid(),
      user_id: user.id,
      tenant_id: data.tenant_id,
      role: data.org_role || OrgRole.Member,
    });

    return user;
  }

  getUser(id: string): User {
    const user = this.users.getById(id);
    if (!user) throw new NotFoundError('User', id);
    return user;
  }

  getUsersByTenant(tenantId: string): User[] {
    return this.users.find(u => u.tenant_id === tenantId);
  }

  getUserCount(tenantId: string): number {
    return this.users.find(u => u.tenant_id === tenantId && u.status === UserStatus.Active).length;
  }

  inviteUser(request: InviteUserRequest): Invitation {
    const existing = this.invitations.findOne(
      i => i.tenant_id === request.tenant_id && i.email === request.email && i.status === 'pending'
    );
    if (existing) throw new ConflictError('Invitation already pending for this email');

    const invitation: Invitation = {
      id: uuid(),
      tenant_id: request.tenant_id,
      email: request.email,
      org_role: request.org_role,
      workspace_memberships: request.workspace_memberships || [],
      invited_by: request.invited_by,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    return this.invitations.create(invitation);
  }

  acceptInvitation(invitationId: string, name: string): User {
    const invitation = this.invitations.getById(invitationId);
    if (!invitation) throw new NotFoundError('Invitation', invitationId);
    if (invitation.status !== 'pending') throw new ValidationError('Invitation is not pending');
    if (new Date(invitation.expires_at) < new Date()) {
      invitation.status = 'expired';
      this.invitations.update(invitationId, invitation);
      throw new ValidationError('Invitation has expired');
    }

    const user = this.createUser({
      tenant_id: invitation.tenant_id,
      email: invitation.email,
      name,
      org_role: invitation.org_role,
    });

    for (const wm of invitation.workspace_memberships) {
      this.addWorkspaceMembership(user.id, wm.workspace_id, wm.role);
    }

    invitation.status = 'accepted';
    this.invitations.update(invitationId, invitation);
    return user;
  }

  addWorkspaceMembership(userId: string, workspaceId: string, role: WorkspaceRole): WorkspaceMembership {
    const membership: WorkspaceMembership = {
      id: uuid(),
      user_id: userId,
      workspace_id: workspaceId,
      role,
      joined_at: new Date().toISOString(),
    };
    return this.memberships.create(membership);
  }

  getUserWorkspaces(userId: string): WorkspaceMembership[] {
    return this.memberships.find(m => m.user_id === userId);
  }

  updateRole(userId: string, updates: UpdateUserRoleRequest): void {
    if (updates.org_role) {
      const orgRole = this.orgRoles.findOne(r => r.user_id === userId);
      if (orgRole) {
        orgRole.role = updates.org_role;
        this.orgRoles.update(orgRole.id, orgRole);
      }
    }
  }

  deactivateUser(userId: string): User {
    const user = this.getUser(userId);
    user.status = UserStatus.Deactivated;
    user.updated_at = new Date().toISOString();
    this.users.update(userId, user);
    return user;
  }

  reactivateUser(userId: string): User {
    const user = this.getUser(userId);
    user.status = UserStatus.Active;
    user.updated_at = new Date().toISOString();
    this.users.update(userId, user);
    return user;
  }

  getOrgRole(userId: string): OrgRole | null {
    const role = this.orgRoles.findOne(r => r.user_id === userId);
    return role ? role.role : null;
  }
}
