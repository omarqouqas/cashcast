/**
 * Metrics Calculator for Income Pattern Analysis
 *
 * Calculates statistical metrics for each income source including
 * amount variability, timing patterns, and reliability scores.
 */

import { differenceInDays } from 'date-fns';
import type {
  IncomePayment,
  IncomeSourceHistory,
  IncomeSourceMetrics,
  IncomeTrend,
} from './types';

/**
 * Calculate standard deviation of an array of numbers.
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;

  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Detect payment frequency based on intervals between payments.
 */
function detectFrequency(intervals: number[]): string {
  if (intervals.length === 0) return 'irregular';

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const stdDev = calculateStdDev(intervals, avgInterval);

  // Match against known patterns with tolerance
  if (avgInterval <= 9 && stdDev < 3) return 'weekly';
  if (avgInterval >= 12 && avgInterval <= 18 && stdDev < 4) return 'biweekly';
  if (avgInterval >= 13 && avgInterval <= 17 && stdDev < 5) return 'semi-monthly';
  if (avgInterval >= 25 && avgInterval <= 35 && stdDev < 7) return 'monthly';
  if (avgInterval >= 80 && avgInterval <= 100 && stdDev < 15) return 'quarterly';
  if (avgInterval >= 350 && avgInterval <= 380 && stdDev < 20) return 'annually';

  return 'irregular';
}

/**
 * Calculate a simple trend from payment amounts over time.
 * Uses comparison of recent vs older payments.
 */
function calculateSimpleTrend(payments: IncomePayment[]): {
  trend: IncomeTrend;
  confidence: number;
} {
  if (payments.length < 3) {
    return { trend: 'stable', confidence: 0.1 };
  }

  // Split into recent and older halves
  const midpoint = Math.floor(payments.length / 2);
  const olderPayments = payments.slice(0, midpoint);
  const recentPayments = payments.slice(midpoint);

  const olderAvg =
    olderPayments.reduce((sum, p) => sum + p.amount, 0) / olderPayments.length;
  const recentAvg =
    recentPayments.reduce((sum, p) => sum + p.amount, 0) / recentPayments.length;

  if (olderAvg === 0) {
    return { trend: 'stable', confidence: 0.2 };
  }

  const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

  // Confidence based on sample size
  const confidence = Math.min(0.9, 0.3 + payments.length * 0.1);

  // Thresholds: ±10% to be considered a trend
  if (percentChange > 10) {
    return { trend: 'growing', confidence };
  } else if (percentChange < -10) {
    return { trend: 'declining', confidence };
  }

  return { trend: 'stable', confidence };
}

/**
 * Calculate reliability score based on payment consistency.
 *
 * Factors:
 * - Payment count (more = more reliable)
 * - Amount consistency (lower CV = more reliable)
 * - Timing consistency (lower variance = more reliable)
 */
function calculateReliabilityScore(
  paymentCount: number,
  amountCV: number,
  timingStdDev: number
): number {
  // Base score from payment count (0-40 points)
  const countScore = Math.min(40, paymentCount * 5);

  // Amount consistency score (0-30 points)
  // CV of 0.1 (10%) = 30 points, CV of 0.5 (50%) = 0 points
  const amountScore = Math.max(0, 30 - amountCV * 60);

  // Timing consistency score (0-30 points)
  // StdDev of 0 days = 30 points, StdDev of 15 days = 0 points
  const timingScore = Math.max(0, 30 - timingStdDev * 2);

  return Math.round(countScore + amountScore + timingScore);
}

/**
 * Calculate metrics for a single income source.
 *
 * @param source - Income source with payment history
 * @returns Calculated metrics for the source
 */
export function calculateSourceMetrics(
  source: IncomeSourceHistory
): IncomeSourceMetrics {
  const { payments } = source;

  // Handle empty or single payment case
  if (payments.length === 0) {
    return {
      sourceId: source.sourceId,
      name: source.name,
      paymentCount: 0,
      avgAmount: 0,
      amountStdDev: 0,
      amountCV: 0,
      minAmount: 0,
      maxAmount: 0,
      avgDaysBetween: 0,
      timingStdDev: 0,
      timingVariance: 0,
      detectedFrequency: 'irregular',
      trend: 'stable',
      trendConfidence: 0,
      reliabilityScore: 0,
    };
  }

  // Calculate amount statistics
  const amounts = payments.map((p) => p.amount);
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const amountStdDev = calculateStdDev(amounts, avgAmount);
  const amountCV = avgAmount > 0 ? amountStdDev / avgAmount : 0;
  const minAmount = Math.min(...amounts);
  const maxAmount = Math.max(...amounts);

  // Calculate timing statistics (intervals between payments)
  const intervals: number[] = [];
  for (let i = 1; i < payments.length; i++) {
    const current = payments[i]!;
    const previous = payments[i - 1]!;
    const days = differenceInDays(current.date, previous.date);
    if (days > 0) {
      intervals.push(days);
    }
  }

  const avgDaysBetween =
    intervals.length > 0
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 0;
  const timingStdDev =
    intervals.length > 1 ? calculateStdDev(intervals, avgDaysBetween) : 0;

  // Timing variance for Monte Carlo (±2 standard deviations, capped)
  const timingVariance = Math.min(14, Math.ceil(timingStdDev * 2));

  // Detect payment frequency
  const detectedFrequency = detectFrequency(intervals);

  // Calculate trend
  const { trend, confidence: trendConfidence } = calculateSimpleTrend(payments);

  // Calculate reliability score
  const reliabilityScore = calculateReliabilityScore(
    payments.length,
    amountCV,
    timingStdDev
  );

  return {
    sourceId: source.sourceId,
    name: source.name,
    paymentCount: payments.length,
    avgAmount,
    amountStdDev,
    amountCV,
    minAmount,
    maxAmount,
    avgDaysBetween,
    timingStdDev,
    timingVariance,
    detectedFrequency,
    trend,
    trendConfidence,
    reliabilityScore,
  };
}

/**
 * Calculate metrics for all income sources.
 *
 * @param sources - Array of income source histories
 * @returns Array of source metrics, sorted by reliability score
 */
export function calculateAllSourceMetrics(
  sources: IncomeSourceHistory[]
): IncomeSourceMetrics[] {
  const metrics = sources.map(calculateSourceMetrics);

  // Sort by reliability score (most reliable first)
  return metrics.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}
