import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVerificationCode } from '@/lib/sms';
import { isTwilioConfigured } from '@/lib/sms';

export async function POST(request: NextRequest) {
  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    return NextResponse.json(
      { error: 'SMS service is not configured' },
      { status: 503 }
    );
  }

  // Get authenticated user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get phone number from request body
  let phoneNumber: string;
  try {
    const body = await request.json();
    phoneNumber = body.phoneNumber;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return NextResponse.json(
      { error: 'Phone number is required' },
      { status: 400 }
    );
  }

  // Send verification code
  const result = await sendVerificationCode(user.id, phoneNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Verification code sent',
    expiresAt: result.expiresAt?.toISOString(),
  });
}
