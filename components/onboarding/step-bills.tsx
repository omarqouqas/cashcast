'use client'

import { useState } from 'react'
import { Receipt, Check } from 'lucide-react'
import { showError } from '@/lib/toast'

type BillChip = {
  key: string
  name: string
  category: string
}

const BILL_CHIPS: BillChip[] = [
  { key: 'rent', name: 'Rent/Mortgage', category: 'Rent/Mortgage' },
  { key: 'utilities', name: 'Utilities', category: 'Utilities' },
  { key: 'phone', name: 'Phone', category: 'Utilities' },
  { key: 'internet', name: 'Internet', category: 'Utilities' },
  { key: 'subs', name: 'Subscriptions', category: 'Subscriptions' },
  { key: 'car', name: 'Car Payment', category: 'Other' },
  { key: 'insurance', name: 'Insurance', category: 'Insurance' },
  { key: 'groceries', name: 'Groceries', category: 'Groceries' },
  { key: 'gas', name: 'Gas/Fuel', category: 'Transportation' },
]

function toISODate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getFirstOfNextMonth() {
  const today = new Date()
  return toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 1))
}

export type SelectedBill = {
  name: string
  amount: number
  frequency: 'monthly'
  due_date: string
  category: string
}

export function StepBills({
  onContinue,
  onSkip,
}: {
  onContinue: (bills: SelectedBill[]) => Promise<void>
  onSkip: () => void
}) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleChip(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  async function handleContinue() {
    if (selectedKeys.size === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      const dueDate = getFirstOfNextMonth()
      const bills: SelectedBill[] = BILL_CHIPS
        .filter((chip) => selectedKeys.has(chip.key))
        .map((chip) => ({
          name: chip.name,
          amount: 0, // Placeholder - user edits in dashboard
          frequency: 'monthly' as const,
          due_date: dueDate,
          category: chip.category,
        }))

      await onContinue(bills)
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
            <Receipt className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">What bills do you pay?</h2>
            <p className="text-sm text-zinc-400">Tap to select</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {BILL_CHIPS.map((chip) => {
            const isSelected = selectedKeys.has(chip.key)
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => toggleChip(chip.key)}
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  isSelected
                    ? 'bg-teal-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
                ].join(' ')}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {chip.name}
              </button>
            )
          })}
        </div>

        {selectedKeys.size > 0 && (
          <p className="mt-4 text-sm text-zinc-400">
            {selectedKeys.size} bill{selectedKeys.size !== 1 ? 's' : ''} selected
          </p>
        )}

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
            disabled={selectedKeys.size === 0 || isSubmitting}
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
