import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ArrowRight, DollarSign, Users, Zap, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PocketSmith Alternative for Freelancers | Cashcast vs PocketSmith',
  description:
    'Looking for a PocketSmith alternative? Cashcast is 20% cheaper ($7.99 vs $9.95/mo), built for freelancers with invoicing and tax bucketing that PocketSmith lacks.',
  keywords: [
    'pocketsmith alternative',
    'pocketsmith for freelancers',
    'cheaper than pocketsmith',
    'pocketsmith vs cashcast',
    'pocketsmith canadian tax',
    'pocketsmith freelance',
    'pocketsmith cash flow',
    'pocketsmith alternative 2026',
    'cash flow forecasting freelancer',
    'freelancer budget app',
    'pocketsmith invoicing',
    'pocketsmith self-employed',
  ],
  alternates: {
    canonical: 'https://cashcast.money/compare/pocketsmith',
  },
  openGraph: {
    title: 'PocketSmith Alternative for Freelancers | 20% Cheaper',
    description:
      'Looking for a PocketSmith alternative? Cashcast is built for freelancers with invoicing and tax bucketing that PocketSmith lacks.',
    url: 'https://cashcast.money/compare/pocketsmith',
    siteName: 'Cashcast',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PocketSmith Alternative for Freelancers | 20% Cheaper',
    description:
      'Looking for a PocketSmith alternative? Cashcast is built for freelancers with invoicing and tax bucketing that PocketSmith lacks.',
  },
};

