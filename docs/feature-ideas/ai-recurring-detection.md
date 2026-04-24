# AI Recurring Detection (PDF Import Enhancement)

## Overview

Enhance the existing PDF bank statement import to automatically detect recurring transactions and suggest importing them as recurring bills or income.

**Problem it solves:** Users import PDF statements and manually set up recurring bills. This feature auto-detects patterns like "SPOTIFY $9.99 on the 18th of each month" and offers to create recurring entries automatically.

---

## Strategic Fit

1. **Low effort** — Builds on existing PDF import infrastructure
2. **High value** — Reduces manual work significantly
3. **Differentiator** — Competitors don't have this level of automation
4. **Increases accuracy** — Catches recurring patterns users might miss

---

## How It Works

### Detection Algorithm

```typescript
interface RecurringPattern {
  description: string;         // "SPOTIFY PREMIUM"
  normalizedName: string;      // "Spotify Premium"
  amount: number;              // -9.99
  amountVariance: number;      // 0.05 (5% variance allowed)
  frequency: Frequency;        // 'monthly'
  confidence: number;          // 0.92
  occurrences: Array<{
    date: Date;
    amount: number;
  }>;
  suggestedDayOfMonth: number; // 18
}

function detectRecurringPatterns(transactions: Transaction[]): RecurringPattern[] {
  // Step 1: Group by similar description
  const groups = groupBySimilarDescription(transactions);

  // Step 2: Filter groups with 2+ occurrences
  const candidates = groups.filter(g => g.length >= 2);

  // Step 3: Check amount consistency (within 10% variance)
  const amountConsistent = candidates.filter(g => {
    const amounts = g.map(t => Math.abs(t.amount));
    const avg = average(amounts);
    return amounts.every(a => Math.abs(a - avg) / avg < 0.10);
  });

  // Step 4: Detect frequency pattern
  const patterns = amountConsistent.map(group => {
    const dates = group.map(t => t.date).sort();
    const intervals = calculateIntervals(dates);
    const frequency = detectFrequency(intervals);
    const confidence = calculateConfidence(group, frequency);

    return {
      description: group[0].description,
      normalizedName: normalizeDescription(group[0].description),
      amount: average(group.map(t => t.amount)),
      frequency,
      confidence,
      occurrences: group,
      suggestedDayOfMonth: mostCommonDayOfMonth(dates),
    };
  });

  // Step 5: Return high-confidence patterns (>70%)
  return patterns.filter(p => p.confidence > 0.7);
}
```

### Frequency Detection

```typescript
function detectFrequency(intervalDays: number[]): Frequency {
  const avgInterval = average(intervalDays);

  if (avgInterval <= 10) return 'weekly';
  if (avgInterval <= 18) return 'biweekly';
  if (avgInterval <= 35) return 'monthly';
  if (avgInterval <= 100) return 'quarterly';
  if (avgInterval <= 380) return 'annually';
  return 'irregular';
}
```

### Description Normalization

```typescript
function normalizeDescription(desc: string): string {
  // Remove common bank prefixes/suffixes
  let normalized = desc
    .replace(/^(CHECKCARD|DEBIT|ACH|POS|RECURRING)\s*/i, '')
    .replace(/\s*(PURCHASE|PAYMENT|WITHDRAWAL)$/i, '')
    .replace(/\s+\d{4}$/, '') // Remove last 4 digits (card number)
    .replace(/\s+[A-Z]{2}\s*$/, '') // Remove state codes
    .trim();

  // Title case
  return normalized
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Examples:
// "CHECKCARD SPOTIFY PREMIUM" → "Spotify Premium"
// "ACH ADOBE CREATIVE CLOUD" → "Adobe Creative Cloud"
// "DEBIT NETFLIX.COM 1234" → "Netflix.com"
```

---

## UI Flow

### During PDF Import Review

After transactions are extracted and categorized, show detected patterns:

```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Recurring Patterns Detected                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ We found 3 recurring patterns in your statement:           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Spotify Premium                                       │ │
│ │   $9.99/month on the 18th • 3 occurrences • 95% conf   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ Adobe Creative Cloud                                  │ │
│ │   $54.99/month on the 1st • 2 occurrences • 87% conf   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ Netflix                                               │ │
│ │   $15.99/month on the 22nd • 2 occurrences • 72% conf  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Import as Recurring Bills]  [Skip - Import as One-Time]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Confirmation

When user clicks "Import as Recurring Bills":

```
Creating recurring bills:
✓ Spotify Premium - $9.99/month starting May 18
✓ Adobe Creative Cloud - $54.99/month starting Jun 1

2 recurring bills created. View in Bills →
```

---

## File Structure

```
lib/import/
├── recurring-detector.ts     # Pattern detection algorithm
├── description-normalizer.ts # Clean up bank descriptions
└── frequency-analyzer.ts     # Interval → frequency mapping

components/import/
└── recurring-patterns-card.tsx # UI for detected patterns
```

---

## Integration Points

### Modify: `components/import/import-page-client.tsx`

After parsing and categorization, run recurring detection:

```typescript
// After transactions are parsed
const patterns = detectRecurringPatterns(transactions);

// Show patterns card if any detected
if (patterns.length > 0) {
  setDetectedPatterns(patterns);
  setShowPatternCard(true);
}
```

### Create Bills from Patterns

```typescript
async function importAsRecurring(patterns: RecurringPattern[]) {
  for (const pattern of patterns) {
    await createBill({
      name: pattern.normalizedName,
      amount: Math.abs(pattern.amount),
      frequency: pattern.frequency,
      next_due_date: calculateNextDueDate(pattern.suggestedDayOfMonth),
      category: pattern.suggestedCategory,
    });
  }
}
```

---

## Implementation Sequence

### Phase 1: Core Algorithm (Day 1)
1. Create `recurring-detector.ts` with grouping logic
2. Create `description-normalizer.ts` for cleaning descriptions
3. Create `frequency-analyzer.ts` for interval detection
4. Add confidence scoring

### Phase 2: UI Integration (Day 2)
5. Create `recurring-patterns-card.tsx` component
6. Integrate into import flow
7. Add "Import as Recurring" action
8. Create bills from selected patterns

---

## Verification Checklist

- [ ] Groups transactions by similar description
- [ ] Handles amount variance (up to 10%)
- [ ] Correctly detects weekly/biweekly/monthly/quarterly frequencies
- [ ] Normalizes bank descriptions properly
- [ ] Shows confidence scores
- [ ] User can select/deselect patterns
- [ ] Creates recurring bills with correct frequency
- [ ] Sets correct next due date
- [ ] Works with expense transactions (negative amounts)
- [ ] Works with income transactions (positive amounts)

---

## Edge Cases

| Case | Handling |
|------|----------|
| Only 1 occurrence | Don't suggest as recurring (need 2+) |
| Varying amounts | Flag but allow if variance < 10% |
| Irregular timing | Lower confidence, suggest as "irregular" |
| Multiple cards same vendor | Group if description matches |
| Refunds | Exclude positive amounts for expense vendors |

---

## Future Enhancements

- Detect income patterns (paychecks, client payments)
- Learn from user corrections (improve accuracy over time)
- Suggest category based on vendor (Spotify → Subscriptions)
- Detect annual subscriptions from single occurrence + amount
- Match with existing bills (avoid duplicates)
