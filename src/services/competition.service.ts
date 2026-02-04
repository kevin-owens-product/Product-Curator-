/**
 * Competition Service
 *
 * Manages ongoing and periodic competitions including sprints, seasonal
 * contests, ongoing leaderboards, and bracket-style tournaments.
 */

import { v4 as uuid } from 'uuid';
import {
  Competition,
  CompetitionEntry,
  TournamentBracket,
  TournamentMatch,
  TournamentRound,
  TournamentSeed,
  CreateCompetitionRequest,
  CreateSprintRequest,
  CreateTournamentRequest,
  CompetitionFilterOptions,
} from '../models/competition';
import {
  CompetitionType,
  CompetitionStatus,
  CompetitionEntryStatus,
  TournamentFormat,
  MatchStatus,
} from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';
import { requireFields } from '../utils/validation';

export class CompetitionService {
  private competitions = new InMemoryStore<Competition>();
  private entries = new InMemoryStore<CompetitionEntry>();
  private brackets = new InMemoryStore<TournamentBracket>();
  private matches = new InMemoryStore<TournamentMatch>();

  /**
   * Create a new competition.
   */
  createCompetition(request: CreateCompetitionRequest): Competition {
    requireFields({
      name: request.name,
      description: request.description,
      starts_at: request.starts_at,
    });

    const competition: Competition = {
      id: uuid(),
      tenant_id: request.tenant_id,
      name: request.name,
      description: request.description,
      rules: request.rules,
      type: request.type,
      status: CompetitionStatus.Upcoming,
      starts_at: request.starts_at,
      ends_at: request.ends_at || null,
      scoring_model: request.scoring_model,
      scoring_criteria: request.scoring_criteria || {},
      eligibility: request.eligibility,
      eligible_workspaces: request.eligible_workspaces || [],
      eligible_roles: request.eligible_roles || [],
      leaderboard_visibility: request.leaderboard_visibility,
      prizes: [],
      created_at: new Date().toISOString(),
    };

    return this.competitions.create(competition);
  }

  /**
   * Create a sprint competition (short, focused).
   */
  createSprint(request: CreateSprintRequest): Competition {
    const starts_at = new Date().toISOString();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + request.duration_days);

