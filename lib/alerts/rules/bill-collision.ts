/**
 * Bill Collision Alert Rule
 *
 * Triggers when 3+ bills land within a 2-day window.
 */

import { format, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import type { AlertRule, AlertRuleResult, AlertContext } from '../types';

interface BillGroup {
  startDate: Date;
  endDate: Date;
  bills: Array<{ name: string; amount: number; date: Date }>;
  totalAmount: number;
}

export const billCollisionRule: AlertRule = {
  name: 'bill_collision',

  check(context: AlertContext): AlertRuleResult {
    const { calendarDays, safetyBuffer, currency } = context;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look at the next 14 days
    const next14Days = calendarDays.slice(0, 14);

    // Collect all bills with their dates
    const allBills: Array<{ name: string; amount: number; date: Date }> = [];
    for (const day of next14Days) {
      for (const bill of day.bills) {
        allBills.push(bill);
      }
    }

    if (allBills.length < 3) {
      return { triggered: false };
    }

    // Sort bills by date
    allBills.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find groups of 3+ bills within 2-day windows
    const collisionGroups: BillGroup[] = [];

    for (let i = 0; i < allBills.length; i++) {
      const startBill = allBills[i]!;
      const windowBills = [startBill];

      for (let j = i + 1; j < allBills.length; j++) {
        const checkBill = allBills[j]!;
        const daysDiff = differenceInDays(checkBill.date, startBill.date);
        if (daysDiff <= 2) {
          windowBills.push(checkBill);
        } else {
          break;
        }
      }

      if (windowBills.length >= 3) {
        const lastBill = windowBills[windowBills.length - 1]!;
        collisionGroups.push({
          startDate: startBill.date,
          endDate: lastBill.date,
          bills: windowBills,
          totalAmount: windowBills.reduce((sum, b) => sum + b.amount, 0),
        });
        // Skip to avoid overlapping groups
        i += windowBills.length - 1;
      }
    }

    if (collisionGroups.length === 0) {
      return { triggered: false };
    }

    // Use the first (earliest) collision group
    const collision = collisionGroups[0]!;
    const daysUntil = differenceInDays(collision.startDate, today);

    // Check if balance can handle it - find the lowest balance during the collision window
    // Calendar balance already reflects bills paid, so we look at the end of the window
    const collisionWindowDays = calendarDays.filter((d) => {
      const dayTime = d.date.getTime();
      return dayTime >= collision.startDate.getTime() && dayTime <= collision.endDate.getTime();
    });
    const lowestBalanceInWindow = collisionWindowDays.length > 0
      ? Math.min(...collisionWindowDays.map((d) => d.balance))
      : 0;
    const isRisky = lowestBalanceInWindow < safetyBuffer;

    // Format date range
    const dateRange =
      collision.startDate.getTime() === collision.endDate.getTime()
        ? format(collision.startDate, 'MMMM d')
        : `${format(collision.startDate, 'MMM d')}-${format(collision.endDate, 'd')}`;

    // Build bill list
    const billNames = collision.bills
      .slice(0, 4)
      .map((b) => b.name)
      .join(', ');
    const moreCount = collision.bills.length - 4;
    const billsList = moreCount > 0 ? `${billNames}, and ${moreCount} more` : billNames;

    // Build message
    let message = `You have ${collision.bills.length} bills (${formatCurrency(collision.totalAmount, currency)}) landing ${dateRange}: ${billsList}. `;

    if (isRisky) {
      message += `Your balance will drop to ${formatCurrency(lowestBalanceInWindow, currency)} during this period, below your safety buffer. Consider spacing out payments if possible.`;
    } else {
      message += `Your balance can handle it, but it'll be a tight period.`;
    }

    return {
      triggered: true,
      alert: {
        type: 'bill_collision',
        priority: isRisky ? 'warning' : 'info',
        title: `${collision.bills.length} bills due ${dateRange}`,
        message,
        actionUrl: '/dashboard/bills',
        actionText: 'View bills',
        dismissible: true,
        metadata: {
          collisionDate: collision.startDate.toISOString(),
          billCount: collision.bills.length,
          totalAmount: collision.totalAmount,
          daysUntil,
          isRisky,
        },
      },
    };
  },
};
