/**
 * Audit Log Service
 *
 * Records and retrieves audit log entries for all significant actions.
 */

import { v4 as uuid } from 'uuid';
import { AuditLogEntry, CreateAuditEntryRequest, AuditLogFilter } from '../models/audit';
import { InMemoryStore } from '../utils/store';

export class AuditService {
  private entries = new InMemoryStore<AuditLogEntry>();

  log(request: CreateAuditEntryRequest): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuid(),
      tenant_id: request.tenant_id,
      actor_id: request.actor_id,
      actor_type: request.actor_type,
      action: request.action,
      resource_type: request.resource_type,
      resource_id: request.resource_id,
      details: request.details || {},
      ip_address: request.ip_address || null,
      user_agent: request.user_agent || null,
      created_at: new Date().toISOString(),
    };
    return this.entries.create(entry);
  }

  search(filter: AuditLogFilter): { items: AuditLogEntry[]; total: number } {
    let results = this.entries.find(e => e.tenant_id === filter.tenant_id);
    if (filter.actor_id) results = results.filter(e => e.actor_id === filter.actor_id);
    if (filter.action) results = results.filter(e => e.action === filter.action);
    if (filter.resource_type) results = results.filter(e => e.resource_type === filter.resource_type);
    if (filter.from_date) results = results.filter(e => e.created_at >= filter.from_date!);
    if (filter.to_date) results = results.filter(e => e.created_at <= filter.to_date!);

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const total = results.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 50;
    return { items: results.slice(offset, offset + limit), total };
  }

  exportAuditLog(tenantId: string): AuditLogEntry[] {
    return this.entries.find(e => e.tenant_id === tenantId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
}
