/**
 * Push subscription management
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { PushSubscription } from './types';

/**
 * Save a push subscription for a user
 */
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  // Note: These columns are added by migration 20260504000003_add_notification_channels.sql
  const { error } = await supabase
    .from('user_settings')
    .update({
      push_subscription: subscription,
      push_alerts_enabled: true,
    } as any)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to save push subscription:', error);
    return {
      success: false,
      error: 'Failed to save push subscription',
    };
  }

  return { success: true };
}

/**
 * Remove push subscription for a user
 */
export async function removePushSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('user_settings')
    .update({
      push_subscription: null,
      push_alerts_enabled: false,
    } as any)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to remove push subscription:', error);
    return {
      success: false,
      error: 'Failed to remove push subscription',
    };
  }

  return { success: true };
}

/**
 * Get push subscription for a user
 */
export async function getPushSubscription(
  userId: string
): Promise<PushSubscription | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('user_settings')
    .select('push_subscription')
    .eq('user_id', userId)
    .single();

  const typedData = data as { push_subscription: PushSubscription | null } | null;

  if (error || !typedData?.push_subscription) {
    return null;
  }

  return typedData.push_subscription;
}
