# AI Features Roadmap

AI-powered enhancements for CashFlowForecaster.

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

## 2. Smart Categorization (LLM-Based)

**Use case:** Auto-categorize imported bank transactions

### Current State
- CSV import exists: upload bank export → map columns → select transactions
- Bills have a `category` field (string, user-defined)
- No automatic categorization of imported transactions

### Proposed Enhancement
Use LLM to automatically categorize transactions based on description:
- "AMZN MKTP US*123ABC" → Shopping / Subscriptions
- "SPOTIFY USA" → Entertainment / Subscriptions
- "SHELL OIL 12345" → Transportation / Gas

### Implementation Approaches

**Option A: OpenAI/Claude API**
- Send transaction descriptions in batches
- Prompt: "Categorize these transactions into: Utilities, Subscriptions, Food, Transportation, etc."
- Pros: High accuracy, handles edge cases
- Cons: API costs, latency, privacy considerations

**Option B: Local Classification Model**
- Use a small transformer model (e.g., DistilBERT fine-tuned on transaction data)
- Run in browser via ONNX or TensorFlow.js
- Pros: No API costs, faster, privacy-preserving
- Cons: Less accurate, larger bundle size

**Option C: Rule-Based + LLM Fallback**
- Maintain regex/keyword rules for common merchants (Netflix, Amazon, Uber)
- Use LLM only for unrecognized transactions
- Pros: Cost-effective, fast for common cases
- Cons: Rules need maintenance

### Data Flow
```
CSV Upload → Parse Transactions → Auto-Categorize → User Review → Save as Bills/Income
```

### Priority: High (revised)
- Import feature already exists — this is the natural next step
- Reduces friction in onboarding flow
- Users importing bank data expect smart parsing

---

## 3. Natural Language Queries

**User question:** "Can I afford a $500 purchase next week?"

### Current State
- Affordability logic exists in `lib/tools/calculate-affordability.ts`
- Payment predictor tool at `lib/tools/calculate-payment-date.ts`
- Tax reserve calculator at `lib/tools/calculate-tax-reserve.ts`
- All require navigating to specific UI tools

### Proposed Enhancement
Chat-style interface where users ask questions in plain English:
- "Can I afford a $500 purchase next week?"
- "When will my balance be lowest this month?"
- "How much should I set aside for taxes?"
- "What if I delay my rent payment by 5 days?"

### Implementation Approach

**Architecture: LLM + Function Calling**

1. User submits natural language question
2. LLM (OpenAI/Claude) interprets intent and extracts parameters
3. LLM calls appropriate internal function:
   - `calculateAffordability({ amount: 500, date: '2024-01-15' })`
   - `generateCalendar()` for forecast queries
   - `calculateTaxReserve()` for tax questions
4. LLM formats response in natural language

**Available Functions to Expose:**
| Function | Purpose |
|----------|---------|
| `calculateAffordability` | Can I afford X? |
| `calculatePaymentDate` | When will client pay? |
| `calculateTaxReserve` | Tax obligations |
| `generateCalendar` | Full forecast data |
| `calculateIncomeVariability` | Income stability |

**UI Options:**
- Chat panel in dashboard sidebar
- Command bar (Cmd+K style)
- Dedicated "Ask" page

### Example Interaction
```
User: "Can I afford to buy a $2000 laptop next Friday?"

System: Looking at your forecast...

Your balance on Friday Jan 19 will be $3,450.
After a $2000 purchase, you'd have $1,450.

However, you have $1,200 in bills due the following week,
which would bring you to $250 — below your $500 safety buffer.

Recommendation: Wait until after Jan 26 when your invoice
payment of $3,500 is expected.
```

### Priority: High
- Makes existing tools more accessible
- Conversational UI is intuitive for non-technical users
- Strong marketing angle: "Talk to your finances"

---

## Implementation Priority Matrix

| Feature | Impact | Effort | Dependencies | Status |
|---------|--------|--------|--------------|--------|
| Probabilistic Forecasting | High | Medium | None | ✅ COMPLETED |
| Natural Language Queries | High | Medium | None | Next |
| Smart Categorization | High | Low-Med | Import feature (exists) | Planned |

### Recommended Sequence

1. ~~**Probabilistic Forecasting**~~ — ✅ Completed April 4, 2026
2. **Natural Language Queries** — High UX impact, leverages existing tools
3. **Smart Categorization** — Enhances existing import flow

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

- [ ] Which LLM provider? (OpenAI vs Anthropic vs open-source) — For NL queries and categorization
- [ ] Free tier limits for AI features?
- [x] ~~How much historical data needed for probabilistic forecasting?~~ — None needed; uses variance config by frequency type
- [ ] Should chat history be persisted?

## Decisions Made

**Probabilistic Forecasting (April 2026):**
- Chose Monte Carlo over variance bands for statistical robustness
- 500 simulations balances accuracy vs. performance
- Server-side execution (not client-side) for consistent results
- Variance derived from frequency type, not historical data (simpler, works for new users)
