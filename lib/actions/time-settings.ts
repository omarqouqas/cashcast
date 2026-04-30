'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Type helper for user_time_settings table (until migration is applied and types regenerated)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = Awaited<ReturnType<typeof createClient>> & { from: (table: string) => any };

interface TimeSettings {
  default_hourly_rate: number;
  round_to_minutes: number;
  default_billable: boolean;
}

/**
 * Get the current user's time settings
 */
export async function getTimeSettings(): Promise<{
  data: TimeSettings | null;
  error: string | null;
}> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('user_time_settings')
    .select('default_hourly_rate, round_to_minutes, default_billable')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching time settings:', error);
    return { data: null, error: error.message };
  }

  if (!data) {
    // Return defaults if no settings exist
    return {
      data: {
        default_hourly_rate: 0,
        round_to_minutes: 1,
        default_billable: true,
      },
      error: null,
    };
  }

  return {
    data: {
      default_hourly_rate: data.default_hourly_rate ?? 0,
      round_to_minutes: data.round_to_minutes ?? 1,
      default_billable: data.default_billable ?? true,
    },
    error: null,
  };
}

/**
 * Update or create the user's time settings
 */
export async function updateTimeSettings(
  settings: TimeSettings
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Use upsert to create or update
  const { error } = await supabase
    .from('user_time_settings')
    .upsert(
      {
        user_id: user.id,
        default_hourly_rate: settings.default_hourly_rate,
        round_to_minutes: settings.round_to_minutes,
        default_billable: settings.default_billable,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    );

  if (error) {
    console.error('Error updating time settings:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/time');
  revalidatePath('/dashboard/time/settings');
  return { success: true, error: null };
}
