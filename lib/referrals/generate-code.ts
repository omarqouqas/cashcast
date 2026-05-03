/**
 * Generate a unique 8-character alphanumeric referral code.
 * Excludes confusable characters: 0, O, 1, I, L
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Validate a referral code format.
 * Must be exactly 8 alphanumeric characters.
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
}

/**
 * Sanitize a referral code input.
 * Removes invalid characters and uppercases.
 */
export function sanitizeReferralCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}
