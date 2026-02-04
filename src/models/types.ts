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

// ─── Creation & Curation Enums ───────────────────────────────────────────────

export enum CreationStatus {
  Draft = 'draft',
  InProgress = 'in_progress',
  Submitted = 'submitted',
  InReview = 'in_review',
  Graduated = 'graduated',
  Killed = 'killed',
  Parked = 'parked',
}

export enum CurationDecision {
  Graduate = 'graduate',
  Iterate = 'iterate',
  Kill = 'kill',
  Park = 'park',
}

export enum CurationSubmissionStatus {
  Pending = 'pending',
  InReview = 'in_review',
  Decided = 'decided',
}

export enum ChangeTier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
  Tier4 = 4,
}

// ─── Production Asset Enums ──────────────────────────────────────────────────

export enum ProductionAssetType {
  Feature = 'feature',
  Service = 'service',
  Integration = 'integration',
  Component = 'component',
  Page = 'page',
  ApiEndpoint = 'api_endpoint',
  Other = 'other',
}

export enum ProductionAssetStatus {
  Active = 'active',
  Deprecated = 'deprecated',
  Decommissioned = 'decommissioned',
}

// ─── Coherence Enums ─────────────────────────────────────────────────────────

export enum CoherenceFlagType {
  PatternViolation = 'pattern_violation',
  InconsistentUx = 'inconsistent_ux',
  DuplicateFunctionality = 'duplicate_functionality',
  ArchitecturalDrift = 'architectural_drift',
}

export enum CoherenceFlagSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum CoherenceFlagStatus {
  Open = 'open',
  Acknowledged = 'acknowledged',
  Resolved = 'resolved',
  WontFix = 'wont_fix',
}

export enum PatternCategory {
  UI = 'ui',
  API = 'api',
  Data = 'data',
  Integration = 'integration',
  Infrastructure = 'infrastructure',
}

export enum PatternStatus {
  Active = 'active',
  Deprecated = 'deprecated',
  Proposed = 'proposed',
}

// ─── Incident Enums ──────────────────────────────────────────────────────────

export enum IncidentSeverity {
  Sev1 = 'sev1',
  Sev2 = 'sev2',
  Sev3 = 'sev3',
  Sev4 = 'sev4',
}

export enum IncidentSource {
  Alert = 'alert',
  CustomerReport = 'customer_report',
  InternalReport = 'internal_report',
}

// ─── Multi-Tenancy Enums ─────────────────────────────────────────────────────

export enum SubscriptionPlan {
  Free = 'free',
  Starter = 'starter',
  Professional = 'professional',
  Enterprise = 'enterprise',
}

export enum SubscriptionStatus {
  Trialing = 'trialing',
  Active = 'active',
  PastDue = 'past_due',
  Canceled = 'canceled',
}

export enum InvoiceStatus {
  Draft = 'draft',
  Open = 'open',
  Paid = 'paid',
  Void = 'void',
  Uncollectible = 'uncollectible',
}

export enum DataResidencyRegion {
  US = 'us',
  EU = 'eu',
  APAC = 'apac',
}

// ─── User & Role Enums ──────────────────────────────────────────────────────

export enum OrgRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

export enum WorkspaceRole {
  Admin = 'admin',
  Curator = 'curator',
  Creator = 'creator',
}

export enum UserStatus {
  Invited = 'invited',
  Active = 'active',
  Deactivated = 'deactivated',
}

export enum AuthProvider {
  Email = 'email',
  Google = 'google',
  SAML = 'saml',
  OIDC = 'oidc',
}

// ─── Audit Enums ─────────────────────────────────────────────────────────────

export enum AuditActorType {
  User = 'user',
  System = 'system',
  Admin = 'admin',
}

// ─── Point Action Types ──────────────────────────────────────────────────────

export enum PointAction {
  CreateCreation = 'create_creation',
  SubmitForCuration = 'submit_for_curation',
  CreationGraduates = 'creation_graduates',
  CreationKilled = 'creation_killed',
  CreationParked = 'creation_parked',
  OwnProductionAsset = 'own_production_asset',
  ZeroIncidents = 'zero_incidents',
  IncidentDeduction = 'incident_deduction',
  SubmitToChallenge = 'submit_to_challenge',
  WinChallenge = 'win_challenge',
  RunnerUp = 'runner_up',
  HonorableMention = 'honorable_mention',
  RegisterForHackathon = 'register_for_hackathon',
  CompleteHackathon = 'complete_hackathon',
  WinHackathon = 'win_hackathon',
  HelpAsMentor = 'help_as_mentor',
  QualityCuration = 'quality_curation',
  JudgeSubmissions = 'judge_submissions',
  FlagConfirmedCoherenceIssue = 'flag_confirmed_coherence_issue',
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
