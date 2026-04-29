import 'server-only';

import { resend } from '@/lib/email/resend';
import {
  buildFriendlyReminderEmail,
  buildFirmReminderEmail,
  buildFinalReminderEmail,
} from '@/lib/email/templates/reminder-emails';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ReminderStage, ReminderType, InvoiceForReminder, ReminderProcessResult } from './types';

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function invoiceUrlFor(invoiceId: string) {
  return `${getAppUrl()}/dashboard/invoices/${invoiceId}`;
}

function getEmailBuilder(type: ReminderType) {
  switch (type) {
    case 'friendly':
      return buildFriendlyReminderEmail;
    case 'firm':
      return buildFirmReminderEmail;
    case 'final':
      return buildFinalReminderEmail;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

/**
 * Send an automated reminder email for an invoice
 * Records the reminder in invoice_reminders with source='auto'
 */
export async function sendAutoReminder(
  invoice: InvoiceForReminder,
  stage: ReminderStage,
  reminderType: ReminderType,
  senderName: string
): Promise<ReminderProcessResult> {
  const supabase = createAdminClient();

  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        success: false,
        error: 'Email not configured (missing RESEND_API_KEY)',
      };
    }

    const toEmail = invoice.client_email?.trim();
    if (!toEmail) {
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        success: false,
        skipped: true,
        reason: 'No client email',
      };
    }

    // Parse due date (noon to avoid timezone issues)
    const [year, month, day] = (invoice.due_date ?? '').split('-').map(Number);
    const dueDate =
      year && month && day ? new Date(year, month - 1, day, 12, 0, 0) : new Date();

    const invoiceUrl = invoiceUrlFor(invoice.id);

    // Build email using existing templates
    const buildEmail = getEmailBuilder(reminderType);
    const { subject, html } = buildEmail({
      clientName: invoice.client_name ?? 'there',
      invoiceNumber: invoice.invoice_number ?? 'Invoice',
      amount: invoice.amount ?? 0,
      dueDate,
      invoiceUrl,
      senderName,
    });

    const sentAt = new Date().toISOString();
    const beforeCount = invoice.reminder_count ?? 0;

    // 1. Insert reminder record BEFORE sending (with source='auto' and reminder_stage)
    // The unique index will prevent duplicates for the same stage
    const { data: reminderRecord, error: insertErr } = await supabase
      .from('invoice_reminders')
      .insert({
        invoice_id: invoice.id,
        user_id: invoice.user_id,
        reminder_type: reminderType,
        sent_at: sentAt,
        source: 'auto',
        reminder_stage: stage,
      })
      .select('id')
      .single();

    if (insertErr) {
      // If it's a unique constraint violation, this stage was already sent
      if (insertErr.code === '23505') {
        return {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          success: true,
          skipped: true,
          stage,
          reason: `Stage ${stage} already sent`,
        };
      }

      console.error('Failed inserting invoice_reminders:', insertErr);
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        success: false,
        error: 'Failed to record reminder',
      };
    }

    // 2. Send email
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Cashcast <onboarding@resend.dev>';

    const res = await resend.emails.send({
      from,
      to: toEmail,
      subject,
      html,
    });

    if (res.error) {
      console.error('Resend error for auto-reminder:', res.error);

      // Delete the reminder record since email failed to send
      await supabase.from('invoice_reminders').delete().eq('id', reminderRecord.id);

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        success: false,
        stage,
        error: `Email send failed: ${res.error.message}`,
      };
    }

    // 3. Update invoice summary fields
    const { error: updateErr } = await supabase
      .from('invoices')
      .update({
        reminder_count: beforeCount + 1,
        last_reminder_at: sentAt,
        updated_at: sentAt,
      })
      .eq('id', invoice.id)
      .eq('user_id', invoice.user_id);

    if (updateErr) {
      console.error('Failed updating invoice reminder count:', updateErr);
      // Don't fail the whole operation - email was sent
    }

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      success: true,
      sent: true,
      stage,
    };
  } catch (e) {
    console.error('sendAutoReminder failed:', e);
    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      success: false,
      stage,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
}
