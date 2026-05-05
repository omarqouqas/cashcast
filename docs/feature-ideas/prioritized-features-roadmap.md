# Prioritized Features Roadmap

**Created:** April 23, 2026
**Source:** Micro-SaaS Ideas Database (190+ products) + Market Research
**Last Updated:** May 4, 2026

---

## Priority & Impact Matrix

| Priority | Feature | Monthly Revenue Potential | Solopreneur Score | Impact | Effort | Status |
|----------|---------|---------------------------|-------------------|--------|--------|--------|
| **1** | PDF Bank Statement Import | $40,000 | 90 | High | Medium | ✅ DONE |
| **2** | AI Smart Categorization | — | — | High | Low | ✅ DONE |
| **3** | Time Tracking + Invoicing | $850 | 87 | High | High | ✅ DONE |
| **4** | Automated Payment Reminders | $3,500 | 80 | High | Low | ✅ DONE |
| **5** | Referral Program | — | — | High | Medium | ✅ DONE |
| **6** | AI Recurring Detection (PDF) | — | — | Medium | Low | ✅ DONE |
| **7** | Email Signature Generator | $55,000 | 90 | Medium | Low | ✅ DONE |
| **8** | SMS/Push Low Balance Alerts | $50,000 | 72 | Medium | Medium | ✅ DONE |
| **9** | Telegram/WhatsApp Bot | $8,000 | 90 | Low | Medium | 🆕 New |
| **10** | AI Excel Formula Helper | $23,000 | 91 | Low | Medium | 🆕 New |

---

## Feature Details

### 1. PDF Bank Statement Import ✅ COMPLETED

**Database Reference:** Row 79 - "Software that extracts transaction data from PDF bank statements"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $40,000 |
| Starting Costs | $100 |
| Solopreneur Score | 90 (very high) |
| ICP | Small Business Owners, Accountants |
| Growth Tactics | Word of mouth, Referral Program, SEO |

**Status:** Implemented with Canadian bank support (TD, RBC, BMO, Scotiabank, CIBC, Tangerine, Simplii)

**Strategic Value:**
- Highest-revenue relevant entry in the entire database
- Reduces onboarding friction dramatically
- Privacy-friendly (no bank connection required)
- Unique differentiator vs Cash Flow Calendar

**Detailed Spec:** [pdf-bank-statement-import.md](./pdf-bank-statement-import.md)

---

### 2. AI Smart Categorization ✅ COMPLETED

**Implementation:** Hybrid rule-based + Claude API fallback

**Status:** Completed April 6, 2026

- ~50 merchant patterns for instant categorization (free)
- Claude Sonnet fallback for unrecognized transactions
- Tier-based limits: Free (10), Pro (50)
- Confidence badges: Auto/Likely/Guess

**Strategic Value:**
- Makes PDF import 10x more useful
- Reduces manual work for users
- Differentiator from competitors

---

### 3. Time Tracking + Invoicing ✅ COMPLETED

**Database Reference:** Row 46 - "Time-Tracking And Invoicing Software"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $850 |
| Starting Costs | $1,000 |
| Solopreneur Score | 87 (high) |
| ICP | Freelancers, Consultants, Small Business Owners |
| Growth Tactics | Word of mouth, SEO |

**Status:** Completed April 29, 2026

**Implementation:**
- Timer widget in dashboard header (persistent, localStorage-backed)
- Time entries page at `/dashboard/time` with filters
- Manual time entry form with project, client, duration, rate
- Invoice line items support (`invoice_items` table)
- Create invoices from selected time entries
- PDF template with line items table
- Uninvoiced Time widget on dashboard
- Time settings page at `/dashboard/time/settings`

**Files Created:**
```
app/dashboard/time/
├── page.tsx                    # Time entries page
├── time-page-client.tsx        # Client wrapper
└── settings/page.tsx           # Time settings

components/time/
├── timer-widget.tsx            # Header timer
├── timer-context.tsx           # Timer state
├── time-entry-list.tsx         # Entries list
├── time-entry-row.tsx          # Single entry
├── time-entry-form.tsx         # Manual entry
├── time-filters.tsx            # Filters
└── time-settings-form.tsx      # Settings

components/invoices/
└── invoice-line-items.tsx      # Line items editor

components/dashboard/
└── uninvoiced-time-widget.tsx  # Dashboard widget

lib/time/
└── format-duration.ts          # Duration helpers

lib/actions/
├── time-entries.ts             # Time CRUD
└── time-settings.ts            # Settings CRUD
```

