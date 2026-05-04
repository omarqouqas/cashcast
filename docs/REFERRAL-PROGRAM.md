# Referral Program - How It Works

This document explains how the Cashcast referral program works from both a user and technical perspective.

**Last Updated:** May 4, 2026

---

## Quick Summary

**What users get:**
- **Referrer** (existing user): Earns 1 month of Pro free when their friend subscribes
- **Referee** (new user): Gets a 30-day Pro trial when subscribing to Pro

**When rewards trigger:**
- The referee must actually subscribe to Pro (not just sign up)
- Free trial signups don't trigger rewards - only paid conversions do

**Important:** The referee does NOT get instant Pro access. They start on Free, and the 30-day trial is applied when they click "Upgrade to Pro" at checkout.

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

## How Users Experience It

### For the Referrer (Existing User)

1. **Find their referral link** on the dashboard in the "Refer & Earn" widget
2. **Copy the link** (e.g., `cashcast.money/r/ABC123XY`)
3. **Share it** with friends via email, social media, etc.
4. **Track progress** in the widget:
   - How many friends signed up
   - How many subscribed to Pro
   - How many rewards earned

### For the Referee (New User)

1. **Click a referral link** from a friend
2. **Get redirected** to the signup page with a special banner:
   > "You've been referred! Sign up to get 30 days of Pro free."
3. **Sign up** normally (email or Google)
4. **Start on Free plan**
5. **Get 30-day trial** automatically applied when clicking "Upgrade to Pro"

---

## Technical Flow

### 1. Referral Code Generation

When a user first visits the dashboard, the system generates their unique referral code:

```
Code format: 8 characters
Characters: ABCDEFGHJKMNPQRSTUVWXYZ23456789 (no confusing chars like 0/O, 1/l)
Example: ABC123XY
```

The code is stored in the `referrals` table with:
- `referrer_id` = the user's ID
- `referee_id` = NULL (no one has used it yet)
- `status` = 'pending'

### 2. Referral Link Click

When someone clicks `cashcast.money/r/ABC123XY`:

1. The `/r/[code]/page.tsx` validates the code exists (public SELECT policy allows this)
2. If valid, redirects to `/auth/signup?ref=ABC123XY`
3. If invalid, redirects to `/auth/signup` (no error shown)

### 3. Signup with Referral

**For Email Signup:**
1. Signup page reads `?ref=` parameter
2. Shows referral banner
3. Stores code in **localStorage** (persists through email verification)
4. User completes signup and verifies email
5. After email verification, `/auth/oauth-success` claims the code

**For Google OAuth:**
1. Code is stored in **localStorage** before OAuth redirect
2. After OAuth success, `/auth/oauth-success` retrieves code
3. Calls `/api/referrals/claim` API to claim the code
4. Code is cleared from localStorage

**Fallback:**
- Dashboard also attempts to claim any code in localStorage on first visit

### 4. Code Claiming

When the claim API is called:

1. **Validate** code is 8 characters
2. **Check** user hasn't already used a referral code
3. **Find** the referral record with matching code
4. **Block** self-referrals (can't use your own code)
5. **UPDATE** the existing referral row:
   - Sets `referee_id` to current user
   - Sets `status` = 'signed_up'
   - Sets `signed_up_at` timestamp
6. **Store** code in `user_settings.referred_by_code`

### 5. Checkout with Trial

When a referred user subscribes to Pro:

1. `createCheckoutSession()` checks `user_settings.referred_by_code`
2. If code exists AND this is first subscription:
   - Adds `trial_period_days: 30` to Stripe session
   - Stores code in subscription metadata
3. User sees 30-day trial in Stripe Checkout

### 6. Conversion & Rewards

When Stripe webhook receives `checkout.session.completed`:

1. **Check** subscription metadata for `referred_by_code`
2. **Update** referral status: `signed_up` → `converted`
3. **Reward** the referrer based on their tier:

| Referrer's Tier | Reward Action |
|-----------------|---------------|
| **Lifetime** | Mark as rewarded (no additional benefit needed) |
| **Pro** | Add 1-month credit to Stripe customer balance |
| **Free** | Grant 30-day Pro access directly in database |

4. **Update** referral status: `converted` → `rewarded`

---

## Database Schema

### `referrals` Table

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID NOT NULL,      -- User who shared the code
  referee_id UUID,                 -- User who used the code (NULL until claimed)
  referral_code VARCHAR(8) UNIQUE, -- The 8-char code
  status VARCHAR(20),              -- pending, signed_up, converted, rewarded
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);
```

### Status Progression

```
pending → signed_up → converted → rewarded
   │           │            │          │
   │           │            │          └── Referrer received reward
   │           │            └── Referee subscribed to Pro
   │           └── Referee created account
   └── Code created, not yet used
