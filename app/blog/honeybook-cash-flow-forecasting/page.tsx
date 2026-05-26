import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog/posts';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  ArrowRight,
} from 'lucide-react';

const post = getPostBySlug('honeybook-cash-flow-forecasting')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: {
    canonical: `https://cashcast.money/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://cashcast.money/blog/${post.slug}`,
    siteName: 'Cashcast',
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author.name],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: {
    '@type': 'Organization',
    name: post.author.name,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Cashcast',
    url: 'https://cashcast.money',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://cashcast.money/blog/${post.slug}`,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does HoneyBook have cash flow forecasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. HoneyBook is a CRM focused on client management, contracts, and invoicing. It shows you who owes you money but cannot forecast when payments will arrive or what your bank balance will be on any future date. You need a dedicated cash flow tool like Cashcast to fill this gap.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I forecast cash flow as a HoneyBook user?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Export your invoices from HoneyBook as CSV, then import them into a cash flow forecasting tool like Cashcast. This lets you see when invoice payments will actually hit your bank account, track bills, and forecast your balance up to 365 days ahead.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do freelancers need cash flow forecasting alongside HoneyBook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HoneyBook tells you what you are owed but not when you will have the money. For freelancers with irregular income, knowing your future bank balance is critical for planning large purchases, avoiding overdrafts, and managing seasonal slow periods.',
      },
    },
  ],
};