**Detailed Spec:** [time-tracking-invoicing.md](./time-tracking-invoicing.md)

---

### 4. Automated Payment Reminders ✅ COMPLETED

**Database Reference:** Row 90 - "Automated email follow up software"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $3,500 |
| Starting Costs | — |
| Solopreneur Score | 80 |
| ICP | Salespeople, Customer Success, Startup Founders |
| Growth Tactics | Word of mouth, Webinars, Podcasting |

**Why It Matters:**
- 47-50% of freelancers experience late payments in first 6 months
- Ties directly into existing Runway Collect invoicing
- Low effort: Leverage existing email infrastructure

**Implementation (Completed April 29, 2026):**

```
Invoice Sent
    ↓
Daily cron (9 AM UTC) checks all sent/viewed invoices:
    • Day -3: Friendly reminder ("Invoice due in 3 days")
    • Day 0: Due day reminder ("Invoice due today")
    • Day +7: Firm reminder ("7 days overdue")
    • Day +14: Final reminder ("14 days overdue")
    ↓
User can toggle on/off globally or per-invoice
```

**Files Created:**
```
lib/reminders/
├── types.ts              # Reminder types and constants
├── scheduler.ts          # Determines which reminders are due
├── sender.ts             # Sends emails via existing templates
└── index.ts              # Re-exports

app/api/cron/invoice-reminders/
└── route.ts              # Vercel cron endpoint (9 AM UTC)

lib/actions/
└── update-auto-reminder-settings.ts

components/settings/
└── auto-reminders-form.tsx
```

**Database:** Migration added `auto_reminders_enabled` to user_settings and invoices, plus `source` and `reminder_stage` to invoice_reminders with unique index.

---

### 5. Referral Program ✅ COMPLETED

**Database Insight:** "Referral Program" appears as a growth tactic in 25+ successful micro-SaaS products, including Row 79 (PDF extraction) which matches our ICP exactly.

**Status:** Completed May 3, 2026

**Implementation:**
- **Referrer Reward**: 1 month free Pro when referee converts to paid
- **Referee Reward**: 30-day Pro trial when signing up with referral code
- **Trigger**: Referrer gets reward only when referee pays for Pro

**Key Components:**
| Component | Description |
|-----------|-------------|
| Referral Link | Unique 8-char code: `cashcast.io/r/ABC123XY` |
| Landing Page | `/r/[code]` redirects to signup with ref param |
| Dashboard Widget | Shows link, stats (signed up, subscribed, rewards) |
| Signup Banner | "You've been referred! Get 30 days Pro free" |
| Checkout Trial | Auto-applies 30-day trial for referred users |
| Webhook Rewards | Grants Pro credit/access when referee converts |

**Reward Logic:**
- Lifetime users: Marked as rewarded (already have max benefits)
- Pro subscribers: Add 1-month Stripe credit
- Free users: Grant 30-day Pro directly in database

**Files Created:**
```
supabase/migrations/20260503000001_add_referrals.sql
lib/referrals/types.ts
lib/referrals/generate-code.ts
lib/actions/referrals.ts
app/api/referrals/claim/route.ts
app/r/[code]/page.tsx
components/dashboard/referral-widget.tsx
```

**Detailed Spec:** [referral-program.md](./referral-program.md)

---

### 6. AI Recurring Detection (PDF Enhancement) ✅ COMPLETED

**Status:** Completed (implemented alongside PDF import)

**Implementation:**
- `lib/import/recurring-detector.ts` - Full pattern detection algorithm (460+ lines)
- `components/import/recurring-patterns-card.tsx` - UI for displaying detected patterns
- Integrated into PDF import flow at `components/import/pdf-import-page-client.tsx`

**Features:**
- Groups transactions by similar description + amount (±10% variance)
- 40+ merchant normalizations (Netflix, Spotify, AWS, etc.)
- Detects frequencies: weekly, biweekly, semi-monthly, monthly, quarterly, annually
- Confidence scoring with badges (High ≥70%, Medium 50-69%, Low <50%)
- Auto-pre-selects high-confidence patterns (≥60%)
- User can select/deselect patterns before applying

**Files Created:**
```
lib/import/recurring-detector.ts
components/import/recurring-patterns-card.tsx
```

