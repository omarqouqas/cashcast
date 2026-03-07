'use client';

import { AlertTriangle, CheckCircle, PiggyBank, Calendar, TrendingDown, Wallet } from 'lucide-react';
import type { TaxCalculatorResult } from '@/lib/tools/calculate-tax-reserve';

type Props = {
  result: TaxCalculatorResult | null;
};

function formatCurrency(amount: number, country: 'US' | 'CA' = 'US'): string {
  return new Intl.NumberFormat(country === 'CA' ? 'en-CA' : 'en-US', {
    style: 'currency',
    currency: country === 'CA' ? 'CAD' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function TaxCalculatorResult({ result }: Props) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-zinc-900/60 p-4 mb-4">
          <PiggyBank className="h-8 w-8 text-zinc-600" />
        </div>
        <p className="text-zinc-400 text-sm">
          Enter your income details to see your tax reserve breakdown
        </p>
      </div>
    );
  }

  const { netIncome, totalTaxReserve, effectiveTaxRate, safeToSpend, monthlyTaxReserve, quarterlyTaxPayment, breakdown, alerts, country } = result;

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4">
          <div className="flex items-center gap-2 text-sm text-teal-300 mb-1">
            <Wallet className="h-4 w-4" />
            <span>Safe to Spend</span>
          </div>
          <p className="text-2xl font-bold text-teal-400">
            {formatCurrency(safeToSpend, country)}
          </p>
          <p className="text-xs text-teal-300/70 mt-1">After setting aside taxes</p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 text-sm text-amber-300 mb-1">
            <PiggyBank className="h-4 w-4" />
            <span>Tax Reserve</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {formatCurrency(totalTaxReserve, country)}
          </p>
          <p className="text-xs text-amber-300/70 mt-1">{formatPercent(effectiveTaxRate)} effective rate</p>
        </div>
      </div>

      {/* Monthly/Quarterly Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Monthly Reserve</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {formatCurrency(monthlyTaxReserve, country)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Set aside each month</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
            <TrendingDown className="h-4 w-4" />
            <span>Quarterly Payment</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {formatCurrency(quarterlyTaxPayment, country)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Estimated installment</p>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Tax Breakdown</h3>
        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-white">
                  {formatCurrency(item.amount, country)}
                </p>
                {item.rate && (
                  <p className="text-xs text-zinc-500">{formatPercent(item.rate)}</p>
                )}
              </div>
            </div>
          ))}

          <div className="border-t border-zinc-800 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Total Tax Reserve</p>
              <p className="text-sm font-bold text-amber-400">
                {formatCurrency(totalTaxReserve, country)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Net Income Summary */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Income Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Net Income (after expenses)</span>
            <span className="text-white">{formatCurrency(netIncome, country)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Tax Reserve</span>
            <span className="text-amber-400">- {formatCurrency(totalTaxReserve, country)}</span>
          </div>
          <div className="border-t border-zinc-800 pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-white">Safe to Spend</span>
              <span className="font-bold text-teal-400">{formatCurrency(safeToSpend, country)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => {
            const isWarning = alert.includes('threshold') || alert.includes('approaching');
            const Icon = isWarning ? AlertTriangle : CheckCircle;
            const colorClass = isWarning
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              : 'border-zinc-700 bg-zinc-900/40 text-zinc-300';

            return (
              <div
                key={index}
                className={`rounded-lg border p-3 flex items-start gap-3 ${colorClass}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{alert}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quarterly Due Dates */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">
          {country === 'CA' ? 'Canadian Tax Installment Dates' : 'US Estimated Tax Due Dates'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {country === 'CA' ? (
            <>
              <div className="text-sm text-zinc-400">Q1: <span className="text-white">March 15</span></div>
              <div className="text-sm text-zinc-400">Q2: <span className="text-white">June 15</span></div>
              <div className="text-sm text-zinc-400">Q3: <span className="text-white">September 15</span></div>
              <div className="text-sm text-zinc-400">Q4: <span className="text-white">December 15</span></div>
            </>
          ) : (
            <>
              <div className="text-sm text-zinc-400">Q1: <span className="text-white">April 15</span></div>
              <div className="text-sm text-zinc-400">Q2: <span className="text-white">June 15</span></div>
              <div className="text-sm text-zinc-400">Q3: <span className="text-white">September 15</span></div>
              <div className="text-sm text-zinc-400">Q4: <span className="text-white">January 15</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
