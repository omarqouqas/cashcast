/**
 * Rule-based categorization engine.
 * Matches transaction descriptions against predefined patterns.
 */

import type {
  CategorizationRule,
  CategorySuggestion,
  RuleMatchResult,
  TransactionInput,
} from './types';
import { DEFAULT_CATEGORIZATION_RULES } from './rules';

/**
 * Match a transaction description against categorization rules.
 * Returns the first matching rule (rules are sorted by priority).
 */
export function matchRules(
  description: string,
  rules: CategorizationRule[] = DEFAULT_CATEGORIZATION_RULES
): RuleMatchResult | null {
  const normalizedDesc = description.toUpperCase().trim();

  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (rule.isRegex) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(description)) {
            return { category: rule.category, rule, matchedPattern: pattern };
          }
        } catch {
          // Invalid regex, skip
          continue;
        }
      } else {
        // Simple keyword matching (case-insensitive)
        if (normalizedDesc.includes(pattern.toUpperCase())) {
          return { category: rule.category, rule, matchedPattern: pattern };
        }
      }
    }
  }

  return null;
}

/**
 * Categorize a single transaction using rules.
 * Validates that the matched category exists in the user's available categories.
 */
export function categorizeWithRules(
  description: string,
  availableCategories: string[],
  rules?: CategorizationRule[]
): CategorySuggestion | null {
  const match = matchRules(description, rules);

  if (!match) {
    return null;
  }

  // Check if the matched category exists in user's categories (case-insensitive)
  const normalizedCategories = availableCategories.map((c) => c.toLowerCase());
  const matchedCategoryLower = match.category.toLowerCase();

  // Find the exact category name (preserving user's casing)
  const categoryIndex = normalizedCategories.indexOf(matchedCategoryLower);

  if (categoryIndex === -1) {
    // Category doesn't exist in user's list
    // Check if it's 'Other' which is always available
    if (matchedCategoryLower === 'other') {
      const otherCategory = availableCategories.find(
        (c) => c.toLowerCase() === 'other'
      );
      if (otherCategory) {
        return {
          category: otherCategory,
          confidence: 'low',
          source: 'rule',
          matchedPattern: match.matchedPattern,
        };
      }
    }
    // Return null if we can't map to a valid category
    return null;
  }

  const matchedCategory = availableCategories[categoryIndex];
  if (!matchedCategory) {
    return null;
  }

  return {
    category: matchedCategory,
    confidence: 'high',
    source: 'rule',
    matchedPattern: match.matchedPattern,
  };
}

/**
 * Batch categorize transactions using rules.
 * Returns a Map of transaction ID to suggestion.
 */
export function batchCategorizeWithRules(
  transactions: TransactionInput[],
  availableCategories: string[],
  rules?: CategorizationRule[]
): Map<string, CategorySuggestion> {
  const results = new Map<string, CategorySuggestion>();

  for (const tx of transactions) {
    const suggestion = categorizeWithRules(
      tx.description,
      availableCategories,
      rules
    );
    if (suggestion) {
      results.set(tx.id, suggestion);
    }
  }

  return results;
}

/**
 * Get all transactions that couldn't be categorized by rules.
 */
export function getUncategorizedTransactions(
  transactions: TransactionInput[],
  categorized: Map<string, CategorySuggestion>
): TransactionInput[] {
  return transactions.filter((tx) => !categorized.has(tx.id));
}
