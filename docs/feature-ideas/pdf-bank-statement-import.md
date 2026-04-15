# PDF Bank Statement Import Feature - Implementation Plan

## Market Research

**Source:** Micro-SaaS Ideas Database

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $40,000 |
| Starting Costs | $100 |
| Solopreneur Score | 90 (very high viability) |
| ICP | Small Business Owners, Accountants |
| Growth Tactics | Word of mouth, Referral Program, SEO |

**Note:** This is the highest-revenue relevant entry in the database, indicating strong market demand for bank statement parsing.

---

## Overview

Allow users to upload PDF bank statements and automatically extract transactions (income and expenses) to populate their Cashcast forecast. This eliminates manual data entry for users who don't want to connect their bank directly.

**Problem it solves:** Users currently must manually enter every income and bill. Many freelancers receive PDF statements but don't want to link their bank account. This feature bridges the gap: upload a PDF → transactions auto-detected → approve and import.

---

## Strategic Fit

This feature strengthens Cashcast's value proposition by:

1. **Reducing onboarding friction** - New users can import history instantly
2. **Maintaining privacy stance** - No bank connection required (key differentiator)
3. **Improving forecast accuracy** - Real transaction data vs. estimates
4. **Increasing activation** - Users see value immediately with populated data

---

## Proposed UI Location

**New page:** `/dashboard/import/bank-statement`

- Accessible from Settings or a dedicated "Import" section
- Also accessible during onboarding flow
- Links from existing Excel import page

---

## Core Concepts

### Statement Upload Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. UPLOAD                                               │
│    User uploads PDF bank statement                      │
│    ↓                                                    │
│ 2. PARSE                                                │
│    System extracts transactions using OCR/PDF parsing   │
│    ↓                                                    │
│ 3. REVIEW                                               │
│    User sees extracted transactions in editable table   │
│    User categorizes: Income, Bill, or Skip              │
│    ↓                                                    │
│ 4. IMPORT                                               │
│    Approved transactions create income/bill records     │
│    System detects recurring patterns                    │
└─────────────────────────────────────────────────────────┘
```

### Transaction Categories

| Category | Action |
|----------|--------|
| Income | Creates income record (may be one-time or recurring) |
| Bill/Expense | Creates bill record (may be one-time or recurring) |
| Transfer | Skipped (internal movement) |
| Skip | Ignored |

---

## Technical Approach

### Option A: Client-Side PDF Parsing (Recommended for MVP)

**Libraries:**
- `pdf.js` - Extract text from PDFs
- `pdf-parse` - Node.js PDF text extraction

**Pros:**
- No server costs
- Privacy-friendly (PDF never leaves user's device)
- Fast for simple statements

**Cons:**
- Limited accuracy for complex/scanned PDFs
- No OCR capability

### Option B: Server-Side with AI/OCR

**Services:**
- AWS Textract
- Google Document AI
- OpenAI Vision API

**Pros:**
- Handles scanned documents
- Better accuracy
- Can handle varied formats

**Cons:**
- Per-page costs ($0.01-0.10/page)
- Requires server infrastructure
- Privacy concerns (PDF uploaded to cloud)

### Recommended: Hybrid Approach

1. **MVP:** Client-side parsing with `pdf.js`
2. **Enhancement:** Add server-side fallback for failed parses
3. **Premium:** AI-powered parsing for complex statements

---

## Database Changes

### New Table: `statement_uploads`

Track upload history and parsing status.

```sql
CREATE TABLE statement_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_size_bytes INTEGER,
  status VARCHAR(20) DEFAULT 'pending', -- pending, parsing, review, completed, failed
  bank_name VARCHAR(100), -- Detected or user-selected
  statement_period_start DATE,
  statement_period_end DATE,
  transactions_found INTEGER DEFAULT 0,
  transactions_imported INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE statement_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own uploads"
  ON statement_uploads FOR ALL USING (auth.uid() = user_id);
```

### New Table: `statement_transactions`

Temporary storage for parsed transactions before import.

```sql
CREATE TABLE statement_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES statement_uploads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL, -- Negative = expense, Positive = income
  category VARCHAR(20) DEFAULT 'uncategorized', -- income, bill, transfer, skip
  suggested_name VARCHAR(100), -- AI-suggested name for recurring
  suggested_frequency VARCHAR(20), -- If detected as recurring
  is_imported BOOLEAN DEFAULT false,
  imported_as VARCHAR(20), -- 'income' or 'bill'
  imported_record_id UUID, -- Links to income or bill record
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for review page
CREATE INDEX idx_statement_transactions_upload
  ON statement_transactions(upload_id, is_imported);
```

---

## File Structure

```
app/dashboard/import/
  bank-statement/
    page.tsx                    # Upload + review page

components/import/
  pdf-upload-zone.tsx           # Drag-drop upload area
  transaction-review-table.tsx  # Editable table of extracted transactions
  transaction-row.tsx           # Individual row with category selector
  import-summary.tsx            # Summary before final import
  bank-selector.tsx             # Select bank format (optional)

lib/import/
  pdf-parser.ts                 # Core PDF text extraction
  transaction-extractor.ts      # Parse text into transactions
  bank-formats/                 # Bank-specific parsing rules
    chase.ts
    bank-of-america.ts
    wells-fargo.ts
    generic.ts                  # Fallback parser
  recurring-detector.ts         # Detect recurring patterns
