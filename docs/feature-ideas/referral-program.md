# Referral Program - Implementation Plan

## Market Research

**Source:** Micro-SaaS Ideas Database Analysis

"Referral Program" appears as a growth tactic in 25+ successful micro-SaaS products, including:
- Row 79: PDF bank statement extraction ($40K/mo) — exact ICP match
- Row 53: Shopify bundles app ($55K/mo)
- Row 76: Airtable connector ($23K/mo)
- Row 80: SMS marketing for eCommerce ($12K/mo)

**Competitive Analysis:**
- Cash Flow Calendar: No referral program
- YNAB: No referral program
- Monarch Money: No referral program
- Copilot: No referral program

**Opportunity:** First-mover advantage in our category.

---

## Overview

Implement a referral system where existing users can invite friends and earn rewards when those friends become paying customers.

**Problem it solves:** User acquisition is expensive. Word of mouth is our #1 growth tactic (per database analysis). A structured referral program amplifies organic growth.

---

## Strategic Fit

1. **Low CAC acquisition** — Referrals cost less than paid ads
2. **High-quality leads** — Referred users have higher LTV
3. **Compounds over time** — Each new user can refer more
4. **No competitor has it** — Differentiation opportunity

---

## Reward Structure

### Option A: Credit-Based (Recommended)

| Party | Reward | Trigger |
|-------|--------|---------|
| Referrer | 1 month free Pro ($7.99 value) | Referee subscribes to Pro |
| Referee | 30-day Pro trial (vs 14-day) | Signs up via referral link |

**Why this works:**
- Low cost to us (extending existing subscription)
- Clear value to both parties
- Encourages conversion to Pro

### Option B: Cash-Based (Alternative)

| Party | Reward | Trigger |
|-------|--------|---------|
| Referrer | $5 credit toward subscription | Referee subscribes to Pro |
| Referee | $5 off first month | Signs up via referral link |

**Considerations:**
- Higher perceived value
- More complex accounting
- Potential for abuse

**Decision:** Start with Option A (credit-based) for simplicity.

---

## User Flow

### Referrer Journey

```
1. User visits /dashboard/referrals (or clicks "Invite Friends" in nav)
2. Sees unique referral link: cashcast.money/r/ABC123
3. Sees stats: invites sent, signups, conversions, rewards earned
4. Shares link via email, social, or copy
5. When referee converts, referrer sees reward credited
```

### Referee Journey

```
1. Clicks referral link: cashcast.money/r/ABC123
2. Lands on homepage with banner: "You've been invited by [Name]!"
3. Gets 30-day Pro trial instead of 14-day
4. Signs up normally
5. If converts to Pro, referrer gets rewarded
```

---

## Database Schema

### New Table: `referral_codes`

```sql
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One code per user
);

CREATE INDEX idx_referral_codes_code ON referral_codes(code);
```

### New Table: `referrals`

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  -- pending: link clicked but no signup
  -- signed_up: referee created account
  -- converted: referee became paying customer
  -- rewarded: referrer received reward
  referee_email VARCHAR(255), -- Track before signup
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  reward_type VARCHAR(20), -- 'free_month', 'credit'
  reward_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON referrals(referee_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referee_id
  );
```

### Modify: `profiles` table

```sql
ALTER TABLE profiles
  ADD COLUMN referred_by UUID REFERENCES auth.users(id),
  ADD COLUMN referral_trial_extended BOOLEAN DEFAULT false;
```

---

## File Structure

```
lib/referrals/
├── types.ts              # Referral types and statuses
├── generate-code.ts      # Generate unique referral codes
├── track.ts              # Track clicks, signups, conversions
├── rewards.ts            # Process reward distribution
└── index.ts              # Exports

app/dashboard/referrals/
└── page.tsx              # Referral dashboard

app/r/[code]/
└── page.tsx              # Referral landing redirect

components/referrals/
├── referral-card.tsx     # Dashboard widget
├── referral-stats.tsx    # Stats display
├── share-buttons.tsx     # Social share buttons
└── referral-banner.tsx   # Banner for referred signups

