/**
 * Anthropic Claude client configuration.
 */

import Anthropic from '@anthropic-ai/sdk';

// Validate environment variable exists at module load time in development
if (process.env.NODE_ENV === 'development' && !process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '[AI] ANTHROPIC_API_KEY is not set. AI features will not work.'
  );
}

/**
 * Creates a new Anthropic client instance.
 * The API key is read from the ANTHROPIC_API_KEY environment variable.
 */
export function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  return new Anthropic({ apiKey });
}

/**
 * Model selection based on query complexity.
 * Uses Haiku for simple queries (cheaper, faster) and Sonnet for complex ones.
 */
export function selectModel(query: string): string {
  // Simple greetings or very short queries use Haiku
  const simplePatterns =
    /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|sure)[\s!.?]*$/i;

  if (simplePatterns.test(query.trim()) || query.length < 20) {
    return 'claude-sonnet-4-20250514';
  }

  // Complex financial queries use Sonnet
  return 'claude-sonnet-4-20250514';
}

/**
 * Maximum tokens for responses.
 */
export const MAX_TOKENS = 1024;

/**
 * Maximum tool use iterations to prevent infinite loops.
 */
export const MAX_TOOL_ITERATIONS = 3;