**Impact:** Medium (improves existing PDF import feature)

---

### 7. Email Signature Generator ✅ COMPLETED

**Database Reference:** Row 167 - "Email signature generator"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $55,000 |
| Starting Costs | $10,000 |
| Solopreneur Score | 90 (very high) |
| ICP | Small Business Owners, Freelancers, Creators |
| Growth Tactics | SEO |

**Status:** Completed April 29, 2026

**Implementation:**
- Page: `/tools/email-signature-generator`
- 4 templates: Minimal, Professional, With Photo, Modern Card
- Form fields: Name, title, email, company, phone, website, LinkedIn, Twitter, photo URL, address
- One-click copy (HTML or plain text)
- Email client compatible (table-based HTML, inline styles)
- CTA after copy: "Track your freelance income & never miss a payment deadline"

**Files Created:**
```
app/tools/email-signature-generator/
└── page.tsx                              # Main page with SEO metadata

components/tools/
├── email-signature-generator.tsx         # Main component
├── email-signature-form.tsx              # Form inputs
└── email-signature-preview.tsx           # Live preview + copy buttons

lib/tools/
└── generate-signature-html.ts            # HTML generation for all templates
```

**SEO:**
- Target keywords: "email signature generator", "free email signature", "professional email signature"
- Schema.org WebApplication markup
- FAQ section with structured data

**Effort:** Low (2-3 days)
**Impact:** Medium (SEO/acquisition play)

---

### 8. SMS/Push Low Balance Alerts ✅ COMPLETED

**Database Reference:** Row 39 - "SMS messaging services" + Row 70 - "Business texting services"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $50,000 - $1.2M |
| Solopreneur Score | 67-72 |
| ICP | SMBs, Small Business Owners, Entrepreneurs |
| Growth Tactics | Word of mouth, SEO |

**Status:** Completed May 4, 2026

**Implementation:**
- **SMS Alerts (via Twilio):** Phone verification with 6-digit code, critical alerts only
- **Web Push Notifications:** Browser notifications for all alert types, service worker
- **Unified Notification Router:** Routes alerts to enabled channels based on user preferences
- **Settings UI:** Phone verification flow, push permission request, channel toggles

**Channel Matrix:**

| Alert Type | Email | SMS | Push |
|------------|-------|-----|------|
| Cash crunch (<7 days) | ✅ | ✅ | ✅ |
| Invoice overdue | ✅ | ❌ | ✅ |
| Bill collision | ✅ | ❌ | ❌ |

**Design Decision:** SMS reserved for critical alerts only (cash crunch) to avoid alert fatigue and minimize costs (~$0.0075/SMS).

**Files Created:**
```
lib/sms/
├── types.ts              # SMS result types
├── twilio.ts             # Twilio client
├── send-sms.ts           # SMS sending + validation
├── verify-phone.ts       # Phone verification flow
└── index.ts

lib/push/
├── types.ts              # Push subscription types
├── vapid.ts              # VAPID configuration
├── send-push.ts          # Push notifications
├── subscribe.ts          # Subscription management
└── index.ts

lib/notifications/
├── types.ts              # Channel types
├── router.ts             # Unified notification router
└── index.ts

app/api/sms/
├── send-verification/route.ts
└── verify/route.ts

app/api/push/
└── subscribe/route.ts

public/sw.js                              # Service worker
components/settings/notification-channels-form.tsx
supabase/migrations/20260504000003_add_notification_channels.sql
```

**Cost Estimate:** ~$7/month for 100 active users (SMS + Push)

**Detailed Spec:** [sms-push-alerts.md](./sms-push-alerts.md)

---

### 9. Telegram/WhatsApp Bot 🆕 NEW

**Database Reference:** Row 98 - "Telegram chatbot for cheap flights"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $8,000 |
| Starting Costs | $0 |
| Solopreneur Score | 90 (very high) |
| ICP | Travelers, Budget-conscious users |

**Adaptation for Cashcast:**
- Daily balance summary via Telegram
- Alerts pushed to preferred messaging app
- Natural language queries via chat

**Example Interaction:**
```
User: /balance
Bot: Your balance today: $3,450
     Lowest point this week: $2,100 (Friday)

User: Can I afford $500 on a laptop?
Bot: Yes! After the purchase, you'd have $2,950.
     Your next bill ($400 rent) hits in 5 days.
     You'd still have $2,550 buffer. ✅
```

