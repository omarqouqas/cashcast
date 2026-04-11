'use client';

import { TrendingUp, TrendingDown, Minus, DollarSign, Clock, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { IncomeSourceMetrics, IncomeTrend } from '@/lib/forecasting/types';

interface SourceBreakdownProps {
  sources: IncomeSourceMetrics[];
  currency?: string;
}

/**
 * Trend configuration for badges.
 */
const TREND_CONFIG: Record<
  IncomeTrend,
  { icon: typeof TrendingUp; color: string; bg: string; label: string }
> = {
  growing: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    label: 'Growing',
  },
  stable: {
    icon: Minus,
    color: 'text-zinc-400',
    bg: 'bg-zinc-700',
    label: 'Stable',
  },
  declining: {
    icon: TrendingDown,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    label: 'Declining',
  },
};

/**
 * Frequency display labels.
 */
const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  'semi-monthly': 'Semi-monthly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
  irregular: 'Irregular',
};

/**
 * Individual source card.
 */
function SourceCard({
  source,
  currency,
}: {
  source: IncomeSourceMetrics;
  currency: string;
}) {
  const trendConfig = TREND_CONFIG[source.trend];
  const TrendIcon = trendConfig.icon;

  // Calculate reliability color
  let reliabilityColor = 'text-zinc-400';
  let reliabilityBg = 'bg-zinc-700';
  if (source.reliabilityScore >= 70) {
    reliabilityColor = 'text-emerald-400';
    reliabilityBg = 'bg-emerald-500/20';
  } else if (source.reliabilityScore >= 40) {
    reliabilityColor = 'text-amber-400';
    reliabilityBg = 'bg-amber-500/20';
  }

  return (
    <div className="border border-zinc-800 bg-zinc-800/50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-100 truncate">
            {source.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500">
              {source.paymentCount} payment{source.paymentCount !== 1 ? 's' : ''}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">
              {FREQUENCY_LABELS[source.detectedFrequency] || source.detectedFrequency}
            </span>
          </div>
        </div>
        {/* Trend badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${trendConfig.bg} ${trendConfig.color}`}
        >
          <TrendIcon className="h-3 w-3" />
          {trendConfig.label}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {/* Average Amount */}
        <div>
          <div className="flex items-center gap-1 text-zinc-500 mb-1">
            <DollarSign className="h-3 w-3" />
            <span className="text-xs">Avg Amount</span>
          </div>
          <p className="text-sm font-medium text-zinc-200">
            {formatCurrency(source.avgAmount, currency)}
          </p>
          {source.minAmount !== source.maxAmount && (
            <p className="text-xs text-zinc-500">
              {formatCurrency(source.minAmount, currency)} &ndash;{' '}
              {formatCurrency(source.maxAmount, currency)}
            </p>
          )}
        </div>

        {/* Timing */}
        <div>
          <div className="flex items-center gap-1 text-zinc-500 mb-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Timing</span>
          </div>
          <p className="text-sm font-medium text-zinc-200">
            ~{Math.round(source.avgDaysBetween)} days
          </p>
          {source.timingVariance > 0 && (
            <p className="text-xs text-zinc-500">
              ±{source.timingVariance} day variance
            </p>
          )}
        </div>

        {/* Reliability */}
        <div>
          <div className="flex items-center gap-1 text-zinc-500 mb-1">
            <BarChart3 className="h-3 w-3" />
            <span className="text-xs">Reliability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${reliabilityColor}`}>
              {source.reliabilityScore}%
            </span>
            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${reliabilityBg.replace('bg-', 'bg-').replace('/20', '')}`}
                style={{ width: `${source.reliabilityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Variability indicator */}
      {source.amountCV > 0.15 && (
        <div className="mt-3 pt-3 border-t border-zinc-700">
          <p className="text-xs text-amber-400">
            High variability: amounts vary by {Math.round(source.amountCV * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Empty state when no sources.
 */
function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-zinc-400">No income sources found.</p>
      <p className="text-sm text-zinc-500 mt-1">
        Start tracking invoices or income to see source analysis.
      </p>
    </div>
  );
}

/**
 * SourceBreakdown - Grid of income source cards.
 */
export function SourceBreakdown({
  sources,
  currency = 'USD',
}: SourceBreakdownProps) {
  if (sources.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sources.map((source) => (
        <SourceCard key={source.sourceId} source={source} currency={currency} />
      ))}
    </div>
  );
}
