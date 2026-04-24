# Automated Payment Reminders - Implementation Plan

## Market Research

**Source:** Micro-SaaS Ideas Database (Row 90)

| Metric | Value |
|--------|-------|
| Monthly Revenue Potential | $3,500 |
| Solopreneur Score | 80 |
| ICP | Salespeople, Customer Success, Startup Founders |
| Growth Tactics | Word of mouth, Webinars, Podcasting |

**Pain Point Validation:**
- 47-50% of freelancers experience late payments in first 6 months (Freelancers Union)
- Late/missing payments is a top 3 pain point for our ICP
- Proactive reminders can reduce payment delays by 30-50%

---

## Overview

Automatically send payment reminder emails for invoices created through Runway Collect. Reduces manual follow-up work and accelerates cash flow.

**Problem it solves:** Freelancers forget to follow up on unpaid invoices, or feel awkward doing so. Automated reminders handle this professionally without effort.

---

## Strategic Fit

1. **Reduces payment delays** — Direct impact on cash flow timing
2. **Increases Runway Collect value** — Makes invoicing feature stickier
3. **Low effort** — Leverages existing email infrastructure
4. **Differentiator** — Cash Flow Calendar doesn't have invoicing at all

---

## Proposed UI Location

**Settings:** `/dashboard/settings/invoices` → Reminder Settings section
**Invoice Detail:** Toggle reminders on/off per invoice

---

## Core Concepts

### Reminder Schedule

| Stage | Timing | Subject Line | Tone |
|-------|--------|--------------|------|
| Pre-due | 3 days before | "Friendly reminder: Invoice #123 due soon" | Friendly |
| Due day | Day of | "Invoice #123 is due today" | Neutral |
| Overdue 1 | 7 days after | "Invoice #123 is 7 days overdue" | Firm |
| Overdue 2 | 14 days after | "Invoice #123 is 14 days overdue" | Urgent |
| Final | 30 days after | "Final notice: Invoice #123" | Final |

### User Controls

| Setting | Options | Default |
|---------|---------|---------|
| Enable reminders | On/Off | On |
| Pre-due reminder | On/Off | On |
| Due day reminder | On/Off | On |
| Overdue frequency | 7/14/30 days | 7 days |
| Max reminders | 1-5 | 3 |
| Stop on partial payment | Yes/No | No |

---

## Database Changes

### New Table: `invoice_reminder_settings`

```sql
CREATE TABLE invoice_reminder_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reminders_enabled BOOLEAN DEFAULT true,
  pre_due_enabled BOOLEAN DEFAULT true,
  pre_due_days INTEGER DEFAULT 3,
  due_day_enabled BOOLEAN DEFAULT true,
  overdue_frequency INTEGER DEFAULT 7, -- days between overdue reminders
  max_overdue_reminders INTEGER DEFAULT 3,
  stop_on_partial BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE invoice_reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminder settings"
  ON invoice_reminder_settings FOR ALL USING (auth.uid() = user_id);
```

### New Table: `invoice_reminders_sent`

Track which reminders have been sent to avoid duplicates.

```sql
CREATE TABLE invoice_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL, -- pre_due, due_day, overdue_1, overdue_2, etc.
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_id VARCHAR(100), -- Resend email ID for tracking
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  UNIQUE(invoice_id, reminder_type)
);

CREATE INDEX idx_reminders_invoice ON invoice_reminders_sent(invoice_id);
```

### Modify: `invoices` table

```sql
ALTER TABLE invoices
  ADD COLUMN reminders_enabled BOOLEAN DEFAULT true;
```

---

## File Structure

```
lib/reminders/
├── types.ts              # Reminder types and schedules
├── scheduler.ts          # Determine which reminders to send
├── sender.ts             # Send reminder emails via Resend
└── index.ts              # Exports

components/emails/
└── invoice-reminder.tsx  # React Email template

app/api/cron/invoice-reminders/
└── route.ts              # Vercel cron endpoint (daily)

app/dashboard/settings/invoices/
└── reminder-settings.tsx # User settings UI
```

