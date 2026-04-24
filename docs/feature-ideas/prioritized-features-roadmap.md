# Prioritized Features Roadmap

**Created:** April 23, 2026
**Source:** Micro-SaaS Ideas Database (190+ products) + Market Research
**Last Updated:** April 23, 2026

---

## Priority & Impact Matrix

| Priority | Feature | Monthly Revenue Potential | Solopreneur Score | Impact | Effort | Status |
|----------|---------|---------------------------|-------------------|--------|--------|--------|
| **1** | PDF Bank Statement Import | $40,000 | 90 | High | Medium | ✅ DONE |
| **2** | AI Smart Categorization | — | — | High | Low | ✅ DONE |
| **3** | Time Tracking + Invoicing | $850 | 87 | High | High | 📋 Planned |
| **4** | Automated Payment Reminders | $3,500 | 80 | High | Low | 🆕 New |
| **5** | Referral Program | — | — | High | Medium | 🆕 New |
| **6** | AI Recurring Detection (PDF) | — | — | Medium | Low | 🆕 New |
| **7** | Email Signature Generator | $55,000 | 90 | Medium | Low | 🆕 New |
| **8** | SMS/Push Low Balance Alerts | $50,000 | 72 | Medium | Medium | 🆕 New |
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

### 3. Time Tracking + Invoicing 📋 PLANNED

**Database Reference:** Row 46 - "Time-Tracking And Invoicing Software"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $850 |
| Starting Costs | $1,000 |
| Solopreneur Score | 87 (high) |
| ICP | Freelancers, Consultants, Small Business Owners |
| Growth Tactics | Word of mouth, SEO |

**Why It Matters:**
- Increases daily product usage (sticky habit)
- Completes freelancer workflow: Track time → Invoice → Forecast
- Unique: No competitor has time tracking + forecasting + invoicing

**Integration Points:**
- Time entries → Auto-populate invoice line items
- Dashboard metric: "Uninvoiced Hours"
- Timer widget in header (persistent across navigation)

**Detailed Spec:** [time-tracking-invoicing.md](./time-tracking-invoicing.md)

---

### 4. Automated Payment Reminders 🆕 NEW

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

**Proposed Implementation:**

```
Invoice Sent
    ↓
Schedule reminder sequence:
    • Day -3: "Friendly reminder: Invoice #123 due in 3 days"
    • Day 0: "Invoice #123 is due today"
    • Day +7: "Invoice #123 is 7 days overdue"
    • Day +14: "Invoice #123 is 14 days overdue - please review"
    ↓
User can customize timing and toggle on/off per client
```

**Files to Create:**
```
lib/reminders/
├── types.ts              # Reminder schedule types
├── scheduler.ts          # Cron job to check due invoices
└── templates.ts          # Email templates for each stage

app/api/cron/invoice-reminders/
└── route.ts              # Vercel cron endpoint
```

**Effort:** Low (2-3 days)
**Impact:** High (directly reduces payment delays)

---

### 5. Referral Program 🆕 NEW

**Database Insight:** "Referral Program" appears as a growth tactic in 25+ successful micro-SaaS products, including Row 79 (PDF extraction) which matches our ICP exactly.

**Why It Matters:**
- Word of mouth is #1 growth tactic for our ICP
- No competitor (Cash Flow Calendar, YNAB, Monarch) has referral program
- Low CAC acquisition channel

**Proposed Implementation:**

| Component | Description |
|-----------|-------------|
| Referral Link | Unique link per user: `cashcast.money/r/ABC123` |
| Reward (Referrer) | 1 month free Pro OR $5 credit |
| Reward (Referee) | Extended 30-day Pro trial (vs 14-day) |
| Dashboard Widget | "Invite friends, get free months" |
| Tracking | `referrals` table with status tracking |

