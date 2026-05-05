# SMS/Push Low Balance Alerts

**Status:** ✅ Implemented
**Date:** May 4, 2026
**Priority:** 8 (from roadmap)

---

## Overview

Multi-channel notification system that sends critical alerts via SMS and Web Push in addition to email. Users can receive immediate notifications when their balance is projected to drop below their safety buffer.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Daily Cron Job (9 AM UTC)                                      │
│  app/api/cron/low-balance-alerts/route.ts                       │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ Generate 7-day  │                                            │
│  │ cash forecast   │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐     No low balance                         │
│  │ Balance < Safety├────────────────────► Skip user             │
│  │ Buffer?         │                                            │
│  └────────┬────────┘                                            │
│           │ Yes                                                 │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Send Email      │ ◄── Always sent (existing logic)          │
│  │ (Resend)        │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────┐                        │
│  │ sendAdditionalAlertChannels()       │                        │
│  │ lib/email/send-low-balance-alert.ts │                        │
│  └────────┬───────────────┬────────────┘                        │
│           │               │                                     │
│     ┌─────▼─────┐   ┌─────▼─────┐                               │
│     │ SMS       │   │ Push      │                               │
│     │ Enabled?  │   │ Enabled?  │                               │
│     └─────┬─────┘   └─────┬─────┘                               │
│           │               │                                     │
│     ┌─────▼─────┐   ┌─────▼─────┐                               │
│     │ Twilio    │   │ Web Push  │                               │
│     │ SMS API   │   │ API       │                               │
│     └───────────┘   └───────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Channel Details

### Email (Default)
- **Provider:** Resend
- **Cost:** ~$0.001/message
- **Use case:** All notifications (always enabled)
- **Existing:** Was already implemented

### SMS (Critical Only)
- **Provider:** Twilio
- **Cost:** ~$0.0075/message (US)
- **Use case:** Cash crunch warnings only
- **Requires:** Phone verification (6-digit code)

### Web Push (All Alerts)
- **Provider:** Web Push API (browser-native)
- **Cost:** Free
- **Use case:** All alert types
- **Requires:** Browser permission + service worker

---

## Database Schema

Migration: `supabase/migrations/20260504000003_add_notification_channels.sql`

```sql
-- Added to user_settings table:

-- SMS settings
sms_alerts_enabled BOOLEAN DEFAULT false,
phone_number VARCHAR(20),
phone_verified BOOLEAN DEFAULT false,
phone_verification_code VARCHAR(6),
phone_verification_expires_at TIMESTAMPTZ,

-- Push settings
push_alerts_enabled BOOLEAN DEFAULT false,
push_subscription JSONB

-- Indexes for cron job efficiency
CREATE INDEX idx_user_settings_sms_enabled ON user_settings (user_id)
  WHERE sms_alerts_enabled = true AND phone_verified = true;

CREATE INDEX idx_user_settings_push_enabled ON user_settings (user_id)
  WHERE push_alerts_enabled = true AND push_subscription IS NOT NULL;
```

---

## File Structure

```
lib/sms/
├── types.ts              # SMSResult, PhoneVerificationResult types
├── twilio.ts             # Twilio client initialization
├── send-sms.ts           # sendSMS(), sendLowBalanceAlertSMS()
├── verify-phone.ts       # sendVerificationCode(), verifyCode()
└── index.ts              # Re-exports

lib/push/
├── types.ts              # PushSubscription, PushPayload types
├── vapid.ts              # VAPID key configuration
├── send-push.ts          # sendPushNotification(), sendLowBalanceAlertPush()
├── subscribe.ts          # savePushSubscription(), removePushSubscription()
└── index.ts              # Re-exports

lib/notifications/
├── types.ts              # NotificationChannel, AlertType, NotificationPayload
├── router.ts             # sendNotification(), sendCashCrunchNotification()
└── index.ts              # Re-exports

app/api/sms/
├── send-verification/route.ts   # POST - Send 6-digit code
└── verify/route.ts              # POST - Verify code

app/api/push/
└── subscribe/route.ts           # GET (VAPID key), POST (save), DELETE (remove)

public/sw.js                     # Service worker for push notifications

components/settings/
└── notification-channels-form.tsx  # Settings UI
```

---

## Phone Verification Flow

