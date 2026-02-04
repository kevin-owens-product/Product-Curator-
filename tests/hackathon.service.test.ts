import { HackathonService } from '../src/services/hackathon.service';
import { HackathonFormat, HackathonStatus } from '../src/models/types';
import { CreateHackathonRequest } from '../src/models/hackathon';

describe('HackathonService', () => {
  let service: HackathonService;

  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const validRequest: CreateHackathonRequest = {
    tenant_id: 'tenant1',
    name: 'Q1 Innovation Hackathon',
    description: 'Build something amazing',
    rules: 'Standard hackathon rules',
    registration_opens_at: futureDate(1),
    registration_closes_at: futureDate(7),
    starts_at: futureDate(10),
    ends_at: futureDate(12),
    judging_ends_at: futureDate(15),
    format: HackathonFormat.Team,
    max_team_size: 5,
    min_team_size: 2,
    organizers: ['admin1'],
    judges: ['judge1', 'judge2'],
  };

  beforeEach(() => {
    service = new HackathonService();
  });

  describe('createHackathon', () => {
    it('should create a hackathon in announced status', () => {
      const hackathon = service.createHackathon(validRequest);

      expect(hackathon.id).toBeDefined();
      expect(hackathon.name).toBe('Q1 Innovation Hackathon');
      expect(hackathon.status).toBe(HackathonStatus.Announced);
    });

    it('should reject invalid date ranges', () => {
      expect(() =>
        service.createHackathon({
          ...validRequest,
          starts_at: futureDate(15),
          ends_at: futureDate(10),
        })
      ).toThrow();
    });
  });

  describe('registration', () => {
    it('should register a user', () => {
      const hackathon = service.createHackathon(validRequest);

      const registration = service.register({
        hackathon_id: hackathon.id,
        user_id: 'user1',
        looking_for_team: true,
        skills: ['typescript', 'react'],
        interests: ['ai', 'ux'],
      });

      expect(registration.user_id).toBe('user1');
      expect(registration.looking_for_team).toBe(true);
    });

    it('should prevent duplicate registration', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({
        hackathon_id: hackathon.id,
        user_id: 'user1',
        looking_for_team: false,
        skills: [],
        interests: [],
      });

      expect(() =>
        service.register({
          hackathon_id: hackathon.id,
          user_id: 'user1',
          looking_for_team: false,
          skills: [],
          interests: [],
        })
      ).toThrow('already registered');
    });
  });

  describe('teams', () => {
    it('should create a team', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({
        hackathon_id: hackathon.id,
        user_id: 'user1',
        looking_for_team: false,
        skills: [],
        interests: [],
      });

      const team = service.createTeam({
        hackathon_id: hackathon.id,
        name: 'The Disruptors',
        captain_id: 'user1',
      });

      expect(team.name).toBe('The Disruptors');
      expect(team.captain_id).toBe('user1');
      expect(team.members).toContain('user1');
    });

    it('should allow joining a team', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({ hackathon_id: hackathon.id, user_id: 'user1', looking_for_team: false, skills: [], interests: [] });
      service.register({ hackathon_id: hackathon.id, user_id: 'user2', looking_for_team: true, skills: [], interests: [] });

      const team = service.createTeam({ hackathon_id: hackathon.id, name: 'Team A', captain_id: 'user1' });

      const updated = service.joinTeam(hackathon.id, team.id, 'user2');
      expect(updated.members).toContain('user2');
      expect(updated.members.length).toBe(2);
    });

    it('should prevent joining a full team', () => {
      const hackathon = service.createHackathon({ ...validRequest, max_team_size: 2 });

      for (const userId of ['user1', 'user2', 'user3']) {
        service.register({ hackathon_id: hackathon.id, user_id: userId, looking_for_team: false, skills: [], interests: [] });
      }

      const team = service.createTeam({ hackathon_id: hackathon.id, name: 'Team A', captain_id: 'user1' });
      service.joinTeam(hackathon.id, team.id, 'user2');

      expect(() => service.joinTeam(hackathon.id, team.id, 'user3')).toThrow('Team is full');
    });
  });

  describe('findTeammates', () => {
    it('should find participants looking for teams', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({ hackathon_id: hackathon.id, user_id: 'user1', looking_for_team: true, skills: ['react'], interests: [] });
      service.register({ hackathon_id: hackathon.id, user_id: 'user2', looking_for_team: false, skills: ['react'], interests: [] });
      service.register({ hackathon_id: hackathon.id, user_id: 'user3', looking_for_team: true, skills: ['python'], interests: [] });

      const teammates = service.findTeammates(hackathon.id);
      expect(teammates.length).toBe(2);
    });

    it('should filter by skills', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({ hackathon_id: hackathon.id, user_id: 'user1', looking_for_team: true, skills: ['react', 'typescript'], interests: [] });
      service.register({ hackathon_id: hackathon.id, user_id: 'user2', looking_for_team: true, skills: ['python', 'ml'], interests: [] });

      const teammates = service.findTeammates(hackathon.id, { skills: ['react'] });
      expect(teammates.length).toBe(1);
      expect(teammates[0].user_id).toBe('user1');
    });
  });

  describe('mentorSupport', () => {
    it('should create mentor help requests during in-progress hackathon', () => {
      const hackathon = service.createHackathon(validRequest);
      service.updateStatus(hackathon.id, HackathonStatus.InProgress);

      const request = service.requestMentorHelp({
        hackathon_id: hackathon.id,
        team_id: 'team1',
        requested_by: 'user1',
        description: 'Need help with API design',
      });

      expect(request.status).toBe('pending');
      expect(request.queue_position).toBe(1);
    });

    it('should manage mentor queue positions', () => {
      const hackathon = service.createHackathon(validRequest);
      service.updateStatus(hackathon.id, HackathonStatus.InProgress);

      service.requestMentorHelp({ hackathon_id: hackathon.id, team_id: 'team1', requested_by: 'user1', description: 'Help 1' });
      const req2 = service.requestMentorHelp({ hackathon_id: hackathon.id, team_id: 'team2', requested_by: 'user2', description: 'Help 2' });

      expect(req2.queue_position).toBe(2);
    });

    it('should claim and complete mentor requests', () => {
      const hackathon = service.createHackathon(validRequest);
      service.updateStatus(hackathon.id, HackathonStatus.InProgress);

      const request = service.requestMentorHelp({
        hackathon_id: hackathon.id,
        team_id: 'team1',
        requested_by: 'user1',
        description: 'Need help',
      });

      const claimed = service.claimMentorRequest(request.id, 'mentor1');
      expect(claimed.status).toBe('claimed');
      expect(claimed.mentor_id).toBe('mentor1');

      const completed = service.completeMentorRequest(request.id, 5);
      expect(completed.status).toBe('completed');
      expect(completed.rating).toBe(5);
    });
  });

  describe('liveStats', () => {
    it('should return live hackathon stats', () => {
      const hackathon = service.createHackathon(validRequest);

      service.register({ hackathon_id: hackathon.id, user_id: 'user1', looking_for_team: false, skills: [], interests: [] });
      service.register({ hackathon_id: hackathon.id, user_id: 'user2', looking_for_team: false, skills: [], interests: [] });

      const stats = service.getLiveStats(hackathon.id);
      expect(stats.total_participants).toBe(2);
      expect(stats.total_teams).toBe(0);
    });
  });
});
