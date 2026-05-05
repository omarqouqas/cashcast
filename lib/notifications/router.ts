/**
 * Unified Notification Router
 *
 * Routes notifications to appropriate channels (email, SMS, push)
 * based on user preferences and alert type.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendLowBalanceAlertSMS, isTwilioConfigured } from '@/lib/sms';
import { sendPushNotification, isWebPushConfigured } from '@/lib/push';
import type { PushSubscription } from '@/lib/push';
import {
  type NotificationPayload,
  type NotificationResult,
  type SendNotificationResult,
  type ChannelPreferences,
  type NotificationChannel,
  DEFAULT_CHANNEL_PREFERENCES,
  SMS_ALLOWED_ALERT_TYPES,
} from './types';

type UserNotificationSettings = {
  phone_number: string | null;
  phone_verified: boolean;
  sms_alerts_enabled: boolean;
  push_subscription: PushSubscription | null;
  push_alerts_enabled: boolean;
  notification_preferences: ChannelPreferences | null;
  currency: string;
};

/**
 * Get user notification settings from database
 */
async function getUserNotificationSettings(
  userId: string
): Promise<UserNotificationSettings | null> {
  const supabase = createAdminClient();

  // Note: phone_number, phone_verified, sms_alerts_enabled, push_subscription, push_alerts_enabled
  // are added by migration 20260504000003_add_notification_channels.sql
  const { data, error } = await supabase
    .from('user_settings')
    .select(`
      phone_number,
      phone_verified,
      sms_alerts_enabled,
      push_subscription,
      push_alerts_enabled,
      notification_preferences,
      currency
    `)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Failed to get user notification settings:', error);
    return null;
  }

  // Type assertion needed until migration is applied and types regenerated
  return data as unknown as UserNotificationSettings;
}

/**
 * Get channels to use for a specific alert type
 */
function getChannelsForAlert(
  alertType: NotificationPayload['type'],
  preferences: ChannelPreferences | null
): NotificationChannel[] {
  const prefs = preferences || DEFAULT_CHANNEL_PREFERENCES;
  return prefs.channels[alertType] || ['email'];
}

/**
 * Send notification through all appropriate channels
 */
export async function sendNotification(
  userId: string,
  payload: NotificationPayload,
  options?: {
    // Callback for sending email (passed in to avoid circular deps)
    sendEmail?: (userId: string, payload: NotificationPayload) => Promise<boolean>;
    // Additional user data if already fetched
    userEmail?: string;
    userName?: string;
  }
): Promise<SendNotificationResult> {
  const results: NotificationResult[] = [];
  const skipped: NotificationChannel[] = [];

  // Get user settings
  const settings = await getUserNotificationSettings(userId);
  if (!settings) {
    return { sent: [], skipped: ['email', 'sms', 'push'] };
  }

  // Determine which channels to use
  const channels = getChannelsForAlert(payload.type, settings.notification_preferences);

  // Process each channel
  for (const channel of channels) {
    switch (channel) {
      case 'email':
        if (options?.sendEmail) {
          try {
            const success = await options.sendEmail(userId, payload);
            results.push({ channel: 'email', success });
          } catch (error) {
            results.push({
              channel: 'email',
              success: false,
              error: error instanceof Error ? error.message : 'Email send failed',
            });
          }
        } else {
          skipped.push('email');
        }
        break;

      case 'sms':
        // Check if SMS is allowed for this alert type
        if (!SMS_ALLOWED_ALERT_TYPES.includes(payload.type)) {
          skipped.push('sms');
          break;
        }

        // Check if Twilio is configured
        if (!isTwilioConfigured()) {
          skipped.push('sms');
          break;
        }

        // Check if user has SMS enabled and verified
        if (
          !settings.sms_alerts_enabled ||
          !settings.phone_verified ||
          !settings.phone_number
        ) {
          skipped.push('sms');
          break;
        }

        // Send SMS
        try {
          // Extract amount and days from metadata if available
          const amount = payload.metadata?.amount as string || '0';
          const daysUntil = payload.metadata?.daysUntil as number || 0;

          const smsResult = await sendLowBalanceAlertSMS(
            settings.phone_number,
            amount,
            daysUntil,
            settings.currency || 'USD'
          );
          results.push({
            channel: 'sms',
            success: smsResult.success,
            error: smsResult.error,
          });
        } catch (error) {
          results.push({
            channel: 'sms',
            success: false,
            error: error instanceof Error ? error.message : 'SMS send failed',
          });
        }
        break;

      case 'push':
        // Check if Web Push is configured
        if (!isWebPushConfigured()) {
          skipped.push('push');
          break;
        }

        // Check if user has push enabled and has a subscription
        if (!settings.push_alerts_enabled || !settings.push_subscription) {
          skipped.push('push');
          break;
        }

        // Send push notification
        try {
          const pushResult = await sendPushNotification(settings.push_subscription, {
            title: payload.title,
            body: payload.body,
            actionUrl: payload.actionUrl,
            tag: `cashcast-${payload.type}`,
          });
          results.push({
            channel: 'push',
            success: pushResult.success,
            error: pushResult.error,
          });
        } catch (error) {
          results.push({
            channel: 'push',
            success: false,
            error: error instanceof Error ? error.message : 'Push send failed',
          });
        }
        break;
    }
  }

  return { sent: results, skipped };
}

/**
 * Send a cash crunch notification
 */
export async function sendCashCrunchNotification(
  userId: string,
  amount: string,
  daysUntil: number,
  options?: {
    sendEmail?: (userId: string, payload: NotificationPayload) => Promise<boolean>;
    userEmail?: string;
    userName?: string;
  }
): Promise<SendNotificationResult> {
  return sendNotification(
    userId,
    {
      type: 'cash_crunch',
      title: 'Low Balance Alert',
      body: `Your balance will drop to $${amount} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
      actionUrl: '/dashboard',
      priority: 'critical',
      metadata: {
        amount,
        daysUntil,
      },
    },
    options
  );
}

/**
 * Send an invoice overdue notification
 */
export async function sendInvoiceOverdueNotification(
  userId: string,
  invoiceNumber: string,
  clientName: string,
  amount: string,
  daysOverdue: number,
  options?: {
    sendEmail?: (userId: string, payload: NotificationPayload) => Promise<boolean>;
  }
): Promise<SendNotificationResult> {
  return sendNotification(
    userId,
    {
      type: 'invoice_overdue',
      title: 'Invoice Overdue',
      body: `Invoice ${invoiceNumber} for ${clientName} ($${amount}) is ${daysOverdue} days overdue`,
      actionUrl: '/dashboard/invoices',
      priority: daysOverdue > 14 ? 'critical' : 'warning',
      metadata: {
        invoiceNumber,
        clientName,
        amount,
        daysOverdue,
      },
    },
    options
  );
}
