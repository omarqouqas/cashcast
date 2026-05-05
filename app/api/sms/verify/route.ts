import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyCode } from '@/lib/sms';

export async function POST(request: NextRequest) {
  // Get authenticated user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get code from request body
  let code: string;
  try {
    const body = await request.json();
    code = body.code;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  if (!code || typeof code !== 'string') {
    return NextResponse.json(
      { error: 'Verification code is required' },
      { status: 400 }
    );
  }

  // Clean up code (remove spaces, ensure 6 digits)
  const cleanCode = code.replace(/\s/g, '').slice(0, 6);
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return NextResponse.json(
      { error: 'Invalid code format. Please enter a 6-digit code.' },
      { status: 400 }
    );
  }

  // Verify the code
  const result = await verifyCode(user.id, cleanCode);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Phone number verified successfully',
  });
}
