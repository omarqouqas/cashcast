/**
 * Send SMS via Twilio
 */

import { twilioClient, TWILIO_PHONE_NUMBER, isTwilioConfigured } from './twilio';
import type { SMSResult } from './types';

/**
 * Validate phone number format (E.164)
 * Examples: +14155552671, +442071234567
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format: + followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Format phone number to E.164 if possible
 */
export function formatToE164(phone: string, defaultCountryCode = '+1'): string {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If it doesn't start with +, add default country code
  if (!cleaned.startsWith('+')) {
    // Remove leading 1 if present (US) and add country code
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = defaultCountryCode + cleaned;
    }
  }

  return cleaned;
}

/**
 * Send an SMS message
 */
export async function sendSMS(to: string, body: string): Promise<SMSResult> {
  if (!isTwilioConfigured()) {
    return {
      success: false,
      error: 'Twilio is not configured',
    };
  }

  // Format and validate phone number
  const formattedPhone = formatToE164(to);
  if (!isValidPhoneNumber(formattedPhone)) {
    return {
      success: false,
      error: 'Invalid phone number format',
    };
  }

  // Limit message length (SMS has 160 char limit, but we allow multipart)
  const truncatedBody = body.slice(0, 1600);

  try {
    const message = await twilioClient!.messages.create({
      body: truncatedBody,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

/**
 * Send a low balance alert SMS
 */
export async function sendLowBalanceAlertSMS(
  to: string,
  amount: string,
  daysUntil: number,
  currency: string
): Promise<SMSResult> {
  const body = `CashCast Alert: Your balance will drop to ${currency}${amount} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. View details at cashcast.io/dashboard`;
  return sendSMS(to, body);
}
