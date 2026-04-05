/**
 * Core Monte Carlo simulation engine for probabilistic cash flow forecasting.
 *
 * This module runs multiple simulations with varied income/bill amounts and timing
 * to generate probability distributions for future balances.
 */

import type { CalendarData, CalendarDay } from '../types';
import type {
  MonteCarloResult,
  MonteCarloConfig,
  ProbabilisticDay,
  RiskMetrics,
} from './types';
import { createRNG, varyAmount, shiftDays } from './random';
import { getIncomeVariance, getBillVariance } from './variance-config';

/**
 * Default configuration values.
 */
const DEFAULT_SIMULATION_COUNT = 500;
const DEFAULT_FORECAST_DAYS = 60;

/**
 * Run Monte Carlo simulation on a deterministic forecast.
 *
 * @param calendarData - The deterministic forecast from generateCalendar()
 * @param config - Simulation configuration
 * @returns Monte Carlo results with percentiles and risk metrics
 */
export function runMonteCarloSimulation(
  calendarData: CalendarData,
  config: MonteCarloConfig
): MonteCarloResult {
  const startTime = performance.now();

  const simulationCount = config.simulationCount ?? DEFAULT_SIMULATION_COUNT;
  const safetyBuffer = config.safetyBuffer;
  const forecastDays = Math.min(
    config.forecastDays ?? DEFAULT_FORECAST_DAYS,
    calendarData.days.length
  );

  // Create seeded RNG for reproducibility
  const rng = createRNG(config.seed);

  // Pre-allocate results matrix: [simulation][day] = balance
  const balanceMatrix: number[][] = Array.from({ length: simulationCount }, () =>
    new Array<number>(forecastDays)
  );

  // Track lowest balance per simulation for risk metrics
  const lowestBalances: number[] = new Array(simulationCount);

  // Extract base transactions from deterministic forecast
  const baseDays = calendarData.days.slice(0, forecastDays);
  const startingBalance = calendarData.startingBalance;

  // Pre-compute all transactions with their day indices for proper timing shifts
  interface ShiftedTransaction {
    originalDay: number;
    amount: number;
    type: 'income' | 'bill';
    frequency: string;
  }

  const allTransactions: ShiftedTransaction[] = [];
  for (let day = 0; day < forecastDays; day++) {
    const baseDay = baseDays[day];
    if (!baseDay) continue;

    for (const income of baseDay.income) {
      allTransactions.push({
        originalDay: day,
        amount: income.amount,
        type: 'income',
        frequency: income.frequency,
      });
    }
    for (const bill of baseDay.bills) {
      allTransactions.push({
        originalDay: day,
        amount: bill.amount,
        type: 'bill',
        frequency: bill.frequency,
      });
    }
  }

  // Run simulations
  for (let sim = 0; sim < simulationCount; sim++) {
    // Build daily income/bill totals for this simulation
    const dailyIncome = new Array<number>(forecastDays).fill(0);
    const dailyBills = new Array<number>(forecastDays).fill(0);

    // Apply variance and timing shifts to all transactions
    for (const txn of allTransactions) {
      const variance =
        txn.type === 'income'
          ? getIncomeVariance(txn.frequency)
          : getBillVariance(txn.frequency);

      const variedAmount = varyAmount(rng, txn.amount, variance.amountCV);
      const dayShift = shiftDays(rng, variance.timingDays);
      const targetDay = txn.originalDay + dayShift;

      // Only include if the shifted day is within our forecast window
      if (targetDay >= 0 && targetDay < forecastDays) {
        if (txn.type === 'income') {
          dailyIncome[targetDay] = dailyIncome[targetDay]! + variedAmount;
        } else {
          dailyBills[targetDay] = dailyBills[targetDay]! + variedAmount;
        }
      }
    }

    // Calculate running balance
    let balance = startingBalance;
    let lowestBalance = startingBalance;

    for (let day = 0; day < forecastDays; day++) {
      balance = balance + dailyIncome[day]! - dailyBills[day]!;
      balanceMatrix[sim]![day] = balance;

      if (balance < lowestBalance) {
        lowestBalance = balance;
      }
    }

    lowestBalances[sim] = lowestBalance;
  }

  // Calculate percentiles for each day
  const probabilisticDays = calculatePercentiles(
    balanceMatrix,
    baseDays,
    simulationCount,
    forecastDays
  );

  // Calculate risk metrics
  const riskMetrics = calculateRiskMetrics(
    balanceMatrix,
    lowestBalances,
    safetyBuffer,
    simulationCount,
    forecastDays
  );

  const computeTimeMs = performance.now() - startTime;

  return {
    days: probabilisticDays,
    riskMetrics,
    simulationCount,
    computeTimeMs,
  };
}

/**
 * Calculate percentiles (P10, P50, P90) for each day from simulation results.
 */
function calculatePercentiles(
  balanceMatrix: number[][],
  baseDays: CalendarDay[],
  simulationCount: number,
  forecastDays: number
): ProbabilisticDay[] {
  const results: ProbabilisticDay[] = [];

  // Pre-allocate scratch array for sorting
  const scratch = new Array<number>(simulationCount);

  for (let day = 0; day < forecastDays; day++) {
    // Collect all balances for this day
    for (let sim = 0; sim < simulationCount; sim++) {
      scratch[sim] = balanceMatrix[sim]![day]!;
    }

    // Sort for percentile calculation (quickselect would be faster but this is simpler)
    scratch.sort((a, b) => a - b);

    const p10Index = Math.floor(simulationCount * 0.1);
    const p50Index = Math.floor(simulationCount * 0.5);
    const p90Index = Math.floor(simulationCount * 0.9);

    results.push({
      date: baseDays[day]!.date,
      p10: scratch[p10Index]!,
      p50: scratch[p50Index]!,
      p90: scratch[p90Index]!,
    });
  }

  return results;
}

/**
 * Calculate risk metrics from simulation results.
 */
function calculateRiskMetrics(
  balanceMatrix: number[][],
  lowestBalances: number[],
  safetyBuffer: number,
  simulationCount: number,
  forecastDays: number
): RiskMetrics {
  // Count simulations that went below zero or buffer
  let belowZeroCount = 0;
  let belowBufferCount = 0;
  let totalDaysAtRisk = 0;

  for (let sim = 0; sim < simulationCount; sim++) {
    let wentBelowZero = false;
    let wentBelowBuffer = false;
    let daysAtRisk = 0;

    for (let day = 0; day < forecastDays; day++) {
      const balance = balanceMatrix[sim]![day]!;

      if (balance < 0) {
        wentBelowZero = true;
      }
      if (balance < safetyBuffer) {
        wentBelowBuffer = true;
        daysAtRisk++;
      }
    }

    if (wentBelowZero) belowZeroCount++;
    if (wentBelowBuffer) belowBufferCount++;
    totalDaysAtRisk += daysAtRisk;
  }

  // Sort lowest balances for percentile
  const sortedLowest = [...lowestBalances].sort((a, b) => a - b);
  const p10Index = Math.floor(simulationCount * 0.1);
  const meanLowest =
    lowestBalances.reduce((sum, b) => sum + b, 0) / simulationCount;

  return {
    probabilityBelowZero: belowZeroCount / simulationCount,
    probabilityBelowBuffer: belowBufferCount / simulationCount,
    expectedLowestBalance: meanLowest,
    worstCaseBalance: sortedLowest[p10Index]!,
    expectedDaysAtRisk: totalDaysAtRisk / simulationCount,
  };
}
