/**
 * Alert Engine - Orchestrates alert rule evaluation.
 *
 * Runs all registered alert rules against user financial context
 * and returns prioritized, deduplicated alerts.
 */

import type { Alert, AlertContext, AlertRule, AlertPriority } from './types';
import {
  cashCrunchRule,
  billCollisionRule,
  invoiceRiskRule,
  opportunityRule,
} from './rules';

/**
 * Priority order for sorting alerts (lower = higher priority).
 */
const PRIORITY_ORDER: Record<AlertPriority, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  opportunity: 3,
};

/**
 * All registered alert rules in evaluation order.
 */
const ALERT_RULES: AlertRule[] = [
  cashCrunchRule,
  billCollisionRule,
  invoiceRiskRule,
  opportunityRule,
];

/**
 * Maximum number of alerts to return (to avoid overwhelming the UI).
 */
const MAX_ALERTS = 5;

/**
 * Generate alerts for a user based on their financial context.
 *
 * @param context - The user's financial context
 * @returns Array of prioritized alerts
 */
export function generateAlerts(context: AlertContext): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  // Run each rule and collect triggered alerts
  for (const rule of ALERT_RULES) {
    try {
      const result = rule.check(context);

      if (result.triggered && result.alert) {
        alerts.push({
          id: crypto.randomUUID(),
          createdAt: now,
          ...result.alert,
        });
      }
    } catch (error) {
      // Log error but continue with other rules
      console.error(`Alert rule "${rule.name}" failed:`, error);
    }
  }

  // Sort by priority (critical first)
  alerts.sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Within same priority, sort by creation time (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Limit total alerts
  return alerts.slice(0, MAX_ALERTS);
}

/**
 * Build alert context from raw data.
 *
 * Helper function to create AlertContext from typical dashboard data.
 */
export function buildAlertContext(params: {
  safetyBuffer: number;
  currency: string;
  calendarDays: Array<{
    date: Date;
    balance: number;
    income?: Array<{ name: string; amount: number; date: Date }>;
    bills?: Array<{ name: string; amount: number; date: Date }>;
  }>;
  riskMetrics?: {
    probabilityBelowZero: number;
    probabilityBelowBuffer: number;
    expectedLowestBalance: number;
    worstCaseBalance: number;
    expectedDaysAtRisk: number;
  };
  invoices?: Array<{
    id: string;
    client_name: string;
    amount: number;
    due_date: string;
    status: string | null;
  }>;
  bills?: Array<{
    id: string;
    name: string;
    amount: number;
    frequency: string;
    due_date: string | null;
  }>;
  income?: Array<{
    id: string;
    name: string;
    amount: number;
    frequency: string;
    next_date: string | null;
  }>;
}): AlertContext {
  return {
    safetyBuffer: params.safetyBuffer,
    currency: params.currency,
    calendarDays: params.calendarDays.map((day) => ({
      date: day.date,
      balance: day.balance,
      income: day.income ?? [],
      bills: day.bills ?? [],
    })),
    riskMetrics: params.riskMetrics,
    invoices: (params.invoices ?? []).map((inv) => ({
      id: inv.id,
      clientName: inv.client_name,
      amount: inv.amount,
      dueDate: inv.due_date,
      status: inv.status,
    })),
    bills: (params.bills ?? []).map((bill) => ({
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
      frequency: bill.frequency,
      dueDate: bill.due_date,
    })),
    income: (params.income ?? []).map((inc) => ({
      id: inc.id,
      name: inc.name,
      amount: inc.amount,
      frequency: inc.frequency,
      nextDate: inc.next_date,
    })),
  };
}
