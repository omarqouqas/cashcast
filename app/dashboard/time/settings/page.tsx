import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { canUseTimeTracking, getUserSubscription } from '@/lib/stripe/subscription';
import { TimeSettingsForm } from '@/components/time/time-settings-form';
import { TimeTrackingUpgradePrompt } from '@/components/time/time-tracking-upgrade-prompt';
import { LifetimeDealBanner } from '@/components/subscription/lifetime-deal-banner';

export const metadata: Metadata = {
  title: 'Time Settings | Cashcast',
  description: 'Configure your default hourly rate and time tracking preferences.',
};

export default async function TimeSettingsPage() {
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

  // Fetch user time settings
  let settings = {
    default_hourly_rate: 0,
    round_to_minutes: 1,
    default_billable: true,
  };

  try {
    const { data } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { maybeSingle: () => Promise<{ data: { default_hourly_rate?: number; round_to_minutes?: number; default_billable?: boolean } | null }> } } } })
      .from('user_time_settings')
      .select('default_hourly_rate, round_to_minutes, default_billable')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      settings = {
        default_hourly_rate: data.default_hourly_rate ?? 0,
        round_to_minutes: data.round_to_minutes ?? 1,
        default_billable: data.default_billable ?? true,
      };
    }
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Time Settings</h1>
        <p className="text-zinc-400 mt-1">
          Configure your default time tracking preferences
        </p>
      </div>

      <TimeSettingsForm initialSettings={settings} />
    </div>
  );
}
