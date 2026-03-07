import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ArrowRight, DollarSign, Zap, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pulse Alternative for Freelancers | Cash Flow Forecaster vs Pulse App',
  description:
    'Looking for a Pulse alternative? Cash Flow Forecaster is 73% cheaper ($7.99 vs $29/mo), includes invoicing, and shows your "Safe to Spend" so you always know what you can afford.',
  keywords: [
    'pulse alternative',
    'pulse app alternative',
    'pulse cash flow alternative',
    'cheaper than pulse',
    'pulse vs cash flow forecaster',
    'pulseapp alternative',
    'pulse pricing',
    'cash flow app for freelancers',
    'pulse app review',
    'best pulse alternative 2026',
    'freelancer cash flow forecast',
  ],
  alternates: {
    canonical: 'https://www.cashflowforecaster.io/compare/pulse',
  },
  openGraph: {
    title: 'Pulse Alternative for Freelancers | 73% Cheaper',
    description:
      'Looking for a Pulse alternative? Cash Flow Forecaster is 73% cheaper, includes invoicing, and shows your Safe to Spend.',
    url: 'https://www.cashflowforecaster.io/compare/pulse',
    siteName: 'Cash Flow Forecaster',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse Alternative for Freelancers | 73% Cheaper',
    description:
      'Looking for a Pulse alternative? Cash Flow Forecaster is 73% cheaper, includes invoicing, and shows your Safe to Spend.',
  },
};

const comparisonRows = [
  { feature: 'Monthly price', cff: '✅ $7.99/mo (73% cheaper)', pulse: '❌ $29-$89/mo' },
  { feature: 'Yearly price', cff: '✅ $79/year', pulse: '❌ $348-$1,068/year' },
  { feature: 'Lifetime option', cff: '✅ $99 one-time', pulse: '❌ Not available' },
  { feature: 'Free tier', cff: '✅ Yes (10 bills, 10 income, 90-day forecast)', pulse: '❌ 30-day trial only' },
  { feature: 'Data entry method', cff: '✅ Guided forms + CSV/Excel import', pulse: '⚠️ Spreadsheet-style (manual)' },
  { feature: 'Cash flow calendar', cff: '✅ Visual daily calendar', pulse: '✅ Chart-based view' },
  { feature: 'Scenario planning', cff: '✅ "Can I Afford It?" tester', pulse: '✅ Toggle entries on/off' },
  { feature: '"Safe to Spend" metric', cff: '✅ Core feature, always visible', pulse: '❌ No equivalent' },
  { feature: 'Built-in invoicing', cff: '✅ Runway Collect (included)', pulse: '❌ No' },
  { feature: 'Invoice → forecast sync', cff: '✅ Automatic', pulse: '❌ Manual entry required' },
  { feature: 'Tax reserve tracking', cff: '✅ Tax Savings Tracker + Calculator', pulse: '❌ No' },
  { feature: 'Credit card forecasting', cff: '✅ Utilization + payment planning', pulse: '⚠️ Basic support' },
  { feature: 'Debt payoff planner', cff: '✅ Snowball vs Avalanche', pulse: '❌ No' },
  { feature: 'Low balance alerts', cff: '✅ Email alerts', pulse: '⚠️ Visual indicators only' },
  { feature: 'Recurring transactions', cff: '✅ Full frequency options', pulse: '✅ Yes' },
  { feature: 'Multiple accounts', cff: '✅ Yes', pulse: '✅ Yes' },
  { feature: 'Bank sync', cff: '❌ Coming soon', pulse: '❌ Manual only' },
  { feature: 'Reports & export', cff: '✅ Monthly, Category, Excel/JSON', pulse: '✅ CSV export' },
  { feature: 'Mobile experience', cff: '✅ Responsive PWA', pulse: '⚠️ Desktop-focused' },
  { feature: 'Learning curve', cff: '✅ Simple (5 min setup)', pulse: '⚠️ Spreadsheet familiarity needed' },
  { feature: 'Target user', cff: '✅ Solo freelancers', pulse: '⚠️ Small agencies' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between Pulse and Cash Flow Forecaster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pulse uses a spreadsheet-style interface where you manually enter cash flow data. Cash Flow Forecaster uses guided forms and includes built-in invoicing that automatically syncs to your forecast. Both show future cash flow, but Cash Flow Forecaster is 73% cheaper and includes a "Safe to Spend" metric.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Pulse good for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pulse works for freelancers but was designed more for small agencies. At $29-89/month, it can be expensive for solo freelancers. It also lacks invoicing and tax tracking features that freelancers often need. Cash Flow Forecaster is built specifically for freelancers at $7.99/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is Cash Flow Forecaster cheaper than Pulse?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster focuses on solo freelancers rather than agencies, allowing for simpler architecture and lower costs. We pass those savings to you: $7.99/month vs Pulse $29-89/month. You get core cash flow forecasting plus invoicing at 73% less cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Pulse have invoicing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Pulse does not include invoicing. You need separate software to send invoices, then manually enter expected payments into Pulse. Cash Flow Forecaster includes Runway Collect invoicing—send invoices and expected income automatically appears in your forecast.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best Pulse alternative for freelancers in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster is the best Pulse alternative for freelancers in 2026. It costs 73% less ($7.99/mo vs $29+/mo), includes built-in invoicing, shows your "Safe to Spend" metric, and has tax tracking—features Pulse lacks.',
      },
    },
  ],
} as const;

