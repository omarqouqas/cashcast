/**
 * Opportunity Alert Rule
 *
 * Triggers when there's a spending opportunity window (sustained surplus).
 */

import { format, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import type { AlertRule, AlertRuleResult, AlertContext } from '../types';

export const opportunityRule: AlertRule = {
  name: 'opportunity',

  check(context: AlertContext): AlertRuleResult {
    const { calendarDays, safetyBuffer, currency } = context;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look at the next 21 days
    const next21Days = calendarDays.slice(0, 21);

    if (next21Days.length < 7) {
      return { triggered: false };
    }

    // Calculate surplus threshold (2x safety buffer for "good" surplus)
    const surplusThreshold = safetyBuffer * 2;

    // Find consecutive days above surplus threshold
    let consecutiveDays = 0;
    let minBalanceInWindow = Infinity;
    let windowStartDate: Date | null = null;
    let windowEndDate: Date | null = null;

    for (const day of next21Days) {
      if (day.balance >= surplusThreshold) {
        if (consecutiveDays === 0) {
          windowStartDate = day.date;
        }
        consecutiveDays++;
        windowEndDate = day.date;
        minBalanceInWindow = Math.min(minBalanceInWindow, day.balance);
      } else {
        // Reset if we break the streak before 7 days
        if (consecutiveDays < 7) {
          consecutiveDays = 0;
          minBalanceInWindow = Infinity;
          windowStartDate = null;
          windowEndDate = null;
        } else {
          // We have a valid window, stop looking
          break;
        }
      }
    }

    // Need at least 7 consecutive days above threshold
    if (consecutiveDays < 7 || !windowStartDate || !windowEndDate) {
      return { triggered: false };
    }

    // Calculate safe discretionary amount (min balance - safety buffer)
    const safeToSpend = minBalanceInWindow - safetyBuffer;

    // Only alert if the opportunity is meaningful (> $500 or > 50% of safety buffer)
    const meaningfulThreshold = Math.max(500, safetyBuffer * 0.5);
    if (safeToSpend < meaningfulThreshold) {
      return { triggered: false };
    }

    // Also check for any overdraft risk - don't show opportunity if there's risk
    const hasOverdraftRisk = calendarDays.some((day) => day.balance < 0);
    const hasLowBalanceRisk = calendarDays
      .slice(0, 14)
      .some((day) => day.balance < safetyBuffer);

    if (hasOverdraftRisk || hasLowBalanceRisk) {
      return { triggered: false };
    }

    const daysUntilStart = differenceInDays(windowStartDate, today);
    const windowLength = differenceInDays(windowEndDate, windowStartDate) + 1;

    // Format message
    let message: string;
    if (daysUntilStart <= 0) {
      message = `You have a healthy buffer of ${formatCurrency(safeToSpend, currency)} available for the next ${windowLength} days. `;
    } else {
      message = `Starting ${format(windowStartDate, 'MMM d')}, you'll have a ${windowLength}-day window with ${formatCurrency(safeToSpend, currency)} in discretionary spending available. `;
    }

    message += 'This could be a good time for planned purchases or investments.';

    return {
      triggered: true,
      alert: {
        type: 'opportunity',
        priority: 'opportunity',
        title: `${formatCurrency(safeToSpend, currency)} available for spending`,
        message,
        actionUrl: '/dashboard/calendar',
        actionText: 'View forecast',
        dismissible: true,
        metadata: {
          windowStart: windowStartDate.toISOString(),
          windowEnd: windowEndDate.toISOString(),
          windowDays: windowLength,
          safeToSpend,
          minBalance: minBalanceInWindow,
        },
      },
    };
  },
};
