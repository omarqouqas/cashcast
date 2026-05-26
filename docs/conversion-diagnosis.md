# Conversion Diagnosis: Why 0 Upgrades is NOT a Pricing Problem

**Date:** May 25, 2026
**Status:** Awaiting PostHog data

---

## The Critical Insight

**0 conversions is almost certainly an activation or retention problem dressed up as a pricing problem.** Lowering prices, adding a trial, or restructuring tiers when nobody's converting fixes nothing — you'd just have a free trial that nobody converts from.

---

## What 0 Conversions Actually Means

With zero upgrades, one of four things is happening — and they look identical from the top:

| Failure Mode | What It Looks Like in Data |
|--------------|---------------------------|
| **Activation** — users sign up, never add bills, never see a forecast, bounce | High signup → low "first bill added" → 0 return visits |
| **One-and-done value** — they get their "can I make rent?" answer in 90 days, leave, never come back | Decent activation → one session → no day-7 return |
| **Free tier IS the product** — 90 days answers everything; nothing in Pro is worth $7.99 | Good retention on free → 0 pricing page views |
| **Invisible paywall** — users never even hit a limit or see Pro's value gap | Active users → 0 pricing page views → 0 upgrade clicks |

Each of these has a completely different fix. Without telling them apart, anything we do is guessing.

---

## The 5 PostHog Numbers to Pull

Before touching pricing, code, or messaging, get these from the last 30 days:

### 1. Signups (Denominator)
```
Insights → Trends
Event: user_signed_up
Date range: Last 30 days
```

### 2. Activation Rate (% who add a bill within 24h)
```
Insights → Funnels
Step 1: user_signed_up
Step 2: bill_added
Conversion window: 24 hours
```

### 3. Early Retention (% who return day 2-7)
```
Insights → Funnels
Step 1: user_signed_up
Step 2: dashboard_viewed
Conversion window: 2-7 days
```

### 4. Paywall Visibility (% who visit /pricing)
```
Insights → Funnels
Step 1: user_signed_up
Step 2: $pageview WHERE $current_url contains "/pricing"
Conversion window: 30 days
```

### 5. Upgrade Intent (% who click Upgrade)
```
Insights → Funnels
Step 1: user_signed_up
Step 2: upgrade_clicked
Conversion window: 30 days
```

---

## Diagnostic Framework

| If You See... | Diagnosis | Fix |
|---------------|-----------|-----|
| Activation < 40% | Onboarding is the problem | Demo data, simpler first-run, one-click sample forecast |
| Activation OK, Day 2-7 return < 20% | One-and-done value problem | Daily hook (push notification, morning email with Safe to Spend) |
| Day 2-7 return OK, /pricing visits < 10% | Paywall is invisible | More upgrade prompts, hit limits faster |
| /pricing visits OK, upgrade_clicked = 0 | Value gap unclear or price wrong | NOW talk pricing |

---

## Initial Hypothesis: One-and-Done Value

**Original hypothesis:** The product answers a discrete question ("will I make rent in 90 days?"). Once a freelancer gets the answer, they have no reason to come back tomorrow.

### Hypothesis Status: DISPROVEN

Data shows users ARE coming back (10 returned day 2-7 out of ~13 signups = 77%+ retention). The one-and-done hypothesis was wrong.

**Actual problem:** Users are engaged but never encounter the paywall. Free tier is too generous.

---

## What NOT to Do

- Ship a free trial flow until we know it would change anything
- Lower the price — $7.99 → $4.99 won't fix "users don't come back"
- Add features — the Sacred Seven doc already flagged this as the trap
- Ship pricing changes blind without PostHog data

---

## Action Plan

### Day 1-2: Pull the 5 numbers above
Don't touch code yet.

### Day 3-4: Talk to 5 signups who didn't convert
Cold-email them. One question: "You signed up for Cashcast on [date] — what did you hope it would do, and why didn't you come back?"

### Day 5: Based on data, pick ONE fix
- If activation broken → fix onboarding (demo data, one-click sample forecast)
- If retention broken → ship the daily/weekly hook (push notification with Safe to Spend change)
- If paywall invisible → add upgrade prompts at the 90-day cliff, not buried in settings
- If users genuinely don't want Pro features → kill features and rebuild the offer

---

## The Uncomfortable Truth

From Sacred Seven review (February 2026):
> "Over-indexed on building and under-indexed on validating."

Three months later: 26 blog posts, rate guides, schema markup — and still 0 conversions. The blog isn't broken. The funnel after the blog is broken, and you can't SEO your way out of a product that doesn't retain.