function ValueCell({ value }: { value: string }) {
  const Icon =
    value.startsWith('✅') ? CheckCircle2 : value.startsWith('❌') ? XCircle : value.startsWith('⚠️') ? AlertTriangle : null;

  const iconColor =
    value.startsWith('✅') ? 'text-emerald-300' : value.startsWith('❌') ? 'text-rose-300' : value.startsWith('⚠️') ? 'text-amber-300' : 'text-zinc-300';

  const marker = value.startsWith('✅') ? '✅' : value.startsWith('❌') ? '❌' : value.startsWith('⚠️') ? '⚠️' : null;
  const label = marker ? value.slice(marker.length).trimStart() : value;

  return (
    <div className="flex items-start gap-2">
      {Icon ? <Icon className={`h-4 w-4 mt-0.5 ${iconColor}`} aria-hidden="true" /> : null}
      <span className="text-zinc-200">{label}</span>
    </div>
  );
}

export default function PulseComparisonPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* subtle dot grid */}
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
              breadcrumbs.compare,
              { name: 'Pulse Alternative', url: 'https://www.cashflowforecaster.io/compare/pulse' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
              <DollarSign className="h-4 w-4" />
              <span>Save 73% vs Pulse</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Pulse Alternative for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              Pulse is a solid cash flow tool, but at <span className="text-rose-300">$29-89/month</span> with
              a spreadsheet-style interface, it&apos;s often more than solo freelancers need.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Cash Flow Forecaster gives you the same forward-looking visibility for{' '}
              <span className="text-emerald-300 font-medium">73% less</span>—plus built-in invoicing and a
              &quot;Safe to Spend&quot; metric that tells you exactly what you can afford right now.
            </p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-zinc-300 text-sm">
                <strong className="text-white">The real question isn&apos;t &quot;how much will I have?&quot;</strong>—it&apos;s
                &quot;how much can I safely spend?&quot; That&apos;s the number we put front and center.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-4 rounded-md border border-zinc-800 bg-zinc-950/40 text-sm font-medium text-zinc-200 hover:text-white hover:bg-zinc-900/40 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Price comparison callout */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 text-center">
                <p className="text-sm text-rose-300 font-medium">Pulse</p>
                <p className="mt-2 text-3xl font-bold text-white">$29<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">up to $89/mo for more features</p>
              </div>
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
                <p className="text-sm text-teal-300 font-medium">Cash Flow Forecaster</p>
                <p className="mt-2 text-3xl font-bold text-white">$7.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">or $99 lifetime</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
                <p className="text-sm text-amber-300 font-medium">Your Savings</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">$21<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">73% less than Pulse</p>
              </div>
            </div>
          </section>

          {/* Key differences */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Key differences</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Guided vs Spreadsheet</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Pulse uses a spreadsheet-style interface that requires manual data entry. Cash Flow Forecaster
                  uses guided forms—just fill in the blanks and we handle the rest.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <DollarSign className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Invoicing included</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Pulse doesn&apos;t help you get paid. With our Runway Collect feature, send invoices and
                  expected income automatically appears in your forecast. One less tool to manage.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">&quot;Safe to Spend&quot; metric</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Pulse shows cash flow charts. We show the one number that matters: how much you can safely
                  spend without risking your upcoming bills. Less analysis, more action.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Clock className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Tax tracking built-in</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Pulse doesn&apos;t track taxes. We show how much to set aside for quarterly payments so you&apos;re
                  never blindsided by a tax bill. Plus a free tax calculator tool.
                </p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Both tools help you see future cash flow. Here&apos;s how they compare on the features that
              matter most to freelancers.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cash Flow Forecaster</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">Pulse</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-5 py-4 text-zinc-300">{row.feature}</td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.cff} />
                      </td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.pulse} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to try a Pulse alternative?
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Start with our free tier—no credit card required. See your cash flow calendar in 5 minutes,
                send your first invoice, and know exactly what you can afford.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950 px-8" />
                <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Back to home
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">FAQ</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">What&apos;s the main difference between Pulse and Cash Flow Forecaster?</h3>
                <p className="mt-2 text-zinc-400">
                  Pulse uses a spreadsheet-style interface; we use guided forms. We include invoicing and tax tracking;
                  Pulse doesn&apos;t. We&apos;re 73% cheaper.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Pulse better for agencies?</h3>
                <p className="mt-2 text-zinc-400">
                  Pulse was designed more for small agencies than solo freelancers. If you&apos;re a solo freelancer,
                  Cash Flow Forecaster is likely a better fit—and much cheaper.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Does Pulse have invoicing?</h3>
                <p className="mt-2 text-zinc-400">
                  No. You need separate invoicing software, then manually enter expected payments.
                  Our Runway Collect handles both—send invoices and sync to your forecast automatically.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I import data from Pulse?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes—export from Pulse as CSV, then use our import feature to bring in your recurring
                  transactions. We auto-detect patterns to create bills and income.
                </p>
              </div>
            </div>
          </section>

          {/* Other comparisons */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-white mb-6">Other comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/compare/float"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      Float Alternative
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      87% cheaper than Float
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
              <Link
                href="/compare/ynab"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      YNAB Alternative
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      47% cheaper than YNAB
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
              <Link
                href="/compare/cash-flow-calendar-apps"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      All Cash Flow Apps
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Full comparison for 2026
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
            </div>
          </section>

          {/* Related articles */}
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Related guides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog/what-is-safe-to-spend"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  What is &quot;Safe to Spend&quot;?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The one number every freelancer needs
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/tools/tax-reserve-calculator"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Tax Reserve Calculator
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Know how much to set aside for taxes
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Try calculator <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
