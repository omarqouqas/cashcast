/**
 * AI Query usage tracking for rate limiting.
 * Free tier: 5 queries per day
 * Pro tier: Unlimited
 *
 * Note: The ai_query_usage table is created via migration.
 * Until supabase gen types is run, we use type assertions.
 */

import { createClient } from '@/lib/supabase/server';
import type { QueryUsageResult, AIQueryUsageRow } from './types';

const FREE_DAILY_LIMIT = 5;

type SubscriptionTier = 'free' | 'pro' | 'premium' | 'lifetime';

/**
 * Check if a user can make an AI query based on their subscription tier and daily usage.
 */
export async function checkQueryUsage(
  userId: string,
  tier: SubscriptionTier
): Promise<QueryUsageResult> {
  // Pro, Premium, and Lifetime get unlimited queries
  if (tier !== 'free') {
    return { allowed: true, remaining: Infinity, limit: null };
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0] ?? '';

  // Use type assertion since ai_query_usage table may not be in generated types yet
  const { data: usage } = await (supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (col: string, val: string) => {
          eq: (col: string, val: string) => {
            single: () => Promise<{ data: AIQueryUsageRow | null }>;
          };
        };
      };
    };
  })
    .from('ai_query_usage')
    .select('query_count')
    .eq('user_id', userId)
    .eq('query_date', today)
    .single();

  const currentCount = usage?.query_count ?? 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - currentCount);

  if (currentCount >= FREE_DAILY_LIMIT) {
    // Calculate reset time (midnight UTC of next day)
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    return {
      allowed: false,
      remaining: 0,
      limit: FREE_DAILY_LIMIT,
      resetAt: tomorrow,
      reason: 'limit_reached',
    };
  }

  return { allowed: true, remaining, limit: FREE_DAILY_LIMIT };
}

/**
 * Increment the daily query count for a user.
 * Uses a database function for atomic upsert.
 */
export async function incrementQueryUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0] ?? '';

  // Use type assertion since the RPC function may not be in generated types yet
  const { error } = await (supabase as unknown as {
    rpc: (fn: string, params: Record<string, unknown>) => Promise<{ error: Error | null }>;
  }).rpc('increment_ai_query_usage', {
    p_user_id: userId,
    p_query_date: today,
  });

  if (error) {
    // Log but don't throw - we don't want to fail the request if usage tracking fails
    console.error('Failed to increment AI query usage:', error);
  }
}

/**
 * Get the current daily usage for a user.
 */
export async function getQueryUsage(
  userId: string
): Promise<{ count: number; limit: number | null; remaining: number }> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0] ?? '';

  // Use type assertion since ai_query_usage table may not be in generated types yet
  const { data: usage } = await (supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (col: string, val: string) => {
          eq: (col: string, val: string) => {
            single: () => Promise<{ data: AIQueryUsageRow | null }>;
          };
        };
      };
    };
  })
    .from('ai_query_usage')
    .select('query_count')
    .eq('user_id', userId)
    .eq('query_date', today)
    .single();

  const count = usage?.query_count ?? 0;

  return {
    count,
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - count),
  };
}
