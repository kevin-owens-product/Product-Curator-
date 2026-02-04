import { AuditActorType } from './types';

export interface AuditLogEntry {
  id: string;
  tenant_id: string;
  actor_id: string;
  actor_type: AuditActorType;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CreateAuditEntryRequest {
  tenant_id: string;
  actor_id: string;
  actor_type: AuditActorType;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditLogFilter {
  tenant_id: string;
  actor_id?: string;
  action?: string;
  resource_type?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}
