/**
 * User Management API routes.
 */

import { Router } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../middleware/errorHandler';

export function createUserRoutes(userService: UserService): Router {
  const router = Router();

  router.post('/', asyncHandler(async (req, res) => {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const user = userService.getUser(req.params.id);
    res.json(user);
  }));

  router.get('/tenant/:tenantId', asyncHandler(async (req, res) => {
    const users = userService.getUsersByTenant(req.params.tenantId);
    res.json(users);
  }));

  // Invitations
  router.post('/invitations', asyncHandler(async (req, res) => {
    const invitation = userService.inviteUser(req.body);
    res.status(201).json(invitation);
  }));

  router.post('/invitations/:id/accept', asyncHandler(async (req, res) => {
    const user = userService.acceptInvitation(req.params.id, req.body.name);
    res.status(201).json(user);
  }));

  // Workspace memberships
  router.post('/:userId/workspaces', asyncHandler(async (req, res) => {
    const membership = userService.addWorkspaceMembership(req.params.userId, req.body.workspace_id, req.body.role);
    res.status(201).json(membership);
  }));

  router.get('/:userId/workspaces', asyncHandler(async (req, res) => {
    const workspaces = userService.getUserWorkspaces(req.params.userId);
    res.json(workspaces);
  }));

  // Role management
  router.patch('/:userId/role', asyncHandler(async (req, res) => {
    userService.updateRole(req.params.userId, req.body);
    res.json({ success: true });
  }));

  // Deactivate/Reactivate
  router.post('/:userId/deactivate', asyncHandler(async (req, res) => {
    const user = userService.deactivateUser(req.params.userId);
    res.json(user);
  }));

  router.post('/:userId/reactivate', asyncHandler(async (req, res) => {
    const user = userService.reactivateUser(req.params.userId);
    res.json(user);
  }));

  return router;
}
