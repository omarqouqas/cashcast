# AI Features Roadmap

AI-powered enhancements for Cashcast.

---

## 1. Probabilistic Forecasting ✅ COMPLETED (April 4, 2026)

**User question:** "Will I run out of money?"

### Implementation: Monte Carlo Simulation

We chose **Option A: Monte Carlo Simulation** and implemented it with the following approach:

**Architecture:**
- 500 simulations per forecast (balancing accuracy vs. performance)
- Seeded PRNG (mulberry32) for reproducibility
- Box-Muller transform for normal distribution sampling
- Server-side execution during page load (~9ms compute time)

**Variance Configuration:**
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

**Files Created:**
- `lib/calendar/monte-carlo/types.ts` - Type definitions
- `lib/calendar/monte-carlo/variance-config.ts` - Variance parameters
- `lib/calendar/monte-carlo/random.ts` - PRNG and distribution utilities
- `lib/calendar/monte-carlo/simulation.ts` - Core Monte Carlo engine
- `lib/calendar/monte-carlo/index.ts` - Public exports
- `components/dashboard/risk-metrics.tsx` - Risk metrics display

**Features Delivered:**
- P10/P50/P90 confidence bands on forecast chart
- Risk metrics: probability of overdraft, worst-case balance, days at risk
- Color-coded risk indicators (emerald/amber/rose)
- Performance: ~9ms for 500 simulations × 60 days

### Why This Approach
- Statistically robust, handles complex interactions between income and bills
- Timing shifts properly model real-world payment uncertainty
- No external API dependencies — runs entirely on server
- Reproducible results with seeded RNG

---

## 2. Smart Categorization ✅ COMPLETED (April 6, 2026)

**Use case:** Auto-categorize imported bank transactions

### Implementation: Hybrid Rule-Based + LLM Fallback

We chose **Option C: Rule-Based + LLM Fallback** for the best balance of cost, speed, and accuracy.

**Architecture:**
```
CSV Upload → Parse → Normalize → Categorize → Review → Save
                                     ↓
                        ┌────────────┴────────────┐
                        ↓                         ↓
                  Rule Engine               Claude API
                  (instant, free)         (batch fallback)
                        ↓                         ↓
                        └────────────┬────────────┘
                                     ↓
                          Category Suggestions
                                     ↓
                        Transaction Selector UI
                          (user can override)
```

**Rule Engine:**
- ~50 merchant patterns for common services
- Pattern categories: Subscriptions, Utilities, Insurance, Rent/Mortgage, Transportation, Food & Dining, Shopping
- Examples: NETFLIX → Subscriptions, COMCAST → Utilities, GEICO → Insurance
- Priority-based matching (higher priority rules checked first)
- Case-insensitive keyword matching

**AI Fallback:**
- Claude Sonnet for unrecognized transactions
- Batched API calls for efficiency
- Tier-based limits: Free (10), Pro/Premium/Lifetime (50)
- Graceful degradation if AI fails

**UI Integration:**
- Category column in transaction selector table
- Confidence badges: "Auto" (high), "Likely" (medium), "Guess" (low)
- Color-coded: emerald (rule), amber (AI medium), zinc (AI low)
- User can override any suggestion before import

**Files Created:**
- `lib/categorization/types.ts` - Type definitions
- `lib/categorization/rules.ts` - ~50 merchant patterns
- `lib/categorization/rule-engine.ts` - Pattern matching logic
- `lib/categorization/ai-categorize.ts` - Claude API integration
- `lib/categorization/index.ts` - Exports and orchestration
- `app/api/categorize/route.ts` - API endpoint for AI categorization

**Files Modified:**
- `components/import/import-page-client.tsx` - Categorization integration
- `components/import/transaction-selector.tsx` - Category column + badges

### Why This Approach
- Rule engine handles 60-80% of transactions instantly (free)
- AI fallback provides high accuracy for edge cases
- Tier-based limits control API costs
- Users can always override suggestions

---

## 3. Natural Language Queries ✅ COMPLETED (April 6, 2026)

**User question:** "Can I afford a $500 purchase next week?"

### Implementation: Claude API with Function Calling

We implemented a chat-style interface where users can ask financial questions in plain English, powered by Claude with real-time access to their financial data through tool calling.

**Architecture:**
```
User Query (Modal)
    ↓
POST /api/ai/chat (streaming)
    ↓
Auth → Rate Limit Check → Fetch User Context
    ↓
Claude API (with tool definitions)
    ↓
Tool calls → Execute tools → Return results
    ↓
Stream response back to UI
```

