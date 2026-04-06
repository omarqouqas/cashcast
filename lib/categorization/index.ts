/**
 * Smart Categorization - Main exports and orchestration.
 *
 * This module provides AI-powered transaction categorization using a hybrid approach:
 * 1. Rule-based engine (instant, free) - Pattern matching for common merchants
 * 2. Claude API fallback (batch, cost-effective) - For unrecognized transactions
 */

// Re-export types
export type {
  CategorySuggestion,
  CategorizationConfidence,
  CategorizationSource,
  CategorizationRule,
  TransactionInput,
  AICategorizeRequest,
  AICategorizeResponse,
} from './types';

// Re-export rules
export { DEFAULT_CATEGORIZATION_RULES, mergeWithUserRules } from './rules';

// Re-export rule engine functions
export {
  matchRules,
  categorizeWithRules,
  batchCategorizeWithRules,
  getUncategorizedTransactions,
} from './rule-engine';

// Re-export AI categorization
export {
  categorizeWithAI,
  AI_CATEGORIZATION_LIMITS,
  getAICategorizationLimit,
} from './ai-categorize';

import type { CategorySuggestion, TransactionInput } from './types';
import { batchCategorizeWithRules, getUncategorizedTransactions } from './rule-engine';

/**
 * Result of the categorization process.
 */
export interface CategorizationResult {
  /** Map of transaction ID to category suggestion */
  suggestions: Map<string, CategorySuggestion>;
  /** Transactions that couldn't be categorized by rules (candidates for AI) */
  uncategorized: TransactionInput[];
  /** Statistics about the categorization */
  stats: {
    total: number;
    ruleBased: number;
    uncategorized: number;
  };
}

/**
 * Categorize transactions using the hybrid approach.
 * First applies rule-based categorization (instant, free).
 * Returns both results and list of uncategorized transactions for optional AI processing.
 *
 * @param transactions - Transactions to categorize
 * @param availableCategories - User's available categories
 * @returns Categorization results including suggestions and uncategorized list
 */
export function categorizeTransactions(
  transactions: TransactionInput[],
  availableCategories: string[]
): CategorizationResult {
  // Run rule-based categorization
  const suggestions = batchCategorizeWithRules(transactions, availableCategories);

  // Get uncategorized transactions
  const uncategorized = getUncategorizedTransactions(transactions, suggestions);

  return {
    suggestions,
    uncategorized,
    stats: {
      total: transactions.length,
      ruleBased: suggestions.size,
      uncategorized: uncategorized.length,
    },
  };
}

/**
 * Merge AI suggestions into existing suggestions map.
 * Used after AI categorization completes to combine results.
 */
export function mergeSuggestions(
  existing: Map<string, CategorySuggestion>,
  aiSuggestions: Map<string, CategorySuggestion>
): Map<string, CategorySuggestion> {
  const merged = new Map(existing);
  aiSuggestions.forEach((suggestion, id) => {
    // Only add if not already categorized by rules
    if (!merged.has(id)) {
      merged.set(id, suggestion);
    }
  });
  return merged;
}
