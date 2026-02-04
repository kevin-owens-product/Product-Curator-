/**
 * Metrics & Analytics Service
 *
 * Aggregates data across services for executive, squad,
 * individual, and engagement analytics.
 */

export class AnalyticsService {
  private creationServiceGetter: (() => { getCreationsByTenant(tenantId: string): unknown[] }) | null = null;
  private incidentServiceGetter: (() => { getAnalytics(tenantId: string): unknown }) | null = null;

  configure(deps: {
    getCreationService?: () => { getCreationsByTenant(tenantId: string): unknown[] };
    getIncidentService?: () => { getAnalytics(tenantId: string): unknown };
  }): void {
    if (deps.getCreationService) this.creationServiceGetter = deps.getCreationService;
    if (deps.getIncidentService) this.incidentServiceGetter = deps.getIncidentService;
  }

  getExecutiveDashboard(tenantId: string): {
    metrics: Record<string, { value: number; trend: 'up' | 'down' | 'stable' }>;
    alerts: string[];
  } {
    return {
      metrics: {
        weekly_active_creators: { value: 0, trend: 'stable' },
        curation_queue_depth: { value: 0, trend: 'stable' },
        avg_curation_cycle_hours: { value: 0, trend: 'stable' },
        graduate_rate_percent: { value: 0, trend: 'stable' },
        challenge_participation_percent: { value: 0, trend: 'stable' },
        coherence_score: { value: 100, trend: 'stable' },
        production_incidents: { value: 0, trend: 'stable' },
        orphaned_code_percent: { value: 0, trend: 'stable' },
      },
      alerts: [],
    };
  }

  getSquadAnalytics(tenantId: string, workspaceId: string): {
    creation_count: number;
    graduation_rate: number;
    curation_pipeline: { pending: number; in_review: number; decided: number };
    ownership_coverage: number;
    incident_rate: number;
    gamification_engagement: number;
  } {
    return {
      creation_count: 0,
      graduation_rate: 0,
      curation_pipeline: { pending: 0, in_review: 0, decided: 0 },
      ownership_coverage: 100,
      incident_rate: 0,
      gamification_engagement: 0,
    };
  }

  getIndividualAnalytics(userId: string): {
    creations: number;
    graduation_rate: number;
    ownership_health: number;
    incident_response_avg_minutes: number;
    points: number;
    achievements: number;
  } {
    return {
      creations: 0,
      graduation_rate: 0,
      ownership_health: 100,
      incident_response_avg_minutes: 0,
      points: 0,
      achievements: 0,
    };
  }

  getEngagementAnalytics(tenantId: string): {
    participation_rate: number;
    points_gini_coefficient: number;
    badge_earning_rate: number;
    challenge_effectiveness: number;
    hackathon_attendance_rate: number;
    health: 'healthy' | 'warning' | 'critical';
  } {
    return {
      participation_rate: 0,
      points_gini_coefficient: 0,
      badge_earning_rate: 0,
      challenge_effectiveness: 0,
      hackathon_attendance_rate: 0,
      health: 'healthy',
    };
  }
}
