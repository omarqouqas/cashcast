'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PdfUpload } from '@/components/import/pdf-upload';
import { PdfConfidenceBanner } from '@/components/import/pdf-confidence-banner';
import { RecurringPatternsCard } from '@/components/import/recurring-patterns-card';
import { TransactionSelector, type NormalizedTransaction, type ImportRow } from '@/components/import/transaction-selector';
import { StepIndicator } from '@/components/import/step-indicator';
import { createClient } from '@/lib/supabase/client';
import { showError, showSuccess } from '@/lib/toast';
import { generateId } from '@/lib/utils';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import type { SubscriptionTier } from '@/lib/stripe/config';
import type { PdfExtractionResult } from '@/lib/import/pdf-transaction-extractor';
import { suggestActionFromAmount } from '@/lib/import/pdf-transaction-extractor';
import {
  detectRecurringPatterns,
  type RecurringPattern,
} from '@/lib/import/recurring-detector';

type UsageForImport = {
  tier: SubscriptionTier;
  bills: { current: number; limit: number | null };
  income: { current: number; limit: number | null };
};

type Props = {
  userId: string;
  usage: UsageForImport;
};

type ParsedPdfData = {
  fileName: string;
  result: PdfExtractionResult;
};

export function PdfImportPageClient({ userId, usage }: Props) {
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedPdfData | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'bills' | 'income' | 'general'>('general');
  const [upgradeCounts, setUpgradeCounts] = useState<{ current: number; limit: number | undefined }>({
    current: 0,
    limit: undefined,
  });

  const [existingTransactions, setExistingTransactions] = useState<
    Array<{ posted_at: string; description: string; amount: number }>
  >([]);

  // Recurring pattern detection state
  const [detectedPatterns, setDetectedPatterns] = useState<RecurringPattern[]>([]);
  const [appliedPatternIds, setAppliedPatternIds] = useState<Set<string>>(new Set());
  const [patternsCardDismissed, setPatternsCardDismissed] = useState(false);

  // Load existing imported transactions for duplicate detection
  useEffect(() => {
    const loadExisting = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('imported_transactions')
        .select('posted_at, description, amount')
        .eq('user_id', userId)
        .order('posted_at', { ascending: false })
        .limit(500);

      if (data) {
        setExistingTransactions(data);
      }
    };

    loadExisting();
  }, [userId]);

  // Generate stable IDs when file is first parsed (not on every useMemo re-run)
  const stableIds = useMemo(() => {
    if (!parsed) return new Map<number, string>();
    const ids = new Map<number, string>();
    for (let i = 0; i < parsed.result.transactions.length; i++) {
      ids.set(i, generateId());
    }
    return ids;
  }, [parsed]); // Only regenerate when a new file is parsed

  // Convert PDF transactions to NormalizedTransaction format
  const normalizedTransactions = useMemo(() => {
    if (!parsed) return [];

    const transactions = parsed.result.transactions.map((t, index) => {
      // Check for potential duplicate
      const isDuplicate = existingTransactions.some(
        (existing) =>
          existing.posted_at === t.date &&
          existing.description.toLowerCase().trim() === t.description.toLowerCase().trim() &&
          Math.abs(existing.amount - t.amount) < 0.01
      );

      const normalized: NormalizedTransaction = {
        id: stableIds.get(index) ?? `fallback-${index}`,
        transaction_date: t.date,
        description: t.description,
        amount: t.amount,
        raw_data: {
          pdf_source: true,
          raw_line: t.rawLine,
          line_number: t.lineNumber,
          detected_bank: parsed.result.detectedBank,
          confidence: t.confidence,
        },
        original_row_number: t.lineNumber,
        isPotentialDuplicate: isDuplicate,
        suggestedAction: suggestActionFromAmount(t.amount),
      };

      return normalized;
    });

    return transactions;
  }, [parsed, existingTransactions, stableIds]);

  // Detect recurring patterns when transactions change
  useEffect(() => {
    if (normalizedTransactions.length === 0) {
      setDetectedPatterns([]);
      setAppliedPatternIds(new Set());
      setPatternsCardDismissed(false);
      return;
    }

    const txForDetection = normalizedTransactions.map((t) => ({
      id: t.id,
      transaction_date: t.transaction_date,
      description: t.description,
      amount: t.amount,
    }));

    const patterns = detectRecurringPatterns(txForDetection);
    setDetectedPatterns(patterns);
  }, [normalizedTransactions]);

  // Create pattern suggestions map for transactions
  const patternSuggestions = useMemo(() => {
    if (detectedPatterns.length === 0 || appliedPatternIds.size === 0) {
      return new Map<string, { patternId: string; frequency: string; normalizedName: string }>();
    }

    const suggestions = new Map<string, { patternId: string; frequency: string; normalizedName: string }>();

    for (const pattern of detectedPatterns) {
      if (appliedPatternIds.has(pattern.patternId)) {
        for (const txId of pattern.transactionIds) {
          suggestions.set(txId, {
            patternId: pattern.patternId,
            frequency: pattern.frequency,
            normalizedName: pattern.normalizedName,
          });
        }
      }
    }

    return suggestions;
  }, [detectedPatterns, appliedPatternIds]);

  // Transactions with pattern suggestions applied
  const transactionsWithPatterns = useMemo(() => {
    return normalizedTransactions.map((t) => {
      const patternSuggestion = patternSuggestions.get(t.id);

      if (patternSuggestion) {
        return {
          ...t,
          suggestedRecurring: {
            frequency: patternSuggestion.frequency,
            normalizedName: patternSuggestion.normalizedName,
          },
        };
      }

      return t;
    });
  }, [normalizedTransactions, patternSuggestions]);

  // Handle applying patterns from the patterns card
  const handleApplyPatterns = (selectedPatternIds: string[]) => {
    setAppliedPatternIds(new Set(selectedPatternIds));
    setPatternsCardDismissed(true);
  };

  const handleDismissPatterns = () => {
    setPatternsCardDismissed(true);
  };

  const openUpgrade = (feature: 'bills' | 'income' | 'general') => {
    setUpgradeFeature(feature);
    if (feature === 'bills') {
      setUpgradeCounts({ current: usage.bills.current, limit: usage.bills.limit ?? undefined });
    } else if (feature === 'income') {
      setUpgradeCounts({ current: usage.income.current, limit: usage.income.limit ?? undefined });
    } else {
      setUpgradeCounts({ current: 0, limit: undefined });
    }
    setShowUpgradeModal(true);
  };

  const handleImport = async (rows: ImportRow[]) => {
    const supabase = createClient();

    if (rows.length > 500) {
      showError('For now, please import 500 transactions or fewer at a time.');
      return;
    }

    const toCreateBills = rows.filter((r) => r.action === 'bill' || r.action === 'bill-recurring').length;
    const toCreateIncome = rows.filter((r) => r.action === 'income' || r.action === 'income-recurring').length;

    // Re-check current counts
    const [billsCountRes, incomeCountRes] = await Promise.all([
      supabase.from('bills').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('income').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    if (billsCountRes.error || incomeCountRes.error) {
      showError('Could not verify your current usage. Please try again.');
      return;
    }

    const currentBills = billsCountRes.count ?? usage.bills.current;
    const currentIncome = incomeCountRes.count ?? usage.income.current;

    const billsLimit = usage.bills.limit;
    const incomeLimit = usage.income.limit;

    const billsRemaining = billsLimit === null ? Infinity : Math.max(0, billsLimit - currentBills);
    const incomeRemaining = incomeLimit === null ? Infinity : Math.max(0, incomeLimit - currentIncome);

    const billsWouldExceed = billsRemaining !== Infinity && toCreateBills > billsRemaining;
    const incomeWouldExceed = incomeRemaining !== Infinity && toCreateIncome > incomeRemaining;

    if (billsWouldExceed || incomeWouldExceed) {
      if (billsWouldExceed && !incomeWouldExceed) openUpgrade('bills');
      else if (!billsWouldExceed && incomeWouldExceed) openUpgrade('income');
      else openUpgrade('general');

      const parts: string[] = [];
      if (billsWouldExceed) {
        parts.push(`You can only add ${billsRemaining} more bill${billsRemaining === 1 ? '' : 's'} on the Free tier.`);
      }
      if (incomeWouldExceed) {
        parts.push(`You can only add ${incomeRemaining} more income source${incomeRemaining === 1 ? '' : 's'} on the Free tier.`);
      }
      parts.push('Upgrade for unlimited, or import fewer items.');
      showError(parts.join(' '));
      return;
    }

    // Insert imported_transactions
    const mappedColumns = {
      date: 'Detected from PDF',
      description: 'Detected from PDF',
      amount: 'Detected from PDF',
      source: 'PDF',
      detected_bank: parsed?.result.detectedBank ?? 'Unknown',
    };

    const importedRows = rows.map((r) => ({
      id: r.id,
      user_id: userId,
      posted_at: r.transaction_date,
      description: r.description,
      amount: r.amount,
      source_file_name: parsed?.fileName ?? null,
      mapped_columns: mappedColumns,
      raw: {
        ...((r.raw_data as Record<string, unknown>) ?? {}),
        normalized: {
          transaction_date: r.transaction_date,
          description: r.description,
          amount: r.amount,
          original_row_number: r.original_row_number,
        },
      },
      invoice_id: null,
    }));

    const { error: importErr } = await supabase.from('imported_transactions').insert(importedRows);
    if (importErr) {
      showError(importErr.message);
      return;
    }

    // Create bills/income records
    const billsToInsert = rows
      .filter((r) => r.action === 'bill' || r.action === 'bill-recurring')
      .map((r) => ({
        user_id: userId,
        name: r.description.slice(0, 100),
        amount: Math.abs(r.amount),
        due_date: r.transaction_date,
        frequency: r.action === 'bill-recurring' ? (r.frequency ?? 'monthly') : 'one-time',
        category: 'other',
        is_active: true,
        source_import_id: r.id,
      }));

    const incomeToInsert = rows
      .filter((r) => r.action === 'income' || r.action === 'income-recurring')
      .map((r) => ({
        user_id: userId,
        name: r.description.slice(0, 100),
        amount: Math.abs(r.amount),
        frequency: r.action === 'income-recurring' ? (r.frequency ?? 'monthly') : 'one-time',
        next_date: r.transaction_date,
        account_id: null,
        is_active: true,
        status: 'active',
        source_import_id: r.id,
      }));

    const [billsInsertRes, incomeInsertRes] = await Promise.all([
      billsToInsert.length ? supabase.from('bills').insert(billsToInsert) : Promise.resolve({ error: null as any }),
      incomeToInsert.length ? supabase.from('income').insert(incomeToInsert) : Promise.resolve({ error: null as any }),
    ]);

    const billsSucceeded = !billsInsertRes.error;
    const incomeSucceeded = !incomeInsertRes.error;
    const billsCount = billsToInsert.length;
    const incomeCount = incomeToInsert.length;

    if (!billsSucceeded && !incomeSucceeded) {
      showError(`Import failed. Bills error: ${billsInsertRes.error?.message || 'Unknown'}. Income error: ${incomeInsertRes.error?.message || 'Unknown'}`);
      return;
    }

    if (!billsSucceeded && billsCount > 0) {
      if (incomeCount > 0) {
        showError(`Imported ${incomeCount} income, but ${billsCount} bills failed: ${billsInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${billsCount} bills: ${billsInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else if (!incomeSucceeded && incomeCount > 0) {
      if (billsCount > 0) {
        showError(`Imported ${billsCount} bills, but ${incomeCount} income failed: ${incomeInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${incomeCount} income: ${incomeInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else {
      showSuccess(`Imported ${incomeCount} income and ${billsCount} bills from PDF`);
    }

    router.refresh();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Import from PDF Statement</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Upload your bank statement PDF and we&apos;ll automatically extract transactions.
        </p>
        {usage.tier === 'free' && (
          <p className="text-sm text-zinc-500 mt-2">
            Free tier limits: {usage.bills.current}/{usage.bills.limit ?? '∞'} bills,{' '}
            {usage.income.current}/{usage.income.limit ?? '∞'} income sources.
          </p>
        )}
      </div>

      {/* Step Indicator - 2 steps for PDF */}
      <StepIndicator
        steps={[
          {
            number: 1,
            title: 'Upload PDF',
            status: !parsed ? 'current' : 'completed',
          },
          {
            number: 2,
            title: 'Review & Import',
            status: !parsed ? 'pending' : 'current',
          },
        ]}
      />

      <PdfUpload
        onLoaded={({ fileName, result }) => {
          setParsed({ fileName, result });
        }}
        onError={() => {
          setParsed(null);
        }}
      />

      {/* Confidence banner */}
      {parsed && (
        <PdfConfidenceBanner
          detectedBank={parsed.result.detectedBank}
          transactionCount={parsed.result.transactions.length}
          statementPeriod={parsed.result.statementPeriod}
          confidence={parsed.result.confidence}
        />
      )}

      {/* Recurring patterns detection */}
      {parsed && detectedPatterns.length > 0 && !patternsCardDismissed && (
        <RecurringPatternsCard
          patterns={detectedPatterns}
          onApplyPatterns={handleApplyPatterns}
          onDismiss={handleDismissPatterns}
        />
      )}

      {/* Parsing errors from extractor */}
      {parsed && parsed.result.errors.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-amber-200 font-medium">
            {parsed.result.errors.length} line{parsed.result.errors.length === 1 ? '' : 's'} could not be parsed
          </p>
          <ul className="mt-2 text-sm text-amber-200/70 space-y-1">
            {parsed.result.errors.slice(0, 5).map((err, idx) => (
              <li key={idx}>
                Line {err.line}: {err.message}
              </li>
            ))}
            {parsed.result.errors.length > 5 && (
              <li>...and {parsed.result.errors.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {/* Transaction selector */}
      {parsed && transactionsWithPatterns.length > 0 && (
        <TransactionSelector
          fileName={parsed.fileName}
          transactions={transactionsWithPatterns}
          onImport={handleImport}
          tier={usage.tier}
          currentBills={usage.bills.current}
          currentIncome={usage.income.current}
          billsLimit={usage.bills.limit}
          incomeLimit={usage.income.limit}
          onRequestUpgrade={openUpgrade}
          appliedPatternIds={appliedPatternIds}
        />
      )}

      {parsed && transactionsWithPatterns.length === 0 && parsed.result.errors.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <p className="text-base font-semibold text-zinc-100">No transactions found</p>
          <p className="text-sm text-zinc-400 mt-1">
            The PDF was read successfully, but no transactions could be extracted.
            This may happen with image-based PDFs or unusual formats.
          </p>
          <Link
            href="/dashboard/import"
            className="mt-3 inline-flex items-center text-sm text-teal-400 hover:text-teal-300"
          >
            Try CSV/Excel import instead
          </Link>
        </div>
      )}

      <UpgradePrompt
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        currentCount={upgradeCounts.current}
        limit={upgradeCounts.limit}
      />
    </div>
  );
}
