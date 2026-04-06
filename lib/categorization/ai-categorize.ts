/**
 * AI-powered transaction categorization using Claude.
 * Used as a fallback for transactions that don't match rule-based patterns.
 */

import { createAnthropicClient } from '@/lib/ai/client';
import type {
  TransactionInput,
  CategorySuggestion,
  CategorizationConfidence,
} from './types';

const CATEGORIZATION_PROMPT = `You are a financial transaction categorizer. Given a list of bank transaction descriptions and available bill categories, suggest the most appropriate category for each transaction.

Available categories (ONLY use these exact names):
{categories}

Transactions to categorize:
{transactions}

For each transaction, respond with a JSON array containing objects with:
- transactionId: the ID of the transaction (string)
- category: the suggested category name (MUST be exactly one from the available list)
- confidence: "high", "medium", or "low" based on how confident you are

Rules:
- Only use categories from the provided list
- If unsure, use "Other" as the category with "low" confidence
- Consider the transaction description and amount when categorizing
- Common patterns: streaming services are "Subscriptions", utility companies are "Utilities", etc.

Respond ONLY with valid JSON array. No explanations or additional text.

Example response format:
[{"transactionId":"1","category":"Subscriptions","confidence":"high"},{"transactionId":"2","category":"Other","confidence":"low"}]`;

/**
 * Parse AI response into category suggestions.
 */
function parseAIResponse(
  responseText: string,
  availableCategories: string[]
): Map<string, CategorySuggestion> {
  const results = new Map<string, CategorySuggestion>();
  const normalizedCategories = availableCategories.map((c) => c.toLowerCase());

  try {
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```/g, '');
    }

    const suggestions = JSON.parse(jsonText) as Array<{
      transactionId: string;
      category: string;
      confidence: string;
    }>;

    for (const suggestion of suggestions) {
      // Validate category exists (case-insensitive match)
      const categoryIndex = normalizedCategories.indexOf(
        suggestion.category.toLowerCase()
      );

      if (categoryIndex === -1) {
        // Invalid category from AI, map to "Other"
        const otherCategory = availableCategories.find(
          (c) => c.toLowerCase() === 'other'
        );
        if (otherCategory) {
          results.set(suggestion.transactionId, {
            category: otherCategory,
            confidence: 'low',
            source: 'ai',
          });
        }
        continue;
      }

      // Valid confidence values
      const validConfidence: CategorizationConfidence =
        suggestion.confidence === 'high'
          ? 'high'
          : suggestion.confidence === 'medium'
            ? 'medium'
            : 'low';

      const matchedCategory = availableCategories[categoryIndex];
      if (matchedCategory) {
        results.set(suggestion.transactionId, {
          category: matchedCategory,
          confidence: validConfidence,
          source: 'ai',
        });
      }
    }
  } catch (error) {
    console.error('Failed to parse AI categorization response:', error);
    // Return empty results on parse error
  }

  return results;
}

/**
 * Use Claude to categorize transactions that couldn't be matched by rules.
 * Batches transactions into a single API call for efficiency.
 */
export async function categorizeWithAI(
  transactions: TransactionInput[],
  availableCategories: string[]
): Promise<Map<string, CategorySuggestion>> {
  const results = new Map<string, CategorySuggestion>();

  if (transactions.length === 0 || availableCategories.length === 0) {
    return results;
  }

  try {
    const anthropic = createAnthropicClient();

    // Format transactions for prompt
    const transactionsText = transactions
      .map(
        (tx) =>
          `- ID: "${tx.id}", Description: "${tx.description}", Amount: $${Math.abs(tx.amount).toFixed(2)}`
      )
      .join('\n');

    const categoriesText = availableCategories.join(', ');

    const prompt = CATEGORIZATION_PROMPT.replace(
      '{categories}',
      categoriesText
    ).replace('{transactions}', transactionsText);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Cost-effective model for categorization
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text content from response
    const content = response.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return parseAIResponse(content.text, availableCategories);
  } catch (error) {
    console.error('AI categorization error:', error);
    // Return empty results on error - transactions will use default category
    return results;
  }
}

/**
 * Batch size limits for AI categorization based on subscription tier.
 */
export const AI_CATEGORIZATION_LIMITS = {
  free: 10,
  pro: 50,
  premium: 50,
  lifetime: 50,
} as const;

/**
 * Get the maximum number of transactions that can be AI-categorized based on tier.
 */
export function getAICategorizationLimit(
  tier: 'free' | 'pro' | 'premium' | 'lifetime'
): number {
  return AI_CATEGORIZATION_LIMITS[tier];
}
