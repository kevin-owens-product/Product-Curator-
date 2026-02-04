import { AuthProvider, UserStatus, OrgRole, WorkspaceRole } from './types';

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  auth_provider: AuthProvider;
  external_id: string | null;
  locale: string;
  timezone: string;
  total_points: number;
  level_id: number;
  current_streak: number;
  longest_streak: number;
  status: UserStatus;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMembership {
  id: string;
  user_id: string;
  workspace_id: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface OrganizationRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: OrgRole;
}

export interface Invitation {
  id: string;
  tenant_id: string;
  email: string;
  org_role: OrgRole;
  workspace_memberships: { workspace_id: string; role: WorkspaceRole }[];
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
}

export interface InviteUserRequest {
  tenant_id: string;
  email: string;
  org_role: OrgRole;
  workspace_memberships?: { workspace_id: string; role: WorkspaceRole }[];
  invited_by: string;
}

export interface UpdateUserRoleRequest {
  org_role?: OrgRole;
  workspace_memberships?: { workspace_id: string; role: WorkspaceRole }[];
}
