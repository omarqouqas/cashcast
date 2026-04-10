/**
 * Client Payment History Aggregation
 *
 * Analyzes paid invoices to build a payment profile for each client.
 */

import { differenceInDays, parseISO } from 'date-fns';
import type {
  ClientPaymentHistory,
  InvoiceForRisk,
  PaymentTrend,
} from './types';

/**
 * Get payment history for a specific client based on their past invoices.
 *
 * @param allInvoices - All invoices for the user
 * @param clientName - Client name to filter by
 * @param clientEmail - Client email to filter by (optional)
 * @returns Client payment history or null if no history
 */
export function getClientPaymentHistory(
  allInvoices: InvoiceForRisk[],
  clientName: string,
  clientEmail: string | null
): ClientPaymentHistory | null {
  // Filter invoices for this client
  const clientInvoices = allInvoices.filter((inv) =>
    matchesClient(inv, clientName, clientEmail)
  );

  if (clientInvoices.length === 0) {
    return null;
  }

  // Get paid invoices with valid dates
  const paidInvoices = clientInvoices.filter(
    (inv) => inv.status === 'paid' && inv.paid_at
  );

  // Calculate metrics
  const totalInvoices = clientInvoices.length;
  const paidCount = paidInvoices.length;

  // Calculate average days to payment and average days late
  const paymentMetrics = calculatePaymentMetrics(paidInvoices);

  // Detect payment trend from recent invoices
  const paymentTrend = detectPaymentTrend(paidInvoices);

  // Find most recent payment date
  const lastPaymentDate = getLastPaymentDate(paidInvoices);

  // Calculate average invoice amount
  const avgInvoiceAmount = calculateAverageAmount(clientInvoices);

  return {
    clientName,
    clientEmail,
    totalInvoices,
    paidInvoices: paidCount,
    avgDaysToPayment: paymentMetrics.avgDaysToPayment,
    avgDaysLate: paymentMetrics.avgDaysLate,
    paymentTrend,
    lastPaymentDate,
    avgInvoiceAmount,
  };
}

/**
 * Check if an invoice matches the given client.
 */
function matchesClient(
  invoice: InvoiceForRisk,
  clientName: string,
  clientEmail: string | null
): boolean {
  // Name must match (case-insensitive)
  const nameMatches =
    invoice.client_name.toLowerCase() === clientName.toLowerCase();

  // If email provided for both, must also match
  if (clientEmail && invoice.client_email) {
    return (
      nameMatches &&
      invoice.client_email.toLowerCase() === clientEmail.toLowerCase()
    );
  }

  // Otherwise just match by name
  return nameMatches;
}

/**
 * Calculate payment timing metrics from paid invoices.
 */
function calculatePaymentMetrics(paidInvoices: InvoiceForRisk[]): {
  avgDaysToPayment: number;
  avgDaysLate: number;
} {
  if (paidInvoices.length === 0) {
    return { avgDaysToPayment: 0, avgDaysLate: 0 };
  }

  let totalDaysToPayment = 0;
  let totalDaysLate = 0;
  let validCount = 0;

  for (const inv of paidInvoices) {
    const sentDate = inv.sent_at ? parseISO(inv.sent_at) : null;
    const paidDate = inv.paid_at ? parseISO(inv.paid_at) : null;
    const dueDate = inv.due_date ? parseISO(inv.due_date) : null;

    if (paidDate) {
      // Days to payment (from sent or created)
      const startDate = sentDate || (inv.created_at ? parseISO(inv.created_at) : null);
      if (startDate) {
        totalDaysToPayment += differenceInDays(paidDate, startDate);
      }

      // Days late (from due date)
      if (dueDate) {
        totalDaysLate += differenceInDays(paidDate, dueDate);
      }

      validCount++;
    }
  }

  if (validCount === 0) {
    return { avgDaysToPayment: 0, avgDaysLate: 0 };
  }

  return {
    avgDaysToPayment: Math.round(totalDaysToPayment / validCount),
    avgDaysLate: Math.round(totalDaysLate / validCount),
  };
}

/**
 * Detect payment trend from recent invoices.
 * Compares the most recent 3 invoices to earlier ones.
 */
function detectPaymentTrend(paidInvoices: InvoiceForRisk[]): PaymentTrend {
  if (paidInvoices.length < 2) {
    return 'stable';
  }

  // Sort by paid_at descending (most recent first)
  const sorted = [...paidInvoices]
    .filter((inv) => inv.paid_at)
    .sort((a, b) => {
      const dateA = parseISO(a.paid_at!);
      const dateB = parseISO(b.paid_at!);
      return dateB.getTime() - dateA.getTime();
    });

  if (sorted.length < 2) {
    return 'stable';
  }

  // Calculate days late for recent vs older invoices
  const recentCount = Math.min(3, Math.floor(sorted.length / 2));
  const recent = sorted.slice(0, recentCount);
  const older = sorted.slice(recentCount);

  if (older.length === 0) {
    return 'stable';
  }

  const recentAvgLate = calculateAverageDaysLate(recent);
  const olderAvgLate = calculateAverageDaysLate(older);

  const improvement = olderAvgLate - recentAvgLate;

  // Threshold: 3 days difference to be considered a trend
  if (improvement > 3) {
    return 'improving';
  } else if (improvement < -3) {
    return 'worsening';
  }

  return 'stable';
}

/**
 * Calculate average days late for a set of invoices.
 */
function calculateAverageDaysLate(invoices: InvoiceForRisk[]): number {
  if (invoices.length === 0) return 0;

  let total = 0;
  let count = 0;

  for (const inv of invoices) {
    if (inv.paid_at && inv.due_date) {
      total += differenceInDays(parseISO(inv.paid_at), parseISO(inv.due_date));
      count++;
    }
  }

  return count > 0 ? total / count : 0;
}

/**
 * Get the most recent payment date.
 */
function getLastPaymentDate(paidInvoices: InvoiceForRisk[]): string | null {
  const dates = paidInvoices
    .filter((inv) => inv.paid_at)
    .map((inv) => inv.paid_at!)
    .sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());

  return dates[0] || null;
}

/**
 * Calculate average invoice amount for a client.
 */
function calculateAverageAmount(invoices: InvoiceForRisk[]): number {
  if (invoices.length === 0) return 0;

  const total = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  return total / invoices.length;
}

/**
 * Get all unique clients from a set of invoices.
 * Returns array of { clientName, clientEmail } tuples.
 */
export function getUniqueClients(
  invoices: InvoiceForRisk[]
): Array<{ clientName: string; clientEmail: string | null }> {
  const clientMap = new Map<string, { clientName: string; clientEmail: string | null }>();

  for (const inv of invoices) {
    const key = `${inv.client_name.toLowerCase()}|${(inv.client_email || '').toLowerCase()}`;
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        clientName: inv.client_name,
        clientEmail: inv.client_email,
      });
    }
  }

  return Array.from(clientMap.values());
}
