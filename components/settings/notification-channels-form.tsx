'use client';

import { useState, useTransition, useEffect } from 'react';
import { Bell, Phone, Smartphone, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

type Props = {
  initialPhoneNumber?: string | null;
  initialPhoneVerified?: boolean;
  initialSmsEnabled?: boolean;
  initialPushEnabled?: boolean;
  initialPushSubscribed?: boolean;
};

export function NotificationChannelsForm({
  initialPhoneNumber,
  initialPhoneVerified = false,
  initialSmsEnabled = false,
  initialPushEnabled = false,
  initialPushSubscribed = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // SMS state
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [phoneVerified, setPhoneVerified] = useState(initialPhoneVerified);
  const [smsEnabled, setSmsEnabled] = useState(initialSmsEnabled);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'sent' | 'verifying'>('idle');
  const [verificationCode, setVerificationCode] = useState('');

  // Push state
  const [, setPushEnabled] = useState(initialPushEnabled);
  const [pushSubscribed, setPushSubscribed] = useState(initialPushSubscribed);
  const [pushSupported, setPushSupported] = useState(false);

  // Check if push notifications are supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
    }
  }, []);

  // Send verification code
  async function sendVerificationCode() {
    setError(null);
    setSuccess(null);

    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    try {
      const res = await fetch('/api/sms/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send verification code');
        return;
      }

      setVerificationStep('sent');
      setSuccess('Verification code sent! Check your phone.');
    } catch {
      setError('Failed to send verification code');
    }
  }

  // Verify the code
  async function verifyCode() {
    setError(null);
    setSuccess(null);

    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setVerificationStep('verifying');

    try {
      const res = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid verification code');
        setVerificationStep('sent');
        return;
      }

      setPhoneVerified(true);
      setSmsEnabled(true);
      setVerificationStep('idle');
      setVerificationCode('');
      setSuccess('Phone number verified! SMS alerts enabled.');
    } catch {
      setError('Failed to verify code');
      setVerificationStep('sent');
    }
  }

  // Enable push notifications
  async function enablePushNotifications() {
    setError(null);
    setSuccess(null);

    if (!pushSupported) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied');
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');

      // Get VAPID public key
      const keyRes = await fetch('/api/push/subscribe');
      const { publicKey } = await keyRes.json();

      if (!publicKey) {
        setError('Push notifications are not configured');
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      // Save subscription to server
      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: arrayBufferToBase64(subscription.getKey('auth')!),
            },
          },
        }),
      });

      if (!saveRes.ok) {
        throw new Error('Failed to save subscription');
      }

      setPushEnabled(true);
      setPushSubscribed(true);
      setSuccess('Push notifications enabled!');
    } catch (err) {
      console.error('Push notification error:', err);
      setError('Failed to enable push notifications');
    }
  }

  // Disable push notifications
  async function disablePushNotifications() {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/push/subscribe', { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to disable push notifications');
      }

      setPushEnabled(false);
      setPushSubscribed(false);
      setSuccess('Push notifications disabled');
    } catch {
      setError('Failed to disable push notifications');
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Notification Channels</h3>
          <p className="text-sm text-zinc-400">
            Choose how you want to receive critical alerts
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* SMS Section */}
        <div className="border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-zinc-400" />
            <h4 className="font-medium text-zinc-100">SMS Alerts</h4>
            {phoneVerified && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            Receive SMS for critical alerts like cash crunch warnings. Standard messaging rates apply.
          </p>

          {!phoneVerified ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  disabled={verificationStep !== 'idle'}
                />
                {verificationStep === 'idle' && (
                  <Button
                    type="button"
                    onClick={() => startTransition(sendVerificationCode)}
                    disabled={isPending || !phoneNumber.trim()}
                  >
                    Verify
                  </Button>
                )}
              </div>

              {verificationStep !== 'idle' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-center tracking-widest"
                    maxLength={6}
                    disabled={verificationStep === 'verifying'}
                  />
                  <Button
                    type="button"
                    onClick={() => startTransition(verifyCode)}
                    disabled={isPending || verificationCode.length !== 6 || verificationStep === 'verifying'}
                  >
                    {verificationStep === 'verifying' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setVerificationStep('idle');
                      setVerificationCode('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300">{phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm',
                  smsEnabled ? 'text-emerald-400' : 'text-zinc-500'
                )}>
                  {smsEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={smsEnabled}
                  onClick={() => setSmsEnabled((v) => !v)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    smsEnabled ? 'bg-teal-500' : 'bg-zinc-700'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      smsEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Push Notifications Section */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="w-5 h-5 text-zinc-400" />
            <h4 className="font-medium text-zinc-100">Push Notifications</h4>
            {pushSubscribed && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            Receive browser notifications for all alert types. Works even when the app is closed.
          </p>

          {!pushSupported ? (
            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm text-zinc-400">
              Push notifications are not supported in this browser.
            </div>
          ) : !pushSubscribed ? (
            <Button
              type="button"
              onClick={() => startTransition(enablePushNotifications)}
              disabled={isPending}
            >
              Enable Push Notifications
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300">Push notifications enabled</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => startTransition(disablePushNotifications)}
                disabled={isPending}
                className="text-zinc-400 hover:text-zinc-300"
              >
                Disable
              </Button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          <p>
            <strong className="text-zinc-300">SMS</strong> is reserved for critical alerts only (cash crunch warnings) to avoid alert fatigue.
          </p>
          <p className="mt-2">
            <strong className="text-zinc-300">Push notifications</strong> can be enabled for all alert types including invoice reminders and bill collisions.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions for Web Push
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return window.btoa(binary);
}
