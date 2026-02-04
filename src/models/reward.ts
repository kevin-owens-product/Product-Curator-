/**
 * Reward & Recognition data models.
 *
 * Rewards can be points, badges, physical items, experiential,
 * career-related, or custom. Supports a rewards store where
 * users can redeem points for tangible rewards.
 */

import {
  RewardFulfillmentType,
  RewardClaimStatus,
  RewardEarnedVia,
} from './types';

export interface Reward {
  id: string;
  tenant_id: string;

  name: string;
  description: string;
  type: 'points' | 'badge' | 'physical' | 'experiential' | 'career' | 'custom';

  // For physical/experiential
  fulfillment_type: RewardFulfillmentType;
  fulfillment_instructions: string | null;

  // Inventory
  quantity_available: number | null; // null for unlimited
  quantity_claimed: number;

  // Cost
  points_cost: number | null; // for store redemption

  // Display
  image_url: string | null;
  featured: boolean;

  // Metadata
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardClaim {
  id: string;
  user_id: string;
  reward_id: string;

  // Context
  earned_via: RewardEarnedVia;
  source_id: string | null;

  // Fulfillment
  status: RewardClaimStatus;
  fulfilled_at: string | null;
  fulfillment_notes: string | null;

  // Metadata
  claimed_at: string;
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export interface CreateRewardRequest {
  tenant_id: string;
  name: string;
  description: string;
  type: Reward['type'];
  fulfillment_type: RewardFulfillmentType;
  fulfillment_instructions?: string;
  quantity_available?: number;
  points_cost?: number;
  image_url?: string;
  featured?: boolean;
}

export interface ClaimRewardRequest {
  user_id: string;
  reward_id: string;
  earned_via: RewardEarnedVia;
  source_id?: string;
}

export interface RewardStoreQuery {
  tenant_id: string;
  type?: Reward['type'];
  max_cost?: number;
  featured_only?: boolean;
  available_only?: boolean;
  limit?: number;
  offset?: number;
}
