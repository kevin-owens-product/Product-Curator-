/**
 * Curation Workflow Service
 *
 * Manages the curation submission and review process, including
 * the Five Questions framework and decision tracking.
 */

import { v4 as uuid } from 'uuid';
import { CurationSubmission, SubmitForCurationRequest, CurationDecisionRequest, CurationQueueFilter, CURATION_DECISION_POINTS } from '../models/curation';
import { CurationSubmissionStatus, CurationDecision, PointAction } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';

export class CurationService {
  private submissions = new InMemoryStore<CurationSubmission>();

  submitForCuration(request: SubmitForCurationRequest): CurationSubmission {
    if (!request.q1_should_exist || !request.q2_what_breaks || !request.q3_does_it_fit || !request.q4_who_owns || !request.q5_burden) {
      throw new ValidationError('All five curation questions must be answered');
    }

    const submission: CurationSubmission = {
      id: uuid(),
      creation_id: request.creation_id,
      submitted_by: request.submitted_by,
      submitted_at: new Date().toISOString(),
      q1_should_exist: request.q1_should_exist,
      q2_what_breaks: request.q2_what_breaks,
      q3_does_it_fit: request.q3_does_it_fit,
      q4_who_owns: request.q4_who_owns,
      q5_burden: request.q5_burden,
      blast_radius_assessment_id: request.blast_radius_assessment_id || null,
      proposed_tier: request.proposed_tier,
      assigned_curator: null,
      status: CurationSubmissionStatus.Pending,
      decision: null,
      decision_rationale: null,
      decision_at: null,
      decided_by: null,
      iteration_count: 0,
      previous_submissions: [],
      points_awarded: 0,
    };

    return this.submissions.create(submission);
  }

  getSubmission(id: string): CurationSubmission {
    const sub = this.submissions.getById(id);
    if (!sub) throw new NotFoundError('CurationSubmission', id);
    return sub;
  }

  getCurationQueue(filter: CurationQueueFilter): { items: CurationSubmission[]; total: number } {
    let results = this.submissions.getAll();

    if (filter.status) {
      results = results.filter(s => s.status === filter.status);
    }
    if (filter.tier) {
      results = results.filter(s => s.proposed_tier === filter.tier);
    }
    if (filter.assigned_curator) {
      results = results.filter(s => s.assigned_curator === filter.assigned_curator);
    }

    results.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    const total = results.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 20;
    return { items: results.slice(offset, offset + limit), total };
  }

  claimSubmission(submissionId: string, curatorId: string): CurationSubmission {
    const sub = this.getSubmission(submissionId);
    if (sub.status !== CurationSubmissionStatus.Pending) {
      throw new ValidationError('Submission is not in pending status');
    }
    sub.assigned_curator = curatorId;
    sub.status = CurationSubmissionStatus.InReview;
    this.submissions.update(submissionId, sub);
    return sub;
  }

  decideCuration(submissionId: string, request: CurationDecisionRequest): CurationSubmission {
    const sub = this.getSubmission(submissionId);
    if (sub.status !== CurationSubmissionStatus.InReview) {
      throw new ValidationError('Submission must be in review to decide');
    }
    if (!request.decision_rationale) {
      throw new ValidationError('Decision rationale is required');
    }

    sub.decision = request.decision;
    sub.decision_rationale = request.decision_rationale;
    sub.decided_by = request.decided_by;
    sub.decision_at = new Date().toISOString();
    sub.status = CurationSubmissionStatus.Decided;
    sub.points_awarded = CURATION_DECISION_POINTS[request.decision];

    this.submissions.update(submissionId, sub);
    return sub;
  }

  resubmit(previousSubmissionId: string, request: SubmitForCurationRequest): CurationSubmission {
    const previous = this.getSubmission(previousSubmissionId);
    const newSub = this.submitForCuration(request);
    newSub.iteration_count = previous.iteration_count + 1;
    newSub.previous_submissions = [...previous.previous_submissions, previousSubmissionId];
    this.submissions.update(newSub.id, newSub);
    return newSub;
  }

  getCurationAnalytics(tenantId?: string): {
    total_submissions: number;
    decision_distribution: Record<string, number>;
    avg_cycle_time_hours: number;
    pending_count: number;
    in_review_count: number;
  } {
    const all = this.submissions.getAll();
    const decided = all.filter(s => s.status === CurationSubmissionStatus.Decided);

    const distribution: Record<string, number> = { graduate: 0, iterate: 0, kill: 0, park: 0 };
    let totalCycleTime = 0;
    let cycleTimeCount = 0;

    for (const sub of decided) {
      if (sub.decision) distribution[sub.decision]++;
      if (sub.decision_at) {
        const cycle = new Date(sub.decision_at).getTime() - new Date(sub.submitted_at).getTime();
        totalCycleTime += cycle;
        cycleTimeCount++;
      }
    }

    return {
      total_submissions: all.length,
      decision_distribution: distribution,
      avg_cycle_time_hours: cycleTimeCount > 0 ? totalCycleTime / cycleTimeCount / 3600000 : 0,
      pending_count: all.filter(s => s.status === CurationSubmissionStatus.Pending).length,
      in_review_count: all.filter(s => s.status === CurationSubmissionStatus.InReview).length,
    };
  }
}