**Effort:** Medium (5-7 days)
**Impact:** Low (niche appeal, but sticky)

---

### 10. AI Excel Formula Helper 🆕 NEW

**Database Reference:** Row 89 - "Automated AI-based Excel formulas"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $23,000 |
| Starting Costs | $196 |
| Solopreneur Score | 91 (very high) |
| ICP | Finance Professionals, Accounting, Marketing Analysts, Heavy Excel Users |
| Growth Tactics | Word of mouth, Brand Authenticity |

**Why It Matters:**
- 43% of organizations still use spreadsheets for cash forecasting
- Migration path: Excel users → Cashcast
- Free tool = SEO traffic

**Proposed Implementation:**

- Standalone page: `/tools/excel-formula`
- User describes what they want in plain English
- Claude generates the Excel formula
- Explains how it works
- CTA: "Stop wrestling with spreadsheets → Try Cashcast"

**Example:**
```
User: "Calculate my average monthly income excluding months below $1000"

AI: =AVERAGEIF(B2:B13,">1000")

Explanation: This formula averages all values in B2:B13
that are greater than $1000, excluding low-income months.
```

**Effort:** Medium (3-4 days)
**Impact:** Low (acquisition play, not core value)

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)

| Feature | Days | Dependencies | Status |
|---------|------|--------------|--------|
| AI Recurring Detection | 1-2 | PDF import (exists) | ✅ Done |
| Automated Payment Reminders | 2-3 | Runway Collect (exists) | ✅ Done |
| Email Signature Generator | 2-3 | None | ✅ Done |

### Phase 2: Core Features (2-4 weeks)

| Feature | Days | Dependencies | Status |
|---------|------|--------------|--------|
| Referral Program | 3-5 | Stripe billing | ✅ Done |
| Time Tracking + Invoicing | 10-15 | Runway Collect (exists) | ✅ Done |

### Phase 3: Engagement (4-6 weeks)

| Feature | Days | Dependencies | Status |
|---------|------|--------------|--------|
| SMS/Push Alerts | 4-5 | Proactive alerts (exists) | ✅ Done |
| Telegram Bot | 5-7 | AI chat (exists) | 🆕 New |
| AI Excel Formula Helper | 3-4 | None | 🆕 New |

---

## Growth Tactics Summary

Based on the Micro-SaaS database, the most effective tactics for our ICP:

| Tactic | Frequency in Database | Our Implementation |
|--------|----------------------|-------------------|
| SEO (blog posts, organic) | 80%+ | Free tools, comparison pages |
| Word of mouth | 70%+ | Referral program |
| Referral Program | 25%+ | ✅ Implemented |
| Email marketing | 40%+ | Weekly digest (exists) |
| Direct sales | 30%+ | Not applicable (self-serve) |

---

## Sources

- Micro-SaaS Ideas Database (190+ products) - Starter Story
- [I Spent 24 Hours With A SaaS Millionaire](https://www.youtube.com/watch?v=iVy5J7iE-3Q) - Micro SaaS HQ
- Internal competitor analysis (docs/competitors.md)
- Internal market research (docs/Gemini-Market-Research.md)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Apr 23, 2026 | Prioritize Payment Reminders over Referral Program | Lower effort, higher immediate impact on retention |
| Apr 23, 2026 | Add Email Signature Generator as free tool | $55K revenue potential, 90 solopreneur score, SEO play |
| Apr 23, 2026 | Deprioritize Telegram Bot | Niche appeal, focus on core features first |
| Apr 23, 2026 | Add AI Recurring Detection | Low effort enhancement to existing PDF import |
| Apr 29, 2026 | Implement Automated Payment Reminders | High impact on retention, reduces manual follow-up |
| Apr 29, 2026 | Implement Email Signature Generator | Free SEO tool for lead generation, 4 templates, quick win |
| Apr 29, 2026 | Implement Time Tracking + Invoicing | Completes freelancer workflow, high stickiness, unique differentiator |
| May 3, 2026 | Implement Referral Program | Low CAC acquisition, compounds over time, no competitor has it |
| May 4, 2026 | Mark AI Recurring Detection as done | Was already implemented with PDF import, roadmap updated |
| May 4, 2026 | Complete SMS/Push Low Balance Alerts | Multi-channel notifications: Twilio SMS (critical only), Web Push (all alerts), unified router |

