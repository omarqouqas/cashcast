'use client';

import Link from 'next/link';
import { Clock, ArrowRight, FileText } from 'lucide-react';
import { formatDuration } from '@/lib/time/format-duration';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface UninvoicedTimeWidgetProps {
  totalMinutes: number;
  totalAmount: number;
  entryCount: number;
  currency?: string;
  className?: string;
}

export function UninvoicedTimeWidget({
  totalMinutes,
  totalAmount,
  entryCount,
  currency = 'USD',
  className,
}: UninvoicedTimeWidgetProps) {
  if (entryCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-500/30 bg-amber-500/5 p-4',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-300">
              Uninvoiced Time
            </h3>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(totalAmount, currency)}
            </p>
            <p className="text-sm text-zinc-400 mt-0.5">
              {formatDuration(totalMinutes)} across {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/time?filter=uninvoiced"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Invoice</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
