/**
 * Time Entry Calculation Utilities
 *
 * Helpers for calculating totals, grouping, and summarizing time entries.
 */

import type { TimeEntry, TimeEntrySummary } from '@/lib/types/time';
import { calculateBillableAmount } from '@/lib/types/time';

/**
 * Calculate totals for a list of time entries
 */
export function calculateTotals(entries: TimeEntry[]): TimeEntrySummary {
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
 * Group time entries by date (YYYY-MM-DD)
 */
export function groupByDate(entries: TimeEntry[]): Map<string, TimeEntry[]> {
  const groups = new Map<string, TimeEntry[]>();

  for (const entry of entries) {
    const date = new Date(entry.start_time);
    const key = date.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD
    const existing = groups.get(key) || [];
    existing.push(entry);
    groups.set(key, existing);
  }

  return groups;
}

/**
 * Get unique client names from entries
 */
export function getUniqueClients(entries: TimeEntry[]): string[] {
  const clients = new Set<string>();

  for (const entry of entries) {
    if (entry.client_name) {
      clients.add(entry.client_name);
    }
  }

  return Array.from(clients).sort();
}

/**
 * Get unique project names from entries
 */
export function getUniqueProjects(entries: TimeEntry[]): string[] {
  const projects = new Set<string>();

  for (const entry of entries) {
    projects.add(entry.project_name);
  }

  return Array.from(projects).sort();
}

/**
 * Filter entries by client name
 */
export function filterByClient(
  entries: TimeEntry[],
  clientName: string | null
): TimeEntry[] {
  if (!clientName) return entries;
  return entries.filter((e) => e.client_name === clientName);
}

/**
 * Filter entries by date range
 */
export function filterByDateRange(
  entries: TimeEntry[],
  startDate: string | null,
  endDate: string | null
): TimeEntry[] {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.start_time);
    entryDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (entryDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (entryDate > end) return false;
    }

    return true;
  });
}

/**
 * Filter entries by invoiced status
 */
export function filterByInvoiced(
  entries: TimeEntry[],
  isInvoiced: boolean | null
): TimeEntry[] {
  if (isInvoiced === null) return entries;
  return entries.filter((e) => e.is_invoiced === isInvoiced);
}

/**
 * Get entries for this week
 */
export function getThisWeekEntries(entries: TimeEntry[]): TimeEntry[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  return entries.filter((entry) => {
    const entryDate = new Date(entry.start_time);
    return entryDate >= startOfWeek;
  });
}

/**
 * Get entries for today
 */
export function getTodayEntries(entries: TimeEntry[]): TimeEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return entries.filter((entry) => {
    const entryDate = new Date(entry.start_time);
    return entryDate >= today && entryDate < tomorrow;
  });
}

/**
 * Sort entries by start time (newest first)
 */
export function sortByStartTime(
  entries: TimeEntry[],
  order: 'asc' | 'desc' = 'desc'
): TimeEntry[] {
  return [...entries].sort((a, b) => {
    const timeA = new Date(a.start_time).getTime();
    const timeB = new Date(b.start_time).getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

/**
 * Prepare time entries for invoice line items
 * Groups by project and calculates totals per project
 */
export function prepareForInvoice(
  entries: TimeEntry[]
): Array<{
  description: string;
  quantity: number; // hours
  unit_price: number; // hourly rate
  amount: number;
  time_entry_ids: string[];
}> {
  // Group by project name + hourly rate combo
  const groups = new Map<
    string,
    {
      description: string;
      totalMinutes: number;
      hourlyRate: number;
      entryIds: string[];
    }
  >();

  for (const entry of entries) {
    if (!entry.is_billable || entry.is_invoiced) continue;

    const key = `${entry.project_name}|${entry.hourly_rate}`;
    const existing = groups.get(key);

    if (existing) {
      existing.totalMinutes += entry.duration_minutes || 0;
      existing.entryIds.push(entry.id);
    } else {
      groups.set(key, {
        description: entry.project_name,
        totalMinutes: entry.duration_minutes || 0,
        hourlyRate: entry.hourly_rate,
        entryIds: [entry.id],
      });
    }
  }

  // Convert to invoice line items
  return Array.from(groups.values()).map((group) => {
    const hours = group.totalMinutes / 60;
    return {
      description: group.description,
      quantity: Math.round(hours * 100) / 100, // Round to 2 decimals
      unit_price: group.hourlyRate,
      amount: Math.round(hours * group.hourlyRate * 100) / 100,
      time_entry_ids: group.entryIds,
    };
  });
}
