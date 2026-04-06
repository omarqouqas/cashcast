# Cashcast - Development Progress

**Last Updated:** April 6, 2026 (Day 63)

**Repository:** https://github.com/omarqouqas/cashcast

**Live URL:** https://cashcast.io

---

## Quick Stats

- **Days in Development:** 63
- **Commits:** 406+
- **Database Tables:** 15
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating + Analytics + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Low Balance Alerts + Simpler Onboarding + Emergency Fund Tracker + Stripe Payment Links + Landing Page Hero Dashboard + Calendar Visual Polish + User Profile Dropdown Redesign + Invoice Branding + Form UX Polish + SEO/AEO Audit + Content Expansion (16 Blog Posts + Glossary) + Dashboard/Calendar Mobile UX Polish + Semi-Monthly Frequency Bug Fixes + Reports & Export Feature + Custom Bill Categories + Credit Card Cash Flow Forecasting + Debt Payoff Planner + User Settings Currency Support + Quotes Feature + Lifetime Deal + Pricing Updates + Comparison Pages + YNAB Import + Import Recurring Entries + Quarterly/Annually Income Frequencies + Excel Import + 6 SEO Blog Posts + Landing Page Repositioning (Sacred Seven PM Review) + Gemini Market Research Integration (Docs + Marketing Content) + Gemini Pivot Analysis & Roadmap + Tax Reserve Calculator Tool + Float Comparison Page + Pulse Comparison Page + Landing Page Niche Messaging + AI-Powered Probabilistic Forecasting (Monte Carlo) + Simplified Navigation + AI Natural Language Queries ("Ask Cashcast") + Smart Categorization for Imports + **Branding Refresh**

**Current Focus:**

- **User acquisition via Twitter, Indie Hackers, Facebook Groups** (Reddit account unavailable)
- Direct outreach to freelancers on Twitter (5 DMs/day)
- Validate product-market fit before building new features
- Target: 50 active users, 5 paying customers, 3 testimonials

---

## Recent Development (Days 40-63)

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

### Day 59: Gemini Market Research Integration (March 1, 2026)

**Strategic Documentation Update** - Incorporated comprehensive market research from Gemini Deep Research into product documentation.

**Key Data Points Added:**

| Metric | Value | Source |
|--------|-------|--------|
| Global freelance population | 1.57 billion (2025) | Gemini Research |
| Projected growth | 1.8 billion+ by 2030 | Gemini Research |
| Online freelance market | $8.50 trillion (2025) | Gemini Research |
| US freelancer growth | 76.4M → 90.1M by 2028 | Gemini Research |
| Cash flow failure rate | 82% of failures | Gemini Research |
| Late payment rate | 47-50% in first 6 months | Gemini Research |
| Admin time waste | 36% of working hours | Gemini Research |
| Forecast accuracy improvement | 30-50% with automation | Gemini Research |

**New Strategic Insights:**

1. **Vertical Niche Strategy** - Defined "Project-Based Knowledge Professionals" (UX, AI, Marketing) as beachhead target
2. **Competitor Pricing Analysis** - Added Pulse ($29-89/mo), Float ($59-199/mo), QBO (~$20/mo) comparison
3. **Canadian Market Opportunity** - Documented GST/HST, CPP, and tax installment implications
4. **"Safe to Spend" as North Star** - Positioned as key differentiator from backward-looking tools

**Documents Updated:**
- `docs/product-brief.md` - Market size, pain point stats, competitor analysis, Canadian market section
- `docs/strategic-considerations.md` - Vertical niche strategy, competitor pricing, decision log
- `docs/development-progress.md` - Day 59 entry

**Research Source:** `docs/Gemini-Market-Research.md` (Gemini Deep Research, March 2026)

**Marketing Content Updates** - Integrated research statistics into user-facing content.

