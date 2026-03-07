import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ArrowRight, DollarSign, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Float Alternative for Freelancers | Cash Flow Forecaster vs Float',
  description:
    'Looking for a Float alternative? Cash Flow Forecaster is 87% cheaper ($7.99 vs $59/mo), built for freelancers instead of SMBs, and includes invoicing at no extra cost.',
  keywords: [
    'float alternative',
    'float cash flow alternative',
    'float app alternative',
    'cheaper than float',
    'float vs cash flow forecaster',
    'float too expensive',
    'cash flow forecasting freelancer',
    'float for freelancers',
    'float pricing',
    'small business cash flow app',
    'solopreneur cash flow',
    'freelancer cash flow forecast',
  ],
  alternates: {
    canonical: 'https://www.cashflowforecaster.io/compare/float',
  },
  openGraph: {
    title: 'Float Alternative for Freelancers | 87% Cheaper',
    description:
      'Looking for a Float alternative? Cash Flow Forecaster is 87% cheaper, built for freelancers, and includes invoicing.',
    url: 'https://www.cashflowforecaster.io/compare/float',
    siteName: 'Cash Flow Forecaster',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Float Alternative for Freelancers | 87% Cheaper',
    description:
      'Looking for a Float alternative? Cash Flow Forecaster is 87% cheaper, built for freelancers, and includes invoicing.',
  },
};

