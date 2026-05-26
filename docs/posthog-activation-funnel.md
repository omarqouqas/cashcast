# PostHog Activation → Conversion Funnel Queries

**Purpose:** Five HogQL queries that diagnose where the funnel breaks between signup and paid conversion. Run these whenever you need to know *why* signups aren't converting — before changing pricing, copy, or features.

**Run in:** PostHog → SQL editor (left sidebar).

**Filters required first:** Settings → Product analytics → "Filter out internal and test users" must be configured (email `!= doesn't equal` your test accounts, host regex excluding `localhost`/`127.0.0.1`) and "Enable this filter on all new insights" toggled on.

## Baseline snapshot — May 26, 2026 (last 30d)

| Metric | Value | Read |
|---|---|---|
| Signups | 8 | Top-of-funnel volume issue |
| Activated within 24h | 8 / 8 = 100% | Elite |
| Returned day 2–7 | 4 / 8 = 50% | Strong for n=8 |
| Visited `/pricing` | 2 / 8 = 25% | Reasonable visibility |
| Hit paywall | 1 / 8 = 12.5% | **The bottleneck** |
| Conversions | 0 | Free tier *is* the product |

**Diagnosis:** Not an activation/retention problem — free tier too generous and paywall moments too rare. The 1 user who hit paywall hit it 9 times and didn't upgrade — interview them.

## Q1 — Signups (30d)

```sql
SELECT count(DISTINCT person_id) AS total_signups
FROM events
WHERE event = 'user_signed_up'
  AND timestamp >= now() - INTERVAL 30 DAY;
```

## Q2 — Activated within 24h

```sql
WITH signups AS (
  SELECT person_id, min(timestamp) AS signup_ts
  FROM events
  WHERE event = 'user_signed_up' AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY person_id
)
SELECT count(DISTINCT e.person_id) AS activated
FROM events e
JOIN signups s ON e.person_id = s.person_id
WHERE e.event IN ('bill_added','income_added','onboarding_completed')
  AND dateDiff('hour', s.signup_ts, e.timestamp) BETWEEN 0 AND 24;
```

## Q3 — Returned day 2–7

```sql
WITH signups AS (
  SELECT person_id, min(timestamp) AS signup_ts
  FROM events
  WHERE event = 'user_signed_up' AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY person_id
)
SELECT count(DISTINCT e.person_id) AS returned
FROM events e
JOIN signups s ON e.person_id = s.person_id
WHERE dateDiff('day', s.signup_ts, e.timestamp) BETWEEN 1 AND 7;
```

## Q4 — Visited `/pricing`

```sql
SELECT count(DISTINCT person_id) AS visited_pricing
FROM events
WHERE event = '$pageview'
  AND properties.$pathname ILIKE '%/pricing%'
  AND person_id IN (
    SELECT person_id FROM events
    WHERE event = 'user_signed_up'
      AND timestamp >= now() - INTERVAL 30 DAY
  );
```

## Q5 — Hit paywall

```sql
SELECT count(DISTINCT person_id) AS hit_paywall
FROM events
WHERE event = 'feature_gate_hit'
  AND person_id IN (
    SELECT person_id FROM events
    WHERE event = 'user_signed_up'
      AND timestamp >= now() - INTERVAL 30 DAY
  );
```

## Interpreting funnel drops

| Drop happens at | What to fix |
|---|---|
| Signups → Activated | Onboarding / time-to-value |
| Activated → Day 2–7 return | Daily habit hook |
| Returned → Pricing visit | Pricing page invisibility |
| Pricing visit → Paywall hit | Free tier too generous |
| Paywall → Upgrade | Paywall UX/copy, or price/value mismatch |

## Known instrumentation gaps (May 2026)

These events do **not** exist yet — add them before any pricing experiment:

```ts
posthog.capture('pricing_page_viewed', { source });
posthog.capture('upgrade_button_clicked', { location, tier });
posthog.capture('checkout_started', { tier, price });
posthog.capture('subscription_created', { tier, price }); // from Stripe webhook
```

## Syntax notes

- HogQL (ClickHouse-flavored). Uses `properties.$pathname` dot notation, `INTERVAL`, `dateDiff('unit', a, b)`.
- The older `docs/PostHog queries.md` uses Postgres `->>` syntax — don't mix them.
- For low-volume periods, widen the window to `INTERVAL 90 DAY`.
