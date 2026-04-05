/**
 * Variance configuration for Monte Carlo simulation.
 *
 * These parameters define how much variability to apply to income and bills
 * based on their frequency. Higher variability for irregular income reflects
 * real-world uncertainty for freelancers.
 */

import type { VarianceParams } from './types';

/**
 * Income variance by frequency.
 *
 * - amountCV: Coefficient of Variation (standard deviation / mean)
 *   E.g., 0.10 means amount can vary ~10% from expected
 * - timingDays: Maximum days the payment might shift (+/-)
 */
export const INCOME_VARIANCE: Record<string, VarianceParams> = {
  // Salary-type income: very stable
  weekly: { amountCV: 0.02, timingDays: 0 },
  biweekly: { amountCV: 0.02, timingDays: 0 },

  // Monthly income: slight variation possible
  monthly: { amountCV: 0.05, timingDays: 1 },
  'semi-monthly': { amountCV: 0.05, timingDays: 1 },

  // Quarterly/annual: more variable
  quarterly: { amountCV: 0.10, timingDays: 3 },
  annually: { amountCV: 0.10, timingDays: 5 },

  // Freelance/invoice income: high variability
  'one-time': { amountCV: 0.15, timingDays: 7 },
  irregular: { amountCV: 0.25, timingDays: 10 },
};

/**
 * Bill variance by frequency.
 *
 * Bills are generally more predictable than income.
 * Amount variance is low (most bills are fixed), but timing can shift slightly.
 */
export const BILL_VARIANCE: Record<string, VarianceParams> = {
  // Regular bills: very predictable
  weekly: { amountCV: 0.01, timingDays: 0 },
  biweekly: { amountCV: 0.01, timingDays: 0 },
  monthly: { amountCV: 0.02, timingDays: 1 },
  'semi-monthly': { amountCV: 0.02, timingDays: 1 },
  quarterly: { amountCV: 0.03, timingDays: 2 },
  annually: { amountCV: 0.03, timingDays: 2 },
  'one-time': { amountCV: 0.05, timingDays: 3 },
};

/**
 * Special variance for credit card payments.
 * Amount varies more because it depends on spending patterns.
 */
export const CREDIT_CARD_VARIANCE: VarianceParams = {
  amountCV: 0.15,
  timingDays: 1,
};

/**
 * Default variance for unknown frequency types.
 */
export const DEFAULT_VARIANCE: VarianceParams = {
  amountCV: 0.10,
  timingDays: 2,
};

/**
 * Get variance parameters for an income item.
 */
export function getIncomeVariance(frequency: string): VarianceParams {
  return INCOME_VARIANCE[frequency] ?? DEFAULT_VARIANCE;
}

/**
 * Get variance parameters for a bill.
 */
export function getBillVariance(frequency: string): VarianceParams {
  return BILL_VARIANCE[frequency] ?? DEFAULT_VARIANCE;
}