const comparisonRows = [
  { feature: 'Target user', cff: '✅ Freelancers & solopreneurs', float: '⚠️ Growing SMBs & agencies' },
  { feature: 'Monthly price', cff: '✅ $7.99/mo (87% cheaper)', float: '❌ $59-$199/mo' },
  { feature: 'Yearly price', cff: '✅ $79/year', float: '❌ $708-$2,388/year' },
  { feature: 'Lifetime option', cff: '✅ $99 one-time', float: '❌ Not available' },
  { feature: 'Free tier', cff: '✅ Yes (10 bills, 10 income, 90-day forecast)', float: '❌ 14-day trial only' },
  { feature: 'Requires accounting software', cff: '✅ No - standalone', float: '❌ Yes - requires Xero or QuickBooks' },
  { feature: 'Setup time', cff: '✅ 5 minutes', float: '⚠️ 30+ minutes (sync + config)' },
  { feature: 'Cash flow calendar', cff: '✅ Daily view, any future day', float: '✅ Yes' },
  { feature: 'Scenario planning', cff: '✅ "Can I Afford It?" tester', float: '✅ Multiple scenarios' },
  { feature: 'Forecast accuracy (vs spreadsheet)', cff: '✅ 30-50% more accurate', float: '✅ 30-50% more accurate' },
  { feature: '"Safe to Spend" metric', cff: '✅ Core feature, always visible', float: '❌ No equivalent' },
  { feature: 'Built-in invoicing', cff: '✅ Runway Collect (included)', float: '❌ No' },
  { feature: 'Invoice → forecast sync', cff: '✅ Automatic', float: '❌ Manual via accounting software' },
  { feature: 'Tax reserve tracking', cff: '✅ Tax Savings Tracker', float: '❌ No' },
  { feature: 'Credit card forecasting', cff: '✅ Utilization + payment planning', float: '⚠️ Limited' },
  { feature: 'Debt payoff planner', cff: '✅ Snowball vs Avalanche', float: '❌ No' },
  { feature: 'Low balance alerts', cff: '✅ Email alerts', float: '✅ Yes' },
  { feature: 'Multi-currency', cff: '⚠️ Display only', float: '✅ Full support' },
  { feature: 'Team collaboration', cff: '❌ Single user', float: '✅ Multi-user' },
  { feature: 'Bank sync', cff: '❌ Coming soon', float: '✅ Via Xero/QBO' },
  { feature: 'API access', cff: '❌ Not available', float: '✅ Available on higher tiers' },
  { feature: 'Learning curve', cff: '✅ Simple (5 min setup)', float: '⚠️ Moderate (accounting integration required)' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why is Float so expensive?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Float charges $59-199/month because it targets growing SMBs and agencies with complex cash flow needs, multi-user collaboration, and deep accounting software integration. For solo freelancers, this is often overkill. Cash Flow Forecaster offers similar forecasting for 87% less at $7.99/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Float and Cash Flow Forecaster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Float is designed for growing businesses with accounting teams—it requires Xero or QuickBooks and supports multi-user collaboration. Cash Flow Forecaster is built for solo freelancers—it works standalone, includes invoicing, and costs 87% less. Both provide forward-looking cash flow forecasting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Float work for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Float can work for freelancers, but it requires connecting Xero or QuickBooks first, which adds complexity and cost. At $59-199/month, it may be too expensive for most freelancers. Cash Flow Forecaster is built specifically for freelancers at $7.99/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Float worth it for a solopreneur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most solopreneurs, Float is overkill. Its strength is multi-user collaboration and deep accounting integration—features solo workers rarely need. Cash Flow Forecaster offers the core cash flow forecasting at 87% less cost, with built-in invoicing included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best Float alternative for freelancers in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster is the best Float alternative for freelancers in 2026. It costs 87% less ($7.99/mo vs $59+/mo), works standalone without requiring accounting software, includes built-in invoicing, and shows your "Safe to Spend" so you always know what you can afford.',
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

export default function FloatComparisonPage() {
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
              { name: 'Float Alternative', url: 'https://www.cashflowforecaster.io/compare/float' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
              <DollarSign className="h-4 w-4" />
              <span>Save 87% vs Float</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Float Alternative for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              Float is powerful, but at <span className="text-rose-300">$59-199/month</span> it&apos;s built for
              growing businesses with accounting teams—not solo freelancers watching every dollar.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Cash Flow Forecaster gives you the same forward-looking visibility for{' '}
              <span className="text-emerald-300 font-medium">87% less</span>. No accounting software required.
              No complex setup. Just a simple cash flow calendar that answers: &quot;Can I afford this?&quot;
            </p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-zinc-300 text-sm">
                <strong className="text-white">Why does price matter?</strong> Research shows 82% of freelance
                failures are due to cash flow issues. Spending $59-199/month on a forecasting tool when you&apos;re
                already cash-strapped doesn&apos;t help—it makes things worse.
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
                <p className="text-sm text-rose-300 font-medium">Float</p>
                <p className="mt-2 text-3xl font-bold text-white">$59<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">up to $199/mo for teams</p>
              </div>
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
                <p className="text-sm text-teal-300 font-medium">Cash Flow Forecaster</p>
                <p className="mt-2 text-3xl font-bold text-white">$7.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">or $99 lifetime</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
                <p className="text-sm text-amber-300 font-medium">Your Savings</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">$51<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">87% less than Float</p>
              </div>
            </div>
          </section>

          {/* Who each tool is for */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Who each tool is for</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-500/10 p-2">
                    <Users className="h-5 w-5 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Float is for...</h3>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Growing businesses with 5+ employees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Teams already using Xero or QuickBooks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Agencies needing multi-user collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Businesses with complex multi-currency needs</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cash Flow Forecaster is for...</h3>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Solo freelancers and solopreneurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Anyone who wants a standalone tool (no Xero/QBO required)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Freelancers who invoice clients directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Anyone who wants to know &quot;Can I afford this?&quot;</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Float excels at team collaboration and deep accounting integrations. But if you&apos;re a solo
              freelancer who just needs cash flow visibility, here&apos;s how we compare.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cash Flow Forecaster</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">Float</th>
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
                        <ValueCell value={row.float} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why switch */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Why freelancers choose us over Float</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Float is excellent for agencies and growing businesses. But for solo freelancers, it&apos;s often overkill.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">No accounting software required</h3>
                <p className="mt-2 text-zinc-400">
                  Float requires Xero or QuickBooks to function. We work standalone—just add your bills and income,
                  and see your forecast in minutes. No sync headaches.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Built-in invoicing included</h3>
                <p className="mt-2 text-zinc-400">
                  Float doesn&apos;t help you get paid. Our Runway Collect feature lets you send invoices
                  and collect payments—with expected income automatically appearing in your forecast.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">&quot;Safe to Spend&quot; always visible</h3>
                <p className="mt-2 text-zinc-400">
                  Float shows complex cash flow charts. We show one number: how much you can safely spend
                  without risking your upcoming bills. Simple, actionable, stress-reducing.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">87% cheaper</h3>
                <p className="mt-2 text-zinc-400">
                  $7.99/mo vs $59-199/mo. That&apos;s $51+ back in your pocket every month—or grab our
                  $99 lifetime deal and never pay again.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to try a Float alternative?
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Start with our free tier—no credit card, no accounting software required.
                See your cash flow calendar in 5 minutes, not 30.
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
                <h3 className="text-white font-semibold">Why is Float so expensive?</h3>
                <p className="mt-2 text-zinc-400">
                  Float targets growing SMBs with complex needs—multi-user, multi-currency, deep accounting integration.
                  For solo freelancers, that&apos;s often overkill.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Cash Flow Forecaster as accurate as Float?</h3>
                <p className="mt-2 text-zinc-400">
                  Both tools improve forecast accuracy by 30-50% vs spreadsheets. The difference is target user and
                  price—not accuracy.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Do I need Xero or QuickBooks?</h3>
                <p className="mt-2 text-zinc-400">
                  No! Cash Flow Forecaster works standalone. Just add your bills and income manually, or import from
                  Excel/CSV. No accounting software required.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I migrate from Float?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes—export your data from Float as CSV or Excel, then use our import feature to bring in your
                  recurring bills and income.
                </p>
              </div>
            </div>
          </section>

          {/* Other comparisons */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-white mb-6">Other comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                href="/compare/mint"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      Mint Alternative
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Mint shut down in 2024
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
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for Freelancers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why 82% of failures are cash flow related
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
                  Know your &quot;Safe to Spend&quot; after taxes
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
