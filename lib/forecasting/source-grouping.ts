/**
 * Source Grouping for Income Pattern Analysis
 *
 * Groups income from invoices and recurring entries into unified sources
 * for pattern analysis.
 */

import { parseISO } from 'date-fns';
import type {
  IncomePayment,
  IncomeSourceHistory,
  InvoiceForAnalysis,
  IncomeForAnalysis,
} from './types';

/**
 * Normalize a source identifier for consistent matching.
 */
function normalizeSourceId(name: string, email: string | null): string {
  const normalizedName = name.toLowerCase().trim();
  const normalizedEmail = email?.toLowerCase().trim() || '';
  return `${normalizedName}|${normalizedEmail}`;
}

/**
 * Group paid invoices by client to build payment history.
 *
 * @param invoices - All invoices for the user
 * @returns Map of sourceId to payment history
 */
export function groupInvoicesByClient(
  invoices: InvoiceForAnalysis[]
): Map<string, IncomeSourceHistory> {
  const sourceMap = new Map<string, IncomeSourceHistory>();

  // Filter to only paid invoices with valid paid_at
  const paidInvoices = invoices.filter(
    (inv) => inv.status === 'paid' && inv.paid_at
  );

  for (const invoice of paidInvoices) {
    const sourceId = normalizeSourceId(invoice.client_name, invoice.client_email);

    if (!sourceMap.has(sourceId)) {
      sourceMap.set(sourceId, {
        sourceId,
        name: invoice.client_name,
        email: invoice.client_email,
        payments: [],
      });
    }

    const source = sourceMap.get(sourceId)!;
    source.payments.push({
      id: invoice.id,
      amount: invoice.amount,
      date: parseISO(invoice.paid_at!),
      sourceId,
    });
  }

  // Sort payments by date for each source
  Array.from(sourceMap.values()).forEach((source) => {
    source.payments.sort((a: IncomePayment, b: IncomePayment) => a.date.getTime() - b.date.getTime());
  });

  return sourceMap;
}

/**
 * Extract payment history from recurring income records.
 * Uses last_date to infer historical payments based on frequency.
 *
 * Note: This is less accurate than invoice data since we're inferring
 * historical payments rather than tracking actual ones.
 *
 * @param incomeRecords - Income records for the user
 * @param existingSourceIds - Source IDs already captured from invoices (to avoid duplicates)
 * @returns Map of sourceId to payment history
 */
export function groupRecurringIncome(
  incomeRecords: IncomeForAnalysis[],
  existingSourceIds: Set<string>
): Map<string, IncomeSourceHistory> {
  const sourceMap = new Map<string, IncomeSourceHistory>();

  // Filter to active income that isn't linked to an invoice
  const standaloneIncome = incomeRecords.filter(
    (inc) => inc.is_active !== false && !inc.invoice_id
  );

  for (const income of standaloneIncome) {
    const sourceId = normalizeSourceId(income.name, null);

    // Skip if this source is already captured from invoices
    // (e.g., "Invoice: Acme Corp" would match "Acme Corp" client)
    if (existingSourceIds.has(sourceId)) {
      continue;
    }

    // For recurring income without historical tracking,
    // we can only use the current configuration
    // This provides limited pattern data but still useful for forecasting
    if (!sourceMap.has(sourceId)) {
      sourceMap.set(sourceId, {
        sourceId,
        name: income.name,
        email: null,
        payments: [],
      });
    }

    const source = sourceMap.get(sourceId)!;

    // If there's a last_date, we know at least one payment occurred
    if (income.last_date) {
      source.payments.push({
        id: `${income.id}-last`,
        amount: income.amount,
        date: parseISO(income.last_date),
        sourceId,
      });
    }

    // If there's a next_date in the past, it means a payment was expected
    // but this is less reliable so we skip it
  }

  // Sort payments by date
  Array.from(sourceMap.values()).forEach((source) => {
    source.payments.sort((a: IncomePayment, b: IncomePayment) => a.date.getTime() - b.date.getTime());
  });

  return sourceMap;
}

/**
 * Combine all income sources into a unified list for analysis.
 *
 * Priority:
 * 1. Invoice-based sources (most reliable - actual payment dates)
 * 2. Recurring income sources (less reliable - inferred from configuration)
 *
 * @param invoices - All invoices for the user
 * @param incomeRecords - All income records for the user
 * @returns Array of income source histories, sorted by total amount (primary sources first)
 */
export function groupAllIncomeSources(
  invoices: InvoiceForAnalysis[],
  incomeRecords: IncomeForAnalysis[]
): IncomeSourceHistory[] {
  // Group invoices by client
  const invoiceSources = groupInvoicesByClient(invoices);

  // Get existing source IDs to avoid duplicates
  const existingSourceIds = new Set(invoiceSources.keys());

  // Add recurring income sources (that aren't duplicates)
  const recurringSources = groupRecurringIncome(incomeRecords, existingSourceIds);

  // Combine all sources
  const allSources = [
    ...Array.from(invoiceSources.values()),
    ...Array.from(recurringSources.values()),
  ];

  // Sort by total payment amount (descending) - primary sources first
  allSources.sort((a: IncomeSourceHistory, b: IncomeSourceHistory) => {
    const totalA = a.payments.reduce((sum: number, p: IncomePayment) => sum + p.amount, 0);
    const totalB = b.payments.reduce((sum: number, p: IncomePayment) => sum + p.amount, 0);
    return totalB - totalA;
  });

  return allSources;
}

/**
 * Get all payments across all sources, sorted by date.
 * Used for overall trend and seasonality analysis.
 *
 * @param sources - Array of income source histories
 * @returns All payments sorted by date
 */
export function getAllPayments(sources: IncomeSourceHistory[]): IncomePayment[] {
  const allPayments = sources.flatMap((source) => source.payments);
  return allPayments.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Calculate the date range of payment history.
 *
 * @param payments - Array of payments
 * @returns Object with earliest, latest dates and months of data
 */
export function getPaymentDateRange(payments: IncomePayment[]): {
  earliest: Date | null;
  latest: Date | null;
  monthsOfData: number;
} {
  if (payments.length === 0) {
    return { earliest: null, latest: null, monthsOfData: 0 };
  }

  const sorted = [...payments].sort((a: IncomePayment, b: IncomePayment) => a.date.getTime() - b.date.getTime());
  const earliest = sorted[0]!.date;
  const latest = sorted[sorted.length - 1]!.date;

  // Calculate months between earliest and latest
  const monthsOfData = Math.max(
    1,
    Math.ceil(
      (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
  );

  return { earliest, latest, monthsOfData };
}
