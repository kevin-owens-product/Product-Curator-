/**
 * Product Curator - Gamification System
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

// Routes
import { createChallengeRoutes } from './routes/challenges.routes';
import { createHackathonRoutes } from './routes/hackathons.routes';
import { createCompetitionRoutes } from './routes/competitions.routes';
import { createGamificationRoutes } from './routes/gamification.routes';
import { createRewardRoutes } from './routes/rewards.routes';
import { createSettingsRoutes } from './routes/settings.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

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

// ─── Create Express App ──────────────────────────────────────────────────────

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'product-curator-gamification', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

const apiRouter = express.Router();

apiRouter.use('/challenges', createChallengeRoutes(challengeService, pointsService));
apiRouter.use('/hackathons', createHackathonRoutes(hackathonService, pointsService));
apiRouter.use('/competitions', createCompetitionRoutes(competitionService));
apiRouter.use('/gamification', createGamificationRoutes(pointsService, badgeService, streakService, leaderboardService, antiGamingService));
apiRouter.use('/rewards', createRewardRoutes(rewardService));
apiRouter.use('/settings', createSettingsRoutes(settingsService));

app.use('/api/v1', apiRouter);

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Product Curator Gamification System running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  ');
  console.log('  Challenges:');
  console.log('  POST /api/v1/challenges');
  console.log('  GET  /api/v1/challenges');
  console.log('  GET  /api/v1/challenges/:id');
  console.log('  POST /api/v1/challenges/:id/submissions');
  console.log('  POST /api/v1/challenges/:id/judging/start');
  console.log('  POST /api/v1/challenges/:id/winners');
  console.log('  ');
  console.log('  Hackathons:');
  console.log('  POST /api/v1/hackathons');
  console.log('  GET  /api/v1/hackathons/:id');
  console.log('  POST /api/v1/hackathons/:id/register');
  console.log('  POST /api/v1/hackathons/:id/teams');
  console.log('  POST /api/v1/hackathons/:id/mentor-requests');
  console.log('  GET  /api/v1/hackathons/:id/live-stats');
  console.log('  ');
  console.log('  Competitions:');
  console.log('  POST /api/v1/competitions');
  console.log('  POST /api/v1/competitions/sprints');
  console.log('  GET  /api/v1/competitions/:id/leaderboard');
  console.log('  POST /api/v1/competitions/:id/tournament');
  console.log('  ');
  console.log('  Gamification:');
  console.log('  POST /api/v1/gamification/points/award');
  console.log('  GET  /api/v1/gamification/points/:userId');
  console.log('  GET  /api/v1/gamification/badges');
  console.log('  GET  /api/v1/gamification/streaks/:userId');
  console.log('  GET  /api/v1/gamification/leaderboards');
  console.log('  GET  /api/v1/gamification/profile/:userId');
  console.log('  GET  /api/v1/gamification/analytics/engagement/:tenantId');
  console.log('  ');
  console.log('  Rewards:');
  console.log('  POST /api/v1/rewards');
  console.log('  GET  /api/v1/rewards');
  console.log('  POST /api/v1/rewards/claim');
  console.log('  ');
  console.log('  Settings:');
  console.log('  GET  /api/v1/settings/tenant/:tenantId');
  console.log('  PATCH /api/v1/settings/tenant/:tenantId');
  console.log('  GET  /api/v1/settings/user/:userId');
  console.log('  PATCH /api/v1/settings/user/:userId');
});

export default app;
