'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { SerializedIncomePatternAnalysis, DataQuality, IncomeTrend } from '@/lib/forecasting/types';

interface IncomeInsightsCardProps {
  analysis: SerializedIncomePatternAnalysis | null;
  currency?: string;
}

/**
 * Data quality badge colors, labels, and descriptions.
 */
const DATA_QUALITY_CONFIG: Record<
  DataQuality,
  { label: string; color: string; bg: string; description: string; nextLevel: string | null }
> = {
  basic: {
    label: 'Basic',
    color: 'text-zinc-400',
    bg: 'bg-zinc-700',
    description: 'Less than 3 months of payment history. Forecasts use default estimates.',
    nextLevel: 'Track more invoices to reach Moderate (3+ months).',
  },
  moderate: {
    label: 'Moderate',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    description: '3-6 months of data. Basic pattern detection enabled.',
    nextLevel: 'Continue tracking to reach Good (6+ months) for seasonality detection.',
  },
  good: {
    label: 'Good',
    color: 'text-teal-400',
    bg: 'bg-teal-500/20',
    description: '6-12 months of data. Seasonality and trend detection enabled.',
    nextLevel: 'Reach Excellent (12+ months) for full pattern analysis.',
  },
  excellent: {
    label: 'Excellent',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    description: '12+ months of payment history. Full pattern analysis with high confidence.',
    nextLevel: null,
  },
};

/**
 * Trend icon and color configuration.
 */
const TREND_CONFIG: Record<
  IncomeTrend,
  { icon: typeof TrendingUp; color: string; label: string }
> = {
  growing: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    label: 'Growing',
  },
  stable: {
    icon: Minus,
    color: 'text-zinc-400',
    label: 'Stable',
  },
  declining: {
    icon: TrendingDown,
    color: 'text-rose-400',
    label: 'Declining',
  },
};

/**
 * Empty state shown when there's no pattern analysis available.
 */
function EmptyState() {
  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Income Insights</h3>
          <p className="mt-1 text-sm text-zinc-400">
            AI-powered income pattern analysis
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-violet-400" />
      </div>

      <div className="mt-6 text-center py-4">
        <p className="text-sm text-zinc-500">
          No income data available yet.
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          Start tracking invoices or income to see patterns.
        </p>
      </div>
    </div>
  );
}

/**
 * Income Insights Card - Dashboard summary widget.
 *
 * Shows:
 * - Data quality badge
 * - 90-day forecast headline with P10/P50/P90
 * - Overall trend indicator
 * - Link to full insights page
 */
export function IncomeInsightsCard({
  analysis,
  currency = 'USD',
}: IncomeInsightsCardProps) {
  const [showQualityTooltip, setShowQualityTooltip] = useState(false);

  // Show empty state if no analysis
  if (!analysis) {
    return <EmptyState />;
  }

  const qualityConfig = DATA_QUALITY_CONFIG[analysis.dataQuality];
  const trendConfig = TREND_CONFIG[analysis.overallTrend];
  const TrendIcon = trendConfig.icon;

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Income Insights</h3>
            <p className="mt-1 text-sm text-zinc-400">
              AI-powered income pattern analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Data quality badge with tooltip */}
          <div className="relative">
            <button
              type="button"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${qualityConfig.bg} ${qualityConfig.color} cursor-help`}
              onMouseEnter={() => setShowQualityTooltip(true)}
              onMouseLeave={() => setShowQualityTooltip(false)}
              onClick={() => setShowQualityTooltip(!showQualityTooltip)}
            >
              {qualityConfig.label}
              <HelpCircle className="h-3 w-3 opacity-60" />
            </button>
            {showQualityTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
                <p className="text-xs text-zinc-300 mb-2">
                  <span className="font-medium">{analysis.monthsOfData} months</span> of payment data
                </p>
                <p className="text-xs text-zinc-400 mb-2">
                  {qualityConfig.description}
                </p>
                {qualityConfig.nextLevel && (
                  <p className="text-xs text-teal-400">
                    {qualityConfig.nextLevel}
                  </p>
                )}
              </div>
            )}
          </div>
          <Sparkles className="h-5 w-5 text-violet-400" />
        </div>
      </div>

      {/* 90-Day Forecast */}
      <div className="mt-6">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
          90-Day Forecast
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-zinc-100">
            {formatCurrency(analysis.forecast90DaysP50, currency)}
          </span>
          <span className="text-sm text-zinc-500">expected</span>
        </div>
        <p className="text-sm text-zinc-500 mt-1">
          Range: {formatCurrency(analysis.forecast90DaysP10, currency)} &ndash;{' '}
          {formatCurrency(analysis.forecast90DaysP90, currency)}
        </p>
      </div>

      {/* Monthly Breakdown */}
      {analysis.forecast.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {analysis.forecast.map((month) => (
            <div
              key={month.label}
              className="bg-zinc-800/50 rounded-lg p-2 text-center"
            >
              <p className="text-xs text-zinc-500">{month.label.split(' ')[0]}</p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5">
                {formatCurrency(month.p50, currency)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Trend & Sources */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Trend indicator */}
          <div className="flex items-center gap-1.5">
            <TrendIcon className={`h-4 w-4 ${trendConfig.color}`} />
            <span className={`text-sm font-medium ${trendConfig.color}`}>
              {trendConfig.label}
            </span>
          </div>

          {/* Source count */}
          <span className="text-sm text-zinc-500">
            {analysis.sourceCount} source{analysis.sourceCount !== 1 ? 's' : ''}
          </span>

          {/* Seasonality indicator */}
          {analysis.seasonalityDetected && (
            <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded">
              Seasonal patterns
            </span>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-5 pt-4 border-t border-zinc-800">
        <Link
          href="/dashboard/insights"
          className="inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
        >
          View detailed insights
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
