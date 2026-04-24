'use client';

import { useState } from 'react';
import { RefreshCw, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format';
import type { RecurringPattern } from '@/lib/import/recurring-detector';
import type { RecurringFrequency } from '@/components/import/transaction-selector';

type Props = {
  patterns: RecurringPattern[];
  onApplyPatterns: (selectedPatternIds: string[]) => void;
  onDismiss: () => void;
};

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  'semi-monthly': 'Semi-monthly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
};

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100);

  let color = 'bg-zinc-700 text-zinc-300';
  if (confidence >= 0.7) {
    color = 'bg-emerald-500/20 text-emerald-400';
  } else if (confidence >= 0.5) {
    color = 'bg-amber-500/20 text-amber-400';
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>
      {percentage}% match
    </span>
  );
}

function PatternRow({
  pattern,
  isSelected,
  onToggle,
}: {
  pattern: RecurringPattern;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const isExpense = pattern.amount < 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-teal-500/50 bg-teal-500/10'
          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div
            className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? 'bg-teal-500 border-teal-500'
                : 'border-zinc-600 bg-zinc-800'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>

          {/* Pattern info */}
          <div className="min-w-0">
            <div className="font-medium text-zinc-100 truncate">
              {pattern.normalizedName}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm text-zinc-400">
                {formatCurrency(Math.abs(pattern.amount))}/{FREQUENCY_LABELS[pattern.frequency].toLowerCase()}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-sm text-zinc-500">
                {pattern.occurrenceCount} occurrences
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-sm text-zinc-500">
                Day {pattern.suggestedDayOfMonth}
              </span>
            </div>
          </div>
        </div>

        {/* Amount and confidence */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className={`font-medium ${
              isExpense ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {isExpense ? '-' : '+'}
            {formatCurrency(Math.abs(pattern.amount))}
          </span>
          <ConfidenceBadge confidence={pattern.confidence} />
        </div>
      </div>
    </button>
  );
}

export function RecurringPatternsCard({ patterns, onApplyPatterns, onDismiss }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // Pre-select high-confidence patterns
    const initial = new Set<string>();
    for (const p of patterns) {
      if (p.confidence >= 0.6) {
        initial.add(p.patternId);
      }
    }
    return initial;
  });

  const [isExpanded, setIsExpanded] = useState(true);

  if (patterns.length === 0) {
    return null;
  }

  const togglePattern = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(patterns.map((p) => p.patternId)));
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const handleApply = () => {
    onApplyPatterns(Array.from(selectedIds));
  };

  const selectedCount = selectedIds.size;
  const totalCount = patterns.length;

  return (
    <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-teal-500/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-zinc-100">
              {totalCount} Recurring Pattern{totalCount !== 1 ? 's' : ''} Detected
            </h3>
            <p className="text-sm text-zinc-400">
              {selectedCount} selected to import as recurring
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-zinc-400">
            We found transactions that appear to repeat regularly. Select patterns to automatically
            set them as recurring bills or income.
          </p>

          {/* Select all/none */}
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={selectAll}
              className="text-teal-400 hover:text-teal-300"
            >
              Select all
            </button>
            <span className="text-zinc-600">•</span>
            <button
              type="button"
              onClick={selectNone}
              className="text-zinc-400 hover:text-zinc-300"
            >
              Select none
            </button>
          </div>

          {/* Pattern list */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {patterns.map((pattern) => (
              <PatternRow
                key={pattern.patternId}
                pattern={pattern}
                isSelected={selectedIds.has(pattern.patternId)}
                onToggle={() => togglePattern(pattern.patternId)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-zinc-400 hover:text-zinc-300"
            >
              Skip
            </Button>
            <Button
              onClick={handleApply}
              disabled={selectedCount === 0}
              className="bg-teal-600 hover:bg-teal-500"
            >
              Apply {selectedCount} Pattern{selectedCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
