# Free Tier Limit Reduction (10 → 5)

**Date:** May 25, 2026 (Day 82)
**Status:** Implemented
**Related:** `docs/conversion-diagnosis.md`

---

## Problem

PostHog funnel analysis revealed **0% upgrade rate** despite strong engagement:

| Metric | Value | Assessment |
|--------|-------|------------|
| Signups | 8 (excl. owner) | — |
| Activation (bill <24h) | 100% | Excellent |
| Day 2-7 Retention | 100%+ | Excellent |
| Visited /pricing | 12.5% | Very low |
| Clicked Upgrade | 0% | Critical |
| Hit Feature Gate | 25% | Too low |

**Root Cause:** Invisible paywall. With 10 bills and 10 income sources allowed on free tier, users never hit limits and had no reason to upgrade.

---

## Solution Implemented

### 1. Reduced Free Tier Limits

| Resource | Before | After |
|----------|--------|-------|
| Bills | 10 | 5 |
| Income Sources | 10 | 5 |
| Forecast Days | 90 | 90 (unchanged) |

**Rationale:** Force users to hit limits faster, making the paywall visible. Most freelancers have 3-8 recurring bills, so 5 is a realistic "taste" that still requires upgrade for full use.

### 2. Added UsageIndicator Component

New component shows progress bars on dashboard for free tier users:

```
┌─────────────────────────────────────────────┐
│ Free Plan Usage          Upgrade for Unlimited → │
├─────────────────────────────────────────────┤
│ Bills        3/5  ████████░░░░░░░░░░░░      │
│ Income       2/5  █████░░░░░░░░░░░░░░░      │
└─────────────────────────────────────────────┘
```

**Color Logic:**
- Teal (0-59%): Normal usage
- Amber (60-79% or n-1): Near limit warning
- Rose (100%): Limit reached

**File:** `components/dashboard/usage-indicator.tsx`

### 3. Updated All User-Facing Copy

Files modified:
- `lib/stripe/config.ts` - Central tier configuration
- `components/dashboard/dashboard-content.tsx` - Added UsageIndicator
- `components/pricing/pricing-section.tsx` - Pricing table
- `components/subscription/upgrade-prompt.tsx` - Upgrade modal
- `components/landing/faq-section.tsx` - FAQ answers
- `components/seo/schemas.tsx` - Schema markup
- `app/compare/ynab/page.tsx`
- `app/compare/pulse/page.tsx`
- `app/compare/pocketsmith/page.tsx`
- `app/compare/mint/page.tsx`
- `app/compare/float/page.tsx`
- `app/compare/cash-flow-calendar-apps/page.tsx`

---

## Existing Users Impact

Users who already have >5 bills or >5 income sources:
- **Keep all existing entries** (no data deletion)
- **Cannot add NEW entries** until they upgrade or delete some
- Feature gate shows upgrade prompt when trying to add

**No migration email sent** — users discover naturally when they try to add more.

---

## Success Metrics (Monitor for 7-14 days)

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| % hitting feature gate | 25% | 50%+ | PostHog: `feature_gate_hit` events |
| % visiting /pricing | 12.5% | 30%+ | PostHog: pageview `/pricing` |
| Upgrade click rate | 0% | 10%+ | PostHog: `upgrade_button_clicked` |
| Actual conversions | 0 | 1+ | Stripe dashboard |

### PostHog Query (Feature Gate Hits)

```sql
SELECT
  COUNT(DISTINCT person.properties.email) as users_hit_gate
FROM events
WHERE event = 'feature_gate_hit'
  AND timestamp > now() - INTERVAL 14 DAY
  AND person.properties.email != 'omar.qouqas@gmail.com'
```

---

## If Conversions Still Don't Improve

### Option A: Tease Pro Features Earlier
- Show "365-day forecast" as grayed out on calendar with "Pro" badge
- Show "AI Assistant" in sidebar with lock icon
- Add "Unlock Invoicing" prompt when adding income

### Option B: Further Reduce Limits (Aggressive)
- Drop to 3 bills / 3 income sources
- Risk: May feel too restrictive for evaluation

### Option C: Time-Limited Pro Trial
- Offer 7-day Pro trial after signup
- Show what they lose when trial ends

### Option D: Usage-Based Nudges
- Email when user hits 4/5 bills: "You're almost at your limit"
- Dashboard banner at 80% usage

---

## Architecture Notes

All feature gating uses centralized `PRICING_TIERS` from `lib/stripe/config.ts`:

```typescript
export const PRICING_TIERS = {
  free: {
    limits: {
      maxBills: 5,      // Changed from 10
      maxIncome: 5,     // Changed from 10
      forecastDays: 90,
      // ...
    }
  },
  pro: {
    limits: {
      maxBills: Infinity,
      maxIncome: Infinity,
      // ...
    }
  }
}
```

**Key files using this config:**
- `lib/stripe/feature-gate.ts` - Server-side gating
- `lib/stripe/subscription.ts` - Limit checks
- `lib/hooks/use-subscription.ts` - Client-side gating
- `components/dashboard/usage-indicator.tsx` - Progress display

Changing limits in `config.ts` automatically propagates everywhere.

---

## Commits

1. `feat: reduce free tier limits from 10 to 5 bills/income` - Core implementation
2. `docs: update progress for Day 82 - free tier limit reduction` - Documentation
3. `docs: fix remaining 10 bills references to 5` - Cleanup
