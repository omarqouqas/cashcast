'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeFiltersProps {
  clients: string[];
  onFilterChange: (filters: {
    search: string;
    clientName: string | null;
    startDate: string | null;
    endDate: string | null;
    isInvoiced: boolean | null;
  }) => void;
  initialIsInvoiced?: boolean | null;
  className?: string;
}

export function TimeFilters({ clients, onFilterChange, initialIsInvoiced = null, className }: TimeFiltersProps) {
  const [search, setSearch] = useState('');
  const [clientName, setClientName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isInvoiced, setIsInvoiced] = useState<boolean | null>(initialIsInvoiced);
  const [showFilters, setShowFilters] = useState(initialIsInvoiced !== null);

  useEffect(() => {
    onFilterChange({ search, clientName, startDate, endDate, isInvoiced });
  }, [search, clientName, startDate, endDate, isInvoiced, onFilterChange]);

  const hasActiveFilters = clientName || startDate || endDate || isInvoiced !== null;

  const clearFilters = () => {
    setClientName(null);
    setStartDate(null);
    setEndDate(null);
    setIsInvoiced(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search and filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, clients, descriptions..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
            showFilters || hasActiveFilters
              ? 'bg-teal-500/20 border-teal-500/30 text-teal-300'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="h-5 w-5 rounded-full bg-teal-500 text-zinc-950 text-xs flex items-center justify-center">
              {[clientName, startDate || endDate, isInvoiced !== null].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Client filter */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Client</label>
              <select
                value={clientName || ''}
                onChange={(e) => setClientName(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="">All clients</option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            {/* Start date */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">From</label>
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* End date */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">To</label>
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Invoiced status */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Status</label>
              <select
                value={isInvoiced === null ? '' : isInvoiced ? 'invoiced' : 'uninvoiced'}
                onChange={(e) => {
                  if (e.target.value === '') setIsInvoiced(null);
                  else if (e.target.value === 'invoiced') setIsInvoiced(true);
                  else setIsInvoiced(false);
                }}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="">All entries</option>
                <option value="uninvoiced">Uninvoiced</option>
                <option value="invoiced">Invoiced</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