**Database Schema:**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referee_id UUID REFERENCES auth.users(id),
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, signed_up, converted, rewarded
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ
);
```

**Effort:** Medium (3-5 days)
**Impact:** High (compounds over time)

---

### 6. AI Recurring Detection (PDF Enhancement) 🆕 NEW

**Why It Matters:**
- PDF import already exists; this makes it smarter
- Auto-detects recurring patterns from bank statements
- Reduces manual categorization further

**Proposed Implementation:**

When importing PDF transactions:
1. Group similar transactions by description + amount
2. Check if dates follow a pattern (monthly, weekly, etc.)
3. If confidence > 80%, prompt user:
   > "We found SPOTIFY PREMIUM ($9.99) on the 18th of each month. Import as recurring bill?"

**Algorithm:**
```typescript
interface RecurringPattern {
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  confidence: number;
  occurrences: Date[];
}

function detectRecurring(transactions: Transaction[]): RecurringPattern[] {
  // 1. Group by similar description (fuzzy match) + same amount (±5%)
  // 2. Check if date intervals are consistent
  // 3. Return patterns with confidence > 70%
}
```

**Files to Create:**
```
lib/import/
└── recurring-detector.ts    # Pattern detection algorithm
```

**Effort:** Low (1-2 days)
**Impact:** Medium (improves existing feature)

---

### 7. Email Signature Generator 🆕 NEW

**Database Reference:** Row 167 - "Email signature generator"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $55,000 |
| Starting Costs | $10,000 |
| Solopreneur Score | 90 (very high) |
| ICP | Small Business Owners, Freelancers, Creators |
| Growth Tactics | SEO |

**Why It Matters:**
- Free tool = SEO traffic acquisition
- Freelancers need professional signatures
- Cross-sells to main product

**Proposed Implementation:**

- Standalone page: `/tools/email-signature`
- Form: Name, title, company, phone, email, social links, photo
- Live preview with multiple templates
- Copy HTML button
- CTA: "Track when you'll get paid → Try Cashcast"

**Effort:** Low (2-3 days)
**Impact:** Medium (SEO/acquisition play)

---

### 8. SMS/Push Low Balance Alerts 🆕 NEW

**Database Reference:** Row 39 - "SMS messaging services" + Row 70 - "Business texting services"

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $50,000 - $1.2M |
| Solopreneur Score | 67-72 |
| ICP | SMBs, Small Business Owners, Entrepreneurs |
| Growth Tactics | Word of mouth, SEO |

**Why It Matters:**
- Proactive alerts already exist (dashboard + email)
- SMS/push reaches users immediately
- Critical alerts (cash crunch) need immediate attention

**Proposed Implementation:**

| Alert Type | Channel | Timing |
|------------|---------|--------|
| Cash crunch (<7 days) | SMS + Push | Immediate |
| Bill collision | Push only | 3 days before |
| Invoice overdue | Push only | Day of |
| Opportunity window | Email only | Weekly digest |

**Provider Options:**
- Twilio (~$0.0075/SMS)
- Web Push (free with service worker)

**Effort:** Medium (4-5 days)
**Impact:** Medium (engagement/retention)

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

| Feature | Days | Dependencies |
|---------|------|--------------|
| AI Recurring Detection | 1-2 | PDF import (exists) |
| Automated Payment Reminders | 2-3 | Runway Collect (exists) |
| Email Signature Generator | 2-3 | None |

### Phase 2: Core Features (2-4 weeks)

| Feature | Days | Dependencies |
|---------|------|--------------|
| Referral Program | 3-5 | Stripe billing |
| Time Tracking + Invoicing | 10-15 | Runway Collect (exists) |

### Phase 3: Engagement (4-6 weeks)

| Feature | Days | Dependencies |
|---------|------|--------------|
| SMS/Push Alerts | 4-5 | Proactive alerts (exists) |
| Telegram Bot | 5-7 | AI chat (exists) |
| AI Excel Formula Helper | 3-4 | None |

---

## Growth Tactics Summary

Based on the Micro-SaaS database, the most effective tactics for our ICP:

| Tactic | Frequency in Database | Our Implementation |
|--------|----------------------|-------------------|
| SEO (blog posts, organic) | 80%+ | Free tools, comparison pages |
| Word of mouth | 70%+ | Referral program |
| Referral Program | 25%+ | 🆕 To implement |
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

