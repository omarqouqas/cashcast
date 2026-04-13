'use client';

import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type Props = {
  detectedBank: string | null;
  transactionCount: number;
  statementPeriod: { start: string | null; end: string | null };
  confidence: 'high' | 'medium' | 'low';
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

export function PdfConfidenceBanner({
  detectedBank,
  transactionCount,
  statementPeriod,
  confidence,
}: Props) {
  const Icon =
    confidence === 'high'
      ? CheckCircle2
      : confidence === 'medium'
        ? Info
        : AlertTriangle;

  const borderColor =
    confidence === 'high'
      ? 'border-teal-500/30'
      : confidence === 'medium'
        ? 'border-amber-500/30'
        : 'border-rose-500/30';

  const bgColor =
    confidence === 'high'
      ? 'bg-teal-500/10'
      : confidence === 'medium'
        ? 'bg-amber-500/10'
        : 'bg-rose-500/10';

  const iconColor =
    confidence === 'high'
      ? 'text-teal-400'
      : confidence === 'medium'
        ? 'text-amber-400'
        : 'text-rose-400';

  const textColor =
    confidence === 'high'
      ? 'text-teal-200'
      : confidence === 'medium'
        ? 'text-amber-200'
        : 'text-rose-200';

  const textColorMuted =
    confidence === 'high'
      ? 'text-teal-200/70'
      : confidence === 'medium'
        ? 'text-amber-200/70'
        : 'text-rose-200/70';

  const periodText =
    statementPeriod.start && statementPeriod.end
      ? `${formatDate(statementPeriod.start)} – ${formatDate(statementPeriod.end)}`
      : null;

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4 flex items-start gap-3`}>
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        <p className={`${textColor} font-medium`}>
          {detectedBank ? `Detected: ${detectedBank} Statement` : 'Bank Statement Detected'}
        </p>
        <div className={`mt-1 text-sm ${textColorMuted} space-y-0.5`}>
          <p>
            Found {transactionCount} transaction{transactionCount === 1 ? '' : 's'}
          </p>
          {periodText && <p>Statement period: {periodText}</p>}
          {confidence === 'low' && (
            <p className="mt-2">
              Some transactions may not have been detected correctly. Please review carefully before importing.
            </p>
          )}
          {confidence === 'medium' && (
            <p className="mt-2">
              We detected transactions but couldn&apos;t identify the bank format. Double-check amounts and dates.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
