# Curator: Complete Product Requirements Document

**The Production Curation Platform for AI-Native Development**

Version 1.0 | February 2026

---

# Table of Contents

1. [Executive Summary](#part-1-executive-summary)
2. [Vision & Principles](#part-2-vision--principles)
3. [User Personas](#part-3-user-personas)
4. [Core Entities & Data Model](#part-4-core-entities--data-model)
5. [Module 1: Creation Registry](#part-5-module-1-creation-registry)
6. [Module 2: Curation Workflow](#part-6-module-2-curation-workflow)
7. [Module 3: Ownership Registry](#part-7-module-3-ownership-registry)
8. [Module 4: Blast Radius Engine](#part-8-module-4-blast-radius-engine)
9. [Module 5: Coherence Dashboard](#part-9-module-5-coherence-dashboard)
10. [Module 6: Incident Attribution](#part-10-module-6-incident-attribution)
11. [Module 7: Challenges](#part-11-module-7-challenges)
12. [Module 8: Hackathons](#part-12-module-8-hackathons)
13. [Module 9: Competitions](#part-13-module-9-competitions)
14. [Module 10: Gamification System](#part-14-module-10-gamification-system)
15. [Module 11: Multi-Tenancy & Organizations](#part-15-module-11-multi-tenancy--organizations)
16. [Module 12: User Management & Roles](#part-16-module-12-user-management--roles)
17. [Module 13: Billing & Subscriptions](#part-17-module-13-billing--subscriptions)
18. [Module 14: Internationalization](#part-18-module-14-internationalization)
19. [Module 15: Admin Console](#part-19-module-15-admin-console)
20. [Module 16: Metrics & Analytics](#part-20-module-16-metrics--analytics)
21. [Integrations](#part-21-integrations)
22. [Technical Architecture](#part-22-technical-architecture)
23. [API Specification](#part-23-api-specification)
24. [Security & Compliance](#part-24-security--compliance)
25. [Implementation Roadmap](#part-25-implementation-roadmap)
26. [Appendices](#appendices)

---

# Part 1: Executive Summary

## Vision

Curator is a SaaS platform that operationalizes AI-native development workflows. As AI tools enable anyone to generate working code, organizations face new challenges: no structured way to evaluate what should ship, unclear ownership of production assets, invisible coherence degradation, and misaligned incentives. Curator solves these problems with structured curation, clear accountability, and gamified engagement.

## Problem Statement

When anyone can code, organizations face four critical bottlenecks:

1. **Judgment**: When building is cheap, we drown in software that shouldn't exist. The new scarce resource is taste.

2. **System Consequences**: Creators don't understand what their changes will break. Blast radius is tribal knowledge.

3. **Coherence**: Products become Frankenstein monsters of uncoordinated features. No one guards the whole.

4. **Accountability**: When anyone can ship, who's responsible when things break?

Without tooling, new ways of working remain a document rather than an operating reality.

## Solution

Curator provides:

| Module | Purpose |
|--------|---------|
| **Creation Registry** | Track all experiments and prototypes across the org |
| **Curation Workflow** | Structured evaluation with the Five Questions framework |
| **Ownership Registry** | Source of truth for who owns what in production |
| **Blast Radius Engine** | Automated and human-assisted consequence assessment |
| **Coherence Dashboard** | Visibility into product coherence and pattern compliance |
| **Challenges & Hackathons** | Focus collective energy on big problems |
| **Gamification** | Points, badges, leaderboards to drive engagement |
| **Multi-tenant SaaS** | Serve multiple organizations with full isolation |
| **Admin Console** | Platform operations and customer support |
| **Internationalization** | Global reach with localized experience |

## Success Metrics

| Metric | Baseline | Target (6 months) |
|--------|----------|-------------------|
| Curation cycle time | N/A | < 48 hours |
| Orphaned production code | Unknown | 0% |
| Creation visibility | 0% | 100% tracked |
| Time to production | Weeks | Days |
| Challenge participation | N/A | >20% per challenge |
| Weekly active creators | N/A | >60% of org |

## Target Market

**Primary:** Engineering organizations (50-500 people) transitioning to AI-native development

**Secondary:** Enterprise organizations (500+) with distributed teams and coherence challenges

**Verticals:** Technology, Financial Services, Healthcare IT, Media/Entertainment

---

# Part 2: Vision & Principles

## The Shift We're Addressing

For decades, software organizations were structured around a fundamental scarcity: the ability to translate intent into working code. Engineering capacity was the bottleneck. Everything else (roadmaps, sprints, prioritization) existed to manage that constraint.

That constraint no longer exists.

When anyone can generate working code through AI, we face a new reality: **we can now ship faster than we can decide what to ship.** The bottleneck has moved from "can we build it?" to "should it exist?"

Curator is the operating system for this new reality.

## Core Principles

### 1. Creation should be frictionless. Shipping should be intentional.

We want everyone generating solutions, prototypes, and experiments. The more ideas we can try, the faster we learn. But shipping to production is a different act. Shipping means committing to maintain it, support it, and live with its consequences.

### 2. Speed comes from confidence, not from removing gates.

The fastest organizations aren't the ones with no review process. They're the ones with such good infrastructure (testing, observability, rollback) that they can ship confidently and recover quickly when wrong.

### 3. Coherence is a product, not a byproduct.

A product is not a collection of features. It's a coherent system with consistent mental models. Coherence doesn't happen automatically. It requires active curation.

### 4. Accountability follows authority.

If you have the authority to ship something, you have accountability for its outcomes. Distributed creation requires distributed ownership.

### 5. Judgment is the new scarce resource.

When building is cheap, taste becomes expensive. The ability to distinguish "we can build this" from "this should exist" is the new bottleneck.

### 6. Competition focuses energy on what matters.

Challenges, hackathons, and gamification aren't distractions. They're mechanisms for directing collective creativity toward the organization's biggest problems.

## Three Layers of Work

All work flows through three distinct layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATION LAYER                                │
│         Wide open. Anyone. No gates. Speed matters.              │
│                                                                  │
│  Prototypes, experiments, explorations, internal tools           │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CURATION LAYER                                │
│      Selective. Judgment applied. Coherence enforced.            │
│                                                                  │
│   What graduates to production? What gets killed?                │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION LAYER                               │
│     Accountable. Observable. Maintainable. Supported.            │
│                                                                  │
│      Live systems serving customers with real SLAs               │
└─────────────────────────────────────────────────────────────────┘
```

---

# Part 3: User Personas

## Persona 1: Creator

**Who:** Anyone in the org building solutions (PM, designer, engineer, CSM, etc.)

**Goals:**
- Get ideas to production quickly
- Understand what "production-ready" means
- Get clear feedback when things don't pass curation
- Earn recognition for contributions

**Pain points today:**
- Unclear process for getting things shipped
- Don't know if something similar already exists
- Feedback is informal and inconsistent
- No visibility into where things stand

**Key jobs to be done:**
- Register a new creation
- Submit for curation review
- Track submission status
- Participate in challenges and hackathons
- Build reputation through gamification

---

## Persona 2: Production Curator

**Who:** Senior ICs with deep system knowledge who evaluate creations for production-readiness

**Goals:**
- Efficiently evaluate incoming creations
- Maintain consistent quality bar
- Preserve product coherence
- Make decisions quickly without sacrificing quality

**Pain points today:**
- No queue management
- Manual coherence checking
- No historical record of decisions
- Blast radius assessment is tribal knowledge

**Key jobs to be done:**
- Review curation queue
- Evaluate against Five Questions
- Record decisions with rationale
- Track patterns and coherence trends
- Judge challenge submissions

---

## Persona 3: Accountable Owner

**Who:** Person responsible for a piece of production code

**Goals:**
- Know exactly what they own
- Respond to incidents quickly
- Make informed decisions about iteration/deprecation
- Transfer ownership cleanly when needed

**Pain points today:**
- Ownership is informal and often unclear
- No single view of "my production assets"
- Incident attribution is manual
- Handoffs are messy

**Key jobs to be done:**
- View owned assets and their health
- Receive and respond to incidents
- Approve changes within scope
- Initiate deprecation
- Transfer ownership

---

## Persona 4: Squad Lead

**Who:** Manager of a squad who needs visibility into team's work

**Goals:**
- See what the squad is creating
- Understand curation pipeline
- Ensure ownership is clear
- Drive team engagement

**Pain points today:**
- Limited visibility into creation activity
- No aggregate view of squad's production footprint
- Can't see curation feedback patterns
- No tools to motivate team participation

**Key jobs to be done:**
- View squad creation activity
- Monitor curation pipeline for squad
- Review ownership coverage
- Track team gamification metrics
- Sponsor challenges

---

## Persona 5: Engineering/Product Leadership

**Who:** Technical and product leaders responsible for overall system health

**Goals:**
- Maintain system coherence
- Prevent architectural drift
- Ensure production quality
- Drive innovation through challenges

**Pain points today:**
- No visibility into what's being added to production
- Coherence degrades invisibly
- Blast radius surprises
- No structured way to focus org on big problems

**Key jobs to be done:**
- Monitor coherence metrics
- Review architectural changes
- Track technical debt accumulation
- Create and sponsor challenges
- Organize hackathons

---

## Persona 6: Organization Admin

**Who:** Admin responsible for Curator configuration and user management

**Goals:**
- Configure organization settings
- Manage users and permissions
- Monitor usage and billing
- Ensure compliance

**Key jobs to be done:**
- Invite and manage users
- Configure workspaces
- Set up integrations
- Manage subscription
- Export data for compliance

---

## Persona 7: Platform Admin (Internal)

**Who:** Curator platform team member supporting customers

**Goals:**
- Support customers effectively
- Monitor platform health
- Manage feature rollout
- Handle billing issues

**Key jobs to be done:**
- Lookup and support tenants
- Monitor system health
- Manage feature flags
- Handle escalations

---

# Part 4: Core Entities & Data Model

## Tenant & Organization

```
Tenant {
  id: UUID
  name: string
  slug: string (unique, URL-safe)
  
  // Subscription
  plan: enum [free, starter, professional, enterprise]
  subscription_status: enum [trialing, active, past_due, canceled]
  trial_ends_at: timestamp (optional)
  
  // Settings
  default_locale: string
  timezone: string
  
  // Branding (Enterprise)
  logo_url: string (optional)
  primary_color: string (optional)
  custom_domain: string (optional)
  
  // Compliance
  data_residency_region: enum [us, eu, apac]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

Workspace {
  id: UUID
  tenant_id: Tenant
  name: string
  slug: string (unique within tenant)
  description: text (optional)
  
  // Settings
  curation_settings: WorkspaceCurationSettings
  gamification_settings: WorkspaceGamificationSettings
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}
```

## User & Roles

```
User {
  id: UUID
  tenant_id: Tenant
  
  // Profile
  email: string
  name: string
  avatar_url: string (optional)
  
  // Authentication
  auth_provider: enum [email, google, saml, oidc]
  external_id: string (optional)
  
  // Preferences
  locale: string
  timezone: string
  notification_preferences: NotificationPreferences
  gamification_preferences: GamificationPreferences
  
  // Gamification
  total_points: int
  level_id: Level
  current_streak: int
  longest_streak: int
  
  // Status
  status: enum [invited, active, deactivated]
  last_active_at: timestamp
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

WorkspaceMembership {
  id: UUID
  user_id: User
  workspace_id: Workspace
  role: enum [admin, curator, creator]
  joined_at: timestamp
}

OrganizationRole {
  id: UUID
  user_id: User
  tenant_id: Tenant
  role: enum [owner, admin, member]
}
```

## Creation

```
Creation {
  id: UUID
  tenant_id: Tenant
  workspace_id: Workspace
  
  // Content
  title: string
  description: text
  problem_statement: text
  
  // Creator
  creator_id: User
  
  // Status
  status: enum [draft, in_progress, submitted, in_review, graduated, killed, parked]
  
  // Links
  repository_url: string (optional)
  prototype_url: string (optional)
  documentation_url: string (optional)
  
  // Curation
  curation_submission_id: CurationSubmission (optional)
  
  // Challenge (if created for a challenge)
  challenge_id: Challenge (optional)
  
  // Relationships
  similar_creations: [Creation]
  related_production_assets: [ProductionAsset]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}
```

## Curation

```
CurationSubmission {
  id: UUID
  creation_id: Creation
  submitted_by: User
  submitted_at: timestamp
  
  // The Five Questions (creator's answers)
  q1_should_exist: text
  q2_what_breaks: text
  q3_does_it_fit: text
  q4_who_owns: User
  q5_burden: text
  
  // Supporting materials
  blast_radius_assessment: BlastRadiusAssessment
  proposed_tier: enum [1, 2, 3, 4]
  
  // Review
  assigned_curator: User (optional)
  status: enum [pending, in_review, decided]
  decision: enum [graduate, iterate, kill, park] (optional)
  decision_rationale: text (optional)
  decision_at: timestamp (optional)
  decided_by: User (optional)
  
  // Iteration tracking
  iteration_count: int
  previous_submissions: [CurationSubmission]
  
  // Points awarded
  points_awarded: int
}
```

## Production Asset

```
ProductionAsset {
  id: UUID
  tenant_id: Tenant
  workspace_id: Workspace
  
  // Identity
  name: string
  description: text
  type: enum [feature, service, integration, component, page, api_endpoint, other]
  
  // Ownership
  owner_id: User
  ownership_started_at: timestamp
  ownership_history: [OwnershipRecord]
  
  // Origin
  graduated_from: Creation (optional)
  graduated_at: timestamp (optional)
  
  // Technical metadata
  repository: string
  code_paths: [string]
  dependencies: [ProductionAsset]
  dependents: [ProductionAsset]
  
  // Health
  status: enum [active, deprecated, decommissioned]
  health_score: float
  last_incident_at: timestamp (optional)
  
  // Coherence
  patterns_used: [Pattern]
  coherence_flags: [CoherenceFlag]
  
  // Documentation
  documentation_url: string
  runbook_url: string (optional)
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

OwnershipRecord {
  id: UUID
  production_asset_id: ProductionAsset
  owner_id: User
  started_at: timestamp
  ended_at: timestamp (optional)
  transfer_reason: text (optional)
  transferred_to: User (optional)
}
```

## Blast Radius

```
BlastRadiusAssessment {
  id: UUID
  creation_id: Creation
  assessed_by: User
  assessed_at: timestamp
  
  // Automated analysis
  detected_dependencies: [ProductionAsset]
  detected_database_impacts: [DatabaseImpact]
  detected_api_changes: [APIChange]
  estimated_tier: enum [1, 2, 3, 4]
  
  // Human assessment
  curator_notes: text (optional)
  curator_tier_override: enum [1, 2, 3, 4] (optional)
  curator_concerns: [string]
  
  // Risk factors
  affects_auth: boolean
  affects_billing: boolean
  affects_data_model: boolean
  new_external_dependency: boolean
  breaking_api_change: boolean
}
```

## Patterns & Coherence

```
Pattern {
  id: UUID
  tenant_id: Tenant
  
  name: string
  description: text
  category: enum [ui, api, data, integration, infrastructure]
  
  // Documentation
  documentation_url: string
  examples: [string]
  
  // Usage
  production_assets_using: [ProductionAsset]
  
  // Lifecycle
  status: enum [active, deprecated, proposed]
  introduced_at: timestamp
  deprecated_at: timestamp (optional)
}

CoherenceFlag {
  id: UUID
  production_asset_id: ProductionAsset
  flagged_by: User
  flagged_at: timestamp
  
  type: enum [pattern_violation, inconsistent_ux, duplicate_functionality, architectural_drift]
  description: text
  severity: enum [low, medium, high]
  
  // Resolution
  status: enum [open, acknowledged, resolved, wont_fix]
  resolved_at: timestamp (optional)
  resolution_notes: text (optional)
}
```

## Incidents

```
Incident {
  id: UUID
  tenant_id: Tenant
  
  title: string
  description: text
  severity: enum [sev1, sev2, sev3, sev4]
  
  // Attribution
  affected_assets: [ProductionAsset]
  primary_owner: User
  
  // Timeline
  detected_at: timestamp
  acknowledged_at: timestamp (optional)
  resolved_at: timestamp (optional)
  
  // Resolution
  resolution_notes: text (optional)
  root_cause: text (optional)
  post_mortem_url: string (optional)
  
  // Source
  source: enum [alert, customer_report, internal_report]
  external_incident_id: string (optional)
}
```

## Challenges

```
Challenge {
  id: UUID
  tenant_id: Tenant
  workspace_id: Workspace (optional, null = org-wide)
  
  // Content
  title: string
  problem_statement: text
  context: text
  success_criteria: text
  
  // Categorization
  type: enum [customer_problem, technical_debt, coherence, strategic, efficiency, moonshot]
  difficulty: enum [starter, intermediate, advanced, expert]
  tags: [string]
  
  // Timing
  status: enum [draft, open, judging, completed, canceled]
  opens_at: timestamp
  closes_at: timestamp
  judging_ends_at: timestamp
  
  // Ownership
  sponsor_id: User
  created_by: User
  judges: [User]
  
  // Rewards
  reward_type: enum [points, prize, recognition, budget, promotion_consideration]
  reward_description: text
  points_value: int
  
  // Results
  winning_submissions: [ChallengeSubmission]
  total_submissions: int
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

ChallengeSubmission {
  id: UUID
  challenge_id: Challenge
  creation_id: Creation
  
  // Team
  submitted_by: User
  team_members: [User]
  
  // Content
  solution_summary: text
  demo_url: string (optional)
  presentation_url: string (optional)
  
  // Judging
  status: enum [submitted, under_review, shortlisted, winner, runner_up, honorable_mention, not_selected]
  judge_scores: [JudgeScore]
  average_score: float
  judge_feedback: text (optional)
  
  // Metadata
  submitted_at: timestamp
}

JudgeScore {
  id: UUID
  submission_id: ChallengeSubmission
  judge_id: User
  
  criteria_scores: {
    innovation: int,
    feasibility: int,
    impact: int,
    presentation: int
  }
  overall_score: float
  feedback: text
  
  scored_at: timestamp
}
```

## Hackathons

```
Hackathon {
  id: UUID
  tenant_id: Tenant
  
  // Content
  name: string
  description: text
  theme: string (optional)
  rules: text
  
  // Timing
  status: enum [announced, registration_open, in_progress, judging, completed]
  registration_opens_at: timestamp
  registration_closes_at: timestamp
  starts_at: timestamp
  ends_at: timestamp
  judging_ends_at: timestamp
  
  // Format
  format: enum [individual, team, both]
  max_team_size: int
  min_team_size: int
  
  // Tracks
  tracks: [HackathonTrack]
  
  // Challenges within hackathon
  challenges: [Challenge]
  
  // Participation
  registrations: [HackathonRegistration]
  max_participants: int (optional)
  
  // Prizes
  prizes: [HackathonPrize]
  
  // Logistics
  location: string (optional)
  virtual_platform_url: string (optional)
  slack_channel: string (optional)
  
  // Staff
  organizers: [User]
  mentors: [User]
  judges: [User]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

HackathonTrack {
  id: UUID
  hackathon_id: Hackathon
  name: string
  description: text
  specific_challenges: [Challenge]
  prizes: [HackathonPrize]
}

HackathonRegistration {
  id: UUID
  hackathon_id: Hackathon
  user_id: User
  team_id: HackathonTeam (optional)
  track_id: HackathonTrack (optional)
  
  status: enum [registered, confirmed, withdrawn, no_show]
  registered_at: timestamp
  
  looking_for_team: boolean
  skills: [string]
  interests: [string]
}

HackathonTeam {
  id: UUID
  hackathon_id: Hackathon
  
  name: string
  members: [User]
  captain_id: User
  track_id: HackathonTrack (optional)
  
  submissions: [ChallengeSubmission]
  status: enum [forming, confirmed, submitted, winner]
}

HackathonPrize {
  id: UUID
  hackathon_id: Hackathon
  track_id: HackathonTrack (optional)
  
  place: enum [first, second, third, category_winner, honorable_mention]
  category: string (optional)
  description: text
  value: string
  points_value: int
}
```

## Competitions

```
Competition {
  id: UUID
  tenant_id: Tenant
  
  name: string
  description: text
  rules: text
  
  // Type and timing
  type: enum [sprint, seasonal, ongoing, tournament]
  status: enum [upcoming, active, completed]
  starts_at: timestamp
  ends_at: timestamp (null for ongoing)
  
  // Scoring
  scoring_model: enum [points, wins, judge_score, peer_vote, composite]
  scoring_criteria: JSON
  
  // Participation
  eligibility: enum [all, workspace, role, invite_only]
  eligible_workspaces: [Workspace]
  eligible_roles: [string]
  
  // Leaderboard
  leaderboard_visibility: enum [public, participants_only, end_only]
  
  // Prizes
  prizes: [CompetitionPrize]
  
  // Metadata
  created_at: timestamp
}

CompetitionEntry {
  id: UUID
  competition_id: Competition
  user_id: User
  
  score: float
  rank: int
  
  creations_submitted: [Creation]
  challenges_won: [Challenge]
  points_earned: int
  
  status: enum [active, withdrawn, disqualified]
  
  joined_at: timestamp
  last_activity_at: timestamp
}

TournamentBracket {
  id: UUID
  competition_id: Competition
  
  rounds: [TournamentRound]
  current_round: int
  format: enum [single_elimination, double_elimination, round_robin]
  seeds: [TournamentSeed]
}

TournamentMatch {
  id: UUID
  bracket_id: TournamentBracket
  round: int
  
  participant_a: User or HackathonTeam
  participant_b: User or HackathonTeam
  challenge_id: Challenge
  
  winner: User or HackathonTeam
  score_a: float
  score_b: float
  
  status: enum [scheduled, in_progress, completed]
  scheduled_at: timestamp
  completed_at: timestamp
}
```

## Gamification

```
Level {
  id: UUID
  tenant_id: Tenant
  
  level_number: int
  title: string
  points_required: int
  
  perks: [LevelPerk]
  
  badge_icon: string
  badge_color: string
}

Badge {
  id: UUID
  tenant_id: Tenant (null for system badges)
  
  name: string
  description: string
  icon: string
  rarity: enum [common, uncommon, rare, epic, legendary]
  
  criteria_type: enum [count, streak, milestone, special]
  criteria_config: JSON
  
  hidden: boolean
}

UserBadge {
  id: UUID
  user_id: User
  badge_id: Badge
  earned_at: timestamp
  trigger_event: string
}

Streak {
  id: UUID
  user_id: User
  
  streak_type: enum [daily_active, weekly_creation, curation_participation]
  current_count: int
  longest_count: int
  
  last_activity_at: timestamp
  streak_started_at: timestamp
}

PointTransaction {
  id: UUID
  user_id: User
  
  amount: int
  reason: enum [creation, submission, graduation, challenge_win, hackathon, streak_bonus, etc.]
  source_type: string
  source_id: UUID
  
  created_at: timestamp
}

Leaderboard {
  id: UUID
  tenant_id: Tenant
  workspace_id: Workspace (optional)
  
  name: string
  description: string
  
  scope: enum [all_time, yearly, quarterly, monthly, weekly]
  metric: enum [points, creations, graduations, challenge_wins, hackathon_wins]
  
  visibility: enum [public, workspace, private]
  show_top_n: int
  show_user_position: boolean
}

Reward {
  id: UUID
  tenant_id: Tenant
  
  name: string
  description: string
  type: enum [points, badge, physical, experiential, career, custom]
  
  fulfillment_type: enum [automatic, manual, external]
  fulfillment_instructions: text
  
  quantity_available: int (null for unlimited)
  quantity_claimed: int
  
  points_cost: int (optional)
}

RewardClaim {
  id: UUID
  user_id: User
  reward_id: Reward
  
  earned_via: enum [challenge, hackathon, competition, redemption, admin_grant]
  source_id: UUID
  
  status: enum [pending, processing, fulfilled, failed]
  fulfilled_at: timestamp
  fulfillment_notes: text
  
  claimed_at: timestamp
}
```

## Billing

```
Subscription {
  id: UUID
  tenant_id: Tenant
  
  plan: enum [free, starter, professional, enterprise]
  status: enum [trialing, active, past_due, canceled]
  
  current_period_start: timestamp
  current_period_end: timestamp
  trial_ends_at: timestamp (optional)
  
  stripe_customer_id: string
  stripe_subscription_id: string
  
  // Usage
  users_count: int
  workspaces_count: int
  creations_this_month: int
  production_assets_count: int
  
  created_at: timestamp
  updated_at: timestamp
}

Invoice {
  id: UUID
  tenant_id: Tenant
  
  stripe_invoice_id: string
  amount: decimal
  currency: string
  status: enum [draft, open, paid, void, uncollectible]
  
  period_start: timestamp
  period_end: timestamp
  due_date: timestamp
  paid_at: timestamp (optional)
  
  pdf_url: string
}
```

## Audit Log

```
AuditLogEntry {
  id: UUID
  tenant_id: Tenant
  
  actor_id: User
  actor_type: enum [user, system, admin]
  
  action: string
  resource_type: string
  resource_id: UUID
  
  details: JSON
  ip_address: string
  user_agent: string
  
  created_at: timestamp
}
```

---

# Part 5: Module 1: Creation Registry

## Purpose

Track all experiments, prototypes, and solutions across the organization. Enable discovery, prevent duplication, and provide the foundation for curation workflow.

## Feature 1.1: Create New Creation

**User Story:** As a Creator, I want to register a new creation so that it's visible to the org and I can track its progress.

**Acceptance Criteria:**
- User can create a new Creation with title, description, problem statement
- User can link to repository, prototype, documentation
- System suggests similar existing creations based on description
- Creation is visible to workspace members immediately
- Creation appears in org-wide activity feed
- Points awarded for creation (10 points)

**UI/UX:**
- Simple form with progressive disclosure
- AI-assisted similar creation detection
- Workspace auto-populated from user profile
- Rich text editor for description

---

## Feature 1.2: Creation Discovery

**User Story:** As a Creator, I want to see what others are building so I can avoid duplication and learn from their work.

**Acceptance Criteria:**
- Searchable list of all creations (within accessible workspaces)
- Filter by: workspace, status, creator, date range, type
- Sort by: newest, recently updated, most discussed
- AI-powered semantic search ("show me creations related to reporting")
- Similar creation suggestions when creating new

**UI/UX:**
- Feed-style browse view with card layout
- Powerful search with typeahead
- Quick filters as pills
- Creation cards showing status, creator, workspace, time

---

## Feature 1.3: Creation Detail View

**User Story:** As a Creator, I want to see full details of a creation including its journey through curation.

**Acceptance Criteria:**
- Full creation details (description, problem statement, links)
- Status timeline (draft → in progress → submitted → decided)
- Curation submission history (if any)
- Related creations and production assets
- Discussion thread for comments
- Activity log

**UI/UX:**
- Single-page detail view
- Tabbed sections for different information types
- Timeline visualization for status history
- Inline commenting

---

## Feature 1.4: Creation Collaboration

**User Story:** As a Creator, I want to collaborate with others on a creation.

**Acceptance Criteria:**
- Add collaborators to a creation
- Collaborators can edit creation details
- Activity visible to all collaborators
- Notifications for collaborator activity
- Collaborators credited when creation graduates

---

## Feature 1.5: Creation Status Management

**User Story:** As a Creator, I want to update the status of my creation as I work on it.

**Acceptance Criteria:**
- Update status: draft → in_progress → submitted
- Add progress notes
- Link updated artifacts (repo, prototype)
- Status changes reflected in activity feed

---

# Part 6: Module 2: Curation Workflow

## Purpose

Structured evaluation process for graduating creations to production. Ensures quality, coherence, and clear accountability.

## The Five Questions Framework

Every creation seeking to graduate must answer:

| # | Question | What We're Really Asking |
|---|----------|-------------------------|
| 1 | **Should this exist?** | Does this solve a real problem worth solving? Is this the right solution? |
| 2 | **What breaks?** | What are the system consequences? Database load? Security surface? |
| 3 | **Does it fit?** | Is this coherent with our product's mental model? |
| 4 | **Who owns it?** | Who is accountable for outcomes? Who gets paged? |
| 5 | **What's the burden?** | What's the ongoing maintenance cost? Technical debt? |

## Curation Outcomes

| Outcome | Meaning | Points |
|---------|---------|--------|
| **Graduate** | Approved for production | 50 |
| **Iterate** | Promising but needs changes | 0 |
| **Kill** | Does not meet the bar | 10 (for learning) |
| **Park** | Right idea, wrong time | 5 |

## Feature 2.1: Submit for Curation

**User Story:** As a Creator, I want to submit my creation for curation review with all required information.

**Acceptance Criteria:**
- Guided submission flow with the Five Questions
- Blast radius assessment tool (automated + manual input)
- Proposed owner selection (default: self)
- Proposed change tier (1-4)
- Attach supporting materials (demo, docs)
- Validation that all required fields are complete
- Confirmation and submission tracking
- Points awarded for submission (15 points)

**UI/UX:**
- Step-by-step wizard (5 steps matching 5 questions)
- Progress indicator
- Save draft capability
- Preview before submit
- Blast radius visualization

---

## Feature 2.2: Curation Queue

**User Story:** As a Production Curator, I want to see all pending submissions so I can prioritize my reviews.

**Acceptance Criteria:**
- Queue of all pending submissions (for accessible workspaces)
- Sort by: submission date, proposed tier, aging
- Filter by: tier, workspace, creator, status
- Aging indicator (submissions > 24h highlighted yellow, > 48h red)
- Claim/assign functionality
- Queue depth metrics

**UI/UX:**
- Kanban-style board: Pending → In Review → Decided
- Quick preview on hover/click
- Bulk assignment capability
- SLA countdown visible

---

## Feature 2.3: Curation Review

**User Story:** As a Production Curator, I want to evaluate a submission against the Five Questions with all context available.

**Acceptance Criteria:**
- Single view showing:
  - Creator's answers to Five Questions
  - Blast radius assessment (automated + manual)
  - Similar/related creations
  - Affected production assets
  - Creator profile and history
  - Challenge context (if applicable)
- Ability to add curator notes per question
- Decision capture: Graduate / Iterate / Kill / Park
- Required rationale for all decisions
- Feedback field for Iterate decisions

**UI/UX:**
- Split view: submission on left, evaluation tools on right
- Collapsible sections for each question
- Inline commenting
- Decision confirmation modal with rationale requirement

---

## Feature 2.4: Curation Decision Notification

**User Story:** As a Creator, I want to see the decision on my submission with clear feedback.

**Acceptance Criteria:**
- Real-time notification when decision is made
- Decision displayed with full rationale
- For Iterate: specific feedback on what to change
- For Kill/Park: learning captured and shared
- Ability to resubmit after addressing feedback
- Points awarded based on outcome

**UI/UX:**
- Clear decision badge (Graduate ✓ / Iterate ↻ / Kill ✗ / Park ⏸)
- Expandable rationale
- "Address Feedback" action for Iterate
- Iteration history visible

---

## Feature 2.5: Curation Analytics

**User Story:** As a Production Curator, I want to see patterns in curation decisions to calibrate the bar.

**Acceptance Criteria:**
- Dashboard showing:
  - Submissions over time
  - Decision distribution
  - Average cycle time
  - Decisions by curator (for calibration)
  - Common iteration feedback themes
  - Graduate success rate (do graduated items stay healthy?)
- Filterable by time period, workspace, curator

---

## Feature 2.6: Change Tier System

Changes to existing production code use tiered approval:

| Tier | Scope | Process | Examples |
|------|-------|---------|----------|
| **1** | Cosmetic/copy | Owner approves | Typo fix, padding adjustment |
| **2** | Contained feature | Owner + code review | New filter option |
| **3** | Cross-cutting | Curator review required | Auth flow change |
| **4** | Architectural | Curator + leadership | New data model |

**Acceptance Criteria:**
- Creator proposes tier during submission
- System recommends tier based on blast radius analysis
- Curator can override tier with justification
- Tier determines required approval workflow

---

# Part 7: Module 3: Ownership Registry

## Purpose

Source of truth for who owns what in production. Clear accountability, efficient incident response, clean handoffs.

## Feature 3.1: Ownership Assignment

**User Story:** As a Production Curator, I want to assign ownership when a creation graduates so accountability is clear.

**Acceptance Criteria:**
- Owner assignment required for graduation (blocker)
- Owner must accept ownership before graduation completes
- Ownership recorded with timestamp
- Owner notified of new ownership
- Owner added to relevant on-call rotations

**UI/UX:**
- Owner selection in graduation flow
- Ownership acceptance modal with responsibilities summary
- Clear indication of pending acceptance

---

## Feature 3.2: My Ownership Dashboard

**User Story:** As an Accountable Owner, I want to see everything I own in one place.

**Acceptance Criteria:**
- List of all production assets I own
- Health indicators for each asset
- Recent incidents by asset
- Pending changes requiring my approval
- Quick actions: view details, initiate deprecation, transfer ownership
- Ownership points (5 points/month per healthy asset)

**UI/UX:**
- Dashboard-style personal view
- Health status cards (green/yellow/red)
- Action-oriented quick links
- Filterable and searchable

---

## Feature 3.3: Ownership Transfer

**User Story:** As an Accountable Owner, I want to transfer ownership to someone else with proper handoff.

**Acceptance Criteria:**
- Initiate transfer request
- Select new owner (within workspace or org)
- Document transfer reason
- Handoff checklist (documentation, context transfer, access)
- New owner must accept
- Ownership history preserved
- Both parties notified at each step

**UI/UX:**
- Transfer wizard with checklist
- Acceptance flow for new owner
- Handoff documentation template
- Timeline of transfer process

---

## Feature 3.4: Ownership Audit

**User Story:** As an Engineering Leader, I want to audit ownership coverage to ensure nothing is orphaned.

**Acceptance Criteria:**
- List of all production assets with owners
- Flag orphaned assets (no owner, owner left company)
- Flag stale ownership (owner hasn't engaged in X days)
- Bulk reassignment capability
- Scheduled audit reports (weekly/monthly)

**UI/UX:**
- Audit report view with filters
- Problem state highlighting
- Bulk action toolbar
- Export capability

---

## Feature 3.5: Ownership Directory

**User Story:** As anyone in the org, I want to find out who owns a piece of production code.

**Acceptance Criteria:**
- Searchable directory of all production assets
- Search by name, code path, feature area
- Owner clearly displayed with contact info
- Link to ownership history
- Quick action to contact owner

---

# Part 8: Module 4: Blast Radius Engine

## Purpose

Automated and human-assisted consequence assessment. Understand what a change might break before it ships.

## Feature 4.1: Automated Dependency Detection

**User Story:** As a Creator, I want the system to automatically detect what my creation might affect.

**Acceptance Criteria:**
- Analyze code/configuration to detect:
  - Database tables touched
  - APIs called/modified
  - Services depended on
  - Shared components used
  - External integrations affected
- Map detected dependencies to production assets
- Generate visual dependency graph
- Auto-suggest change tier based on analysis

**Technical Implementation:**
- Static code analysis (AST parsing)
- Database schema inspection
- API contract analysis (OpenAPI)
- Integration with source control

---

## Feature 4.2: Blast Radius Visualization

**User Story:** As a Production Curator, I want to visualize the blast radius of a proposed change.

**Acceptance Criteria:**
- Interactive dependency graph
- Highlight affected production assets
- Show downstream dependents (transitive impact)
- Risk scoring based on what's affected
- Historical incident data overlay for affected areas

**UI/UX:**
- Force-directed graph visualization
- Click to expand/explore nodes
- Color coding by risk level
- Incident history tooltips

---

## Feature 4.3: Manual Blast Radius Input

**User Story:** As a Creator, I want to add blast radius information the system couldn't detect automatically.

**Acceptance Criteria:**
- Form to add:
  - Additional affected systems
  - Non-code impacts (process, documentation)
  - Customer-facing changes
  - Known risks and concerns
- Curator can add concerns during review

---

## Feature 4.4: Change Tier Recommendation

**User Story:** As a Creator, I want a recommended change tier based on blast radius analysis.

**Acceptance Criteria:**
- System recommends tier (1-4) based on:
  - Number of affected systems
  - Criticality of affected systems (auth, billing, data)
  - Type of change
  - Historical incident rate for affected areas
- Clear explanation of recommendation
- Curator can override with justification

**Tier Recommendation Logic:**

| Factor | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|--------|--------|--------|--------|--------|
| Systems affected | 1 | 2-3 | 4-10 | >10 |
| Touches auth/billing | No | No | Maybe | Yes |
| Data model change | No | No | No | Yes |
| Breaking API change | No | No | Maybe | Yes |
| New external dependency | No | No | Yes | Yes |

---

# Part 9: Module 5: Coherence Dashboard

## Purpose

Visibility into product coherence and pattern compliance. Prevent Frankenstein products.

## Feature 5.1: Pattern Library

**User Story:** As a Creator, I want to see approved patterns so I can build coherently.

**Acceptance Criteria:**
- Browsable pattern library
- Categories: UI, API, Data, Integration, Infrastructure
- Each pattern includes:
  - Description and rationale
  - When to use / when not to use
  - Code examples
  - Production assets using this pattern
- Search and filter
- Version history

**UI/UX:**
- Documentation-style browse
- Code examples with syntax highlighting
- "Used by" section showing real implementations
- Copy-to-clipboard for examples

---

## Feature 5.2: Pattern Compliance Check

**User Story:** As a Production Curator, I want to check if a creation follows approved patterns.

**Acceptance Criteria:**
- Automated pattern detection in submitted code
- Flag deviations from approved patterns
- Distinguish between:
  - Approved pattern (✓)
  - New pattern (needs review)
  - Anti-pattern (violation)
- Curator can approve new patterns or flag violations

---

## Feature 5.3: Coherence Scoring

**User Story:** As an Engineering Leader, I want to see overall product coherence metrics.

**Acceptance Criteria:**
- Coherence score (0-100, computed from compliance and flags)
- Trend over time
- Breakdown by area/workspace
- List of open coherence flags
- "Frankenstein watch" list (areas with degrading coherence)

**Coherence Score Factors:**
- Pattern compliance rate
- Open coherence flags (weighted by severity)
- Duplicate functionality instances
- Architectural drift indicators

---

## Feature 5.4: Coherence Flags

**User Story:** As anyone, I want to flag a coherence issue I've noticed.

**Acceptance Criteria:**
- Create flag with:
  - Affected production asset(s)
  - Type (pattern violation, inconsistent UX, duplicate functionality, architectural drift)
  - Description
  - Severity (low, medium, high)
- Flags routed to owner and curators
- Resolution workflow (acknowledge, resolve, won't fix)
- Points for valuable flags (10 points for confirmed issues)

---

## Feature 5.5: Coherence Review

**User Story:** As a Production Curator, I want to conduct periodic coherence reviews.

**Acceptance Criteria:**
- Schedule recurring coherence reviews
- Review checklist by area
- Document findings
- Track remediation actions
- Publish review summary

---

# Part 10: Module 6: Incident Attribution

## Purpose

Connect incidents to ownership for accountability. Fast response, clear responsibility.

## Feature 6.1: Incident Ingestion

**User Story:** As the system, I need to ingest incidents from alerting tools.

**Acceptance Criteria:**
- Webhook integration with PagerDuty/Opsgenie
- Ingest: severity, description, affected services
- Map affected services to production assets
- Determine primary owner automatically
- Create incident record in Curator

**Technical Implementation:**
- Webhook endpoint per provider
- Service-to-asset mapping configuration
- Owner lookup from ownership registry

---

## Feature 6.2: Incident Dashboard

**User Story:** As an Accountable Owner, I want to see incidents related to my assets.

**Acceptance Criteria:**
- My incidents (current and historical)
- Incident details with full timeline
- Resolution tracking
- Post-mortem linking
- Filter by severity, status, date range

---

## Feature 6.3: Incident Response Workflow

**User Story:** As an Accountable Owner, I want clear workflow when an incident occurs.

**Acceptance Criteria:**
- Notification via configured channels (Slack, email, push)
- Acknowledge action (stops escalation timer)
- Update status as working
- Resolve with notes
- Link to post-mortem (required for sev1/sev2)

---

## Feature 6.4: Incident Analytics

**User Story:** As an Engineering Leader, I want to see incident patterns across the org.

**Acceptance Criteria:**
- Incidents over time (trend)
- Incidents by severity distribution
- Incidents by owner (identify overloaded owners)
- Incidents by production asset (identify problematic areas)
- MTTA (mean time to acknowledge)
- MTTR (mean time to resolve)
- Repeat incident detection
- Points impact (owners lose bonus points for incidents)

---

# Part 11: Module 7: Challenges

## Purpose

Focus collective energy on specific organizational problems through time-boxed challenges.

## Challenge Types

| Type | Description | Example |
|------|-------------|---------|
| **Customer Problem** | Real customer pain points | "Reduce time-to-first-insight" |
| **Technical Debt** | System issues needing fixes | "Improve report performance 10x" |
| **Coherence Issue** | Product inconsistencies | "Unify filter patterns" |
| **Strategic Initiative** | Big bets to explore | "AI-native audience building" |
| **Efficiency Gain** | Internal improvements | "Automate onboarding docs" |
| **Moonshot** | Ambitious, transformative | "Predict market trends" |

## Feature 7.1: Create Challenge

**User Story:** As a sponsor (leader/curator), I want to create a challenge to focus the org on a specific problem.

**Acceptance Criteria:**
- Create challenge with:
  - Problem statement
  - Context and constraints
  - Success criteria
  - Difficulty level
  - Type/category
  - Timeline (open, close, judging end)
  - Judges
  - Rewards (points, prizes, recognition)
- Preview before publishing
- Save as draft
- Schedule for future opening

**UI/UX:**
- Multi-step creation wizard
- Rich text for problem statement
- Timeline picker with validation
- Judge selection with availability check
- Reward configuration panel

---

## Feature 7.2: Challenge Discovery

**User Story:** As a Creator, I want to discover challenges I can contribute to.

**Acceptance Criteria:**
- Browse open challenges
- Filter by: type, difficulty, workspace, reward, deadline
- Sort by: newest, closing soon, most submissions, highest reward
- Search by keyword
- "Recommended for you" based on skills/history
- Challenge cards with key info at glance

**UI/UX:**
- Card grid with visual appeal
- Prominent countdown for "closing soon"
- Difficulty and reward badges
- Submission count indicator

---

## Feature 7.3: Challenge Detail

**User Story:** As a Creator, I want to understand a challenge fully before committing.

**Acceptance Criteria:**
- Full problem statement with context
- Success criteria clearly displayed
- Timeline with key dates
- Judges listed with bios
- Rewards explained
- Current submissions (count, optionally preview)
- Discussion thread for questions
- "Start Working on This" action

---

## Feature 7.4: Submit to Challenge

**User Story:** As a Creator, I want to submit my creation as a solution to a challenge.

**Acceptance Criteria:**
- Link existing creation or create new
- Add team members (if collaborative)
- Write solution summary
- Add demo/presentation links
- Preview submission
- Submit before deadline
- Edit until deadline (version history preserved)
- Points awarded for submission (25 points)

---

## Feature 7.5: Judge Submissions

**User Story:** As a judge, I want to evaluate submissions fairly.

**Acceptance Criteria:**
- See all submissions assigned for judging
- Score against defined criteria (configurable per challenge)
- Provide written feedback
- Flag conflicts of interest
- Compare submissions side-by-side
- Submit final scores
- Deliberate with other judges (comments/discussion)

**Default Scoring Criteria:**
- Innovation (1-10)
- Feasibility (1-10)
- Impact (1-10)
- Presentation (1-10)

**UI/UX:**
- Scoring rubric always visible
- Blind judging option (hide submitter names)
- Calibration view (see score distribution)
- Side-by-side comparison mode

---

## Feature 7.6: Announce Winners

**User Story:** As a sponsor, I want to announce challenge winners and celebrate them.

**Acceptance Criteria:**
- Select winners (1st, 2nd, 3rd), runners-up, honorable mentions
- Add sponsor commentary
- Trigger notifications to all participants
- Auto-post to activity feed
- Award points automatically:
  - Winner: 200 points
  - Runner-up: 100 points
  - Honorable mention: 50 points
- Generate shareable announcement
- Winner badge awarded

---

# Part 12: Module 8: Hackathons

## Purpose

Organized, time-boxed events where teams compete to build solutions. High energy, high engagement, big outcomes.

## Feature 8.1: Create Hackathon

**User Story:** As an organizer, I want to create and configure a hackathon event.

**Acceptance Criteria:**
- Set name, description, theme, rules
- Configure timeline:
  - Registration open/close
  - Event start/end
  - Judging period
- Set format (individual/team) and team size limits
- Create tracks (optional sub-competitions)
- Link or create challenges
- Define prizes by track/category
- Assign mentors and judges
- Configure virtual platform integration
- Set participant cap (optional)

---

## Feature 8.2: Hackathon Landing Page

**User Story:** As a potential participant, I want to learn about and register for a hackathon.

**Acceptance Criteria:**
- Event overview and theme
- Timeline visualization
- Tracks and challenges preview
- Prizes displayed
- Judges and mentors bios
- Registration CTA
- FAQ section
- Countdown to event

---

## Feature 8.3: Registration

**User Story:** As a participant, I want to register for a hackathon.

**Acceptance Criteria:**
- Register as individual or with team
- Select track (if applicable)
- Indicate if looking for team
- List skills and interests (for matching)
- Receive confirmation email
- Add to calendar option
- Points for registration (10 points)

---

## Feature 8.4: Team Formation

**User Story:** As a participant looking for a team, I want to find teammates.

**Acceptance Criteria:**
- Browse participants looking for teams
- Filter by skills, interests, track preference
- View participant profiles
- Send team invitation
- Accept/decline invitations
- Create new team with name
- Join existing team (if open)
- Team chat/discussion

**UI/UX:**
- "Team Mixer" matching interface
- Skill tags for quick scanning
- Real-time team formation updates
- Compatibility suggestions

---

## Feature 8.5: Live Hackathon Dashboard

**User Story:** As a participant during the hackathon, I want a central hub.

**Acceptance Criteria:**
- Prominent countdown timer
- My team info and challenge
- Announcements feed (organizer posts)
- Mentor help queue
- Submission status and progress
- Leaderboard (if public scoring)
- Resources and links
- Team activity feed

**UI/UX:**
- Single-page dashboard optimized for event
- Real-time updates
- Prominent timer
- Quick access to key actions

---

## Feature 8.6: Mentor Support Queue

**User Story:** As a participant, I want to get help from mentors.

**Acceptance Criteria:**
- Request mentor help (join queue)
- Describe problem/question
- See queue position and estimated wait
- Get matched with available mentor
- Video/chat session capability
- Rate mentor session afterward

**For mentors:**
- See help queue with request details
- Claim requests
- Track sessions helped
- Points for mentoring (30 points per session)

---

## Feature 8.7: Hackathon Submission

**User Story:** As a team, I want to submit our project.

**Acceptance Criteria:**
- Submit before deadline (hard cutoff)
- Link to creation in Curator
- Add demo video (required or optional per hackathon)
- Add presentation deck
- Tag which challenges/tracks addressed
- Confirm all team members
- Edit until deadline

---

## Feature 8.8: Hackathon Judging

**User Story:** As a judge, I want to evaluate hackathon submissions.

**Acceptance Criteria:**
- See submissions by track
- Watch demo videos
- Score against criteria
- Provide feedback
- Rank submissions within track
- Deliberate with other judges
- Final winner selection

---

## Feature 8.9: Hackathon Results & Celebration

**User Story:** As everyone, I want to see results and celebrate winners.

**Acceptance Criteria:**
- Winners announced per track/category
- Live reveal option (for in-person/virtual events)
- All submissions viewable (gallery)
- Judge feedback available
- Points awarded automatically:
  - Participation: 75 points
  - Winner: 300 points
  - Runner-up: 150 points
- Winner badges awarded
- Shareable certificates
- Recap/highlight reel (optional)

---

# Part 13: Module 9: Competitions

## Purpose

Ongoing or periodic contests that drive sustained engagement beyond one-off events.

## Competition Types

| Type | Duration | Example |
|------|----------|---------|
| **Sprint** | Weekly/bi-weekly | "Best coherence improvement this week" |
| **Seasonal** | Quarterly | "Q1 Innovation Cup" |
| **Ongoing** | Continuous | "All-time leaderboard" |
| **Tournament** | Bracket-style | "Creation Championship" |

## Feature 9.1: Create Competition

**User Story:** As an admin, I want to create different types of competitions.

**Acceptance Criteria:**
- Select competition type
- Configure timing (start, end, or ongoing)
- Define scoring model:
  - Points accumulated
  - Wins accumulated
  - Judge scores
  - Peer voting
  - Composite formula
- Set eligibility (all, workspace, role, invite)
- Configure leaderboard visibility
- Define prizes

---

## Feature 9.2: Competition Leaderboard

**User Story:** As a participant, I want to see where I stand.

**Acceptance Criteria:**
- Real-time leaderboard
- My rank highlighted
- Score breakdown (what contributed)
- Trend indicators (moving up/down/stable)
- Filter by workspace/team
- Historical comparison

**UI/UX:**
- Animated rank changes
- Podium visualization for top 3
- "Your position" sticky row
- Score details on hover

---

## Feature 9.3: Sprint Competitions

**User Story:** As an admin, I want to run short, focused competitions.

**Acceptance Criteria:**
- Create sprint with theme and duration (1-2 weeks)
- Auto-score based on defined criteria
- Automatic start/end based on schedule
- Weekly reset with results announcement
- Cumulative season tracking (optional)
- Automated winner notification

**Example Sprint Themes:**
- Most creations submitted
- Highest curation success rate
- Most helpful (peer recognition)
- Best documentation
- Most coherence improvements

---

## Feature 9.4: Tournament Mode

**User Story:** As an admin, I want to run bracket-style tournaments.

**Acceptance Criteria:**
- Create bracket (8, 16, 32 participants/teams)
- Seed participants:
  - Random
  - Ranked (by points)
  - Manual
- Define match format (head-to-head challenge)
- Advance winners automatically
- Handle byes and forfeits
- Display live bracket visualization

**UI/UX:**
- Classic bracket visualization
- Match detail view
- Progress through rounds
- Winner path highlighted

---

# Part 14: Module 10: Gamification System

## Purpose

Points, badges, levels, and leaderboards that reward participation and quality. Drive the behaviors that lead to great outcomes.

## Points Economy

### Earning Points

| Action | Points | Notes |
|--------|--------|-------|
| **Creation** | | |
| Create a creation | 10 | Base participation |
| Submit for curation | 15 | Shows intent to ship |
| Creation graduates | 50 | Quality outcome |
| Creation killed (with learning) | 10 | Learning is valued |
| **Ownership** | | |
| Own production asset (monthly) | 5 | Per healthy asset |
| Zero incidents (monthly) | 20 | Reliability bonus |
| Incident (deduction) | -10 | Per incident |
| **Challenges** | | |
| Submit to challenge | 25 | Participation |
| Win challenge | 200 | Major achievement |
| Runner-up | 100 | Strong showing |
| Honorable mention | 50 | Recognition |
| **Hackathons** | | |
| Register for hackathon | 10 | Commitment |
| Complete hackathon | 75 | Event participation |
| Win hackathon | 300 | Top achievement |
| Mentor a team | 30 | Per session |
| **Curation** | | |
| Quality curation decision | 20 | Per decision (curators) |
| Judge submissions | 15 | Per submission judged |
| **Engagement** | | |
| 7-day active streak | 25 | Consistency |
| 30-day active streak | 100 | Dedication |
| Flag confirmed coherence issue | 10 | Community contribution |
| **Milestones** | | |
| First creation | 50 | Onboarding bonus |
| First graduation | 100 | Major milestone |
| Refer colleague who creates | 25 | Community building |

### Point Decay (Optional, Configurable)

- No decay (default)
- Annual reset
- Rolling 12-month (oldest points expire)

---

## Levels & Titles

| Level | Title | Points Required | Perks |
|-------|-------|-----------------|-------|
| 1 | Newcomer | 0 | |
| 2 | Creator | 100 | |
| 3 | Builder | 300 | Access to advanced challenges |
| 4 | Contributor | 750 | Can mentor in hackathons |
| 5 | Innovator | 1,500 | Priority curation queue |
| 6 | Leader | 3,000 | Can sponsor challenges |
| 7 | Architect | 6,000 | Judge eligibility |
| 8 | Visionary | 10,000 | Feature in org spotlight |
| 9 | Legend | 20,000 | Permanent recognition |
| 10 | Founder | 50,000 | Hall of fame |

Levels and point thresholds are configurable per tenant.

---

## Badges & Achievements

### Badge Categories

**Creation Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| First Steps | Create first creation | Common |
| Creator | Create 10 creations | Common |
| Prolific | Create 50 creations | Uncommon |
| Machine | Create 100 creations | Rare |
| Legend | Create 500 creations | Legendary |

**Quality Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Graduated | First creation graduates | Common |
| Consistent | 5 consecutive graduations | Uncommon |
| Perfect Record | 10 graduations, 0 kills | Rare |
| Quality Master | 90%+ graduation rate (min 20) | Epic |

**Challenge Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Challenger | Submit to first challenge | Common |
| Competitor | Submit to 5 challenges | Common |
| Victor | Win first challenge | Uncommon |
| Triple Crown | Win 3 challenges | Rare |
| Champion | Win 10 challenges | Epic |
| Undefeated | Win 5 challenges in a row | Legendary |

**Hackathon Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Hacker | Complete first hackathon | Common |
| Team Player | Complete 3 team hackathons | Uncommon |
| Solo Hero | Win individual hackathon | Rare |
| Hackathon Legend | Win 5 hackathons | Legendary |

**Streak Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Week Warrior | 7-day active streak | Common |
| Month Master | 30-day active streak | Uncommon |
| Quarter Queen/King | 90-day active streak | Rare |
| Year Legend | 365-day active streak | Legendary |

**Special Badges:**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Early Adopter | Join in first month | Rare |
| Mentor | Help 10 hackathon teams | Uncommon |
| Wise Judge | Judge 20 submissions | Uncommon |
| Bug Hunter | Flag 10 confirmed issues | Rare |
| Community Champion | Top 10 all-time points | Epic |
| Founder's Circle | Top 3 all-time points | Legendary |

---

## Streaks

| Streak Type | Definition | Bonus |
|-------------|------------|-------|
| Daily Active | Any meaningful action per day | 25 pts at 7 days, 100 at 30 |
| Weekly Creation | At least one creation per week | Badge at 10 weeks |
| Challenge Streak | Consecutive challenge submissions | Multiplier on points |
| Quality Streak | Consecutive graduations | Badge at 5 |

---

## Leaderboards

**Default Leaderboards:**
- All-time points
- Monthly points
- Creations this quarter
- Challenge wins (yearly)
- Hackathon victories
- Current streak leaders
- Per-workspace leaders

**Leaderboard Features:**
- Configurable scope (all-time, year, quarter, month, week)
- Workspace filtering
- Role filtering
- My position always shown
- Trend indicators

---

## Feature 10.1: Gamification Profile

**User Story:** As a user, I want to see my gamification stats and progress.

**Acceptance Criteria:**
- Current level and title
- Total points and progress to next level
- Badges earned (with dates and triggers)
- Current streaks (with flames/indicators)
- Leaderboard positions
- Recent point history
- Stats comparison to org average
- Achievement showcase (featured badges)

**UI/UX:**
- Visual progress bar for level
- Badge grid with rarity indicators
- Streak flames animation
- Stats cards with sparkline trends

---

## Feature 10.2: Activity Feed

**User Story:** As a user, I want to see gamification activity across the org.

**Acceptance Criteria:**
- Real-time feed of achievements:
  - Badge earned
  - Level up
  - Challenge win
  - Hackathon result
  - Streak milestone
- Filter by workspace, achievement type
- Reactions/celebrations (🎉 emoji reactions)
- Configurable (can mute)

---

## Feature 10.3: Leaderboard Views

**User Story:** As a user, I want to explore different leaderboards.

**Acceptance Criteria:**
- Multiple leaderboard selection
- Scope toggles (all-time, month, week)
- Workspace filter
- My position always visible (sticky row)
- Click profile to view details
- Share leaderboard position

---

## Feature 10.4: Achievement Notifications

**User Story:** As a user, I want to be notified when I achieve something.

**Acceptance Criteria:**
- In-app notification for all achievements
- Celebratory animation for major milestones:
  - Confetti for level-up
  - Special animation for rare badges
- Email digest option (weekly achievements)
- Slack notification (configurable)
- Shareable achievement cards

---

## Feature 10.5: Rewards Store (Optional)

**User Story:** As a user, I want to redeem points for rewards.

**Acceptance Criteria:**
- Browse available rewards
- See point costs
- Check availability/inventory
- Redeem points for rewards
- Track redemption status
- View redemption history

**Example Rewards:**
- Company swag (t-shirt: 500 pts, hoodie: 1000 pts)
- Gift cards ($25: 2500 pts)
- Extra PTO hours (1 hour: 1000 pts)
- Lunch with leadership (5000 pts)
- Conference ticket (10000 pts)
- Charity donation in user's name (variable)

---

## Anti-Gaming Protections

| Risk | Mitigation |
|------|------------|
| Spam creations | Points only for submissions, not drafts; quality gates |
| Gaming challenges | Judge review required; no self-judging |
| Collusion | Anomaly detection; blind judging option |
| Point hoarding | Point decay option; focus on relative rank |
| Unfair advantages | Role-based adjustments; workspace normalization |

**Moderation Tools:**
- Flag suspicious activity
- Adjust/revoke points (with audit)
- Disqualify from competition
- Review full audit trail
- Temporary or permanent gamification ban

---

# Part 15: Module 11: Multi-Tenancy & Organizations

## Purpose

Enable Curator to serve multiple organizations with complete data isolation, per-tenant customization, and scalable operations.

## Tenant Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         TENANT (Organization)                    │
│  Example: "Acme Corp"                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │   Workspace A    │  │   Workspace B    │  │  Workspace C   │ │
│  │   (Product)      │  │   (Platform)     │  │  (Mobile)      │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                  │
│  Users belong to tenant, can access multiple workspaces          │
│  Data is isolated at tenant level                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Isolation

| Level | Isolation Method |
|-------|------------------|
| Tenant | Row-level security at database |
| Workspace | Application-level scoping |
| User PII | Encryption with tenant-specific keys |

## Feature 11.1: Organization Settings

**User Story:** As an Org Admin, I want to configure organization-wide settings.

**Settings Categories:**

| Category | Settings |
|----------|----------|
| General | Name, slug, logo, timezone, default language |
| Security | SSO, 2FA requirements, session timeout, IP allowlist |
| Integrations | GitHub org, Slack workspace, PagerDuty, etc. |
| Compliance | Data residency, audit log retention |
| Gamification | Enable/disable, point values, custom levels |
| Curation | Default SLA, required fields, tier configuration |

**Acceptance Criteria:**
- Only Org Admins can access
- Changes are audit logged
- Security changes require re-authentication
- Preview impact before applying

---

## Feature 11.2: Workspace Management

**User Story:** As an Org Admin, I want to create and manage workspaces.

**Acceptance Criteria:**
- Create workspace with name, description
- Configure workspace-specific settings:
  - Curation settings
  - Gamification overrides
  - Default curator assignment
- Assign workspace admins
- View workspace membership and activity
- Archive/delete workspaces (with retention policy)

---

## Feature 11.3: Self-Service Signup

**User Story:** As a potential customer, I want to sign up and start using Curator.

**Signup Flow:**
1. Landing page → "Start Free Trial"
2. Account creation (email, password or SSO, org name)
3. Email verification
4. Initial setup wizard:
   - Team size (for plan recommendation)
   - Primary use case
   - Invite teammates (optional)
   - Connect GitHub (optional)
5. Interactive product tour
6. First creation prompt

**Acceptance Criteria:**
- Complete flow in under 5 minutes
- No credit card required for free tier
- Sample data available
- Skip/defer optional steps

---

## Feature 11.4: Onboarding Checklist

**User Story:** As a new org admin, I want to know what to set up.

**Checklist Items:**
- [ ] Create your first creation
- [ ] Invite team members
- [ ] Connect source control (GitHub)
- [ ] Designate Production Curators
- [ ] Set up Slack notifications
- [ ] Submit first curation
- [ ] Run first challenge

**Acceptance Criteria:**
- Persistent widget (dismissible)
- Progress indicator
- Links to relevant actions
- Auto-check when completed

---

# Part 16: Module 12: User Management & Roles

## Role Hierarchy

### Organization Level

| Role | Capabilities |
|------|--------------|
| **Owner** | Full control, billing, can delete org, transfer ownership |
| **Admin** | Manage users, workspaces, integrations, settings |
| **Member** | Access granted workspaces only |

### Workspace Level

| Role | Capabilities |
|------|--------------|
| **Admin** | Manage workspace settings and members |
| **Curator** | Review and decide on curation submissions |
| **Creator** | Create, submit, own production assets |

## Permissions Matrix

| Permission | Org Owner | Org Admin | WS Admin | Curator | Creator |
|------------|-----------|-----------|----------|---------|---------|
| Manage billing | ✓ | | | | |
| Delete organization | ✓ | | | | |
| Manage org settings | ✓ | ✓ | | | |
| Manage all users | ✓ | ✓ | | | |
| Create workspaces | ✓ | ✓ | | | |
| Manage workspace settings | ✓ | ✓ | ✓ | | |
| Manage workspace members | ✓ | ✓ | ✓ | | |
| Review curation queue | ✓ | ✓ | ✓ | ✓ | |
| Make curation decisions | ✓ | ✓ | ✓ | ✓ | |
| Create creations | ✓ | ✓ | ✓ | ✓ | ✓ |
| Submit for curation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Own production assets | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create challenges | ✓ | ✓ | ✓ | | |
| Judge challenges | ✓ | ✓ | ✓ | ✓ | |
| Organize hackathons | ✓ | ✓ | | | |
| View analytics | ✓ | ✓ | ✓ | ✓ | Own only |

## Feature 12.1: User Invitation

**User Story:** As an Org Admin, I want to invite users to my organization.

**Acceptance Criteria:**
- Invite by email (single or bulk CSV)
- Set organization role on invite
- Set initial workspace memberships and roles
- Invitation expiry (7 days default, configurable)
- Resend/revoke invitations
- Invitation tracking (sent, viewed, accepted)
- SSO auto-provisioning (Enterprise)

---

## Feature 12.2: User Management

**User Story:** As an Org Admin, I want to manage users in my organization.

**Acceptance Criteria:**
- View all users with:
  - Name, email, role
  - Status (invited, active, deactivated)
  - Last active date
  - Workspace memberships
- Change user's organization role
- Manage workspace memberships
- Deactivate/reactivate users
- Transfer ownership (for Org Owner)
- Remove users (with ownership transfer workflow)

---

## Feature 12.3: SSO Integration (Professional+)

**User Story:** As an Org Admin, I want to configure SSO.

**Supported Providers:**
- SAML 2.0 (Okta, OneLogin, Azure AD, PingIdentity)
- OIDC (Google Workspace, Auth0)

**Acceptance Criteria:**
- Configure SSO provider with metadata/credentials
- Map IdP attributes to Curator roles
- Enable/require SSO for organization
- JIT (Just-in-Time) user provisioning
- Force SSO (disable password login)

---

## Feature 12.4: SCIM Provisioning (Enterprise)

**User Story:** As an Org Admin, I want automatic user sync from our IdP.

**Acceptance Criteria:**
- SCIM 2.0 endpoint
- Create/update/deactivate users automatically
- Group to workspace/role mapping
- Sync status dashboard
- Error handling and alerts

---

## Feature 12.5: Audit Log

**User Story:** As an Org Admin, I want to see all administrative actions.

**Logged Events:**
- User management (invite, role change, deactivation)
- Workspace management (create, settings change, archive)
- Organization settings changes
- Integration configuration changes
- Billing changes
- Data exports
- Curation decisions
- Challenge/hackathon creation

**Acceptance Criteria:**
- Searchable audit log
- Filter by actor, action type, date range
- Export to CSV/JSON
- Retention period configurable (Enterprise)
- Immutable (cannot be deleted by customers)

---

# Part 17: Module 13: Billing & Subscriptions

## Pricing Tiers

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| **Price** | $0 | $49/mo | $199/mo | Custom |
| **Users** | 5 | 25 | Unlimited | Unlimited |
| **Workspaces** | 1 | 3 | 10 | Unlimited |
| **Creations/month** | 50 | 250 | Unlimited | Unlimited |
| **Production assets** | 100 | 500 | Unlimited | Unlimited |
| **Curation history** | 30 days | 1 year | Unlimited | Unlimited |
| **Challenges** | 2/month | 10/month | Unlimited | Unlimited |
| **Hackathons** | | 2/year | Unlimited | Unlimited |
| **Integrations** | GitHub | +Slack, PagerDuty | +All | +Custom |
| **Blast radius** | Basic | Standard | Advanced | Advanced |
| **SSO** | | | ✓ | ✓ |
| **SCIM** | | | | ✓ |
| **Custom domain** | | | | ✓ |
| **Data residency** | US | US | US/EU | US/EU/APAC |
| **SLA** | | | 99.9% | 99.99% |
| **Support** | Community | Email | Priority | Dedicated |

## Feature 13.1: Subscription Management

**User Story:** As an Org Owner, I want to manage my subscription.

**Acceptance Criteria:**
- View current plan and usage
- Upgrade/downgrade plan
- View billing history
- Update payment method (Stripe integration)
- Download invoices (PDF)
- Cancel subscription (with data retention info)

---

## Feature 13.2: Usage Tracking

**User Story:** As an Org Owner, I want to see usage against limits.

**Tracked Metrics:**
- Active users (monthly)
- Workspaces
- Creations this month
- Production assets
- Challenge count
- API calls (if applicable)

**Acceptance Criteria:**
- Usage dashboard with current vs. limit
- Usage trend charts
- Alerts at 80% and 100% of limits
- Soft limits with grace period
- Upgrade prompts when approaching limits

---

## Feature 13.3: Billing Notifications

**Alert Types:**
- Approaching usage limit
- Payment failed
- Subscription expiring (trial)
- Plan change confirmation
- Invoice available

**Channels:** Email, in-app notification

---

# Part 18: Module 14: Internationalization

## Supported Languages

### Launch Languages (P1)

| Language | Code | Region |
|----------|------|--------|
| English (US) | en-US | Default |
| English (UK) | en-GB | UK |
| Spanish | es | LATAM, Spain |
| Portuguese (BR) | pt-BR | Brazil |
| French | fr | France, Canada |
| German | de | DACH |

### Phase 2 Languages (P2)

| Language | Code | Region |
|----------|------|--------|
| Japanese | ja | Japan |
| Korean | ko | Korea |
| Chinese (Simplified) | zh-CN | China |
| Chinese (Traditional) | zh-TW | Taiwan |

### Future (P3)

- Dutch, Italian, Polish, Russian
- Arabic, Hebrew (RTL support required)

## i18n Architecture

```
Translation Management (Crowdin/Lokalise)
                │
                ▼
Translation Files (JSON per locale)
  /locales
    /en-US
      common.json
      curation.json
      ownership.json
      challenges.json
      gamification.json
      admin.json
      billing.json
    /es
      ...
                │
                ▼
Application (react-i18next)
```

## Translation Namespaces

| Namespace | Content |
|-----------|---------|
| common | Shared UI (buttons, labels, errors, navigation) |
| curation | Curation workflow, Five Questions, decisions |
| ownership | Ownership registry, transfers, incidents |
| creation | Creation registry, discovery, submission |
| challenges | Challenges, submissions, judging |
| hackathons | Hackathon events, registration, teams |
| gamification | Points, badges, levels, leaderboards |
| admin | Organization/workspace settings |
| billing | Subscription, invoices, usage |
| emails | Transactional email templates |

## Feature 14.1: User Language Preference

**User Story:** As a user, I want to use Curator in my preferred language.

**Acceptance Criteria:**
- Language selector in user settings
- Language persists across sessions
- Fallback: user preference → org default → browser locale → en-US
- Language switch is immediate (no page reload)

---

## Feature 14.2: Organization Default Language

**User Story:** As an Org Admin, I want to set a default language.

**Acceptance Criteria:**
- Set default language in org settings
- New users default to org language
- Invitations and system emails sent in org language
- Users can override with personal preference

---

## Feature 14.3: Locale-Specific Formatting

| Element | en-US | de-DE | ja-JP |
|---------|-------|-------|-------|
| Date | Feb 4, 2026 | 4. Feb. 2026 | 2026年2月4日 |
| Time | 3:30 PM | 15:30 | 15:30 |
| Number | 1,234.56 | 1.234,56 | 1,234.56 |
| Currency | $199.00 | 199,00 $ | ¥199 |

**Implementation:** Intl API with locale-aware formatters

---

## Translation Workflow

1. Developer adds string: `t('curation.submit.success', 'Creation submitted!')`
2. String extracted to en-US JSON (CI automation)
3. String synced to Crowdin
4. Translators translate
5. Translations synced back via automated PR
6. Released with next deployment

---

# Part 19: Module 15: Admin Console

## Purpose

Platform operations console for Curator team to manage tenants, support customers, and monitor system health.

**Note:** This is separate from customer-facing org admin.

## Feature 15.1: Tenant Management

**User Story:** As a platform admin, I want to manage all tenants.

**Capabilities:**
- List all tenants with key metrics
- Search/filter tenants
- View tenant details (users, workspaces, usage, billing)
- Impersonate tenant admin (with audit logging)
- Modify tenant plan/limits
- Suspend/unsuspend tenant
- Delete tenant (with data retention)

**Tenant List Columns:**
- Name, Plan, Users, Workspaces, MRR, Created, Last Active, Health

---

## Feature 15.2: User Lookup

**User Story:** As a platform admin, I want to find and support users.

**Capabilities:**
- Search by email, name, tenant
- View user profile and activity
- View permissions across workspaces
- Impersonate user (with audit logging)
- Force password reset
- Deactivate user

---

## Feature 15.3: Billing Administration

**User Story:** As a platform admin, I want to manage billing.

**Capabilities:**
- View all subscriptions
- Filter by plan, status, MRR
- Modify subscription (upgrade, downgrade, extend trial)
- Apply credits/discounts
- Handle payment failures
- Generate revenue reports

---

## Feature 15.4: System Health Dashboard

**User Story:** As a platform admin, I want to monitor system health.

**Metrics:**
- Uptime and error rates
- API latency (p50, p95, p99)
- Database performance
- Queue depths
- Active users (real-time)
- Recent errors/exceptions

---

## Feature 15.5: Feature Flags

**User Story:** As a platform admin, I want to control feature rollout.

**Capabilities:**
- List all feature flags with status
- Enable/disable globally
- Enable for specific tenants (beta)
- Percentage rollout
- Plan-based availability
- View flag status per tenant

---

## Feature 15.6: Support Tools

**User Story:** As a platform admin, I want tools to help customers.

**Capabilities:**
- Impersonation (with reason, audit logged)
- Activity log viewer
- Error log viewer
- Configuration viewer
- Quick actions (reset, clear cache, reprocess)

**Audit Requirements:**
- All impersonation logged with reason
- All admin actions logged
- Customer notification of admin access (configurable)

---

# Part 20: Module 16: Metrics & Analytics

## Operating Model Metrics

### Leading Indicators (Weekly)

| Metric | Description | Target |
|--------|-------------|--------|
| Creations started | Volume of creation activity | Increasing |
| Curation queue depth | Items waiting > 48h | < 5 |
| Curation cycle time | Time from submit to decision | < 48h avg |
| Graduate rate | % of submissions graduating | 30-50% |
| Challenge participation | % of org submitting | > 20% |
| Weekly active creators | % of org creating | > 60% |

### Lagging Indicators (Monthly)

| Metric | Description | Target |
|--------|-------------|--------|
| Production incidents | Quality of shipped code | Decreasing |
| Orphaned code % | Assets without owners | 0% |
| Coherence score | Product coherence health | Stable/improving |
| Time to customer value | Idea to production | Decreasing |
| Engagement score | Gamification participation | Increasing |

## Feature 16.1: Executive Dashboard

**User Story:** As a leader, I want a high-level view of how we're doing.

**Acceptance Criteria:**
- Key metrics at a glance
- Trend indicators (up/down/stable)
- Drill-down capability
- Configurable time range
- Export/share functionality

---

## Feature 16.2: Squad-Level Analytics

**User Story:** As a Squad Lead, I want to see my squad's performance.

**Metrics:**
- Squad creation activity
- Curation pipeline (submissions, outcomes)
- Ownership coverage
- Incident rate
- Gamification engagement
- Comparison to org averages

---

## Feature 16.3: Individual Analytics

**User Story:** As a user, I want to see my personal metrics.

**Metrics:**
- My creations and outcomes
- Curation success rate
- Ownership health
- Incident response times
- Points and achievements
- Improvement suggestions

---

## Feature 16.4: Engagement Analytics

**User Story:** As an admin, I want to understand gamification effectiveness.

**Metrics:**
- Participation rates
- Points distribution (Gini coefficient)
- Badge earning patterns
- Challenge effectiveness
- Hackathon attendance
- Correlation with outcomes

---

# Part 21: Integrations

## Integration 1: Source Control (GitHub/GitLab)

**Purpose:** Link creations to code, enable blast radius analysis

**Capabilities:**
- Link creations to repositories/branches/PRs
- Detect code changes for blast radius analysis
- Track which production assets are affected by PRs
- Ownership lookup from code paths
- PR comments with curation status

**Implementation:**
- GitHub/GitLab App installation
- Webhook subscriptions for PR events
- OAuth for user linking

---

## Integration 2: Alerting (PagerDuty/Opsgenie)

**Purpose:** Ingest incidents for attribution

**Capabilities:**
- Receive incident webhooks
- Map services to production assets
- Auto-identify owner
- Bidirectional status sync

**Implementation:**
- Webhook endpoint
- Service mapping configuration
- API integration for status updates

---

## Integration 3: CI/CD Pipeline

**Purpose:** Gate deployments based on curation status

**Capabilities:**
- Check if changes are associated with graduated creation
- Enforce tier-appropriate approval
- Block or warn on unapproved changes
- Report deployment to Curator

**Implementation:**
- CI/CD plugins (GitHub Actions, GitLab CI, Jenkins)
- API for status checks
- Configurable enforcement (block/warn/report)

---

## Integration 4: Slack

**Purpose:** Notifications and quick actions

**Capabilities:**
- Notifications for:
  - Curation submissions and decisions
  - Challenge announcements and deadlines
  - Hackathon updates
  - Ownership alerts
  - Achievement celebrations
- Quick actions (approve, claim, react)
- Slash commands for lookup
- Bot for queries

**Implementation:**
- Slack App with bot
- Interactive messages
- Slash commands
- Home tab dashboard

---

## Integration 5: Observability (Datadog/New Relic)

**Purpose:** Health scoring for production assets

**Capabilities:**
- Ingest health metrics
- Error rate tracking
- Latency monitoring
- Compute health scores
- Display in ownership views

**Implementation:**
- API integration
- Metric mapping configuration
- Health score formula (configurable)

---

## Integration 6: Documentation (Notion/Confluence)

**Purpose:** Link assets to documentation

**Capabilities:**
- Link production assets to docs
- Link patterns to documentation
- Surface relevant docs in context
- Search integration (optional)

**Implementation:**
- URL linking (lightweight)
- Optional embed/preview

---

## Integration 7: Calendar (Google/Outlook)

**Purpose:** Event scheduling for hackathons

**Capabilities:**
- Add hackathon events to calendar
- Add challenge deadlines
- Add judging sessions
- Send calendar invites

---

## Integration 8: Video (Zoom/Meet)

**Purpose:** Mentor sessions during hackathons

**Capabilities:**
- Generate meeting links
- Track session duration
- Record sessions (optional)

---

# Part 22: Technical Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN / Load Balancer                      │
│                      (CloudFlare / AWS ALB)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Web Application                          │
│                      (React + TypeScript)                        │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐ │
│   │   i18next     │ │ Tenant Context│ │  Component Library    │ │
│   └───────────────┘ └───────────────┘ └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           API Gateway                            │
│                    (Authentication, Rate Limiting)               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                               │
│                    (Node.js + GraphQL)                           │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐ │
│   │  Auth/SSO     │ │ Tenant        │ │  Business Logic       │ │
│   │  Middleware   │ │ Resolver      │ │  Services             │ │
│   └───────────────┘ └───────────────┘ └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   Core Database   │ │  Search Index   │ │     Event Bus       │
│   (PostgreSQL)    │ │ (Elasticsearch) │ │      (Kafka)        │
│                   │ │                 │ │                     │
│  Row-level        │ │  Tenant-scoped  │ │  Tenant-partitioned │
│  security (RLS)   │ │  indices        │ │  topics             │
└───────────────────┘ └─────────────────┘ └─────────────────────┘
        │                                           │
        ▼                                           ▼
┌───────────────────┐                 ┌─────────────────────────┐
│   Redis Cache     │                 │   Background Workers    │
│   (Session, Data) │                 │   - Blast radius        │
└───────────────────┘                 │   - Notifications       │
                                      │   - Metrics compute     │
                                      │   - Gamification        │
                                      └─────────────────────────┘
                                                    │
                                                    ▼
                                      ┌─────────────────────────┐
                                      │      Integrations       │
                                      │  GitHub, Slack, PD, etc │
                                      └─────────────────────────┘
```

## Data Residency

```
┌───────────────────────────────────────────────────────────────┐
│                      Data Residency                            │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │   US-EAST   │  │  EU-CENTRAL │  │     AP-SOUTHEAST    │    │
│  │  (Default)  │  │   (GDPR)    │  │       (APAC)        │    │
│  │  Free, all  │  │  Pro, Ent   │  │    Enterprise       │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | PostgreSQL | Relational model, RLS for multi-tenancy |
| Search | Elasticsearch | Semantic search, full-text |
| API | GraphQL | Complex relationships, flexible queries |
| Events | Kafka | Audit trail, async processing |
| Cache | Redis | Session, hot data |
| Frontend | React + TypeScript | Team familiarity, ecosystem |
| i18n | react-i18next | Industry standard, ICU support |
| Payments | Stripe | Best-in-class billing |
| Auth | Auth0 / Custom | SSO support, security |

## Database Schema (Multi-tenant RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE creations ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation ON creations
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Set tenant context per request
SET app.current_tenant_id = 'tenant-uuid';
```

## Scalability Considerations

- **Horizontal scaling:** Stateless API servers behind load balancer
- **Database:** Read replicas for reporting, connection pooling
- **Search:** Elasticsearch cluster with tenant sharding
- **Background jobs:** Distributed workers with Kafka consumers
- **Caching:** Multi-level (Redis, CDN, browser)
- **File storage:** S3 with CloudFront

## Security Architecture

- **Authentication:** JWT tokens, SSO (SAML/OIDC)
- **Authorization:** RBAC with tenant/workspace scoping
- **Encryption:** TLS in transit, AES-256 at rest
- **Secrets:** AWS Secrets Manager / Vault
- **WAF:** CloudFlare / AWS WAF
- **Audit:** Complete action logging

---

# Part 23: API Specification

## Authentication

```
# API Key (Organization-level)
Authorization: Bearer api_key_xxx

# OAuth2 (User-level)
Authorization: Bearer oauth_token_xxx
```

## API Scopes

| Scope | Permissions |
|-------|-------------|
| creations:read | Read creations |
| creations:write | Create/update creations |
| curation:read | Read curation queue and decisions |
| curation:write | Submit for curation, make decisions |
| ownership:read | Read ownership registry |
| ownership:write | Transfer ownership |
| challenges:read | Read challenges |
| challenges:write | Create challenges, submit |
| gamification:read | Read points, badges, leaderboards |
| admin:read | Read org/workspace settings |
| admin:write | Modify settings |

## Key Endpoints (GraphQL)

### Creations

```graphql
type Query {
  creations(filter: CreationFilter, pagination: Pagination): CreationConnection
  creation(id: ID!): Creation
  searchCreations(query: String!): [Creation]
}

type Mutation {
  createCreation(input: CreateCreationInput!): Creation
  updateCreation(id: ID!, input: UpdateCreationInput!): Creation
  deleteCreation(id: ID!): Boolean
}
```

### Curation

```graphql
type Query {
  curationQueue(filter: QueueFilter): [CurationSubmission]
  curationSubmission(id: ID!): CurationSubmission
}

type Mutation {
  submitForCuration(creationId: ID!, input: CurationSubmissionInput!): CurationSubmission
  claimSubmission(submissionId: ID!): CurationSubmission
  decideCuration(submissionId: ID!, input: CurationDecisionInput!): CurationSubmission
}
```

### Ownership

```graphql
type Query {
  productionAssets(filter: AssetFilter): [ProductionAsset]
  productionAsset(id: ID!): ProductionAsset
  myOwnedAssets: [ProductionAsset]
}

type Mutation {
  assignOwner(assetId: ID!, ownerId: ID!): ProductionAsset
  transferOwnership(assetId: ID!, newOwnerId: ID!, reason: String!): OwnershipTransfer
  acceptOwnership(assetId: ID!): ProductionAsset
}
```

### Challenges

```graphql
type Query {
  challenges(filter: ChallengeFilter): [Challenge]
  challenge(id: ID!): Challenge
}

type Mutation {
  createChallenge(input: ChallengeInput!): Challenge
  submitToChallenge(challengeId: ID!, input: ChallengeSubmissionInput!): ChallengeSubmission
  scoreSubmission(submissionId: ID!, input: JudgeScoreInput!): JudgeScore
  announceWinners(challengeId: ID!, winners: [WinnerInput!]!): Challenge
}
```

### Gamification

```graphql
type Query {
  myProfile: GamificationProfile
  leaderboard(type: LeaderboardType!, scope: LeaderboardScope): [LeaderboardEntry]
  badges: [Badge]
  userBadges(userId: ID!): [UserBadge]
}

type Mutation {
  redeemReward(rewardId: ID!): RewardClaim
}
```

## Webhooks

**Available Events:**
- creation.created
- creation.updated
- curation.submitted
- curation.decided
- ownership.transferred
- incident.created
- incident.resolved
- challenge.opened
- challenge.closed
- challenge.winner_announced
- hackathon.started
- hackathon.ended
- badge.earned
- level.up

**Payload Format:**
```json
{
  "event": "curation.decided",
  "timestamp": "2026-02-04T15:30:00Z",
  "tenant_id": "tenant_xxx",
  "data": {
    "submission_id": "sub_123",
    "creation_id": "cre_456",
    "decision": "graduate",
    "decided_by": "user_789"
  }
}
```

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Starter | 120 | 10,000 |
| Professional | 300 | 100,000 |
| Enterprise | Custom | Custom |

---

# Part 24: Security & Compliance

## Security Controls

### Authentication
- Password policy (minimum 12 chars, complexity requirements)
- Multi-factor authentication (TOTP, SMS, hardware keys)
- SSO (SAML 2.0, OIDC)
- Session management (timeout, concurrent session limits)
- Brute force protection

### Authorization
- Role-based access control (RBAC)
- Tenant isolation (row-level security)
- Workspace scoping
- API scopes and permissions

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Tenant-specific encryption keys (Enterprise)
- PII identification and handling
- Data masking in logs

### Audit & Monitoring
- Complete audit logging
- Real-time alerting
- Anomaly detection
- Security incident response

## Compliance

### GDPR
- Data subject access requests (export)
- Right to deletion
- Data processing agreements (DPA)
- Cookie consent
- Privacy policy
- Lawful basis documentation

### SOC 2
- Access controls
- Change management
- Incident response
- Vendor management
- Encryption
- Availability monitoring

### Data Residency
- US (default)
- EU (Professional, Enterprise)
- APAC (Enterprise)
- Data does not leave selected region

## Feature: Data Export

**User Story:** As an Org Admin, I want to export all my data.

**Export Includes:**
- All creations and metadata
- All curation submissions and decisions
- All production assets and ownership history
- All users and roles
- All challenges and submissions
- All gamification data
- All audit logs
- All configuration

**Format:** JSON or CSV
**Delivery:** Secure download link (expires 24h)

## Feature: Data Deletion

**User Story:** As an Org Admin, I want to delete my organization's data.

**Process:**
1. Request deletion in settings
2. Confirm with password/2FA
3. 30-day grace period (can cancel)
4. Permanent deletion after grace period
5. Confirmation email when complete

---

# Part 25: Implementation Roadmap

## Phase 1: Foundation (8 weeks)

**Goal:** Core platform with creation, curation, ownership

**Scope:**
- Multi-tenant infrastructure
- User authentication (email, Google SSO)
- Creation registry (create, browse, search)
- Basic curation workflow (submit, review, decide)
- Ownership registry (assign, view, transfer)
- Basic dashboard and metrics
- Slack notifications

**Team:** 4 engineers, 1 designer, 1 PM

**Milestones:**
- Week 2: Infrastructure, auth, tenant model
- Week 4: Creation and curation workflows
- Week 6: Ownership registry
- Week 8: Internal pilot launch

---

## Phase 2: Intelligence (6 weeks)

**Goal:** Automated analysis and insights

**Scope:**
- Blast radius engine (dependency detection)
- Blast radius visualization
- Change tier recommendations
- Pattern library
- Pattern compliance checking
- GitHub integration

**Milestones:**
- Week 2: Blast radius detection
- Week 4: Pattern library
- Week 6: GitHub integration live

---

## Phase 3: Gamification Core (4 weeks)

**Goal:** Points, badges, leaderboards

**Scope:**
- Points system (earning, tracking)
- Levels and titles
- Badge system (40+ badges)
- Leaderboards
- Profile and stats view
- Achievement notifications

**Milestones:**
- Week 2: Points and levels
- Week 4: Badges and leaderboards

---

## Phase 4: Challenges (4 weeks)

**Goal:** Challenge creation and management

**Scope:**
- Challenge CRUD
- Challenge discovery
- Submission workflow
- Judging workflow
- Winner announcement
- Points integration

**Milestones:**
- Week 2: Challenge creation and discovery
- Week 4: Judging and winners

---

## Phase 5: Hackathons (4 weeks)

**Goal:** Full hackathon support

**Scope:**
- Hackathon creation and management
- Registration and team formation
- Live event dashboard
- Mentor support queue
- Submission and judging
- Results and celebration

**Milestones:**
- Week 2: Registration and teams
- Week 4: Live event features

---

## Phase 6: Competitions & Advanced (3 weeks)

**Goal:** Ongoing competitions, tournaments

**Scope:**
- Sprint competitions
- Seasonal competitions
- Tournament brackets
- Rewards store
- Advanced leaderboards

---

## Phase 7: SaaS & Admin (4 weeks)

**Goal:** External customer readiness

**Scope:**
- Self-service signup
- Onboarding flow
- Billing integration (Stripe)
- Plan enforcement
- Platform admin console
- Support tools

**Milestones:**
- Week 2: Signup and onboarding
- Week 4: Billing and admin console

---

## Phase 8: i18n & Enterprise (4 weeks)

**Goal:** International and enterprise readiness

**Scope:**
- i18n infrastructure
- P1 language translations (6 languages)
- SSO (SAML, OIDC)
- SCIM provisioning
- Data residency (EU)
- Advanced security controls

**Milestones:**
- Week 2: i18n complete
- Week 4: Enterprise features

---

## Phase 9: Integrations (4 weeks)

**Goal:** Full integration ecosystem

**Scope:**
- PagerDuty/Opsgenie
- CI/CD plugins
- Observability (Datadog/New Relic)
- Additional Slack features
- Documentation platforms

---

## Phase 10: Launch & Scale (Ongoing)

**Goal:** GA launch and continuous improvement

**Scope:**
- Public launch
- Additional languages (P2)
- Performance optimization
- Advanced analytics
- AI-assisted curation
- Predictive blast radius
- Mobile app (consideration)

---

## Resource Summary

| Phase | Duration | Engineers | Designer | PM |
|-------|----------|-----------|----------|-----|
| 1. Foundation | 8 weeks | 4 | 1 | 1 |
| 2. Intelligence | 6 weeks | 3 | 0.5 | 0.5 |
| 3. Gamification | 4 weeks | 2 | 1 | 0.5 |
| 4. Challenges | 4 weeks | 2 | 0.5 | 0.5 |
| 5. Hackathons | 4 weeks | 2 | 0.5 | 0.5 |
| 6. Competitions | 3 weeks | 2 | 0.5 | 0.5 |
| 7. SaaS & Admin | 4 weeks | 3 | 0.5 | 0.5 |
| 8. i18n & Enterprise | 4 weeks | 2 | 0 | 0.5 |
| 9. Integrations | 4 weeks | 2 | 0 | 0.5 |

**Total:** ~45 weeks to full feature set

---

# Appendices

## Appendix A: The Five Curation Questions

| # | Question | What We're Really Asking |
|---|----------|-------------------------|
| 1 | **Should this exist?** | Does this solve a real problem worth solving? Is this the right solution? Does the value justify the cost of maintaining it forever? |
| 2 | **What breaks?** | What are the system consequences? Database load? Security surface? Edge cases? Integration impacts? |
| 3 | **Does it fit?** | Is this coherent with our product's mental model? Does it follow existing patterns or create new ones? Will users understand it? |
| 4 | **Who owns it?** | Who is accountable for outcomes? Who gets paged when it breaks? Who decides when to deprecate it? |
| 5 | **What's the burden?** | What's the ongoing maintenance cost? What technical debt are we taking on? What's the documentation requirement? |

## Appendix B: Change Tier Definitions

| Tier | Scope | Process | Examples |
|------|-------|---------|----------|
| 1 | Cosmetic/copy | Owner approves | Typo fix, padding adjustment |
| 2 | Contained feature | Owner + code review | New filter option in existing report |
| 3 | Cross-cutting | Curator review required | Authentication flow change, shared component modification |
| 4 | Architectural | Curator + tech leadership | New data model, new service boundary, new integration pattern |

## Appendix C: Points Reference

| Action | Points |
|--------|--------|
| Create creation | 10 |
| Submit for curation | 15 |
| Creation graduates | 50 |
| Creation killed (learning captured) | 10 |
| Own healthy asset (monthly) | 5 |
| Zero incidents (monthly) | 20 |
| Incident (deduction) | -10 |
| Submit to challenge | 25 |
| Win challenge | 200 |
| Runner-up | 100 |
| Honorable mention | 50 |
| Register for hackathon | 10 |
| Complete hackathon | 75 |
| Win hackathon | 300 |
| Mentor session | 30 |
| Curation decision (curator) | 20 |
| Judge submission | 15 |
| 7-day streak | 25 |
| 30-day streak | 100 |
| First creation bonus | 50 |
| First graduation bonus | 100 |
| Refer colleague | 25 |
| Flag confirmed issue | 10 |

## Appendix D: Badge Categories Summary

- **Creation:** First Steps, Creator, Prolific, Machine, Legend
- **Quality:** Graduated, Consistent, Perfect Record, Quality Master
- **Challenges:** Challenger, Competitor, Victor, Triple Crown, Champion, Undefeated
- **Hackathons:** Hacker, Team Player, Solo Hero, Hackathon Legend
- **Streaks:** Week Warrior, Month Master, Quarter Queen/King, Year Legend
- **Special:** Early Adopter, Mentor, Wise Judge, Bug Hunter, Community Champion, Founder's Circle

## Appendix E: Glossary

| Term | Definition |
|------|------------|
| **Tenant** | An organization using Curator (customer account) |
| **Workspace** | A subdivision within a tenant (e.g., by team or product) |
| **Creation** | Any prototype, experiment, or solution before production |
| **Curation** | The evaluation process for graduating creations |
| **Production Asset** | Code, service, or feature running in production |
| **Accountable Owner** | Person responsible for a production asset |
| **Production Curator** | Person who evaluates creations for production-readiness |
| **Blast Radius** | Scope of potential impact from a change |
| **Coherence** | Consistency of patterns and mental models in the product |
| **The Five Questions** | Framework for curation evaluation |
| **Change Tier** | Classification (1-4) determining approval requirements |
| **Challenge** | Time-boxed problem seeking solutions |
| **Hackathon** | Organized competitive building event |
| **Competition** | Ongoing or periodic contest |
| **Sprint** | Short-duration (weekly) competition |
| **Tournament** | Bracket-style elimination competition |

## Appendix F: Translation Namespaces

| Namespace | Content Examples |
|-----------|------------------|
| common | "Save", "Cancel", "Loading...", "Error" |
| curation | "Submit for Curation", "Graduate", "Iterate", "Kill" |
| ownership | "Transfer Ownership", "Accept", "My Assets" |
| challenges | "Open Challenge", "Submit Solution", "Winner" |
| hackathons | "Register", "Find Team", "Time Remaining" |
| gamification | "Level Up!", "Badge Earned", "Leaderboard" |
| admin | "Organization Settings", "Invite Users" |
| billing | "Current Plan", "Upgrade", "Invoice" |

---

# Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | - | Initial complete PRD |

---

*This document represents the complete product requirements for Curator. It is intended to be a living document that evolves as we learn from implementation and customer feedback.*
