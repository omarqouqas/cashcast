import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { createAdminClient } from '@/lib/supabase/admin';
import {
  getReminderStageForToday,
  isInvoiceEligibleForReminders,
  sendAutoReminder,
  DEFAULT_REMINDER_SCHEDULE,
  type InvoiceForReminder,
  type ReminderProcessResult,
} from '@/lib/reminders';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to maintain constant time
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Process items with limited concurrency
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]!);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);
  return results;
}

interface UserWithInvoices {
  userId: string;
  email: string;
  name: string | null;
  invoices: InvoiceForReminder[];
}

// Types for query results (columns added by migration)
interface UserSettingsRow {
  user_id: string;
  auto_reminders_enabled: boolean | null;
}

interface InvoiceRow {
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

interface ReminderRow {
  reminder_stage: string | null;
}

export async function GET(request: NextRequest) {
  // 1. Validate CRON_SECRET bearer token
  const authHeader = request.headers.get('authorization') || '';
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || ''}`;
  if (!process.env.CRON_SECRET || !secureCompare(authHeader, expectedAuth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const supabase = createAdminClient();

  // 2. Get all users with auto_reminders_enabled = true (or null, meaning default enabled)
  // Note: auto_reminders_enabled column added by migration 20260428000001
  const { data: settingsData, error: settingsError } = await supabase
    .from('user_settings')
    .select('user_id, auto_reminders_enabled');

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  const settingsRows = (settingsData ?? []) as unknown as UserSettingsRow[];

  // Build set of users with auto-reminders enabled
  const usersWithRemindersEnabled = new Set<string>();
  for (const row of settingsRows) {
    // Default to enabled if null
    if (row.auto_reminders_enabled !== false) {
      usersWithRemindersEnabled.add(row.user_id);
    }
  }

  // 3. Get all eligible invoices (sent or viewed, with client email)
  // Note: auto_reminders_enabled column on invoices added by migration 20260428000001
  const { data: invoicesData, error: invoicesError } = await supabase
    .from('invoices')
    .select(
      'id, invoice_number, client_name, client_email, amount, currency, due_date, status, auto_reminders_enabled, reminder_count, last_reminder_at, user_id'
    )
    .in('status', ['sent', 'viewed'])
    .not('client_email', 'is', null);

  if (invoicesError) {
    return NextResponse.json({ error: invoicesError.message }, { status: 500 });
  }

  const invoiceRows = (invoicesData ?? []) as unknown as InvoiceRow[];

  // 4. Group invoices by user and filter by auto-reminders setting
  const invoicesByUser = new Map<string, InvoiceForReminder[]>();

  for (const inv of invoiceRows) {
    // Check user-level setting
    const hasUserSettings = settingsRows.some((r) => r.user_id === inv.user_id);
    const userEnabled = hasUserSettings
      ? usersWithRemindersEnabled.has(inv.user_id)
      : true; // Default to enabled if no settings row

    if (!userEnabled) continue;

    // Check invoice-level override
    if (inv.auto_reminders_enabled === false) continue;

    // Add to user's invoice list
    if (!invoicesByUser.has(inv.user_id)) {
      invoicesByUser.set(inv.user_id, []);
    }
    invoicesByUser.get(inv.user_id)!.push(inv as InvoiceForReminder);
  }

  // 5. Get user details (email, name) for users with invoices
  const userIds = Array.from(invoicesByUser.keys());
  const userDetails: Record<string, { email: string; name: string | null }> = {};

  for (const userId of userIds) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData?.user?.email) {
        userDetails[userId] = {
          email: userData.user.email,
          name:
            userData.user.user_metadata?.full_name ||
            userData.user.user_metadata?.name ||
            null,
        };
      }
    } catch {
      // Skip users we can't fetch
    }
  }

  // 6. Build candidates list (users with invoices and valid email)
  const candidates: UserWithInvoices[] = [];
  for (const [userId, invoices] of Array.from(invoicesByUser.entries())) {
    const details = userDetails[userId];
    if (!details?.email) continue;

    candidates.push({
      userId,
      email: details.email,
      name: details.name,
      invoices,
    });
  }

  // 7. Process each user's invoices
  const allResults: ReminderProcessResult[] = [];

  await mapWithConcurrency(candidates, 5, async (user) => {
    for (const invoice of user.invoices) {
      // Check eligibility
      const eligibility = isInvoiceEligibleForReminders(invoice);
      if (!eligibility.eligible) {
        allResults.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          success: true,
          skipped: true,
          reason: eligibility.reason,
        });
        continue;
      }

      // Get already-sent stages for this invoice
      // Note: source and reminder_stage columns added by migration 20260428000001
      const { data: sentRemindersData } = await supabase
        .from('invoice_reminders')
        .select('reminder_stage')
        .eq('invoice_id', invoice.id)
        .eq('source', 'auto')
        .not('reminder_stage', 'is', null);

      const sentReminders = (sentRemindersData ?? []) as unknown as ReminderRow[];
      const sentStages = sentReminders
        .map((r) => r.reminder_stage)
        .filter((s): s is string => s !== null);

      // Determine which stage (if any) is due today
      const stageInfo = getReminderStageForToday(
        invoice.due_date,
        sentStages,
        DEFAULT_REMINDER_SCHEDULE,
        now
      );

      if (!stageInfo) {
        allResults.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          success: true,
          skipped: true,
          reason: 'No reminder due today',
        });
        continue;
      }

      // Send the reminder
      const senderName = user.name || user.email.split('@')[0] || 'Sender';
      const result = await sendAutoReminder(
        invoice,
        stageInfo.stage,
        stageInfo.type,
        senderName
      );

      allResults.push(result);
    }
  });

  // 8. Calculate summary
  const sent = allResults.filter((r) => r.success && r.sent).length;
  const skipped = allResults.filter((r) => r.skipped).length;
  const failed = allResults.filter((r) => !r.success).length;

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    usersChecked: candidates.length,
    invoicesChecked: allResults.length,
    remindersSent: sent,
    skipped,
    failed,
    results: allResults,
  });
}
