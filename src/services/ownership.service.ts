/**
 * Ownership Registry Service
 *
 * Manages production asset ownership, transfers, and auditing.
 */

import { v4 as uuid } from 'uuid';
import { ProductionAsset, OwnershipRecord, CreateProductionAssetRequest, TransferOwnershipRequest, OwnershipAuditFilter } from '../models/ownership';
import { ProductionAssetStatus } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class OwnershipService {
  private assets = new InMemoryStore<ProductionAsset>();

  createAsset(request: CreateProductionAssetRequest): ProductionAsset {
    if (!request.name || !request.owner_id) {
      throw new ValidationError('Name and owner are required');
    }

    const now = new Date().toISOString();
    const asset: ProductionAsset = {
      id: uuid(),
      tenant_id: request.tenant_id,
      workspace_id: request.workspace_id,
      name: request.name,
      description: request.description,
      type: request.type,
      owner_id: request.owner_id,
      ownership_started_at: now,
      ownership_history: [{
        id: uuid(),
        production_asset_id: '',
        owner_id: request.owner_id,
        started_at: now,
        ended_at: null,
        transfer_reason: 'Initial assignment',
        transferred_to: null,
      }],
      graduated_from: request.graduated_from || null,
      graduated_at: request.graduated_from ? now : null,
      repository: request.repository,
      code_paths: request.code_paths || [],
      dependencies: [],
      dependents: [],
      status: ProductionAssetStatus.Active,
      health_score: 100,
      last_incident_at: null,
      patterns_used: [],
      coherence_flags: [],
      documentation_url: request.documentation_url,
      runbook_url: request.runbook_url || null,
      created_at: now,
      updated_at: now,
    };

    asset.ownership_history[0].production_asset_id = asset.id;
    return this.assets.create(asset);
  }

  getAsset(id: string): ProductionAsset {
    const asset = this.assets.getById(id);
    if (!asset) throw new NotFoundError('ProductionAsset', id);
    return asset;
  }

  getMyAssets(ownerId: string): ProductionAsset[] {
    return this.assets.find(a => a.owner_id === ownerId && a.status === ProductionAssetStatus.Active);
  }

  transferOwnership(assetId: string, request: TransferOwnershipRequest): ProductionAsset {
    const asset = this.getAsset(assetId);
    if (!request.new_owner_id || !request.transfer_reason) {
      throw new ValidationError('New owner and reason are required');
    }

    const now = new Date().toISOString();
    const currentRecord = asset.ownership_history.find(r => !r.ended_at);
    if (currentRecord) {
      currentRecord.ended_at = now;
      currentRecord.transferred_to = request.new_owner_id;
    }

    asset.ownership_history.push({
      id: uuid(),
      production_asset_id: assetId,
      owner_id: request.new_owner_id,
      started_at: now,
      ended_at: null,
      transfer_reason: request.transfer_reason,
      transferred_to: null,
    });

    asset.owner_id = request.new_owner_id;
    asset.ownership_started_at = now;
    asset.updated_at = now;
    this.assets.update(assetId, asset);
    return asset;
  }

  deprecateAsset(assetId: string): ProductionAsset {
    const asset = this.getAsset(assetId);
    asset.status = ProductionAssetStatus.Deprecated;
    asset.updated_at = new Date().toISOString();
    this.assets.update(assetId, asset);
    return asset;
  }

  searchDirectory(query: string, tenantId: string): ProductionAsset[] {
    const search = query.toLowerCase();
    return this.assets
      .find(a => a.tenant_id === tenantId)
      .filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.code_paths.some(p => p.toLowerCase().includes(search))
      );
  }

  auditOwnership(filter: OwnershipAuditFilter): { assets: ProductionAsset[]; orphaned: ProductionAsset[]; stale: ProductionAsset[] } {
    let assets = this.assets.find(a => a.tenant_id === filter.tenant_id && a.status === ProductionAssetStatus.Active);
    if (filter.workspace_id) {
      assets = assets.filter(a => a.workspace_id === filter.workspace_id);
    }

    const orphaned = assets.filter(a => !a.owner_id);
    const staleDays = filter.stale_days || 90;
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - staleDays);
    const stale = assets.filter(a => new Date(a.updated_at) < staleDate);

    return { assets, orphaned, stale };
  }

  getAssetsByTenant(tenantId: string): ProductionAsset[] {
    return this.assets.find(a => a.tenant_id === tenantId);
  }

  getAssetCount(tenantId: string): number {
    return this.assets.find(a => a.tenant_id === tenantId && a.status === ProductionAssetStatus.Active).length;
  }

  recordIncident(assetId: string): void {
    const asset = this.getAsset(assetId);
    asset.last_incident_at = new Date().toISOString();
    asset.health_score = Math.max(0, asset.health_score - 10);
    asset.updated_at = new Date().toISOString();
    this.assets.update(assetId, asset);
  }
}
