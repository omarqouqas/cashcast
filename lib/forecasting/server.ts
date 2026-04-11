/**
 * Server-side Income Pattern Analysis
 *
 * Main entry point for generating income pattern analysis.
 * Called from server components (dashboard, insights page).
 */

import { createClient } from '@/lib/supabase/server';
import type {
  DataQuality,
  IncomePatternAnalysis,
  InvoiceForAnalysis,
  IncomeForAnalysis,
  SerializedIncomePatternAnalysis,
} from './types';
import {
  groupAllIncomeSources,
  getAllPayments,
  getPaymentDateRange,
} from './source-grouping';
import { calculateAllSourceMetrics } from './metrics-calculator';
import { analyzeTrend } from './trend-analyzer';
import { detectSeasonality } from './seasonality-detector';
import {
  generateMonthlyForecasts,
  calculate90DayTotals,
} from './forecast-generator';

/**
 * Determine data quality based on months of history.
 */
function determineDataQuality(monthsOfData: number): DataQuality {
  if (monthsOfData >= 12) return 'excellent';
  if (monthsOfData >= 6) return 'good';
  if (monthsOfData >= 3) return 'moderate';
  return 'basic';
}

/**
 * Generate complete income pattern analysis for a user.
 *
 * This function:
 * 1. Fetches paid invoices and income records
 * 2. Groups income by source (client/name)
 * 3. Calculates metrics for each source
 * 4. Detects overall trend and seasonality
 * 5. Generates 90-day probabilistic forecast
 *
 * @param userId - User ID to generate analysis for
 * @returns Income pattern analysis or null if insufficient data
 */
export async function generateIncomePatternAnalysis(
  userId: string
): Promise<IncomePatternAnalysis | null> {
  const supabase = await createClient();

  // Calculate date range for fetching invoices (last 24 months)
  const twentyFourMonthsAgo = new Date();
  twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);
  const cutoffDate = twentyFourMonthsAgo.toISOString().split('T')[0];

  // Fetch data in parallel
  const [invoicesResult, incomeResult] = await Promise.all([
    supabase
      .from('invoices')
      .select(
        'id, client_name, client_email, amount, due_date, status, paid_at, sent_at, created_at'
      )
      .eq('user_id', userId)
      .eq('status', 'paid')
      .gte('paid_at', cutoffDate)
      .order('paid_at', { ascending: true }),
    supabase
      .from('income')
      .select(
        'id, name, amount, frequency, next_date, last_date, is_active, invoice_id'
      )
      .eq('user_id', userId),
  ]);

  const invoices = (invoicesResult.data || []) as InvoiceForAnalysis[];
  const incomeRecords = (incomeResult.data || []) as IncomeForAnalysis[];

  // Group income by source
  const sources = groupAllIncomeSources(invoices, incomeRecords);

  // If no sources with payments, return null
  if (sources.length === 0) {
    return null;
  }

  // Get all payments and calculate date range
  const allPayments = getAllPayments(sources);

  if (allPayments.length === 0) {
    return null;
  }

  const { monthsOfData } = getPaymentDateRange(allPayments);

  // Calculate metrics for each source
  const sourceMetrics = calculateAllSourceMetrics(sources);

  // Analyze overall trend
  const trendResult = analyzeTrend(allPayments);

  // Detect seasonality
  const seasonalityResult = detectSeasonality(allPayments, monthsOfData);

  // Generate 90-day forecast
  const forecastResult = generateMonthlyForecasts(
    sourceMetrics,
    incomeRecords,
    seasonalityResult.patterns
  );

  const totals90Days = calculate90DayTotals(forecastResult.forecasts);

  // Determine data quality
  const dataQuality = determineDataQuality(monthsOfData);

  return {
    generatedAt: new Date(),
    dataQuality,
    monthsOfData,
    sourceCount: sources.length,
    sourceMetrics,
    seasonality: seasonalityResult.patterns,
    seasonalityDetected: seasonalityResult.detected,
    overallTrend: trendResult.trend,
    overallTrendConfidence: trendResult.confidence,
    forecast: forecastResult.forecasts,
    forecast90DaysP50: totals90Days.p50,
    forecast90DaysP10: totals90Days.p10,
    forecast90DaysP90: totals90Days.p90,
    debugFromRecurring: forecastResult.debugFromRecurring,
    debugFromSources: forecastResult.debugFromSources,
    debugBaselineMonthly: forecastResult.debugBaselineMonthly,
  };
}

/**
 * Serialize income pattern analysis for client components.
 * Converts Date objects to ISO strings.
 */
export function serializeAnalysis(
  analysis: IncomePatternAnalysis
): SerializedIncomePatternAnalysis {
  return {
    ...analysis,
    generatedAt: analysis.generatedAt.toISOString(),
    forecast: analysis.forecast.map((f) => ({
      ...f,
      month: f.month.toISOString(),
    })),
  };
}

/**
 * Deserialize income pattern analysis from client.
 * Converts ISO strings back to Date objects.
 */
export function deserializeAnalysis(
  serialized: SerializedIncomePatternAnalysis
): IncomePatternAnalysis {
  return {
    ...serialized,
    generatedAt: new Date(serialized.generatedAt),
    forecast: serialized.forecast.map((f) => ({
      ...f,
      month: new Date(f.month),
    })),
  };
}
