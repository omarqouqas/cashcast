/**
 * Trend Analyzer for Income Pattern Analysis
 *
 * Analyzes income trends using linear regression on monthly totals
 * to determine if income is growing, stable, or declining.
 */

import { format, startOfMonth } from 'date-fns';
import type { IncomePayment, IncomeTrend } from './types';

/**
 * Result of trend analysis.
 */
export interface TrendAnalysisResult {
  trend: IncomeTrend;
  confidence: number; // 0-1, based on R-squared
  monthlyChange: number; // Average monthly change in dollars
  percentChange: number; // Average monthly change as percentage
}

/**
 * Group payments by month and calculate monthly totals.
 */
function groupPaymentsByMonth(
  payments: IncomePayment[]
): Map<string, number> {
  const monthlyTotals = new Map<string, number>();

  for (const payment of payments) {
    const monthKey = format(startOfMonth(payment.date), 'yyyy-MM');
    const current = monthlyTotals.get(monthKey) || 0;
    monthlyTotals.set(monthKey, current + payment.amount);
  }

  return monthlyTotals;
}

/**
 * Simple linear regression to find slope and R-squared.
 *
 * @param x - Independent variable (e.g., month index)
 * @param y - Dependent variable (e.g., monthly income)
 * @returns Slope, intercept, and R-squared
 */
function linearRegression(x: number[], y: number[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const n = x.length;

  if (n < 2) {
    return { slope: 0, intercept: y[0] || 0, rSquared: 0 };
  }

  // Calculate means
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xi = x[i]!;
    const yi = y[i]!;
    numerator += (xi - xMean) * (yi - yMean);
    denominator += Math.pow(xi - xMean, 2);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  let ssRes = 0; // Residual sum of squares
  let ssTot = 0; // Total sum of squares

  for (let i = 0; i < n; i++) {
    const xi = x[i]!;
    const yi = y[i]!;
    const predicted = slope * xi + intercept;
    ssRes += Math.pow(yi - predicted, 2);
    ssTot += Math.pow(yi - yMean, 2);
  }

  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, rSquared: Math.max(0, rSquared) };
}

/**
 * Analyze overall income trend from payment history.
 *
 * Uses linear regression on monthly totals to determine:
 * - Growing: significant positive slope (>3% monthly growth)
 * - Declining: significant negative slope (<-3% monthly decline)
 * - Stable: slope within ±3% of average monthly income
 *
 * @param payments - All payments sorted by date
 * @returns Trend analysis result
 */
export function analyzeTrend(payments: IncomePayment[]): TrendAnalysisResult {
  // Need at least 2 months of data for meaningful trend
  if (payments.length < 2) {
    return {
      trend: 'stable',
      confidence: 0.1,
      monthlyChange: 0,
      percentChange: 0,
    };
  }

  // Group by month
  const monthlyTotals = groupPaymentsByMonth(payments);

  if (monthlyTotals.size < 2) {
    return {
      trend: 'stable',
      confidence: 0.2,
      monthlyChange: 0,
      percentChange: 0,
    };
  }

  // Convert to arrays for regression
  const sortedMonths = Array.from(monthlyTotals.keys()).sort();
  const x = sortedMonths.map((_, i) => i);
  const y = sortedMonths.map((month) => monthlyTotals.get(month)!);

  // Run linear regression
  const { slope, rSquared } = linearRegression(x, y);

  // Calculate average monthly income
  const avgMonthlyIncome = y.reduce((a, b) => a + b, 0) / y.length;

  // Calculate percent change per month
  const percentChange =
    avgMonthlyIncome > 0 ? (slope / avgMonthlyIncome) * 100 : 0;

  // Determine trend based on percentage change
  // Thresholds: >3% = growing, <-3% = declining
  let trend: IncomeTrend = 'stable';
  if (percentChange > 3) {
    trend = 'growing';
  } else if (percentChange < -3) {
    trend = 'declining';
  }

  // Confidence based on R-squared and sample size
  // Higher R-squared = better fit = more confident
  // More months = more confident
  const sampleSizeBonus = Math.min(0.3, sortedMonths.length * 0.05);
  const confidence = Math.min(0.95, rSquared * 0.7 + sampleSizeBonus);

  return {
    trend,
    confidence,
    monthlyChange: slope,
    percentChange,
  };
}

/**
 * Analyze trend for a single income source.
 * Wrapper that calls analyzeTrend with source's payments.
 */
export function analyzeSourceTrend(
  payments: IncomePayment[]
): TrendAnalysisResult {
  return analyzeTrend(payments);
}
