/**
 * Invoice Risk Alert Rule
 *
 * Triggers when an invoice is overdue or at risk of being late.
 */

import { format, differenceInDays, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import type { AlertRule, AlertRuleResult, AlertContext } from '../types';

export const invoiceRiskRule: AlertRule = {
  name: 'invoice_risk',

  check(context: AlertContext): AlertRuleResult {
    const { invoices, currency } = context;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter to unpaid invoices
    const unpaidInvoices = invoices.filter(
      (inv) => inv.status !== 'paid' && inv.status !== 'cancelled'
    );

    if (unpaidInvoices.length === 0) {
      return { triggered: false };
    }

    // Find overdue invoices
    const overdueInvoices = unpaidInvoices.filter((inv) => {
      if (!inv.dueDate) return false;
      const dueDate = parseISO(inv.dueDate);
      return dueDate < today;
    });

    // Find invoices due within 3 days (at risk)
    const atRiskInvoices = unpaidInvoices.filter((inv) => {
      if (!inv.dueDate) return false;
      const dueDate = parseISO(inv.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    });

    // Prioritize overdue alerts
    if (overdueInvoices.length > 0) {
      const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      const oldestOverdue = overdueInvoices.reduce((oldest, inv) => {
        if (!oldest || !inv.dueDate) return inv;
        return parseISO(inv.dueDate) < parseISO(oldest.dueDate) ? inv : oldest;
      }, overdueInvoices[0]!);

      const daysOverdue = differenceInDays(today, parseISO(oldestOverdue.dueDate));

      let message: string;
      if (overdueInvoices.length === 1) {
        message = `Invoice for ${oldestOverdue.clientName} (${formatCurrency(oldestOverdue.amount, currency)}) is ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue. Consider sending a payment reminder.`;
      } else {
        message = `You have ${overdueInvoices.length} overdue invoices totaling ${formatCurrency(totalOverdue, currency)}. The oldest is ${daysOverdue} days past due from ${oldestOverdue.clientName}.`;
      }

      return {
        triggered: true,
        alert: {
          type: 'invoice_risk',
          priority: daysOverdue > 14 ? 'critical' : 'warning',
          title:
            overdueInvoices.length === 1
              ? `Invoice overdue: ${oldestOverdue.clientName}`
              : `${overdueInvoices.length} invoices overdue`,
          message,
          actionUrl: '/dashboard/invoices',
          actionText: 'View invoices',
          dismissible: true,
          metadata: {
            overdueCount: overdueInvoices.length,
            totalOverdue,
            oldestDaysOverdue: daysOverdue,
          },
        },
      };
    }

    // Alert about at-risk invoices (due soon)
    if (atRiskInvoices.length > 0) {
      const soonestInvoice = atRiskInvoices.reduce((soonest, inv) => {
        if (!soonest || !inv.dueDate) return inv;
        return parseISO(inv.dueDate) < parseISO(soonest.dueDate) ? inv : soonest;
      }, atRiskInvoices[0]!);

      const daysUntilDue = differenceInDays(parseISO(soonestInvoice.dueDate), today);
      const totalAtRisk = atRiskInvoices.reduce((sum, inv) => sum + inv.amount, 0);

      let message: string;
      if (atRiskInvoices.length === 1) {
        message =
          daysUntilDue === 0
            ? `Invoice for ${soonestInvoice.clientName} (${formatCurrency(soonestInvoice.amount, currency)}) is due today.`
            : `Invoice for ${soonestInvoice.clientName} (${formatCurrency(soonestInvoice.amount, currency)}) is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}.`;
      } else {
        message = `You have ${atRiskInvoices.length} invoices (${formatCurrency(totalAtRisk, currency)}) due within the next 3 days.`;
      }

      return {
        triggered: true,
        alert: {
          type: 'invoice_risk',
          priority: 'info',
          title:
            daysUntilDue === 0
              ? `Invoice due today: ${soonestInvoice.clientName}`
              : `Invoice due ${format(parseISO(soonestInvoice.dueDate), 'MMM d')}`,
          message,
          actionUrl: '/dashboard/invoices',
          actionText: 'View invoices',
          dismissible: true,
          metadata: {
            atRiskCount: atRiskInvoices.length,
            totalAtRisk,
            daysUntilDue,
          },
        },
      };
    }

    return { triggered: false };
  },
};
