import { redirect } from 'next/navigation';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { NewInvoiceForm } from '@/components/invoices/new-invoice-form';
import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import type { LineItem } from '@/components/invoices/invoice-line-items';

// Type helper for time_entries table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = Awaited<ReturnType<typeof createClient>> & { from: (table: string) => any };

interface TimeEntry {
  id: string;
  project_name: string;
  client_name: string | null;
  duration_minutes: number | null;
  hourly_rate: number;
  is_billable: boolean;
  is_invoiced: boolean;
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: { time_entries?: string };
}) {
  const hasAccess = await canUseInvoicing();
  if (!hasAccess) {
    redirect('/dashboard/invoices');
  }

  const user = await requireAuth();
  const supabase = await createClient() as SupabaseClient;

  // Get user's default currency
  const { data: settings } = await supabase
    .from('user_settings')
    .select('currency')
    .eq('user_id', user.id)
    .single();

  const defaultCurrency = settings?.currency ?? 'USD';

  // Check if we're creating from time entries
  const timeEntryIds = searchParams.time_entries?.split(',').filter(Boolean) || [];
  let prefilledLineItems: LineItem[] | undefined;
  let prefilledClientName: string | undefined;

  if (timeEntryIds.length > 0) {
    // Fetch the time entries
    const { data: entries } = await supabase
      .from('time_entries')
      .select('id, project_name, client_name, duration_minutes, hourly_rate, is_billable, is_invoiced')
      .in('id', timeEntryIds)
      .eq('user_id', user.id)
      .eq('is_invoiced', false)
      .eq('is_billable', true);

    if (entries && entries.length > 0) {
      const timeEntries = entries as TimeEntry[];

      // Convert to line items (keep individual entries to preserve time_entry_id links)
      prefilledLineItems = timeEntries.map((entry, index) => {
        const hours = Math.round(((entry.duration_minutes || 0) / 60) * 100) / 100;
        return {
          id: `prefill_${index}`,
          description: entry.project_name,
          quantity: hours,
          unit_price: entry.hourly_rate,
          amount: Math.round(hours * entry.hourly_rate * 100) / 100,
          time_entry_id: entry.id,
        };
      });

      // Try to detect client name (use first non-null)
      const clientEntry = timeEntries.find((e) => e.client_name);
      if (clientEntry) {
        prefilledClientName = clientEntry.client_name ?? undefined;
      }
    }
  }

  return (
    <NewInvoiceForm
      defaultCurrency={defaultCurrency}
      prefilledLineItems={prefilledLineItems}
      prefilledClientName={prefilledClientName}
      timeEntryIds={timeEntryIds.length > 0 ? timeEntryIds : undefined}
    />
  );
}
