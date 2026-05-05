/**
 * SMS notification types
 */

export type SMSResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type PhoneVerificationResult = {
  success: boolean;
  error?: string;
  expiresAt?: Date;
};

export type VerifyCodeResult = {
  success: boolean;
  error?: string;
};
