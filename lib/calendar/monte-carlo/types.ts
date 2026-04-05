/**
 * Type definitions for Monte Carlo probabilistic forecasting.
 */

/**
 * Represents a single day's probabilistic balance forecast.
 */
export interface ProbabilisticDay {
  /** The date for this forecast day */
  date: Date;
  /** 10th percentile balance (pessimistic scenario) */
  p10: number;
  /** 50th percentile balance (median/expected) */
  p50: number;
  /** 90th percentile balance (optimistic scenario) */
  p90: number;
}

/**
 * Risk metrics calculated from Monte Carlo simulation.
 */
export interface RiskMetrics {
  /** Probability (0-1) of balance dropping below zero */
  probabilityBelowZero: number;
  /** Probability (0-1) of balance dropping below safety buffer */
  probabilityBelowBuffer: number;
  /** Expected (mean) lowest balance across all simulations */
  expectedLowestBalance: number;
  /** Worst case (P10) lowest balance */
  worstCaseBalance: number;
  /** Number of days expected to be below safety buffer */
  expectedDaysAtRisk: number;
}

/**
 * Complete result from Monte Carlo simulation.
 */
export interface MonteCarloResult {
  /** Probabilistic forecast for each day */
  days: ProbabilisticDay[];
  /** Calculated risk metrics */
  riskMetrics: RiskMetrics;
  /** Number of simulations run */
  simulationCount: number;
  /** Time taken to run simulations (ms) */
  computeTimeMs: number;
}

/**
 * Configuration for running Monte Carlo simulation.
 */
export interface MonteCarloConfig {
  /** Number of simulation iterations (default: 500) */
  simulationCount?: number;
  /** User's safety buffer amount */
  safetyBuffer: number;
  /** Optional seed for reproducible results */
  seed?: number;
  /** Number of days to forecast (default: 60) */
  forecastDays?: number;
}

/**
 * Variance parameters for a transaction type.
 */
export interface VarianceParams {
  /** Coefficient of variation for amount (0-1, e.g., 0.1 = 10%) */
  amountCV: number;
  /** Maximum days to shift timing (uniform distribution) */
  timingDays: number;
}
