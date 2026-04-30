'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  TimeEntry,
  TimeEntryInsert,
  TimeEntryUpdate,
  TimeEntrySummary,
} from '@/lib/types/time';
import { calculateDurationMinutes, summarizeTimeEntries } from '@/lib/types/time';

// Type helper for time_entries table (until migration is applied and types regenerated)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = Awaited<ReturnType<typeof createClient>> & { from: (table: string) => any };

/**
 * Create a new time entry
 */
export async function createTimeEntry(
  data: TimeEntryInsert
): Promise<{ data: TimeEntry | null; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Calculate duration if both start and end times are provided
  let durationMinutes: number | null = null;
  if (data.start_time && data.end_time) {
    durationMinutes = calculateDurationMinutes(data.start_time, data.end_time);
  }

  const { data: entry, error } = await supabase
    .from('time_entries')
    .insert({
      user_id: user.id,
      project_name: data.project_name,
      client_name: data.client_name || null,
      description: data.description || null,
      start_time: data.start_time,
      end_time: data.end_time || null,
      duration_minutes: durationMinutes,
      hourly_rate: data.hourly_rate,
      is_billable: data.is_billable ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating time entry:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/dashboard/time');
  return { data: entry as TimeEntry, error: null };
}

/**
 * Update an existing time entry
 */
export async function updateTimeEntry(
  id: string,
  data: TimeEntryUpdate
): Promise<{ data: TimeEntry | null; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Calculate duration if both times are being updated
  const updates: Record<string, unknown> = { ...data };
  if (data.start_time && data.end_time) {
    updates.duration_minutes = calculateDurationMinutes(data.start_time, data.end_time);
  }

  const { data: entry, error } = await supabase
    .from('time_entries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating time entry:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/dashboard/time');
  return { data: entry as TimeEntry, error: null };
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting time entry:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/time');
  return { success: true, error: null };
}

/**
 * Get all time entries for the current user
 */
export async function getTimeEntries(filters?: {
  client_name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_invoiced?: boolean | null;
}): Promise<{ data: TimeEntry[]; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: 'Not authenticated' };
  }

  let query = supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false });

  if (filters?.client_name) {
    query = query.eq('client_name', filters.client_name);
  }

  if (filters?.start_date) {
    query = query.gte('start_time', `${filters.start_date}T00:00:00.000Z`);
  }

  if (filters?.end_date) {
    query = query.lte('start_time', `${filters.end_date}T23:59:59.999Z`);
  }

  if (filters?.is_invoiced !== undefined && filters?.is_invoiced !== null) {
    query = query.eq('is_invoiced', filters.is_invoiced);
  }

  const { data: entries, error } = await query;

  if (error) {
    console.error('Error fetching time entries:', error);
    return { data: [], error: error.message };
  }

  return { data: (entries || []) as TimeEntry[], error: null };
}

/**
 * Get a single time entry by ID
 */
export async function getTimeEntry(
  id: string
): Promise<{ data: TimeEntry | null; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const { data: entry, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching time entry:', error);
    return { data: null, error: error.message };
  }

  return { data: entry as TimeEntry, error: null };
}

/**
 * Get summary of uninvoiced time entries
 */
export async function getUninvoicedSummary(): Promise<{
  data: TimeEntrySummary | null;
  error: string | null;
}> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_invoiced', false)
    .eq('is_billable', true);

  if (error) {
    console.error('Error fetching uninvoiced entries:', error);
    return { data: null, error: error.message };
  }

  const summary = summarizeTimeEntries((entries || []) as TimeEntry[]);
  return { data: summary, error: null };
}

/**
 * Mark time entries as invoiced
 */
export async function markAsInvoiced(
  entryIds: string[],
  invoiceId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('time_entries')
    .update({ is_invoiced: true, invoice_id: invoiceId })
    .in('id', entryIds)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error marking entries as invoiced:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/time');
  return { success: true, error: null };
}

/**
 * Get unique client names from time entries
 */
export async function getTimeEntryClients(): Promise<{
  data: string[];
  error: string | null;
}> {
  const supabase = await createClient() as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: 'Not authenticated' };
  }

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('client_name')
    .eq('user_id', user.id)
    .not('client_name', 'is', null);

  if (error) {
    console.error('Error fetching clients:', error);
    return { data: [], error: error.message };
  }

  const clients = new Set<string>();
  for (const entry of entries || []) {
    if (entry.client_name) {
      clients.add(entry.client_name);
    }
  }

  return { data: Array.from(clients).sort(), error: null };
}
