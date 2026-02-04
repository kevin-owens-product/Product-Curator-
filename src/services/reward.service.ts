/**
 * Reward & Recognition Service
 *
 * Manages the rewards store, reward claims, fulfillment tracking,
 * and point redemption for tangible rewards.
 */

import { v4 as uuid } from 'uuid';
import {
  Reward,
  RewardClaim,
  CreateRewardRequest,
  ClaimRewardRequest,
  RewardStoreQuery,
} from '../models/reward';
import { RewardClaimStatus, RewardEarnedVia } from '../models/types';
import { InMemoryStore } from '../utils/store';
import { NotFoundError, ValidationError } from '../utils/errors';
import { requireFields } from '../utils/validation';

export class RewardService {
  private rewards = new InMemoryStore<Reward>();
  private claims = new InMemoryStore<RewardClaim>();

  // Points balance lookup - in production, would query PointsService
  private getUserPointsBalance: (userId: string) => number = () => 0;
  private deductUserPoints: (userId: string, points: number) => void = () => {};

  /**
   * Set external point balance functions (dependency injection).
   */
  setPointsFunctions(
    getBalance: (userId: string) => number,
    deduct: (userId: string, points: number) => void
  ): void {
    this.getUserPointsBalance = getBalance;
    this.deductUserPoints = deduct;
  }

  /**
   * Create a new reward in the store.
   */
  createReward(request: CreateRewardRequest): Reward {
    requireFields({ name: request.name, description: request.description });

    const reward: Reward = {
      id: uuid(),
      tenant_id: request.tenant_id,
      name: request.name,
      description: request.description,
      type: request.type,
      fulfillment_type: request.fulfillment_type,
      fulfillment_instructions: request.fulfillment_instructions || null,
      quantity_available: request.quantity_available ?? null,
      quantity_claimed: 0,
      points_cost: request.points_cost ?? null,
      image_url: request.image_url || null,
      featured: request.featured || false,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.rewards.create(reward);
  }

  /**
   * Get a reward by ID.
   */
  getReward(rewardId: string): Reward {
    const reward = this.rewards.getById(rewardId);
    if (!reward) throw new NotFoundError('Reward', rewardId);
    return reward;
  }

  /**
   * Browse the rewards store.
   */
  browseRewards(query: RewardStoreQuery): { rewards: Reward[]; total: number } {
    let results = this.rewards.find(r => r.tenant_id === query.tenant_id && r.active);

    if (query.type) {
      results = results.filter(r => r.type === query.type);
    }
    if (query.max_cost !== undefined) {
      results = results.filter(r => r.points_cost !== null && r.points_cost <= query.max_cost!);
    }
    if (query.featured_only) {
      results = results.filter(r => r.featured);
    }
    if (query.available_only) {
      results = results.filter(r =>
        r.quantity_available === null || r.quantity_claimed < r.quantity_available
      );
    }

    const total = results.length;
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    results = results.slice(offset, offset + limit);

    return { rewards: results, total };
  }

  /**
   * Claim/redeem a reward.
   */
  claimReward(request: ClaimRewardRequest): RewardClaim {
    const reward = this.getReward(request.reward_id);

    if (!reward.active) {
      throw new ValidationError('This reward is no longer available');
    }

    // Check inventory
    if (reward.quantity_available !== null && reward.quantity_claimed >= reward.quantity_available) {
      throw new ValidationError('This reward is out of stock');
    }

    // Check points balance for redemption
    if (request.earned_via === RewardEarnedVia.Redemption && reward.points_cost) {
      const balance = this.getUserPointsBalance(request.user_id);
      if (balance < reward.points_cost) {
        throw new ValidationError(
          `Insufficient points. Need ${reward.points_cost}, have ${balance}`
        );
      }
      this.deductUserPoints(request.user_id, reward.points_cost);
    }

    const claim: RewardClaim = {
      id: uuid(),
      user_id: request.user_id,
      reward_id: request.reward_id,
      earned_via: request.earned_via,
      source_id: request.source_id || null,
      status: reward.fulfillment_type === 'automatic'
        ? RewardClaimStatus.Fulfilled
        : RewardClaimStatus.Pending,
      fulfilled_at: reward.fulfillment_type === 'automatic'
        ? new Date().toISOString()
        : null,
      fulfillment_notes: null,
      claimed_at: new Date().toISOString(),
    };

    this.claims.create(claim);

    // Update inventory
    this.rewards.update(request.reward_id, {
      quantity_claimed: reward.quantity_claimed + 1,
      updated_at: new Date().toISOString(),
    });

    return claim;
  }

  /**
   * Fulfill a pending reward claim (admin action).
   */
  fulfillClaim(claimId: string, notes?: string): RewardClaim {
    const claim = this.claims.getById(claimId);
    if (!claim) throw new NotFoundError('RewardClaim', claimId);

    if (claim.status === RewardClaimStatus.Fulfilled) {
      throw new ValidationError('Claim has already been fulfilled');
    }

    const updated = this.claims.update(claimId, {
      status: RewardClaimStatus.Fulfilled,
      fulfilled_at: new Date().toISOString(),
      fulfillment_notes: notes || null,
    });

    return updated!;
  }

  /**
   * Get claim history for a user.
   */
  getUserClaims(userId: string): RewardClaim[] {
    return this.claims
      .find(c => c.user_id === userId)
      .sort((a, b) => new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime());
  }

  /**
   * Get pending claims for admin fulfillment.
   */
  getPendingClaims(tenantId: string): (RewardClaim & { reward: Reward })[] {
    const pendingClaims = this.claims.find(c => c.status === RewardClaimStatus.Pending);
    return pendingClaims.map(claim => {
      const reward = this.rewards.getById(claim.reward_id)!;
      return { ...claim, reward };
    }).filter(c => c.reward && c.reward.tenant_id === tenantId);
  }

  /**
   * Deactivate a reward (remove from store).
   */
  deactivateReward(rewardId: string): Reward {
    const updated = this.rewards.update(rewardId, {
      active: false,
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError('Reward', rewardId);
    return updated;
  }
}
