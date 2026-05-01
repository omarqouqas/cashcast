'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'
import { CurrencyInput } from '@/components/ui/currency-input'

type Frequency = 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'one-time'

export type QuickSetupValues = {
  balance: number
  income?: {
    name: string
    amount: number
    frequency: Frequency
    next_date: string
  }
}

export function StepQuickSetup({
  onContinue,
  onSkip,
}: {
  onContinue: (values: QuickSetupValues) => Promise<void>
  onSkip: () => void
}) {
  // Account state
  const [balance, setBalance] = useState<number | undefined>(undefined)

  // Income state
  const [showIncome, setShowIncome] = useState(false)
  const [incomeName, setIncomeName] = useState('Salary')
  const [incomeAmount, setIncomeAmount] = useState<number | undefined>(undefined)
  const [frequency, setFrequency] = useState<Frequency>('biweekly')
  const [nextDate, setNextDate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Balance is required, income is optional
  const canContinue = balance !== undefined
  const incomeComplete = showIncome
    ? incomeName.trim().length > 0 && incomeAmount !== undefined && incomeAmount > 0 && nextDate.trim().length > 0
    : true

  async function handleContinue() {
    if (!canContinue || balance === undefined) return
    if (showIncome && !incomeComplete) return

    setIsSubmitting(true)
    setError(null)

    try {
      const values: QuickSetupValues = {
        balance,
      }

      if (showIncome && incomeAmount !== undefined && nextDate) {
        values.income = {
          name: incomeName.trim(),
          amount: incomeAmount,
          frequency,
          next_date: nextDate,
        }
      }

      await onContinue(values)
      showSuccess('Setup saved!')
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
        {/* Balance Section */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">What&apos;s your current balance?</h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            Enter your checking account balance to start.
          </p>
        </div>

        <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <p className="text-xs text-zinc-300">
            Use today&apos;s balance from your bank app. Add more accounts later.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-200">
            Current balance <span className="text-rose-400">*</span>
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <CurrencyInput
              value={balance}
              onChange={setBalance}
              placeholder="0.00"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-zinc-800" />

        {/* Income Section (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowIncome(!showIncome)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-base font-semibold text-zinc-50">When do you get paid?</h3>
              <p className="text-xs text-zinc-500">Optional - add your main income</p>
            </div>
            {showIncome ? (
              <ChevronUp className="h-5 w-5 text-zinc-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            )}
          </button>

          {showIncome && (
            <div className="mt-3 space-y-3">
              {/* Two-column layout for name and amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-200">Name</label>
                  <input
                    value={incomeName}
                    onChange={(e) => setIncomeName(e.target.value)}
                    placeholder="Salary"
                    className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-200">
                    Amount <span className="text-rose-400">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <CurrencyInput
                      value={incomeAmount}
                      onChange={setIncomeAmount}
                      placeholder="0.00"
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-200">How often?</label>
                <div className="mt-1 grid grid-cols-4 gap-1.5">
                  {([
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'biweekly', label: '2 weeks' },
                    { value: 'semi-monthly', label: '2x/mo' },
                    { value: 'monthly', label: 'Monthly' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFrequency(opt.value)}
                      className={[
                        'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                        frequency === opt.value
                          ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                          : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-200">
                  Next payday <span className="text-rose-400">*</span>
                </label>
                <input
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  type="date"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {showIncome && !incomeComplete && (
                <p className="text-xs text-zinc-500">
                  Fill out all fields, or collapse to continue without income.
                </p>
              )}
            </div>
          )}
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
            disabled={!canContinue || (showIncome && !incomeComplete) || isSubmitting}
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
