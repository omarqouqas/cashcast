// components/dashboard/usage-indicator.tsx
// ============================================
// Usage Progress Indicator - Shows free tier limits
// Makes the paywall visible to encourage upgrades
// ============================================

'use client';

import Link from 'next/link';
import { PRICING_TIERS, type SubscriptionTier } from '@/lib/stripe/config';

interface UsageIndicatorProps {
  billsCount: number;
  incomeCount: number;
  tier: SubscriptionTier;
}

export function UsageIndicator({ billsCount, incomeCount, tier }: UsageIndicatorProps) {
  // Don't show for paid tiers (they have unlimited)
  if (tier !== 'free') {
    return null;
  }

  const limits = PRICING_TIERS.free.limits;
  const maxBills = limits.maxBills;
  const maxIncome = limits.maxIncome;

  const billsPercentage = Math.min((billsCount / maxBills) * 100, 100);
  const incomePercentage = Math.min((incomeCount / maxIncome) * 100, 100);

  const isNearBillsLimit = billsCount >= maxBills - 1;
  const isNearIncomeLimit = incomeCount >= maxIncome - 1;
  const isAtBillsLimit = billsCount >= maxBills;
  const isAtIncomeLimit = incomeCount >= maxIncome;

  const getBarColor = (percentage: number, isAtLimit: boolean, isNearLimit: boolean) => {
    if (isAtLimit) return 'bg-rose-500';
    if (isNearLimit) return 'bg-amber-500';
    if (percentage >= 60) return 'bg-amber-400';
    return 'bg-teal-500';
  };

  const getTextColor = (isAtLimit: boolean, isNearLimit: boolean) => {
    if (isAtLimit) return 'text-rose-400';
    if (isNearLimit) return 'text-amber-400';
    return 'text-zinc-400';
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Free Plan Usage</p>
        <Link
          href="/pricing"
          className="text-xs font-medium text-teal-500 hover:text-teal-400 transition-colors"
        >
          Upgrade for Unlimited →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bills Usage */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Bills</span>
            <span className={`text-xs font-medium ${getTextColor(isAtBillsLimit, isNearBillsLimit)}`}>
              {billsCount}/{maxBills}
            </span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(billsPercentage, isAtBillsLimit, isNearBillsLimit)}`}
              style={{ width: `${billsPercentage}%` }}
            />
          </div>
          {isAtBillsLimit && (
            <p className="text-xs text-rose-400 mt-1">Limit reached</p>
          )}
        </div>

        {/* Income Usage */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Income</span>
            <span className={`text-xs font-medium ${getTextColor(isAtIncomeLimit, isNearIncomeLimit)}`}>
              {incomeCount}/{maxIncome}
            </span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(incomePercentage, isAtIncomeLimit, isNearIncomeLimit)}`}
              style={{ width: `${incomePercentage}%` }}
            />
          </div>
          {isAtIncomeLimit && (
            <p className="text-xs text-rose-400 mt-1">Limit reached</p>
          )}
        </div>
      </div>

      {/* Warning message when near limits */}
      {(isNearBillsLimit || isNearIncomeLimit) && !isAtBillsLimit && !isAtIncomeLimit && (
        <p className="text-xs text-amber-400 mt-3">
          You're almost at your free plan limit. Upgrade to Pro for unlimited bills and income.
        </p>
      )}
    </div>
  );
}
