/**
 * Core type definitions for the Gamification system.
 * These types represent the fundamental building blocks used across
 * challenges, hackathons, competitions, and the gamification engine.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ChallengeType {
  CustomerProblem = 'customer_problem',
  TechnicalDebt = 'technical_debt',
  Coherence = 'coherence',
  Strategic = 'strategic',
  Efficiency = 'efficiency',
  Moonshot = 'moonshot',
}

export enum Difficulty {
  Starter = 'starter',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}

export enum ChallengeStatus {
  Draft = 'draft',
  Open = 'open',
  Judging = 'judging',
  Completed = 'completed',
  Canceled = 'canceled',
}

export enum RewardType {
  Points = 'points',
  Prize = 'prize',
  Recognition = 'recognition',
  Budget = 'budget',
  PromotionConsideration = 'promotion_consideration',
}

export enum SubmissionStatus {
  Submitted = 'submitted',
  UnderReview = 'under_review',
  Shortlisted = 'shortlisted',
  Winner = 'winner',
  RunnerUp = 'runner_up',
  HonorableMention = 'honorable_mention',
  NotSelected = 'not_selected',
}

export enum HackathonStatus {
  Announced = 'announced',
  RegistrationOpen = 'registration_open',
  InProgress = 'in_progress',
  Judging = 'judging',
  Completed = 'completed',
}

export enum HackathonFormat {
  Individual = 'individual',
  Team = 'team',
  Both = 'both',
}

export enum RegistrationStatus {
  Registered = 'registered',
  Confirmed = 'confirmed',
  Withdrawn = 'withdrawn',
  NoShow = 'no_show',
}

export enum TeamStatus {
  Forming = 'forming',
  Confirmed = 'confirmed',
  Submitted = 'submitted',
  Winner = 'winner',
}

export enum PrizePlace {
  First = 'first',
  Second = 'second',
  Third = 'third',
  CategoryWinner = 'category_winner',
  HonorableMention = 'honorable_mention',
}

export enum CompetitionType {
  Sprint = 'sprint',
  Seasonal = 'seasonal',
  Ongoing = 'ongoing',
  Tournament = 'tournament',
}

export enum CompetitionStatus {
  Upcoming = 'upcoming',
  Active = 'active',
  Completed = 'completed',
}

export enum ScoringModel {
  Points = 'points',
  Wins = 'wins',
  JudgeScore = 'judge_score',
  PeerVote = 'peer_vote',
  Composite = 'composite',
}

export enum Eligibility {
  All = 'all',
  Workspace = 'workspace',
  Role = 'role',
  InviteOnly = 'invite_only',
}

export enum LeaderboardVisibility {
  Public = 'public',
  ParticipantsOnly = 'participants_only',
  EndOnly = 'end_only',
}

export enum CompetitionEntryStatus {
  Active = 'active',
  Withdrawn = 'withdrawn',
  Disqualified = 'disqualified',
}

export enum TournamentFormat {
  SingleElimination = 'single_elimination',
  DoubleElimination = 'double_elimination',
  RoundRobin = 'round_robin',
}

export enum MatchStatus {
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum BadgeRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum BadgeCriteriaType {
  Count = 'count',
  Streak = 'streak',
  Milestone = 'milestone',
  Special = 'special',
}

export enum StreakType {
  DailyActive = 'daily_active',
  WeeklyCreation = 'weekly_creation',
  CurationParticipation = 'curation_participation',
  ChallengeSubmission = 'challenge_submission',
  QualityStreak = 'quality_streak',
}

export enum LeaderboardScope {
  AllTime = 'all_time',
  Yearly = 'yearly',
  Quarterly = 'quarterly',
  Monthly = 'monthly',
  Weekly = 'weekly',
}

export enum LeaderboardMetric {
  Points = 'points',
  Creations = 'creations',
  Graduations = 'graduations',
  ChallengeWins = 'challenge_wins',
  HackathonWins = 'hackathon_wins',
}

export enum RewardFulfillmentType {
  Automatic = 'automatic',
  Manual = 'manual',
  External = 'external',
}

export enum RewardClaimStatus {
  Pending = 'pending',
  Processing = 'processing',
  Fulfilled = 'fulfilled',
  Failed = 'failed',
}

export enum RewardEarnedVia {
  Challenge = 'challenge',
  Hackathon = 'hackathon',
  Competition = 'competition',
  Redemption = 'redemption',
  AdminGrant = 'admin_grant',
}

export enum ProfileVisibility {
  Public = 'public',
  Workspace = 'workspace',
  Private = 'private',
}

// ─── Point Action Types ──────────────────────────────────────────────────────

export enum PointAction {
  CreateCreation = 'create_creation',
  SubmitForCuration = 'submit_for_curation',
  CreationGraduates = 'creation_graduates',
  CreationKilled = 'creation_killed',
  OwnProductionAsset = 'own_production_asset',
  ZeroIncidents = 'zero_incidents',
  SubmitToChallenge = 'submit_to_challenge',
  WinChallenge = 'win_challenge',
  RunnerUp = 'runner_up',
  HonorableMention = 'honorable_mention',
  CompleteHackathon = 'complete_hackathon',
  WinHackathon = 'win_hackathon',
  HelpAsMentor = 'help_as_mentor',
  QualityCuration = 'quality_curation',
  Streak7Days = 'streak_7_days',
  Streak30Days = 'streak_30_days',
  FirstCreation = 'first_creation',
  FirstGraduation = 'first_graduation',
  ReferColleague = 'refer_colleague',
}

// ─── Scoring Criteria ────────────────────────────────────────────────────────

export interface CriteriaScores {
  innovation: number; // 1-10
  feasibility: number; // 1-10
  impact: number; // 1-10
  presentation: number; // 1-10
}
