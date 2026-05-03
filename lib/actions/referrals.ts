'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateReferralCode, sanitizeReferralCode } from '@/lib/referrals'
import type { ReferralStats, ReferralCodeResult } from '@/lib/referrals'

// Note: The 'referrals' table and 'referred_by_code' column are added via migration.
// After applying the migration, regenerate Supabase types with:
// npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
// Until then, we use type assertions to work around TypeScript errors.

/**
 * Get or create a referral code for the current user.
 * Each user has exactly one referral code.
 */
export async function getOrCreateReferralCode(): Promise<
  { success: true; data: ReferralCodeResult } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check for existing code (where this user is referrer and no referee yet = template row)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('referrals')
      .select('referral_code')
      .eq('referrer_id', user.id)
      .is('referee_id', null)
      .single() as { data: { referral_code: string } | null }

    if (existing?.referral_code) {
      return { success: true, data: { code: existing.referral_code, isNew: false } }
    }

    // Generate new code with collision handling
    let code = generateReferralCode()
    let attempts = 0

    while (attempts < 5) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referral_code: code,
          status: 'pending',
        })

      if (!error) {
        return { success: true, data: { code, isNew: true } }
      }

      // Check if it's a unique constraint violation
      if (error.code === '23505') {
        code = generateReferralCode()
        attempts++
      } else {
        console.error('Error creating referral code:', error)
        return { success: false, error: 'Failed to generate code' }
      }
    }

    return { success: false, error: 'Failed to generate unique code after multiple attempts' }
  } catch (error) {
    console.error('Error in getOrCreateReferralCode:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get referral statistics for the current user.
 */
export async function getReferralStats(): Promise<
  { success: true; data: ReferralStats } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get the user's referral code
    const codeResult = await getOrCreateReferralCode()
    if (!codeResult.success) {
      return { success: false, error: codeResult.error }
    }

    // Get all referrals where this user is the referrer (excluding the template row)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referrals, error } = await (supabase as any)
      .from('referrals')
      .select('status, reward_given')
      .eq('referrer_id', user.id)
      .not('referee_id', 'is', null) as { data: Array<{ status: string; reward_given: boolean }> | null; error: any }

    if (error) {
      console.error('Error fetching referral stats:', error)
      return { success: false, error: 'Failed to fetch referral stats' }
    }

    const stats: ReferralStats = {
      code: codeResult.data.code,
      totalReferred: referrals?.length ?? 0,
      signedUp: referrals?.filter((r: { status: string }) => r.status === 'signed_up').length ?? 0,
      converted: referrals?.filter((r: { status: string }) => r.status === 'converted' || r.status === 'rewarded').length ?? 0,
      rewarded: referrals?.filter((r: { status: string }) => r.status === 'rewarded').length ?? 0,
      pendingRewards: referrals?.filter((r: { status: string; reward_given: boolean }) => r.status === 'converted' && !r.reward_given).length ?? 0,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error in getReferralStats:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Validate a referral code and get the referrer info.
 * Used to show referral info on signup page.
 */
export async function validateReferralCode(code: string): Promise<
  { success: true; data: { valid: boolean; referrerName?: string } } | { success: false; error: string }
> {
  try {
    const sanitized = sanitizeReferralCode(code)

    if (sanitized.length !== 8) {
      return { success: true, data: { valid: false } }
    }

    const supabase = await createClient()

    // Find the referral code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referral } = await (supabase as any)
      .from('referrals')
      .select('referrer_id')
      .eq('referral_code', sanitized)
      .is('referee_id', null)
      .single() as { data: { referrer_id: string } | null }

    if (!referral) {
      return { success: true, data: { valid: false } }
    }

    // Get referrer's name (optional, for personalization)
    const { data: referrer } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', referral.referrer_id)
      .single()

    return {
      success: true,
      data: {
        valid: true,
        referrerName: referrer?.full_name ?? undefined,
      },
    }
  } catch (error) {
    console.error('Error in validateReferralCode:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Claim a referral code for the current user (called after signup).
 * Creates the referral relationship and marks as signed_up.
 */
export async function claimReferralCode(code: string): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const sanitized = sanitizeReferralCode(code)

    if (sanitized.length !== 8) {
      return { success: false, error: 'Invalid referral code' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user already used a referral code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settings } = await (supabase as any)
      .from('user_settings')
      .select('referred_by_code')
      .eq('user_id', user.id)
      .single() as { data: { referred_by_code: string | null } | null }

    if (settings?.referred_by_code) {
      return { success: false, error: 'You have already used a referral code' }
    }

    // Find the referral code and get referrer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referral } = await (supabase as any)
      .from('referrals')
      .select('id, referrer_id')
      .eq('referral_code', sanitized)
      .is('referee_id', null)
      .single() as { data: { id: string; referrer_id: string } | null }

    if (!referral) {
      return { success: false, error: 'Invalid or expired referral code' }
    }

    // Can't use your own code
    if (referral.referrer_id === user.id) {
      return { success: false, error: 'You cannot use your own referral code' }
    }

    // Create the referral relationship
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from('referrals')
      .insert({
        referrer_id: referral.referrer_id,
        referee_id: user.id,
        referral_code: sanitized,
        status: 'signed_up',
        signed_up_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Error creating referral:', insertError)
      return { success: false, error: 'Failed to claim referral code' }
    }

    // Store on user_settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('user_settings')
      .upsert({
        user_id: user.id,
        referred_by_code: sanitized,
      }, { onConflict: 'user_id' })

    if (updateError) {
      console.error('Error updating user settings:', updateError)
      // Non-fatal, the referral was still created
    }

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error in claimReferralCode:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
