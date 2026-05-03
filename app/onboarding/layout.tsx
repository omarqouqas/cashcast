import type { Metadata } from 'next'

// Prevent search engines from indexing onboarding pages
export const metadata: Metadata = {
  title: 'Get Started | Cashcast',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
