# Cashcast - Development Progress

**Last Updated:** April 9, 2026 (Day 66)

**Repository:** https://github.com/omarqouqas/cashcast

**Live URL:** https://cashcast.io

---

## Quick Stats

- **Days in Development:** 66
- **Commits:** 406+
- **Database Tables:** 15
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating + Analytics + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Low Balance Alerts + Simpler Onboarding + Emergency Fund Tracker + Stripe Payment Links + Landing Page Hero Dashboard + Calendar Visual Polish + User Profile Dropdown Redesign + Invoice Branding + Form UX Polish + SEO/AEO Audit + Content Expansion (16 Blog Posts + Glossary) + Dashboard/Calendar Mobile UX Polish + Semi-Monthly Frequency Bug Fixes + Reports & Export Feature + Custom Bill Categories + Credit Card Cash Flow Forecasting + Debt Payoff Planner + User Settings Currency Support + Quotes Feature + Lifetime Deal + Pricing Updates + Comparison Pages + YNAB Import + Import Recurring Entries + Quarterly/Annually Income Frequencies + Excel Import + 6 SEO Blog Posts + Landing Page Repositioning (Sacred Seven PM Review) + Gemini Market Research Integration (Docs + Marketing Content) + Gemini Pivot Analysis & Roadmap + Tax Reserve Calculator Tool + Float Comparison Page + Pulse Comparison Page + Landing Page Niche Messaging + AI-Powered Probabilistic Forecasting (Monte Carlo) + Simplified Navigation + AI Natural Language Queries ("Ask Cashcast") + Smart Categorization for Imports + Branding Refresh + **Proactive AI Alerts**

**Current Focus:**

- **User acquisition via Twitter, Indie Hackers, Facebook Groups** (Reddit account unavailable)
- Direct outreach to freelancers on Twitter (5 DMs/day)
- Validate product-market fit before building new features
- Target: 50 active users, 5 paying customers, 3 testimonials

---

## Recent Development (Days 60-66)

### Day 66: Proactive AI Alerts (April 9, 2026)

**Major Feature: Proactive AI Alerts** - Rule-based alert engine that surfaces actionable insights before problems occur.

**User Value:**
- Get warned about cash crunches before they happen
- See bill collision alerts (3+ bills in 2-day window)
- Surface overdue and at-risk invoices automatically
- Spot opportunity windows when surplus is sustained

**Alert Types:**

| Type | Trigger | Priority |
|------|---------|----------|
| Cash Crunch | Balance < safety buffer within 14 days | Critical/Warning |
| Bill Collision | 3+ bills within 2-day window | Warning/Info |
| Invoice Risk | Overdue or due within 3 days | Critical/Warning |
| Opportunity | 7+ days with 2x safety buffer surplus | Opportunity |

**Technical Implementation:**
- Modular rule engine with pluggable alert rules
- Server-side generation during dashboard page load
- Integrated into weekly email digest with color-coded styling
- Replaced legacy warning banners with unified AlertBanner system
- Priority-based sorting (critical → warning → info → opportunity)
- Max 5 alerts to avoid overwhelming users

**New Files:**
- `lib/alerts/types.ts` - Alert type definitions
- `lib/alerts/rules/cash-crunch.ts` - Low balance detection
- `lib/alerts/rules/bill-collision.ts` - Bill clustering detection
- `lib/alerts/rules/invoice-risk.ts` - Overdue/at-risk invoices
- `lib/alerts/rules/opportunity.ts` - Surplus window detection
- `lib/alerts/engine.ts` - Alert rule orchestrator
- `components/alerts/alert-banner.tsx` - Collapsible alert UI

**Modified Files:**
- `app/dashboard/page.tsx` - Generate and pass alerts to client
- `components/dashboard/dashboard-content.tsx` - Display AlertBanner, removed legacy banners
- `lib/email/types.ts` - Added DigestAlert type
- `lib/email/generate-digest-data.ts` - Generate alerts for email digest
- `components/emails/weekly-digest.tsx` - Render proactive alerts in email

**Bug Fixes:**
- Fixed invoice count bug (dashboard showed 3 vs actual 11 overdue)
- Fixed bill collision balance calculation (was double-counting)
- Removed duplicate warning banners (AlertBanner replaces legacy)

---

### Day 63: Smart Categorization for Imports (April 6, 2026)

**Major Feature: Smart Categorization** - Auto-categorize imported bank transactions using a hybrid rule-based + AI approach.

**User Value:**
- Netflix, Spotify automatically categorized as "Subscriptions"
- Comcast, T-Mobile automatically categorized as "Utilities"
- GEICO, State Farm automatically categorized as "Insurance"
- Unknown merchants categorized by AI with confidence indicators
- Users can override any suggestion before importing

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **Rule Engine** | ~50 merchant patterns, priority-based matching |
| **AI Fallback** | Claude Sonnet for unrecognized transactions |
| **Tier Limits** | Free: 10, Pro/Premium/Lifetime: 50 AI categorizations |
| **Confidence Badges** | Auto (rule), Likely (AI medium), Guess (AI low) |

