/**
 * Blast Radius Engine Service
 *
 * Analyzes creations for potential impact, detects dependencies,
 * and recommends change tiers.
 */

import { v4 as uuid } from 'uuid';
import { BlastRadiusAssessment, AnalyzeCreationRequest, ManualBlastRadiusInput, TIER_RECOMMENDATION_RULES } from '../models/blastradius';
import { ChangeTier } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError } from '../utils/errors';

export class BlastRadiusService {
  private assessments = new InMemoryStore<BlastRadiusAssessment>();

  analyzeCreation(request: AnalyzeCreationRequest): BlastRadiusAssessment {
    const assessment: BlastRadiusAssessment = {
      id: uuid(),
      creation_id: request.creation_id,
      assessed_by: request.assessed_by,
      assessed_at: new Date().toISOString(),
      detected_dependencies: [],
      detected_database_impacts: [],
      detected_api_changes: [],
      estimated_tier: ChangeTier.Tier1,
      curator_notes: null,
      curator_tier_override: null,
      curator_concerns: [],
      affects_auth: false,
      affects_billing: false,
      affects_data_model: false,
      new_external_dependency: false,
      breaking_api_change: false,
    };

    assessment.estimated_tier = this.recommendTier(assessment);
    return this.assessments.create(assessment);
  }

  getAssessment(id: string): BlastRadiusAssessment {
    const a = this.assessments.getById(id);
    if (!a) throw new NotFoundError('BlastRadiusAssessment', id);
    return a;
  }

  getAssessmentByCreation(creationId: string): BlastRadiusAssessment | null {
    return this.assessments.findOne(a => a.creation_id === creationId) || null;
  }

  addManualInput(assessmentId: string, input: ManualBlastRadiusInput): BlastRadiusAssessment {
    const assessment = this.getAssessment(assessmentId);
    if (input.additional_systems) {
      assessment.detected_dependencies.push(...input.additional_systems);
    }
    if (input.known_risks) {
      assessment.curator_concerns.push(...input.known_risks);
    }
    assessment.estimated_tier = this.recommendTier(assessment);
    this.assessments.update(assessmentId, assessment);
    return assessment;
  }

  overrideTier(assessmentId: string, tier: ChangeTier, curatorNotes: string): BlastRadiusAssessment {
    const assessment = this.getAssessment(assessmentId);
    assessment.curator_tier_override = tier;
    assessment.curator_notes = curatorNotes;
    this.assessments.update(assessmentId, assessment);
    return assessment;
  }

  recommendTier(assessment: BlastRadiusAssessment): ChangeTier {
    const { tier4_triggers, tier3_threshold_dependencies, tier2_threshold_dependencies } = TIER_RECOMMENDATION_RULES;

    for (const trigger of tier4_triggers) {
      if (assessment[trigger]) return ChangeTier.Tier4;
    }

    const depCount = assessment.detected_dependencies.length;
    if (depCount >= tier3_threshold_dependencies || assessment.new_external_dependency) {
      return ChangeTier.Tier3;
    }
    if (depCount >= tier2_threshold_dependencies) {
      return ChangeTier.Tier2;
    }
    return ChangeTier.Tier1;
  }

  generateVisualization(assessmentId: string): { nodes: { id: string; label: string; risk: string }[]; edges: { source: string; target: string }[] } {
    const assessment = this.getAssessment(assessmentId);
    const nodes = [
      { id: assessment.creation_id, label: 'Creation', risk: 'source' },
      ...assessment.detected_dependencies.map(dep => ({
        id: dep,
        label: dep,
        risk: assessment.curator_concerns.length > 0 ? 'high' : 'medium',
      })),
    ];
    const edges = assessment.detected_dependencies.map(dep => ({
      source: assessment.creation_id,
      target: dep,
    }));
    return { nodes, edges };
  }
}
