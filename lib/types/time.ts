/**
 * Time Tracking Types
 *
 * Type definitions for time entries, settings, and invoice line items.
 */

/**
 * Time Entry from database
 */
export interface TimeEntry {
  id: string;
  user_id: string;
  project_name: string;
  client_name: string | null;
  description: string | null;
  start_time: string; // ISO timestamp
  end_time: string | null; // ISO timestamp, null if timer is running
  duration_minutes: number | null;
  hourly_rate: number;
  is_billable: boolean;
  is_invoiced: boolean;
  invoice_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Time Entry for creation (without auto-generated fields)
 */
export interface TimeEntryInsert {
  project_name: string;
  client_name?: string | null;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  duration_minutes?: number | null;
  hourly_rate: number;
  is_billable?: boolean;
}

/**
 * Time Entry for updates
 */
export interface TimeEntryUpdate {
  project_name?: string;
  client_name?: string | null;
  description?: string | null;
  start_time?: string;
  end_time?: string | null;
  duration_minutes?: number | null;
  hourly_rate?: number;
  is_billable?: boolean;
  is_invoiced?: boolean;
  invoice_id?: string | null;
}

/**
 * Invoice Line Item from database
 */
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  time_entry_id: string | null;
  sort_order: number;
  created_at: string;
}

/**
 * Invoice Line Item for creation
 */
export interface InvoiceItemInsert {
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  time_entry_id?: string | null;
  sort_order?: number;
}

/**
 * User Time Settings
 */
export interface UserTimeSettings {
  user_id: string;
  default_hourly_rate: number;
  round_to_minutes: 1 | 5 | 15 | 30;
  default_billable: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Timer state for the running timer
 */
export interface TimerState {
  isRunning: boolean;
  projectName: string;
  clientName: string;
  startTime: string | null; // ISO timestamp
  elapsedSeconds: number;
}

/**
 * Time entry with calculated billable amount
 */
export interface TimeEntryWithAmount extends TimeEntry {
  billable_amount: number;
}

/**
 * Summary of time entries for a period
 */
export interface TimeEntrySummary {
  total_minutes: number;
  total_hours: number;
  total_amount: number;
  billable_minutes: number;
  billable_amount: number;
  entry_count: number;
  uninvoiced_minutes: number;
  uninvoiced_amount: number;
}

/**
 * Filter options for time entries
 */
export interface TimeEntryFilters {
  client_name?: string | null;
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  is_invoiced?: boolean | null;
  is_billable?: boolean | null;
}

/**
 * Calculate billable amount for a time entry
 */
export function calculateBillableAmount(entry: TimeEntry): number {
  if (!entry.is_billable || !entry.duration_minutes) return 0;
  const hours = entry.duration_minutes / 60;
  return hours * entry.hourly_rate;
}

/**
 * Calculate duration in minutes from start and end time
 */
export function calculateDurationMinutes(
  startTime: string,
  endTime: string,
  roundTo: 1 | 5 | 15 | 30 = 1
): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (roundTo === 1) return Math.round(diffMinutes);

  // Round up to nearest interval
  return Math.ceil(diffMinutes / roundTo) * roundTo;
}

/**
 * Summarize a list of time entries
 */
export function summarizeTimeEntries(entries: TimeEntry[]): TimeEntrySummary {
  let totalMinutes = 0;
  let totalAmount = 0;
  let billableMinutes = 0;
  let billableAmount = 0;
  let uninvoicedMinutes = 0;
  let uninvoicedAmount = 0;

  for (const entry of entries) {
    const minutes = entry.duration_minutes || 0;
    const amount = calculateBillableAmount(entry);

    totalMinutes += minutes;
    totalAmount += amount;

    if (entry.is_billable) {
      billableMinutes += minutes;
      billableAmount += amount;
    }

    if (!entry.is_invoiced && entry.is_billable) {
      uninvoicedMinutes += minutes;
      uninvoicedAmount += amount;
    }
  }

  return {
    total_minutes: totalMinutes,
    total_hours: totalMinutes / 60,
    total_amount: totalAmount,
    billable_minutes: billableMinutes,
    billable_amount: billableAmount,
    entry_count: entries.length,
    uninvoiced_minutes: uninvoicedMinutes,
    uninvoiced_amount: uninvoicedAmount,
  };
}

/**
 * Group time entries by client
 */
export function groupByClient(
  entries: TimeEntry[]
): Map<string, TimeEntry[]> {
  const groups = new Map<string, TimeEntry[]>();

  for (const entry of entries) {
    const key = entry.client_name || 'No Client';
    const existing = groups.get(key) || [];
    existing.push(entry);
    groups.set(key, existing);
  }

  return groups;
}

/**
 * Group time entries by project
 */
export function groupByProject(
  entries: TimeEntry[]
): Map<string, TimeEntry[]> {
  const groups = new Map<string, TimeEntry[]>();

  for (const entry of entries) {
    const key = entry.project_name;
    const existing = groups.get(key) || [];
    existing.push(entry);
    groups.set(key, existing);
  }

  return groups;
}
