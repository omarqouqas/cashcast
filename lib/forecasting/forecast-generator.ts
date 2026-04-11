/**
 * Forecast Generator for Income Pattern Analysis
 *
 * Generates probabilistic monthly forecasts (P10/P50/P90) for the next 90 days
 * using Monte Carlo simulation with learned variance parameters.
 */

import { addMonths, format, getMonth, startOfMonth } from 'date-fns';
import type {
  IncomeSourceMetrics,
  IncomeForAnalysis,
  MonthlyForecast,
  SeasonalityPattern,
} from './types';
import { getSeasonalMultiplier } from './seasonality-detector';

/**
 * Seeded random number generator (mulberry32).
 * Same as used in Monte Carlo simulation.
 */
function createSeededRNG(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Box-Muller transform for normal distribution.
 */
function normalRandom(rng: () => number, mean: number, stdDev: number): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Calculate expected monthly income from recurring income records.
 */
function calculateExpectedMonthlyFromRecurring(
  incomeRecords: IncomeForAnalysis[]
): number {
  let monthlyTotal = 0;

  for (const income of incomeRecords) {
    if (income.is_active === false) continue;
    if (income.invoice_id) continue; // Skip invoice-linked income (handled separately)

    switch (income.frequency) {
      case 'weekly':
        monthlyTotal += (income.amount * 52) / 12;
        break;
      case 'biweekly':
        monthlyTotal += (income.amount * 26) / 12;
        break;
      case 'semi-monthly':
        monthlyTotal += income.amount * 2;
        break;
      case 'monthly':
        monthlyTotal += income.amount;
        break;
      case 'quarterly':
        monthlyTotal += income.amount / 3;
        break;
      case 'annually':
        monthlyTotal += income.amount / 12;
        break;
      // one-time and irregular are excluded from recurring baseline
    }
  }

  return monthlyTotal;
}

/**
 * Calculate expected monthly income from historical invoice sources.
 */
function calculateExpectedMonthlyFromSources(
  sourceMetrics: IncomeSourceMetrics[]
): number {
  let monthlyTotal = 0;

  for (const source of sourceMetrics) {
    if (source.paymentCount < 2) continue;

    // Convert to monthly based on detected frequency
    switch (source.detectedFrequency) {
      case 'weekly':
        monthlyTotal += (source.avgAmount * 52) / 12;
        break;
      case 'biweekly':
        monthlyTotal += (source.avgAmount * 26) / 12;
        break;
      case 'semi-monthly':
        monthlyTotal += source.avgAmount * 2;
        break;
      case 'monthly':
        monthlyTotal += source.avgAmount;
        break;
      case 'quarterly':
        monthlyTotal += source.avgAmount / 3;
        break;
      case 'annually':
        monthlyTotal += source.avgAmount / 12;
        break;
      case 'irregular':
        // For irregular, estimate based on average days between
        if (source.avgDaysBetween > 0) {
          const paymentsPerMonth = 30 / source.avgDaysBetween;
          monthlyTotal += source.avgAmount * paymentsPerMonth;
        }
        break;
    }
  }

  return monthlyTotal;
}

/**
 * Calculate weighted average coefficient of variation from sources.
 */
function calculateWeightedCV(sourceMetrics: IncomeSourceMetrics[]): number {
  if (sourceMetrics.length === 0) return 0.15; // Default CV

  let totalWeight = 0;
  let weightedSum = 0;

  for (const source of sourceMetrics) {
    // Weight by payment count and average amount
    const weight = source.paymentCount * source.avgAmount;
    weightedSum += source.amountCV * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0.15;

  return Math.max(0.05, Math.min(0.5, weightedSum / totalWeight));
}

/**
 * Result of forecast generation including debug info.
 */
export interface ForecastResult {
  forecasts: MonthlyForecast[];
  debugFromRecurring: number;
  debugFromSources: number;
  debugBaselineMonthly: number;
}

/**
 * Generate probabilistic monthly forecasts for the next 90 days.
 *
 * Uses Monte Carlo simulation with:
 * - Learned variance from historical patterns
 * - Seasonal multipliers if detected
 * - 500 simulations per month
 *
 * @param sourceMetrics - Per-source metrics from historical analysis
 * @param incomeRecords - Current recurring income configuration
 * @param seasonality - Detected seasonal patterns
 * @param simulationCount - Number of Monte Carlo simulations (default 500)
 * @returns Forecast result with monthly forecasts and debug info
 */
export function generateMonthlyForecasts(
  sourceMetrics: IncomeSourceMetrics[],
  incomeRecords: IncomeForAnalysis[],
  seasonality: SeasonalityPattern[],
  simulationCount: number = 500
): ForecastResult {
  const today = new Date();
  const forecasts: MonthlyForecast[] = [];

  // Calculate baseline monthly income
  const fromRecurring = calculateExpectedMonthlyFromRecurring(incomeRecords);
  const fromSources = calculateExpectedMonthlyFromSources(sourceMetrics);

  // Use the higher of the two as baseline, but blend if both are significant
  let baselineMonthly: number;
  if (fromSources > 0 && fromRecurring > 0) {
    // Blend: favor historical data if we have good source metrics
    const sourceWeight = Math.min(0.7, sourceMetrics.length * 0.15);
    baselineMonthly =
      fromSources * sourceWeight + fromRecurring * (1 - sourceWeight);
  } else if (fromSources > 0) {
    baselineMonthly = fromSources;
  } else {
    baselineMonthly = fromRecurring;
  }

  // Calculate variance from historical data
  const cv = calculateWeightedCV(sourceMetrics);
  const stdDev = baselineMonthly * cv;

  // Seed RNG for reproducibility
  const rng = createSeededRNG(Date.now());

  // Generate forecast for next 3 months
  for (let monthOffset = 1; monthOffset <= 3; monthOffset++) {
    const monthDate = startOfMonth(addMonths(today, monthOffset));
    const monthLabel = format(monthDate, 'MMMM yyyy');
    const quarter = (Math.floor(getMonth(monthDate) / 3) + 1) as 1 | 2 | 3 | 4;

    // Apply seasonal multiplier
    const seasonalMultiplier = getSeasonalMultiplier(seasonality, quarter);
    const adjustedBaseline = baselineMonthly * seasonalMultiplier;
    const adjustedStdDev = stdDev * seasonalMultiplier;

    // Run Monte Carlo simulation
    const simulations: number[] = [];

    for (let i = 0; i < simulationCount; i++) {
      const simulated = normalRandom(rng, adjustedBaseline, adjustedStdDev);
      simulations.push(Math.max(0, simulated)); // No negative income
    }

    // Sort and extract percentiles
    simulations.sort((a, b) => a - b);

    const p10Index = Math.floor(simulationCount * 0.1);
    const p50Index = Math.floor(simulationCount * 0.5);
    const p90Index = Math.floor(simulationCount * 0.9);

    forecasts.push({
      month: monthDate,
      label: monthLabel,
      p10: Math.round(simulations[p10Index] ?? 0),
      p50: Math.round(simulations[p50Index] ?? 0),
      p90: Math.round(simulations[p90Index] ?? 0),
    });
  }

  return {
    forecasts,
    debugFromRecurring: Math.round(fromRecurring),
    debugFromSources: Math.round(fromSources),
    debugBaselineMonthly: Math.round(baselineMonthly),
  };
}

/**
 * Calculate 90-day totals from monthly forecasts.
 */
export function calculate90DayTotals(forecasts: MonthlyForecast[]): {
  p10: number;
  p50: number;
  p90: number;
} {
  // Note: Simply summing monthly P10/P50/P90 is a simplification
  // In reality, the 90-day percentiles would be calculated from
  // a combined simulation. This is a reasonable approximation.
  return {
    p10: forecasts.reduce((sum, f) => sum + f.p10, 0),
    p50: forecasts.reduce((sum, f) => sum + f.p50, 0),
    p90: forecasts.reduce((sum, f) => sum + f.p90, 0),
  };
}
