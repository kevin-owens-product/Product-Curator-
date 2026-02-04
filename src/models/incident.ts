import { IncidentSeverity, IncidentSource } from './types';

export interface Incident {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  affected_assets: string[];
  primary_owner: string;
  detected_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  root_cause: string | null;
  post_mortem_url: string | null;
  source: IncidentSource;
  external_incident_id: string | null;
}

export interface IngestIncidentRequest {
  tenant_id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  affected_services: string[];
  source: IncidentSource;
  external_incident_id?: string;
}

export interface IncidentAnalytics {
  total_incidents: number;
  by_severity: Record<string, number>;
  mean_time_to_acknowledge: number | null;
  mean_time_to_resolve: number | null;
  incidents_by_owner: Record<string, number>;
  incidents_by_asset: Record<string, number>;
  trend: { period: string; count: number }[];
}
