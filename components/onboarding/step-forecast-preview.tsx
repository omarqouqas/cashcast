'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Sparkles, ArrowRight, Receipt, Wallet } from 'lucide-react'
import { showError } from '@/lib/toast'
import { formatCurrency } from '@/lib/utils/format'

type Props = {
  balance: number | null
  billsCount: number
  onContinue: () => Promise<void>
}

export function StepForecastPreview({ balance, billsCount, onContinue }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleContinue() {
    setIsSubmitting(true)
    try {
      await onContinue()
    } catch (e: any) {
      showError(e?.message ?? 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <CalendarDays className="h-5 w-5 text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-50">Your forecast is ready</h2>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {balance !== null && (
            <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-4 py-3">
              <Wallet className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-400">Starting balance</p>
                <p className="text-lg font-semibold text-zinc-50">{formatCurrency(balance)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-4 py-3">
            <Receipt className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-sm text-zinc-400">Bills tracked</p>
              <p className="text-lg font-semibold text-zinc-50">{billsCount} bill{billsCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-4 py-3">
            <CalendarDays className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-sm text-zinc-400">Forecast range</p>
              <p className="text-lg font-semibold text-zinc-50">90 days</p>
            </div>
          </div>
        </div>

        {/* Upsell */}
        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-800/30 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-200">Want to see further ahead?</p>
              <p className="mt-1 text-sm text-zinc-400">
                Unlock 365-day forecasts, unlimited bills, and invoicing with Pro.
              </p>
              <Link
                href="/pricing"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto w-full max-w-lg px-4 py-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className={[
              'w-full rounded-xl bg-teal-500 text-zinc-950 font-semibold py-3',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-teal-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
              'inline-flex items-center justify-center gap-2',
            ].join(' ')}
          >
            {isSubmitting ? 'Loading...' : (
              <>
                See Your Forecast
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
