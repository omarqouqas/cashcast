'use client';

import { AlertTriangle, TrendingDown, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { RiskMetrics as RiskMetricsType } from '@/lib/calendar/monte-carlo/types';

interface RiskMetricsProps {
  riskMetrics: RiskMetricsType;
  currency: string;
  safetyBuffer: number;
}

/**
 * Display risk metrics from Monte Carlo simulation.
 * Shows probability of overdraft, worst-case balance, and days at risk.
 */
export function RiskMetrics({ riskMetrics, currency, safetyBuffer }: RiskMetricsProps) {
  const overdraftPct = Math.round(riskMetrics.probabilityBelowZero * 100);
  const belowBufferPct = Math.round(riskMetrics.probabilityBelowBuffer * 100);

  // Determine risk level for styling
  const getRiskLevel = (pct: number) => {
    if (pct >= 30) return 'high';
    if (pct >= 10) return 'medium';
    return 'low';
  };

  const overdraftRisk = getRiskLevel(overdraftPct);
  const bufferRisk = getRiskLevel(belowBufferPct);

  const riskColors = {
    high: 'text-rose-400',
    medium: 'text-amber-400',
    low: 'text-emerald-400',
  };

  const riskBgColors = {
    high: 'bg-rose-500/10 border-rose-500/20',
    medium: 'bg-amber-500/10 border-amber-500/20',
    low: 'bg-emerald-500/10 border-emerald-500/20',
  };

  // Show low risk status when no significant risk
  const showLowRiskStatus = overdraftPct === 0 && belowBufferPct < 5;

  return (
    <div className="space-y-3">
      {/* Overdraft risk - only show if > 0 */}
      {overdraftPct > 0 && (
        <div className={`rounded-lg border p-3 ${riskBgColors[overdraftRisk]}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${riskColors[overdraftRisk]}`} />
            <span className={`text-sm font-medium ${riskColors[overdraftRisk]}`}>
              {overdraftPct}% chance of overdraft
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Based on {riskMetrics.expectedDaysAtRisk.toFixed(0)} days projected below your safety buffer
          </p>
        </div>
      )}

      {/* Below buffer risk - show if no overdraft risk but buffer risk exists */}
      {overdraftPct === 0 && belowBufferPct >= 5 && (
        <div className={`rounded-lg border p-3 ${riskBgColors[bufferRisk]}`}>
          <div className="flex items-center gap-2">
            <TrendingDown className={`h-4 w-4 ${riskColors[bufferRisk]}`} />
            <span className={`text-sm font-medium ${riskColors[bufferRisk]}`}>
              {belowBufferPct}% chance of dipping below {formatCurrency(safetyBuffer, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Low risk status - show when no significant risk detected */}
      {showLowRiskStatus && (
        <div className={`rounded-lg border p-3 ${riskBgColors.low}`}>
          <div className="flex items-center gap-2">
            <Shield className={`h-4 w-4 ${riskColors.low}`} />
            <span className={`text-sm font-medium ${riskColors.low}`}>
              Low risk forecast
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Based on 500 simulations with income and bill timing variations
          </p>
        </div>
      )}

      {/* Worst case balance */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          <span>Worst case balance (P10)</span>
        </div>
        <span className={riskMetrics.worstCaseBalance < 0 ? 'text-rose-400' : 'text-zinc-300'}>
          {formatCurrency(riskMetrics.worstCaseBalance, currency)}
        </span>
      </div>
    </div>
  );
}
