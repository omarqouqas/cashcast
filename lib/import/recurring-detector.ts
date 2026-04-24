/**
 * Recurring Pattern Detection for PDF Bank Statement Import
 *
 * Analyzes extracted transactions to detect recurring patterns (subscriptions,
 * regular payments, etc.) and suggests importing them as recurring bills/income.
 */

import type { RecurringFrequency } from '@/components/import/transaction-selector';

export type RecurringPattern = {
  /** Unique identifier for this pattern group */
  patternId: string;
  /** Original description from transactions */
  description: string;
  /** Cleaned/normalized description for display */
  normalizedName: string;
  /** Average amount (negative = expense, positive = income) */
  amount: number;
  /** Detected frequency based on date intervals */
  frequency: RecurringFrequency;
  /** Confidence score 0-1 */
  confidence: number;
  /** The transactions that matched this pattern */
  transactionIds: string[];
  /** Suggested day of month for recurring entry */
  suggestedDayOfMonth: number;
  /** Number of occurrences found */
  occurrenceCount: number;
};

export type PatternSuggestion = {
  isRecurring: boolean;
  patternId?: string;
  detectedFrequency?: RecurringFrequency;
  confidence: 'high' | 'medium' | 'low';
  similarTransactionCount: number;
  normalizedName?: string;
};

type Transaction = {
  id: string;
  transaction_date: string; // YYYY-MM-DD
  description: string;
  amount: number;
};

// Common prefixes/suffixes to strip from bank descriptions
const STRIP_PATTERNS = [
  /^(CHECKCARD|DEBIT|ACH|POS|RECURRING|AUTOPAY|ONLINE|MOBILE|WIRE)\s*/i,
  /^(PURCHASE|PMT|PYMT|PAYMENT)\s*/i,
  /\s*(PURCHASE|PAYMENT|WITHDRAWAL|TRANSACTION)$/i,
  /\s+\d{4}$/, // Last 4 digits of card
  /\s+[A-Z]{2}\s*$/, // State codes
  /\s+\d{2}\/\d{2}$/, // Date suffixes like "01/15"
  /\s*#\d+$/, // Reference numbers
  /\s+x{1,4}\d{4}$/i, // Masked card numbers like "xxxx1234"
  /\s+\*+\d{4}$/i, // Masked card numbers like "****1234"
];

// Merchant name variations to normalize
const MERCHANT_NORMALIZATIONS: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /netflix\.?com?/i, normalized: 'Netflix' },
  { pattern: /spotify\s*(usa|premium)?/i, normalized: 'Spotify' },
  { pattern: /amazon\s*(prime|video|music)?/i, normalized: 'Amazon' },
  { pattern: /apple\.com\/bill/i, normalized: 'Apple Services' },
  { pattern: /google\s*\*?(play|storage|one|youtube)/i, normalized: 'Google Services' },
  { pattern: /adobe\s*(creative\s*cloud|systems)?/i, normalized: 'Adobe' },
  { pattern: /microsoft\s*\*?(365|office)?/i, normalized: 'Microsoft 365' },
  { pattern: /dropbox/i, normalized: 'Dropbox' },
  { pattern: /hulu/i, normalized: 'Hulu' },
  { pattern: /disney\s*\+?/i, normalized: 'Disney+' },
  { pattern: /hbo\s*max/i, normalized: 'HBO Max' },
  { pattern: /paramount\s*\+?/i, normalized: 'Paramount+' },
  { pattern: /peacock/i, normalized: 'Peacock' },
  { pattern: /chatgpt|openai/i, normalized: 'OpenAI' },
  { pattern: /github/i, normalized: 'GitHub' },
  { pattern: /slack/i, normalized: 'Slack' },
  { pattern: /zoom\.us/i, normalized: 'Zoom' },
  { pattern: /canva/i, normalized: 'Canva' },
  { pattern: /figma/i, normalized: 'Figma' },
  { pattern: /notion/i, normalized: 'Notion' },
  { pattern: /linear/i, normalized: 'Linear' },
  { pattern: /vercel/i, normalized: 'Vercel' },
  { pattern: /heroku/i, normalized: 'Heroku' },
  { pattern: /aws|amazon\s*web/i, normalized: 'AWS' },
  { pattern: /digitalocean/i, normalized: 'DigitalOcean' },
  { pattern: /linode/i, normalized: 'Linode' },
  { pattern: /cloudflare/i, normalized: 'Cloudflare' },
  { pattern: /namecheap/i, normalized: 'Namecheap' },
  { pattern: /godaddy/i, normalized: 'GoDaddy' },
  { pattern: /squarespace/i, normalized: 'Squarespace' },
  { pattern: /shopify/i, normalized: 'Shopify' },
  { pattern: /mailchimp/i, normalized: 'Mailchimp' },
  { pattern: /convertkit/i, normalized: 'ConvertKit' },
  { pattern: /planet\s*fitness/i, normalized: 'Planet Fitness' },
  { pattern: /la\s*fitness/i, normalized: 'LA Fitness' },
  { pattern: /ymca/i, normalized: 'YMCA' },
  { pattern: /equinox/i, normalized: 'Equinox' },
];

