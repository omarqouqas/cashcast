'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateTimeSettings } from '@/lib/actions/time-settings';
import { showSuccess, showError } from '@/lib/toast';

interface TimeSettingsFormProps {
  initialSettings: {
    default_hourly_rate: number;
    round_to_minutes: number;
    default_billable: boolean;
  };
}

export function TimeSettingsForm({ initialSettings }: TimeSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [defaultHourlyRate, setDefaultHourlyRate] = useState(
    initialSettings.default_hourly_rate
  );
  const [roundToMinutes, setRoundToMinutes] = useState(
    initialSettings.round_to_minutes
  );
  const [defaultBillable, setDefaultBillable] = useState(
    initialSettings.default_billable
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateTimeSettings({
      default_hourly_rate: defaultHourlyRate,
      round_to_minutes: roundToMinutes,
      default_billable: defaultBillable,
    });

    if (result.error) {
      showError(result.error);
    } else {
      showSuccess('Settings saved');
      router.refresh();
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6 space-y-6">
        {/* Default hourly rate */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">
            Default Hourly Rate
          </label>
          <p className="text-sm text-zinc-500 mb-3">
            This rate will be pre-filled when you create new time entries
          </p>
          <div className="relative w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              $
            </span>
            <input
              type="number"
              value={defaultHourlyRate}
              onChange={(e) => setDefaultHourlyRate(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full pl-7 pr-16 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
              /hour
            </span>
          </div>
        </div>

        {/* Round to minutes */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">
            Round Duration To
          </label>
          <p className="text-sm text-zinc-500 mb-3">
            Time entries will be rounded to the nearest increment
          </p>
          <select
            value={roundToMinutes}
            onChange={(e) => setRoundToMinutes(parseInt(e.target.value))}
            className="w-48 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
          >
            <option value={1}>1 minute (exact)</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        {/* Default billable */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={defaultBillable}
              onChange={(e) => setDefaultBillable(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-teal-500"
            />
            <div>
              <span className="text-sm font-medium text-white block">
                Billable by default
              </span>
              <span className="text-sm text-zinc-500">
                New time entries will be marked as billable automatically
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/time"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Time Tracking
        </Link>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-zinc-950 font-medium hover:bg-teal-400 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
