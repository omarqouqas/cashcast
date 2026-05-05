import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { savePushSubscription, removePushSubscription } from '@/lib/push';
import { isWebPushConfigured, getPublicVapidKey } from '@/lib/push';
import type { PushSubscription } from '@/lib/push';

// GET - Return public VAPID key for client-side subscription
export async function GET() {
  if (!isWebPushConfigured()) {
    return NextResponse.json(
      { error: 'Push notifications are not configured' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    publicKey: getPublicVapidKey(),
  });
}

// POST - Save push subscription
export async function POST(request: NextRequest) {
  if (!isWebPushConfigured()) {
    return NextResponse.json(
      { error: 'Push notifications are not configured' },
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

  // Get subscription from request body
  let subscription: PushSubscription;
  try {
    const body = await request.json();
    subscription = body.subscription;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json(
      { error: 'Invalid subscription format' },
      { status: 400 }
    );
  }

  // Save subscription
  const result = await savePushSubscription(user.id, subscription);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Push subscription saved',
  });
}

// DELETE - Remove push subscription
export async function DELETE(_request: NextRequest) {
  // Get authenticated user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Remove subscription
  const result = await removePushSubscription(user.id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Push subscription removed',
  });
}