```
┌──────────────────────────────────────────────────────────────┐
│                 PHONE VERIFICATION FLOW                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User enters phone number in Settings                     │
│     ┌─────────────────────────────────┐                      │
│     │ +1 (555) 123-4567    [Verify]   │                      │
│     └─────────────────────────────────┘                      │
│                    │                                         │
│                    ▼                                         │
│  2. POST /api/sms/send-verification                          │
│     - Format to E.164: +15551234567                          │
│     - Generate 6-digit code                                  │
│     - Save code + expiry (10 min) to DB                      │
│     - Send SMS via Twilio                                    │
│                    │                                         │
│                    ▼                                         │
│  3. User receives SMS                                        │
│     "Your CashCast verification code is: 123456.             │
│      This code expires in 10 minutes."                       │
│                    │                                         │
│                    ▼                                         │
│  4. User enters code                                         │
│     ┌─────────────────────────────────┐                      │
│     │ [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ]  [Confirm]        │
│     └─────────────────────────────────┘                      │
│                    │                                         │
│                    ▼                                         │
│  5. POST /api/sms/verify                                     │
│     - Check code matches                                     │
│     - Check not expired                                      │
│     - Set phone_verified = true                              │
│     - Set sms_alerts_enabled = true                          │
│     - Clear verification code                                │
│                    │                                         │
│                    ▼                                         │
│  6. Success! SMS alerts now enabled                          │
│     ┌─────────────────────────────────┐                      │
│     │ ✓ +15551234567        [Enabled] │                      │
│     └─────────────────────────────────┘                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Push Notification Flow

```
┌──────────────────────────────────────────────────────────────┐
│               PUSH SUBSCRIPTION FLOW                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User clicks "Enable Push Notifications" in Settings      │
│                    │                                         │
│                    ▼                                         │
│  2. Browser requests permission                              │
│     ┌─────────────────────────────────────┐                  │
│     │ cashcast.money wants to             │                  │
│     │ show notifications                  │                  │
│     │                                     │                  │
│     │    [Block]  [Allow]                 │                  │
│     └─────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼ (if allowed)                            │
│  3. Register service worker (public/sw.js)                   │
│                    │                                         │
│                    ▼                                         │
│  4. GET /api/push/subscribe → VAPID public key               │
│                    │                                         │
│                    ▼                                         │
│  5. Subscribe via pushManager.subscribe()                    │
│     Returns: { endpoint, keys: { p256dh, auth } }            │
│                    │                                         │
│                    ▼                                         │
│  6. POST /api/push/subscribe                                 │
│     - Save subscription to user_settings.push_subscription   │
│     - Set push_alerts_enabled = true                         │
│                    │                                         │
│                    ▼                                         │
│  7. Success! Push notifications enabled                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Service Worker (public/sw.js)

```javascript
// Listen for push events
self.addEventListener('push', (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag,           // e.g., 'cashcast-cash_crunch'
    data: { url: data.actionUrl }
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open dashboard or focus existing tab
  clients.openWindow(event.notification.data.url);
});
```

---

## Alert Types & Channels

| Alert Type | Email | SMS | Push | Priority |
|------------|-------|-----|------|----------|
| Cash Crunch | ✅ | ✅ | ✅ | Critical |
| Invoice Overdue | ✅ | ❌ | ✅ | Warning |
| Bill Collision | ✅ | ❌ | ❌ | Info |

**Design Decision:** SMS is reserved for critical alerts only (cash crunch) to avoid alert fatigue and minimize costs.

---

## Environment Variables

```bash
# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Web Push (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BPxxxxx  # Public (client-side)
VAPID_PRIVATE_KEY=xxxxx               # Private (server-side)
VAPID_SUBJECT=mailto:support@cashcast.io
```

**Generate VAPID Keys:**
```bash
npx web-push generate-vapid-keys
```

---

## Notification Message Examples

### SMS Alert
```
CashCast Alert: Your balance will drop to $250.00 in 3 days.
View details at cashcast.io/dashboard
```

### Push Notification
```
Title: Low Balance Alert
Body: Your balance will drop to $250.00 in 3 days
Action: Opens /dashboard
```

---

## Settings UI

Location: `components/settings/notification-channels-form.tsx`

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 Notification Channels                                   │
│  Choose how you want to receive critical alerts             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 SMS Alerts                              [Verified]      │
│  Receive SMS for critical alerts like cash crunch warnings. │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✓ +15551234567                    Enabled [toggle] │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📲 Push Notifications                        [Active]      │
│  Receive browser notifications for all alert types.        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✓ Push notifications enabled         [Disable]     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ℹ️ SMS is reserved for critical alerts only (cash crunch  │
│  warnings) to avoid alert fatigue.                          │
│                                                             │
│  Push notifications can be enabled for all alert types      │
│  including invoice reminders and bill collisions.           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Analysis

| Channel | Cost/Message | 100 Users × 2 Alerts/Week |
|---------|--------------|---------------------------|
| Email | ~$0.001 | $0.80/month |
| SMS | ~$0.0075 | $6.00/month |
| Push | Free | $0.00/month |

**Total estimated:** ~$7/month for 100 active users

---

## Testing Checklist

- [ ] Phone verification: Send code, verify code, expiry handling
- [ ] Push subscription: Permission request, service worker registration
- [ ] Low balance trigger: Cron job sends to all enabled channels
- [ ] Settings UI: Toggles work, states persist
- [ ] Error handling: Invalid phone, expired code, push permission denied

---

## Future Enhancements

1. **Channel preferences per alert type** - Let users choose channels for each alert
2. **Quiet hours** - Don't send SMS between 10 PM - 8 AM user's timezone
3. **Invoice overdue SMS** - Expand SMS to other critical alerts
4. **Rate limiting** - Max 1 SMS per alert type per day