**Landing Page (`app/page.tsx`):**
- Added 3-column stat grid (82% failure rate, 47% income instability, 80% can't handle emergencies)
- Added "36% non-billable admin time" to Never Get Blindsided section
- Added "1.57 billion freelancers globally" to Who It's For section
- Added "25-30% tax reserve" to Save for Taxes section
- Added "43% still use spreadsheets" to final CTA section

**FAQ Section (`components/landing/faq-section.tsx`):**
- Updated existing FAQs with validated statistics
- Added 2 new FAQs: "Why do so many freelancers struggle with cash flow?" and "How accurate is automated cash flow forecasting vs spreadsheets?"

**Blog Posts Updated:**
- `cash-flow-forecasting-for-freelancers` - Added 82%, 47-50%, 80% stats; updated spreadsheet vs tool comparison with 30-50% accuracy improvement
- `how-to-manage-irregular-income-as-freelancer` - Added 82% and 80% callout box
- `freelancer-emergency-fund-how-much` - Added 80% and 82% callout box
- `best-cash-flow-apps-freelancers-2026` - Added 82% and 47% intro callout

**Comparison Pages Updated:**
- `cash-flow-calendar-apps` - Added 82%, 30-50% accuracy, 2-5 hours savings stats
- `ynab` - Added 82% and 47% callout box
- `mint` - Added 82% and 80% callout box

**Commits:**
- `1532424` docs: integrate Gemini market research into product documentation
- `f281409` feat: integrate Gemini research statistics into marketing content

---

### Day 58: Landing Page Repositioning + PM Strategy Review (February 11, 2026)

**Strategic Product Review** - Conducted comprehensive product analysis using "Product Management's Sacred Seven" framework (Product Design, Economics, Psychology, UX, Data Science, Law & Policy, Marketing & Growth).

**Key Findings:**
- Product identity crisis: Too many features (forecasting + invoicing + debt payoff + tax tracking = 5+ products in one)
- Pricing psychology mismatch: $7.99/mo may be underpriced for value delivered
- Build-to-validate ratio inverted: 58 days development, only ~13 users
- Domain/brand: "cashcast.io" is generic and hard to remember
- No social proof: Zero testimonials, no user counts displayed

**Landing Page Repositioning:**

| Element | Before | After |
|---------|--------|-------|
| Headline | "Forecast Your Cash Flow. Get Paid Faster." | "Stop guessing if you can afford it." |
| Subheadline | Long paragraph about invoicing features | "See your real bank balance 90 days out — no bank connection required." |
| Social Proof | None | "Join 50+ freelancers testing the beta" |
| CTA #1 | "Ready to forecast your cash flow..." | "Know if you'll make rent — 90 days before it's due" |
| CTA #2 | "Ready to forecast and get paid..." | "Stop the 'can I afford this?' anxiety" |
| Meta Title | "Cash Flow Calendar for Freelancers" | "Stop Guessing If You Can Afford It" |

**New Documentation:**
- `seven-sacred-PM-skills.md` - Complete Sacred Seven framework analysis
- `implementation-plan.md` - Phased action plan (P0-P3) with validation checkpoints

**Files Modified:**
- `app/page.tsx` - Landing page headline, subheadline, CTAs, meta tags, social proof

**Commits:**
- Landing page repositioning based on Sacred Seven PM framework

**Next Actions (P0 - This Week):**
1. Post Twitter thread (drafted)
2. Create Facebook account (personal, real name)
3. Join 2-3 freelancer Facebook groups
4. Post on indiehackers.com
5. DM 5 freelancers/day on Twitter

---

### Day 57: Excel Import Support, Bug Fixes & SEO Blog Posts (February 8, 2026)

**Evening Update: 6 SEO-Optimized Blog Posts** - Created comprehensive blog content targeting key SEO opportunities identified in content gap analysis.

**New Blog Posts:**
1. **Credit Card Cash Flow Forecasting** (`/blog/credit-card-cash-flow-forecasting`)
   - 7 min read, guides category
   - Covers utilization tracking, payment planning, forecasting strategies
   - Keywords: credit card utilization forecasting, credit card payment planning

2. **Debt Payoff: Snowball vs Avalanche** (`/blog/debt-payoff-snowball-vs-avalanche`)
   - 8 min read, guides category
   - Compares methods with examples for irregular income
   - Keywords: debt payoff calculator freelancer, snowball vs avalanche

3. **Import Bank Transactions from Excel** (`/blog/import-bank-transactions-excel`)
   - 5 min read, guides category
   - Step-by-step guide with HowTo schema
   - Keywords: Excel import budgeting tool, bank statement import

4. **Why We Offer a $99 Lifetime Deal** (`/blog/lifetime-deal-no-subscription`)
   - 4 min read, news category
   - Addresses subscription fatigue, YNAB comparison
   - Keywords: YNAB alternative lifetime deal, no subscription budget app

5. **Export Cash Flow Data for Tax Season** (`/blog/export-cash-flow-data-tax-season`)
   - 6 min read, guides category
   - 1099 contractor guide with HowTo schema
   - Keywords: cash flow reports for taxes, 1099 tax records

6. **How to Migrate from YNAB** (`/blog/migrate-from-ynab`)
   - 6 min read, guides category
   - Complete migration walkthrough with HowTo schema
   - Keywords: YNAB to cash flow forecaster, migrate from YNAB

**Each Blog Post Includes:**
- Full article with comprehensive content (300-500+ lines)
- OpenGraph image generation via next/og
- JSON-LD structured data (Article, HowTo, FAQ schemas)
- Internal cross-linking to related pages and features
- CTAs linking to signup, pricing, and relevant features

**New Files:**
- `app/blog/credit-card-cash-flow-forecasting/page.tsx` + `opengraph-image.tsx`
- `app/blog/debt-payoff-snowball-vs-avalanche/page.tsx` + `opengraph-image.tsx`
- `app/blog/import-bank-transactions-excel/page.tsx` + `opengraph-image.tsx`
- `app/blog/lifetime-deal-no-subscription/page.tsx` + `opengraph-image.tsx`
- `app/blog/export-cash-flow-data-tax-season/page.tsx` + `opengraph-image.tsx`
- `app/blog/migrate-from-ynab/page.tsx` + `opengraph-image.tsx`

**Modified Files:**
- `lib/blog/posts.ts` - Added 6 new blog post metadata entries
- `docs/content-update-roadmap.md` - Marked all blog posts as complete

**Commits:**
- `46da3db` feat: add 6 SEO-optimized blog posts

---

**Excel File Import Feature** - Users can now import transactions from Excel files (.xlsx, .xls) in addition to CSV.

**New Feature:**
- Added Excel file support to both generic import and YNAB import pages
- Uses existing `xlsx` package (already installed for exports)
- Parses first sheet of Excel workbooks
- Handles Excel date serial numbers (converted to YYYY-MM-DD format)
- Handles formatted numbers and currency values
- Detailed error messages for password-protected, corrupted, or unsupported files

**Import Feature Bug Fixes (4 fixes):**
1. **Browser compatibility** - Added `generateId()` utility function with `crypto.randomUUID()` fallback for older browsers
2. **Excel error handling** - Added try-catch with specific error messages for common Excel parsing issues
3. **Operator precedence** - Fixed `hasDupes` logic in column-mapper.tsx (confusing `&&`/`||` precedence)
4. **Stale error clearing** - Transaction selector now clears error messages when filters change

**Additional Bug Fixes (2 fixes):**
5. **Compact currency formatting** - Fixed ternary bug showing "$1K" instead of "$1.2K" for non-round thousands
6. **Transfer amount validation** - Added validation to prevent zero/negative amounts in create/update transfer actions

**New Files:**
- `lib/import/parse-xlsx.ts` - Excel parsing utility with `parseExcel()`, `isExcelFile()`, `isSupportedSpreadsheet()`

**Modified Files:**
- `lib/utils.ts` - Added `generateId()` with crypto.randomUUID fallback
- `lib/utils/format.ts` - Fixed compact currency formatting ternary bug
- `lib/actions/transfers.ts` - Added amount > 0 validation
- `components/import/csv-upload.tsx` - Accept .xlsx/.xls files
- `components/import/ynab-csv-upload.tsx` - Accept .xlsx/.xls files
- `components/import/column-mapper.tsx` - Fixed hasDupes operator precedence
- `components/import/transaction-selector.tsx` - Clear errors on filter change
- `components/import/import-page-client.tsx` - Use generateId(), handle Excel files
- `components/import/ynab-import-page-client.tsx` - Use generateId(), handle Excel files
- `lib/import/parse-ynab-csv.ts` - Added `parseYnabData()` for pre-parsed data

**Commits:**
- `87a38e4` feat: add Excel file import support (.xlsx, .xls)
- `058bf84` fix: import feature bug fixes
- `06b7967` fix: compact currency formatting and transfer validation

---

### Day 56: Bug Fixes & Type Safety Improvements (February 4-5, 2026)

**Evening Update: Credit Card & Transfer Bug Fixes** - Fixed 4 additional bugs in credit cards and transfers features.

**Credit Card & Transfer Bug Fixes:**

1. **Missing `minimum_payment_percent` field** - Database had the field but UI forms were missing it. Added to both new and edit account forms with 2% default. Used by payment simulator and debt payoff calculator.

2. **Orphaned transfers on account deletion** - Deleting a bank account left associated transfers orphaned (or caused FK constraint failures). Now deletes transfers that reference the account before deleting the account itself.

3. **Timezone-aware date handling** - Transfer form and export modal used `toISOString()` which converts to UTC, showing yesterday's date for users in western timezones. Changed to local date formatting.

4. **Negative balance (credit) handling** - Credit cards with negative balances (overpayments) were treated as $0 owed. Now properly shows as green "credit" with 0% utilization.

**Files Modified (Evening):**
- `app/dashboard/accounts/new/page.tsx` - Added minimum_payment_percent field
- `app/dashboard/accounts/[id]/edit/page.tsx` - Added minimum_payment_percent field
- `components/accounts/delete-account-button.tsx` - Delete associated transfers
- `app/dashboard/transfers/new/page.tsx` - Local timezone date handling
- `components/reports/export-builder-modal.tsx` - Local timezone date handling
- `components/dashboard/credit-cards-section.tsx` - Negative balance handling

**Commit:** `f19e4ff` fix: credit card and transfer bug fixes

---

**Morning Session: Comprehensive Bug Fix Session** - Fixed 8 bugs across calendar, accounts, transfers, and onboarding.

**Critical Bug Fixes:**

1. **CC payment not showing in calendar modal** - CC payments had `frequency: 'once'` but calendar filters expected `'one-time'`. Fixed mismatch in `calculate-cc-payments.ts`.

2. **is_active null handling** - Bills and transfers with `is_active=null` were incorrectly treated as inactive due to truthy check. Changed to explicit `=== false` check to match `generate.ts` behavior.

3. **Onboarding bill due date clamp** - Was clamping days to 1-28, breaking bills due on 29th-31st. Now properly handles month-end edge cases.

**Medium Priority Fixes:**

4. **Dynamic currency symbols** - Account new/edit forms were showing hardcoded `$`. Now use `getCurrencySymbol(currency)` for proper symbol based on selected currency.

5. **Broken CC link in dashboard** - Credit cards section linked to `/dashboard/accounts/[id]` (404). Fixed to `/dashboard/accounts/[id]/edit`.

6. **Unknown transfer frequency warning** - Added `console.warn()` for unknown frequencies in `calculateTransferOccurrences` to help debug issues.

**Code Quality Improvements:**

7. **Array index as React key** - Fixed in 5 locations:
   - `day-detail-modal.tsx`: income, bills, transfers → use `transaction.id`/`transfer.id`
   - `pricing-section.tsx`: features → use feature text
   - `faq-section.tsx`: faqs → use `faq.question`

8. **Type safety improvements** - Removed `as any` casts across codebase:
   - `calendar/page.tsx`: Proper typing for Supabase data and transfers
   - `account-card.tsx`: Use `account.credit_limit` directly (already in type)
   - `calendar-container.tsx`: Added `SerializedDate` type for date normalization
   - `invoices.ts`: Replace non-null assertion with optional chaining
   - `exports/route.ts`: Added `ForecastExportData` type, use separate variable

**Files Modified:**
- `lib/calendar/calculate-cc-payments.ts` - Frequency fix
- `lib/calendar/calculate-bills.ts` - is_active null handling
- `lib/calendar/calculate-transfers.ts` - is_active null handling + unknown frequency warning
- `components/dashboard/credit-cards-section.tsx` - Fixed link
- `app/dashboard/accounts/new/page.tsx` - Dynamic currency symbol
- `app/dashboard/accounts/[id]/edit/page.tsx` - Dynamic currency symbol
- `components/onboarding/step-bills.tsx` - Day clamp fix
- `components/calendar/day-detail-modal.tsx` - React keys
- `components/landing/pricing-section.tsx` - React keys
- `components/landing/faq-section.tsx` - React keys
- `app/dashboard/calendar/page.tsx` - Type safety
- `components/accounts/account-card.tsx` - Type safety
- `components/calendar/calendar-container.tsx` - Type safety
- `lib/actions/invoices.ts` - Type safety
- `app/api/exports/generate/route.ts` - Type safety

**Commits:**
- `619704d` fix: improve type safety across codebase
- `fb2f0de` fix: onboarding bill due date now supports days 29-31
- `1270d9f` fix: minor code quality improvements
- `fbb0009` fix: is_active null handling in bills and transfers calculation
- `c7b2cea` fix: CC payment not showing in calendar day modal
- `6a32740` fix: dynamic currency symbols in account forms and CC dashboard link

---

### Day 55: Import Recurring Entries + Income Frequency Expansion + Import Page UX Polish (February 3, 2026)

**Evening Update: Import Page UX Polish** - World-class UX improvements to the import workflow.

**Import Page UX Improvements (10 fixes):**
1. **Auto-detect date range** - Date filter now auto-detects earliest date from CSV data (no more 0 of 100 results)
2. **Transaction count in button** - Changed "Select rows to import" → "Import 5 transactions" with live count
3. **Removed premature banner** - Removed "Invoice matching coming soon" banner (cluttered UI)
4. **Column prioritization** - Preview table now shows Date, Description, Amount columns first
5. **Sensitive data masking** - Account numbers masked in preview (shows last 4 digits only)
6. **Select buttons repositioned** - Moved Select all/Deselect all buttons near transaction table (was above filters)
7. **Unambiguous date format** - Changed YYYY-MM-DD → "Nov 29, 2025" format in review table
8. **YNAB banner hidden after upload** - YNAB import banner hides once CSV is loaded
9. **Font color visibility** - Upgraded zinc-500 → zinc-400/zinc-300 throughout for better readability
10. **Improved color contrast** - All descriptive text and labels now meet accessibility standards

**Files Modified (Import UX):**
- `components/import/transaction-selector.tsx` - Date auto-detect, button text, removed banner, select buttons, date format, colors
- `components/import/import-page-client.tsx` - YNAB banner hide, column prioritization, account masking, colors
- `components/import/csv-upload.tsx` - Font color improvements
- `components/import/column-mapper.tsx` - Font color improvements

---

**User Feedback Session** - Jeremy (CPA CA CMA MBA, 20+ years CFO experience) provided strategic feedback on product direction and feature requests.

**Strategic Direction Decided:**
- **Cash Flow First, Light Invoicing** - Core value prop is cash flow forecasting, not invoicing
- Invoicing features serve AR tracking for cash flow, not as standalone invoicing solution
- Future cleanup: Consider renaming "Invoices" → "Expected Income" or "Receivables"

**New Feature: Import → Recurring Entries**
- Import wizard now offers 5 options: Ignore, One-time income, Recurring income, One-time bill, Recurring bill
- When recurring is selected, frequency dropdown appears (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
- Works in both generic CSV import and YNAB import
- Default frequency is monthly if not specified

**Income Frequency Expansion:**
- Added quarterly and annually frequency options to income (previously bills-only)
- Use cases: quarterly dividends, annual bonuses, tax refunds, seasonal income
- Updated income new/edit forms with new frequency options
- Updated zod schemas to validate new frequencies
- Updated income-card.tsx with next date calculations and frequency badges (orange for quarterly, rose for annually)
- Updated income-filters.tsx with new frequency filter options
- Updated income-content.tsx with next date calculations
- Updated income page with monthly income calculations (quarterly = amount/3, annually = amount/12)

**Files Modified (Import Feature):**
- `components/import/transaction-selector.tsx` - New action types, FrequencySelect component
- `components/import/import-page-client.tsx` - Handle recurring entries in import
- `components/import/ynab-import-page-client.tsx` - Handle recurring entries in YNAB import

**Files Modified (Income Frequencies):**
- `app/dashboard/income/new/page.tsx` - Added quarterly/annually options + zod schema
- `app/dashboard/income/[id]/edit/page.tsx` - Added quarterly/annually options + zod schema
- `components/income/income-card.tsx` - Next date calc, icon, badge for quarterly/annually
- `components/income/income-filters.tsx` - Added quarterly/annually to FrequencyType and filter options
- `components/income/income-content.tsx` - Next date calculations for quarterly/annually
- `app/dashboard/income/page.tsx` - Monthly income calculations + next date calculations
- `lib/calendar/calculate-income.ts` - Added quarterly/annually cases to calendar generation (bug fix)

**Documentation Updated:**
- `docs/user-feedback-jeremy.md` - Added Feb 2026 feedback, strategic direction, implementation status

---

### Day 54: Pricing Updates & Comparison Pages (February 2, 2026)

**Lifetime Pricing Adjustment:**
- Reduced lifetime deal from $149 to $99 (closer to Cash Flow Calendar's $72)
- Updated savings text to "37% vs 2 years of Pro (yearly)" — honest comparison vs yearly pricing
- Updated all UI components, docs, and comparison pages

**Pro→Lifetime Refund Fix:**
- Fixed prorated refund logic for Pro users upgrading to lifetime
- Previously: Stripe credit balance was created but NOT refunded to payment method
- Now: Automatically refunds prorated amount to customer's original charge
- Excludes lifetime purchase charge from refund search
- Handles yearly Pro members with larger prorated amounts
- Fallback for partial refunds if needed

**Checkout Success Messages:**
- Added success banners on dashboard after checkout completion
- Pro: "🎉 Welcome to Pro! Your subscription is now active." (teal styling)
- Lifetime: "✨ Welcome to Lifetime! You now have permanent Pro access with no recurring fees." (amber styling)

**Competitor Migration Pages:**
- Created `/compare/ynab` — Target frustrated YNAB users ($14.99/mo → $7.99/mo, 47% savings)
- Created `/compare/mint` — Capture Mint refugees with migration guide
- SEO-optimized with structured data, FAQs, and comparison tables

**Modified Files:**
- `lib/stripe/config.ts` — Updated lifetime amount to 9900 cents
- `components/subscription/lifetime-deal-banner.tsx` — $149 → $99
- `components/pricing/pricing-section.tsx` — $149 → $99, savings 48% → 37%
- `app/api/webhooks/stripe/route.ts` — Fixed prorated refund logic
- `app/dashboard/page.tsx` — Pass checkout params to content
- `components/dashboard/dashboard-content.tsx` — Show checkout success messages

**New Files:**
- `app/compare/ynab/page.tsx` — YNAB comparison page
- `app/compare/mint/page.tsx` — Mint migration page

**Bug Fixes (11 total):**

*YNAB Import & Date Display (5 bugs):*
- Fixed one-time bills/income not showing dates (only showed if future)
- Fixed missing null check in income-card for `income.next_date`
- Fixed UUID regeneration when existingTransactions loads (both import pages)
- Fixed React setState inside setState callback in transaction-selector
- Fixed file input not resetting (can't re-upload same file)

*Calendar & Date Handling (3 bugs):*
- Fixed Date serialization bug in CalendarHybridView (desktop calendar crash)
- Added `toDate()`, `normalizeDay()` functions to normalize server-serialized dates
- Prevents `.getTime()` crash on string dates from server components

*Server Actions & Async (3 bugs):*
- Fixed UTC date parsing bugs in invoices.ts, send-reminder.ts, quotes.ts
- Fixed unhandled promise and unmount issues in scenario-modal.tsx
- Fixed missing useEffect dependency in filter-panel.tsx
- Fixed redundant timeout logic in weekly-digest route.ts

**Modified Files (Bug Fixes):**
- `components/bills/bill-card.tsx` — Date display for one-time bills
- `components/income/income-card.tsx` — Date display + null check
- `components/import/ynab-import-page-client.tsx` — UUID stability
- `components/import/import-page-client.tsx` — UUID stability
- `components/import/transaction-selector.tsx` — React state fix
- `components/import/ynab-csv-upload.tsx` — File input reset
- `components/import/csv-upload.tsx` — File input reset
- `components/calendar/calendar-hybrid-view.tsx` — Date normalization
- `components/filters/filter-panel.tsx` — useEffect dependency
- `components/scenarios/scenario-modal.tsx` — Async/unmount handling
- `lib/actions/invoices.ts` — Local date parsing
- `lib/actions/send-reminder.ts` — Local date parsing
- `lib/actions/quotes.ts` — Local date parsing
- `app/api/cron/weekly-digest/route.ts` — Timeout simplification

**Additional Bug Fixes (7 more):**

*UTC Date Parsing (5 bugs):*
- Fixed `filter-date-range.tsx` — Parse date parts manually, use local noon instead of UTC midnight
- Fixed `dashboard-content.tsx` — Invoice due date parsing for overdue status
- Fixed `calculate-payment-date.ts` — `dateOnlyToLocalDate()` now uses local noon
- Fixed `calculate-affordability.ts` — `dateOnlyToLocalDate()` now uses local noon
- Fixed `invoices/[id]/page.tsx` — `isOverdue()` function uses local noon for due date

*Error Handling & Logic (2 bugs):*
- Fixed `invoices/[id]/send/route.ts` — Returns warning if DB update fails after email sent
- Fixed `dashboard/page.tsx` — `is_active` check consistency (changed `b.is_active` to `b.is_active !== false`)

**SEO Updates (YNAB Import):**
- Updated YNAB comparison page FAQ (was "coming soon", now describes actual importer)
- Added YNAB data migration row to comparison table
- Added YNAB/Mint migration keywords to landing page meta
- Added FAQ about importing from YNAB/Mint to landing page
- Updated CSV Import feature card to highlight YNAB support

---

### Day 53: Lifetime Deal Feature (January 29, 2026)

**New Feature: Lifetime Deal** - One-time $99 payment for permanent Pro access. Appeals to budget-conscious freelancers who prefer upfront payment over subscriptions.

**Stripe Integration:**
- New `createLifetimeCheckoutSession()` server action for one-time payment checkout
- Webhook handler for `checkout.session.completed` with `type: 'lifetime_purchase'` metadata
- Automatic cancellation of existing Pro subscription with prorated refund
- Database update with `tier: 'lifetime'` and 100-year expiration date

**Promotional Banner:**
- New `LifetimeDealBanner` component with amber/gold styling
- Dismissible with 7-day localStorage cooldown
- Direct checkout button ("Get Lifetime — $99")
- Shows for free/pro users only (hidden for lifetime/premium)
- Added to Dashboard, Invoices, Quotes, and Settings pages

**UI Updates:**
- `SubscriptionStatus` component updated with Sparkles icon for lifetime tier
- Shows "Lifetime access — no renewal needed" instead of renewal date
- "Manage" button hidden for lifetime users (no subscription to manage)
- Pricing page comparison table updated with lifetime option

**Webhook Safety:**
- Operation order: Update database FIRST, then cancel Stripe subscription
- Race condition protection: `handleSubscriptionCanceled` skips downgrade if tier is 'lifetime'
- Error handling for subscription cancellation failures (logs warning, doesn't fail)

**Feature Gating:**
- Lifetime tier has same limits as Pro (all features unlocked)
- `TIER_RANK['lifetime'] = 2` (same as premium) for access checks
- Export features properly include lifetime in `isPro` checks
- `canUseInvoicing()` correctly grants access to lifetime users

**Bug Fixes:**
- Fixed Safari private mode localStorage error with try-catch
- Fixed invalid date parsing from corrupted localStorage
- Fixed potential double-billing for Pro users upgrading to lifetime

**New Files:**
- `components/subscription/lifetime-deal-banner.tsx` - Promotional banner component

**Modified Files:**
- `lib/actions/stripe.ts` - Added `createLifetimeCheckoutSession()` action
- `app/api/webhooks/stripe/route.ts` - Added lifetime purchase handler with safety fixes
- `components/subscription/subscription-status.tsx` - Lifetime tier UI updates
- `components/reports/export-builder-modal.tsx` - Added lifetime to isPro check
- `components/reports/reports-page-content.tsx` - Added lifetime to isPro check
- `app/dashboard/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/invoices/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/quotes/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/settings/page.tsx` - Added LifetimeDealBanner
- `app/compare/cash-flow-calendar-apps/page.tsx` - Updated pricing comparison

---

### Day 52: Quotes Feature (January 29, 2026)

**New Feature: Quotes** - Freelancers can now create professional quotes, send them to clients, and convert accepted quotes to invoices. Part of the Pro-tier Runway Collect feature.

**Database:**
- New `quotes` table with fields: id, user_id, quote_number, client_name, client_email, amount, currency, valid_until, description, status, sent_at, viewed_at, accepted_at, rejected_at, converted_invoice_id, created_at, updated_at
- Quote numbering format: QTE-0001 (auto-incremented per user)
- Statuses: draft, sent, viewed, accepted, rejected, expired

**New Pages:**
- `/dashboard/quotes` - Quote list with summary stats (Total Pending by currency, Awaiting Response, Accepted, Expiring Soon)
- `/dashboard/quotes/new` - Create quote form with currency selector and valid_until presets (14/30/60 days)
- `/dashboard/quotes/[id]` - Quote detail page with timeline, status actions, and convert-to-invoice button
- `/dashboard/quotes/[id]/edit` - Edit form (draft/sent quotes only)

**New Components:**
- `components/quotes/new-quote-form.tsx` - Quote creation with currency selector
- `components/quotes/edit-quote-form.tsx` - Quote editing
- `components/quotes/quotes-content.tsx` - Filterable quote list
- `components/quotes/quotes-filters.tsx` - Status, amount, and search filters
- `components/quotes/send-quote-button.tsx` - Send/resend quote via email
- `components/quotes/download-quote-pdf-button.tsx` - Download quote PDF
- `components/quotes/convert-to-invoice-button.tsx` - Convert accepted quote to invoice
- `components/quotes/delete-quote-button.tsx` - Delete draft quotes
- `components/quotes/delete-quote-icon-button.tsx` - Icon version for list view
- `components/quotes/mark-quote-status-button.tsx` - Accept/Reject buttons

**Server Actions (`lib/actions/quotes.ts`):**
- `getQuotes()` - List user's quotes
- `getQuote(id)` - Get single quote with user_id verification
- `createQuote(input)` - Create quote with auto-generated number
- `updateQuote(id, input)` - Update quote (draft/sent only)
- `deleteQuote(id)` - Delete quote (draft only)
- `updateQuoteStatus(id, status)` - Change status with timestamp
- `convertQuoteToInvoice(quoteId)` - Create invoice from accepted quote
- `getQuoteSummary()` - Stats with per-currency totals

**Email & PDF:**
- `lib/email/templates/quote-email.tsx` - Quote email template
- `lib/pdf/quote-template.tsx` - Quote PDF template (QUOTE header, Valid Until instead of Due Date)
- `app/api/quotes/[id]/pdf/route.ts` - PDF streaming endpoint
- `lib/actions/send-quote.ts` - Send quote via Resend with PDF attachment

**Key Features:**
- Per-document currency (quotes have their own currency, separate from user default)
- Multi-currency support in summary stats (displays totals per currency)
- Quote-to-invoice conversion preserves client, amount, currency, and description
- Timeline tracking: Created → Sent → Viewed → Accepted/Rejected
- Expiration tracking with "Expiring Soon" indicator (within 7 days)
- Pro tier gating via `canUseInvoicing()`

**Bug Fixes:**
- Fixed dark theme styling in quote components (was using light theme colors)
- Fixed security: quote detail page now uses `getQuote(id)` action for defense in depth
- Updated upgrade prompt to mention both quotes and invoices

**Navigation:**
- Added "Quotes" link to sidebar navigation (after Invoices)

---

### Day 51: User Settings Currency Support (January 28, 2026)

**Centralized Currency Preference** - All currency displays now respect the user's currency setting from `user_settings.currency`.

**Centralized getCurrencySymbol Function:**
- Added `getCurrencySymbol(currency: string)` to `lib/utils/format.ts`
- Uses `Intl.NumberFormat` with `currencyDisplay: 'narrowSymbol'` for proper symbols
- Falls back to currency code if symbol extraction fails
- Removed 6 duplicate implementations from across the codebase

**Files Updated to Use User Currency:**
- Dashboard page (`app/dashboard/page.tsx`) - fetches and passes currency
- Calendar page (`app/dashboard/calendar/page.tsx`) - fetches and passes currency
- Debt Payoff page (`app/dashboard/debt-payoff/page.tsx`) - fetches and passes currency
- Bills new/edit pages - dynamic currency symbol in amount input
- Income new/edit pages - dynamic currency symbol in amount input
- Settings page - passes currency to LowBalanceAlertForm

**Chart Currency Fixes:**
- `PayoffTimelineChart` Y-axis now uses dynamic currency symbol (was hardcoded $)
- `ForecastBalanceChart` uses passed currency prop
- Both charts: Added `minWidth={0}` to ResponsiveContainer to fix SSR warning

**Safety Buffer Form Improvements:**
- Now uses `CurrencyInput` component with comma formatting
- Fetches currency from `user_settings` for dynamic symbol
- Updated validation message from "at least $50" to "at least 50" (no hardcoded currency)
- Threshold preview uses `formatCurrency(value, currency)` for proper formatting

**Low Balance Alert Form:**
- Added `currency` prop (defaults to 'USD')
- Uses `formatCurrency` helper instead of inline `Intl.NumberFormat`

**Duplicate Code Removed (6 files):**
- `components/charts/payoff-timeline-chart.tsx`
- `components/charts/forecast-balance-chart.tsx`
- `components/calendar/sticky-header.tsx`
- `components/income/income-filters.tsx`
- `app/dashboard/income/new/page.tsx`
- `app/dashboard/income/[id]/edit/page.tsx`

**Bug Fixes:**
- Fixed Recharts SSR warning "width(-1) and height(-1) of chart should be greater than 0"
- Fixed hardcoded $ in safety buffer validation message
- Fixed chart Y-axis showing $ regardless of user's currency setting

---

### Day 50: Credit Card Cash Flow Forecasting (January 27, 2026)

**Major Differentiating Feature** - Credit card accounts now integrate with cash flow forecasting, providing features competitors (Monarch, YNAB, Copilot) don't offer.

**Database Migration:**
- Added 5 new columns to `accounts` table: `credit_limit`, `apr`, `minimum_payment_percent`, `statement_close_day`, `payment_due_day`
- Indexed credit card accounts for efficient queries

**Account Form Updates:**
- Added "Credit Card" option to account type dropdown (new + edit pages)
- Conditional credit card fields shown when CC type selected:
  - Credit limit (for utilization tracking)
  - APR (for interest calculations)
  - Statement close day (1-31)
  - Payment due day (1-31)
- Context-sensitive labels and help text for CC balance

**Credit Utilization Tracking:**
- Utilization badge on credit card account cards
- Color-coded warnings: green (<30%), amber (30-50%), orange (50-75%), rose (>75%)
- Shows "X% used of $Y limit" on account cards
- Tooltip with utilization message

**Calendar Integration:**
- Credit card payments now appear in cash flow calendar
- Auto-generates monthly payment events on payment due day
- Shows with 💳 emoji prefix for visibility
- Payment amount equals current balance (simplified model)

**Payment Scenario Simulator:**
- New modal accessible via calculator button on CC account cards
- Three payment options:
  - Minimum payment (shows months to payoff + total interest)
  - Statement balance (no interest)
  - Custom amount (shows payoff timeline + interest)
- Cash flow impact summary (outflow, remaining balance)
- Interest savings comparison vs minimum payment
- Monthly interest projection if carrying balance

**New Files:**
- `supabase/migrations/20260127000001_add_credit_card_fields.sql` - Database migration
- `lib/types/credit-card.ts` - TypeScript types and utility functions
- `lib/calendar/calculate-cc-payments.ts` - CC payment occurrence generator
- `components/accounts/payment-simulator.tsx` - Payment scenario modal

**Modified Files:**
- `app/dashboard/accounts/new/page.tsx` - CC fields in create form
- `app/dashboard/accounts/[id]/edit/page.tsx` - CC fields in edit form
- `components/accounts/account-card.tsx` - Utilization badge + simulator button
- `lib/calendar/generate.ts` - Include CC payments in forecast
- `lib/calendar/utils.ts` - Added `addMonths` utility
- `lib/posthog/events.ts` - Added `credit_card` to tracking type

**Debt Payoff Planner:**
- New page at `/dashboard/debt-payoff` for users with 2+ credit cards with balance
- Compares Snowball (smallest balance first) vs Avalanche (highest APR first) strategies
- Extra monthly payment input to see accelerated payoff
- Side-by-side comparison showing debt-free date, total interest, and total paid
- Payoff order visualization showing each card's payoff date and interest
- Shows interest savings when Avalanche beats Snowball
- Empty state for users with no CC debt (celebration message)
- Single card state for users with only one CC (simplified view)
- Navigation button on Accounts page when 2+ CC have balance

**New Files (Debt Payoff Planner):**
- `lib/debt-payoff/calculate-payoff.ts` - Snowball/Avalanche calculation algorithms
- `app/dashboard/debt-payoff/page.tsx` - Server component fetching CC accounts
- `components/debt-payoff/debt-payoff-planner.tsx` - Client component with strategy comparison

**New Files (Charts):**
- `components/charts/payoff-timeline-chart.tsx` - Debt payoff timeline area chart
- `components/charts/forecast-balance-chart.tsx` - Dashboard forecast balance chart
- `docs/charts-roadmap.md` - Charts implementation roadmap and patterns

**Dependencies Added:**
- `recharts` - React charting library for data visualization

**Modified Files (Debt Payoff Planner):**
- `app/dashboard/accounts/page.tsx` - Added "Plan Your Debt Payoff" navigation card

**New Charts:**
- `components/charts/payoff-timeline-chart.tsx` - Debt payoff timeline visualization with Recharts
  - Area chart showing total balance decreasing over time
  - Reference lines for card payoff milestones
  - Custom tooltip with month/balance/cards paid off
  - Legend showing when each card is paid off
- `components/charts/forecast-balance-chart.tsx` - Dashboard balance trend visualization
  - Area chart showing projected balance over forecast period
  - Lowest balance point marker with reference dot
  - Safety buffer reference line
  - Custom tooltip with date/balance formatting
  - Color-coded for positive (teal) vs negative (rose) balances

**Chart Bug Fixes (11 total):**

*Forecast Balance Chart (6 bugs):*
- Fixed sampling that could skip actual lowest balance day
- Fixed duplicate last day when lowest day = last day
- Fixed negative currency formatting (`$-500` → `-$500`)
- Fixed gradient ID collision when multiple charts render (used `useId()`)
- Fixed safety buffer line rendering outside visible Y-axis range
- Fixed potential undefined array access with explicit checks

*Payoff Timeline Chart (5 bugs):*
- Fixed hardcoded 'USD' currency (now uses currency prop)
- Fixed gradient ID collision (used `useId()`)
- Fixed key collision using cardName (changed to cardId)
- Fixed overlapping X-axis tick labels at end of chart
- Fixed negative currency formatting in Y-axis

**Debt Payoff Planner Bug Fixes:**
- Fixed 11 instances of hardcoded 'USD' currency (now uses currency prop)
- Improved empty states: differentiate "no cards added" vs "all cards paid off"
  - No cards: Feature preview with CTA to add credit card
  - All paid: Celebration message with link to accounts

**Other Bug Fixes:**
- Statement/Payment day dropdowns now allow 1-31 (was 1-28)
- Calendar CC payment validation updated for days 29-31
- Fixed date rollover for months with fewer days (e.g., day 31 in Feb → 28/29)
- Added "Credit Card" to account type filter dropdown on Accounts page
- Fixed filter logic to properly match `credit_card` account type

**Competitive Advantage:**
| Feature | Monarch | YNAB | Copilot | Us |
|---------|---------|------|---------|-----|
| Track CC balance | ✅ | ✅ | ✅ | ✅ |
| Due date reminders | ✅ | ❌ | ❌ | ✅ |
| Spending → future cash impact | ❌ | ❌ | ❌ | ✅ |
| Payment scenario simulator | ❌ | ❌ | ❌ | ✅ |
| Interest cost calculator | ❌ | ❌ | ❌ | ✅ |
| Utilization warnings | ❌ | ❌ | ❌ | ✅ |
| Debt payoff planner | ❌ | ❌ | ❌ | ✅ |

---

### Day 49: Custom Bill Categories (January 26, 2026)

**Custom Categories Feature** - Users can now create, edit, and delete custom bill categories instead of being limited to 5 hardcoded options.

**New Database Table:**
- `user_categories` with RLS policies for secure access
- Fields: id, user_id, name, color, icon, sort_order, created_at
- Default categories seeded on first use (Rent/Mortgage, Utilities, Subscriptions, Insurance, Other)

**Category Management UI:**
- New section in Settings page for managing categories
- Add, edit, delete categories with custom colors and icons
- 13 color options (rose, amber, emerald, teal, cyan, blue, violet, etc.)
- 24 icon options (home, zap, repeat, shield, tag, car, heart, etc.)

**Dynamic Category Dropdowns:**
- Bill forms now use user's custom categories
- Inline category creation in bill forms (no need to go to Settings)
- Pending category pattern (defer DB creation until form submission)
- Orphaned category support (bills with deleted categories still display)

**Filter Updates:**
- Category filters on bills page use user's custom categories
- URL slug conversion for clean filter URLs (`?ex=rentmortgage`)
- Case-insensitive category matching throughout

**Bug Fixes (24 total):**
- Case-insensitive category matching in filter logic
- Case-insensitive category matching when renaming/deleting categories
- Orphaned category display in dropdowns (bills with deleted categories)
- Race condition prevention in category creation with upsert
- Double seeding prevention with `onConflict` handling
- ARIA accessibility labels for category dropdown (aria-haspopup, aria-expanded, role)
- TypeScript type safety improvements (Tables<'bills'> instead of any)
- Proper disabled states during form submission
- Retry logic for category seeding in onboarding
- Case-insensitive suggestion matching in onboarding

**New Files:**
- `lib/categories/constants.ts` - Default categories and color/icon definitions
- `lib/actions/manage-categories.ts` - Server actions for category CRUD
- `components/settings/category-management-form.tsx` - Settings UI
- `components/bills/category-select.tsx` - Dynamic category dropdown component
- `supabase/migrations/[timestamp]_add_custom_categories.sql` - Database migration

**Modified Files:**
- `app/dashboard/settings/page.tsx` - Added categories section
- `app/dashboard/bills/new/page.tsx` - Dynamic categories
- `app/dashboard/bills/[id]/edit/page.tsx` - Dynamic categories
- `app/dashboard/bills/page.tsx` - TypeScript type fixes
- `components/bills/bills-content.tsx` - Category filtering with constants
- `components/bills/bills-filters.tsx` - Dynamic category options
- `components/bills/bill-card.tsx` - Custom color/icon rendering
- `components/onboarding/step-bills.tsx` - Category seeding and selection

---

### Day 48: Reports & Export Feature + Free Tier Extended to 90 Days (January 26, 2026)

**Reports & Export Feature** - Major feature implementation allowing users to export their financial data.

**New Reports Page (`/dashboard/reports`):**
- Quick Reports: 4 one-click report cards (Monthly Summary, Category Spending, Cash Forecast, All Data)
- Custom Export Builder: Modal with data selection, date range presets, format choice, and export summary
- Export History: Recent exports with status, format badges, re-download capability
- Tier-gated features (Free: CSV + limited reports, Pro: Excel/JSON + all reports)

**Export Formats:**
- CSV: Free tier, opens in Excel/Sheets/Numbers
- Excel: Pro tier, multi-sheet workbooks with auto-sized columns
- JSON: Pro tier, structured data for developers
- PDF: Coming soon (shows friendly message)

**Technical Implementation:**
- Database: `exports` table with RLS, 30-day retention, status tracking
- Types: `lib/export/types.ts` with ExportFormat, ReportType, DataInclude, etc.
- Generators: `lib/export/generators/csv-generator.ts`, `excel-generator.ts`
- API: `/api/exports/generate` route handling all export generation
- Feature gates: `lib/stripe/feature-gate.ts` extended with export permissions
- Navigation: Added "Reports" link with FileBarChart icon

**New Files:**
- `app/dashboard/reports/page.tsx` - Server component
- `app/dashboard/reports/loading.tsx` - Loading skeleton
- `components/reports/reports-page-content.tsx` - Client component
- `components/reports/quick-reports-section.tsx` - Report cards
- `components/reports/export-builder-modal.tsx` - Custom export builder
- `components/reports/export-history-section.tsx` - History table
- `lib/export/types.ts` - TypeScript types and constants
- `lib/export/generators/csv-generator.ts` - CSV generation
- `lib/export/generators/excel-generator.ts` - Excel generation (xlsx)
- `supabase/migrations/20260126000001_add_exports_table.sql` - Database migration
- `app/api/exports/generate/route.ts` - Export API endpoint

**Free Tier Extended to 90 Days** - Based on beta tester feedback (Jeremy):
- Updated `lib/stripe/config.ts` - Free tier `forecastDays: 60` → `90`
- Updated all user-facing copy across 26 files (landing page, FAQs, pricing, tools, OG images, etc.)
- Dashboard default filter now 90 days for free users (was 60)
- Calendar summary/warnings now use dynamic "forecast period" instead of hardcoded "60 days"
- Added collapsible help section to CSV Import explaining expected format

**Bug Fixes:**
- Fixed Stripe API version mismatch (updated to '2025-12-15.clover')
- Fixed TypeScript errors with Map iteration using Array.from()
- Fixed undefined array access with explicit checks
- PDF export shows "coming soon" message instead of silently falling to CSV
- Export history shows "Expired" for completed exports without file_url

**Dependencies:**
- Added `xlsx` package for Excel export generation

**Documentation:**
- Created `docs/user-feedback-jeremy.md` with Reports feature roadmap

---

### Day 47: Semi-Monthly Frequency Bug Fixes (January 25, 2026)

**Critical Bug Fix** - Semi-monthly income/bills were showing $0 in monthly calculations and not appearing in calendar day modals.

**Root Cause:** The `semi-monthly` frequency was missing from multiple calculation functions and filter type definitions throughout the codebase. Income/bills with semi-monthly frequency fell through to `default` cases returning $0.

**Monthly Calculation Fixes** - Added `case 'semi-monthly': return amount * 2` to all calculation functions:

- `app/dashboard/page.tsx` - `calculateMonthlyIncome`, `calculateMonthlyBills`, `calculateQuarterlyIncome`
- `app/dashboard/income/page.tsx` - `calculateMonthlyIncome`
- `app/dashboard/bills/page.tsx` - `calculateMonthlyTotal`
- `app/dashboard/settings/page.tsx` - already had semi-monthly support

**Next Date Calculation Fixes** - Added semi-monthly case to `getActualNextDate` functions:

- `app/dashboard/income/page.tsx` - inline `getActualNextDate`
- `app/dashboard/bills/page.tsx` - `getActualDueDate`
- `components/income/income-card.tsx` - `getActualNextDate`
- `components/income/income-content.tsx` - `getActualNextDate`
- `components/bills/bill-card.tsx` - `getActualNextDueDate`
- `components/bills/bills-content.tsx` - `getActualNextDueDate`

**Filter & Type Definition Fixes** - Added `'semi-monthly'` to `FrequencyType` and `allFrequencies`:

- `components/income/income-filters.tsx` - Income page frequency filter
- `components/bills/bills-filters.tsx` - Bills page frequency filter
- `components/calendar/calendar-filters.tsx` - Calendar frequency filter (this was causing transactions to not show in day modal)

**Display Fixes** - Added semi-monthly badges and icons:

- `components/income/income-card.tsx` - `getIncomeTypeIcon`, `getFrequencyBadge` (indigo color)
- `components/bills/bill-card.tsx` - `getFrequencyBadge` (indigo color)

**Impact:** Users with semi-monthly income (e.g., $1,551 twice/month) now correctly see $3,102/mo in calculations, and transactions appear in calendar day modals when clicked.

**Files:** `app/dashboard/page.tsx`, `app/dashboard/income/page.tsx`, `app/dashboard/bills/page.tsx`, `components/income/income-card.tsx`, `components/income/income-content.tsx`, `components/income/income-filters.tsx`, `components/bills/bill-card.tsx`, `components/bills/bills-content.tsx`, `components/bills/bills-filters.tsx`, `components/calendar/calendar-filters.tsx`

---

### Day 46: Dashboard & Calendar Mobile UX Polish (January 24, 2026)

**Dashboard Forecast Fixes** - Dynamic forecast period labels and extended filter options.

- Fixed hardcoded "60 days" label - now dynamically shows period based on user's filter selection
- Added 90-day and 365-day ("12 Months") forecast filter options for Pro users
- Pro users now default to 90-day forecast view (was 60 days)
- Added "/mo" suffix to Income/Bills metric cards for clarity
- Added formatting helpers: `formatHorizonPeriod()` and `formatHorizonTitle()`

**Dashboard Layout Improvements** - Better information hierarchy and mobile optimization.

- Removed redundant "View Calendar" CTA under Daily Budget, replaced with "Adjust Buffer" → Settings
- Removed generic "Welcome to Cashcast!" heading
- Reorganized sections: Metric cards → Forecast → Invoices → Tax → Emergency Fund → Scenario Tester → Import
- Mobile responsive text sizing (text-xl sm:text-2xl md:text-3xl)
- Added min-w-0 and truncate for overflow prevention

**Mobile Navigation Improvements** - Better user experience on mobile devices.

- Added user avatar dropdown to mobile header (profile, billing, logout access)
- Changed mobile "Home" tab to link to Dashboard instead of Calendar
- Replaced "Import" with "Calendar" in mobile bottom nav for better discoverability

**Calendar Mobile UX Improvements** - Touch-friendly design following Apple HIG.

- Removed "Tap for more" expandable stats - now shows all 4 stats in 2x2 grid on mobile
- Increased close button touch target to 44px minimum (was ~28px)
- Added `whitespace-nowrap` to currency displays to prevent awkward line breaks
- Increased padding in mobile header cards (p-3 → p-4)
- Removed redundant "Specific Accounts" from Dashboard "Add filter" menu

**Files:** `components/calendar/sticky-header.tsx`, `components/calendar/day-detail.tsx`, `components/dashboard/dashboard-content.tsx`, `components/dashboard/dashboard-filters.tsx`, `components/dashboard/nav.tsx`, `app/dashboard/calendar/page.tsx`, `components/calendar/calendar-container.tsx`, `components/calendar/calendar-hybrid-view.tsx`, `components/calendar/calendar-view.tsx`

---

### Day 45: Form UX Polish + Currency Input + SEO/AEO Audit + Content Expansion (January 23, 2026)

**CurrencyInput Component** - Numbers now format with commas as you type for better readability.

- New reusable `CurrencyInput` component with live comma formatting (e.g., `12,430.97`)
- Uses `inputMode="decimal"` for optimal mobile numeric keyboard
- Supports negative values via `allowNegative` prop (for account balances)
- Returns raw numeric value to forms while displaying formatted text
- Applied to all amount fields: Bills, Income, Accounts, Invoices

**Form Consistency & Mobile UX** - All dashboard forms now have consistent styling.

- Select/dropdown fields: Added visible borders (`border border-zinc-700`), consistent background (`bg-zinc-800`)
- Chevron icons: Increased size (`w-5 h-5`) and visibility (`text-zinc-400`)
- Date inputs: Added `[color-scheme:dark]` for proper dark mode date picker
- Button labels: Standardized to action verbs ("Add Bill", "Add Income", "Create Account", "Create Invoice")
- Touch targets: All interactive elements have `min-h-[44px]` for mobile accessibility
- Cursor feedback: Added `cursor-pointer` to all clickable form elements

**SEO/AEO Improvements** - Comprehensive audit and updates for search optimization.

- Fixed canonical URL mismatch (sitemap.ts now uses non-www to match robots.ts)
- Updated meta descriptions from "60 days" to "365 days" across layout and page
- Added OG image (hero-dashboard.png) to homepage for social sharing
- Added HowTo JSON-LD schema for "How it Works" section (AEO optimization)
- Added 5 new keywords: invoice payment links, stripe invoicing, branding, emergency fund
- Added new FAQ: "How do clients pay my invoices?" covering Stripe payment links
- Updated existing FAQ answers to clarify Pro 365-day forecast

**Landing Page Updates** - New features and social proof.

- Added "Custom branding with your logo and business name" to Get Paid Faster section
- Added Emergency Fund Tracker card to "More ways we help" section (3-column grid)
- Added social proof avatar stack below hero CTA: "Trusted by designers, writers & developers"
- Updated pricing cards: Added "Low Balance Alerts" (Free), "Custom invoice branding" (Pro)

**Compare Page Updates** - New feature rows and keywords.

- Added 3 comparison rows: Invoice branding, Emergency fund tracker, Tax savings tracker
- Updated CTA to mention "60 days free, or 365-day with Pro"
- Added 4 new keywords for new features

**Core Web Vitals Fixes** - Performance optimizations for better page speed.

- Added `font-display: swap` for faster text rendering (prevents FOIT)
- Added `loading="lazy"` to all below-fold images on landing page
- Added `aspect-ratio` classes to prevent layout shift (CLS)
- Removed ~320KB of unused old hero images (`hero-dashboardOLD.png`, `hero-dashboardsecondOLD.png`)

**Content Expansion (SEO/AEO)** - 4 new blog posts + glossary page.

- **Blog: Best Cash Flow Apps for Freelancers 2026** - Comparison of 5 apps with pros/cons, pricing table
- **Blog: How to Track Freelance Income and Expenses** - Practical guide with HowTo schema
- **Blog: Quarterly Tax Savings for 1099 Contractors** - Tax guide with FAQ schema, due dates
- **Blog: When to Raise Your Freelance Rates** - Tips with email templates for rate increases
- **Glossary Page (`/glossary`)** - 30+ freelance finance terms with DefinedTermSet schema for AEO
- All new blog posts have dynamic OpenGraph images via `next/og`

**Blog Typography Improvements** - Better readability across all blog posts.

- Increased paragraph spacing from `mb-4` to `mb-6` for more breathing room
- Added custom prose typography styles in `globals.css`:
  - Paragraph line-height increased to 1.8
  - Heading spacing: h2 gets 2.5em top margin, h3 gets 2em
  - Improved list and blockquote spacing
  - Better strong/bold text visibility in dark mode

**Bug Fixes:**
- Fixed invoice amount field white background (was missing dark theme classes)
- Fixed unused `Calendar` import in quarterly tax blog post
- Fixed TypeScript errors in glossary page (term grouping)

**Files:** `app/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`, `app/globals.css`, `lib/blog/posts.ts`, `app/glossary/page.tsx` (created), `app/blog/best-cash-flow-apps-freelancers-2026/` (created), `app/blog/how-to-track-freelance-income-expenses/` (created), `app/blog/quarterly-tax-savings-1099-contractors/` (created), `app/blog/when-to-raise-freelance-rates/` (created)

---

### Day 44: User Profile Dropdown + Invoice Branding + UX Polish (January 22, 2026)

**Invoice Branding Feature** - Users can customize invoices with logo and business name.

- Logo upload to Supabase storage (JPG/PNG/WebP, max 512KB)
- Business name field displayed on invoices instead of email
- Live invoice preview in settings showing exactly how branding appears
- Drag-and-drop upload zone with visual feedback
- Character count for business name (0/100)
- Logo appears in PDF header next to "INVOICE" title
- Business name shows in "From" section above email
- Database migration for `business_name` and `logo_url` columns
- Storage bucket with RLS policies for user folder isolation

**User Profile Dropdown Redesign** - Enhanced navigation with avatar and improved UX.

- UserAvatar component showing initials from name or email
- User identity section with email and plan badge (Free/Pro)
- Menu items: Settings, Billing, Help & Support with icons
- Billing opens Stripe portal (Pro) or pricing page (Free)
- Separated Log out with subtle destructive hover styling
- Mobile-friendly with 44px touch targets

**Invoices Upgrade Prompt Redesign** - Better conversion-focused design:

- Benefit-focused headline: "Get Paid Faster with Runway Collect"
- 3 feature cards in responsive grid replacing bullet list
- Social proof line and trust elements with lock icon
- Gradient background with radial glow for visual depth
- More prominent billing toggle and CTA button with hover animation

**Bug Fixes:**
- Stripe customer ID dev/prod mismatch: Verify customer exists before using stored ID, create new if not found
- Landing page mobile layout: Calendar day cards now horizontally scrollable with snap, stacked day labels

**Files:** `components/dashboard/nav.tsx`, `components/invoices/invoicing-upgrade-prompt.tsx`, `components/landing/hero-dashboard.tsx`, `lib/actions/stripe.ts`, `components/settings/invoice-branding-form.tsx`, `lib/actions/update-invoice-branding.ts`, `lib/pdf/invoice-template.tsx`

---

### Day 43: Landing Page Hero Dashboard + Calendar Visual Polish

**Interactive Hero Dashboard Component** - Replaced static mockup image with an interactive React component demonstrating product features before signup.

- HeroDashboard component with Safe to Spend card, stats row, SVG line chart, 7-day calendar preview
- Staggered entrance animations (0ms → 600ms delays)
- Dark theme consistent with YNAB-inspired aesthetic

**Calendar Page Visual Polish** - Applied matching polish to `/dashboard/calendar`:

- Safe to Spend card redesign with gradient background and glow effect
- Stats row with color-coded amounts (amber for LOWEST, rose for BILLS)
- Balance trend chart refinements (380px height, compact $60K format)
- Quick summary cards with colored tints (emerald for income, orange for bills)
- Collapsible balance status legend and filter bar

**Files:** `components/landing/hero-dashboard.tsx` (created), multiple calendar components modified

---

### Day 42: Stripe Payment Links for Invoices

**Major Pro feature** - Pro users can receive invoice payments directly via Stripe Connect.

- Stripe Connect library (`lib/stripe/connect.ts`) with account management and checkout sessions
- Database migration adding `stripe_connect_accounts` table and invoice payment columns
- Settings UI for Connect account status and onboarding
- Invoice send integration auto-generates payment links
- Payment success page verifies and updates invoice status
- Webhook handler for `checkout.session.completed`

**Bug Fixes:**
- Invoice-linked income status sync (webhook now updates both invoice and income status)
- Removed paid invoice edit restriction

**Files:** `lib/stripe/connect.ts`, `app/pay/success/page.tsx`, `components/settings/stripe-connect-section.tsx`, multiple modified files

---

### Day 41: Simpler Onboarding + Emergency Fund Tracker

**Simpler Onboarding (2-Step Flow)** - Reduced from 4 steps to 2 steps (~60 seconds completion time).

- Step 1: Quick Setup (balance + optional income)
- Step 2: Bills
- Direct redirect to `/dashboard/calendar` on completion

**Emergency Fund Tracker** - Dashboard widget and settings form for tracking savings goals.

- Database columns: `emergency_fund_enabled`, `emergency_fund_goal_months`, `emergency_fund_account_id`
- Dashboard widget shows progress bar, months covered, amount to go
- Settings form with goal months selector (3/6/12) and account picker
- Color-coded progress: rose (<50%), amber (50-75%), teal (75%+)

**Files:** `components/onboarding/step-quick-setup.tsx`, `components/dashboard/emergency-fund-widget.tsx`, `components/settings/emergency-fund-form.tsx`

---

### Day 40: Low Balance Alerts + Safe to Spend Marketing

**Proactive Low Balance Alerts** - Users receive email alerts when balance projected to drop below safety buffer within 7 days.

- Database columns: `low_balance_alert_enabled`, `last_low_balance_alert_at`
- Alert email template with urgent amber/red design
- Cron route running daily at 10 AM UTC via Vercel Cron
- 3-day cooldown between alerts to prevent fatigue
- Settings UI toggle

**Safe to Spend Marketing** - Highlighted as core feature on landing page:

- Updated hero subtitle with "safe to spend" highlight
- Pillar 1 rebranded to "Safe to Spend" with "Core Feature" badge
- Comparison page updated with new feature rows

---

## Earlier Development Summary (Days 1-39)

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
