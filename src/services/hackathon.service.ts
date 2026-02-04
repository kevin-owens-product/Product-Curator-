/**
 * Hackathon Service
 *
 * Manages the full lifecycle of hackathon events: creation, registration,
 * team formation, mentor support, live event management, and results.
 */

import { v4 as uuid } from 'uuid';
import {
  Hackathon,
  HackathonTrack,
  HackathonRegistration,
  HackathonTeam,
  HackathonPrize,
  MentorHelpRequest,
  CreateHackathonRequest,
  RegisterForHackathonRequest,
  CreateTeamRequest,
  RequestMentorHelpRequest,
} from '../models/hackathon';
import { HackathonStatus, RegistrationStatus, TeamStatus } from '../models/types';
import { InMemoryStore } from '../utils/store';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  DeadlinePassedError,
} from '../utils/errors';
import { requireFields, validateDateRange, isBeforeDeadline } from '../utils/validation';

export class HackathonService {
  private hackathons = new InMemoryStore<Hackathon>();
  private registrations = new InMemoryStore<HackathonRegistration>();
  private teams = new InMemoryStore<HackathonTeam>();
  private mentorRequests = new InMemoryStore<MentorHelpRequest>();

  /**
   * Create a new hackathon event.
   */
  createHackathon(request: CreateHackathonRequest): Hackathon {
    requireFields({
      name: request.name,
      description: request.description,
      rules: request.rules,
      starts_at: request.starts_at,
      ends_at: request.ends_at,
    });

    validateDateRange(request.registration_opens_at, request.registration_closes_at, ['registration_opens_at', 'registration_closes_at']);
    validateDateRange(request.starts_at, request.ends_at, ['starts_at', 'ends_at']);

    const hackathon: Hackathon = {
      id: uuid(),
      tenant_id: request.tenant_id,
      name: request.name,
      description: request.description,
      theme: request.theme || null,
      rules: request.rules,
      status: HackathonStatus.Announced,
      registration_opens_at: request.registration_opens_at,
      registration_closes_at: request.registration_closes_at,
      starts_at: request.starts_at,
      ends_at: request.ends_at,
      judging_ends_at: request.judging_ends_at,
      format: request.format,
      max_team_size: request.max_team_size,
      min_team_size: request.min_team_size,
      tracks: [],
      challenge_ids: [],
      registrations: [],
      max_participants: request.max_participants || null,
      prizes: [],
      location: request.location || null,
      virtual_platform_url: request.virtual_platform_url || null,
      slack_channel: request.slack_channel || null,
      organizers: request.organizers,
      mentors: request.mentors || [],
      judges: request.judges,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.hackathons.create(hackathon);
  }

  /**
   * Get a hackathon by ID.
   */
  getHackathon(hackathonId: string): Hackathon {
    const hackathon = this.hackathons.getById(hackathonId);
    if (!hackathon) throw new NotFoundError('Hackathon', hackathonId);
    return hackathon;
  }

  /**
   * Update hackathon status.
   */
  updateStatus(hackathonId: string, status: HackathonStatus): Hackathon {
    const hackathon = this.getHackathon(hackathonId);
    const updated = this.hackathons.update(hackathonId, {
      status,
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError('Hackathon', hackathonId);
    return updated;
  }

  /**
   * Add a track to a hackathon.
   */
  addTrack(hackathonId: string, name: string, description: string): HackathonTrack {
    const hackathon = this.getHackathon(hackathonId);
    const track: HackathonTrack = {
      id: uuid(),
      hackathon_id: hackathonId,
      name,
      description,
      specific_challenge_ids: [],
      prize_ids: [],
    };

    const tracks = [...hackathon.tracks, track];
    this.hackathons.update(hackathonId, { tracks, updated_at: new Date().toISOString() });
    return track;
  }

  /**
   * Add a prize to a hackathon.
   */
  addPrize(hackathonId: string, prize: Omit<HackathonPrize, 'id' | 'hackathon_id'>): HackathonPrize {
    const hackathon = this.getHackathon(hackathonId);
    const newPrize: HackathonPrize = {
      id: uuid(),
      hackathon_id: hackathonId,
      ...prize,
    };

    const prizes = [...hackathon.prizes, newPrize];
    this.hackathons.update(hackathonId, { prizes, updated_at: new Date().toISOString() });
    return newPrize;
  }

  /**
   * Register a user for a hackathon.
   */
  register(request: RegisterForHackathonRequest): HackathonRegistration {
    const hackathon = this.getHackathon(request.hackathon_id);

    if (hackathon.status !== HackathonStatus.RegistrationOpen && hackathon.status !== HackathonStatus.Announced) {
      throw new ValidationError('Registration is not open for this hackathon');
    }

    if (!isBeforeDeadline(hackathon.registration_closes_at)) {
      throw new DeadlinePassedError('hackathon registration');
    }

    // Check if already registered
    const existing = this.registrations.findOne(
      r => r.hackathon_id === request.hackathon_id && r.user_id === request.user_id
    );
    if (existing) {
      throw new ConflictError('User is already registered for this hackathon');
    }

    // Check participant cap
    if (hackathon.max_participants) {
      const count = this.registrations.count(
        r => r.hackathon_id === request.hackathon_id && r.status !== RegistrationStatus.Withdrawn
      );
      if (count >= hackathon.max_participants) {
        throw new ValidationError('Hackathon has reached maximum participants');
      }
    }

    const registration: HackathonRegistration = {
      id: uuid(),
      hackathon_id: request.hackathon_id,
      user_id: request.user_id,
      team_id: null,
      track_id: request.track_id || null,
      status: RegistrationStatus.Registered,
      registered_at: new Date().toISOString(),
      looking_for_team: request.looking_for_team,
      skills: request.skills,
      interests: request.interests,
    };

    return this.registrations.create(registration);
  }

  /**
   * Create a team for a hackathon.
   */
  createTeam(request: CreateTeamRequest): HackathonTeam {
    const hackathon = this.getHackathon(request.hackathon_id);

    requireFields({ name: request.name, captain_id: request.captain_id });

    const team: HackathonTeam = {
      id: uuid(),
      hackathon_id: request.hackathon_id,
      name: request.name,
      members: [request.captain_id],
      captain_id: request.captain_id,
      track_id: request.track_id || null,
      submission_ids: [],
      status: TeamStatus.Forming,
    };

    // Update captain's registration with team
    const registration = this.registrations.findOne(
      r => r.hackathon_id === request.hackathon_id && r.user_id === request.captain_id
    );
    if (registration) {
      this.registrations.update(registration.id, { team_id: team.id });
    }

    return this.teams.create(team);
  }

  /**
   * Join an existing team.
   */
  joinTeam(hackathonId: string, teamId: string, userId: string): HackathonTeam {
    const hackathon = this.getHackathon(hackathonId);
    const team = this.teams.getById(teamId);
    if (!team) throw new NotFoundError('HackathonTeam', teamId);

    if (team.members.length >= hackathon.max_team_size) {
      throw new ValidationError('Team is full');
    }

    if (team.members.includes(userId)) {
      throw new ConflictError('User is already on this team');
    }

    const updatedMembers = [...team.members, userId];
    const updated = this.teams.update(teamId, { members: updatedMembers });

    // Update user's registration
    const registration = this.registrations.findOne(
      r => r.hackathon_id === hackathonId && r.user_id === userId
    );
    if (registration) {
      this.registrations.update(registration.id, { team_id: teamId, looking_for_team: false });
    }

    return updated!;
  }

  /**
   * Find participants looking for teams.
   */
  findTeammates(hackathonId: string, filters?: { skills?: string[]; track_id?: string }): HackathonRegistration[] {
    let results = this.registrations.find(
      r => r.hackathon_id === hackathonId && r.looking_for_team
    );

    if (filters?.skills && filters.skills.length > 0) {
      results = results.filter(r =>
        filters.skills!.some(skill => r.skills.includes(skill))
      );
    }

    if (filters?.track_id) {
      results = results.filter(r => r.track_id === filters.track_id);
    }

    return results;
  }

  /**
   * Request mentor help during a hackathon.
   */
  requestMentorHelp(request: RequestMentorHelpRequest): MentorHelpRequest {
    const hackathon = this.getHackathon(request.hackathon_id);

    if (hackathon.status !== HackathonStatus.InProgress) {
      throw new ValidationError('Mentor help is only available during the hackathon');
    }

    // Calculate queue position
    const pendingRequests = this.mentorRequests.count(
      r => r.hackathon_id === request.hackathon_id && r.status === 'pending'
    );

    const helpRequest: MentorHelpRequest = {
      id: uuid(),
      hackathon_id: request.hackathon_id,
      team_id: request.team_id,
      requested_by: request.requested_by,
      description: request.description,
      status: 'pending',
      mentor_id: null,
      queue_position: pendingRequests + 1,
      requested_at: new Date().toISOString(),
      claimed_at: null,
      completed_at: null,
      rating: null,
    };

    return this.mentorRequests.create(helpRequest);
  }

  /**
   * Claim a mentor help request.
   */
  claimMentorRequest(requestId: string, mentorId: string): MentorHelpRequest {
    const request = this.mentorRequests.getById(requestId);
    if (!request) throw new NotFoundError('MentorHelpRequest', requestId);

    if (request.status !== 'pending') {
      throw new ValidationError('This request has already been claimed');
    }

    const updated = this.mentorRequests.update(requestId, {
      status: 'claimed',
      mentor_id: mentorId,
      claimed_at: new Date().toISOString(),
    });

    // Recalculate queue positions for remaining pending requests
    this.recalculateQueuePositions(request.hackathon_id);

    return updated!;
  }

  /**
   * Complete a mentor help session.
   */
  completeMentorRequest(requestId: string, rating?: number): MentorHelpRequest {
    const request = this.mentorRequests.getById(requestId);
    if (!request) throw new NotFoundError('MentorHelpRequest', requestId);

    const updated = this.mentorRequests.update(requestId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      rating: rating || null,
    });

    return updated!;
  }

  /**
   * Get the mentor help queue for a hackathon.
   */
  getMentorQueue(hackathonId: string): MentorHelpRequest[] {
    return this.mentorRequests
      .find(r => r.hackathon_id === hackathonId && r.status === 'pending')
      .sort((a, b) => a.queue_position - b.queue_position);
  }

  /**
   * Get live hackathon stats.
   */
  getLiveStats(hackathonId: string): {
    total_teams: number;
    total_participants: number;
    total_submitted: number;
    mentors_available: number;
    help_queue_length: number;
  } {
    const registrations = this.registrations.find(r => r.hackathon_id === hackathonId);
    const teams = this.teams.find(t => t.hackathon_id === hackathonId);
    const hackathon = this.getHackathon(hackathonId);

    return {
      total_teams: teams.length,
      total_participants: registrations.filter(r => r.status !== RegistrationStatus.Withdrawn).length,
      total_submitted: teams.filter(t => t.status === TeamStatus.Submitted).length,
      mentors_available: hackathon.mentors.length,
      help_queue_length: this.mentorRequests.count(
        r => r.hackathon_id === hackathonId && r.status === 'pending'
      ),
    };
  }

  /**
   * List all hackathons, optionally filtered by status.
   */
  listHackathons(tenantId: string, status?: HackathonStatus): Hackathon[] {
    let results = this.hackathons.find(h => h.tenant_id === tenantId);
    if (status) {
      results = results.filter(h => h.status === status);
    }
    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Get a team by ID.
   */
  getTeam(teamId: string): HackathonTeam {
    const team = this.teams.getById(teamId);
    if (!team) throw new NotFoundError('HackathonTeam', teamId);
    return team;
  }

  /**
   * Get all teams for a hackathon.
   */
  getTeams(hackathonId: string): HackathonTeam[] {
    return this.teams.find(t => t.hackathon_id === hackathonId);
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private recalculateQueuePositions(hackathonId: string): void {
    const pending = this.mentorRequests
      .find(r => r.hackathon_id === hackathonId && r.status === 'pending')
      .sort((a, b) => new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime());

    pending.forEach((request, index) => {
      this.mentorRequests.update(request.id, { queue_position: index + 1 });
    });
  }
}
