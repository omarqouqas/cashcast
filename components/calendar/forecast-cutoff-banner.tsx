'use client'

import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { trackFeatureGateHit, trackPricingPageViewed } from '@/lib/posthog/events'
import { useEffect, useRef } from 'react'

interface ForecastCutoffBannerProps {
  forecastDays?: number
}

/**
 * ForecastCutoffBanner - Shows at the end of the calendar for free tier users
 *
 * Only displays when forecastDays === 90 (free tier limit).
 * Provides a contextual upsell to extend forecast to 365 days with Pro.
 */
export function ForecastCutoffBanner({ forecastDays }: ForecastCutoffBannerProps) {
  const trackedRef = useRef(false)

  // Only show for free tier (90 days)
  const isFreeTier = forecastDays === 90

  // Track when banner is viewed
  useEffect(() => {
    if (isFreeTier && !trackedRef.current) {
      trackedRef.current = true
      trackFeatureGateHit('forecast_cutoff_banner')
    }
  }, [isFreeTier])

  if (!isFreeTier) return null

  const handleClick = () => {
    trackPricingPageViewed('feature_gate')
  }

  return (
    <div className="mx-4 mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-200">
            You're seeing 90 days
          </h3>
          <p className="text-sm text-amber-200/80 mt-0.5">
            Extend your forecast to a full year with Pro
          </p>
          <Link
            href="/pricing"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            See 365 days ahead
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
