import { NextResponse } from 'next/server'
import { claimReferralCode } from '@/lib/actions/referrals'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    const result = await claimReferralCode(code)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in referral claim API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
