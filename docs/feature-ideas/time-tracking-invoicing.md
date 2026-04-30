# Time Tracking + Invoicing Feature - Implementation Plan

## Status: ✅ COMPLETED (April 29, 2026)

---

## Market Research

**Source:** Micro-SaaS Ideas Database

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $850 |
| Starting Costs | $1K |
| Solopreneur Score | 87 (high viability) |
| ICP | Freelancers, Consultants, Small business owners |
| Growth Tactics | Word of mouth, SEO |

---

## Overview

Add time tracking functionality that integrates directly with Cashcast's existing invoicing feature (Runway Collect). Freelancers can track billable hours and automatically generate invoices from logged time entries.

**Problem it solves:** Freelancers currently track time in one tool and create invoices in another. This feature unifies the workflow: track time → generate invoice → get paid → see it in cash flow forecast.

---

## Strategic Fit

This feature strengthens Cashcast's value proposition by:

1. **Increasing stickiness** - Daily time tracking creates habitual product usage
2. **Improving invoice accuracy** - Time entries auto-populate invoice line items
3. **Completing the freelancer workflow** - Track work → Invoice → Forecast cash flow
4. **Differentiating from competitors** - Most cash flow tools don't have time tracking

---

## Proposed UI Location

**New page:** `/dashboard/time`

- Add "Time" link to navigation after "Income"
- Time entries can be converted to invoices via Runway Collect
- Dashboard shows "Uninvoiced Hours" as a metric

---

## Core Concepts

### Time Entry
A logged unit of billable (or non-billable) work.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner |
| client_id | UUID | Optional - links to invoice client |
| project_name | VARCHAR(100) | Project/task name |
| description | TEXT | What was done |
| start_time | TIMESTAMPTZ | When work started |
| end_time | TIMESTAMPTZ | When work ended (null if running) |
| duration_minutes | INTEGER | Calculated duration |
| hourly_rate | DECIMAL(10,2) | Rate for this entry |
| is_billable | BOOLEAN | Default true |
| is_invoiced | BOOLEAN | Has this been added to an invoice? |
| invoice_id | UUID | Link to invoice if invoiced |

### Timer States
1. **Stopped** - No active timer, can start new entry
2. **Running** - Timer active, shows elapsed time, can stop
3. **Paused** - Timer paused (stretch goal)

---

## Database Changes

### New Table: `time_entries`

```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES invoice_clients(id) ON DELETE SET NULL,
  project_name VARCHAR(100) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN end_time IS NOT NULL
      THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 60
      ELSE NULL
    END
  ) STORED,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_billable BOOLEAN DEFAULT true,
  is_invoiced BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_client_id ON time_entries(client_id);
CREATE INDEX idx_time_entries_is_invoiced ON time_entries(is_invoiced) WHERE is_invoiced = false;

-- RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own time entries"
  ON time_entries FOR ALL USING (auth.uid() = user_id);
```

### New Table: `user_time_settings`

```sql
CREATE TABLE user_time_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_hourly_rate DECIMAL(10, 2) DEFAULT 0,
  round_to_minutes INTEGER DEFAULT 1, -- 1, 5, 15, 30
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## File Structure

```
app/dashboard/time/
  page.tsx                    # Time entries list + timer
  settings/page.tsx           # Default rate, rounding settings

components/time/
  timer-widget.tsx            # Start/stop timer (persistent header widget)
  time-entry-list.tsx         # List of entries, filterable
  time-entry-row.tsx          # Individual entry row
  time-entry-form.tsx         # Manual entry form
  create-invoice-from-time.tsx # Select entries → generate invoice

lib/time/
  format-duration.ts          # Display helpers (2h 15m, etc.)
  calculate-totals.ts         # Sum hours/earnings for period
```

---

## Integration with Runway Collect (Invoicing)

### Flow: Time Entries → Invoice

1. User selects uninvoiced time entries (filter by client)
2. Clicks "Create Invoice"
3. System generates invoice with line items:
   - Groups by project or lists individual entries
   - Calculates: hours × hourly_rate = line item amount
4. User reviews/edits invoice and sends
5. Time entries marked as `is_invoiced = true`, linked to `invoice_id`

### Modify: Invoice Creation

Add option to "Import from Time Entries" when creating invoice:
- Show uninvoiced entries for selected client
- Auto-populate line items

---

## UI Components

### Timer Widget (Header)
Persistent widget in dashboard header showing:
- Current timer status (running/stopped)
- Project name if running
- Elapsed time (00:45:23)
- Start/Stop button

### Time Page Layout
```
┌─────────────────────────────────────────┐
│ [Start Timer] [Manual Entry]            │
├─────────────────────────────────────────┤
│ Filter: [All Clients ▼] [This Week ▼]   │
│         [x] Uninvoiced only             │
├─────────────────────────────────────────┤
│ □ Project A - Client X    2h 15m   $225 │
│ □ Project B - Client X    1h 30m   $150 │
│ □ Project C - Client Y    4h 00m   $400 │
├─────────────────────────────────────────┤
│ Selected: 3h 45m | $375                 │
│ [Create Invoice from Selected]          │
└─────────────────────────────────────────┘
```

---

## Feature Gating

| Tier | Access |
|------|--------|
| Free | No access (upgrade prompt) |
| Pro | Full access |
| Premium | Full access |

---

## Implementation Sequence

### Phase 1: Database
1. Create `time_entries` table with RLS
2. Create `user_time_settings` table

### Phase 2: Core Time Tracking
3. Create time entry list page
4. Create manual entry form
5. Create timer widget component
6. Add timer to dashboard header

### Phase 3: Invoice Integration
7. Add "Import from Time" to invoice creation
8. Create bulk select + invoice generation flow
9. Mark entries as invoiced when invoice created

### Phase 4: Polish
10. Add filtering (by client, date range, invoiced status)
11. Add time settings page (default rate, rounding)
12. Add "Uninvoiced Hours" to dashboard metrics

---

## Verification Checklist

- [x] Timer starts and stops correctly
- [x] Time entries save with correct duration
- [x] Manual entry form works
- [x] Entries link to clients
- [x] Can filter by client/date/invoiced status
- [x] Can select multiple entries
- [x] Can create invoice from selected entries
- [x] Entries marked as invoiced after invoice creation
- [x] Free users see upgrade prompt
- [x] Timer widget persists across page navigation

---

## Future Enhancements

- Weekly/monthly time reports
- Project-based tracking (group entries under projects)
- Pomodoro timer mode
- Desktop app with idle detection
- Calendar view of time entries
- Recurring time entries (retainer work)
- Team time tracking (multi-user)
