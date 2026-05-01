import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { canUseTimeTracking, getUserSubscription } from '@/lib/stripe/subscription';
import { TimePageClient } from './time-page-client';
import { TimeTrackingUpgradePrompt } from '@/components/time/time-tracking-upgrade-prompt';
import { LifetimeDealBanner } from '@/components/subscription/lifetime-deal-banner';

export const metadata: Metadata = {
  title: 'Time Tracking | Cashcast',
  description: 'Track your billable hours and create invoices from time entries.',
};

export default async function TimePage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const user = await requireAuth();

  // Check if user has access to time tracking (Pro+ feature)
  const hasAccess = await canUseTimeTracking(user.id);
  if (!hasAccess) {
    const subscription = await getUserSubscription(user.id);
    return (
      <>
        <LifetimeDealBanner currentTier={subscription.tier} />
        <TimeTrackingUpgradePrompt />
      </>
    );
  }

  const supabase = await createClient();

  // Fetch time entries and user settings in parallel
  const [entriesResult, userSettingsResult] = await Promise.all([
    (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown[] | null }> } } } })
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false }),
    supabase
      .from('user_settings')
      .select('currency')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const entries = entriesResult.data;
  const currency = (userSettingsResult.data as { currency?: string } | null)?.currency ?? 'USD';

  // Fetch unique clients
  const clientSet = new Set<string>();
  for (const entry of (entries || []) as Array<{ client_name?: string | null }>) {
    if (entry.client_name) {
      clientSet.add(entry.client_name);
    }
  }
  const clients = Array.from(clientSet).sort();

  // Fetch user time settings
  let defaultHourlyRate = 0;
  let defaultBillable = true;
  try {
    const { data: settings } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { maybeSingle: () => Promise<{ data: { default_hourly_rate?: number; default_billable?: boolean } | null }> } } } })
      .from('user_time_settings')
      .select('default_hourly_rate, default_billable')
      .eq('user_id', user.id)
      .maybeSingle();
    defaultHourlyRate = settings?.default_hourly_rate ?? 0;
    defaultBillable = settings?.default_billable ?? true;
  } catch {
    // Table may not exist yet
  }

  // Parse filter from URL
  const initialFilter = searchParams.filter === 'uninvoiced' ? 'uninvoiced' : null;

  return (
    <TimePageClient
      initialEntries={(entries || []) as Array<{
        id: string;
        user_id: string;
        project_name: string;
        client_name: string | null;
        description: string | null;
        start_time: string;
        end_time: string | null;
        duration_minutes: number | null;
        hourly_rate: number;
        is_billable: boolean;
        is_invoiced: boolean;
        invoice_id: string | null;
        created_at: string;
        updated_at: string;
      }>}
      initialClients={clients}
      defaultHourlyRate={defaultHourlyRate}
      defaultBillable={defaultBillable}
      currency={currency}
      initialFilter={initialFilter}
    />
  );
}
