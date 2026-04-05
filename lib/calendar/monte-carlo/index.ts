/**
 * Monte Carlo probabilistic forecasting module.
 *
 * This module provides probabilistic cash flow forecasting by running
 * Monte Carlo simulations with varied income/expense amounts and timing.
 *
 * @example
 * ```typescript
 * import { runMonteCarloSimulation } from '@/lib/calendar/monte-carlo';
 *
 * const calendarData = generateCalendar(accounts, income, bills, safetyBuffer);
 * const mcResult = runMonteCarloSimulation(calendarData, {
 *   safetyBuffer: 500,
 *   simulationCount: 500,
 * });
 *
 * console.log(`${(mcResult.riskMetrics.probabilityBelowZero * 100).toFixed(0)}% chance of overdraft`);
 * ```
 */

export { runMonteCarloSimulation } from './simulation';

export type {
  MonteCarloResult,
  MonteCarloConfig,
  ProbabilisticDay,
  RiskMetrics,
  VarianceParams,
} from './types';

export {
  getIncomeVariance,
  getBillVariance,
  INCOME_VARIANCE,
  BILL_VARIANCE,
} from './variance-config';
