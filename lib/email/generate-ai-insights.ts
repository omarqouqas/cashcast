import 'server-only';

import { createAnthropicClient } from '@/lib/ai/client';
import { formatCurrency } from '@/lib/utils/format';
import type { DigestData } from './generate-digest-data';

export interface AIInsight {
  emoji: string;
  text: string;
}

/**
 * Generate personalized AI insights for the weekly digest email.
 * Uses Claude Haiku for cost efficiency (potentially thousands of emails/week).
 * Returns 2-3 short, actionable insights.
 */
export async function generateAIInsights(data: DigestData): Promise<AIInsight[]> {
  // Skip AI if no meaningful data
  if (data.upcomingBills.length === 0 && data.upcomingIncome.length === 0) {
    return [];
  }

  const client = createAnthropicClient();
  const currency = data.currency || 'USD';

  // Build context for Claude
  const context = buildContext(data, currency);

  try {
    const response = await client.messages.create({
      // Use Haiku for cost efficiency on bulk emails
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `You are a friendly financial assistant for Cashcast, a cash flow forecasting app. Based on this user's weekly financial data, provide 2-3 brief, personalized insights. Each insight should be 1 sentence, actionable when possible, and encouraging in tone.

${context}

Respond with a JSON array of objects, each with "emoji" (single emoji) and "text" (the insight). Example:
[{"emoji": "💡", "text": "Your net positive week means you could add $50 to savings."}]

Rules:
- Keep insights specific to their data, not generic advice
- Be encouraging, not alarming (even for tight weeks)
- Focus on opportunities, not problems
- No markdown, just plain text
- Maximum 3 insights`,
        },
      ],
    });

    // Extract text from response
    const textBlock = response.content.find((block: { type: string }) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return getDefaultInsights(data, currency);
    }

    // Parse JSON response
    const parsed = JSON.parse(textBlock.text) as AIInsight[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getDefaultInsights(data, currency);
    }

    // Validate and sanitize
    return parsed
      .slice(0, 3)
      .filter((item) => item.emoji && item.text)
      .map((item) => ({
        emoji: String(item.emoji).slice(0, 2), // Ensure single emoji
        text: String(item.text).slice(0, 200), // Cap length
      }));
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    return getDefaultInsights(data, currency);
  }
}

function buildContext(data: DigestData, currency: string): string {
  const lines: string[] = [];

  // Summary
  lines.push('WEEKLY SUMMARY:');
  lines.push(`- Total income: ${formatCurrency(data.summary.totalIncome, currency)}`);
  lines.push(`- Total bills: ${formatCurrency(data.summary.totalBills, currency)}`);
  lines.push(`- Net change: ${formatCurrency(data.summary.netChange, currency)}`);
  lines.push(`- Starting balance: ${formatCurrency(data.summary.startingBalance, currency)}`);
  lines.push(`- Lowest balance: ${formatCurrency(data.summary.lowestBalance, currency)}`);
  lines.push(`- Ending balance: ${formatCurrency(data.summary.endingBalance, currency)}`);

  // Alerts
  if (data.alerts.hasOverdraftRisk) {
    lines.push(`- WARNING: Overdraft risk (balance goes negative)`);
  } else if (data.alerts.hasLowBalance) {
    lines.push(`- CAUTION: Balance drops below safety buffer of ${formatCurrency(data.safetyBuffer ?? 500, currency)}`);
  }
  if (data.alerts.hasBillCollisions) {
    lines.push(`- ${data.alerts.collisionCount} day(s) with multiple bills due`);
  }

  // Bills
  if (data.upcomingBills.length > 0) {
    lines.push('\nUPCOMING BILLS:');
    data.upcomingBills.forEach((b) => {
      lines.push(`- ${b.name}: ${formatCurrency(b.amount, currency)}`);
    });
  }

  // Income
  if (data.upcomingIncome.length > 0) {
    lines.push('\nEXPECTED INCOME:');
    data.upcomingIncome.forEach((i) => {
      lines.push(`- ${i.name}: ${formatCurrency(i.amount, currency)}`);
    });
  }

  return lines.join('\n');
}

/**
 * Fallback insights when AI call fails.
 * These are based on simple rules from the data.
 */
function getDefaultInsights(data: DigestData, currency: string): AIInsight[] {
  const insights: AIInsight[] = [];

  // Net positive week
  if (data.summary.netChange > 0) {
    insights.push({
      emoji: '📈',
      text: `Great week ahead! You're projected to be ${formatCurrency(data.summary.netChange, currency)} in the green.`,
    });
  }

  // Tight week warning
  if (data.alerts.hasLowBalance && !data.alerts.hasOverdraftRisk) {
    insights.push({
      emoji: '👀',
      text: `Keep an eye on your balance around ${formatDateShort(data.summary.lowestBalanceDate)} when it dips to ${formatCurrency(data.summary.lowestBalance, currency)}.`,
    });
  }

  // Bill collision tip
  if (data.alerts.hasBillCollisions) {
    insights.push({
      emoji: '📅',
      text: `You have ${data.alerts.collisionCount} day(s) with multiple bills. Consider spacing them out if possible.`,
    });
  }

  // No bills celebration
  if (data.upcomingBills.length === 0 && data.upcomingIncome.length > 0) {
    insights.push({
      emoji: '🎉',
      text: `No bills due this week—perfect time to boost your savings or emergency fund.`,
    });
  }

  return insights.slice(0, 3);
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
