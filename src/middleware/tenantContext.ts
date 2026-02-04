/**
 * Tenant context middleware.
 *
 * Extracts tenant information from request headers and attaches
 * it to the request for downstream handlers.
 */

import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  tenant_id: string;
  user_id: string;
  workspace_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

export function tenantContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.headers['x-user-id'] as string;
  const workspaceId = req.headers['x-workspace-id'] as string | undefined;

  if (tenantId && userId) {
    req.tenantContext = {
      tenant_id: tenantId,
      user_id: userId,
      workspace_id: workspaceId,
    };
  }

  next();
}
