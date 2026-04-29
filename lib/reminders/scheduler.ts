import 'server-only';

import {
  type ReminderStage,
  type ReminderType,
  type ReminderScheduleConfig,
  DEFAULT_REMINDER_SCHEDULE,
  STAGE_TO_REMINDER_TYPE,
} from './types';

/**
 * Calculate the number of days between two dates (ignoring time)
 * Positive = future, Negative = past
 */
function daysDifference(from: Date, to: Date): number {
  // Normalize both dates to midnight UTC for accurate day comparison
  const fromMidnight = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()));
  const toMidnight = new Date(Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()));
  const diffMs = toMidnight.getTime() - fromMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Parse a due date string (YYYY-MM-DD) into a Date object
 * Uses noon to avoid timezone edge cases
 */
function parseDueDate(dueDateStr: string): Date {
  const [year, month, day] = dueDateStr.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid due date format: ${dueDateStr}`);
  }
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Determine which reminder stage (if any) should be sent today for an invoice
 *
 * @param dueDate - The invoice due date (YYYY-MM-DD format)
 * @param sentStages - Array of stages that have already been sent
 * @param config - Reminder schedule configuration
 * @param today - Current date (defaults to now)
 * @returns The stage to send and its type, or null if no reminder is due
 */
export function getReminderStageForToday(
  dueDate: string,
  sentStages: string[],
  config: ReminderScheduleConfig = DEFAULT_REMINDER_SCHEDULE,
  today: Date = new Date()
): { stage: ReminderStage; type: ReminderType } | null {
  const dueDateObj = parseDueDate(dueDate);
  const daysUntilDue = daysDifference(today, dueDateObj);

  // Check each possible stage in order of urgency (most urgent first)

  // 1. Check pre-due reminder (e.g., 3 days before)
  if (config.preDueDays > 0 && daysUntilDue === config.preDueDays) {
    const stage: ReminderStage = 'pre_due_3';
    if (!sentStages.includes(stage)) {
      return { stage, type: STAGE_TO_REMINDER_TYPE[stage] };
    }
  }

  // 2. Check due day reminder
  if (config.dueDayEnabled && daysUntilDue === 0) {
    const stage: ReminderStage = 'due_day';
    if (!sentStages.includes(stage)) {
      return { stage, type: STAGE_TO_REMINDER_TYPE[stage] };
    }
  }

  // 3. Check overdue reminders
  if (daysUntilDue < 0) {
    const daysOverdue = Math.abs(daysUntilDue);

    for (const overdueDays of config.overdueDays) {
      if (daysOverdue === overdueDays) {
        const stage = `overdue_${overdueDays}` as ReminderStage;
        if (!sentStages.includes(stage)) {
          // Map to appropriate reminder type based on severity
          const type: ReminderType =
            overdueDays >= 14 ? 'final' : overdueDays >= 7 ? 'firm' : 'friendly';
          return { stage, type };
        }
      }
    }
  }

  return null;
}

/**
 * Check if an invoice is eligible for auto-reminders
 */
export function isInvoiceEligibleForReminders(invoice: {
  status: string | null;
  client_email: string | null;
  auto_reminders_enabled: boolean | null;
}): { eligible: boolean; reason?: string } {
  const status = invoice.status ?? 'draft';

  // Must be sent or viewed (not draft or paid)
  if (status === 'draft') {
    return { eligible: false, reason: 'Invoice is still a draft' };
  }
  if (status === 'paid') {
    return { eligible: false, reason: 'Invoice is already paid' };
  }

  // Must have client email
  if (!invoice.client_email?.trim()) {
    return { eligible: false, reason: 'No client email' };
  }

  // Check per-invoice override (null = inherit from user setting)
  if (invoice.auto_reminders_enabled === false) {
    return { eligible: false, reason: 'Auto-reminders disabled for this invoice' };
  }

  return { eligible: true };
}
