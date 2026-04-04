# AI Features Roadmap

Future AI-powered enhancements for CashFlowForecaster.

---

## 1. Probabilistic Forecasting

**User question:** "Will I run out of money?"

### Current State
- Forecasting in `lib/calendar/generate.ts` is deterministic
- Same inputs always produce same 60-day projection
- No variance modeling for income or expenses

### Proposed Enhancement
Add confidence intervals and probability estimates to forecasts:
- "15% chance of dropping below $0 in the next 30 days"
- Optimistic / Expected / Pessimistic balance bands on the chart
- Risk score for the forecast period

### Implementation Approaches

**Option A: Monte Carlo Simulation**
- Run 1000+ forecast scenarios with randomized income/expense timing and amounts
- Use historical variance from `lib/tools/calculate-income-variability.ts`
- Calculate percentiles (P10, P50, P90) for each day
- Pros: Statistically robust, handles complex interactions
- Cons: Compute-intensive, may need backend processing

**Option B: Variance Bands (Simpler)**
- Calculate standard deviation from historical income data
- Apply +/- 1-2 sigma bands to the deterministic forecast
- Pros: Fast, runs client-side
- Cons: Less accurate for edge cases

**Option C: ML-Based Prediction**
- Train model on user's historical cash flow patterns
- Predict likelihood of balance dropping below threshold
- Pros: Learns user-specific patterns
- Cons: Requires historical data, more complex

### Priority: High
- Strong differentiator — most tools show deterministic forecasts
- Aligns with freelancer audience who have variable income
- Addresses core anxiety: "Will I be okay?"

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

| Feature | Impact | Effort | Dependencies | Priority |
|---------|--------|--------|--------------|----------|
| Probabilistic Forecasting | High | Medium | None | 1 |
| Natural Language Queries | High | Medium | None | 2 |
| Smart Categorization | High | Low-Med | Import feature (exists) | 3 |

### Recommended Sequence

1. **Probabilistic Forecasting** — Core differentiator, no external API needed
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

- [ ] Which LLM provider? (OpenAI vs Anthropic vs open-source)
- [ ] Free tier limits for AI features?
- [ ] How much historical data needed for probabilistic forecasting?
- [ ] Should chat history be persisted?
