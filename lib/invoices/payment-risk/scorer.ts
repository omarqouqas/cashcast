/**
 * Payment Risk Scoring Engine
 *
 * Calculates risk scores for invoices based on client payment history
 * and various risk factors.
 */

import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import type {
  ClientPaymentHistory,
  InvoiceForRisk,
  PaymentRiskScore,
  RiskFactor,
  RiskLevel,
} from './types';
import { RISK_THRESHOLDS, RISK_WEIGHTS } from './types';

/**
 * Calculate payment risk score for an invoice.
 *
 * @param invoice - The invoice to score
 * @param history - Client's payment history (null for new clients)
 * @returns Payment risk score or null if invoice is already paid
 */
export function calculatePaymentRisk(
  invoice: InvoiceForRisk,
  history: ClientPaymentHistory | null
): PaymentRiskScore | null {
  // Don't score paid invoices
  if (invoice.status === 'paid') {
    return null;
  }

  // Safety check for missing due_date
  if (!invoice.due_date) {
    return null;
  }

  const factors: RiskFactor[] = [];
  let totalScore = 0;

  // If no history, this is a new client - return moderate baseline risk
  if (!history || history.paidInvoices === 0) {
    return createNewClientScore(invoice);
  }

  // Factor 1: Historical lateness (40%)
  const latenessResult = scoreHistoricalLateness(history);
  factors.push(latenessResult.factor);
  totalScore += latenessResult.score * RISK_WEIGHTS.historicalLateness;

  // Factor 2: Payment trend (20%)
  const trendResult = scorePaymentTrend(history);
  factors.push(trendResult.factor);
  totalScore += trendResult.score * RISK_WEIGHTS.paymentTrend;

  // Factor 3: Invoice amount vs typical (15%)
  const amountResult = scoreInvoiceAmount(invoice, history);
  factors.push(amountResult.factor);
  totalScore += amountResult.score * RISK_WEIGHTS.invoiceAmount;

  // Factor 4: Payment rate (15%)
  const rateResult = scorePaymentRate(history);
  factors.push(rateResult.factor);
  totalScore += rateResult.score * RISK_WEIGHTS.paymentRate;

  // Factor 5: Recency (10%)
  const recencyResult = scoreRecency(history);
  factors.push(recencyResult.factor);
  totalScore += recencyResult.score * RISK_WEIGHTS.recency;

  // Clamp score to 0-100
  const finalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  // Determine risk level
  const riskLevel = scoreToRiskLevel(finalScore);

  // Calculate expected payment date
  const expectedDaysLate = history.avgDaysLate;
  const dueDate = parseISO(invoice.due_date);
  const expectedPaymentDate = addDays(dueDate, expectedDaysLate);

  // Calculate confidence based on sample size
  const confidence = calculateConfidence(history);

  return {
    score: finalScore,
    riskLevel,
    expectedPaymentDate: format(expectedPaymentDate, 'yyyy-MM-dd'),
    expectedDaysLate,
    confidence,
    factors,
  };
}

/**
 * Create a baseline score for new clients with no history.
 */
function createNewClientScore(invoice: InvoiceForRisk): PaymentRiskScore {
  const dueDate = parseISO(invoice.due_date);

  return {
    score: 30, // Moderate baseline
    riskLevel: 'medium',
    expectedPaymentDate: format(dueDate, 'yyyy-MM-dd'), // Assume on-time
    expectedDaysLate: 0,
    confidence: 0.2, // Low confidence
    factors: [
      {
        name: 'New client',
        impact: 'negative',
        description: 'No payment history available',
        contribution: 30,
      },
    ],
  };
}

/**
 * Score historical lateness (0-100).
 * Maps average days late to a risk score.
 */
function scoreHistoricalLateness(
  history: ClientPaymentHistory
): { score: number; factor: RiskFactor } {
  const avgDaysLate = history.avgDaysLate;

  let score: number;
  let description: string;
  let impact: 'positive' | 'negative';

  if (avgDaysLate <= -3) {
    // Pays early
    score = 0;
    description = `Usually pays ${Math.abs(avgDaysLate)} days early`;
    impact = 'positive';
  } else if (avgDaysLate <= 0) {
    // Pays on time
    score = 10;
    description = 'Usually pays on time';
    impact = 'positive';
  } else if (avgDaysLate <= 7) {
    // Slightly late
    score = 40;
    description = `Usually pays ${avgDaysLate} days late`;
    impact = 'negative';
  } else if (avgDaysLate <= 14) {
    // Moderately late
    score = 70;
    description = `Usually pays ${avgDaysLate} days late`;
    impact = 'negative';
  } else {
    // Very late
    score = 100;
    description = `Usually pays ${avgDaysLate}+ days late`;
    impact = 'negative';
  }

  return {
    score,
    factor: {
      name: 'Payment history',
      impact,
      description,
      contribution: Math.round(score * RISK_WEIGHTS.historicalLateness),
    },
  };
}

/**
 * Score payment trend (0-100).
 */
function scorePaymentTrend(
  history: ClientPaymentHistory
): { score: number; factor: RiskFactor } {
  let score: number;
  let description: string;
  let impact: 'positive' | 'negative';

  switch (history.paymentTrend) {
    case 'improving':
      score = 20;
      description = 'Payment timing improving';
      impact = 'positive';
      break;
    case 'worsening':
      score = 80;
      description = 'Payment timing getting slower';
      impact = 'negative';
      break;
    case 'stable':
    default:
      score = 50;
      description = 'Consistent payment pattern';
      impact = 'positive';
      break;
  }

  return {
    score,
    factor: {
      name: 'Payment trend',
      impact,
      description,
      contribution: Math.round(score * RISK_WEIGHTS.paymentTrend),
    },
  };
}

