/**
 * Income Pattern Forecasting
 *
 * AI-powered income pattern analysis for freelancers.
 * Analyzes historical payment data to generate probabilistic forecasts.
 */

// Types
export type {
  DataQuality,
  IncomeTrend,
  IncomePayment,
  IncomeSourceHistory,
  IncomeSourceMetrics,
  SeasonalityPattern,
  MonthlyForecast,
  IncomePatternAnalysis,
  SerializedIncomePatternAnalysis,
  InvoiceForAnalysis,
  IncomeForAnalysis,
} from './types';

// Server-side analysis
export {
  generateIncomePatternAnalysis,
  serializeAnalysis,
  deserializeAnalysis,
} from './server';

// Source grouping
export {
  groupAllIncomeSources,
  getAllPayments,
  getPaymentDateRange,
} from './source-grouping';

// Metrics calculation
export { calculateSourceMetrics, calculateAllSourceMetrics } from './metrics-calculator';

// Trend analysis
export { analyzeTrend, analyzeSourceTrend } from './trend-analyzer';
export type { TrendAnalysisResult } from './trend-analyzer';

// Seasonality detection
export {
  detectSeasonality,
  getSeasonalMultiplier,
  formatSeasonalityPattern,
} from './seasonality-detector';
export type { SeasonalityResult } from './seasonality-detector';

// Forecast generation
export {
  generateMonthlyForecasts,
  calculate90DayTotals,
} from './forecast-generator';

// Monte Carlo integration
export {
  getLearnedIncomeVariance,
  getVarianceSummary,
} from './monte-carlo-integration';
export type { LearnedVariance } from './monte-carlo-integration';
