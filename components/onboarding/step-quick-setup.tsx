'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { showError } from '@/lib/toast'
import { CurrencyInput } from '@/components/ui/currency-input'
import { getCurrencySymbol } from '@/lib/utils/format'

export type QuickSetupValues = {
  balance: number
}

export function StepQuickSetup({
  onContinue,
  onSkip,
}: {
  onContinue: (values: QuickSetupValues) => Promise<void>
  onSkip: () => void
}) {
  const [balance, setBalance] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canContinue = balance !== undefined

  async function handleContinue() {
    if (!canContinue || balance === undefined) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onContinue({ balance })
    } catch (e: any) {
      const message = e?.message ?? 'Something went wrong.'
      showError(message)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <Wallet className="h-5 w-5 text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-50">What&apos;s your current balance?</h2>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">{getCurrencySymbol('USD')}</span>
          <CurrencyInput
            value={balance}
            onChange={setBalance}
            placeholder="0.00"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 pl-10 pr-4 py-4 text-xl text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto w-full max-w-lg px-4 py-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting}
            className={[
              'w-full rounded-xl bg-teal-500 text-zinc-950 font-semibold py-3',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-teal-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
            ].join(' ')}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="mt-2 w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
