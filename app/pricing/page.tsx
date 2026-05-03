// app/pricing/page.tsx
// ============================================
// Pricing Page with Stripe Checkout Integration
// ============================================

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription } from '@/lib/stripe/subscription';
import PricingSection from '@/components/pricing/pricing-section';
import { pricingSchema, generateFAQSchema } from '@/components/seo/schemas';

export const metadata: Metadata = {
  title: 'Pricing - Free & Pro Plans | Cashcast',
  description: 'Start free with 90-day cash flow forecasting, or upgrade to Pro for 365-day forecasts, unlimited tracking, invoicing, and more. Simple pricing, no hidden fees.',
  keywords: [
    'cashcast pricing',
    'cash flow app pricing',
    'freelancer budgeting app cost',
    'free cash flow calendar',
    'cash flow forecast software pricing',
  ],
  alternates: {
    canonical: 'https://cashcast.money/pricing',
  },
  openGraph: {
    title: 'Pricing - Free & Pro Plans | Cashcast',
    description: 'Start free with 90-day cash flow forecasting. Upgrade to Pro for unlimited features.',
    url: 'https://cashcast.money/pricing',
    siteName: 'Cashcast',
    type: 'website',
  },
};

const pricingFAQs = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! You can cancel your subscription at any time from your account settings. You\'ll keep your Pro features until the end of your billing period.',
  },
  {
    question: 'What happens when I upgrade?',
    answer: 'Your new features activate immediately. We\'ll prorate the cost based on the remaining time in your current billing cycle.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use Stripe for payment processing – they handle billions of dollars annually and are PCI compliant.',
  },
  {
    question: 'What if I need help?',
    answer: 'Free users get 48-hour email support. Pro users get priority 24-hour support. We\'re here to help you succeed.',
  },
];

const faqSchema = generateFAQSchema(pricingFAQs);

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { checkout?: string; error?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let currentSubscription = null;
  if (user) {
    currentSubscription = await getUserSubscription(user.id);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-zinc-950 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free, upgrade when you&apos;re ready.
            </p>
          </div>

          {/* Status Messages */}
          {searchParams.checkout === 'success' && (
            <div className="mb-8 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg text-center">
              <p className="text-teal-400 font-medium">
                Welcome to Pro! Your subscription is now active.
              </p>
            </div>
          )}

          {searchParams.checkout === 'canceled' && (
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
              <p className="text-amber-400">
                Checkout was canceled. No worries – you can try again anytime.
              </p>
            </div>
          )}

          {searchParams.error && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-center">
              <p className="text-rose-400">
                {decodeURIComponent(searchParams.error)}
              </p>
            </div>
          )}

          {/* Pricing Cards */}
          <Suspense fallback={<PricingCardsSkeleton />}>
            <PricingSection
              isLoggedIn={!!user}
              currentTier={currentSubscription?.tier ?? 'free'}
              showHeader={false}
            />
          </Suspense>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <FAQItem
                question="Can I cancel anytime?"
                answer="Yes! You can cancel your subscription at any time from your account settings. You'll keep your Pro features until the end of your billing period."
              />
              <FAQItem
                question="What happens when I upgrade?"
                answer="Your new features activate immediately. We'll prorate the cost based on the remaining time in your current billing cycle."
              />
              <FAQItem
                question="Is my payment information secure?"
                answer="Absolutely. We use Stripe for payment processing – they handle billions of dollars annually and are PCI compliant."
              />
              <FAQItem
                question="What if I need help?"
                answer="Free users get 48-hour email support. Pro users get priority 24-hour support. We're here to help you succeed."
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Cancel anytime • 14-day money-back guarantee • No credit card required for free tier
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
      <h3 className="font-semibold text-white mb-2">{question}</h3>
      <p className="text-zinc-400 text-sm">{answer}</p>
    </div>
  );
}

function PricingCardsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 animate-pulse"
        >
          <div className="h-8 bg-zinc-800 rounded w-24 mb-4" />
          <div className="h-12 bg-zinc-800 rounded w-32 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