const comparisonRows = [
  { feature: 'Target user', cashcast: '✅ Freelancers & self-employed', pocketsmith: '⚠️ General consumers & households' },
  { feature: 'Monthly price (entry)', cashcast: '✅ $7.99/mo (20% cheaper)', pocketsmith: '❌ $9.95/mo' },
  { feature: 'Yearly price', cashcast: '✅ $79/year', pocketsmith: '❌ $119/year' },
  { feature: 'Lifetime option', cashcast: '✅ $99 one-time', pocketsmith: '❌ Not available' },
  { feature: 'Free tier', cashcast: '✅ Yes (5 bills, 5 income, 90-day forecast)', pocketsmith: '⚠️ 6-month forecast only' },
  { feature: 'Built for freelancers', cashcast: '✅ Irregular income is core focus', pocketsmith: '❌ Generic budgeting tool' },
  { feature: 'Built-in invoicing', cashcast: '✅ Runway Collect (included)', pocketsmith: '❌ No' },
  { feature: 'Invoice → forecast sync', cashcast: '✅ Automatic', pocketsmith: '❌ Not available' },
  { feature: 'Tax bucketing (US)', cashcast: '✅ Quarterly estimates', pocketsmith: '❌ No' },
  { feature: 'Tax bucketing (Canada)', cashcast: '✅ GST/HST, CPP, installments', pocketsmith: '❌ No' },
  { feature: '"Safe to Spend" metric', cashcast: '✅ Core feature, always visible', pocketsmith: '❌ No equivalent' },
  { feature: 'Setup time', cashcast: '✅ 5 minutes', pocketsmith: '❌ 30+ minutes (steep learning curve)' },
  { feature: 'Irregular income handling', cashcast: '✅ Default mode with Monte Carlo variance', pocketsmith: '⚠️ Auto-categorizes to "Misc"' },
  { feature: 'AI natural language queries', cashcast: '✅ "Ask Cashcast"', pocketsmith: '❌ No' },
  { feature: 'Cash flow calendar', cashcast: '✅ Daily view, color-coded', pocketsmith: '✅ Calendar-based view' },
  { feature: 'Scenario planning', cashcast: '✅ "Can I Afford It?" tester', pocketsmith: '✅ What-if scenarios' },
  { feature: 'Forecast length', cashcast: '90 days free / 365 days Pro', pocketsmith: '6mo free / 30 years top tier' },
  { feature: 'Bank connections', cashcast: '❌ Coming soon (Flinks Canada)', pocketsmith: '✅ 12,000+ institutions' },
  { feature: 'Multi-currency', cashcast: '⚠️ Display only', pocketsmith: '✅ Full support' },
  { feature: 'Low balance alerts', cashcast: '✅ Email + SMS + Push', pocketsmith: '✅ Email alerts' },
  { feature: 'Learning curve', cashcast: '✅ Simple (5 min setup)', pocketsmith: '❌ Steep (noted in reviews)' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Cashcast cheaper than PocketSmith?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Cashcast costs $7.99/month vs PocketSmith Foundation at $9.95/month — 20% cheaper. Cashcast also offers a $99 lifetime deal that PocketSmith doesn\'t have. Higher PocketSmith tiers run $16.63-$26.63/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Cashcast handle Canadian taxes like PocketSmith?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cashcast actually handles Canadian taxes better than PocketSmith. We have built-in GST/HST reserve tracking, CPP self-employed contribution calculations, and quarterly installment reminders. PocketSmith has no tax planning features for self-employed users.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my PocketSmith data into Cashcast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — export your transactions from PocketSmith as CSV, then use our Excel/CSV import feature. We auto-detect columns and suggest recurring patterns to create bills and income entries automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Cashcast forecast as far ahead as PocketSmith?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PocketSmith\'s top tier ($26.63/mo) forecasts up to 30 years. Cashcast Pro ($7.99/mo) forecasts 365 days. For most freelancers, 12 months is more than enough — you\'re focused on making rent next month, not 2050.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cashcast better for freelancers than PocketSmith?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if you\'re a freelancer with irregular income who invoices clients. Cashcast was built specifically for this use case — invoice-to-forecast sync, tax bucketing for US and Canada, "Safe to Spend" metric, and 5-minute setup. PocketSmith is a general budgeting tool that doesn\'t handle freelance income patterns or invoicing.',
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

export default function PocketSmithComparisonPage() {
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
              { name: 'PocketSmith Alternative', url: 'https://cashcast.money/compare/pocketsmith' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
              <DollarSign className="h-4 w-4" />
              <span>Save 20% vs PocketSmith</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              PocketSmith Alternative for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              PocketSmith is a respected cash flow calendar tool, but it&apos;s built for general consumers — not
              freelancers with irregular income, client invoices, and self-employment taxes.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Cashcast is <span className="text-emerald-300 font-medium">20% cheaper</span> and purpose-built for freelancers.
              We include invoicing, tax bucketing (US + Canada), and a &quot;Safe to Spend&quot; metric that tells
              you exactly what you can afford — features PocketSmith doesn&apos;t offer.
            </p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-zinc-300 text-sm">
                <strong className="text-white">Different goals, not &quot;better&quot; or &quot;worse.&quot;</strong>{' '}
                PocketSmith excels at long-range planning (up to 30 years) and multi-currency households. Cashcast excels
                at freelancer workflows: invoicing clients, tracking tax obligations, and knowing if you can cover rent.
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
                <p className="text-sm text-rose-300 font-medium">PocketSmith</p>
                <p className="mt-2 text-3xl font-bold text-white">$9.95<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">up to $26.63/mo for top tier</p>
              </div>
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
                <p className="text-sm text-teal-300 font-medium">Cashcast</p>
                <p className="mt-2 text-3xl font-bold text-white">$7.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">or $99 lifetime</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
                <p className="text-sm text-amber-300 font-medium">Your Savings</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">$1.96<span className="text-lg text-zinc-400">+/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">20% less + lifetime option</p>
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
                  <h3 className="text-lg font-semibold text-white">PocketSmith is for...</h3>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Households managing long-term wealth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Users who want 10-30 year projections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>People with multiple currencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>Users comfortable with complex setup</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cashcast is for...</h3>
                </div>
                <ul className="mt-4 space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Freelancers with irregular income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Anyone who invoices clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Self-employed with US or Canadian tax obligations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Users who want quick setup, not a learning curve</span>
                  </li>
                </ul>
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
                    <Users className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Built for freelancers vs general budgeting</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  PocketSmith&apos;s auto-categorizer often misclassifies irregular freelance income as &quot;Miscellaneous&quot; —
                  a documented pain point in user reviews. Cashcast is built around irregular income from the ground up.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <DollarSign className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Tax bucketing (US + Canada) vs nothing</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Cashcast has built-in tax reserve tracking: quarterly estimates for US self-employed, plus GST/HST and CPP
                  calculations for Canadian freelancers. PocketSmith has no self-employment tax features.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Invoicing → forecast vs separate workflows</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  Send an invoice with Runway Collect and the expected payment automatically appears in your forecast.
                  PocketSmith doesn&apos;t have invoicing — you need a separate tool, then manually enter expected income.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-500/10 p-2">
                    <Clock className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">5-minute setup vs steep learning curve</h3>
                </div>
                <p className="mt-3 text-zinc-400">
                  PocketSmith reviews consistently note it&apos;s &quot;not for casual users&quot; with a steep learning curve.
                  Cashcast is simpler by design: 2-step onboarding, no complex configuration, just cash flow clarity.
                </p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              PocketSmith offers powerful long-range forecasting and bank connections. But if you&apos;re a freelancer
              who invoices clients and needs to track taxes, here&apos;s how we compare.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cashcast</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">PocketSmith</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-5 py-4 text-zinc-300">{row.feature}</td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.cashcast} />
                      </td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.pocketsmith} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why switch */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Why freelancers choose Cashcast over PocketSmith</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              PocketSmith is a solid tool for general users and long-term planners. But freelancers have specific
              needs that it doesn&apos;t address.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Invoicing included — no extra tools</h3>
                <p className="mt-2 text-zinc-400">
                  Runway Collect lets you create, send, and track invoices. Clients pay via Stripe.
                  Expected income auto-syncs to your forecast. PocketSmith requires separate invoicing software.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Tax planning for self-employed</h3>
                <p className="mt-2 text-zinc-400">
                  Know how much to set aside for taxes — including US quarterly estimates or Canadian GST/HST
                  and CPP. PocketSmith has no tax planning features for freelancers.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">&quot;Safe to Spend&quot; — one number that matters</h3>
                <p className="mt-2 text-zinc-400">
                  After accounting for upcoming bills and tax reserves, how much can you actually spend?
                  That number is always visible. PocketSmith shows balances but not this specific metric.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Simpler and cheaper</h3>
                <p className="mt-2 text-zinc-400">
                  $7.99/mo vs $9.95-$26.63/mo. 5-minute setup vs 30+ minutes. We focus on what freelancers
                  actually need, not 30-year projections most will never use.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to try a PocketSmith alternative?
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Start with our free tier — no credit card required. See your cash flow in 5 minutes, not 30.
                If you invoice clients, you&apos;ll wonder why you waited.
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
                <h3 className="text-white font-semibold">Is Cashcast cheaper than PocketSmith?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes — $7.99/mo vs $9.95/mo (20% cheaper). PocketSmith&apos;s top tier is $26.63/mo.
                  We also offer a $99 lifetime deal that PocketSmith doesn&apos;t have.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Does PocketSmith have invoicing?</h3>
                <p className="mt-2 text-zinc-400">
                  No. PocketSmith is a budgeting/forecasting tool only. You need separate invoicing software.
                  Cashcast includes Runway Collect invoicing with automatic forecast sync.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I import my PocketSmith data?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes — export from PocketSmith as CSV, then use our import feature. We detect columns
                  automatically and suggest recurring patterns to create bills and income.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Why doesn&apos;t Cashcast forecast 30 years?</h3>
                <p className="mt-2 text-zinc-400">
                  Because most freelancers need to know if they can pay rent next month, not plan for 2050.
                  365 days is practical for cash flow. Long-term wealth planning is a different problem.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Does PocketSmith handle Canadian taxes?</h3>
                <p className="mt-2 text-zinc-400">
                  No — PocketSmith has no self-employment tax features. Cashcast includes GST/HST reserve
                  tracking, CPP calculations, and quarterly installment reminders for Canadian freelancers.
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
                href="/compare/pulse"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      Pulse Alternative
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      73% cheaper than Pulse
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
                href="/blog/cash-flow-forecasting-self-employed"
                className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-teal-400 font-medium">Complete Guide</span>
                </div>
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for the Self-Employed
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The method freelancers actually use — with Safe to Spend
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
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