/**
 * Normalize a bank transaction description for grouping and display
 */
export function normalizeDescription(description: string): string {
  let normalized = description;

  // Strip common prefixes/suffixes
  for (const pattern of STRIP_PATTERNS) {
    normalized = normalized.replace(pattern, '');
  }

  // Trim whitespace
  normalized = normalized.trim();

  // Check for known merchant normalizations
  for (const { pattern, normalized: name } of MERCHANT_NORMALIZATIONS) {
    if (pattern.test(normalized)) {
      return name;
    }
  }

  // Title case the result
  normalized = normalized
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Clean up multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Cap length
  return normalized.slice(0, 100) || description.slice(0, 100);
}

/**
 * Check if two descriptions are similar enough to be the same merchant
 */
function areSimilarDescriptions(desc1: string, desc2: string): boolean {
  const norm1 = normalizeDescription(desc1).toLowerCase();
  const norm2 = normalizeDescription(desc2).toLowerCase();

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // One contains the other (for partial matches)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // Levenshtein-ish similarity (simple version)
  const minLen = Math.min(norm1.length, norm2.length);

  if (minLen < 3) return false; // Too short to compare

  // Check if first N characters match (for merchant codes)
  const prefixLen = Math.min(10, minLen);
  if (norm1.slice(0, prefixLen) === norm2.slice(0, prefixLen)) {
    return true;
  }

  // Check word overlap
  const words1 = new Set(norm1.split(/\s+/));
  const words2 = new Set(norm2.split(/\s+/));
  const intersection = Array.from(words1).filter((w) => words2.has(w) && w.length > 2);
  const union = new Set(Array.from(words1).concat(Array.from(words2)));

  // Jaccard similarity > 0.5
  if (intersection.length / union.size > 0.5) return true;

  return false;
}

/**
 * Check if two amounts are similar enough (within 10% variance)
 */
function areSimilarAmounts(amount1: number, amount2: number): boolean {
  const abs1 = Math.abs(amount1);
  const abs2 = Math.abs(amount2);

  // Same sign
  if ((amount1 >= 0) !== (amount2 >= 0)) return false;

  // Exact match
  if (Math.abs(abs1 - abs2) < 0.01) return true;

  // Within 10% variance
  const avg = (abs1 + abs2) / 2;
  if (avg === 0) return true;

  const variance = Math.abs(abs1 - abs2) / avg;
  return variance <= 0.1;
}

/**
 * Calculate days between two ISO date strings
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Detect frequency from an array of date intervals (in days)
 */
function detectFrequency(intervals: number[]): RecurringFrequency | null {
  if (intervals.length === 0) return null;

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // Check standard deviation to ensure consistency
  const variance =
    intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
    intervals.length;
  const stdDev = Math.sqrt(variance);

  // If intervals vary too much (stdDev > 30% of mean), it's irregular
  if (stdDev > avgInterval * 0.3 && avgInterval > 7) {
    return null;
  }

  // Map average interval to frequency
  if (avgInterval <= 9) return 'weekly'; // 5-9 days
  if (avgInterval <= 18) return 'biweekly'; // 10-18 days
  if (avgInterval <= 20) return 'semi-monthly'; // ~15 days
  if (avgInterval <= 35) return 'monthly'; // 25-35 days
  if (avgInterval <= 100) return 'quarterly'; // 80-100 days
  if (avgInterval <= 380) return 'annually'; // 350-380 days

  return null;
}

/**
 * Calculate the most common day of month from dates
 */
function mostCommonDayOfMonth(dates: string[]): number {
  const dayCounts = new Map<number, number>();

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const day = date.getDate();
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  }

  let maxCount = 0;
  let mostCommon = 1;

  dayCounts.forEach((count, day) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = day;
    }
  });

  return mostCommon;
}

/**
 * Calculate confidence score for a recurring pattern
 */
function calculateConfidence(
  occurrences: number,
  frequency: RecurringFrequency | null,
  amountVariance: number,
  intervalConsistency: number
): number {
  if (!frequency) return 0;

  let confidence = 0;

  // More occurrences = higher confidence
  if (occurrences >= 6) confidence += 0.4;
  else if (occurrences >= 4) confidence += 0.3;
  else if (occurrences >= 3) confidence += 0.2;
  else if (occurrences >= 2) confidence += 0.1;

  // Low amount variance = higher confidence
  if (amountVariance < 0.01) confidence += 0.3;
  else if (amountVariance < 0.05) confidence += 0.2;
  else if (amountVariance < 0.1) confidence += 0.1;

  // Consistent intervals = higher confidence
  if (intervalConsistency > 0.9) confidence += 0.3;
  else if (intervalConsistency > 0.7) confidence += 0.2;
  else if (intervalConsistency > 0.5) confidence += 0.1;

  return Math.min(confidence, 1);
}

