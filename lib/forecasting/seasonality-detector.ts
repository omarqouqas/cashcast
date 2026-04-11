/**
 * Seasonality Detector for Income Pattern Analysis
 *
 * Detects quarterly seasonal patterns in income history.
 * Requires at least 6 months of data for meaningful detection.
 */

import { getMonth } from 'date-fns';
import type { IncomePayment, SeasonalityPattern } from './types';

/**
 * Quarter labels for display.
 */
const QUARTER_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Q1 (Jan-Mar)',
  2: 'Q2 (Apr-Jun)',
  3: 'Q3 (Jul-Sep)',
  4: 'Q4 (Oct-Dec)',
};

/**
 * Get the quarter (1-4) for a given date.
 */
function getQuarter(date: Date): 1 | 2 | 3 | 4 {
  const month = getMonth(date); // 0-11
  return (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4;
}

/**
 * Group payments by quarter and calculate totals.
 */
function groupPaymentsByQuarter(
  payments: IncomePayment[]
): Map<1 | 2 | 3 | 4, number[]> {
  const quarterPayments = new Map<1 | 2 | 3 | 4, number[]>([
    [1, []],
    [2, []],
    [3, []],
    [4, []],
  ]);

  for (const payment of payments) {
    const quarter = getQuarter(payment.date);
    quarterPayments.get(quarter)!.push(payment.amount);
  }

  return quarterPayments;
}

/**
 * Calculate quarterly averages from grouped payments.
 */
function calculateQuarterlyAverages(
  quarterPayments: Map<1 | 2 | 3 | 4, number[]>
): Map<1 | 2 | 3 | 4, number> {
  const averages = new Map<1 | 2 | 3 | 4, number>();

  const entries = Array.from(quarterPayments.entries());
  for (const [quarter, amounts] of entries) {
    if (amounts.length > 0) {
      const sum = amounts.reduce((a: number, b: number) => a + b, 0);
      averages.set(quarter, sum / amounts.length);
    } else {
      averages.set(quarter, 0);
    }
  }

  return averages;
}

/**
 * Result of seasonality detection.
 */
export interface SeasonalityResult {
  patterns: SeasonalityPattern[];
  detected: boolean;
  hasEnoughData: boolean;
}

/**
 * Detect quarterly seasonal patterns in income.
 *
 * A pattern is "detected" if any quarter deviates more than 10%
 * from the baseline (overall average).
 *
 * Confidence is based on:
 * - Number of data points per quarter
 * - Consistency of pattern across multiple years (if available)
 *
 * @param payments - All payments sorted by date
 * @param monthsOfData - Number of months of payment history
 * @returns Seasonality detection result
 */
export function detectSeasonality(
  payments: IncomePayment[],
  monthsOfData: number
): SeasonalityResult {
  // Need at least 6 months for meaningful seasonality
  if (monthsOfData < 6 || payments.length < 4) {
    return {
      patterns: [],
      detected: false,
      hasEnoughData: false,
    };
  }

  // Group by quarter
  const quarterPayments = groupPaymentsByQuarter(payments);

  // Calculate quarterly averages
  const quarterlyAverages = calculateQuarterlyAverages(quarterPayments);

  // Calculate overall baseline (average across all quarters with data)
  const quartersWithData = Array.from(quarterlyAverages.entries()).filter(
    ([_, avg]) => avg > 0
  );

  if (quartersWithData.length < 2) {
    return {
      patterns: [],
      detected: false,
      hasEnoughData: false,
    };
  }

  const baseline =
    quartersWithData.reduce((sum, [_, avg]) => sum + avg, 0) /
    quartersWithData.length;

  if (baseline === 0) {
    return {
      patterns: [],
      detected: false,
      hasEnoughData: false,
    };
  }

  // Calculate patterns for each quarter
  const patterns: SeasonalityPattern[] = [];
  let significantDeviationFound = false;

  for (const quarter of [1, 2, 3, 4] as const) {
    const avg = quarterlyAverages.get(quarter) || 0;
    const multiplier = avg / baseline;
    const percentChange = (multiplier - 1) * 100;

    // Confidence based on sample size for this quarter
    const sampleCount = quarterPayments.get(quarter)!.length;
    let confidence = 0;

    if (sampleCount >= 1) confidence = 0.3;
    if (sampleCount >= 2) confidence = 0.5;
    if (sampleCount >= 3) confidence = 0.7;
    if (sampleCount >= 4) confidence = 0.85;
    if (sampleCount >= 6) confidence = 0.95;

    // Only include quarters with data
    if (sampleCount > 0) {
      patterns.push({
        quarter,
        quarterLabel: QUARTER_LABELS[quarter],
        multiplier,
        percentChange: Math.round(percentChange),
        confidence,
      });

      // Check if this is a significant deviation (>10%)
      if (Math.abs(percentChange) > 10 && confidence >= 0.5) {
        significantDeviationFound = true;
      }
    }
  }

  // Sort patterns by absolute deviation (most significant first)
  patterns.sort(
    (a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange)
  );

  return {
    patterns,
    detected: significantDeviationFound,
    hasEnoughData: true,
  };
}

/**
 * Get the seasonal multiplier for a specific quarter.
 *
 * @param patterns - Array of seasonality patterns
 * @param quarter - Quarter to look up (1-4)
 * @returns Multiplier for the quarter, or 1.0 if not found
 */
export function getSeasonalMultiplier(
  patterns: SeasonalityPattern[],
  quarter: 1 | 2 | 3 | 4
): number {
  const pattern = patterns.find((p) => p.quarter === quarter);
  return pattern?.multiplier ?? 1.0;
}

/**
 * Format seasonality pattern for display.
 *
 * @param pattern - Seasonality pattern
 * @returns Formatted string like "+30% (Q4)"
 */
export function formatSeasonalityPattern(pattern: SeasonalityPattern): string {
  const sign = pattern.percentChange >= 0 ? '+' : '';
  return `${sign}${pattern.percentChange}% (${pattern.quarterLabel})`;
}
