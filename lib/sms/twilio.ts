/**
 * Twilio client configuration
 */

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn('Twilio credentials not configured. SMS features will be disabled.');
}

export const twilioClient = accountSid && authToken
  ? twilio(accountSid, authToken)
  : null;

export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export function isTwilioConfigured(): boolean {
  return Boolean(twilioClient && TWILIO_PHONE_NUMBER);
}
