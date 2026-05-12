'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gauge, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  safetyBuffer: z.coerce
    .number({ message: 'Safety buffer must be a valid number' })
    .min(50, 'Safety buffer must be at least 50')
    .multipleOf(50, 'Safety buffer must be a multiple of 50'),
  lowBalanceAlertEnabled: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface SafetyBufferAlertFormProps {
  initialSafetyBuffer?: number;
  initialAlertEnabled?: boolean | null;
  currency?: string;
}

export function SafetyBufferAlertForm({
  initialSafetyBuffer = 500,
  initialAlertEnabled = true,
  currency: initialCurrency = 'USD',
}: SafetyBufferAlertFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currency, setCurrency] = useState(initialCurrency);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safetyBuffer: initialSafetyBuffer,
      lowBalanceAlertEnabled: initialAlertEnabled ?? true,
    },
  });

  const safetyBuffer = watch('safetyBuffer') || initialSafetyBuffer;
  const alertEnabled = watch('lowBalanceAlertEnabled');

  // Calculate thresholds
  const thresholds = {
    safe: safetyBuffer * 2,
    caution: safetyBuffer * 1.5,
    low: safetyBuffer,
  };

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('safety_buffer, currency, low_balance_alert_enabled')
        .eq('user_id', user.id)
        .single();

      if (!fetchError && data) {
        reset({
          safetyBuffer: data.safety_buffer ?? initialSafetyBuffer,
          lowBalanceAlertEnabled: data.low_balance_alert_enabled ?? true,
        });
        if (data.currency) {
          setCurrency(data.currency);
        }
      }

      setIsLoading(false);
    }

    fetchSettings();
  }, [reset, initialSafetyBuffer]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    const { error: upsertError } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        safety_buffer: data.safetyBuffer,
        low_balance_alert_enabled: data.lowBalanceAlertEnabled,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-center py-8">
          <svg
            className="animate-spin h-6 w-6 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Safety Buffer & Alerts</h3>
          <p className="text-sm text-zinc-400">
            Set your minimum balance threshold and alert preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Safety Buffer Input */}
        <div>
          <Label htmlFor="safetyBuffer" className="text-zinc-300">
            Minimum Balance Threshold
          </Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
              {getCurrencySymbol(currency)}
            </span>
            <Controller
              name="safetyBuffer"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="safetyBuffer"
                  placeholder="500"
                  className="pl-12 bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-teal-500"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <FormError message={errors.safetyBuffer?.message} />
          <p className="text-sm text-zinc-500 mt-1.5">
            Calendar days turn yellow/red when balance approaches this threshold
          </p>
        </div>

        {/* Threshold Preview */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
          <p className="text-sm font-medium text-zinc-300 mb-3">
            Calendar Color Thresholds
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Safe</p>
              <p className="text-sm font-semibold text-emerald-400">
                {formatCurrency(thresholds.safe, currency)}+
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Caution</p>
              <p className="text-sm font-semibold text-amber-400">
                {formatCurrency(thresholds.caution, currency)}+
              </p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Low</p>
              <p className="text-sm font-semibold text-orange-400">
                {formatCurrency(thresholds.low, currency)}+
              </p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Danger</p>
              <p className="text-sm font-semibold text-rose-400">
                &lt; {formatCurrency(thresholds.low, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Low Balance Alert Toggle */}
        <div className="border-t border-zinc-800 pt-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm font-medium text-zinc-200">Email Alerts</p>
          </div>

          <div className="flex items-center justify-between py-3 bg-zinc-950 rounded-lg px-4 border border-zinc-800">
            <div>
              <p className="text-zinc-100 font-medium">Low Balance Alerts</p>
              <p className="text-sm text-zinc-500">
                Notify me when balance is projected to drop below {formatCurrency(safetyBuffer, currency)}
              </p>
            </div>

            <Controller
              name="lowBalanceAlertEnabled"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                    field.value ? 'bg-amber-500' : 'bg-zinc-700'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              )}
            />
          </div>

          {alertEnabled && (
            <p className="text-xs text-zinc-500 mt-2 ml-1">
              You&apos;ll receive at most one alert every 3 days to prevent alert fatigue.
            </p>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Settings saved successfully
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