    return this.createCompetition({
      tenant_id: request.tenant_id,
      name: request.name,
      description: request.description,
      rules: `Sprint theme: ${request.theme}\nDuration: ${request.duration_days} days`,
      type: CompetitionType.Sprint,
      starts_at,
      ends_at: endsAt.toISOString(),
      scoring_model: request.scoring_model,
      scoring_criteria: request.scoring_criteria,
      eligibility: 'all' as any,
      leaderboard_visibility: 'public' as any,
    });
  }

  /**
   * Get a competition by ID.
   */
  getCompetition(competitionId: string): Competition {
    const competition = this.competitions.getById(competitionId);
    if (!competition) throw new NotFoundError('Competition', competitionId);
    return competition;
  }

  /**
   * Discover competitions with filtering.
   */
  discoverCompetitions(filters: CompetitionFilterOptions): { competitions: Competition[]; total: number } {
    let results = this.competitions.getAll();

    if (filters.type) {
      results = results.filter(c => c.type === filters.type);
    }
    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(
        c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search)
      );
    }

    switch (filters.sort_by) {
      case 'ending_soon':
        results.sort((a, b) => {
          if (!a.ends_at) return 1;
          if (!b.ends_at) return -1;
          return new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime();
        });
        break;
      case 'most_participants':
        results.sort((a, b) => {
          const countA = this.entries.count(e => e.competition_id === a.id);
          const countB = this.entries.count(e => e.competition_id === b.id);
          return countB - countA;
        });
        break;
      case 'newest':
      default:
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    const total = results.length;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    results = results.slice(offset, offset + limit);

    return { competitions: results, total };
  }

  /**
   * Join a competition.
   */
  joinCompetition(competitionId: string, userId: string): CompetitionEntry {
    const competition = this.getCompetition(competitionId);

    if (competition.status !== CompetitionStatus.Active && competition.status !== CompetitionStatus.Upcoming) {
      throw new ValidationError('Competition is not accepting participants');
    }

    const existing = this.entries.findOne(
      e => e.competition_id === competitionId && e.user_id === userId
    );
    if (existing) {
      throw new ValidationError('User has already joined this competition');
    }

    const entry: CompetitionEntry = {
      id: uuid(),
      competition_id: competitionId,
      user_id: userId,
      score: 0,
      rank: 0,
      creation_ids: [],
      challenge_wins: [],
      points_earned: 0,
      status: CompetitionEntryStatus.Active,
      joined_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    };

    return this.entries.create(entry);
  }

  /**
   * Update a participant's score in a competition.
   */
  updateScore(competitionId: string, userId: string, scoreIncrement: number, metadata?: { creation_id?: string; challenge_id?: string }): CompetitionEntry {
    const entry = this.entries.findOne(
      e => e.competition_id === competitionId && e.user_id === userId
    );
    if (!entry) throw new NotFoundError('CompetitionEntry', `${competitionId}/${userId}`);

    const updates: Partial<CompetitionEntry> = {
      score: entry.score + scoreIncrement,
      points_earned: entry.points_earned + scoreIncrement,
      last_activity_at: new Date().toISOString(),
    };

    if (metadata?.creation_id) {
      updates.creation_ids = [...entry.creation_ids, metadata.creation_id];
    }
    if (metadata?.challenge_id) {
      updates.challenge_wins = [...entry.challenge_wins, metadata.challenge_id];
    }

    const updated = this.entries.update(entry.id, updates)!;

    // Recalculate rankings
    this.recalculateRankings(competitionId);

    return updated;
  }

  /**
   * Get competition leaderboard.
   */
  getLeaderboard(competitionId: string, limit: number = 50, offset: number = 0): CompetitionEntry[] {
    return this.entries
      .find(e => e.competition_id === competitionId && e.status === CompetitionEntryStatus.Active)
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit);
  }

  /**
   * Get a user's entry in a competition.
   */
  getUserEntry(competitionId: string, userId: string): CompetitionEntry | null {
    return this.entries.findOne(
      e => e.competition_id === competitionId && e.user_id === userId
    ) || null;
  }

  // ─── Tournament Operations ─────────────────────────────────────────────────

  /**
   * Create a tournament bracket.
   */
  createTournament(request: CreateTournamentRequest): TournamentBracket {
    const competition = this.getCompetition(request.competition_id);

    if (competition.type !== CompetitionType.Tournament) {
      throw new ValidationError('Competition must be of type tournament');
    }

    let seeds: TournamentSeed[];
    if (request.seeding === 'manual' && request.manual_seeds) {
      seeds = request.manual_seeds;
    } else if (request.seeding === 'random') {
      seeds = this.randomize(request.participant_ids).map((id, i) => ({
        seed_number: i + 1,
        participant_id: id,
        participant_type: request.participant_type,
      }));
    } else {
      // Ranked seeding: use order as provided
      seeds = request.participant_ids.map((id, i) => ({
        seed_number: i + 1,
        participant_id: id,
        participant_type: request.participant_type,
      }));
    }

    // Pad to nearest power of 2
    const bracketSize = this.nextPowerOf2(seeds.length);
    const rounds = this.generateRounds(seeds, bracketSize, request.format);

    const bracket: TournamentBracket = {
      id: uuid(),
      competition_id: request.competition_id,
      rounds,
      current_round: 1,
      format: request.format,
      seeds,
    };

    return this.brackets.create(bracket);
  }

  /**
   * Get tournament bracket.
   */
  getBracket(competitionId: string): TournamentBracket | null {
    return this.brackets.findOne(b => b.competition_id === competitionId) || null;
  }

  /**
   * Record a match result.
   */
  recordMatchResult(
    matchId: string,
    winnerId: string,
    scoreA: number,
    scoreB: number
  ): TournamentMatch {
    const match = this.matches.getById(matchId);
    if (!match) throw new NotFoundError('TournamentMatch', matchId);

    if (match.status === MatchStatus.Completed) {
      throw new ValidationError('Match has already been completed');
    }

    const updated = this.matches.update(matchId, {
      winner: winnerId,
      score_a: scoreA,
      score_b: scoreB,
      status: MatchStatus.Completed,
      completed_at: new Date().toISOString(),
    })!;

    // Advance winner to next round
    this.advanceWinner(match.bracket_id, match.round, winnerId);

    return updated;
  }

  /**
   * Start a competition (set to active).
   */
  startCompetition(competitionId: string): Competition {
    const competition = this.getCompetition(competitionId);
    if (competition.status !== CompetitionStatus.Upcoming) {
      throw new ValidationError('Only upcoming competitions can be started');
    }
    const updated = this.competitions.update(competitionId, { status: CompetitionStatus.Active });
    return updated!;
  }

  /**
   * Complete a competition.
   */
  completeCompetition(competitionId: string): Competition {
    const competition = this.getCompetition(competitionId);
    if (competition.status !== CompetitionStatus.Active) {
      throw new ValidationError('Only active competitions can be completed');
    }
    const updated = this.competitions.update(competitionId, { status: CompetitionStatus.Completed });
    return updated!;
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private recalculateRankings(competitionId: string): void {
    const entries = this.entries
      .find(e => e.competition_id === competitionId && e.status === CompetitionEntryStatus.Active)
      .sort((a, b) => b.score - a.score);

    entries.forEach((entry, index) => {
      this.entries.update(entry.id, { rank: index + 1 });
    });
  }

  private randomize<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private nextPowerOf2(n: number): number {
    let power = 1;
    while (power < n) power *= 2;
    return power;
  }

  private generateRounds(
    seeds: TournamentSeed[],
    bracketSize: number,
    format: TournamentFormat
  ): TournamentRound[] {
    const totalRounds = Math.log2(bracketSize);
    const rounds: TournamentRound[] = [];

    // Generate first round matches
    const firstRoundMatches: TournamentMatch[] = [];
    for (let i = 0; i < bracketSize / 2; i++) {
      const seedA = seeds[i];
      const seedB = seeds[bracketSize - 1 - i];

      const match: TournamentMatch = {
        id: uuid(),
        bracket_id: '', // will be set after bracket creation
        round: 1,
        participant_a: seedA?.participant_id || 'BYE',
        participant_b: seedB?.participant_id || 'BYE',
        challenge_id: '',
        winner: null,
        score_a: 0,
        score_b: 0,
        status: MatchStatus.Scheduled,
        scheduled_at: new Date().toISOString(),
        completed_at: null,
      };

      // Auto-advance byes
      if (match.participant_a === 'BYE' && match.participant_b !== 'BYE') {
        match.winner = match.participant_b;
        match.status = MatchStatus.Completed;
        match.completed_at = new Date().toISOString();
      } else if (match.participant_b === 'BYE' && match.participant_a !== 'BYE') {
        match.winner = match.participant_a;
        match.status = MatchStatus.Completed;
        match.completed_at = new Date().toISOString();
      }

      this.matches.create(match);
      firstRoundMatches.push(match);
    }

    rounds.push({
      round_number: 1,
      matches: firstRoundMatches,
      status: 'in_progress',
    });

    // Generate placeholder rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchCount = bracketSize / Math.pow(2, round);
      const roundMatches: TournamentMatch[] = [];

      for (let i = 0; i < matchCount; i++) {
        const match: TournamentMatch = {
          id: uuid(),
          bracket_id: '',
          round,
          participant_a: 'TBD',
          participant_b: 'TBD',
          challenge_id: '',
          winner: null,
          score_a: 0,
          score_b: 0,
          status: MatchStatus.Scheduled,
          scheduled_at: new Date().toISOString(),
          completed_at: null,
        };

        this.matches.create(match);
        roundMatches.push(match);
      }

      rounds.push({
        round_number: round,
        matches: roundMatches,
        status: 'pending',
      });
    }

    return rounds;
  }

  private advanceWinner(bracketId: string, completedRound: number, winnerId: string): void {
    const bracket = this.brackets.getById(bracketId);
    if (!bracket) return;

    const nextRound = bracket.rounds.find(r => r.round_number === completedRound + 1);
    if (!nextRound) return;

    // Find the next match that has a TBD slot
    for (const match of nextRound.matches) {
      if (match.participant_a === 'TBD') {
        this.matches.update(match.id, { participant_a: winnerId });
        break;
      } else if (match.participant_b === 'TBD') {
        this.matches.update(match.id, { participant_b: winnerId });
        break;
      }
    }
  }
}
