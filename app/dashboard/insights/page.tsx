import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { generateIncomePatternAnalysis, serializeAnalysis } from '@/lib/forecasting';
import { InsightsContent } from '@/components/insights/insights-content';

export const metadata = {
  title: 'Income Insights | Cashcast',
  description: 'AI-powered income pattern analysis and forecasting',
};

export default async function InsightsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch user settings for currency
  const [settingsResult, patternAnalysis] = await Promise.all([
    supabase
      .from('user_settings')
      .select('currency')
      .eq('user_id', user.id)
      .single(),
    generateIncomePatternAnalysis(user.id),
  ]);

  const currency = settingsResult.data?.currency ?? 'USD';
  const serializedAnalysis = patternAnalysis
    ? serializeAnalysis(patternAnalysis)
    : null;

  return (
    <InsightsContent
      analysis={serializedAnalysis}
      currency={currency}
    />
  );
}
