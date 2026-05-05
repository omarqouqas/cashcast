/**
 * Web Push notification types
 */

export type PushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type PushPayload = {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  actionUrl?: string;
  tag?: string;
};

export type PushResult = {
  success: boolean;
  error?: string;
};
