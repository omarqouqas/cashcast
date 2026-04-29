/**
 * Types and constants for automated payment reminders
 */

export type ReminderType = 'friendly' | 'firm' | 'final';
export type ReminderSource = 'manual' | 'auto';

/**
 * Reminder stages for automated reminders
 * - pre_due_3: 3 days before due date
 * - due_day: On the due date
 * - overdue_7: 7 days after due date
 * - overdue_14: 14 days after due date
 */
export type ReminderStage = 'pre_due_3' | 'due_day' | 'overdue_7' | 'overdue_14';

/**
 * Configuration for the reminder schedule
 */
export interface ReminderScheduleConfig {
  /** Days before due date to send pre-due reminder (default: 3) */
  preDueDays: number;
  /** Whether to send a reminder on the due date (default: true) */
  dueDayEnabled: boolean;
  /** Days after due date to send overdue reminders (default: [7, 14]) */
  overdueDays: number[];
}

/**
 * Default reminder schedule configuration
 */
export const DEFAULT_REMINDER_SCHEDULE: ReminderScheduleConfig = {
  preDueDays: 3,
  dueDayEnabled: true,
  overdueDays: [7, 14],
};

/**
 * Maps reminder stages to their corresponding reminder types
 */
export const STAGE_TO_REMINDER_TYPE: Record<ReminderStage, ReminderType> = {
  pre_due_3: 'friendly',
  due_day: 'friendly',
  overdue_7: 'firm',
  overdue_14: 'final',
};

/**
 * All reminder stages in order
 */
export const ALL_REMINDER_STAGES: ReminderStage[] = [
  'pre_due_3',
  'due_day',
  'overdue_7',
  'overdue_14',
];

/**
 * Invoice data needed for reminder processing
 */
export interface InvoiceForReminder {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  currency: string;
  due_date: string;
  status: string | null;
  auto_reminders_enabled: boolean | null;
  reminder_count: number;
  last_reminder_at: string | null;
  user_id: string;
}

/**
 * User data needed for sending reminders
 */
export interface UserForReminder {
  userId: string;
  email: string;
  name: string | null;
  autoRemindersEnabled: boolean;
}

/**
 * Result of processing a single invoice for reminders
 */
export interface ReminderProcessResult {
  invoiceId: string;
  invoiceNumber: string;
  success: boolean;
  sent?: boolean;
  skipped?: boolean;
  stage?: ReminderStage;
  reason?: string;
  error?: string;
}
