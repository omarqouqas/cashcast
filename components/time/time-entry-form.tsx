'use client';

import { useState } from 'react';
import { Plus, X, Clock } from 'lucide-react';
import { createTimeEntry } from '@/lib/actions/time-entries';
import { showSuccess, showError } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { getCurrencySymbol } from '@/lib/utils/format';
import posthog from 'posthog-js';

interface TimeEntryFormProps {
  defaultHourlyRate?: number;
  currency?: string;
  onSuccess?: () => void;
  className?: string;
}

export function TimeEntryForm({
  defaultHourlyRate = 0,
  currency = 'USD',
  onSuccess,
  className,
}: TimeEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [hourlyRate, setHourlyRate] = useState(defaultHourlyRate);
  const [isBillable, setIsBillable] = useState(true);

  const resetForm = () => {
    setProjectName('');
    setClientName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0] ?? '');
    setStartTime('09:00');
    setEndTime('10:00');
    setHourlyRate(defaultHourlyRate);
    setIsBillable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      showError('Project name is required');
      return;
    }

    if (!date || !startTime || !endTime) {
      showError('Date and times are required');
      return;
    }

    // Validate times
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    if (endDateTime <= startDateTime) {
      showError('End time must be after start time');
      return;
    }

    setIsSaving(true);

    const result = await createTimeEntry({
      project_name: projectName.trim(),
      client_name: clientName.trim() || null,
      description: description.trim() || null,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      hourly_rate: hourlyRate,
      is_billable: isBillable,
    });

    if (result.error) {
      showError(result.error);
    } else {
      showSuccess('Time entry created');
      resetForm();
      setIsOpen(false);
      onSuccess?.();

      try {
        posthog.capture('time_entry_created', {
          project: projectName,
          is_billable: isBillable,
          method: 'manual',
        });
      } catch {}
    }

    setIsSaving(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-zinc-950 font-medium hover:bg-teal-400 transition-colors',
          className
        )}
      >
        <Plus className="h-4 w-4" />
        Add Entry
      </button>
    );
  }

  return (
    <div className={cn('rounded-xl border border-zinc-700 bg-zinc-800', className)}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-700">
        <h3 className="font-medium text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-400" />
          Add Time Entry
        </h3>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(false);
          }}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Project / Task <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Client</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of work done"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Start <span className="text-rose-400">*</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              End <span className="text-rose-400">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <label className="text-sm text-zinc-400 block mb-1">Hourly Rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">{getCurrencySymbol(currency)}</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-teal-500"
            />
            <span className="text-sm text-zinc-300">Billable</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsOpen(false);
            }}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !projectName.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-zinc-950 text-sm font-medium hover:bg-teal-400 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}