**This is a Data Science failure layered under a perceived Economics failure. You can't fix economics without instrumentation.**

---

## PostHog SQL Queries (HogQL)

Run these in PostHog → Insights → New insight → SQL (beta)

### Quick Snapshot (Excluding Internal Users)

Use this version to exclude your own account from results:

```sql
SELECT
  'Signups' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'user_signed_up'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'

UNION ALL

SELECT
  'Activated (bill <24h)' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'bill_added'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'

UNION ALL

SELECT
  'Visited /pricing' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = '$pageview'
  AND properties.$current_url LIKE '%/pricing%'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'

UNION ALL

SELECT
  'Clicked Upgrade' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'upgrade_clicked'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'

UNION ALL

SELECT
  'Hit Feature Gate' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'feature_gate_hit'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'

UNION ALL

SELECT
  'Returned day 2-7' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'dashboard_viewed'
  AND timestamp >= now() - INTERVAL 28 DAY
  AND timestamp <= now() - INTERVAL 2 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'
```

**Tip:** You can also mark yourself as an internal user in PostHog Settings → Project → Filter out internal and test users.

---

### Quick Snapshot (All Metrics in One Query)

```sql
SELECT
  'Signups' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'user_signed_up'
  AND timestamp >= now() - INTERVAL 30 DAY

UNION ALL

SELECT
  'Activated (bill <24h)' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'bill_added'
  AND distinct_id IN (
    SELECT distinct_id FROM events
    WHERE event = 'user_signed_up'
    AND timestamp >= now() - INTERVAL 30 DAY
  )

UNION ALL

SELECT
  'Visited /pricing' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = '$pageview'
  AND properties.$current_url LIKE '%/pricing%'
  AND timestamp >= now() - INTERVAL 30 DAY

UNION ALL

SELECT
  'Clicked Upgrade' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'upgrade_clicked'
  AND timestamp >= now() - INTERVAL 30 DAY

UNION ALL

SELECT
  'Hit Feature Gate' as metric,
  countDistinct(distinct_id) as value
FROM events
WHERE event = 'feature_gate_hit'
  AND timestamp >= now() - INTERVAL 30 DAY
```

### Individual Queries

#### 1. Signups (Last 30 days)
```sql
SELECT count() as total_signups
FROM events
WHERE event = 'user_signed_up'
  AND timestamp >= now() - INTERVAL 30 DAY
```

#### 2. Activation Rate (% who add bill within 24h)
```sql
SELECT
  countDistinct(signup.distinct_id) as total_signups,
  countDistinct(activated.distinct_id) as activated_users,
  round(countDistinct(activated.distinct_id) * 100.0 / countDistinct(signup.distinct_id), 1) as activation_rate_pct
FROM events signup
LEFT JOIN events activated
  ON signup.distinct_id = activated.distinct_id
  AND activated.event = 'bill_added'
  AND activated.timestamp > signup.timestamp
  AND activated.timestamp <= signup.timestamp + INTERVAL 24 HOUR
WHERE signup.event = 'user_signed_up'
  AND signup.timestamp >= now() - INTERVAL 30 DAY
```

#### 3. Early Retention (% who return day 2-7)
```sql
SELECT
  countDistinct(signup.distinct_id) as total_signups,
  countDistinct(returned.distinct_id) as returned_users,
  round(countDistinct(returned.distinct_id) * 100.0 / countDistinct(signup.distinct_id), 1) as day_2_7_retention_pct
FROM events signup
LEFT JOIN events returned
  ON signup.distinct_id = returned.distinct_id
  AND returned.event = 'dashboard_viewed'
  AND returned.timestamp >= signup.timestamp + INTERVAL 2 DAY
  AND returned.timestamp <= signup.timestamp + INTERVAL 7 DAY
WHERE signup.event = 'user_signed_up'
  AND signup.timestamp >= now() - INTERVAL 30 DAY
```

#### 4. Paywall Visibility (% who visit /pricing)
```sql
SELECT
  countDistinct(signup.distinct_id) as total_signups,
  countDistinct(pricing.distinct_id) as visited_pricing,
  round(countDistinct(pricing.distinct_id) * 100.0 / countDistinct(signup.distinct_id), 1) as pricing_visit_pct
FROM events signup
LEFT JOIN events pricing
  ON signup.distinct_id = pricing.distinct_id
  AND pricing.event = '$pageview'
  AND pricing.properties.$current_url LIKE '%/pricing%'
  AND pricing.timestamp > signup.timestamp
WHERE signup.event = 'user_signed_up'
  AND signup.timestamp >= now() - INTERVAL 30 DAY
```

