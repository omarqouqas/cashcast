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
