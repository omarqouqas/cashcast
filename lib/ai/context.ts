/**
 * User financial context fetching for AI Natural Language Queries.
 * Fetches and formats user financial data for the LLM system prompt.
 */

import { createClient } from '@/lib/supabase/server';
import generateCalendar from '@/lib/calendar/generate';
import { formatCurrency } from '@/lib/utils/format';
import type { UserFinancialData, UserFinancialContext } from './types';

/**
 * Fetch all financial data for a user from the database.
 */
export async function fetchUserFinancialData(
  userId: string
): Promise<UserFinancialData> {
  const supabase = await createClient();

  // Fetch all data in parallel for performance
  const [accountsResult, incomeResult, billsResult, invoicesResult, settingsResult] =
    await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId),
      supabase
        .from('income')
        .select('*')
        .eq('user_id', userId)
        .or('is_active.is.null,is_active.eq.true'),
      supabase
        .from('bills')
        .select('*')
        .eq('user_id', userId)
        .or('is_active.is.null,is_active.eq.true'),
      supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['draft', 'sent', 'viewed', 'overdue']),
      supabase
        .from('user_settings')
        .select('currency, safety_buffer, timezone, tax_rate, tax_tracking_enabled')
        .eq('user_id', userId)
        .single(),
    ]);

  const accounts = accountsResult.data ?? [];
  const income = incomeResult.data ?? [];
  const bills = billsResult.data ?? [];
  const invoices = invoicesResult.data ?? [];
  const settings = settingsResult.data ?? {
    currency: 'USD',
    safety_buffer: 500,
    timezone: null,
    tax_rate: null,
    tax_tracking_enabled: null,
  };

  return {
    accounts,
    income,
    bills,
    invoices,
    settings: {
      currency: settings.currency ?? 'USD',
      safety_buffer: settings.safety_buffer ?? 500,
      timezone: settings.timezone ?? null,
      tax_rate: settings.tax_rate ?? null,
      tax_tracking_enabled: settings.tax_tracking_enabled ?? null,
    },
  };
}

/**
 * Build a formatted financial context object for the system prompt.
 */
export function buildFinancialContext(
  userId: string,
  data: UserFinancialData
): UserFinancialContext {
  const { accounts, income, bills, invoices, settings } = data;
  const currency = settings.currency;

  // Calculate spendable balance
  const spendableAccounts = accounts.filter((a) => a.is_spendable !== false);
  const spendableBalance = spendableAccounts.reduce(
    (sum, a) => sum + a.current_balance,
    0
  );
  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);

  // Generate calendar for forecast data
  let safeToSpend = 0;
  let lowestBalanceAmount = spendableBalance;
  let lowestBalanceDate = new Date().toISOString().split('T')[0] ?? '';

  try {
    const calendar = generateCalendar(
      accounts,
      income,
      bills,
      settings.safety_buffer,
      settings.timezone ?? undefined,
      60
    );
    safeToSpend = calendar.safeToSpend;
    lowestBalanceAmount = calendar.lowestBalance;
    lowestBalanceDate = calendar.lowestBalanceDay.toISOString().split('T')[0] ?? '';
  } catch {
    // Calendar generation might fail with empty data
  }

  // Format accounts summary
  const accountsSummary =
    accounts.length === 0
      ? 'No accounts configured.'
      : accounts
          .map((a) => {
            const type = a.account_type ?? 'account';
            const spendable = a.is_spendable !== false ? '' : ' (non-spendable)';
            return `- ${a.name} (${type}${spendable}): ${formatCurrency(a.current_balance, currency)}`;
          })
          .join('\n');

  // Format upcoming bills (next 30 days)
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  const upcomingBillsList = bills
    .filter((b) => {
      if (!b.due_date) return false;
      const dueDate = new Date(b.due_date + 'T12:00:00');
      return dueDate >= today && dueDate <= thirtyDaysLater;
    })
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
    .slice(0, 10);

  const upcomingBills =
    upcomingBillsList.length === 0
      ? 'No bills due in the next 30 days.'
      : upcomingBillsList
          .map(
            (b) =>
              `- ${b.name}: ${formatCurrency(b.amount, currency)} due ${b.due_date}`
          )
          .join('\n');

  // Format upcoming income (next 30 days)
  const upcomingIncomeList = income
    .filter((i) => {
      if (!i.next_date) return false;
      const nextDate = new Date(i.next_date + 'T12:00:00');
      return nextDate >= today && nextDate <= thirtyDaysLater;
    })
    .sort((a, b) => (a.next_date ?? '').localeCompare(b.next_date ?? ''))
    .slice(0, 10);

  const upcomingIncome =
    upcomingIncomeList.length === 0
      ? 'No income expected in the next 30 days.'
      : upcomingIncomeList
          .map(
            (i) =>
              `- ${i.name}: ${formatCurrency(i.amount, currency)} expected ${i.next_date}`
          )
          .join('\n');

  // Format outstanding invoices
  const outstandingInvoicesList = invoices
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
    .slice(0, 5);

  const outstandingInvoices =
    outstandingInvoicesList.length === 0
      ? 'No outstanding invoices.'
      : outstandingInvoicesList
          .map((inv) => {
            const status = inv.status === 'overdue' ? ' (OVERDUE)' : '';
            return `- ${inv.client_name}: ${formatCurrency(inv.amount, currency)} due ${inv.due_date}${status}`;
          })
          .join('\n');

  return {
    userId,
    currency,
    timezone: settings.timezone,
    safetyBuffer: settings.safety_buffer,
    taxRate: settings.tax_rate,
    spendableBalance,
    totalBalance,
    safeToSpend,
    lowestBalanceAmount,
    lowestBalanceDate,
    accountsSummary,
    upcomingBills,
    upcomingIncome,
    outstandingInvoices,
  };
}
