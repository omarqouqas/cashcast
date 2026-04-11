/**
 * Income Pattern Forecasting Types
 *
 * Types for analyzing historical income patterns and generating
 * probabilistic forecasts for freelancers with variable income.
 */

/**
 * Data quality level based on available payment history.
 * More data = better pattern detection.
 */
export type DataQuality = 'basic' | 'moderate' | 'good' | 'excellent';

/**
 * Income trend direction detected from historical data.
 */
export type IncomeTrend = 'growing' | 'stable' | 'declining';

/**
 * A single historical payment record.
 */
export interface IncomePayment {
  id: string;
  amount: number;
  date: Date;
  sourceId: string;
}

/**
 * Grouped payment history for an income source (client or recurring income).
 */
export interface IncomeSourceHistory {
  sourceId: string;
  name: string;
  email: string | null;
  payments: IncomePayment[];
}

/**
 * Statistical metrics calculated for an income source.
 */
export interface IncomeSourceMetrics {
  sourceId: string;
  name: string;
  paymentCount: number;

  // Amount statistics
  avgAmount: number;
  amountStdDev: number;
  amountCV: number; // Coefficient of variation (stdDev / mean)
  minAmount: number;
  maxAmount: number;

  // Timing statistics
  avgDaysBetween: number;
  timingStdDev: number;
  timingVariance: number; // Max days +/- for Monte Carlo
  detectedFrequency: string;

  // Trend analysis
  trend: IncomeTrend;
  trendConfidence: number; // 0-1

  // Reliability (based on payment count and consistency)
  reliabilityScore: number; // 0-100
}

/**
 * Seasonality pattern for a quarter.
 */
export interface SeasonalityPattern {
  quarter: 1 | 2 | 3 | 4;
  quarterLabel: string; // "Q1", "Q2", etc.
  multiplier: number; // e.g., 1.30 = +30% vs baseline
  percentChange: number; // e.g., 30 for +30%
  confidence: number; // 0-1
}

/**
 * Monthly forecast with probability ranges.
 */
export interface MonthlyForecast {
  month: Date;
  label: string; // "April 2026"
  p10: number; // 10th percentile (pessimistic)
  p50: number; // 50th percentile (expected)
  p90: number; // 90th percentile (optimistic)
}

/**
 * Complete income pattern analysis result.
 */
export interface IncomePatternAnalysis {
  /** When this analysis was generated */
  generatedAt: Date;

  /** Data quality based on months of history */
  dataQuality: DataQuality;

  /** Months of payment data available */
  monthsOfData: number;

  /** Number of unique income sources */
  sourceCount: number;

  /** Per-source metrics and analysis */
  sourceMetrics: IncomeSourceMetrics[];

  /** Seasonal patterns if detected */
  seasonality: SeasonalityPattern[];

  /** Whether meaningful seasonality was detected */
  seasonalityDetected: boolean;

  /** Overall portfolio trend */
  overallTrend: IncomeTrend;

  /** Overall trend confidence */
  overallTrendConfidence: number;

  /** 90-day probabilistic forecast (3 months) */
  forecast: MonthlyForecast[];

  /** Total expected income for 90 days */
  forecast90DaysP50: number;
  forecast90DaysP10: number;
  forecast90DaysP90: number;

  /** Debug: Monthly baseline from recurring income entries */
  debugFromRecurring: number;

  /** Debug: Monthly baseline from historical invoice sources */
  debugFromSources: number;

  /** Debug: Final blended monthly baseline */
  debugBaselineMonthly: number;
}

/**
 * Serialized version for passing from server to client.
 * Dates are converted to ISO strings.
 */
export interface SerializedIncomePatternAnalysis {
  generatedAt: string;
  dataQuality: DataQuality;
  monthsOfData: number;
  sourceCount: number;
  sourceMetrics: IncomeSourceMetrics[];
  seasonality: SeasonalityPattern[];
  seasonalityDetected: boolean;
  overallTrend: IncomeTrend;
  overallTrendConfidence: number;
  forecast: Array<{
    month: string;
    label: string;
    p10: number;
    p50: number;
    p90: number;
  }>;
  forecast90DaysP50: number;
  forecast90DaysP10: number;
  forecast90DaysP90: number;
  debugFromRecurring: number;
  debugFromSources: number;
  debugBaselineMonthly: number;
}

/**
 * Invoice data needed for pattern analysis.
 */
export interface InvoiceForAnalysis {
  id: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  due_date: string | null;
  status: string | null;
  paid_at: string | null;
  sent_at: string | null;
  created_at: string | null;
}

/**
 * Income record data needed for pattern analysis.
 */
export interface IncomeForAnalysis {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  next_date: string | null;
  last_date: string | null;
  is_active: boolean | null;
  invoice_id: string | null;
}
