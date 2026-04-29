'use server';

import { createClient } from '@/lib/supabase/server';
import { captureServerEvent } from '@/lib/posthog/server';
import { canUseInvoicing } from '@/lib/stripe/subscription';

export async function updateAutoReminderSettings(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user has Pro subscription (auto-reminders is a Pro feature)
    const hasAccess = await canUseInvoicing(user.id);
    if (!hasAccess) {
      return { success: false, error: 'Auto-reminders requires a Pro subscription' };
    }

    const autoRemindersEnabled = formData.get('autoRemindersEnabled') === 'true';

    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          auto_reminders_enabled: autoRemindersEnabled,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to update auto-reminder settings:', dbError);
      return { success: false, error: 'Failed to save settings' };
    }

    await captureServerEvent('auto_reminder_settings_updated', {
      distinctId: user.id,
      properties: {
        auto_reminders_enabled: autoRemindersEnabled,
      },
    });

    return { success: true };
  } catch (err) {
    console.error('updateAutoReminderSettings error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