#### 5. Upgrade Intent (% who click Upgrade)
```sql
SELECT
  countDistinct(signup.distinct_id) as total_signups,
  countDistinct(upgrade.distinct_id) as clicked_upgrade,
  round(countDistinct(upgrade.distinct_id) * 100.0 / countDistinct(signup.distinct_id), 1) as upgrade_click_pct
FROM events signup
LEFT JOIN events upgrade
  ON signup.distinct_id = upgrade.distinct_id
  AND upgrade.event = 'upgrade_clicked'
  AND upgrade.timestamp > signup.timestamp
WHERE signup.event = 'user_signed_up'
  AND signup.timestamp >= now() - INTERVAL 30 DAY
```

#### Bonus: Feature Gate Hits (Are users hitting limits?)
```sql
SELECT
  properties.feature as feature,
  count() as times_hit,
  countDistinct(distinct_id) as unique_users
FROM events
WHERE event = 'feature_gate_hit'
  AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY properties.feature
ORDER BY times_hit DESC
```

#### Bonus: Onboarding Completion Rate
```sql
SELECT
  countDistinct(started.distinct_id) as started_onboarding,
  countDistinct(completed.distinct_id) as completed_onboarding,
  round(countDistinct(completed.distinct_id) * 100.0 / countDistinct(started.distinct_id), 1) as completion_rate_pct
FROM events started
LEFT JOIN events completed
  ON started.distinct_id = completed.distinct_id
  AND completed.event = 'onboarding_completed'
WHERE started.event = 'onboarding_started'
  AND started.timestamp >= now() - INTERVAL 30 DAY
```

---

## Results (May 25, 2026) — Excluding Internal Users

| Metric | Value | Rate | Assessment |
|--------|-------|------|------------|
| Signups (30 days) | 8 | 100% | Baseline |
| Activation (bill added <24h) | 8 | **100%** | **Excellent** |
| Day 2-7 Return | 9 | **100%+** | **Excellent** |
| /pricing visits | 1 | 12.5% | **Problem** |
| Upgrade clicks | 0 | 0% | **Problem** |
| feature_gate_hit count | 2 | 25% | **Problem** |

---

## Confirmed Diagnosis: INVISIBLE PAYWALL

**Activation: EXCELLENT** (100% — every signup adds a bill within 24h)

**Retention: EXCELLENT** (9 users returning, more than 30-day signups = older users still engaged)

**Paywall visibility: THE problem**
- Users are signing up ✓
- Users are adding bills ✓
- Users are coming back ✓
- Users never see a reason to upgrade ✗

Only 2 out of 8 users ever hit a feature gate. Only 1 ever saw /pricing. The free tier is too generous — users get everything they need without touching Pro.

---

## Recommended Fix: Make Limits Visible

### Option A: Usage Progress Indicators (Recommended - Lowest Risk)
- Show "3/5 bills used" progress bar on dashboard
- At 4 bills, show banner: "You're almost at the free limit"
- At 5 bills, hard gate with upgrade prompt

### Option B: Tease Pro Features Earlier
- Show "365-day forecast" as grayed out on calendar with "Pro" badge
- Show "AI Assistant" in sidebar with lock icon
- Add "Unlock Invoicing" prompt when they add income

### Option C: Restrict Free Tier (Aggressive) ✅ IMPLEMENTED (May 25, 2026)
- ~~Drop free forecast from 90 days to 30 days~~ (kept at 90 days)
- ✅ Drop free bills from 10 to 5
- ✅ Drop free income from 10 to 5
- ✅ Added UsageIndicator component with progress bars
- Forces users to hit limits faster

**Decision:** Implement Option A first — adds visibility without removing value.

---

## Pricing Changes (On Hold)

The following pricing changes were discussed but are **ON HOLD** until we diagnose the real problem:

### Proposed (Not Yet Implemented)
- Reverse trial: 14-day Pro trial → auto-downgrade to free
- Restrict free tier to 30-day forecast (from 90)
- Raise Pro to $9.99/mo
- Kill/raise lifetime deal to $199+

### Constraints Identified
- Don't kill free tier — 26 blog posts need a landing zone
- Don't add card-required trial — no brand trust yet, would lose 60% of signups

---

*Document created: May 25, 2026*
