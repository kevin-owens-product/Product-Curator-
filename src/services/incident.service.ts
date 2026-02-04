/**
 * Incident Attribution Service
 *
 * Manages incident ingestion, attribution, response workflow,
 * and analytics.
 */

import { v4 as uuid } from 'uuid';
import { Incident, IngestIncidentRequest, IncidentAnalytics } from '../models/incident';
import { IncidentSeverity } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class IncidentService {
  private incidents = new InMemoryStore<Incident>();
  private serviceToAssetMap = new Map<string, string>();
  private assetToOwnerMap = new Map<string, string>();

  configureMapping(serviceToAsset: Map<string, string>, assetToOwner: Map<string, string>): void {
    this.serviceToAssetMap = serviceToAsset;
    this.assetToOwnerMap = assetToOwner;
  }

  ingestIncident(request: IngestIncidentRequest): Incident {
    if (!request.title) throw new ValidationError('Incident title is required');

    const affectedAssets = request.affected_services
      .map(s => this.serviceToAssetMap.get(s))
      .filter((a): a is string => !!a);

    const primaryOwner = affectedAssets.length > 0
      ? this.assetToOwnerMap.get(affectedAssets[0]) || 'unassigned'
      : 'unassigned';

    const incident: Incident = {
      id: uuid(),
      tenant_id: request.tenant_id,
      title: request.title,
      description: request.description,
      severity: request.severity,
      affected_assets: affectedAssets,
      primary_owner: primaryOwner,
      detected_at: new Date().toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      resolution_notes: null,
      root_cause: null,
      post_mortem_url: null,
      source: request.source,
      external_incident_id: request.external_incident_id || null,
    };

    return this.incidents.create(incident);
  }

  getIncident(id: string): Incident {
    const incident = this.incidents.getById(id);
    if (!incident) throw new NotFoundError('Incident', id);
    return incident;
  }

  acknowledgeIncident(id: string): Incident {
    const incident = this.getIncident(id);
    if (incident.acknowledged_at) throw new ValidationError('Already acknowledged');
    incident.acknowledged_at = new Date().toISOString();
    this.incidents.update(id, incident);
    return incident;
  }

  resolveIncident(id: string, notes: string, rootCause?: string, postMortemUrl?: string): Incident {
    const incident = this.getIncident(id);
    if (incident.resolved_at) throw new ValidationError('Already resolved');
    incident.resolved_at = new Date().toISOString();
    incident.resolution_notes = notes;
    incident.root_cause = rootCause || null;
    incident.post_mortem_url = postMortemUrl || null;
    this.incidents.update(id, incident);
    return incident;
  }

  getMyIncidents(ownerId: string): Incident[] {
    return this.incidents.find(i => i.primary_owner === ownerId)
      .sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime());
  }

  getIncidents(tenantId: string, filters?: { severity?: IncidentSeverity; resolved?: boolean }): Incident[] {
    let results = this.incidents.find(i => i.tenant_id === tenantId);
    if (filters?.severity) results = results.filter(i => i.severity === filters.severity);
    if (filters?.resolved !== undefined) {
      results = filters.resolved ? results.filter(i => i.resolved_at !== null) : results.filter(i => i.resolved_at === null);
    }
    return results.sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime());
  }

  getAnalytics(tenantId: string): IncidentAnalytics {
    const incidents = this.incidents.find(i => i.tenant_id === tenantId);
    const bySeverity: Record<string, number> = {};
    const byOwner: Record<string, number> = {};
    const byAsset: Record<string, number> = {};
    let totalTTA = 0, countTTA = 0;
    let totalTTR = 0, countTTR = 0;

    for (const i of incidents) {
      bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
      byOwner[i.primary_owner] = (byOwner[i.primary_owner] || 0) + 1;
      for (const a of i.affected_assets) {
        byAsset[a] = (byAsset[a] || 0) + 1;
      }
      if (i.acknowledged_at) {
        totalTTA += new Date(i.acknowledged_at).getTime() - new Date(i.detected_at).getTime();
        countTTA++;
      }
      if (i.resolved_at) {
        totalTTR += new Date(i.resolved_at).getTime() - new Date(i.detected_at).getTime();
        countTTR++;
      }
    }

    return {
      total_incidents: incidents.length,
      by_severity: bySeverity,
      mean_time_to_acknowledge: countTTA > 0 ? totalTTA / countTTA / 60000 : null,
      mean_time_to_resolve: countTTR > 0 ? totalTTR / countTTR / 60000 : null,
      incidents_by_owner: byOwner,
      incidents_by_asset: byAsset,
      trend: [],
    };
  }
}
