/**
 * Client Payment Risk Scoring Types
 *
 * Predicts invoice payment timing based on client payment history
 * and assigns risk levels for cash flow forecasting.
 */

/**
 * Historical payment data for a specific client.
 * Aggregated from all paid invoices for that client.
 */
export interface ClientPaymentHistory {
  /** Client name (used as identifier along with email) */
  clientName: string;
  /** Client email (may be null) */
  clientEmail: string | null;
  /** Total number of invoices sent to this client */
  totalInvoices: number;
  /** Number of invoices that have been paid */
  paidInvoices: number;
  /** Average days from sent_at to paid_at */
  avgDaysToPayment: number;
  /** Average days late (negative = early, positive = late) */
  avgDaysLate: number;
  /** Payment trend over recent invoices */
  paymentTrend: PaymentTrend;
  /** Date of most recent payment (ISO string) */
  lastPaymentDate: string | null;
  /** Average invoice amount for this client */
  avgInvoiceAmount: number;
}

/**
 * Payment trend direction based on recent invoice history.
 */
export type PaymentTrend = 'improving' | 'stable' | 'worsening';

/**
 * Risk level categories with thresholds.
 * - low: 0-25 (on time or early)
 * - medium: 26-50 (1-7 days late)
 * - high: 51-75 (8-14 days late)
 * - critical: 76-100 (15+ days late)
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Individual factor contributing to the risk score.
 */
export interface RiskFactor {
  /** Factor name for display */
  name: string;
  /** Whether this factor increases or decreases risk */
  impact: 'positive' | 'negative';
  /** Human-readable description */
  description: string;
  /** Contribution to overall score (can be negative for positive factors) */
  contribution: number;
}

/**
 * Complete payment risk assessment for an invoice.
 */
export interface PaymentRiskScore {
  /** Overall risk score (0-100) */
  score: number;
  /** Categorized risk level */
  riskLevel: RiskLevel;
  /** Predicted payment date (ISO string) */
  expectedPaymentDate: string;
  /** Expected days late from due date (negative = early) */
  expectedDaysLate: number;
  /** Confidence in the prediction (0-1) */
  confidence: number;
  /** Breakdown of contributing factors */
  factors: RiskFactor[];
}

/**
 * Invoice data needed for risk calculation.
 * Subset of full invoice type.
 */
export interface InvoiceForRisk {
  id: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  due_date: string;
  sent_at: string | null;
  paid_at: string | null;
  status: string | null;
  created_at: string | null;
}

/**
 * Risk level thresholds for scoring.
 */
export const RISK_THRESHOLDS = {
  low: 25,
  medium: 50,
  high: 75,
  // critical: everything above 75
} as const;

/**
 * Weight configuration for risk factors.
 * Weights should sum to 1.0 (100%).
 */
export const RISK_WEIGHTS = {
  historicalLateness: 0.40,  // 40% - avg days late
  paymentTrend: 0.20,        // 20% - improving/stable/worsening
  invoiceAmount: 0.15,       // 15% - compared to typical
  paymentRate: 0.15,         // 15% - paid / total invoices
  recency: 0.10,             // 10% - days since last payment
} as const;
