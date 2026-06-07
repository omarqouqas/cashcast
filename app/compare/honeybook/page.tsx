import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ArrowRight, TrendingUp, Calendar, Receipt, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HoneyBook Alternative for Cash Flow | Cashcast vs HoneyBook 2026',
  description:
    'HoneyBook raised prices 51-89% in 2025. Cashcast adds cash flow forecasting HoneyBook lacks—see when invoices will actually get paid. $7.99/mo vs $36-109/mo.',
  keywords: [
    'honeybook alternative',
    'honeybook alternative 2026',
    'honeybook too expensive',
    'honeybook price increase',
    'honeybook price hike',
    'cheaper than honeybook',
    'honeybook cash flow',
    'honeybook vs cashcast',
    'honeybook for photographers',
    'honeybook for freelancers',
    'honeybook competitor',
    'dubsado alternative',
    'crm for freelancers',
    'freelancer invoicing cash flow',
    'when will invoices get paid',
    'invoice payment forecasting',
  ],
  alternates: {
    canonical: 'https://cashcast.money/compare/honeybook',
  },
  openGraph: {
    title: 'HoneyBook Alternative | Cash Flow Forecasting HoneyBook Lacks',
    description:
      'HoneyBook raised prices 51-89%. Cashcast adds the cash flow visibility HoneyBook is missing—see when invoices actually get paid.',
    url: 'https://cashcast.money/compare/honeybook',
    siteName: 'Cashcast',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoneyBook Alternative | Cash Flow Forecasting for Freelancers',
    description:
      'HoneyBook raised prices 51-89%. Cashcast adds cash flow visibility for $7.99/mo.',
  },
};

const comparisonRows = [
  { feature: 'Primary purpose', cashcast: '✅ Cash flow forecasting', honeybook: '✅ Client CRM & invoicing' },
  { feature: 'Monthly price', cashcast: '✅ $7.99/mo', honeybook: '❌ $36-109/mo (51-89% price hike in 2025)' },
  { feature: 'Yearly price', cashcast: '✅ $79/year', honeybook: '❌ $390-1,188/year' },
  { feature: 'Lifetime option', cashcast: '✅ $99 one-time', honeybook: '❌ Not available' },
  { feature: 'Free tier', cashcast: '✅ Yes (5 bills, 5 income, 90-day forecast)', honeybook: '❌ 7-day trial only' },
  { feature: 'Cash flow forecasting', cashcast: '✅ See future balance on any day (up to 365 days)', honeybook: '❌ No—only backward-looking reporting' },
  { feature: 'Cash flow reporting', cashcast: '✅ Yes', honeybook: '✅ Yes (added late 2025, shows past only)' },
  { feature: '"Can I Afford It?" tool', cashcast: '✅ Yes—check affordability before spending', honeybook: '❌ No' },
  { feature: 'Invoice payment forecasting', cashcast: '✅ Predict when invoices will actually get paid', honeybook: '❌ No' },
  { feature: 'Bill tracking', cashcast: '✅ Track recurring bills and see collisions', honeybook: '❌ No expense tracking' },
  { feature: 'Low balance alerts', cashcast: '✅ Email + SMS + push notifications', honeybook: '❌ No' },
  { feature: 'Client CRM', cashcast: '❌ No (not our focus)', honeybook: '✅ Full CRM with pipelines' },
  { feature: 'Contracts & proposals', cashcast: '❌ No', honeybook: '✅ Yes, with e-signatures' },
  { feature: 'Scheduling/booking', cashcast: '❌ No', honeybook: '✅ Yes' },
  { feature: 'Invoicing', cashcast: '✅ Simple invoicing with Stripe payments', honeybook: '✅ Full invoicing suite' },
  { feature: 'Invoice → forecast sync', cashcast: '✅ Automatic—invoices appear in your forecast', honeybook: '❌ No forecasting' },
  { feature: 'Debt payoff planner', cashcast: '✅ Snowball vs Avalanche comparison', honeybook: '❌ No' },
  { feature: 'Tax withholding tracking', cashcast: '✅ Per-income tax reserves', honeybook: '❌ No' },
  { feature: 'CSV/Excel import', cashcast: '✅ Import HoneyBook exports', honeybook: '✅ CSV export available' },
  { feature: 'Learning curve', cashcast: '✅ Simple calendar view', honeybook: '⚠️ Feature-rich, takes time' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why did HoneyBook raise prices in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In February 2025, HoneyBook raised prices by 51-89% across all tiers. The Starter plan went from $19/mo to $36/mo, Essentials from $39/mo to $59/mo, and Premium stayed at $109/mo but with fewer features in lower tiers. Many freelancers and photographers are looking for alternatives due to these significant price increases.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cashcast a HoneyBook replacement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No—Cashcast is not a HoneyBook replacement. HoneyBook is a CRM for managing clients, contracts, and proposals. Cashcast is a cash flow forecasting tool that shows when your money will arrive and if you can afford upcoming expenses. Many freelancers use both: HoneyBook to manage clients, Cashcast to manage cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Cashcast with HoneyBook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Cashcast complements HoneyBook perfectly. Export your invoices from HoneyBook as CSV, import them into Cashcast, and see when those payments will actually hit your bank account. HoneyBook tells you who owes you money—Cashcast tells you when you\'ll actually have it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Cashcast do that HoneyBook doesn\'t?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cashcast provides forward-looking cash flow forecasting. While HoneyBook added a Cash Flow feature in late 2025, it only shows historical data (past payments minus expenses). Cashcast shows your projected future bank balance for any day up to a year ahead, alerts you before overdrafts happen, and answers "Can I afford this?" before you spend. HoneyBook looks backward; Cashcast looks forward.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does HoneyBook have cash flow features?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, HoneyBook added a Cash Flow graph in late 2025. However, it shows backward-looking data only—paid payments minus logged expenses. It cannot forecast your future balance or predict when invoices will actually get paid. For forward-looking cash flow forecasting, you need a dedicated tool like Cashcast.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cashcast cheaper than HoneyBook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cashcast is significantly cheaper—$7.99/mo vs HoneyBook\'s $36-109/mo (after their 2025 price hike). However, they serve different purposes. Many freelancers use a lighter CRM (or just email) plus Cashcast, saving hundreds per year while gaining cash flow visibility HoneyBook doesn\'t offer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best HoneyBook alternative for photographers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For photographers frustrated with HoneyBook\'s prices, consider using a lighter CRM like Dubsado or even a simple spreadsheet for client management, paired with Cashcast for cash flow forecasting. Photographers have notoriously irregular income (wedding season vs winter), making cash flow visibility essential. Cashcast shows when invoice payments will actually arrive, helping you plan for slow months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my HoneyBook data into Cashcast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Export your invoices and payments from HoneyBook as CSV, then use our Excel/CSV import feature. We\'ll convert your invoice data into income entries with expected payment dates, so you can immediately see your cash flow forecast based on your real HoneyBook data.',
      },
    },
  ],
} as const;

const productComparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cashcast',
  description: 'Cash flow forecasting app for freelancers. See your future bank balance, track bills and income, get low balance alerts.',
  brand: {
    '@type': 'Brand',
    name: 'Cashcast',
  },
  image: 'https://cashcast.money/og-image.png',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '99',
    priceCurrency: 'USD',
    offerCount: 3,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Pro Monthly',
        price: '7.99',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime',
        price: '99',
        priceCurrency: 'USD',
      },
    ],
  },
};

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

export default function HoneyBookComparisonPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productComparisonSchema) }}
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
              { name: 'HoneyBook Alternative', url: 'https://cashcast.money/compare/honeybook' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm text-amber-300">
              <TrendingUp className="h-4 w-4" />
              <span>HoneyBook raised prices 51-89% in 2025</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              HoneyBook Alternative: Add the Cash Flow Visibility HoneyBook Lacks
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              HoneyBook is great for managing clients and sending invoices. But it can&apos;t answer the question every freelancer asks:
              <span className="text-white font-medium"> &quot;When will I actually have this money?&quot;</span>
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Cashcast fills that gap. We&apos;re not a HoneyBook replacement—we&apos;re the <span className="text-teal-300 font-medium">cash flow layer</span> HoneyBook is missing.
              See your future balance, track when invoices will get paid, and know if you can afford rent next month.
            </p>

            <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <p className="text-zinc-300 text-sm">
                <strong className="text-rose-300">February 2025:</strong> HoneyBook raised prices by 51-89%.
                Starter jumped from $19/mo to $36/mo. Many photographers and freelancers are actively searching for alternatives.
                <span className="text-zinc-400"> You can keep HoneyBook for CRM—just add Cashcast for forecasting at </span>
                <span className="text-emerald-300 font-medium">$7.99/mo</span>.
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
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-6">Price comparison after HoneyBook&apos;s 2025 increase</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
                <p className="text-sm text-rose-300 font-medium">HoneyBook Starter</p>
                <p className="mt-2 text-3xl font-bold text-white">$36<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400 line-through">Was $19/mo (89% increase)</p>
                <p className="mt-3 text-xs text-zinc-500">CRM, invoicing, contracts. No cash flow forecasting.</p>
              </div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
                <p className="text-sm text-rose-300 font-medium">HoneyBook Essentials</p>
                <p className="mt-2 text-3xl font-bold text-white">$59<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400 line-through">Was $39/mo (51% increase)</p>
                <p className="mt-3 text-xs text-zinc-500">Everything in Starter + automation. Still no forecasting.</p>
              </div>
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6">
                <p className="text-sm text-teal-300 font-medium">Cashcast Pro</p>
                <p className="mt-2 text-3xl font-bold text-white">$7.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-emerald-400">365-day cash flow forecast</p>
                <p className="mt-3 text-xs text-zinc-500">Or $99 lifetime—pay once, use forever.</p>
              </div>
            </div>
          </section>

          {/* Key difference section */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Different tools for different jobs</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              HoneyBook and Cashcast aren&apos;t competitors—they solve different problems. Here&apos;s what each does best.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <Users className="h-5 w-5 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">HoneyBook</h3>
                </div>
                <p className="text-zinc-400 mb-4">
                  &quot;Help me manage client relationships and close deals.&quot;
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Client CRM with pipelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Contracts with e-signatures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Proposals and booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Full invoicing suite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Cash flow reporting (historical only)</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-teal-500/10">
                    <Calendar className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cashcast</h3>
                </div>
                <p className="text-zinc-400 mb-4">
                  &quot;Help me see my future cash flow and avoid overdrafts.&quot;
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>365-day cash flow forecast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>&quot;Can I Afford It?&quot; calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Bill tracking with collision alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Low balance alerts (email + SMS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Simple invoicing with forecast sync</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Full feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Side-by-side breakdown of HoneyBook vs Cashcast. Remember: these tools complement each other—many freelancers use both.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-teal-300 font-semibold">Cashcast</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">HoneyBook</th>
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
                        <ValueCell value={row.honeybook} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Use case: photographers */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">For photographers: the HoneyBook + Cashcast stack</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Photographers are 29% of HoneyBook&apos;s user base—and they have notoriously irregular income. Wedding season pays well; winter doesn&apos;t.
              Here&apos;s how to use both tools together.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-lg font-semibold text-white">Book the client in HoneyBook</h3>
                <p className="mt-2 text-zinc-400 text-sm">
                  Send proposals, sign contracts, schedule sessions. HoneyBook handles the relationship.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-white">Invoice in HoneyBook</h3>
                <p className="mt-2 text-zinc-400 text-sm">
                  Send invoices, collect deposits, track payments. Export invoice data as CSV when needed.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-white">Forecast in Cashcast</h3>
                <p className="mt-2 text-zinc-400 text-sm">
                  Import your HoneyBook invoices. See when payments will actually hit. Plan for the slow months.
                </p>
              </div>
            </div>
          </section>

          {/* Import CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 px-6 py-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="h-5 w-5 text-teal-400" />
                    <span className="text-sm text-teal-300 font-medium">Works with your existing data</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Import your HoneyBook invoices in 60 seconds
                  </h2>
                  <p className="mt-2 text-zinc-300">
                    Export invoices from HoneyBook as CSV. Upload to Cashcast. We&apos;ll convert them into income entries
                    with expected payment dates—so you can see your cash flow forecast based on real data.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/auth/signup?redirect=/dashboard/import"
                    className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    Import HoneyBook Data
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Add cash flow visibility to your workflow
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Keep using HoneyBook for client management. Add Cashcast for $7.99/mo to see when you&apos;ll actually
                have the money—and whether you can afford that new lens next month.
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
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Frequently asked questions</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Why did HoneyBook raise prices?</h3>
                <p className="mt-2 text-zinc-400">
                  In February 2025, HoneyBook increased prices by 51-89%. Starter went from $19/mo to $36/mo.
                  The company cited rising costs, but many users are frustrated and exploring alternatives.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Does HoneyBook have cash flow features?</h3>
                <p className="mt-2 text-zinc-400">
                  HoneyBook added a Cash Flow graph in late 2025, but it only shows historical data (what already happened).
                  It can&apos;t forecast your future balance or predict when invoices will get paid. That&apos;s what Cashcast does.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Cashcast a HoneyBook replacement?</h3>
                <p className="mt-2 text-zinc-400">
                  No. HoneyBook is a CRM; Cashcast is a cash flow forecaster. They solve different problems and work great together.
                  Use HoneyBook to manage clients, Cashcast to see your financial future.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I import from HoneyBook?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes! Export your invoices from HoneyBook as CSV, then upload to our import page.
                  We&apos;ll convert them into income entries so you can see your forecast immediately.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">What&apos;s the best HoneyBook alternative for photographers?</h3>
                <p className="mt-2 text-zinc-400">
                  For cash flow visibility: Cashcast ($7.99/mo). For a full CRM replacement: Dubsado or Bloom.
                  Many photographers use a lighter CRM + Cashcast to save money and gain forecasting.
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
                      47% cheaper, forward-looking forecasts
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
                      Better for freelancers than small businesses
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
                      Compare the best options for 2026
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
                href="/blog/honeybook-cash-flow-forecasting"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Does HoneyBook Have Cash Flow Forecasting?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  What HoneyBook&apos;s Cash Flow feature does (and doesn&apos;t do)
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/use-cashcast-with-honeybook"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  How to Use Cashcast with HoneyBook
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  5 ways to use both tools together
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/honeybook-alternatives-photographers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  HoneyBook Alternatives for Photographers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  3 paths forward after the 2025 price increase
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/photographer-hourly-rate"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelance Photographer Rates 2026
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Complete guide by specialty and experience
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
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
