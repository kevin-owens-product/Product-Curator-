/**
 * Product Curator - Complete Platform
 *
 * Main application entry point. Initializes all services, registers
 * API routes, and starts the Express server.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Services
import { PointsService } from './services/points.service';
import { BadgeService } from './services/badge.service';
import { StreakService } from './services/streak.service';
import { ChallengeService } from './services/challenge.service';
import { HackathonService } from './services/hackathon.service';
import { CompetitionService } from './services/competition.service';
import { RewardService } from './services/reward.service';
import { LeaderboardService } from './services/leaderboard.service';
import { AntiGamingService } from './services/antigaming.service';
import { SettingsService } from './services/settings.service';
import { CreationService } from './services/creation.service';
import { CurationService } from './services/curation.service';
import { OwnershipService } from './services/ownership.service';
import { BlastRadiusService } from './services/blastradius.service';
import { CoherenceService } from './services/coherence.service';
import { IncidentService } from './services/incident.service';
import { TenantService } from './services/tenant.service';
import { UserService } from './services/user.service';
import { BillingService } from './services/billing.service';
import { AdminService } from './services/admin.service';
import { AnalyticsService } from './services/analytics.service';
import { AuditService } from './services/audit.service';

// Routes
import { createChallengeRoutes } from './routes/challenges.routes';
import { createHackathonRoutes } from './routes/hackathons.routes';
import { createCompetitionRoutes } from './routes/competitions.routes';
import { createGamificationRoutes } from './routes/gamification.routes';
import { createRewardRoutes } from './routes/rewards.routes';
import { createSettingsRoutes } from './routes/settings.routes';
import { createCreationRoutes } from './routes/creations.routes';
import { createCurationRoutes } from './routes/curation.routes';
import { createOwnershipRoutes } from './routes/ownership.routes';
import { createBlastRadiusRoutes } from './routes/blastradius.routes';
import { createCoherenceRoutes } from './routes/coherence.routes';
import { createIncidentRoutes } from './routes/incidents.routes';
import { createTenantRoutes } from './routes/tenants.routes';
import { createUserRoutes } from './routes/users.routes';
import { createBillingRoutes } from './routes/billing.routes';
import { createAdminRoutes } from './routes/admin.routes';
import { createAnalyticsRoutes } from './routes/analytics.routes';
import { createAuditRoutes } from './routes/audit.routes';
import { createAuthRoutes } from './routes/auth.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { tenantContextMiddleware } from './middleware/tenantContext';
import { authMiddleware } from './middleware/auth';

// ─── Initialize Services ─────────────────────────────────────────────────────

const pointsService = new PointsService();
const badgeService = new BadgeService();
const streakService = new StreakService();
const challengeService = new ChallengeService();
const hackathonService = new HackathonService();
const competitionService = new CompetitionService();
const rewardService = new RewardService();
const antiGamingService = new AntiGamingService();
const settingsService = new SettingsService();
const creationService = new CreationService();
const curationService = new CurationService();
const ownershipService = new OwnershipService();
const blastRadiusService = new BlastRadiusService();
const coherenceService = new CoherenceService();
const incidentService = new IncidentService();
const tenantService = new TenantService();
const userService = new UserService();
const billingService = new BillingService();
const adminService = new AdminService();
const analyticsService = new AnalyticsService();
const auditService = new AuditService();

// LeaderboardService depends on other services
const leaderboardService = new LeaderboardService(pointsService, badgeService, streakService);

// Wire up reward service with points functions
rewardService.setPointsFunctions(
  (userId: string) => pointsService.getUserPoints(userId).total_points,
  (_userId: string, _points: number) => {
    // In production, this would deduct points via a transaction
    // For now, point deduction is tracked via the reward claim
  }
);

// Wire up analytics service
analyticsService.configure({
  getCreationService: () => creationService,
  getIncidentService: () => incidentService,
});

// ─── Create Express App ──────────────────────────────────────────────────────

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(tenantContextMiddleware);
app.use(authMiddleware);

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'product-curator', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

const apiRouter = express.Router();

// Core Domain
apiRouter.use('/creations', createCreationRoutes(creationService, pointsService));
apiRouter.use('/curation', createCurationRoutes(curationService, pointsService));
apiRouter.use('/ownership', createOwnershipRoutes(ownershipService));
apiRouter.use('/blast-radius', createBlastRadiusRoutes(blastRadiusService));
apiRouter.use('/coherence', createCoherenceRoutes(coherenceService, pointsService));
apiRouter.use('/incidents', createIncidentRoutes(incidentService, pointsService));

// Gamification & Competitions
apiRouter.use('/challenges', createChallengeRoutes(challengeService, pointsService));
apiRouter.use('/hackathons', createHackathonRoutes(hackathonService, pointsService));
apiRouter.use('/competitions', createCompetitionRoutes(competitionService));
apiRouter.use('/gamification', createGamificationRoutes(pointsService, badgeService, streakService, leaderboardService, antiGamingService));
apiRouter.use('/rewards', createRewardRoutes(rewardService));

// Platform
apiRouter.use('/tenants', createTenantRoutes(tenantService));
apiRouter.use('/users', createUserRoutes(userService));
apiRouter.use('/auth', createAuthRoutes());
apiRouter.use('/billing', createBillingRoutes(billingService));
apiRouter.use('/admin', createAdminRoutes(adminService));
apiRouter.use('/analytics', createAnalyticsRoutes(analyticsService));
apiRouter.use('/audit', createAuditRoutes(auditService));
apiRouter.use('/settings', createSettingsRoutes(settingsService));

app.use('/api/v1', apiRouter);

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Product Curator running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  ');
  console.log('  Core Domain:');
  console.log('  POST /api/v1/creations');
  console.log('  GET  /api/v1/creations');
  console.log('  GET  /api/v1/creations/:id');
  console.log('  POST /api/v1/curation/submissions');
  console.log('  GET  /api/v1/curation/queue');
  console.log('  POST /api/v1/curation/submissions/:id/decide');
  console.log('  POST /api/v1/ownership/assets');
  console.log('  GET  /api/v1/ownership/my-assets/:ownerId');
  console.log('  POST /api/v1/blast-radius/analyze');
  console.log('  GET  /api/v1/coherence/score/:tenantId');
  console.log('  POST /api/v1/incidents');
  console.log('  ');
  console.log('  Challenges:');
  console.log('  POST /api/v1/challenges');
  console.log('  GET  /api/v1/challenges');
  console.log('  POST /api/v1/challenges/:id/submissions');
  console.log('  POST /api/v1/challenges/:id/winners');
  console.log('  ');
  console.log('  Hackathons:');
  console.log('  POST /api/v1/hackathons');
  console.log('  POST /api/v1/hackathons/:id/register');
  console.log('  POST /api/v1/hackathons/:id/teams');
  console.log('  GET  /api/v1/hackathons/:id/live-stats');
  console.log('  ');
  console.log('  Competitions:');
  console.log('  POST /api/v1/competitions');
  console.log('  POST /api/v1/competitions/sprints');
  console.log('  ');
  console.log('  Gamification:');
  console.log('  POST /api/v1/gamification/points/award');
  console.log('  GET  /api/v1/gamification/points/:userId');
  console.log('  GET  /api/v1/gamification/badges');
  console.log('  GET  /api/v1/gamification/streaks/:userId');
  console.log('  GET  /api/v1/gamification/leaderboards');
  console.log('  GET  /api/v1/gamification/profile/:userId');
  console.log('  ');
  console.log('  Platform:');
  console.log('  POST /api/v1/tenants');
  console.log('  POST /api/v1/users');
  console.log('  POST /api/v1/auth/login');
  console.log('  GET  /api/v1/billing/usage/:tenantId');
  console.log('  GET  /api/v1/admin/feature-flags');
  console.log('  GET  /api/v1/admin/system-health');
  console.log('  GET  /api/v1/analytics/executive/:tenantId');
  console.log('  GET  /api/v1/audit/:tenantId');
  console.log('  GET  /api/v1/settings/tenant/:tenantId');
  console.log('  ');
  console.log('  Rewards:');
  console.log('  POST /api/v1/rewards');
  console.log('  POST /api/v1/rewards/claim');
});

export default app;
