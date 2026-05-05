-- Add SMS and Push notification channels to user_settings
-- Builds on existing notification_preferences JSONB field for channel routing

-- SMS settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS sms_alerts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS phone_verification_expires_at TIMESTAMPTZ;

-- Push notification settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS push_alerts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS push_subscription JSONB;

-- Add comment explaining the notification_preferences structure
COMMENT ON COLUMN user_settings.notification_preferences IS 'Channel preferences per alert type. Structure: {"channels": {"cash_crunch": ["email", "sms", "push"], "invoice_overdue": ["email", "push"], "bill_collision": ["email"]}}';

-- Index for finding users with SMS enabled (for cron job efficiency)
CREATE INDEX IF NOT EXISTS idx_user_settings_sms_enabled
ON user_settings (user_id)
WHERE sms_alerts_enabled = true AND phone_verified = true;

-- Index for finding users with push enabled
CREATE INDEX IF NOT EXISTS idx_user_settings_push_enabled
ON user_settings (user_id)
WHERE push_alerts_enabled = true AND push_subscription IS NOT NULL;
