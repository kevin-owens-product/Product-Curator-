/**
 * Default badge definitions for the gamification system.
 * Exported separately for use in seed scripts and tests.
 */

import { BadgeRarity, BadgeCriteriaType } from '../models/types';
import { Badge } from '../models/gamification';

export type BadgeDefinition = Omit<Badge, 'id'>;

export const CREATION_BADGES: BadgeDefinition[] = [
  { tenant_id: null, name: 'First Steps', description: 'Create your first creation', icon: 'footprints', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 1 }, hidden: false },
  { tenant_id: null, name: 'Creator', description: 'Create 10 creations', icon: 'pencil', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 10 }, hidden: false },
  { tenant_id: null, name: 'Prolific', description: 'Create 50 creations', icon: 'pen-fancy', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 50 }, hidden: false },
  { tenant_id: null, name: 'Machine', description: 'Create 100 creations', icon: 'robot', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 100 }, hidden: false },
  { tenant_id: null, name: 'Legend', description: 'Create 500 creations', icon: 'scroll', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_creations', threshold: 500 }, hidden: false },
];

export const QUALITY_BADGES: BadgeDefinition[] = [
  { tenant_id: null, name: 'Graduated', description: 'First creation graduates', icon: 'graduation-cap', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'total_graduations', threshold: 1 }, hidden: false },
  { tenant_id: null, name: 'Consistent', description: '5 consecutive graduations', icon: 'check-double', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'consecutive_graduations', threshold: 5 }, hidden: false },
  { tenant_id: null, name: 'Perfect Record', description: '10 graduations, 0 kills', icon: 'award', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'perfect_record' }, hidden: false },
  { tenant_id: null, name: 'Quality Master', description: '90%+ graduation rate (min 20)', icon: 'shield-check', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'quality_master' }, hidden: false },
];

export const CHALLENGE_BADGES: BadgeDefinition[] = [
  { tenant_id: null, name: 'Challenger', description: 'Submit to first challenge', icon: 'flag', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_submitted', threshold: 1 }, hidden: false },
  { tenant_id: null, name: 'Competitor', description: 'Submit to 5 challenges', icon: 'swords', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_submitted', threshold: 5 }, hidden: false },
  { tenant_id: null, name: 'Victor', description: 'Win first challenge', icon: 'medal', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 1 }, hidden: false },
  { tenant_id: null, name: 'Triple Crown', description: 'Win 3 challenges', icon: 'crown', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 3 }, hidden: false },
  { tenant_id: null, name: 'Champion', description: 'Win 10 challenges', icon: 'trophy', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Count, criteria_config: { field: 'challenges_won', threshold: 10 }, hidden: false },
  { tenant_id: null, name: 'Undefeated', description: 'Win 5 challenges in a row', icon: 'fire', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'consecutive_challenge_wins', threshold: 5 }, hidden: false },
];

export const STREAK_BADGES: BadgeDefinition[] = [
  { tenant_id: null, name: 'Week Warrior', description: '7-day active streak', icon: 'calendar-week', rarity: BadgeRarity.Common, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 7 }, hidden: false },
  { tenant_id: null, name: 'Month Master', description: '30-day active streak', icon: 'calendar', rarity: BadgeRarity.Uncommon, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 30 }, hidden: false },
  { tenant_id: null, name: 'Quarter Queen', description: '90-day active streak', icon: 'calendar-check', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 90 }, hidden: false },
  { tenant_id: null, name: 'Year Legend', description: '365-day active streak', icon: 'calendar-star', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Streak, criteria_config: { field: 'streak_daily', threshold: 365 }, hidden: false },
];

export const SPECIAL_BADGES: BadgeDefinition[] = [
  { tenant_id: null, name: 'Early Adopter', description: 'Join in the first month', icon: 'clock', rarity: BadgeRarity.Rare, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'early_adopter' }, hidden: true },
  { tenant_id: null, name: 'Community Champion', description: 'Top 10 all-time points', icon: 'users', rarity: BadgeRarity.Epic, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'community_champion' }, hidden: false },
  { tenant_id: null, name: "Founder's Circle", description: 'Top 3 all-time points', icon: 'gem', rarity: BadgeRarity.Legendary, criteria_type: BadgeCriteriaType.Special, criteria_config: { rule: 'founders_circle' }, hidden: false },
];

export const ALL_DEFAULT_BADGES: BadgeDefinition[] = [
  ...CREATION_BADGES,
  ...QUALITY_BADGES,
  ...CHALLENGE_BADGES,
  ...STREAK_BADGES,
  ...SPECIAL_BADGES,
];
