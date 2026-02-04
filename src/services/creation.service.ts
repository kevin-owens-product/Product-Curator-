/**
 * Creation Registry Service
 *
 * Manages the lifecycle of creations: registration, discovery,
 * collaboration, and status management.
 */

import { v4 as uuid } from 'uuid';
import { Creation, CreateCreationRequest, UpdateCreationRequest, CreationFilter } from '../models/creation';
import { CreationStatus, PointAction } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class CreationService {
  private creations = new InMemoryStore<Creation>();

  createCreation(request: CreateCreationRequest): Creation {
    if (!request.title || !request.description) {
      throw new ValidationError('Title and description are required');
    }

    const creation: Creation = {
      id: uuid(),
      tenant_id: request.tenant_id,
      workspace_id: request.workspace_id,
      title: request.title,
      description: request.description,
      problem_statement: request.problem_statement || '',
      creator_id: request.creator_id,
      status: CreationStatus.Draft,
      repository_url: request.repository_url || null,
      prototype_url: request.prototype_url || null,
      documentation_url: request.documentation_url || null,
      curation_submission_id: null,
      challenge_id: request.challenge_id || null,
      similar_creations: [],
      collaborators: [],
      related_production_assets: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.creations.create(creation);
  }

  getCreation(id: string): Creation {
    const creation = this.creations.getById(id);
    if (!creation) throw new NotFoundError('Creation', id);
    return creation;
  }

  updateCreation(id: string, updates: UpdateCreationRequest): Creation {
    const creation = this.getCreation(id);
    const updated: Creation = {
      ...creation,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.creations.update(id, updated);
    return updated;
  }

  updateStatus(id: string, status: CreationStatus): Creation {
    const creation = this.getCreation(id);
    const validTransitions: Record<CreationStatus, CreationStatus[]> = {
      [CreationStatus.Draft]: [CreationStatus.InProgress, CreationStatus.Killed],
      [CreationStatus.InProgress]: [CreationStatus.Submitted, CreationStatus.Killed],
      [CreationStatus.Submitted]: [CreationStatus.InReview],
      [CreationStatus.InReview]: [CreationStatus.Graduated, CreationStatus.Killed, CreationStatus.Parked],
      [CreationStatus.Graduated]: [],
      [CreationStatus.Killed]: [],
      [CreationStatus.Parked]: [CreationStatus.InProgress],
    };

    if (!validTransitions[creation.status]?.includes(status)) {
      throw new ValidationError(`Cannot transition from ${creation.status} to ${status}`);
    }

    return this.updateCreation(id, { status });
  }

  discoverCreations(filter: CreationFilter): { items: Creation[]; total: number } {
    let results = this.creations.getAll();

    if (filter.workspace_id) {
      results = results.filter(c => c.workspace_id === filter.workspace_id);
    }
    if (filter.status) {
      results = results.filter(c => c.status === filter.status);
    }
    if (filter.creator_id) {
      results = results.filter(c => c.creator_id === filter.creator_id);
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      results = results.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const total = results.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 20;
    return { items: results.slice(offset, offset + limit), total };
  }

  searchCreations(query: string, tenantId: string): Creation[] {
    const search = query.toLowerCase();
    return this.creations
      .find(c => c.tenant_id === tenantId)
      .filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.problem_statement.toLowerCase().includes(search)
      )
      .slice(0, 20);
  }

  findSimilar(creationId: string): Creation[] {
    const creation = this.getCreation(creationId);
    const words = creation.title.toLowerCase().split(/\s+/);
    return this.creations
      .find(c => c.id !== creationId && c.tenant_id === creation.tenant_id)
      .filter(c => words.some(w => c.title.toLowerCase().includes(w) || c.description.toLowerCase().includes(w)))
      .slice(0, 5);
  }

  addCollaborator(creationId: string, userId: string): Creation {
    const creation = this.getCreation(creationId);
    if (creation.collaborators.includes(userId)) {
      throw new ValidationError('User is already a collaborator');
    }
    creation.collaborators.push(userId);
    creation.updated_at = new Date().toISOString();
    this.creations.update(creationId, creation);
    return creation;
  }

  removeCollaborator(creationId: string, userId: string): Creation {
    const creation = this.getCreation(creationId);
    creation.collaborators = creation.collaborators.filter(id => id !== userId);
    creation.updated_at = new Date().toISOString();
    this.creations.update(creationId, creation);
    return creation;
  }

  setCurationSubmission(creationId: string, submissionId: string): void {
    const creation = this.getCreation(creationId);
    creation.curation_submission_id = submissionId;
    creation.updated_at = new Date().toISOString();
    this.creations.update(creationId, creation);
  }

  getCreationsByTenant(tenantId: string): Creation[] {
    return this.creations.find(c => c.tenant_id === tenantId);
  }

  getCreationCount(tenantId: string): number {
    return this.creations.find(c => c.tenant_id === tenantId).length;
  }
}
