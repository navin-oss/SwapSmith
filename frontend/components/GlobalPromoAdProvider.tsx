'use client'

/**
 * GlobalPromoAdProvider
 * ──────────────────────────────────────────────────────────────────
 * Mounted once in providers.tsx, runs on every page.
 * Shows the 'promo' variant (Connect Wallet / Learning Hub / Rewards)
 * on a 5-minute shared cooldown — skips /terminal (has its own ad).
<<<<<<< HEAD
 * Hidden for Premium and Pro plan users (ad-free benefit).
=======
>>>>>>> 941ae72
 */

import { usePathname } from 'next/navigation'
import FullPageAd from '@/components/FullPageAd'
import { useGlobalPromoAd } from '@/hooks/useAds'
<<<<<<< HEAD
import { usePlan } from '@/hooks/usePlan'
=======
>>>>>>> 941ae72

export default function GlobalPromoAdProvider() {
  const pathname = usePathname()
  const { showAd, dismiss } = useGlobalPromoAd(pathname ?? '')
<<<<<<< HEAD
  const { status: planStatus } = usePlan()

  // Ad-free for Premium and Pro subscribers
  const isAdFree = planStatus?.plan === 'premium' || planStatus?.plan === 'pro'

  if (!showAd || isAdFree) return null
=======

  if (!showAd) return null
>>>>>>> 941ae72

  return (
    <FullPageAd
      variant="promo"
      duration={14000}
      onDismiss={dismiss}
    />
  )
}