**Model Selection:**
- Claude Sonnet (`claude-3-5-sonnet-20241022`) for complex financial queries
- Claude Haiku (`claude-3-5-haiku-20241022`) for simple greetings/short queries

**Rate Limiting:**
- Free tier: 5 queries per day (resets at midnight UTC)
- Pro/Premium/Lifetime: Unlimited queries
- Returns 429 with `resetAt` timestamp when limit reached

**Tools Exposed to Claude:**

| Tool | Description | Use When |
|------|-------------|----------|
| `calculate_affordability` | Check if purchase is affordable | "Can I afford X?" |
| `calculate_payment_date` | Predict invoice payment date | "When will client pay?" |
| `calculate_tax_reserve` | Calculate tax obligations | "How much for taxes?" |
| `calculate_income_variability` | Analyze income stability | "How stable is my income?" |
| `calculate_hourly_rate` | Calculate freelance rates | "What should I charge?" |
| `get_forecast_summary` | Get cash flow forecast | "When is my lowest balance?" |

**Files Created:**

```
lib/ai/
├── client.ts              # Anthropic SDK client, model selection
├── tools.ts               # Tool definitions (JSON schemas for Claude)
├── execute-tool.ts        # Tool execution dispatcher
├── system-prompt.ts       # System prompt builder with user context
├── context.ts             # Fetch user financial data from Supabase
├── usage.ts               # Daily query tracking (rate limiting)
└── types.ts               # TypeScript types

components/ask/
├── ask-button.tsx         # Trigger button (FAB, card, nav variants)
├── ask-modal.tsx          # Chat modal with streaming responses
└── index.ts               # Exports

app/api/ai/chat/
└── route.ts               # Streaming chat endpoint (SSE)

supabase/migrations/
└── 20260406000001_add_ai_query_usage.sql  # Usage tracking table
```

**Database Changes:**

```sql
-- ai_query_usage table for rate limiting
CREATE TABLE ai_query_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_date DATE NOT NULL DEFAULT CURRENT_DATE,
  query_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, query_date)
);

-- Atomic increment function
CREATE OR REPLACE FUNCTION increment_ai_query_usage(p_user_id UUID, p_query_date DATE)
RETURNS void AS $$ ... $$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Streaming Response Format (SSE):**
```
data: {"type":"text","content":"Based on..."}
data: {"type":"tool_start","tool":"Checking affordability"}
data: {"type":"tool_result","tool":"Checking affordability","success":true}
data: {"type":"text","content":"you can afford..."}
data: {"type":"done","remaining":4}
```

**UI Features:**
- Modal triggered by floating action button (violet, distinct from teal Scenario button)
- Full conversation history within session
- Tool execution indicator (shows which tool is running)
- Streaming text responses in real-time
- Remaining queries indicator for free tier users
- Upgrade prompt when limit reached

### Example Interaction
```
User: "Can I afford to buy a $2000 laptop next Friday?"

[Tool: Checking affordability...]

---

System: Looking at your forecast...

Your balance on Friday Jan 19 will be $3,450.
After a $2000 purchase, you'd have $1,450.

However, you have $1,200 in bills due the following week,
which would bring you to $250 — below your $500 safety buffer.

