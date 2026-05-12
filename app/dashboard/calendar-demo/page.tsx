'use client';

import { formatCurrency } from '@/lib/utils/format';
import { format, addDays } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock data for demo
const mockDays = [
  {
    date: new Date(),
    balance: 1000,
    income: [],
    bills: [],
    status: 'orange' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 1),
    balance: 1000,
    income: [],
    bills: [],
    status: 'orange' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 2),
    balance: 1000,
    income: [],
    bills: [],
    status: 'orange' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 3),
    balance: 1000,
    income: [],
    bills: [],
    status: 'yellow' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 4),
    balance: 4200,
    income: [{ name: 'Salary', amount: 3200 }],
    bills: [],
    status: 'green' as const,
    delta: 3200,
  },
  {
    date: addDays(new Date(), 5),
    balance: 4200,
    income: [],
    bills: [],
    status: 'green' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 6),
    balance: 4200,
    income: [],
    bills: [],
    status: 'green' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 7),
    balance: 2200,
    income: [],
    bills: [{ name: 'Mortgage', amount: 2000 }],
    status: 'green' as const,
    delta: -2000,
  },
  {
    date: addDays(new Date(), 8),
    balance: 2050,
    income: [],
    bills: [{ name: 'Internet', amount: 80 }, { name: 'Phone', amount: 70 }],
    status: 'green' as const,
    delta: -150,
  },
  {
    date: addDays(new Date(), 9),
    balance: 2050,
    income: [],
    bills: [],
    status: 'green' as const,
    delta: 0,
  },
  {
    date: addDays(new Date(), 10),
    balance: 550,
    income: [],
    bills: [{ name: 'Car Payment', amount: 1500 }],
    status: 'yellow' as const,
    delta: -1500,
  },
  {
    date: addDays(new Date(), 11),
    balance: -200,
    income: [],
    bills: [{ name: 'Insurance', amount: 750 }],
    status: 'red' as const,
    delta: -750,
    isLowest: true,
  },
];

// Option 1: Cleaner Visual Hierarchy
// - No background colors, subtle left border for status
// - Clean typography, single accent color scheme
function DayCardOption1({ day, isToday, isLowest }: { day: typeof mockDays[0]; isToday: boolean; isLowest?: boolean }) {
  const borderColors = {
    green: 'border-l-emerald-500',
    yellow: 'border-l-amber-400',
    orange: 'border-l-orange-500',
    red: 'border-l-rose-500',
  };

  const hasActivity = day.income.length > 0 || day.bills.length > 0;

  return (
    <button
      className={cn(
        'relative bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-left w-full',
        'h-[140px] flex flex-col',
        'transition-all duration-200',
        'hover:bg-zinc-750 hover:border-zinc-600',
        'border-l-4',
        borderColors[day.status],
        isToday && 'ring-1 ring-teal-500/50',
        isLowest && 'ring-2 ring-rose-500/50'
      )}
    >
      {/* Lowest day indicator */}
      {isLowest && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          'text-xs font-medium',
          isToday ? 'text-teal-400 font-bold uppercase' : 'text-zinc-400'
        )}>
          {isToday ? 'Today' : format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance */}
      <div className={cn(
        'text-lg font-semibold tabular-nums',
        day.balance < 0 ? 'text-rose-400' : 'text-zinc-100'
      )}>
        {formatCurrency(day.balance, 'CAD')}
      </div>

      {/* Transactions - minimal style */}
      {hasActivity && (
        <div className="mt-auto space-y-1">
          {day.income.map((inc, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+{formatCurrency(inc.amount, 'CAD')}</span>
              <span className="text-zinc-500 truncate">{inc.name}</span>
            </div>
          ))}
          {day.bills.slice(0, 1).map((bill, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <TrendingDown className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400 font-medium">-{formatCurrency(bill.amount, 'CAD')}</span>
              <span className="text-zinc-500 truncate">{bill.name}</span>
            </div>
          ))}
          {day.bills.length > 1 && (
            <span className="text-xs text-zinc-500">+{day.bills.length - 1} more</span>
          )}
        </div>
      )}
    </button>
  );
}

// Option 4: Two-line Cards
// - Line 1: Balance only
// - Line 2: Net change on active days
// - Minimal, scannable design
function DayCardOption4({ day, isToday, isLowest }: { day: typeof mockDays[0]; isToday: boolean; isLowest?: boolean }) {
  const hasActivity = day.delta !== 0;

  return (
    <button
      className={cn(
        'relative bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-left w-full',
        'h-[100px] flex flex-col justify-between',
        'transition-all duration-200',
        'hover:bg-zinc-750 hover:border-zinc-600',
        isToday && 'ring-1 ring-teal-500/50 border-teal-500',
        isLowest && 'bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/50',
        day.status === 'red' && !isLowest && 'bg-rose-500/10 border-rose-500/30',
        day.status === 'orange' && 'bg-orange-500/5 border-orange-500/20'
      )}
    >
      {/* Lowest day indicator */}
      {isLowest && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-xs font-medium',
          isToday ? 'text-teal-400 font-bold uppercase' : 'text-zinc-400'
        )}>
          {isToday ? 'Today' : format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance + Delta */}
      <div>
        <div className={cn(
          'text-lg font-semibold tabular-nums',
          day.balance < 0 ? 'text-rose-400' : 'text-zinc-100'
        )}>
          {formatCurrency(day.balance, 'CAD')}
        </div>
        {hasActivity && (
          <div className={cn(
            'text-sm font-medium tabular-nums',
            day.delta > 0 ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {day.delta > 0 ? '+' : ''}{formatCurrency(day.delta, 'CAD')}
          </div>
        )}
      </div>
    </button>
  );
}

export default function CalendarDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <Link
        href="/dashboard/calendar"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calendar
      </Link>

      <h1 className="text-2xl font-bold mb-2">Calendar Card Design Options</h1>
      <p className="text-zinc-400 mb-8">Compare two approaches to reduce visual clutter</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Option 1 */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-teal-400">Option 1: Cleaner Visual Hierarchy</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Left border indicates status. Transaction details on active days only.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockDays.map((day, i) => (
              <DayCardOption1
                key={i}
                day={day}
                isToday={i === 0}
                isLowest={day.isLowest}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            <p className="font-medium text-zinc-300 mb-2">Pros:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Status visible at a glance via left border</li>
              <li>Transaction names visible without interaction</li>
              <li>Good balance of info density</li>
            </ul>
          </div>
        </div>

        {/* Option 4 */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-teal-400">Option 4: Two-line Cards</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Balance + net change only. Click for details. Maximum scannability.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockDays.map((day, i) => (
              <DayCardOption4
                key={i}
                day={day}
                isToday={i === 0}
                isLowest={day.isLowest}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            <p className="font-medium text-zinc-300 mb-2">Pros:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Most minimal and scannable</li>
              <li>Compact - more days visible at once</li>
              <li>Focus on what matters: balance trajectory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded" />
            <span className="text-zinc-400">Green: Healthy balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-400 rounded" />
            <span className="text-zinc-400">Yellow: Below safety buffer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded" />
            <span className="text-zinc-400">Orange: Getting low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-rose-500 rounded" />
            <span className="text-zinc-400">Red: Negative/danger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
