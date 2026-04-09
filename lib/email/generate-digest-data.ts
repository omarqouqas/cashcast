import 'server-only';

import generateCalendar from '@/lib/calendar/generate';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRICING_TIERS, normalizeSubscriptionTier, type SubscriptionTier } from '@/lib/stripe/config';
import { generateAlerts, buildAlertContext } from '@/lib/alerts';
import { generateAIInsights } from './generate-ai-insights';
import type { DigestData, DigestAlert } from './types';

export type { DigestData };

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export async function generateDigestData(userId: string): Promise<DigestData | null> {
  const supabase = createAdminClient();

  const [
    { data: userRow, error: userErr },
    { data: settingsRow, error: settingsErr },
    { data: subscriptionRow, error: subscriptionErr },
  ] =
    await Promise.all([
      supabase
        .from('users')
        .select('id,email,full_name')
        .eq('id', userId)
        .maybeSingle(),
      supabase
        .from('user_settings')
        .select(
          'timezone,safety_buffer,currency,email_digest_enabled,email_digest_day,email_digest_time,last_digest_sent_at'
        )
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('subscriptions')
        .select('tier,status')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

  if (userErr) throw new Error(userErr.message);
  if (!userRow) return null;
  if (settingsErr) throw new Error(settingsErr.message);
  if (subscriptionErr) throw new Error(subscriptionErr.message);

  const settings = settingsRow as any;
  const timezone = settings?.timezone ?? null;
  const safetyBuffer = settings?.safety_buffer ?? 500;

  const activeTier: SubscriptionTier = (() => {
    const tier = normalizeSubscriptionTier(subscriptionRow?.tier, 'free');
    const status = (subscriptionRow?.status ?? '').toLowerCase();
    const isActive = status === 'active' || status === 'trialing';
    if (!isActive) return 'free';
    // Premium is sunset pre-launch; treat legacy premium as Pro-equivalent for entitlements.
    return tier === 'premium' ? 'pro' : tier;
  })();

  const forecastDays = PRICING_TIERS[activeTier].limits.forecastDays;

  const [accountsRes, incomeRes, billsRes, invoicesRes] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('income').select('*').eq('user_id', userId),
    supabase.from('bills').select('*').eq('user_id', userId),
    supabase.from('invoices').select('id, client_name, amount, due_date, status').eq('user_id', userId).or('status.is.null,status.neq.paid'),
  ]);

  if (accountsRes.error) throw new Error(accountsRes.error.message);
  if (incomeRes.error) throw new Error(incomeRes.error.message);
  if (billsRes.error) throw new Error(billsRes.error.message);
  if (invoicesRes.error) throw new Error(invoicesRes.error.message);

  const accounts = (accountsRes.data ?? []) as any[];
  const hasAccounts = accounts.length > 0;
  if (!hasAccounts) return null;

  const income = (incomeRes.data ?? []) as any[];
  const bills = (billsRes.data ?? []) as any[];
  const invoices = (invoicesRes.data ?? []) as any[];

  const calendar = generateCalendar(accounts, income, bills, safetyBuffer, timezone ?? undefined, forecastDays);
  const weekDays = calendar.days.slice(0, 7);
  const startDay = weekDays[0];
  const endDay = weekDays[weekDays.length - 1];
  if (!startDay || !endDay) return null;

  const incomeOccurrences = weekDays.flatMap((d) => d.income ?? []);
  const billOccurrences = weekDays.flatMap((d) => d.bills ?? []);

  const totalIncome = sum(incomeOccurrences.map((t) => t.amount ?? 0));
  const totalBills = sum(billOccurrences.map((t) => t.amount ?? 0));
  const netChange = totalIncome - totalBills;

  let lowestBalance = startDay.balance;
  let lowestBalanceDate = new Date(startDay.date);
  for (const d of weekDays) {
    if (d.balance < lowestBalance) {
      lowestBalance = d.balance;
      lowestBalanceDate = new Date(d.date);
    }
  }

  const weekStartMs = startDay.date.getTime();
  const weekEndMs = endDay.date.getTime();

  const collisionsInWeek =
    calendar.collisions?.collisions?.filter((c) => {
      const t = new Date(c.date).getTime();
      return t >= weekStartMs && t <= weekEndMs;
    }) ?? [];

  const currency =
    (settingsRow?.currency ?? '').trim() ||
    (accounts.find((a) => (a.currency ?? '').trim())?.currency ?? '').trim() ||
    'USD';

  const upcomingBills = billOccurrences
    .map((b) => ({ name: b.name, amount: b.amount, date: new Date(b.date) }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const upcomingIncome = incomeOccurrences
    .map((i) => ({ name: i.name, amount: i.amount, date: new Date(i.date) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Generate proactive alerts
  let proactiveAlerts: DigestAlert[] = [];
  try {
    const alertContext = buildAlertContext({
      safetyBuffer,
      currency,
      calendarDays: calendar.days,
      invoices: invoices.map((inv: any) => ({
        id: inv.id,
        client_name: inv.client_name,
        amount: inv.amount,
        due_date: inv.due_date,
        status: inv.status,
      })),
      bills: bills.map((b: any) => ({
        id: b.id,
        name: b.name,
        amount: b.amount,
        frequency: b.frequency,
        due_date: b.due_date,
      })),
      income: income.map((i: any) => ({
        id: i.id,
        name: i.name,
        amount: i.amount,
        frequency: i.frequency,
        next_date: i.next_date,
      })),
    });
    const alerts = generateAlerts(alertContext);
    proactiveAlerts = alerts.map((alert) => ({
      type: alert.type,
      priority: alert.priority,
      title: alert.title,
      message: alert.message,
    }));
  } catch (error) {
    console.error('Failed to generate proactive alerts for digest:', error);
  }

  // Build digest data (without AI insights first)
  const digestData: DigestData = {
    user: {
      id: userRow.id,
      email: userRow.email,
      name: userRow.full_name ?? null,
    },
    weekRange: {
      start: new Date(startDay.date),
      end: new Date(endDay.date),
    },
    summary: {
      totalIncome,
      totalBills,
      netChange,
      startingBalance: calendar.startingBalance,
      lowestBalance,
      lowestBalanceDate,
      endingBalance: endDay.balance,
    },
    alerts: {
      hasLowBalance: lowestBalance < safetyBuffer,
      hasOverdraftRisk: lowestBalance < 0,
      hasBillCollisions: collisionsInWeek.length > 0,
      collisionCount: collisionsInWeek.length,
    },
    upcomingBills,
    upcomingIncome,
    currency,
    timezone,
    safetyBuffer,
    proactiveAlerts,
  };

  // Generate AI insights
  try {
    digestData.aiInsights = await generateAIInsights(digestData);
  } catch (error) {
    console.error('Failed to generate AI insights for digest:', error);
    digestData.aiInsights = [];
  }

  return digestData;
}