Recommendation: Wait until after Jan 26 when your invoice
payment of $3,500 is expected.
```

### Why This Approach
- Claude's function calling provides structured tool use with type-safe parameters
- Streaming responses give immediate feedback while processing
- User's full financial context available in system prompt
- Conversation history maintained for follow-up questions
- Rate limiting protects API costs while providing value to free users

---

## Implementation Priority Matrix

| Feature | Impact | Effort | Dependencies | Status |
|---------|--------|--------|--------------|--------|
| Probabilistic Forecasting | High | Medium | None | ✅ COMPLETED |
| Natural Language Queries | High | Medium | None | ✅ COMPLETED |
| Smart Categorization | High | Low-Med | Import feature (exists) | ✅ COMPLETED |

### Recommended Sequence

1. ~~**Probabilistic Forecasting**~~ — ✅ Completed April 4, 2026
2. ~~**Natural Language Queries**~~ — ✅ Completed April 6, 2026
3. ~~**Smart Categorization**~~ — ✅ Completed April 6, 2026

---

## Technical Considerations

### API Costs (for LLM features)
- OpenAI GPT-4o-mini: ~$0.15 per 1M input tokens
- Claude Haiku: ~$0.25 per 1M input tokens
- Consider caching common queries
- Batch categorization requests

### Privacy
- Financial data is sensitive
- Option to process locally where possible
- Clear data handling policies for LLM features

### Performance
- Monte Carlo may need Web Workers or server-side processing
- LLM calls should be async with loading states
- Consider streaming responses for chat interface

---

## Open Questions

- [x] ~~Which LLM provider? (OpenAI vs Anthropic vs open-source)~~ — Anthropic Claude (Sonnet/Haiku)
- [x] ~~Free tier limits for AI features?~~ — 5 queries/day free, unlimited Pro
- [x] ~~How much historical data needed for probabilistic forecasting?~~ — None needed; uses variance config by frequency type
- [ ] Should chat history be persisted across sessions? (Currently session-only)

## Decisions Made

**Probabilistic Forecasting (April 2026):**
- Chose Monte Carlo over variance bands for statistical robustness
- 500 simulations balances accuracy vs. performance
- Server-side execution (not client-side) for consistent results
- Variance derived from frequency type, not historical data (simpler, works for new users)

**Natural Language Queries (April 2026):**
- Chose Anthropic Claude over OpenAI for better function calling reliability
- Model selection: Sonnet for complex queries, Haiku for simple ones (cost optimization)
- Chat modal pattern (like ScenarioModal) over sidebar or command bar
- Real-time streaming via SSE for responsive UX
- 5 queries/day free tier limit balances value vs. API costs
- Conversation history within session (not persisted to database)
- Violet color scheme distinguishes from Scenario button (teal)

**Proactive AI Alerts (April 2026):**
- Rule-based engine with modular alert rules (no LLM needed for detection)
- 4 initial alert types: cash crunch, bill collision, invoice risk, opportunity
- Priority system: critical (can't dismiss), warning, info, opportunity
- Server-side generation during dashboard page load
- Replaced legacy warning banners with unified AlertBanner system
- Collapsible UI with dismiss functionality for non-critical alerts
- Max 5 alerts shown to avoid overwhelming users
- No database persistence for dismissed alerts (session-only)
- Integrated into weekly email digest with color-coded styling
- Bug fixes: invoice count query, bill collision balance calculation, duplicate warning removal

---

# Phase 2: Proactive Intelligence

*Vision: Transform Cashcast from a reactive tool to a proactive financial assistant that anticipates problems before they happen.*

---

## 4. Proactive AI Alerts ✅ COMPLETED (April 9, 2026)

**User need:** "Don't make me ask — tell me when something needs my attention."

### Overview

Instead of waiting for users to ask questions, Cashcast will proactively analyze their financial data and surface actionable alerts before problems occur.

### Alert Types

| Alert Type | Trigger Condition | Example Message |
|------------|-------------------|-----------------|
| **Cash Crunch Warning** | Projected balance < safety buffer within 14 days | "Heads up: You'll hit $200 on March 15th. Consider delaying the software subscription." |
| **Bill Collision** | 3+ bills landing within 2-day window | "You have $2,400 in bills landing March 1-3. Your balance can handle it, but it'll be tight." |
| **Invoice Overdue Risk** | Client payment pattern suggests delay | "Acme Corp usually pays 5 days late. Adjusting your forecast accordingly." |
| **Opportunity Window** | Surplus detected for discretionary spending | "You'll have $3K+ buffer for the next 3 weeks — good window for that equipment purchase." |
| **Unusual Activity** | Spending pattern anomaly detected | "Your software subscriptions are up 40% this month ($847 vs usual $600)." |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Alert Generation Flow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Triggers:                                                       │
│  ├── Dashboard page load                                         │
│  ├── Weekly digest email generation                              │
│  └── After data changes (bill added, invoice sent, etc.)         │
│                                                                  │
│         ↓                                                        │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │  Alert Engine   │                                             │
│  │  (Server-side)  │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ├── Fetch user context (accounts, bills, invoices)     │
│           ├── Run Monte Carlo simulation                         │
│           ├── Analyze patterns (payment history, spending)       │
│           ├── Apply alert rules                                  │
│           └── Generate alert messages (Claude Haiku for NL)      │
│                                                                  │
│         ↓                                                        │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │  Dashboard UI   │    │  Email Digest   │                      │
│  │  (Alert Banner) │    │  (Alert Section)│                      │
│  └─────────────────┘    └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

**Files Created:**
```
lib/alerts/
├── types.ts              # Alert type definitions
├── rules/
│   ├── cash-crunch.ts    # Low balance detection (triggers <14 days)
│   ├── bill-collision.ts # 3+ bills within 2-day window
│   ├── invoice-risk.ts   # Overdue and at-risk invoices
│   ├── opportunity.ts    # 7+ days sustained surplus
│   └── index.ts          # Rule exports
├── engine.ts             # Alert rule orchestrator
└── index.ts              # Public exports