**Category Patterns:**

| Category | Example Merchants |
|----------|-------------------|
| Subscriptions | Netflix, Spotify, Adobe, Disney+, HBO Max |
| Utilities | Comcast, T-Mobile, Verizon, PG&E, Duke Energy |
| Insurance | GEICO, State Farm, Blue Cross, Aetna |
| Rent/Mortgage | Rocket Mortgage, Greystar, Zillow Rent |
| Transportation | Uber, Lyft, Shell, Exxon, EZPASS |

**New Files:**
- `lib/categorization/types.ts` - Type definitions (CategorySuggestion, CategorizationRule, etc.)
- `lib/categorization/rules.ts` - ~50 merchant patterns organized by category
- `lib/categorization/rule-engine.ts` - Pattern matching with priority ordering
- `lib/categorization/ai-categorize.ts` - Claude API integration with batch processing
- `lib/categorization/index.ts` - Exports and orchestration (categorizeTransactions, mergeSuggestions)
- `app/api/categorize/route.ts` - API endpoint with auth, validation, tier limits

**Modified Files:**
- `components/import/import-page-client.tsx` - Added categorization useEffect, AI loading state
- `components/import/transaction-selector.tsx` - Added Category column with confidence badges

**Bug Fixes (during implementation):**
- Rules now use proper category names instead of hardcoded "Other"
- AI categorization processes first N transactions when over limit (was skipping entirely)
- API validates transaction structure to prevent malformed prompts

---

### Day 63: Branding Refresh (April 6, 2026)

**Updated all branding assets** with new Cashcast visual identity.

