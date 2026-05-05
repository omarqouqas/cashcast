/**
 * Send Web Push notifications
 */

import { webpush, isWebPushConfigured } from './vapid';
import type { PushSubscription, PushPayload, PushResult } from './types';

/**
 * Send a push notification to a subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<PushResult> {
  if (!isWebPushConfigured()) {
    return {
      success: false,
      error: 'Web Push is not configured',
    };
  }

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/icon-192.png',
    badge: payload.badge || '/badge-72.png',
    actionUrl: payload.actionUrl || '/dashboard',
    tag: payload.tag,
  });

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      pushPayload
    );

    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to send push notification:', error);

    // Check if subscription is expired/invalid
    const statusCode = (error as { statusCode?: number })?.statusCode;
    if (statusCode === 410 || statusCode === 404) {
      return {
        success: false,
        error: 'Subscription expired or invalid',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send push notification',
    };
  }
}

/**
 * Send a low balance alert push notification
 */
export async function sendLowBalanceAlertPush(
  subscription: PushSubscription,
  amount: string,
  daysUntil: number,
  currency: string
): Promise<PushResult> {
  return sendPushNotification(subscription, {
    title: 'Low Balance Alert',
    body: `Your balance will drop to ${currency}${amount} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
    actionUrl: '/dashboard',
    tag: 'low-balance-alert',
  });
}
