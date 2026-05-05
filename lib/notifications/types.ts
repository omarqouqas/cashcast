/**
 * Notification system types
 */

export type NotificationChannel = 'email' | 'sms' | 'push';

export type AlertType = 'cash_crunch' | 'invoice_overdue' | 'bill_collision';

export type NotificationPriority = 'critical' | 'warning' | 'info';

export type NotificationPayload = {
  type: AlertType;
  title: string;
  body: string;
  actionUrl?: string;
  priority: NotificationPriority;
  metadata?: Record<string, unknown>;
};

export type NotificationResult = {
  channel: NotificationChannel;
  success: boolean;
  error?: string;
};

export type SendNotificationResult = {
  sent: NotificationResult[];
  skipped: NotificationChannel[];
};

export type ChannelPreferences = {
  channels: {
    [key in AlertType]?: NotificationChannel[];
  };
};

// Default channel preferences - SMS only for critical alerts
export const DEFAULT_CHANNEL_PREFERENCES: ChannelPreferences = {
  channels: {
    cash_crunch: ['email'],      // SMS can be added by user
    invoice_overdue: ['email'],
    bill_collision: ['email'],
  },
};

// Which alert types allow SMS (critical only)
export const SMS_ALLOWED_ALERT_TYPES: AlertType[] = ['cash_crunch'];
