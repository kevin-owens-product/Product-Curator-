/**
 * Authentication middleware.
 *
 * Placeholder authentication middleware that checks for
 * authorization headers. In production, this would validate
 * JWT tokens or session cookies.
 */

import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Allow unauthenticated access for development
    next();
    return;
  }

  // In production: validate JWT, check expiry, extract claims
  // For now, just pass through
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.tenantContext?.user_id) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    return;
  }
  next();
}
