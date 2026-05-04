# Referral Program

**Status:** IMPLEMENTED (May 3, 2026)
**Bug Fixes:** May 4, 2026

---

## Overview

A referral system where existing users can invite friends and earn rewards when those friends become paying customers.

**Rewards:**
- **Referrer**: 1 month free Pro when referee converts to paid
- **Referee**: 30-day Pro trial when subscribing to Pro
- **Trigger**: Referrer gets reward only when referee pays for Pro

**Important:** The referee does NOT get instant Pro access. They start on Free, and when they click "Upgrade to Pro", the checkout shows a 30-day free trial.

---

## How It Works (Simple English)

1. **You share your referral link** (e.g., `cashcast.money/r/ABC123XY`)

2. **Your friend clicks the link and signs up** → They start on Free plan

3. **When your friend clicks "Upgrade to Pro"**, they see a 30-day free trial at checkout

4. **After your friend completes checkout** (enters payment info):
   - Your friend starts their 30-day trial (no charge yet)
   - You get 1 month of Pro credited to your account

**Key point:** Rewards only trigger when your friend subscribes to Pro with payment info. Just signing up doesn't give anyone rewards.

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
- Used to apply 30-day trial at checkout

### Migration Files

| Migration | Purpose |
|-----------|---------|
| `20260503000001_add_referrals.sql` | Create referrals table, indexes, base RLS policies |
| `20260503000002_fix_referral_rls.sql` | Add INSERT policy for referee claiming |
| `20260504000001_referral_update_policy.sql` | Add UPDATE policy for claiming (uses UPDATE not INSERT) |
| `20260504000002_referral_public_select.sql` | Allow anonymous users to validate codes |

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
| `app/auth/signup/page.tsx` | Read `?ref=` param, show banner, store in localStorage |
| `app/auth/oauth-success/page.tsx` | Claim code after auth (email or OAuth) |
| `lib/actions/stripe.ts` | Apply 30-day trial for referred users |
| `app/api/webhooks/stripe/route.ts` | Handle conversion, reward referrer |
| `components/dashboard/dashboard-content.tsx` | Display referral widget + fallback claim |
| `app/dashboard/page.tsx` | Fetch referral stats |

---

## User Flows

### Referrer Journey

1. User visits dashboard
2. Sees "Refer & Earn" widget with their unique referral link
3. Copies link: `cashcast.money/r/ABC123XY`
4. Shares with friends
5. When friend subscribes to Pro, referrer gets 1 month Pro credit

### Referee Journey

1. Clicks referral link: `cashcast.money/r/ABC123XY`
2. Redirects to `/auth/signup?ref=ABC123XY`
3. Sees banner: "You've been referred! Sign up to get 30 days of Pro free."
4. Signs up (email or Google OAuth)
5. Starts on **Free plan**
6. When clicking "Upgrade to Pro", checkout shows 30-day free trial

---

## Technical Flow

### Code Storage
- Referral code is stored in **localStorage** (not sessionStorage)
- This allows the code to persist through email verification (different tab)
- Code is claimed after authentication in `/auth/oauth-success`
- Fallback claim also happens on first dashboard visit

### Code Claiming
- Uses **UPDATE** on the existing referral row (not INSERT)
- The referral row is created when the referrer generates their code
- Claiming updates the row to set `referee_id` and `status = 'signed_up'`

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

## RLS Policies

```sql
-- SELECT policies
"Users can view own referrals as referrer" -- auth.uid() = referrer_id
"Users can view referrals as referee"      -- auth.uid() = referee_id
"Anyone can view unclaimed referral codes" -- referee_id IS NULL (for validation)

-- INSERT policy
"Users can create own referral code"       -- auth.uid() = referrer_id AND referee_id IS NULL

-- UPDATE policy
"Users can claim unclaimed referral"       -- USING (referee_id IS NULL) WITH CHECK (auth.uid() = referee_id)
```

---

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Self-referral | Blocked in claim function |
| Reuse code | Each user can only use one code ever |
| Invalid code | Graceful redirect to signup without code |
| Email verification | Code stored in localStorage, persists across tabs |
| OAuth flow | Code stored in localStorage, claimed after OAuth |
| Referrer on free tier | Grant 30-day Pro directly in database |
| Anonymous code validation | Public SELECT policy allows it |

---

## Bug Fixes (May 4, 2026)

### Bug 1: sessionStorage didn't persist through email verification
- **Problem**: Email verification opens in new tab, sessionStorage is per-tab
- **Fix**: Changed to localStorage which persists across tabs

### Bug 2: INSERT violated UNIQUE constraint on referral_code
- **Problem**: Claiming tried to INSERT a new row with same code
- **Fix**: Changed to UPDATE the existing row instead

### Bug 3: Anonymous users couldn't validate referral codes
- **Problem**: RLS policies required authentication for SELECT
- **Fix**: Added public SELECT policy for unclaimed codes

### Bug 4: Missing UPDATE policy for claiming
- **Problem**: UPDATE operations were blocked by RLS
- **Fix**: Added UPDATE policy allowing users to claim unclaimed referrals

---

## Verification Checklist

- [x] Referral code generated for each user on first visit to widget
- [x] /r/[code] redirects correctly with referral param
- [x] Signup page shows referral banner when code present
- [x] Email signup flow preserves referral code via localStorage
- [x] OAuth flow preserves referral code via localStorage
- [x] Code is claimed after email verification
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
