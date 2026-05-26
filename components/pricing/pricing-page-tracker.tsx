// components/pricing/pricing-page-tracker.tsx
// ============================================
// Client component to track pricing page views
// ============================================

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPricingPageViewed } from '@/lib/posthog/events';

export function PricingPageTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Determine source from query params or referrer
    let source: 'feature_gate' | 'nav' | 'banner' | 'settings' | 'direct' = 'direct';

    const sourceParam = searchParams.get('source');
    if (sourceParam === 'feature_gate' || sourceParam === 'nav' || sourceParam === 'banner' || sourceParam === 'settings') {
      source = sourceParam;
    } else if (typeof document !== 'undefined') {
      // Check referrer for hints
      const referrer = document.referrer;
      if (referrer.includes('/dashboard/settings')) {
        source = 'settings';
      } else if (referrer.includes('/dashboard')) {
        source = 'nav';
      }
    }

    trackPricingPageViewed(source);
  }, [searchParams]);

  return null;
}