```

---

## Parsing Strategy

### Generic Transaction Pattern

Most bank statements follow patterns like:
```
DATE        DESCRIPTION                    AMOUNT
01/15/2024  VENMO PAYMENT FROM JOHN DOE    +500.00
01/16/2024  ADOBE CREATIVE CLOUD           -54.99
01/17/2024  TRANSFER TO SAVINGS            -200.00
```

### Extraction Algorithm

```typescript
interface ExtractedTransaction {
  date: Date;
  description: string;
  amount: number; // Positive = credit, Negative = debit
  rawText: string; // Original line for debugging
}

function extractTransactions(pdfText: string): ExtractedTransaction[] {
  // 1. Split into lines
  // 2. Identify transaction lines (date + amount pattern)
  // 3. Extract date, description, amount
  // 4. Normalize amount (handle CR/DR, parentheses for negative)
  // 5. Return structured data
}
```

### Bank-Specific Formats

Support common banks with custom parsers:
- Chase
- Bank of America
- Wells Fargo
- Capital One
- Generic fallback

User can select bank to improve accuracy, or use auto-detect.

---

## UI Components

### Upload Page

```
┌─────────────────────────────────────────────────────────┐
│ Import Bank Statement                                   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │     📄 Drag & drop your PDF statement here          │ │
│ │                                                     │ │
│ │              or click to browse                     │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Bank (optional): [Auto-detect ▼]                        │
│                                                         │
│ Supported: Chase, Bank of America, Wells Fargo, more    │
│                                                         │
│ Privacy note: Your PDF is processed locally and never   │
│ uploaded to our servers.                                │
└─────────────────────────────────────────────────────────┘
```

### Review Page

```
┌─────────────────────────────────────────────────────────┐
│ Review Transactions                     [Import All →]  │
│ Found 47 transactions from Jan 1 - Jan 31, 2024        │
├─────────────────────────────────────────────────────────┤
│ Filter: [All ▼] [Income] [Bills] [Skip]                │
├─────────────────────────────────────────────────────────┤
│ Date       Description              Amount   Category   │
│ ─────────────────────────────────────────────────────── │
│ 01/15      VENMO FROM CLIENT        +$500    [Income▼]  │
│ 01/16      ADOBE CREATIVE CLOUD     -$54.99  [Bill  ▼]  │
│ 01/17      TRANSFER TO SAVINGS      -$200    [Skip  ▼]  │
│ 01/18      SPOTIFY PREMIUM          -$9.99   [Bill  ▼]  │
│ 01/20      FREELANCE PAYMENT        +$2,500  [Income▼]  │
│ ...                                                     │
├─────────────────────────────────────────────────────────┤
│ Summary:                                                │
│ • 12 income transactions: +$8,450                       │
│ • 28 bill transactions: -$2,340                         │
│ • 7 skipped                                             │
│                                                         │
│ [Cancel]                              [Import Selected] │
└─────────────────────────────────────────────────────────┘
```

---

## Recurring Detection

When importing, detect recurring patterns:

```typescript
interface RecurringPattern {
  name: string;           // "SPOTIFY PREMIUM"
  amount: number;         // -9.99
  frequency: Frequency;   // 'monthly'
  confidence: number;     // 0.95
  occurrences: Date[];    // Dates found
}

function detectRecurring(transactions: Transaction[]): RecurringPattern[] {
  // Group by similar description + amount
  // Check if dates follow a pattern (monthly, weekly, etc.)
  // Return high-confidence patterns
}
```

When recurring is detected, prompt user:
> "We found SPOTIFY PREMIUM ($9.99) on the 18th of each month. Import as recurring bill?"

---

## Feature Gating

| Tier | Access |
|------|--------|
| Free | 1 statement per month |
| Pro | 5 statements per month |
| Premium | Unlimited + AI-enhanced parsing |

---

## Implementation Sequence

### Phase 1: Core Infrastructure
1. Create database tables (`statement_uploads`, `statement_transactions`)
2. Create generic PDF parser (`pdf.js` integration)
3. Create transaction extraction algorithm

### Phase 2: Upload Flow
4. Create upload page with drag-drop
5. Create parsing progress indicator
6. Store extracted transactions in database

### Phase 3: Review & Import
7. Create review table component
8. Add category selection (income/bill/skip)
9. Implement import logic (create income/bill records)
10. Link imported records back to statement

### Phase 4: Intelligence
11. Add bank-specific parsers (Chase, BoA, etc.)
12. Implement recurring detection
13. Add suggested names/frequencies

### Phase 5: Polish
14. Add upload history page
15. Add re-import/edit capability
16. Add onboarding integration

---

## Verification Checklist

- [ ] PDF upload works (drag-drop and click)
- [ ] Generic parser extracts transactions accurately
- [ ] Review table displays all transactions
- [ ] Can change category for each transaction
- [ ] Can bulk-select and categorize
- [ ] Import creates correct income/bill records
- [ ] Recurring patterns detected and suggested
- [ ] Upload history tracked
- [ ] Free tier limit enforced
- [ ] Privacy: PDF processed client-side only

---

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Invalid PDF | "This file doesn't appear to be a valid PDF." | Show upload again |
| No transactions found | "We couldn't find any transactions. Try selecting your bank manually." | Show bank selector |
| Parsing failed | "We had trouble reading this statement. Try a different format or enter transactions manually." | Link to manual entry |

---

## Privacy & Security

1. **Client-side processing:** PDF never uploaded to server (MVP)
2. **No storage:** Raw PDF not stored, only extracted data
3. **User control:** User reviews all data before import
4. **Deletion:** Upload history can be deleted

---

## Future Enhancements

- OCR for scanned statements (server-side)
- AI categorization (auto-detect income vs expense)
- Multi-statement upload (batch process)
- CSV/OFX/QFX import alongside PDF
- Auto-matching with existing bills (detect existing recurring)
- Statement comparison (month-over-month)
- Mobile camera capture (photo → PDF → parse)
