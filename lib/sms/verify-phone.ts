/**
 * Phone number verification via SMS
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendSMS, formatToE164, isValidPhoneNumber } from './send-sms';
import type { PhoneVerificationResult, VerifyCodeResult } from './types';

const CODE_EXPIRY_MINUTES = 10;

/**
 * Generate a 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send a verification code to the user's phone
 */
export async function sendVerificationCode(
  userId: string,
  phoneNumber: string
): Promise<PhoneVerificationResult> {
  // Format and validate phone number
  const formattedPhone = formatToE164(phoneNumber);
  if (!isValidPhoneNumber(formattedPhone)) {
    return {
      success: false,
      error: 'Invalid phone number format. Please use format: +1234567890',
    };
  }

  // Generate code and expiry
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  // Save to database
  // Note: These columns are added by migration 20260504000003_add_notification_channels.sql
  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from('user_settings')
    .update({
      phone_number: formattedPhone,
      phone_verified: false,
      phone_verification_code: code,
      phone_verification_expires_at: expiresAt.toISOString(),
    } as any)
    .eq('user_id', userId);

  if (updateError) {
    console.error('Failed to save verification code:', updateError);
    return {
      success: false,
      error: 'Failed to initiate verification',
    };
  }

  // Send SMS with code
  const smsResult = await sendSMS(
    formattedPhone,
    `Your CashCast verification code is: ${code}. This code expires in ${CODE_EXPIRY_MINUTES} minutes.`
  );

  if (!smsResult.success) {
    return {
      success: false,
      error: smsResult.error || 'Failed to send verification SMS',
    };
  }

  return {
    success: true,
    expiresAt,
  };
}

/**
 * Verify the code entered by the user
 */
export async function verifyCode(
  userId: string,
  code: string
): Promise<VerifyCodeResult> {
  const supabase = createAdminClient();

  // Get the stored code and expiry
  // Note: These columns are added by migration 20260504000003_add_notification_channels.sql
  const { data: rawSettings, error: fetchError } = await supabase
    .from('user_settings')
    .select('phone_number, phone_verification_code, phone_verification_expires_at')
    .eq('user_id', userId)
    .single();

  const settings = rawSettings as {
    phone_number: string | null;
    phone_verification_code: string | null;
    phone_verification_expires_at: string | null;
  } | null;

  if (fetchError || !settings) {
    return {
      success: false,
      error: 'Verification not found. Please request a new code.',
    };
  }

  // Check if code exists
  if (!settings.phone_verification_code) {
    return {
      success: false,
      error: 'No verification pending. Please request a new code.',
    };
  }

  // Check if code has expired
  const expiresAt = new Date(settings.phone_verification_expires_at!);
  if (expiresAt < new Date()) {
    // Clear expired code
    await supabase
      .from('user_settings')
      .update({
        phone_verification_code: null,
        phone_verification_expires_at: null,
      } as any)
      .eq('user_id', userId);

    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  // Compare codes (constant-time comparison would be better for production)
  if (code !== settings.phone_verification_code) {
    return {
      success: false,
      error: 'Invalid verification code',
    };
  }

  // Mark phone as verified and clear code
  const { error: updateError } = await supabase
    .from('user_settings')
    .update({
      phone_verified: true,
      sms_alerts_enabled: true,
      phone_verification_code: null,
      phone_verification_expires_at: null,
    } as any)
    .eq('user_id', userId);

  if (updateError) {
    return {
      success: false,
      error: 'Failed to complete verification',
    };
  }

  return {
    success: true,
  };
}

/**
 * Remove phone number and disable SMS alerts
 */
export async function removePhoneNumber(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('user_settings')
    .update({
      phone_number: null,
      phone_verified: false,
      sms_alerts_enabled: false,
      phone_verification_code: null,
      phone_verification_expires_at: null,
    } as any)
    .eq('user_id', userId);

  if (error) {
    return {
      success: false,
      error: 'Failed to remove phone number',
    };
  }

  return { success: true };
}
