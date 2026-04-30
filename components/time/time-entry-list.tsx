'use client';

import { useState, useCallback, useMemo } from 'react';
import { Clock, DollarSign, FileText } from 'lucide-react';
import type { TimeEntry } from '@/lib/types/time';
import { TimeEntryRow } from './time-entry-row';
import { TimeFilters } from './time-filters';
import { calculateTotals, groupByDate } from '@/lib/time/calculate-totals';
import { formatDuration } from '@/lib/time/format-duration';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface TimeEntryListProps {
  entries: TimeEntry[];
  clients: string[];
  onUpdate: () => void;
  onCreateInvoice?: (entryIds: string[]) => void;
  currency?: string;
  initialFilter?: 'uninvoiced' | null;
  className?: string;
}

export function TimeEntryList({
  entries,
  clients,
  onUpdate,
  onCreateInvoice,
  currency = 'USD',
  initialFilter = null,
  className,
}: TimeEntryListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    clientName: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
    isInvoiced: initialFilter === 'uninvoiced' ? false : null as boolean | null,
  });

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          entry.project_name.toLowerCase().includes(search) ||
          entry.client_name?.toLowerCase().includes(search) ||
          entry.description?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Client filter
      if (filters.clientName && entry.client_name !== filters.clientName) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const entryDate = new Date(entry.start_time);
        entryDate.setHours(0, 0, 0, 0);

        if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setHours(0, 0, 0, 0);
          if (entryDate < start) return false;
        }

        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          if (entryDate > end) return false;
        }
      }

      // Invoiced status filter
      if (filters.isInvoiced !== null && entry.is_invoiced !== filters.isInvoiced) {
        return false;
      }

      return true;
    });
  }, [entries, filters]);

  // Group by date
  const groupedEntries = useMemo(() => {
    return groupByDate(filteredEntries);
  }, [filteredEntries]);

  // Calculate totals
  const totals = useMemo(() => {
    return calculateTotals(filteredEntries);
  }, [filteredEntries]);

  // Selection totals
  const selectedEntries = useMemo(() => {
    return filteredEntries.filter((e) => selectedIds.has(e.id));
  }, [filteredEntries, selectedIds]);

  const selectedTotals = useMemo(() => {
    return calculateTotals(selectedEntries);
  }, [selectedEntries]);

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      // Clear selection when filters change
      setSelectedIds(new Set());
    },
    []
  );

  const handleSelect = (entryId: string, selected: boolean) => {
    const newSet = new Set(selectedIds);
    if (selected) {
      newSet.add(entryId);
    } else {
      newSet.delete(entryId);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    const uninvoicedIds = filteredEntries
      .filter((e) => !e.is_invoiced && e.is_billable)
      .map((e) => e.id);

    if (selectedIds.size === uninvoicedIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(uninvoicedIds));
    }
  };

  const uninvoicedBillableCount = filteredEntries.filter(
    (e) => !e.is_invoiced && e.is_billable
  ).length;

  const sortedDates = Array.from(groupedEntries.keys()).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      <TimeFilters
        clients={clients}
        onFilterChange={handleFilterChange}
        initialIsInvoiced={initialFilter === 'uninvoiced' ? false : null}
      />

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <span className="text-zinc-400 text-sm">
            {filteredEntries.length} entries
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-white font-medium">
            {formatDuration(totals.total_minutes)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-zinc-500" />
          <span className="text-white font-medium">
            {formatCurrency(totals.billable_amount, currency)}
          </span>
          <span className="text-zinc-500 text-sm">billable</span>
        </div>

        {totals.uninvoiced_amount > 0 && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span className="text-amber-400 font-medium">
              {formatCurrency(totals.uninvoiced_amount, currency)}
            </span>
            <span className="text-zinc-500 text-sm">uninvoiced</span>
          </div>
        )}
      </div>

      {/* Selection bar */}
      {uninvoicedBillableCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="text-sm text-teal-400 hover:text-teal-300"
            >
              {selectedIds.size === uninvoicedBillableCount
                ? 'Deselect all'
                : `Select all (${uninvoicedBillableCount})`}
            </button>

            {selectedIds.size > 0 && (
              <>
                <span className="text-zinc-600">|</span>
                <span className="text-sm text-zinc-400">
                  {selectedIds.size} selected
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-sm text-white font-medium">
                  {formatDuration(selectedTotals.total_minutes)} / {formatCurrency(selectedTotals.billable_amount, currency)}
                </span>
              </>
            )}
          </div>

          {selectedIds.size > 0 && onCreateInvoice && (
            <button
              onClick={() => onCreateInvoice(Array.from(selectedIds))}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-zinc-950 text-sm font-medium hover:bg-teal-400"
            >
              <FileText className="h-4 w-4" />
              Create Invoice
            </button>
          )}
        </div>
      )}

      {/* Entries grouped by date */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">No time entries found</p>
          {(filters.search || filters.clientName || filters.startDate || filters.endDate || filters.isInvoiced !== null) && (
            <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const dateEntries = groupedEntries.get(dateKey) || [];
            const date = new Date(dateKey + 'T00:00:00');
            const dayTotals = calculateTotals(dateEntries);

            return (
              <div key={dateKey}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-zinc-400">
                    {date.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                  <span className="text-sm text-zinc-500">
                    {formatDuration(dayTotals.total_minutes)}
                  </span>
                </div>

                <div className="space-y-2">
                  {dateEntries.map((entry) => (
                    <TimeEntryRow
                      key={entry.id}
                      entry={entry}
                      onUpdate={onUpdate}
                      selected={selectedIds.has(entry.id)}
                      onSelect={(selected) => handleSelect(entry.id, selected)}
                      showCheckbox={uninvoicedBillableCount > 0}
                      currency={currency}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