app/api/referrals/
├── track-click/route.ts  # Track link clicks
└── webhook/route.ts      # Stripe webhook for conversions
```

---

## Implementation Details

### Referral Code Generation

```typescript
function generateReferralCode(): string {
  // 6 characters: alphanumeric, no confusing chars (0/O, 1/l)
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
```

### Tracking Flow

```typescript
// 1. Link click: /r/[code]
async function trackClick(code: string, req: Request) {
  const referral = await db.referrals.create({
    referral_code: code,
    referrer_id: await getReferrerByCode(code),
    status: 'pending',
    clicked_at: new Date(),
  });

  // Set cookie for attribution
  setCookie('referral_code', code, { maxAge: 30 * 24 * 60 * 60 }); // 30 days
}

// 2. Signup: check for referral cookie
async function handleSignup(userId: string) {
  const referralCode = getCookie('referral_code');
  if (referralCode) {
    await db.referrals.update({
      where: { referral_code: referralCode, status: 'pending' },
      data: {
        referee_id: userId,
        status: 'signed_up',
        signed_up_at: new Date(),
      },
    });

    // Extend trial to 30 days
    await extendTrial(userId, 30);
  }
}

// 3. Conversion: Stripe webhook
async function handleConversion(userId: string) {
  const referral = await db.referrals.findFirst({
    where: { referee_id: userId, status: 'signed_up' },
  });

  if (referral) {
    // Update referral status
    await db.referrals.update({
      where: { id: referral.id },
      data: {
        status: 'converted',
        converted_at: new Date(),
      },
    });

    // Grant reward to referrer
    await grantFreeMonth(referral.referrer_id);

    // Mark as rewarded
    await db.referrals.update({
      where: { id: referral.id },
      data: {
        status: 'rewarded',
        rewarded_at: new Date(),
        reward_type: 'free_month',
        reward_amount: 7.99,
      },
    });

    // Notify referrer
    await sendEmail(referral.referrer_id, 'referral-reward');
  }
}
```

---

## UI Components

### Referral Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Invite Friends, Earn Free Months                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Referral Link:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ cashcast.money/r/ABC123                    [Copy]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Share on Twitter] [Share on LinkedIn] [Email]             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Stats                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │    12    │ │    5     │ │    2     │ │  $15.98  │       │
│  │  Clicks  │ │ Signups  │ │Conversions│ │ Earned  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Recent Referrals                                           │
│  ─────────────────────────────────────────────────────────  │
│  j***@email.com    Signed up    Apr 20    Pending          │
│  m***@email.com    Converted    Apr 18    +1 month free    │
│  s***@email.com    Signed up    Apr 15    Pending          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Widget

Small card on main dashboard:

```
┌─────────────────────────────────────┐
│ 🎁 Invite friends, get free months │
│                                     │
│ 2 friends have signed up            │
│ Earn 1 month free per conversion    │
│                                     │
│ [Share Your Link →]                 │
└─────────────────────────────────────┘
```

---

## Feature Gating

| Tier | Access |
|------|--------|
| Free | Can refer, but rewards only on Pro conversion |
| Pro | Full access to referral program |
| Premium | Full access |
| Lifetime | Full access |

---

## Implementation Sequence

### Phase 1: Database & Core (Day 1)
1. Create database tables
2. Generate referral code on user creation
3. Build code generation and lookup functions

### Phase 2: Tracking (Day 2)
4. Create /r/[code] redirect page
5. Set attribution cookie
6. Track clicks and signups
7. Extend trial for referred users

### Phase 3: Rewards (Day 3)
8. Add Stripe webhook for conversion tracking
9. Implement free month granting logic
10. Send reward notification emails

### Phase 4: UI (Day 4-5)
11. Create referral dashboard page
12. Add dashboard widget
13. Add share buttons (Twitter, LinkedIn, Email)
14. Add referral banner for referred users

---

## Verification Checklist

- [ ] Referral code generated for each user
- [ ] /r/[code] redirects correctly with attribution
- [ ] Cookie persists for 30 days
- [ ] Signup correctly links referee to referrer
- [ ] Trial extended to 30 days for referred users
- [ ] Stripe webhook triggers conversion tracking
- [ ] Free month correctly added to referrer account
- [ ] Email sent on successful referral
- [ ] Dashboard shows accurate stats
- [ ] Share buttons work correctly
- [ ] Privacy-safe email display (j***@email.com)

---

## Fraud Prevention

| Risk | Mitigation |
|------|------------|
| Self-referral | Block same email domain, IP check |
| Disposable emails | Block known disposable domains |
| Multiple accounts | Require unique payment method |
| Click farming | Rate limit, require signup for tracking |

---

## Success Metrics

| Metric | Target (3 months) |
|--------|-------------------|
| Referral participation | 20% of Pro users share link |
| Signup conversion | 30% of clicks become signups |
| Pro conversion | 15% of referred signups convert |
| Referral-sourced revenue | 10% of new MRR |

---

## Future Enhancements

- Tiered rewards (more referrals = better rewards)
- Leaderboard for top referrers
- Custom referral links (/r/yourname)
- Partner program for affiliates
- Referral contests/campaigns
- In-app notifications for referral activity
