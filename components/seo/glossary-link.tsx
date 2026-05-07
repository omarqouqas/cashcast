import Link from 'next/link';

/**
 * GlossaryLink component for internal linking to glossary terms.
 * Improves SEO/AIEO by establishing topical authority and helping
 * users (and search engines) understand key financial terms.
 *
 * Usage: <GlossaryLink term="Net 30">Net 30 payment terms</GlossaryLink>
 */

interface GlossaryLinkProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

// Map of terms to their glossary anchors (first letter)
function getGlossaryAnchor(term: string): string {
  const firstChar = term.charAt(0).toUpperCase();
  return firstChar;
}

export function GlossaryLink({ term, children, className = '' }: GlossaryLinkProps) {
  const anchor = getGlossaryAnchor(term);

  return (
    <Link
      href={`/glossary#${anchor}`}
      className={`text-teal-400 hover:text-teal-300 underline decoration-teal-400/30 hover:decoration-teal-300/50 underline-offset-2 ${className}`}
      title={`Learn more about ${term}`}
    >
      {children}
    </Link>
  );
}

// Common glossary terms that can be easily referenced
export const glossaryTerms = {
  '1099Contractor': '1099 Contractor',
  'accountsReceivable': 'Accounts Receivable',
  'balanceProjection': 'Balance Projection',
  'billableHours': 'Billable Hours',
  'cashFlow': 'Cash Flow',
  'cashFlowForecast': 'Cash Flow Forecast',
  'cashReserve': 'Cash Reserve',
  'deductibleExpense': 'Deductible Expense',
  'dueOnReceipt': 'Due on Receipt',
  'emergencyFund': 'Emergency Fund',
  'estimatedTaxPayments': 'Estimated Tax Payments',
  'feastOrFamine': 'Feast or Famine Cycle',
  'grossIncome': 'Gross Income',
  'incomeVariability': 'Income Variability',
  'invoice': 'Invoice',
  'latePaymentFee': 'Late Payment Fee',
  'minimumViableIncome': 'Minimum Viable Income',
  'net15': 'Net 15',
  'net30': 'Net 30',
  'netIncome': 'Net Income',
  'overhead': 'Overhead',
  'paymentTerms': 'Payment Terms',
  'profitMargin': 'Profit Margin',
  'quarterlyTaxes': 'Quarterly Taxes',
  'rateIncrease': 'Rate Increase',
  'recurringRevenue': 'Recurring Revenue',
  'retainer': 'Retainer',
  'revenue': 'Revenue',
  'runway': 'Runway',
  'safeToSpend': 'Safe to Spend',
  'scopeCreep': 'Scope Creep',
  'selfEmploymentTax': 'Self-Employment Tax',
  'solopreneur': 'Solopreneur',
  'taxReserve': 'Tax Reserve',
  'variableIncome': 'Variable Income',
} as const;