---

## Reminder Logic

### Daily Cron Job

```typescript
// Runs daily at 9am user's timezone (or UTC fallback)

async function processReminders() {
  // 1. Get all unpaid invoices with reminders enabled
  const invoices = await getUnpaidInvoices();

  for (const invoice of invoices) {
    const settings = await getUserReminderSettings(invoice.user_id);
    if (!settings.reminders_enabled) continue;

    const today = new Date();
    const dueDate = new Date(invoice.due_date);
    const daysDiff = differenceInDays(dueDate, today);

    // Determine which reminder to send
    let reminderType: string | null = null;

    if (daysDiff === settings.pre_due_days && settings.pre_due_enabled) {
      reminderType = 'pre_due';
    } else if (daysDiff === 0 && settings.due_day_enabled) {
      reminderType = 'due_day';
    } else if (daysDiff < 0) {
      // Overdue logic
      const daysOverdue = Math.abs(daysDiff);
      const reminderNumber = Math.floor(daysOverdue / settings.overdue_frequency);

      if (reminderNumber <= settings.max_overdue_reminders) {
        if (daysOverdue % settings.overdue_frequency === 0) {
          reminderType = `overdue_${reminderNumber}`;
        }
      }
    }

    if (reminderType) {
      // Check if already sent
      const alreadySent = await checkReminderSent(invoice.id, reminderType);
      if (!alreadySent) {
        await sendReminder(invoice, reminderType);
        await recordReminderSent(invoice.id, reminderType);
      }
    }
  }
}
```

---

## Email Templates

### Pre-Due Reminder

```
Subject: Friendly reminder: Invoice #INV-001 due in 3 days

Hi [Client Name],

Just a friendly reminder that invoice #INV-001 for $2,500.00
is due on [Due Date].

[View Invoice Button]

If you have any questions, please don't hesitate to reach out.

Best,
[Your Name]
```

### Overdue Reminder

```
Subject: Invoice #INV-001 is 7 days overdue

Hi [Client Name],

I wanted to follow up on invoice #INV-001 for $2,500.00,
which was due on [Due Date].

[View & Pay Invoice Button]

If you've already sent payment, please disregard this message.
Otherwise, I'd appreciate your attention to this matter.

Best,
[Your Name]
```

---

## Feature Gating

| Tier | Access |
|------|--------|
| Free | No access (upgrade prompt) |
| Pro | Full access |
| Premium | Full access |
| Lifetime | Full access |

---

## Implementation Sequence

### Phase 1: Core Infrastructure (Day 1)
1. Create database tables
2. Create reminder settings schema
3. Add `reminders_enabled` to invoices table

### Phase 2: Scheduler & Sender (Day 2)
4. Build reminder scheduler logic
5. Create email templates (React Email)
6. Integrate with Resend for sending
7. Set up Vercel cron job

### Phase 3: User Settings (Day 3)
8. Create reminder settings UI
9. Add per-invoice toggle
10. Add "Reminders" section to invoice detail page

### Phase 4: Polish
11. Add email open/click tracking
12. Add reminder history to invoice detail
13. Add "Pause all reminders" emergency toggle

---

## Verification Checklist

- [ ] Pre-due reminders send 3 days before
- [ ] Due day reminders send on due date
- [ ] Overdue reminders follow configured frequency
- [ ] Reminders stop after max count reached
- [ ] Reminders stop when invoice is paid
- [ ] Per-invoice toggle works
- [ ] User can disable all reminders globally
- [ ] Duplicate reminders are prevented
- [ ] Free users see upgrade prompt
- [ ] Email templates render correctly

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Average days to payment | Reduce by 20% |
| Invoices paid on time | Increase by 15% |
| User engagement with reminders | 70% of Pro users enable |

---

## Future Enhancements

- SMS reminders for overdue invoices
- Custom reminder templates
- A/B testing reminder timing
- AI-optimized send times based on client behavior
- Pause reminders for specific clients
- Integration with payment risk scoring (prioritize high-risk)
