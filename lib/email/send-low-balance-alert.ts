import 'server-only';

import { resend } from '@/lib/email/resend';
import { buildLowBalanceAlertEmail } from '@/lib/email/templates/low-balance-alert';
import { createAdminClient } from '@/lib/supabase/admin';
import { captureServerEvent } from '@/lib/posthog/server';
import generateCalendar from '@/lib/calendar/generate';
import { sendLowBalanceAlertSMS, isTwilioConfigured } from '@/lib/sms';
import { sendLowBalanceAlertPush, isWebPushConfigured } from '@/lib/push';
import type { PushSubscription } from '@/lib/push';

interface SendAlertResult {
  success: boolean;
  error?: string;
  messageId?: string;
  skipped?: boolean;
  reason?: string;
}

interface UserAlertData {
  userId: string;
  email: string;
  userName?: string;
  safetyBuffer: number;
  currency: string;
  timezone: string;
  lastAlertSentAt: string | null;
  alertEnabled: boolean;
}

const ALERT_COOLDOWN_DAYS = 3;
const ALERT_WINDOW_DAYS = 7;

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function formatDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

function isWithinCooldown(lastSentAt: string | null): boolean {
  if (!lastSentAt) return false;
  const lastSent = new Date(lastSentAt);
  const cooldownMs = ALERT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - lastSent.getTime() < cooldownMs;
}

/**
 * Send SMS and Push notifications for low balance alert
 * This is called after the email is sent successfully
 */
async function sendAdditionalAlertChannels(
  userId: string,
  amount: string,
  daysUntil: number,
  currency: string
): Promise<void> {
  const supabase = createAdminClient();

  // Get user's notification settings
  // Note: These columns are added by migration 20260504000003_add_notification_channels.sql
  const { data: rawSettings } = await supabase
    .from('user_settings')
    .select('phone_number, phone_verified, sms_alerts_enabled, push_subscription, push_alerts_enabled')
    .eq('user_id', userId)
    .single();

  const settings = rawSettings as {
    phone_number: string | null;
    phone_verified: boolean;
    sms_alerts_enabled: boolean;
    push_subscription: PushSubscription | null;
    push_alerts_enabled: boolean;
  } | null;

  if (!settings) return;

  // Send SMS if enabled and configured
  if (
    isTwilioConfigured() &&
    settings.sms_alerts_enabled &&
    settings.phone_verified &&
    settings.phone_number
  ) {
    try {
      const result = await sendLowBalanceAlertSMS(
        settings.phone_number,
        amount,
        daysUntil,
        currency
      );
      if (result.success) {
        console.log(`SMS alert sent to user ${userId}`);
      } else {
        console.error(`SMS alert failed for user ${userId}:`, result.error);
      }
    } catch (err) {
      console.error(`SMS alert error for user ${userId}:`, err);
    }
  }

  // Send Push if enabled and configured
  if (
    isWebPushConfigured() &&
    settings.push_alerts_enabled &&
    settings.push_subscription
  ) {
    try {
      const result = await sendLowBalanceAlertPush(
        settings.push_subscription as PushSubscription,
        amount,
        daysUntil,
        currency
      );
      if (result.success) {
        console.log(`Push alert sent to user ${userId}`);
      } else {
        console.error(`Push alert failed for user ${userId}:`, result.error);
      }
    } catch (err) {
      console.error(`Push alert error for user ${userId}:`, err);
    }
  }
}

export async function sendLowBalanceAlert(userData: UserAlertData): Promise<SendAlertResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Missing RESEND_API_KEY' };
    }

    // Check if alerts are enabled
    if (!userData.alertEnabled) {
      return { success: true, skipped: true, reason: 'Alerts disabled' };
    }

    // Check cooldown
    if (isWithinCooldown(userData.lastAlertSentAt)) {
      return { success: true, skipped: true, reason: 'Within cooldown period' };
    }

    const supabase = createAdminClient();

    // Fetch user's accounts, bills, and income
    const [accountsResult, billsResult, incomeResult] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userData.userId),
      supabase.from('bills').select('*').eq('user_id', userData.userId),
      supabase.from('income').select('*').eq('user_id', userData.userId),
    ]);

    const accounts = accountsResult.data || [];
    const bills = billsResult.data || [];
    const income = incomeResult.data || [];

    // Skip if user has no accounts set up
    if (accounts.length === 0) {
      return { success: true, skipped: true, reason: 'No accounts' };
    }

    // Generate forecast (just need first 7 days)
    const calendar = generateCalendar(
      accounts,
      income,
      bills,
      userData.safetyBuffer,
      userData.timezone,
      ALERT_WINDOW_DAYS
    );

    // Find first day below safety buffer within alert window
    const lowBalanceDay = calendar.days.find(
      (day) => day.balance < userData.safetyBuffer
    );

    // No low balance detected
    if (!lowBalanceDay) {
      return { success: true, skipped: true, reason: 'No low balance in window' };
    }

    // Calculate days until low balance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lowDate = new Date(lowBalanceDay.date);
    const daysUntilLow = Math.ceil((lowDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const appUrl = getAppUrl();
    const settingsUrl = `${appUrl}/dashboard/settings?utm_source=low_balance_alert&utm_medium=email`;

    // Build and send email
    const { subject, html } = buildLowBalanceAlertEmail({
      userEmail: userData.email,
      userName: userData.userName,
      projectedLowDate: formatDate(lowDate, userData.timezone),
      projectedLowAmount: lowBalanceDay.balance,
      currentBalance: calendar.startingBalance,
      safetyBuffer: userData.safetyBuffer,
      daysUntilLow,
      currency: userData.currency,
      unsubscribeUrl: settingsUrl,
    });

    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      'Cashcast <notifications@cashcast.money>';

    const res = await resend.emails.send({
      from,
      to: userData.email,
      subject,
      html,
      replyTo: 'info@cashcast.money',
    });

    if (res.error) {
      console.error('Resend low balance alert error:', res.error);
      return { success: false, error: 'Failed to send alert email.' };
    }

    const messageId = (res.data as { id?: string })?.id;

    // Update last alert sent timestamp
    const sentAt = new Date().toISOString();
    const { error: upsertErr } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userData.userId,
          last_low_balance_alert_at: sentAt,
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) {
      console.error('Failed updating last_low_balance_alert_at:', upsertErr);
    }

    // Track event
    await captureServerEvent('low_balance_alert_sent', {
      distinctId: userData.userId,
      properties: {
        user_id: userData.userId,
        projected_low_amount: lowBalanceDay.balance,
        days_until_low: daysUntilLow,
        current_balance: calendar.startingBalance,
        safety_buffer: userData.safetyBuffer,
        is_overdraft: lowBalanceDay.balance < 0,
      },
    });

    // Send SMS and Push notifications if configured
    await sendAdditionalAlertChannels(
      userData.userId,
      Math.abs(lowBalanceDay.balance).toFixed(2),
      daysUntilLow,
      userData.currency
    );

    return { success: true, messageId };
  } catch (e) {
    console.error('sendLowBalanceAlert failed:', e);
    return { success: false, error: 'Failed to send low balance alert.' };
  }
}
