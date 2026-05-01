'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import type { TimeEntry } from '@/lib/types/time';
import { TimeEntryList } from '@/components/time/time-entry-list';
import { TimeEntryForm } from '@/components/time/time-entry-form';

interface TimePageClientProps {
  initialEntries: TimeEntry[];
  initialClients: string[];
  defaultHourlyRate: number;
  defaultBillable?: boolean;
  currency?: string;
  initialFilter?: 'uninvoiced' | null;
}

export function TimePageClient({
  initialEntries,
  initialClients,
  defaultHourlyRate,
  defaultBillable = true,
  currency = 'USD',
  initialFilter = null,
}: TimePageClientProps) {
  const router = useRouter();

  const handleUpdate = useCallback(() => {
    // Refresh server data
    router.refresh();
  }, [router]);

  const handleCreateInvoice = useCallback((entryIds: string[]) => {
    // TODO: Open create invoice modal with selected entries
    // For now, navigate to invoices page with entry IDs as query param
    const params = new URLSearchParams();
    params.set('time_entries', entryIds.join(','));
    router.push(`/dashboard/invoices/new?${params.toString()}`);
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Clock className="h-7 w-7 text-teal-400" />
            Time Tracking
          </h1>
          <p className="text-zinc-400 mt-1">
            Track your hours and create invoices from time entries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/time/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <TimeEntryForm
            defaultHourlyRate={defaultHourlyRate}
            defaultBillable={defaultBillable}
            currency={currency}
            onSuccess={handleUpdate}
          />
        </div>
      </div>

      {/* Entry list */}
      <TimeEntryList
        entries={initialEntries}
        clients={initialClients}
        onUpdate={handleUpdate}
        onCreateInvoice={handleCreateInvoice}
        currency={currency}
        initialFilter={initialFilter}
      />
    </div>
  );
}