/**
 * Group transactions by similar description and amount
 */
function groupTransactions(
  transactions: Transaction[]
): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const normalized = normalizeDescription(tx.description).toLowerCase();
    let foundGroup = false;

    // Try to find an existing group
    groups.forEach((group) => {
      if (foundGroup) return;
      const firstTx = group[0];
      if (!firstTx) return;

      if (
        areSimilarDescriptions(tx.description, firstTx.description) &&
        areSimilarAmounts(tx.amount, firstTx.amount)
      ) {
        group.push(tx);
        foundGroup = true;
      }
    });

    // Create new group
    if (!foundGroup) {
      const key = `${normalized}|${Math.abs(tx.amount).toFixed(2)}`;
      groups.set(key, [tx]);
    }
  }

  return groups;
}

/**
 * Detect recurring patterns in a list of transactions
 */
export function detectRecurringPatterns(
  transactions: Transaction[]
): RecurringPattern[] {
  if (transactions.length < 2) return [];

  // Group transactions by similar description and amount
  const groups = groupTransactions(transactions);

  const patterns: RecurringPattern[] = [];
  let patternIndex = 0;

  groups.forEach((group) => {
    // Need at least 2 occurrences to detect a pattern
    if (group.length < 2) return;

    // Sort by date
    const sorted = [...group].sort(
      (a: Transaction, b: Transaction) =>
        new Date(a.transaction_date).getTime() -
        new Date(b.transaction_date).getTime()
    );

    // Calculate intervals between transactions
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (prev && curr) {
        intervals.push(daysBetween(prev.transaction_date, curr.transaction_date));
      }
    }

    // Detect frequency
    const frequency = detectFrequency(intervals);
    if (!frequency) return;

    // Calculate average amount and variance
    const amounts = group.map((t: Transaction) => Math.abs(t.amount));
    const avgAmount = amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length;
    const amountVariance =
      amounts.reduce((sum: number, a: number) => sum + Math.pow(a - avgAmount, 2), 0) /
      amounts.length /
      (avgAmount * avgAmount || 1);

    // Calculate interval consistency
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalVariance =
      intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
      intervals.length;
    const intervalConsistency =
      avgInterval > 0
        ? 1 - Math.min(Math.sqrt(intervalVariance) / avgInterval, 1)
        : 0;

    // Calculate confidence
    const confidence = calculateConfidence(
      group.length,
      frequency,
      Math.sqrt(amountVariance),
      intervalConsistency
    );

    // Only include patterns with reasonable confidence
    if (confidence < 0.3) return;

    const firstTx = group[0];
    if (!firstTx) return;

    // Use the sign from the first transaction (expense = negative)
    const signedAmount =
      firstTx.amount < 0 ? -avgAmount : avgAmount;

    patterns.push({
      patternId: `pattern-${patternIndex++}`,
      description: firstTx.description,
      normalizedName: normalizeDescription(firstTx.description),
      amount: Math.round(signedAmount * 100) / 100,
      frequency,
      confidence,
      transactionIds: group.map((t: Transaction) => t.id),
      suggestedDayOfMonth: mostCommonDayOfMonth(group.map((t: Transaction) => t.transaction_date)),
      occurrenceCount: group.length,
    });
  });

  // Sort by confidence (highest first)
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Create pattern suggestions for each transaction
 */
export function createPatternSuggestions(
  transactions: Transaction[],
  patterns: RecurringPattern[]
): Map<string, PatternSuggestion> {
  const suggestions = new Map<string, PatternSuggestion>();

  // Create a lookup from transaction ID to pattern
  const txToPattern = new Map<string, RecurringPattern>();
  for (const pattern of patterns) {
    for (const txId of pattern.transactionIds) {
      txToPattern.set(txId, pattern);
    }
  }

  for (const tx of transactions) {
    const pattern = txToPattern.get(tx.id);

    if (pattern) {
      suggestions.set(tx.id, {
        isRecurring: true,
        patternId: pattern.patternId,
        detectedFrequency: pattern.frequency,
        confidence:
          pattern.confidence >= 0.7
            ? 'high'
            : pattern.confidence >= 0.5
            ? 'medium'
            : 'low',
        similarTransactionCount: pattern.occurrenceCount,
        normalizedName: pattern.normalizedName,
      });
    } else {
      suggestions.set(tx.id, {
        isRecurring: false,
        confidence: 'low',
        similarTransactionCount: 1,
      });
    }
  }

  return suggestions;
}
