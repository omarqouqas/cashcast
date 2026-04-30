'use client';

import { useState } from 'react';
import { Pencil, Trash2, Check, X, Clock, DollarSign, FileText } from 'lucide-react';
import type { TimeEntry } from '@/lib/types/time';
import { formatDuration } from '@/lib/time/format-duration';
import { formatCurrency } from '@/lib/utils/format';
import { calculateBillableAmount } from '@/lib/types/time';
import { updateTimeEntry, deleteTimeEntry } from '@/lib/actions/time-entries';
import { showSuccess, showError } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface TimeEntryRowProps {
  entry: TimeEntry;
  onUpdate: () => void;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showCheckbox?: boolean;
  currency?: string;
}

export function TimeEntryRow({
  entry,
  onUpdate,
  selected = false,
  onSelect,
  showCheckbox = false,
  currency = 'USD',
}: TimeEntryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit state
  const [projectName, setProjectName] = useState(entry.project_name);
  const [clientName, setClientName] = useState(entry.client_name || '');
  const [description, setDescription] = useState(entry.description || '');
  const [hourlyRate, setHourlyRate] = useState(entry.hourly_rate);
  const [isBillable, setIsBillable] = useState(entry.is_billable);

  const amount = calculateBillableAmount(entry);
  const startDate = new Date(entry.start_time);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateTimeEntry(entry.id, {
      project_name: projectName,
      client_name: clientName || null,
      description: description || null,
      hourly_rate: hourlyRate,
      is_billable: isBillable,
    });

    if (result.error) {
      showError(result.error);
    } else {
      showSuccess('Entry updated');
      setIsEditing(false);
      onUpdate();
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    const result = await deleteTimeEntry(entry.id);
    if (result.error) {
      showError(result.error);
    } else {
      showSuccess('Entry deleted');
      onUpdate();
    }
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setProjectName(entry.project_name);
    setClientName(entry.client_name || '');
    setDescription(entry.description || '');
    setHourlyRate(entry.hourly_rate);
    setIsBillable(entry.is_billable);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg bg-zinc-800 border border-teal-500/30 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Project</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Client</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500 block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-32">
            <label className="text-xs text-zinc-500 block mb-1">Hourly Rate</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
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

          <div className="flex-1" />

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !projectName.trim()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500 text-zinc-950 text-sm font-medium hover:bg-teal-400 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors',
        selected && 'border-teal-500/50 bg-teal-500/5'
      )}
    >
      <div className="flex items-start gap-3">
        {showCheckbox && !entry.is_invoiced && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-teal-500"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-white truncate">{entry.project_name}</h3>
              {entry.client_name && (
                <p className="text-sm text-zinc-400">{entry.client_name}</p>
              )}
              {entry.description && (
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{entry.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!entry.is_invoiced && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {isDeleting ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        title="Confirm delete"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsDeleting(false)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
            <span className="text-zinc-500">
              {startDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>

            <span className="flex items-center gap-1 text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(entry.duration_minutes || 0)}
            </span>

            {entry.is_billable && (
              <span className="flex items-center gap-1 text-zinc-400">
                <DollarSign className="h-3.5 w-3.5" />
                {formatCurrency(amount, currency)}
                <span className="text-zinc-600">@ {formatCurrency(entry.hourly_rate, currency)}/hr</span>
              </span>
            )}

            {!entry.is_billable && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-xs">
                Non-billable
              </span>
            )}

            {entry.is_invoiced && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs">
                <FileText className="h-3 w-3" />
                Invoiced
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
