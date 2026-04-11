'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SeasonalityPattern } from '@/lib/forecasting/types';

interface SeasonalitySectionProps {
  patterns: SeasonalityPattern[];
}

/**
 * Get color and icon based on percent change.
 */
function getPatternStyle(percentChange: number) {
  if (percentChange >= 10) {
    return {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      icon: TrendingUp,
    };
  } else if (percentChange <= -10) {
    return {
      color: 'text-rose-400',
      bg: 'bg-rose-500/20',
      borderColor: 'border-rose-500/30',
      icon: TrendingDown,
    };
  } else {
    return {
      color: 'text-zinc-400',
      bg: 'bg-zinc-700',
      borderColor: 'border-zinc-700',
      icon: Minus,
    };
  }
}

/**
 * Format percent change for display.
 */
function formatPercentChange(value: number): string {
  if (value > 0) return `+${value}%`;
  if (value < 0) return `${value}%`;
  return '0%';
}

/**
 * Individual quarter card.
 */
function QuarterCard({ pattern }: { pattern: SeasonalityPattern }) {
  const style = getPatternStyle(pattern.percentChange);
  const Icon = style.icon;

  return (
    <div
      className={`border ${style.borderColor} ${style.bg} rounded-lg p-4 text-center`}
    >
      <p className="text-sm font-medium text-zinc-300">
        {pattern.quarterLabel}
      </p>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <Icon className={`h-5 w-5 ${style.color}`} />
        <span className={`text-xl font-semibold ${style.color}`}>
          {formatPercentChange(pattern.percentChange)}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">
        {Math.round(pattern.confidence * 100)}% confidence
      </p>
    </div>
  );
}

/**
 * SeasonalitySection - Displays quarterly seasonal patterns.
 */
export function SeasonalitySection({ patterns }: SeasonalitySectionProps) {
  // Sort by quarter number
  const sortedPatterns = [...patterns].sort((a, b) => a.quarter - b.quarter);

  // Find most significant patterns for summary
  const significantPatterns = patterns
    .filter((p) => Math.abs(p.percentChange) >= 10)
    .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Seasonal Patterns
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Quarterly income variations detected from your payment history
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-500/20 text-violet-400">
          AI Detected
        </span>
      </div>

      {/* Quarter cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {sortedPatterns.map((pattern) => (
          <QuarterCard key={pattern.quarter} pattern={pattern} />
        ))}
      </div>

      {/* Summary insights */}
      {significantPatterns.length > 0 && (
        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">
            Key Insights
          </h3>
          <ul className="space-y-1.5">
            {significantPatterns.slice(0, 3).map((pattern) => {
              const isPositive = pattern.percentChange > 0;
              return (
                <li
                  key={pattern.quarter}
                  className="flex items-start gap-2 text-sm"
                >
                  <span
                    className={`mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {isPositive ? '↑' : '↓'}
                  </span>
                  <span className="text-zinc-400">
                    <span className="text-zinc-200">{pattern.quarterLabel}</span>
                    {' '}typically sees{' '}
                    <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                      {formatPercentChange(pattern.percentChange)}
                    </span>
                    {' '}{isPositive ? 'higher' : 'lower'} income
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