/**
 * Score invoice amount vs typical (0-100).
 * Higher than usual amounts may take longer to pay.
 */
function scoreInvoiceAmount(
  invoice: InvoiceForRisk,
  history: ClientPaymentHistory
): { score: number; factor: RiskFactor } {
  // Guard against division by zero
  if (history.avgInvoiceAmount === 0) {
    return {
      score: 40,
      factor: {
        name: 'Invoice amount',
        impact: 'positive',
        description: 'Unable to compare (no amount history)',
        contribution: Math.round(40 * RISK_WEIGHTS.invoiceAmount),
      },
    };
  }

  const ratio = invoice.amount / history.avgInvoiceAmount;

  let score: number;
  let description: string;
  let impact: 'positive' | 'negative';

  if (ratio <= 0.8) {
    // Below average
    score = 20;
    description = 'Amount below typical';
    impact = 'positive';
  } else if (ratio <= 1.2) {
    // About average
    score = 40;
    description = 'Typical invoice amount';
    impact = 'positive';
  } else if (ratio <= 2.0) {
    // Above average
    score = 60;
    description = 'Amount higher than typical';
    impact = 'negative';
  } else {
    // Much higher
    score = 80;
    description = 'Amount much higher than typical';
    impact = 'negative';
  }

  return {
    score,
    factor: {
      name: 'Invoice amount',
      impact,
      description,
      contribution: Math.round(score * RISK_WEIGHTS.invoiceAmount),
    },
  };
}

/**
 * Score payment rate (0-100).
 * Ratio of paid invoices to total.
 */
function scorePaymentRate(
  history: ClientPaymentHistory
): { score: number; factor: RiskFactor } {
  const rate = history.paidInvoices / history.totalInvoices;

  let score: number;
  let description: string;
  let impact: 'positive' | 'negative';

  if (rate >= 1.0) {
    score = 0;
    description = 'Paid all invoices';
    impact = 'positive';
  } else if (rate >= 0.9) {
    score = 20;
    description = `Paid ${Math.round(rate * 100)}% of invoices`;
    impact = 'positive';
  } else if (rate >= 0.7) {
    score = 50;
    description = `Paid ${Math.round(rate * 100)}% of invoices`;
    impact = 'negative';
  } else {
    score = 80;
    description = `Only paid ${Math.round(rate * 100)}% of invoices`;
    impact = 'negative';
  }

  return {
    score,
    factor: {
      name: 'Payment rate',
      impact,
      description,
      contribution: Math.round(score * RISK_WEIGHTS.paymentRate),
    },
  };
}

/**
 * Score recency of last payment (0-100).
 * Longer gaps may indicate payment issues.
 */
function scoreRecency(
  history: ClientPaymentHistory
): { score: number; factor: RiskFactor } {
  if (!history.lastPaymentDate) {
    return {
      score: 50,
      factor: {
        name: 'Last payment',
        impact: 'negative',
        description: 'No recent payments',
        contribution: Math.round(50 * RISK_WEIGHTS.recency),
      },
    };
  }

  const daysSincePayment = differenceInDays(
    new Date(),
    parseISO(history.lastPaymentDate)
  );

  let score: number;
  let description: string;
  let impact: 'positive' | 'negative';

  if (daysSincePayment <= 30) {
    score = 10;
    description = 'Paid recently';
    impact = 'positive';
  } else if (daysSincePayment <= 60) {
    score = 30;
    description = 'Last paid ~1-2 months ago';
    impact = 'positive';
  } else if (daysSincePayment <= 90) {
    score = 50;
    description = 'Last paid ~2-3 months ago';
    impact = 'negative';
  } else {
    score = 70;
    description = `Last paid ${Math.round(daysSincePayment / 30)} months ago`;
    impact = 'negative';
  }

  return {
    score,
    factor: {
      name: 'Last payment',
      impact,
      description,
      contribution: Math.round(score * RISK_WEIGHTS.recency),
    },
  };
}

/**
 * Convert score to risk level.
 */
function scoreToRiskLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.low) return 'low';
  if (score <= RISK_THRESHOLDS.medium) return 'medium';
  if (score <= RISK_THRESHOLDS.high) return 'high';
  return 'critical';
}

/**
 * Calculate confidence based on sample size.
 * More paid invoices = higher confidence.
 */
function calculateConfidence(history: ClientPaymentHistory): number {
  const paidCount = history.paidInvoices;

  if (paidCount === 0) return 0.1;
  if (paidCount === 1) return 0.3;
  if (paidCount === 2) return 0.5;
  if (paidCount <= 5) return 0.7;
  if (paidCount <= 10) return 0.85;
  return 0.95;
}

/**
 * Get human-readable risk label.
 */
export function getRiskLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'low':
      return 'Low Risk';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High Risk';
    case 'critical':
      return 'Critical';
  }
}

/**
 * Get CSS classes for risk level badge.
 */
export function getRiskBadgeClasses(riskLevel: RiskLevel): string {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border';

  switch (riskLevel) {
    case 'low':
      return `${base} bg-emerald-500/20 text-emerald-400 border-emerald-500/30`;
    case 'medium':
      return `${base} bg-amber-500/20 text-amber-400 border-amber-500/30`;
    case 'high':
      return `${base} bg-orange-500/20 text-orange-400 border-orange-500/30`;
    case 'critical':
      return `${base} bg-rose-500/20 text-rose-400 border-rose-500/30`;
  }
}