export default function HoneyBookCashFlowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            breadcrumbs.home,
            breadcrumbs.blog,
            { name: 'HoneyBook Cash Flow', url: `https://cashcast.money/blog/${post.slug}` },
          ]}
          className="mb-8"
        />

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-3 py-1 rounded-full border bg-teal-500/10 text-teal-300 border-teal-500/20">
              {post.category}
            </span>
          </div>

          <h1 className="speakable-headline text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="speakable-summary mt-4 text-lg text-zinc-300 leading-relaxed">
            {post.description}
          </p>

          <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-invert prose-zinc max-w-none">

          {/* The Problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">The Question HoneyBook Can&apos;t Answer</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              You&apos;re a photographer. You just booked a $3,000 wedding. The client signed the contract in HoneyBook,
              and you sent the invoice. HoneyBook shows you the outstanding balance clear as day.
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              But here&apos;s the question HoneyBook can&apos;t answer: <strong className="text-white">Will you be able to pay rent on the 1st?</strong>
            </p>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 my-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 text-sm">
                    <strong className="text-amber-300">The gap:</strong> HoneyBook tracks <em>what</em> you&apos;re owed.
                    It doesn&apos;t track <em>when</em> you&apos;ll have the money, your upcoming bills, or your projected balance.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              That $3,000 invoice might not get paid until after the wedding—60 days from now. Meanwhile,
              rent is due in 10 days, your software subscriptions hit next week, and you need to buy equipment
              for an upcoming shoot. Without cash flow visibility, you&apos;re flying blind.
            </p>
          </section>

          {/* What Cash Flow Forecasting Does */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">What Cash Flow Forecasting Actually Does</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Cash flow forecasting answers one simple question: <strong className="text-white">What will my bank balance be on any given day?</strong>
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              A good cash flow tool takes your current balance, adds expected income (with realistic payment dates),
              subtracts upcoming bills, and shows you a day-by-day projection of your financial future.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <h3 className="font-semibold text-white">Without Forecasting</h3>
                </div>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>&quot;I have $5,000 in my account&quot;</li>
                  <li>&quot;I&apos;m owed $8,000 in invoices&quot;</li>
                  <li>&quot;I <em>think</em> I can afford this...&quot;</li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">With Forecasting</h3>
                </div>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>&quot;On March 15, I&apos;ll have $2,340&quot;</li>
                  <li>&quot;Rent drops me to $840 on the 1st&quot;</li>
                  <li>&quot;I can afford this after March 20&quot;</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why HoneyBook Doesn't Do This */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Why HoneyBook Doesn&apos;t Offer Cash Flow Forecasting</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              HoneyBook is a <strong className="text-white">client relationship management (CRM)</strong> tool. It&apos;s designed to help you:
            </p>

            <ul className="space-y-2 text-zinc-300 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Manage client inquiries and bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Send contracts with e-signatures</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Create and send invoices</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Automate follow-ups and workflows</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed mb-4">
              What HoneyBook <em>doesn&apos;t</em> do:
            </p>

            <ul className="space-y-2 text-zinc-300 mb-6">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <span>Track your personal/business bills (rent, software, insurance)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <span>Show your projected bank balance</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <span>Alert you before you overdraft</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <span>Help you answer &quot;Can I afford this?&quot;</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed">
              This isn&apos;t a criticism of HoneyBook—it&apos;s simply not what the tool was built for.
              You wouldn&apos;t expect your camera to also be your accounting software.
            </p>
          </section>

          {/* The Photographer's Cash Flow Problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">The Photographer&apos;s Cash Flow Problem</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Photographers (29% of HoneyBook users) face a unique cash flow challenge: <strong className="text-white">extreme seasonality</strong>.
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 my-6">
              <h3 className="font-semibold text-white mb-3">Typical Photographer Income Pattern</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-400 font-medium">Peak Season (May-Oct)</p>
                  <p className="text-zinc-400">Weddings every weekend, steady bookings, deposits rolling in</p>
                </div>
                <div>
                  <p className="text-rose-400 font-medium">Off Season (Nov-Feb)</p>
                  <p className="text-zinc-400">Few bookings, living off savings, hoping invoices get paid</p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4">
              The problem? Your bills don&apos;t take the winter off. Rent, insurance, software subscriptions,
              equipment loans—these hit every month regardless of how many weddings you shot.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              Cash flow forecasting lets you see <em>months ahead</em>. You can spot the January cash crunch
              in October and plan accordingly—maybe by saving more during peak season or scheduling mini-sessions
              to fill the gap.
            </p>
          </section>

          {/* How to Add Cash Flow Forecasting */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">How to Add Cash Flow Forecasting to Your HoneyBook Workflow</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The good news: you don&apos;t have to replace HoneyBook. You can add cash flow visibility as a separate layer.
            </p>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">1</div>
                  <h3 className="font-semibold text-white">Export Your HoneyBook Invoices</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  HoneyBook lets you export invoice data as CSV. This includes amounts, clients, and payment status.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">2</div>
                  <h3 className="font-semibold text-white">Import Into a Cash Flow Tool</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  Use a tool like Cashcast to import your invoices. Add realistic expected payment dates based on your client&apos;s history.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">3</div>
                  <h3 className="font-semibold text-white">Add Your Bills and Recurring Expenses</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  Enter rent, software subscriptions, insurance, equipment payments—anything that regularly leaves your account.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">4</div>
                  <h3 className="font-semibold text-white">See Your Financial Future</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  Now you can see your projected balance for any day up to a year ahead. Spot problems before they happen.
                </p>
              </div>
            </div>
          </section>

          {/* What to Look for in a Cash Flow Tool */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">What to Look for in a Cash Flow Tool</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              If you&apos;re a HoneyBook user looking to add cash flow visibility, here are the key features to look for:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">CSV/Excel Import</p>
                  <p className="text-sm text-zinc-400">To import your HoneyBook invoice exports</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Day-by-Day Forecast</p>
                  <p className="text-sm text-zinc-400">Not just monthly totals—you need daily balance projections</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Recurring Bill Tracking</p>
                  <p className="text-sm text-zinc-400">Auto-repeat your regular expenses so you don&apos;t forget them</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Low Balance Alerts</p>
                  <p className="text-sm text-zinc-400">Get warned before you overdraft, not after</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">&quot;Can I Afford It?&quot; Tool</p>
                  <p className="text-sm text-zinc-400">Check if a purchase is safe before you make it</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Affordable Pricing</p>
                  <p className="text-sm text-zinc-400">You&apos;re already paying $36-109/mo for HoneyBook—the cash flow tool shouldn&apos;t double your costs</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Does HoneyBook have cash flow forecasting?</h3>
                <p className="text-zinc-400 text-sm">
                  No. HoneyBook is a CRM focused on client management, contracts, and invoicing. It shows you who
                  owes you money but cannot forecast when payments will arrive or what your bank balance will be
                  on any future date. You need a dedicated cash flow tool to fill this gap.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Can I connect HoneyBook to a cash flow app?</h3>
                <p className="text-zinc-400 text-sm">
                  HoneyBook doesn&apos;t have a public API, so direct integrations aren&apos;t possible. However, you can
                  export your invoice data as CSV and import it into cash flow tools like Cashcast. Some tools
                  also support Zapier connections.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Why can&apos;t I just use a spreadsheet?</h3>
                <p className="text-zinc-400 text-sm">
                  You can, but spreadsheets require constant manual updates and don&apos;t handle recurring transactions
                  well. Dedicated cash flow tools auto-repeat your bills, send alerts, and update forecasts
                  automatically—saving hours every month.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 p-6 md:p-8 mt-12">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Built for HoneyBook users</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
              See Your Cash Flow, Not Just Your Invoices
            </h2>
            <p className="text-zinc-300 mb-6">
              Cashcast adds the financial visibility HoneyBook is missing. Import your invoices, add your bills,
              and see your projected balance for any day up to a year ahead. Start free—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/compare/honeybook"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                See Full Comparison
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Related articles */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for Freelancers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why day-by-day visibility matters
                </p>
              </Link>
              <Link
                href="/blog/photographer-hourly-rate"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelance Photographer Rates 2026
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Complete pricing guide by specialty
                </p>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
