# Referral Program

**Status:** IMPLEMENTED (May 3, 2026)

---

## Overview

A referral system where existing users can invite friends and earn rewards when those friends become paying customers.

**Rewards:**
- **Referrer**: 1 month free Pro when referee converts to paid
- **Referee**: 30-day Pro trial when signing up with referral code
- **Trigger**: Referrer gets reward only when referee pays for Pro

---

## Implementation Summary

### Database Schema

**Table: `referrals`**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);
```

**Column Added: `user_settings.referred_by_code`**
- Stores which referral code a user signed up with
- Used to check if user is eligible for 30-day trial

### Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/20260503000001_add_referrals.sql` | Database schema |
| `lib/referrals/types.ts` | TypeScript types |
| `lib/referrals/generate-code.ts` | 8-char code generation |
| `lib/referrals/index.ts` | Exports |
| `lib/actions/referrals.ts` | Server actions |
| `app/api/referrals/claim/route.ts` | Claim API endpoint |
| `app/r/[code]/page.tsx` | Referral landing page |
| `components/dashboard/referral-widget.tsx` | Dashboard widget |

### Files Modified

| File | Changes |
|------|---------|
| `app/auth/signup/page.tsx` | Read `?ref=` param, show banner, store in sessionStorage |
| `app/auth/oauth-success/page.tsx` | Claim code after OAuth login |
| `lib/actions/stripe.ts` | Apply 30-day trial for referred users |
| `app/api/webhooks/stripe/route.ts` | Handle conversion, reward referrer |
| `components/dashboard/dashboard-content.tsx` | Display referral widget |
| `app/dashboard/page.tsx` | Fetch referral stats |

---

## User Flows

### Referrer Journey

1. User visits dashboard
2. Sees "Refer & Earn" widget with their unique referral link
3. Copies link: `cashcast.io/r/ABC123XY`
4. Shares with friends
5. When friend subscribes, referrer gets 1 month Pro credit

### Referee Journey

1. Clicks referral link: `cashcast.io/r/ABC123XY`
2. Redirects to `/auth/signup?ref=ABC123XY`
3. Sees banner: "You've been referred! Sign up to get 30 days of Pro free."
4. Signs up (email or Google OAuth)
5. Code is claimed and stored
6. When checking out for Pro, gets 30-day trial applied automatically

---

## Referral Code Generation

- 8 characters, alphanumeric (no confusing chars like 0/O, 1/l)
- Characters: `ABCDEFGHJKMNPQRSTUVWXYZ23456789`
- Example: `ABC123XY`
- Collision handling: Up to 5 retries on unique constraint violation

---

## Reward Logic (Webhook)

When a referee subscribes to Pro:

1. **Referral Status Update**: `signed_up` → `converted`
2. **Reward Determination**:
   - **Lifetime users**: Mark as rewarded (already have max benefits)
   - **Pro subscribers**: Add 1-month Stripe credit to balance
   - **Free users**: Grant 30-day Pro access directly in database

---

## Dashboard Widget

Shows in dashboard:
- Unique referral link with copy button
- Stats: Signed up, Subscribed, Rewards earned
- "How it works" expandable section

---

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Self-referral | Blocked in claim API |
| Reuse code | Each user can only use one code ever |
| Invalid code | Graceful redirect to signup without code |
| OAuth flow | Code stored in sessionStorage, claimed after OAuth |
| Referrer on free tier | Grant 30-day Pro directly in database |

---

## Verification Checklist

- [x] Referral code generated for each user on first visit to widget
- [x] /r/[code] redirects correctly with referral param
- [x] Signup page shows referral banner when code present
- [x] OAuth flow preserves referral code via sessionStorage
- [x] Trial extended to 30 days for referred users at checkout
- [x] Stripe webhook triggers conversion tracking
- [x] Reward correctly applied to referrer based on their tier
- [x] Dashboard widget shows accurate stats

---

## Future Enhancements

- Email notification when referral converts
- Tiered rewards (more referrals = better rewards)
- Leaderboard for top referrers
- Custom referral links (/r/yourname)
- Partner program for affiliates
- Social share buttons in widget
