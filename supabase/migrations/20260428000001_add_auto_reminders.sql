-- Migration: Add automated payment reminders support
-- This enables automatic reminder emails based on invoice due dates

-- 1. Add auto-reminders toggle to user_settings (global user preference)
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS auto_reminders_enabled BOOLEAN DEFAULT true;

COMMENT ON COLUMN user_settings.auto_reminders_enabled IS 'Master toggle for automated invoice payment reminders';

-- 2. Add per-invoice override (null = inherit from user settings)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS auto_reminders_enabled BOOLEAN DEFAULT NULL;

COMMENT ON COLUMN invoices.auto_reminders_enabled IS 'Per-invoice auto-reminder toggle (null = inherit from user settings)';

-- 3. Add source column to invoice_reminders to distinguish manual vs auto
ALTER TABLE invoice_reminders
ADD COLUMN IF NOT EXISTS source VARCHAR(10) DEFAULT 'manual';

-- Add check constraint for valid source values
ALTER TABLE invoice_reminders
ADD CONSTRAINT invoice_reminders_source_check CHECK (source IN ('manual', 'auto'));

COMMENT ON COLUMN invoice_reminders.source IS 'Whether reminder was sent manually or by automated cron job';

-- 4. Add reminder_stage to track which auto-reminder stage was sent
ALTER TABLE invoice_reminders
ADD COLUMN IF NOT EXISTS reminder_stage VARCHAR(20);

COMMENT ON COLUMN invoice_reminders.reminder_stage IS 'Stage identifier for auto-reminders (pre_due_3, due_day, overdue_7, overdue_14)';

-- 5. Create unique index to prevent duplicate auto-reminders for the same stage
-- Only applies to auto-reminders (manual reminders can be sent multiple times)
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_reminders_unique_auto_stage
ON invoice_reminders(invoice_id, reminder_stage)
WHERE source = 'auto' AND reminder_stage IS NOT NULL;
