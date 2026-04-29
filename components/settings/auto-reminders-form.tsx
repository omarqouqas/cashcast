'use client';

import { useState, useTransition } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { updateAutoReminderSettings } from '@/lib/actions/update-auto-reminder-settings';
import { Button } from '@/components/ui/button';

type Props = {
  initialEnabled?: boolean | null;
};

export function AutoRemindersForm({ initialEnabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultEnabled = initialEnabled ?? true;
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);

  async function save() {
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.set('autoRemindersEnabled', String(enabled));

    const res = await updateAutoReminderSettings(fd);
    if (!res.success) {
      setError(res.error ?? 'Failed to save');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Automated Invoice Reminders</h3>
          <p className="text-sm text-zinc-400">
            Automatically send payment reminders to clients
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
          <div>
            <p className="text-zinc-100 font-medium">Enable Auto-Reminders</p>
            <p className="text-sm text-zinc-500">
              Automatically send payment reminders based on invoice due dates
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
              enabled ? 'bg-teal-500' : 'bg-zinc-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                enabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Info text */}
        <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          <p className="font-medium text-zinc-300 mb-2">Reminder Schedule:</p>
          <ul className="space-y-1.5 ml-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>3 days before due date</span>
              <span className="text-zinc-600 ml-auto">Friendly reminder</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>On the due date</span>
              <span className="text-zinc-600 ml-auto">Due today notice</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>7 days overdue</span>
              <span className="text-zinc-600 ml-auto">Firm reminder</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>14 days overdue</span>
              <span className="text-zinc-600 ml-auto">Final notice</span>
            </li>
          </ul>
          <p className="mt-3 text-zinc-500">
            Each reminder is sent only once per invoice. You can disable auto-reminders for individual invoices.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Auto-reminder preferences saved
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            disabled={isPending}
            loading={isPending}
            onClick={() => startTransition(save)}
          >
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