**New Assets:**
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` - Browser favicons
- `apple-touch-icon.png` - iOS home screen icon (180px)
- `icon-192x192.png`, `icon-512x512.png` - PWA icons
- `cashcast-lockup.svg` - Horizontal logo for dark backgrounds
- `cashcast-lockup-light-bg.svg` - Horizontal logo for light backgrounds

**Updated Files:**
- `app/layout.tsx` - New favicon and apple-touch-icon meta tags
- `app/dashboard/layout.tsx` - SVG lockup replaces text logo
- `components/landing/landing-header.tsx` - SVG lockup replaces icon + text
- `components/seo/schemas.tsx` - Updated organization logo URL
- `public/manifest.json` - PWA icons (192x192, 512x512) with maskable purpose

**Removed:**
- `public/Old-logo.png`
- `public/cashcast-lockup-dark.png`
- `public/cashcast-logo-horizontal.svg`
- `public/icon-512x512-optimized.png`

---

### Day 63: Landing Page AI Feature Coverage (April 6, 2026)

**Updated landing page to showcase all three AI features:** Monte Carlo forecasting, Ask Cashcast, and Smart Categorization.

**Hero Section:**
- Added "AI-powered insights" badge with violet styling
- Added new tagline: "Ask questions in plain English. AI answers instantly."

**How it Works Section:**
- Step 3 updated: "AI-powered confidence bands showing your risk of running low"
- Updated HowTo schema for SEO consistency

**Features Section:**
- New "AI-Powered Features" row with violet color scheme
- **Ask Cashcast** card: Natural language queries, 5 free/day, unlimited Pro
- **Know Your Risk** card: Monte Carlo P10/P50/P90 bands, overdraft probability
- **Auto-Categorize Imports** card: 50+ patterns, AI fallback, confidence badges

**Pricing Section:**
- Free tier: Added AI risk analysis, 5 AI queries/day, 10 auto-categorizations/import
- Pro tier: Added unlimited AI queries, 50 auto-categorizations/import

**FAQ Section (5 new items):**
- "What is Ask Cashcast?"
- "What can I ask Cashcast?"
- "What are confidence bands?"
- "How does auto-categorization work?"
- "Is my financial data used to train AI?"
- Updated "Free vs Pro" FAQ with AI feature differences

**Files Modified:**
- `app/page.tsx` - Hero, How it Works, Features sections
- `components/pricing/pricing-section.tsx` - Tier feature lists
- `components/landing/faq-section.tsx` - 5 new AI FAQs

---

### Day 63: AI-Powered Weekly Digest Insights (April 6, 2026)

**Enhanced weekly email digest with AI-generated personalized insights** using Claude.

**What's New:**
- 2-3 personalized insights per email based on user's financial data
- Insights are actionable and encouraging (not alarmist)
- Graceful fallback to rule-based insights if AI fails
- Violet-themed "AI Insights" section in email

**Example Insights:**
- "Great week ahead! You're projected to be $450 in the green."
- "Your Netflix and Spotify both hit on Tuesday—consider spacing them out."
- "With no bills due, this is a perfect week to boost your emergency fund."

**Technical Implementation:**
- Uses Claude Sonnet for insight generation
- Falls back to rule-based defaults on error
- Non-blocking: digest still sends even if AI fails

**New Files:**
- `lib/email/generate-ai-insights.ts` - AI insight generator with fallback

**Modified Files:**
- `lib/email/generate-digest-data.ts` - Added aiInsights field and generation
- `components/emails/weekly-digest.tsx` - Added AI insights section to template

---

### Day 63: Ask Cashcast Suggested Questions (April 6, 2026)

**Added clickable suggested questions to Ask Cashcast modal** - Helps users discover what they can ask.

**Suggested Questions:**
- "Can I afford a $500 purchase next week?"
- "When will my balance be lowest?"
- "How much should I save for taxes?"
- "How stable is my income?"

**UX:**
- Displayed in empty state (before any messages)
- Clicking a question auto-submits it instantly
- Disabled when rate limit reached (remaining === 0)
- Rounded pill buttons with violet hover state

**File Modified:**
- `components/ask/ask-modal.tsx` - Added suggested questions UI and handler

---

### Day 63: Ask Cashcast FAB - App-Wide (April 6, 2026)

**Moved Ask Cashcast FAB to authenticated app layout** so it appears on all dashboard pages, not just the main dashboard.

**Change:**
- FAB now visible on: Dashboard, Bills, Income, Invoices, Reports, Settings, Calendar, etc.
- Removed duplicate FAB from dashboard-content.tsx
- Consistent AI access point across the entire authenticated experience

**Files Modified:**
- `app/dashboard/layout.tsx` - Added AskButton FAB
- `components/dashboard/dashboard-content.tsx` - Removed duplicate FAB

**Layout:**
```
┌─────────────────────────────┐
│         Page Content        │
│ [Feedback]        [Ask AI]  │  ← FABs (z-40)
├─────────────────────────────┤
│  Home Accounts ... Settings │  ← Mobile nav (z-50)
└─────────────────────────────┘
```

---

### Day 63: Earlier Updates (April 6, 2026)
- `public/logo.png` - Old square logo
- `public/Old-logo.png`, `public/cashcast-lockup-dark.png` - Deprecated assets

---

### Day 62: AI Natural Language Queries (April 6, 2026)

**Major Feature: "Ask Cashcast"** - Added a chat-style interface where users can ask financial questions in plain English, powered by Claude with real-time access to their financial data through tool calling.

**User Value:**
- Ask questions like "Can I afford a $2000 laptop next Friday?"
- Get personalized answers based on actual account balances and upcoming transactions
- Follow-up questions within the same conversation
- No need to navigate to specific tools - just ask

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **LLM Provider** | Anthropic Claude (Sonnet for complex, Haiku for simple) |
| **Streaming** | Server-Sent Events (SSE) for real-time responses |
| **Tools** | 6 financial tools exposed via Claude function calling |
| **Rate Limiting** | 5 queries/day free, unlimited Pro |

**Tools Exposed to Claude:**

| Tool | Use Case |
|------|----------|
| `calculate_affordability` | "Can I afford X?" |
| `calculate_payment_date` | "When will client pay?" |
| `calculate_tax_reserve` | "How much for taxes?" |
| `calculate_income_variability` | "How stable is my income?" |
| `calculate_hourly_rate` | "What should I charge?" |
| `get_forecast_summary` | "When is my lowest balance?" |

**New Files:**
- `lib/ai/client.ts` - Anthropic SDK client, model selection logic
- `lib/ai/tools.ts` - Tool definitions with JSON schemas for Claude
- `lib/ai/execute-tool.ts` - Tool execution dispatcher routing to calculation functions
- `lib/ai/system-prompt.ts` - System prompt builder with user financial context
- `lib/ai/context.ts` - Fetch user accounts, income, bills, settings from Supabase
- `lib/ai/usage.ts` - Query usage tracking (checkQueryUsage, incrementQueryUsage)
- `lib/ai/types.ts` - TypeScript types (StreamEvent, UserFinancialData, etc.)
- `app/api/ai/chat/route.ts` - Streaming API endpoint with tool use loop
- `components/ask/ask-button.tsx` - Trigger button (FAB, card, nav, mobile-nav variants)
- `components/ask/ask-modal.tsx` - Chat modal with streaming responses
- `components/ask/index.ts` - Exports
- `supabase/migrations/20260406000001_add_ai_query_usage.sql` - Usage tracking table + RLS + increment function

**Modified Files:**
- `components/dashboard/dashboard-content.tsx` - Integrated AskButton as card
- `lib/stripe/feature-gate.ts` - Exported getUserTier for AI usage tracking
- `.env.example` - Added ANTHROPIC_API_KEY configuration

**Database Changes:**
- New `ai_query_usage` table for daily query tracking
- `increment_ai_query_usage` PostgreSQL function for atomic upsert
- RLS policies for secure user-only access

**UI Features:**
- Violet-themed button (distinct from teal Scenario button)
- Chat modal with message history
- Tool execution indicator (shows which tool is running)
- Streaming text responses
- Remaining queries indicator for free users
- Upgrade prompt when limit reached

**Bug Fixes During Implementation:**
- Fixed conversation history not being sent to API (follow-up questions now work)
- Fixed TypeScript errors with Supabase types using type assertions
- Fixed useEffect return path in ask-modal.tsx

**Dependencies Added:**
- `@anthropic-ai/sdk` - Anthropic Claude API client

**Commits:**
- AI chat API route with streaming and tool calling
- Ask button and modal components
- Database migration for usage tracking
- Conversation history support
- Dashboard integration

---

### Day 61: AI-Powered Probabilistic Forecasting (April 4, 2026)

**Major Feature: Monte Carlo Simulation** - Added probabilistic forecasting to give users confidence intervals and risk metrics for their cash flow projections.

**User Value:**
- See P10/P50/P90 confidence bands on the forecast chart
- Know the probability of overdrafting (e.g., "15% chance of dropping below $0")
- Understand worst-case balance scenarios
- Make better financial decisions with uncertainty quantified

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **Simulation Count** | 500 iterations per forecast |
| **Performance** | ~9ms compute time (target was <200ms) |
| **RNG** | Seeded mulberry32 PRNG for reproducibility |
| **Distribution** | Box-Muller transform for normal sampling |

**Variance Configuration by Frequency:**

| Frequency | Amount CV | Timing Variance |
|-----------|-----------|-----------------|
| Weekly | 2% | ±0 days |
| Bi-weekly | 3% | ±1 day |
| Semi-monthly | 3% | ±1 day |
| Monthly | 5% | ±2 days |
| Quarterly | 10% | ±5 days |
| Annually | 15% | ±7 days |
| Irregular | 25% | ±10 days |
| One-time | 10% | ±3 days |

**New Files:**
- `lib/calendar/monte-carlo/types.ts` - Type definitions (ProbabilisticDay, RiskMetrics, MonteCarloResult, MonteCarloConfig)
- `lib/calendar/monte-carlo/variance-config.ts` - Variance parameters by frequency type
- `lib/calendar/monte-carlo/random.ts` - Seeded PRNG, Box-Muller transform, amount/timing variance utilities
- `lib/calendar/monte-carlo/simulation.ts` - Core Monte Carlo engine with 500 simulations
- `lib/calendar/monte-carlo/index.ts` - Public exports
- `components/dashboard/risk-metrics.tsx` - Risk metrics display component

**Modified Files:**
- `lib/calendar/types.ts` - Added `monteCarlo?: MonteCarloResult` to CalendarData interface
- `app/dashboard/page.tsx` - Integrated Monte Carlo call after generateCalendar()
- `components/charts/forecast-balance-chart.tsx` - Added confidence band Areas for P10/P90 visualization
- `components/dashboard/dashboard-content.tsx` - Integrated RiskMetrics component, passes probabilisticDays to chart

**Risk Metrics Displayed:**
- "X% chance of overdraft" - Probability of balance going below zero
- "X% chance below safety buffer" - Probability of dipping below user's buffer
- "Worst case balance: $X" - P10 lowest balance across simulation period
- Color-coded risk indicators (emerald/amber/rose for low/medium/high risk)

**Confidence Bands on Chart:**
- Shaded area between P10 (pessimistic) and P90 (optimistic)
- Semi-transparent teal fill with gradient
- Deterministic forecast (P50) shown as main line

**Bug Fix During Implementation:**
- Fixed timing shift bug where transactions were disappearing instead of moving to target days
- Solution: Pre-compute all transactions with original day indices, then properly shift to target days in each simulation

**Unit Tests Verified:**
- P50 ≈ deterministic forecast (within tolerance)
- Percentile ordering: P10 < P50 < P90
- Risk metrics correctly detect overdraft scenarios
- Performance target met (<200ms)

**Commits:**
- Monte Carlo simulation engine and integration
- Risk metrics component
- Confidence band visualization
- Timing shift bug fix

**UX Improvement: Simplified Navigation**

Reduced desktop nav from 10 items to 5 main items + "More" dropdown for better laptop screen compatibility:

| Main Nav (5 items) | "More" Dropdown (5 items) |
|-------------------|---------------------------|
| Calendar (NEW) | Transfers |
| Accounts | Debt Payoff |
| Income | Quotes |
| Bills | Import |
| Invoices | Reports |

- Prevents horizontal overflow on smaller laptop screens
- Groups secondary features logically
- Maintains quick access to core workflow (Accounts → Income → Bills → Invoices)
- Added global `overflow-x: hidden` to prevent white panel artifacts

---

### Day 60: Gemini Pivot Analysis & Roadmap (March 7, 2026)

**Strategic Analysis** - Consolidated Gemini Deep Research recommendations against current product state to identify actual gaps vs already-implemented features.

**Key Finding:** Many Gemini "recommendations" describe features already implemented:

| Gemini Suggestion | Current State |
|-------------------|---------------|
| "Show Safe to Spend above the fold" | Hero dashboard with Safe to Spend focal point |
| "What-If Engine" scenario modeling | "Can I Afford It?" scenario tester |
| "Milestone & Quote-to-Invoice tracking" | Quotes feature with invoice conversion |
| "Traffic light color logic" | emerald/amber/rose balance status |
| "Low Balance Alerts" | Daily cron with 7-day warning emails |
| "Tax Deadline Alerts" | Tax Savings Tracker with quarterly countdown |
| "ADHD-friendly progressive disclosure" | Collapsible sections, essential stats visible |

**Implication:** Product is feature-complete for core value prop. Bottleneck is awareness/positioning, not functionality.

**New Actionable Recommendations Identified:**

| Priority | Item | Type |
|----------|------|------|
| P0 | Specific metric testimonials | Marketing |
| P0 | Founder video (60-sec raw) | Marketing |
| P0 | Niche messaging (knowledge workers) | Marketing |
| P1 | Tax Reserve Calculator tool | Lead gen |
| P1 | Float/Pulse comparison pages | SEO |
| P1 | Tax Vault in Safe to Spend | Feature |
| P2 | Onboarding templates | Feature |
| P3 | AI payment prediction | Feature |

**Rejected Gemini Suggestion:**
- Headline "Stop Guessing if You Can Cover Rent: 365-Day Liquidity Planning for B2B Contractors"
- Reason: Too long (15 words vs current 6), jargon-heavy, less emotionally resonant
- Verdict: Keep current headline

**New Document Created:**
- `docs/gemini-market-research-app-pivot.md` - Complete pivot analysis with:
  - Features already implemented (no changes needed)
  - Partially implemented features (gaps identified)
  - New actionable recommendations
  - Implementation roadmap (Phase 0-5)
  - Updated priority matrix

**Strategic Direction:**
1. **This week:** Collect metric testimonials, record founder video
2. **Next 2 weeks:** Tax calculator tool, comparison pages, messaging updates
3. **Month 2:** Tax Vault integration, onboarding templates
4. **Future:** AI predictions, Canadian market based on traction

**Commits:**
- `ed6f12f` docs: add Gemini market research app pivot recommendations

---

**Tax Reserve Calculator Tool** - New free lead-gen tool at `/tools/tax-reserve-calculator` for freelancers to calculate how much to set aside for taxes.

**Features:**

| Country | Tax Types Calculated |
|---------|---------------------|
| **US** | Self-employment tax (15.3%), Federal income tax (2025 brackets), State tax estimate (~5%) |
| **Canada** | CPP contributions (both portions), Federal income tax, Provincial tax (all 13 provinces), GST/HST reserve |

**Key Outputs:**
- **Safe to Spend** - Amount available after setting aside tax reserve
- **Monthly Reserve** - How much to set aside each month
- **Quarterly Payment** - Estimated installment amount
- **Tax Breakdown** - Detailed breakdown by tax type
- **Alerts** - GST/HST $30K threshold warning, quarterly payment reminders

**Canadian-Specific Features:**
- All 13 provinces/territories with correct HST rates
- GST/HST threshold alert at $30K gross revenue
- CPP self-employed calculation (both employer + employee portions)
- Canadian quarterly due dates (Mar 15, Jun 15, Sep 15, Dec 15)

**New Files:**
- `lib/tools/calculate-tax-reserve.ts` - Tax calculation logic (US + Canada)
- `components/tools/tax-calculator-form.tsx` - Form with country/province selection
- `components/tools/tax-calculator-result.tsx` - Result display with breakdown
- `components/tools/tax-calculator.tsx` - Main wrapper component
- `app/tools/tax-reserve-calculator/page.tsx` - Page with SEO metadata and FAQs
- `app/tools/tax-reserve-calculator/opengraph-image.tsx` - Dynamic OG image

**Modified Files:**
- `components/tools/tools-index-client.tsx` - Added to tools grid
- `components/landing/footer.tsx` - Added to Free Tools section

**SEO:**
- Keywords: freelance tax calculator, self-employed tax calculator, HST calculator Canada, quarterly tax calculator
- FAQ schema with 4 questions
- WebApplication schema

**Commits:**
- `9d5cec5` feat: add Tax Reserve Calculator tool
- `225ca71` feat: add Tax Calculator to footer Free Tools section

---

**Float Comparison Page** - New SEO comparison page at `/compare/float` targeting freelancers looking for Float alternatives.

**Key Differentiators vs Float:**

| Feature | Cashcast | Float |
|---------|---------------------|-------|
| Price | $7.99/mo (87% cheaper) | $59-199/mo |
| Requires accounting software | No (standalone) | Yes (Xero/QuickBooks) |
| Target user | Freelancers | Growing SMBs |
| Built-in invoicing | Yes (Runway Collect) | No |
| "Safe to Spend" metric | Core feature | Not available |
| Setup time | 5 minutes | 30+ minutes |

**Page Sections:**
- Price comparison cards (Float vs CFF vs Savings)
- "Who each tool is for" side-by-side comparison
- 22-feature comparison table
- "Why freelancers choose us over Float" benefits grid
- FAQ section (5 questions with structured data)
- Links to other comparisons (YNAB, Mint, All Apps)
- Related guides (Cash Flow Forecasting, Tax Calculator)

**SEO:**
- Keywords: float alternative, float cash flow alternative, cheaper than float, float for freelancers
- FAQ schema for rich snippets
- Canonical URL: `/compare/float`

**Files Created:**
- `app/compare/float/page.tsx` - Full comparison page

**Files Modified:**
- `components/landing/footer.tsx` - Added "vs Float" to Compare section

**Commits:**
- `fca9460` feat: add Float comparison page

---

**Pulse Comparison Page** - New SEO comparison page at `/compare/pulse` targeting freelancers looking for Pulse alternatives.

**Key Differentiators vs Pulse:**

| Feature | Cashcast | Pulse |
|---------|---------------------|-------|
| Price | $7.99/mo (73% cheaper) | $29-89/mo |
| Data entry | Guided forms | Spreadsheet-style |
| Built-in invoicing | Yes (Runway Collect) | No |
| "Safe to Spend" metric | Core feature | Not available |
| Tax tracking | Yes + free calculator | No |
| Target user | Solo freelancers | Small agencies |

**Page Sections:**
- Price comparison cards (Pulse vs CFF vs Savings)
- Key differences (4 cards: Guided vs Spreadsheet, Invoicing, Safe to Spend, Tax tracking)
- 21-feature comparison table
- FAQ section (4 questions with structured data)
- Links to other comparisons (Float, YNAB, All Apps)
- Related guides (What is Safe to Spend, Tax Calculator)

**SEO:**
- Keywords: pulse alternative, pulse app alternative, cheaper than pulse, pulseapp alternative
- FAQ schema for rich snippets
- Canonical URL: `/compare/pulse`

**Files Created:**
- `app/compare/pulse/page.tsx` - Full comparison page

**Files Modified:**
- `components/landing/footer.tsx` - Added "vs Pulse" to Compare section

**Commits:**
- `66978fa` feat: add Pulse comparison page

---

**Landing Page Niche Messaging** - Updated landing page to target specific high-value knowledge professionals based on Gemini Market Research pivot recommendations.

**Hero Badge Update:**
- Changed from "Built for freelancers with irregular income" → "Built for designers, developers & consultants"
- More specific targeting for knowledge worker niche

**"Who It's For" Section Updates:**

| Before | After |
|--------|-------|
| Graphic Designers | UX Designers |
| Freelance Writers | AI & ML Consultants |
| Marketing Consultants | Marketing Strategists |
| Web Developers | Web Developers (kept) |

**Pricing Comparison Callout:**
- New section before pricing with teal highlight styling
- Links to Float comparison (87% cheaper)
- Links to Pulse comparison (73% cheaper)
- Links to all comparisons page

**Meta Keywords Added (15 new):**

Profession-specific:
- `ux designer finances`, `ux designer budget app`
- `web developer cash flow`, `developer freelance budget`
- `ai consultant finances`, `ml consultant cash flow`
- `marketing consultant budget`, `consultant cash flow forecast`
- `designer invoice tracking`, `developer project payments`

Comparison terms:
- `float app alternative`, `pulse app alternative`
- `cheaper than float`, `float alternative freelancer`
- `pulse alternative freelancer`

**Files Modified:**
- `app/page.tsx` - Hero badge, Who It's For section, pricing callout, keywords

**Commits:**
- `4460e41` feat: update landing page messaging for niche targeting

---

*For detailed entries from Days 40-59, see [archive/development-progress-days-40-59.md](archive/development-progress-days-40-59.md).*

---

## Earlier Development Summary (Days 1-59)

### Days 40-59 Summary (January-March 2026)

| Day | Feature |
|-----|---------|
| 59 | Gemini Market Research Integration |
| 58 | Landing Page Repositioning + PM Strategy Review |
| 57 | Excel Import Support + 6 SEO Blog Posts |
| 56 | Bug Fixes & Type Safety (12 fixes) |
| 55 | Import Recurring Entries + Income Frequency Expansion |
| 54 | Pricing Updates ($99 Lifetime) + Competitor Migration Pages |
| 53 | Lifetime Deal Feature |
| 52 | Quotes Feature |
| 51 | User Settings Currency Support |
| 50 | Credit Card Cash Flow Forecasting + Debt Payoff Planner |
| 49 | Custom Bill Categories |
| 48 | Reports & Export Feature |
| 47 | Semi-Monthly Frequency Bug Fixes |
| 46 | Dashboard & Calendar Mobile UX Polish |
| 45 | Form UX Polish + SEO/AEO Audit + Content Expansion |
| 44 | User Profile Dropdown + Invoice Branding |
| 43 | Landing Page Hero Dashboard + Calendar Visual Polish |
| 42 | Stripe Payment Links for Invoices |
| 41 | Simpler Onboarding + Emergency Fund Tracker |
| 40 | Low Balance Alerts + Safe to Spend Marketing |

### Days 36-39: UI/UX Polish Phase

- **Day 39:** Automated welcome email system, user outreach campaign (6 inactive users)
- **Day 38:** Comprehensive filter system for all pages (Calendar, Dashboard, Bills, Income, Invoices, Accounts) with URL persistence
- **Day 37:** Import page YNAB-inspired redesign with step indicator, column auto-detection, duplicate detection
- **Day 36:** YNAB-inspired calendar redesign with interactive balance trend chart, enhanced day cards, hybrid responsive layout

### Days 33-35: Features & SEO

- **Day 35:** Tax Savings Tracker (YTD income, quarterly deadlines, dashboard widget)
- **Day 34:** PostHog NPS survey, in-app feedback widget, semi-monthly frequency support
- **Day 33:** SEO targeting "cash flow calendar", comparison page at `/compare/cash-flow-calendar-apps`

### Days 27-32: Tools & Polish

- **Day 32:** Income Variability Calculator free tool
- **Day 31:** Invoice Payment Date Predictor free tool
- **Day 30:** Social sharing OG/Twitter fixes, dynamic OG images
- **Day 29:** Landing page revamp with 3-pillar structure, "Who It's For" section
- **Day 28:** Pricing simplification (sunset Premium, Pro now includes 365-day forecasts)
- **Day 27:** CSV import UX fixes, list refresh bug fixes

### Day 26: Weekly Email Digest

- Weekly digest preferences in user_settings
- Digest data from calendar projection + collision detection
- Hourly cron job with timezone-aware sending
- Signed unsubscribe + tracking endpoints

### Days 23-25: SEO & Dashboard

- **Day 25:** Dashboard guidance cards (Daily Budget, Path Forward), mobile responsiveness
- **Day 23:** FAQ section with FAQPage schema, Terms/Privacy pages, sitemap/robots

### Day 22: Feature Gating + Analytics + Stripe Live

**PostHog Analytics:** User identification, core event tracking (signups, onboarding, feature usage, conversions), session recording

**Feature Gating System:**
- Client hooks: `useSubscription()`, `useUsage()`
- Server utilities: `canAddBill()`, `canAddIncome()`, `canUseInvoicing()`
- Upgrade prompts, usage indicators, gated buttons

**Stripe Live Mode:** Real payments processing, full subscription lifecycle tested

### Day 21: Stripe Integration

- Stripe Checkout with user metadata
- Webhook handler for subscription events
- Subscriptions database table with RLS
- Customer Portal integration

### Days 17-20: Launch Prep

- **Day 20:** Landing page polish, Google OAuth
- **Day 19:** Payment reminders (3 escalating templates)
- **Day 18:** Post-launch polish
- **Day 17:** Runway Collect invoicing (PDF generation, email sending), deployment to Vercel

### Days 9-16: Calendar & Landing

- **Days 14-15:** Calendar polish (dark theme, warnings, "Can I Afford It?" scenarios)
- **Days 11-13:** Calendar UI implementation
- **Days 9-10:** Calendar algorithm
- **Day 16:** Landing page

### Days 1-8: Foundation

- **Days 6-8:** Core data models (accounts, income, bills CRUD)
- **Days 4-5:** Authentication (Supabase Auth, email + Google OAuth)
- **Days 1-3:** Foundation (Next.js 15, Supabase, Tailwind, project structure)

---

## Infrastructure Status

### Completed

- Domains: cashcast.io, .app (DNS via Namecheap → Vercel)
- Database: Supabase with 15 tables, RLS, TypeScript types
- Hosting: Vercel with custom domain, SSL
- Payments: Stripe live mode (checkout, webhooks, portal)
- Analytics: PostHog (events, session recording, NPS surveys)
- Email: Resend (transactional, digest, alerts)

### Next Up

- Reddit launch
- Sentry error monitoring

---

## Tier Limits

| Feature | Free | Pro | Lifetime |
|---------|------|-----|----------|
| Bills | 10 | Unlimited | Unlimited |
| Income Sources | 10 | Unlimited | Unlimited |
| Forecast Days | 90 | 365 | 365 |
| AI Queries (Ask Cashcast) | 5/day | Unlimited | Unlimited |
| Invoicing | No | Yes | Yes |
| Stripe Payment Links | No | Yes | Yes |
| CSV Export | Yes | Yes | Yes |
| Excel/JSON Export | No | Yes | Yes |
| Export History | 5 items | Unlimited | Unlimited |
| Price | $0 | $7.99/mo | $99 one-time |

---

## PostHog Events Tracked

**Auth:** `user_signed_up`, `user_logged_in`
**Onboarding:** `onboarding_started`, `onboarding_step_completed`, `onboarding_completed`
**Core Features:** `account_created`, `income_created`, `bill_created`, `calendar_viewed`, `scenario_tested`
**Invoicing (Pro):** `invoice_created`, `invoice_sent`, `reminder_sent`
**Feedback:** `feedback_submitted`
**Conversion:** `upgrade_prompt_shown`, `upgrade_initiated`, `subscription_created`, `subscription_cancelled`
**Alerts:** `low_balance_alert_sent`, `welcome_email_sent`
**Tax:** `tax_tracking_toggled`, `tax_settings_updated`
**Emergency Fund:** `emergency_fund_settings_updated`
**Exports:** `export_generated`, `report_downloaded`

---

## Feature Roadmap

### Completed

| Feature | Notes |
|---------|-------|
| 90/365-day cash flow calendar | Core feature, tier-based |
| Accounts/Income/Bills CRUD | All frequencies supported |
| Runway Collect invoicing | PDF, email, reminders, Stripe payments |
| Onboarding wizard | 2-step guided setup |
| "Can I Afford It?" scenarios | Core differentiator |
| Google OAuth | One-click signup |
| Stripe payments | Checkout, webhooks, portal, Connect |
| PostHog analytics | Full event tracking |
| Feature gating | Tier limits enforced |
| Weekly email digest | Timezone-aware, collision warnings |
| Tax Savings Tracker | YTD income, quarterly deadlines |
| Emergency Fund Tracker | Progress bar, goal tracking |
| Low Balance Alerts | Proactive 7-day warnings |
| Comprehensive filters | URL-persisted, all pages |
| YNAB-inspired UI | Dark theme, interactive chart |
| Interactive landing hero | Demonstrates product pre-signup |
| User profile dropdown | Avatar, plan badge, quick actions |
| Invoice branding | Logo upload, business name on PDFs |
| Currency input formatting | Comma formatting as you type |
| Form UX consistency | Unified styling, mobile touch targets |
| Reports & Export | CSV/Excel/JSON export, quick reports, custom builder |
| Custom Bill Categories | User-defined categories with colors, icons, inline creation |
| Data Visualization Charts | Forecast balance chart, payoff timeline chart (Recharts) |
| User Currency Preference | All currency displays respect user_settings.currency |
| Probabilistic Forecasting | Monte Carlo simulation with P10/P50/P90 confidence bands |
| Natural Language Queries | "Ask Cashcast" chat with Claude-powered tool calling |

### Upcoming

| Feature | Priority |
|---------|----------|
| Reddit launch | HIGH |
| Sentry error monitoring | MEDIUM |
| Plaid bank sync | LOW |

---

## Development Velocity

**Cumulative:** ~98-115 hours over 44 days
**Average:** ~2.5 hours per day

---

## What's Working Well

- Complete MVP with all core features
- Simpler onboarding (2-step, ~60 seconds)
- YNAB-inspired calendar with interactive chart
- Bill collision warnings (calendar + email digest)
- Stripe live mode with Connect for invoice payments
- PostHog tracking conversion funnel
- Feature gating enforcing tier limits
- Emergency Fund + Tax Savings trackers
- Low balance email alerts
- Polished user profile dropdown with avatar
- Consistent form UX with comma-formatted currency inputs
- Mobile-optimized touch targets (44px minimum)
- Dashboard mobile layout with responsive text and no overflow
- Calendar mobile UX with always-visible stats (no "Tap for more")
- Mobile navigation with user avatar menu and Dashboard as Home
- Reports & Export with quick reports, custom builder, and export history
- Custom bill categories with colors, icons, and inline creation
- Data visualization with Recharts (payoff timeline, forecast balance charts)
- Improved empty states with context-aware messaging
- Centralized currency preference from user_settings (no hardcoded $ symbols)
- Quotes feature with quote-to-invoice conversion workflow
- Lifetime deal option ($99) for upfront payment preference
- **AI-powered probabilistic forecasting** with Monte Carlo simulation (P10/P50/P90 confidence bands)
- Risk metrics showing probability of overdraft and worst-case scenarios
- **AI Natural Language Queries** - "Ask Cashcast" chat modal powered by Claude
- Tool calling with 6 financial tools (affordability, payment date, tax reserve, etc.)
- Real-time streaming responses with conversation history
- Rate limiting (5/day free, unlimited Pro)

## What's Next

1. **Reddit launch** - Post to target subreddits
2. **Monitor analytics** - NPS responses, conversion funnel, alert effectiveness
3. **User feedback iteration** - Based on real usage
4. **Sentry error monitoring** - Catch production errors

---

**Status:** **FULLY LAUNCH-READY** - Live payments, feature gating, analytics all working in production!

**This is a living document. Update after each development session.**
