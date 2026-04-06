/**
 * Types for AI-powered transaction categorization.
 */

/** Confidence level of the category suggestion */
export type CategorizationConfidence = 'high' | 'medium' | 'low';

/** Source of the categorization */
export type CategorizationSource = 'rule' | 'ai' | 'default';

/** Category suggestion for a single transaction */
export interface CategorySuggestion {
  /** Category name (matches user_categories.name) */
  category: string;
  /** Confidence level */
  confidence: CategorizationConfidence;
  /** How this suggestion was determined */
  source: CategorizationSource;
  /** For rule-based: the pattern that matched */
  matchedPattern?: string;
}

/** Rule definition for pattern matching */
export interface CategorizationRule {
  /** Unique identifier for the rule */
  id: string;
  /** Keywords or patterns to match (case-insensitive) */
  patterns: string[];
  /** Target category name */
  category: string;
  /** Priority (higher = evaluated first) */
  priority: number;
  /** If true, patterns are treated as regex */
  isRegex?: boolean;
}

/** Result of rule matching */
export interface RuleMatchResult {
  category: string;
  rule: CategorizationRule;
  matchedPattern: string;
}

/** Transaction input for categorization */
export interface TransactionInput {
  id: string;
  description: string;
  amount: number;
}

/** API request for AI categorization */
export interface AICategorizeRequest {
  transactions: TransactionInput[];
  availableCategories: string[];
}

/** Single suggestion from AI */
export interface AISuggestion {
  transactionId: string;
  category: string;
  confidence: CategorizationConfidence;
}

/** API response from AI categorization */
export interface AICategorizeResponse {
  suggestions: Record<string, CategorySuggestion>;
}
