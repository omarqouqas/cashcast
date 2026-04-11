/**
 * Monte Carlo Integration for Income Pattern Analysis
 *
 * Provides learned variance parameters that can be used to enhance
 * the existing Monte Carlo simulation with historical income patterns.
 */

import type { VarianceParams } from '../calendar/monte-carlo/types';
import { getIncomeVariance } from '../calendar/monte-carlo/variance-config';
import type { IncomePatternAnalysis, IncomeSourceMetrics } from './types';

/**
 * Learned variance parameters with source matching info.
 */
export interface LearnedVariance {
  /** The variance parameters to use */
  params: VarianceParams;
  /** Whether this came from learned patterns or defaults */
  isLearned: boolean;
  /** Source name if matched */
  matchedSource: string | null;
  /** Confidence in the learned values (0-1) */
  confidence: number;
}

/**
 * Normalize a name for matching.
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Check if two names are similar enough to match.
 * Uses simple substring matching for flexibility.
 */
function namesMatch(name1: string, name2: string): boolean {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);

  // Exact match
  if (n1 === n2) return true;

  // One contains the other
  if (n1.includes(n2) || n2.includes(n1)) return true;

  // Check for "Invoice: ClientName" pattern
  const invoicePrefix = 'invoice:';
  if (n1.startsWith(invoicePrefix)) {
    const clientName = n1.substring(invoicePrefix.length).trim();
    if (clientName === n2 || n2.includes(clientName)) return true;
  }
  if (n2.startsWith(invoicePrefix)) {
    const clientName = n2.substring(invoicePrefix.length).trim();
    if (clientName === n1 || n1.includes(clientName)) return true;
  }

  return false;
}

/**
 * Find the best matching source metrics for an income record.
 */
function findMatchingSource(
  incomeName: string,
  sourceMetrics: IncomeSourceMetrics[]
): IncomeSourceMetrics | null {
  for (const source of sourceMetrics) {
    if (namesMatch(incomeName, source.name)) {
      return source;
    }
  }
  return null;
}

/**
 * Get learned income variance based on historical patterns.
 *
 * This function can be used to enhance the Monte Carlo simulation
 * with more accurate variance parameters learned from historical data.
 *
 * @param analysis - Income pattern analysis result (can be null)
 * @param incomeName - Name of the income record
 * @param defaultFrequency - Frequency from the income record
 * @returns Variance parameters (learned or default)
 */
export function getLearnedIncomeVariance(
  analysis: IncomePatternAnalysis | null,
  incomeName: string,
  defaultFrequency: string
): LearnedVariance {
  // Get default variance based on frequency
  const defaultParams = getIncomeVariance(defaultFrequency);

  // If no analysis available, use defaults
  if (!analysis || analysis.sourceMetrics.length === 0) {
    return {
      params: defaultParams,
      isLearned: false,
      matchedSource: null,
      confidence: 0,
    };
  }

  // Try to find matching source
  const matchedSource = findMatchingSource(incomeName, analysis.sourceMetrics);

  if (!matchedSource) {
    return {
      params: defaultParams,
      isLearned: false,
      matchedSource: null,
      confidence: 0,
    };
  }

  // Calculate confidence based on payment count and reliability
  const confidence = Math.min(
    0.95,
    matchedSource.paymentCount * 0.1 + matchedSource.reliabilityScore / 100 * 0.5
  );

  // If confidence is too low, prefer defaults
  if (confidence < 0.3) {
    return {
      params: defaultParams,
      isLearned: false,
      matchedSource: matchedSource.name,
      confidence,
    };
  }

  // Blend learned values with defaults based on confidence
  const learnedCV = matchedSource.amountCV;
  const learnedTiming = matchedSource.timingVariance;

  const blendedCV =
    learnedCV * confidence + defaultParams.amountCV * (1 - confidence);
  const blendedTiming = Math.round(
    learnedTiming * confidence + defaultParams.timingDays * (1 - confidence)
  );

  return {
    params: {
      amountCV: blendedCV,
      timingDays: blendedTiming,
    },
    isLearned: true,
    matchedSource: matchedSource.name,
    confidence,
  };
}

/**
 * Get a summary of how learned patterns would affect variance.
 * Useful for displaying in the UI.
 */
export function getVarianceSummary(
  analysis: IncomePatternAnalysis | null
): {
  hasLearnedPatterns: boolean;
  sourceCount: number;
  avgConfidence: number;
  description: string;
} {
  if (!analysis || analysis.sourceMetrics.length === 0) {
    return {
      hasLearnedPatterns: false,
      sourceCount: 0,
      avgConfidence: 0,
      description: 'Using default variance (no historical data)',
    };
  }

  const highConfidenceSources = analysis.sourceMetrics.filter(
    (s) => s.paymentCount >= 3 && s.reliabilityScore >= 50
  );

  if (highConfidenceSources.length === 0) {
    return {
      hasLearnedPatterns: false,
      sourceCount: analysis.sourceMetrics.length,
      avgConfidence: 0.2,
      description: 'Limited historical data, using mostly default variance',
    };
  }

  const avgConfidence =
    highConfidenceSources.reduce(
      (sum, s) => sum + s.reliabilityScore / 100,
      0
    ) / highConfidenceSources.length;

  return {
    hasLearnedPatterns: true,
    sourceCount: highConfidenceSources.length,
    avgConfidence,
    description: `Using learned patterns from ${highConfidenceSources.length} income source${highConfidenceSources.length !== 1 ? 's' : ''}`,
  };
}
