/**
 * Cash Crunch Alert Rule
 *
 * Triggers when projected balance drops below safety buffer within 14 days.
 */

import { format, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import type { AlertRule, AlertRuleResult, AlertContext } from '../types';

export const cashCrunchRule: AlertRule = {
  name: 'cash_crunch',

  check(context: AlertContext): AlertRuleResult {
    const { calendarDays, safetyBuffer, currency, riskMetrics } = context;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look at the next 14 days
    const next14Days = calendarDays.slice(0, 14);

    // Find the first day where balance drops below safety buffer
    const crunchDay = next14Days.find((day) => day.balance < safetyBuffer);

    if (!crunchDay) {
      return { triggered: false };
    }

    const daysUntilCrunch = differenceInDays(crunchDay.date, today);
    const isOverdraft = crunchDay.balance < 0;

    // Determine priority based on severity
    const priority = isOverdraft ? 'critical' : 'warning';

    // Find what bills are due around that time
    const billsAroundCrunch = next14Days
      .filter((day) => {
        const dayDiff = differenceInDays(day.date, crunchDay.date);
        return dayDiff >= -2 && dayDiff <= 2;
      })
      .flatMap((day) => day.bills)
      .slice(0, 3);

    const billsList = billsAroundCrunch
      .map((b) => `${b.name} (${formatCurrency(b.amount, currency)})`)
      .join(', ');

    // Build message
    let message: string;
    if (isOverdraft) {
      message = `Your balance will drop to ${formatCurrency(crunchDay.balance, currency)} on ${format(crunchDay.date, 'MMMM d')}. `;
      if (billsList) {
        message += `Bills due around this time: ${billsList}. `;
      }
      message += 'Consider delaying non-essential expenses or moving income earlier.';
    } else {
      message = `Your balance will be ${formatCurrency(crunchDay.balance, currency)} on ${format(crunchDay.date, 'MMMM d')}, below your ${formatCurrency(safetyBuffer, currency)} safety buffer. `;
      if (billsList) {
        message += `Upcoming bills: ${billsList}.`;
      }
    }

    // Add Monte Carlo context if available
    if (riskMetrics && riskMetrics.probabilityBelowZero > 0.1) {
      const percent = Math.round(riskMetrics.probabilityBelowZero * 100);
      message += ` There's a ${percent}% chance of overdraft based on timing variations.`;
    }

    return {
      triggered: true,
      alert: {
        type: 'cash_crunch',
        priority,
        title: isOverdraft
          ? `Overdraft risk on ${format(crunchDay.date, 'MMM d')}`
          : `Low balance on ${format(crunchDay.date, 'MMM d')}`,
        message,
        actionUrl: '/dashboard/calendar',
        actionText: 'View forecast',
        dismissible: !isOverdraft,
        metadata: {
          crunchDate: crunchDay.date.toISOString(),
          projectedBalance: crunchDay.balance,
          daysUntil: daysUntilCrunch,
          isOverdraft,
        },
      },
    };
  },
};
