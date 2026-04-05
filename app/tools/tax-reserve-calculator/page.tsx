import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { TaxCalculator } from '@/components/tools/tax-calculator';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { PiggyBank, Calculator, Shield, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelance Tax Reserve Calculator - How Much to Set Aside | Cashcast',
  description:
    'Free tax calculator for freelancers and self-employed. Calculate your tax reserve for US or Canada, including self-employment tax, GST/HST, CPP, and quarterly estimated payments.',
  keywords: [
    'freelance tax calculator',
    'self-employed tax calculator',
    'tax reserve calculator',
    'quarterly tax calculator',
    'self-employment tax calculator',
    'HST calculator Canada',
    'GST calculator freelancer',
    'CPP self-employed calculator',
    'estimated tax calculator',
    'freelancer tax withholding',
    'how much tax freelancer',
    '1099 tax calculator',
  ],
  alternates: {
    canonical: 'https://cashcast.money/tools/tax-reserve-calculator',
  },
  openGraph: {
    title: 'Freelance Tax Reserve Calculator - Know Your Safe to Spend',
    description: 'Stop guessing how much to set aside for taxes. Calculate your tax reserve for US or Canada with our free tool.',
    url: 'https://cashcast.money/tools/tax-reserve-calculator',
    siteName: 'Cashcast',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Tax Reserve Calculator',
    description: 'Free calculator to figure out how much to set aside for taxes as a freelancer.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Freelance Tax Reserve Calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://cashcast.money/tools/tax-reserve-calculator',
  description: 'Calculate how much to set aside for taxes as a freelancer or self-employed professional.',
} as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much should freelancers set aside for taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most freelancers should set aside 25-30% of their net income for taxes. This covers self-employment tax (15.3% in the US) plus federal and state income taxes. In Canada, you need to account for CPP contributions, income tax, and potentially GST/HST. Use our calculator for a precise estimate based on your income.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is self-employment tax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Self-employment tax is the Social Security and Medicare taxes that self-employed individuals pay. In the US, it is 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of net self-employment income. Employees only pay half because employers pay the other half, but freelancers pay both portions.',
      },
    },
    {
      '@type': 'Question',
      name: 'When do freelancers pay quarterly taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In the US, quarterly estimated taxes are due April 15, June 15, September 15, and January 15. In Canada, tax installments are due March 15, June 15, September 15, and December 15. You generally need to pay quarterly if you expect to owe more than $1,000 (US) or $3,000 (Canada) in taxes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the GST/HST threshold in Canada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Canada, you must register for GST/HST once your gross revenue exceeds $30,000 in four consecutive calendar quarters. After registering, you must charge HST (13% in Ontario) on your invoices and remit it to the CRA. This money belongs to the government, not you—so never spend it as income.',
      },
    },
  ],
} as const;

const faqs = [
  {
    question: 'How much should freelancers set aside for taxes?',
    answer: 'Most freelancers should set aside 25-30% of net income. This covers self-employment tax (15.3% in US) plus federal and state income taxes. Use our calculator for a precise estimate.',
  },
  {
    question: 'What is self-employment tax?',
    answer: 'Self-employment tax covers Social Security and Medicare. In the US, it\'s 15.3% of net income. Employees pay half while employers pay the other half—freelancers pay both portions.',
  },
  {
    question: 'When do freelancers pay quarterly taxes?',
    answer: 'US: April 15, June 15, September 15, January 15. Canada: March 15, June 15, September 15, December 15. Pay quarterly if you expect to owe more than $1,000 (US) or $3,000 (Canada).',
  },
  {
    question: 'What is the GST/HST threshold in Canada?',
    answer: 'You must register once gross revenue exceeds $30,000 in four consecutive quarters. Then you charge HST (13% in Ontario) on invoices and remit to CRA. This money belongs to the government.',
  },
];

export default function TaxReserveCalculatorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center',
        }}
      />

      <LandingHeader />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              breadcrumbs.home,
              breadcrumbs.tools,
              { name: 'Tax Reserve Calculator', url: 'https://cashcast.money/tools/tax-reserve-calculator' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <PiggyBank className="h-4 w-4 text-teal-400" />
              <span>Free tool • US & Canada</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Tax Reserve Calculator
            </h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Stop guessing how much to set aside for taxes. See your true &quot;Safe to Spend&quot; after
              accounting for self-employment tax, income tax, and GST/HST.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Calculator className="h-4 w-4 text-teal-300" />
                  US & Canada
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  Supports US self-employment tax and Canadian CPP/GST/HST.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <PiggyBank className="h-4 w-4 text-teal-300" />
                  Safe to Spend
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  See exactly how much is yours after setting aside taxes.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Shield className="h-4 w-4 text-teal-300" />
                  No surprises
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  Know your quarterly payment before the deadline hits.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <TaxCalculator />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Disclaimer: This calculator provides estimates based on 2025 tax rates and the inputs you provide.
              Actual taxes depend on your specific situation, deductions, and credits. This is not tax advice—consult
              a qualified tax professional for your specific circumstances.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                    {faq.question}
                    <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-white mb-4">Related Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/blog/quarterly-tax-savings-1099-contractors"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Quarterly Tax Savings Guide
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  How to save for and pay quarterly estimated taxes.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/tools/freelance-rate-calculator"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelance Rate Calculator
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Calculate your hourly rate based on income goals.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Try calculator <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-300">
              Want to track your tax reserve automatically? Cashcast shows your Safe to Spend in real-time.
            </p>
            <Link
              href="/auth/signup"
              className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
            >
              Try Cashcast Free
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
