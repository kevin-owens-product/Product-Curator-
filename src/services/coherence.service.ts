/**
 * Coherence Dashboard Service
 *
 * Manages patterns, compliance checking, coherence scoring,
 * and coherence flag management.
 */

import { v4 as uuid } from 'uuid';
import { Pattern, CoherenceFlag, CreatePatternRequest, CreateCoherenceFlagRequest, CoherenceScore } from '../models/coherence';
import { PatternStatus, CoherenceFlagStatus, CoherenceFlagSeverity } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class CoherenceService {
  private patterns = new InMemoryStore<Pattern>();
  private flags = new InMemoryStore<CoherenceFlag>();

  createPattern(request: CreatePatternRequest): Pattern {
    if (!request.name) throw new ValidationError('Pattern name is required');

    const pattern: Pattern = {
      id: uuid(),
      tenant_id: request.tenant_id,
      name: request.name,
      description: request.description,
      category: request.category,
      documentation_url: request.documentation_url,
      examples: request.examples || [],
      production_assets_using: [],
      status: PatternStatus.Active,
      introduced_at: new Date().toISOString(),
      deprecated_at: null,
    };

    return this.patterns.create(pattern);
  }

  getPatterns(tenantId: string, category?: string): Pattern[] {
    let patterns = this.patterns.find(p => p.tenant_id === tenantId);
    if (category) {
      patterns = patterns.filter(p => p.category === category);
    }
    return patterns;
  }

  getPattern(id: string): Pattern {
    const p = this.patterns.getById(id);
    if (!p) throw new NotFoundError('Pattern', id);
    return p;
  }

  deprecatePattern(id: string): Pattern {
    const pattern = this.getPattern(id);
    pattern.status = PatternStatus.Deprecated;
    pattern.deprecated_at = new Date().toISOString();
    this.patterns.update(id, pattern);
    return pattern;
  }

  flagCoherenceIssue(request: CreateCoherenceFlagRequest): CoherenceFlag {
    if (!request.description) throw new ValidationError('Description is required');

    const flag: CoherenceFlag = {
      id: uuid(),
      production_asset_id: request.production_asset_id,
      flagged_by: request.flagged_by,
      flagged_at: new Date().toISOString(),
      type: request.type,
      description: request.description,
      severity: request.severity,
      status: CoherenceFlagStatus.Open,
      resolved_at: null,
      resolution_notes: null,
    };

    return this.flags.create(flag);
  }

  resolveFlag(flagId: string, status: CoherenceFlagStatus, notes: string): CoherenceFlag {
    const flag = this.flags.getById(flagId);
    if (!flag) throw new NotFoundError('CoherenceFlag', flagId);

    flag.status = status;
    flag.resolution_notes = notes;
    if (status === CoherenceFlagStatus.Resolved || status === CoherenceFlagStatus.WontFix) {
      flag.resolved_at = new Date().toISOString();
    }
    this.flags.update(flagId, flag);
    return flag;
  }

  getOpenFlags(tenantId?: string): CoherenceFlag[] {
    return this.flags.find(f => f.status === CoherenceFlagStatus.Open);
  }

  computeCoherenceScore(tenantId: string): CoherenceScore {
    const allFlags = this.flags.getAll();
    const openFlags = allFlags.filter(f => f.status === CoherenceFlagStatus.Open);

    const severityWeights: Record<CoherenceFlagSeverity, number> = {
      [CoherenceFlagSeverity.Low]: 1,
      [CoherenceFlagSeverity.Medium]: 3,
      [CoherenceFlagSeverity.High]: 5,
    };

    const openFlagsWeighted = openFlags.reduce((sum, f) => sum + severityWeights[f.severity], 0);
    const patterns = this.patterns.find(p => p.tenant_id === tenantId);
    const activePatterns = patterns.filter(p => p.status === PatternStatus.Active);
    const complianceRate = activePatterns.length > 0 ? (activePatterns.length / patterns.length) * 100 : 100;

    const duplicateCount = openFlags.filter(f => f.type === 'duplicate_functionality').length;
    const driftCount = openFlags.filter(f => f.type === 'architectural_drift').length;

    const overall = Math.max(0, 100 - openFlagsWeighted * 2);

    return {
      overall,
      pattern_compliance_rate: complianceRate,
      open_flags_weighted: openFlagsWeighted,
      duplicate_functionality_count: duplicateCount,
      architectural_drift_count: driftCount,
    };
  }

  getConfirmedFlagCount(userId: string): number {
    return this.flags.find(f =>
      f.flagged_by === userId &&
      (f.status === CoherenceFlagStatus.Resolved || f.status === CoherenceFlagStatus.Acknowledged)
    ).length;
  }
}