components/alerts/
├── alert-banner.tsx      # Collapsible alert list with dismiss
└── index.ts              # Exports
```

**Files Modified:**
- `app/dashboard/page.tsx` - Generate and pass alerts to client
- `components/dashboard/dashboard-content.tsx` - Display AlertBanner, removed legacy warning banners
- `lib/email/types.ts` - Added DigestAlert type
- `lib/email/generate-digest-data.ts` - Generate alerts for weekly email digest
- `components/emails/weekly-digest.tsx` - Render proactive alerts in email

### Alert Priority & Styling

| Priority | Color | Icon | Behavior |
|----------|-------|------|----------|
| Critical | Rose/Red | ⚠️ | Always visible, can't dismiss |
| Warning | Amber | ⚡ | Visible, dismissible |
| Info | Blue | 💡 | Collapsible, dismissible |
| Opportunity | Emerald | ✨ | Subtle, dismissible |

### Why This Approach
- Shifts product from reactive tool to proactive assistant
- Leverages existing Monte Carlo and context infrastructure
- Low API cost (Haiku for message generation, rules are local)
- Increases engagement without requiring user action

---

## 5. Client Payment Risk Scoring 📋 PLANNED

**User need:** "Which clients should I worry about paying late?"

### Overview

Predict invoice payment timing based on historical patterns and client behavior, giving freelancers better forecast accuracy and actionable insights.

### Risk Score Model

```
Invoice: Acme Corp - $5,000 - Due Apr 15

Payment Prediction:
├── Expected Payment: Apr 18 (3 days late)
├── Confidence: 78%
├── Risk Level: Medium
├── Pattern: Paid 12 days late last time, improving trend
└── Recommendation: Follow up on Apr 14

Risk Factors:
├── [+] Paid last 3 invoices
├── [+] Improving trend (was 12 days late → 8 days → 5 days)
├── [-] Invoice amount higher than usual
└── [-] End of quarter (historically slower)
```

### Data Points for Scoring

| Factor | Weight | Source |
|--------|--------|--------|
| Historical payment speed | High | Invoice payment history |
| Payment trend (improving/worsening) | Medium | Calculated from history |
| Invoice amount vs. typical | Low | Invoice comparison |
| Day of week/month sent | Low | Invoice metadata |
| Time since last payment | Medium | Invoice history |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Payment Risk Scoring Flow                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Invoice Created/Sent                                            │
│         ↓                                                        │
│  ┌─────────────────┐                                             │
│  │  Risk Scorer    │                                             │
│  │  (Server-side)  │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ├── Fetch client payment history                       │
│           ├── Calculate average days to payment                  │
│           ├── Detect trend (improving/worsening)                 │
│           ├── Apply risk factors                                 │
│           └── Generate risk score (0-100) + expected date        │
│                                                                  │
│         ↓                                                        │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │  Invoice List   │    │  Forecast Adj.  │                      │
│  │  (Risk Badge)   │    │  (Use expected) │                      │
│  └─────────────────┘    └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

**Files to Create:**
```
lib/invoices/
├── payment-risk/
│   ├── types.ts           # Risk score types
│   ├── history.ts         # Fetch payment history
│   ├── scorer.ts          # Risk calculation engine
│   ├── trend.ts           # Trend detection
│   └── index.ts           # Public exports
```

**Files to Modify:**
- `components/invoices/invoice-list.tsx` - Add risk badges
- `lib/calendar/monte-carlo/simulation.ts` - Use predicted dates
- Invoice detail page - Show risk breakdown

### Risk Level Thresholds

| Risk Level | Score Range | Color | Expected Delay |
|------------|-------------|-------|----------------|
| Low | 0-25 | Emerald | On time or early |
| Medium | 26-50 | Amber | 1-7 days late |
| High | 51-75 | Orange | 8-14 days late |
| Critical | 76-100 | Rose | 15+ days late |

### Why This Approach
- Uses existing invoice data (no new data collection needed)
- Rule-based scoring (no API costs)
- Directly improves forecast accuracy
- Unique differentiator for freelancer market

---

## 6. Income Pattern Forecasting 📋 PLANNED

**User need:** "My income is irregular — help me predict it."

### Overview

Learn from historical income patterns to generate smarter forecasts for freelancers with variable income, going beyond simple recurring entries.

### Pattern Analysis

```
Income Analysis for Omar:

Client Breakdown:
├── Acme Corp (Primary)
│   ├── Frequency: ~Monthly, irregular timing
│   ├── Amount: $4,000-$6,500 (avg $5,200)
│   ├── Timing: Usually 5th-15th of month
│   └── Trend: Stable
│
├── Beta Inc (Retainer)
│   ├── Frequency: Monthly, consistent
│   ├── Amount: $2,000 (fixed)
│   ├── Timing: 1st of month
│   └── Trend: Stable
│
└── Side Projects
    ├── Frequency: Sporadic (0-3 per month)
    ├── Amount: $500-$1,500
    └── Predictability: Low

Seasonality Detected:
├── Q4: +30% (holiday projects)
├── Q1: -15% (slow start)
└── Summer: -10% (vacation season)

AI Forecast (Next 90 Days):
├── April: $7,200 (P50), range $5,800-$9,100
├── May: $6,800 (P50), range $5,200-$8,600
└── June: $7,500 (P50), range $5,900-$9,400
```

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Income Pattern Analysis Flow                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Data Sources:                                                   │
│  ├── Paid invoices (last 12 months)                              │
│  ├── Income entries (recurring + one-time)                       │
│  └── Bank imports (if available)                                 │
│                                                                  │
│         ↓                                                        │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │ Pattern Engine  │                                             │
│  │ (Server-side)   │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ├── Group income by source/client                      │
│           ├── Calculate frequency distribution                   │
│           ├── Detect seasonality (monthly, quarterly)            │
│           ├── Identify trends (growing, stable, declining)       │
│           └── Generate probabilistic forecast                    │
│                                                                  │
│         ↓                                                        │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │ Income Insights │    │ Enhanced Monte  │                      │
│  │    Dashboard    │    │ Carlo Forecast  │                      │
│  └─────────────────┘    └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

**Files to Create:**
```
lib/income/
├── patterns/
│   ├── types.ts           # Pattern types
│   ├── analyzer.ts        # Pattern detection engine
│   ├── seasonality.ts     # Seasonal trend detection
│   ├── forecast.ts        # Probabilistic income forecast
│   └── index.ts           # Public exports

components/income/
├── income-insights.tsx    # Pattern visualization
├── forecast-chart.tsx     # Income forecast chart
└── index.ts               # Exports
```

**Files to Modify:**
- `app/dashboard/page.tsx` - Add income insights section
- `lib/calendar/monte-carlo/simulation.ts` - Incorporate learned patterns

### Minimum Data Requirements

| Data Points | Forecast Quality |
|-------------|------------------|
| < 3 months | Basic (use entered recurring) |
| 3-6 months | Moderate (detect simple patterns) |
| 6-12 months | Good (seasonality detection) |
| 12+ months | Excellent (full pattern analysis) |

### Why This Approach
- Core differentiator for freelancer market
- Improves forecast accuracy over time
- No API costs (statistical analysis)
- Builds on existing Monte Carlo infrastructure

---

## Updated Implementation Priority Matrix

| Feature | Impact | Effort | API Cost | Status |
|---------|--------|--------|----------|--------|
| Probabilistic Forecasting | High | Medium | None | ✅ COMPLETED |
| Smart Categorization | High | Low-Med | Low | ✅ COMPLETED |
| Natural Language Queries | High | Medium | Medium | ✅ COMPLETED |
| **Proactive AI Alerts** | High | Low | None | ✅ COMPLETED |
| **Client Payment Risk Scoring** | High | Medium | None | 📋 PLANNED |
| **Income Pattern Forecasting** | High | High | None | 📋 PLANNED |

### Phase 2 Sequence

1. ~~**Proactive AI Alerts**~~ — ✅ Completed April 9, 2026
2. **Client Payment Risk Scoring** — Uses existing invoice data
3. **Income Pattern Forecasting** — Most complex, highest long-term value

---

## Future Considerations (Phase 3+)

| Feature | Description | Effort |
|---------|-------------|--------|
| Bank Statement PDF Parsing | AI extracts transactions from PDF statements | Medium |
| Expense Optimization | Identify savings opportunities from patterns | Medium |
| Smart Scenario Suggestions | AI suggests relevant what-if scenarios | Low |
| Voice Interface | Ask Cashcast questions by voice | High |
| Receipt OCR | Scan receipts, auto-categorize | High |
