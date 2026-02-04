/**
 * Role-Based Access Control middleware.
 *
 * Provides middleware factories for checking organizational
 * and workspace roles.
 */

import { Request, Response, NextFunction } from 'express';

type OrgRoleLevel = 'owner' | 'admin' | 'member';
type WorkspaceRoleLevel = 'admin' | 'curator' | 'creator';

const ORG_ROLE_HIERARCHY: Record<OrgRoleLevel, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

const WORKSPACE_ROLE_HIERARCHY: Record<WorkspaceRoleLevel, number> = {
  admin: 3,
  curator: 2,
  creator: 1,
};

export function requireOrgRole(minimumRole: OrgRoleLevel) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // In production, look up user's org role from the database
    // For now, allow all authenticated requests through
    const userRole = req.headers['x-org-role'] as OrgRoleLevel | undefined;

    if (userRole && ORG_ROLE_HIERARCHY[userRole] < ORG_ROLE_HIERARCHY[minimumRole]) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Requires organization role: ${minimumRole}`,
        },
      });
      return;
    }

    next();
  };
}

export function requireWorkspaceRole(minimumRole: WorkspaceRoleLevel) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // In production, look up user's workspace role from the database
    const userRole = req.headers['x-workspace-role'] as WorkspaceRoleLevel | undefined;

    if (userRole && WORKSPACE_ROLE_HIERARCHY[userRole] < WORKSPACE_ROLE_HIERARCHY[minimumRole]) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Requires workspace role: ${minimumRole}`,
        },
      });
      return;
    }

    next();
  };
}