```

### `user_settings` Column

```sql
ALTER TABLE user_settings ADD COLUMN referred_by_code VARCHAR(8);
```

This stores which code a user signed up with, used to:
- Apply 30-day trial at checkout
- Prevent using multiple referral codes

### RLS Policies

The `referrals` table has Row Level Security enabled with these policies:

```sql
-- SELECT policies
-- Users can view referrals where they are the referrer
CREATE POLICY "Users can view own referrals as referrer" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Users can view referrals where they are the referee
CREATE POLICY "Users can view referrals as referee" ON referrals
  FOR SELECT USING (auth.uid() = referee_id);

-- Anyone can view unclaimed referral codes (for validation)
CREATE POLICY "Anyone can view unclaimed referral codes" ON referrals
  FOR SELECT USING (referee_id IS NULL);

-- INSERT policy
-- Users can create their own referral code (template row)
CREATE POLICY "Users can create own referral code" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id AND referee_id IS NULL);

-- UPDATE policy
-- Users can claim an unclaimed referral (update referee_id to themselves)
CREATE POLICY "Users can claim unclaimed referral" ON referrals
  FOR UPDATE USING (referee_id IS NULL) WITH CHECK (auth.uid() = referee_id);
```

**Important:** DELETE operations are handled by the service role in webhook/API routes (bypasses RLS).

### Migration Files

| Migration | Purpose |
|-----------|---------|
| `20260503000001_add_referrals.sql` | Create referrals table, indexes, base RLS policies |
| `20260503000002_fix_referral_rls.sql` | Add INSERT policy for referee claiming |
| `20260504000001_referral_update_policy.sql` | Add UPDATE policy for claiming |
| `20260504000002_referral_public_select.sql` | Allow anonymous users to validate codes |

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/referrals/generate-code.ts` | Generate 8-char codes |
| `lib/referrals/types.ts` | TypeScript types |
| `lib/actions/referrals.ts` | Server actions for all referral operations |
| `app/api/referrals/claim/route.ts` | API endpoint for claim flow |
| `app/r/[code]/page.tsx` | Landing page with redirect |
| `components/dashboard/referral-widget.tsx` | Dashboard widget |
| `lib/actions/stripe.ts` | Checkout session with trial logic |
| `app/api/webhooks/stripe/route.ts` | Conversion handling and rewards |

---

## Edge Cases

### Self-Referral
**Blocked.** The `claimReferralCode()` function checks if `referral.referrer_id === user.id` and returns an error.

### Using Multiple Codes
**Blocked.** The function checks `user_settings.referred_by_code` first. If set, returns error.

### Invalid Code
**Graceful fallback.** Landing page redirects to signup without the code. No error shown.

### Email Verification Flow
**Handled via localStorage.** Code persists across tabs, claimed after email verification.

### OAuth Flow
**Handled via localStorage.** Code is stored before OAuth redirect, retrieved after success.

### Referrer on Free Tier
**Direct database update.** Instead of Stripe credit, grants 30-day Pro by updating `subscriptions` table directly.

### Referrer on Lifetime
**No action needed.** Already has all benefits. Just marks the referral as rewarded.

### Anonymous Code Validation
**Public SELECT policy.** Allows unauthenticated users clicking referral links to validate the code.

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

## Dashboard Widget

The widget shows:

```
┌─────────────────────────────────────────────────┐
│ Refer & Earn                              [Gift]│
│ Give friends 30 days free, get 1 month Pro      │
│                                                 │
│ Your referral link:                             │
│ ┌─────────────────────────────────────┐ [Copy] │
│ │ cashcast.money/r/ABC123XY           │        │
│ └─────────────────────────────────────┘        │
│                                                 │
│    [Users]        [Card]         [Award]       │
│       3              1              1          │
│   Signed up     Subscribed      Rewards        │
│                                                 │
│ ▼ How it works                                  │
│   1. Share your referral link with friends      │
│   2. They sign up and get 30 days of Pro free   │
│   3. When they subscribe, you get 1 month free  │
└─────────────────────────────────────────────────┘
```

---

## Testing Checklist

- [x] Generate code for new user
- [x] Visit `/r/[code]` and verify redirect
- [x] Sign up with email and verify banner shows
- [x] Sign up with Google OAuth and verify code is claimed
- [x] Verify code persists through email verification
- [x] Verify trial shows in Stripe Checkout
- [x] Complete subscription and verify referral status updates
- [x] Verify referrer receives reward (check their subscription)
- [x] Try self-referral and verify it's blocked
- [x] Try using code twice and verify it's blocked

---

## Future Improvements

- Email notification when referral converts
- Social share buttons in widget
- Tiered rewards (more referrals = better rewards)
- Leaderboard for top referrers
- Custom referral links (`/r/yourname`)
- Partner/affiliate program
