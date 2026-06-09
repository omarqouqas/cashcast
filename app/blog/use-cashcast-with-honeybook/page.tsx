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
  ArrowRight,
  Users,
  TrendingUp,
  Bell,
  FileSpreadsheet,
} from 'lucide-react';

const post = getPostBySlug('use-cashcast-with-honeybook')!;

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
  '@type': 'HowTo',
  name: post.title,
  description: post.description,
  step: [
    {
      '@type': 'HowToStep',
      name: 'Use HoneyBook for client management',
      text: 'Manage inquiries, send proposals, sign contracts, and create invoices in HoneyBook.',
    },
    {
      '@type': 'HowToStep',
      name: 'Export invoice data from HoneyBook',
      text: 'Export your invoices and payment data as CSV from HoneyBook.',
    },
    {
      '@type': 'HowToStep',
      name: 'Import into Cashcast',
      text: 'Import your HoneyBook invoice data into Cashcast to see expected income.',
    },
    {
      '@type': 'HowToStep',
      name: 'Add your bills and expenses',
      text: 'Enter your recurring bills like rent, software, and insurance into Cashcast.',
    },
    {
      '@type': 'HowToStep',
      name: 'View your cash flow forecast',
      text: 'See your projected bank balance for any day up to 365 days ahead.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I use Cashcast and HoneyBook together?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Cashcast and HoneyBook serve different purposes and work great together. HoneyBook handles client relationships and invoicing; Cashcast handles cash flow forecasting and financial planning. Many photographers and freelancers use both.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Cashcast integrate with HoneyBook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no direct API integration since HoneyBook does not offer a public API. However, you can export your HoneyBook invoices as CSV and import them into Cashcast to sync your expected income with your cash flow forecast.',
      },
    },
  ],
};

export default function UseCashcastWithHoneyBookPage() {
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
            { name: 'Use With HoneyBook', url: `https://cashcast.money/blog/${post.slug}` },
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

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Two Tools, Two Jobs</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              HoneyBook and Cashcast aren&apos;t competitors—they&apos;re teammates. Each handles a different part
              of your freelance business:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-white">HoneyBook</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">&quot;Help me manage clients and close deals&quot;</p>
                <ul className="space-y-1.5 text-sm text-zinc-300">
                  <li>• Client CRM and pipelines</li>
                  <li>• Proposals and contracts</li>
                  <li>• Invoicing and payments</li>
                  <li>• Scheduling and automation</li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Cashcast</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">&quot;Help me see my financial future&quot;</p>
                <ul className="space-y-1.5 text-sm text-zinc-300">
                  <li>• Cash flow forecasting</li>
                  <li>• Bill tracking</li>
                  <li>• Low balance alerts</li>
                  <li>• &quot;Can I Afford It?&quot; tool</li>
                </ul>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Together, they give you complete visibility: HoneyBook shows you what you&apos;re <em>owed</em>,
              Cashcast shows you when you&apos;ll actually <em>have</em> the money.
            </p>
          </section>

          {/* 5 Ways to Use Them Together */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">5 Ways to Use Cashcast Alongside HoneyBook</h2>

            {/* Way 1 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg">1</div>
                <h3 className="text-lg font-semibold text-white">Turn Invoices Into Cash Flow Projections</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                When you create an invoice in HoneyBook, add it as expected income in Cashcast. But here&apos;s the key:
                <strong className="text-white"> use a realistic payment date</strong>, not the due date.
              </p>
              <div className="bg-zinc-950/50 rounded-lg p-4 text-sm">
                <p className="text-zinc-400 mb-2"><strong className="text-zinc-200">Example:</strong></p>
                <p className="text-zinc-400">
                  You invoice a client $2,500 with Net 30 terms. History tells you this client usually pays around day 45.
                  In Cashcast, set the expected date to 45 days out—not 30. Now your forecast reflects reality.
                </p>
              </div>
            </div>

            {/* Way 2 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg">2</div>
                <h3 className="text-lg font-semibold text-white">Track Bills HoneyBook Doesn&apos;t Know About</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                HoneyBook only sees money coming <em>in</em>. It doesn&apos;t track the money going <em>out</em>.
                Use Cashcast to track all your recurring expenses:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Rent / mortgage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Software subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Insurance premiums</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Equipment loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Utilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Cloud storage</span>
                </li>
              </ul>
            </div>

            {/* Way 3 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg">3</div>
                <h3 className="text-lg font-semibold text-white">Get Warned Before Cash Crunches</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                HoneyBook can&apos;t tell you when your bank account will dip dangerously low. Cashcast can.
                Set up <strong className="text-white">low balance alerts</strong> to get notified via email, SMS,
                or push notification when your projected balance falls below a threshold.
              </p>
              <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Bell className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-zinc-300">
                  &quot;Your balance is projected to drop below $500 on March 15th.&quot;
                </p>
              </div>
            </div>

            {/* Way 4 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg">4</div>
                <h3 className="text-lg font-semibold text-white">Plan Equipment Purchases Around Payment Dates</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                Need a new lens? Camera body? Lighting kit? Use Cashcast&apos;s &quot;Can I Afford It?&quot; tool
                to check if the purchase is safe—and <em>when</em> the best time to buy would be.
              </p>
              <div className="bg-zinc-950/50 rounded-lg p-4 text-sm">
                <p className="text-zinc-400 mb-2"><strong className="text-zinc-200">Example:</strong></p>
                <p className="text-zinc-400">
                  You want to buy a $1,200 lens. Cashcast shows you&apos;d overdraft if you buy today,
                  but after your wedding client pays on the 20th, you&apos;ll have $3,400 buffer. Buy it then.
                </p>
              </div>
            </div>

            {/* Way 5 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg">5</div>
                <h3 className="text-lg font-semibold text-white">Survive the Off-Season</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                For photographers, wedding season ends and winter hits. Use Cashcast to forecast <em>months ahead</em>
                and see exactly when money will run tight. Then you can:
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Save more during peak season when you see the January dip coming</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Schedule mini-sessions or headshot days to fill income gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Adjust payment terms to pull income forward (50% deposits instead of 30%)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How to Import HoneyBook Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">How to Import Your HoneyBook Data</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              While there&apos;s no direct integration (HoneyBook doesn&apos;t offer a public API), you can
              easily import your invoice data via CSV:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-white">Export from HoneyBook</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Go to Reports → Invoices → Export as CSV. This gives you a spreadsheet with all your invoice data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-white">Import into Cashcast</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Go to Dashboard → Import → Upload your CSV. Map the amount and date columns, and we&apos;ll create income entries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-white">Adjust Payment Dates</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Review the imported entries and set realistic expected payment dates based on each client&apos;s history.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">4</div>
                <div>
                  <p className="font-medium text-white">See Your Forecast</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    View your calendar to see projected balance for any day. Add your bills to complete the picture.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">What Does This Stack Cost?</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              After HoneyBook&apos;s 2025 price increase, here&apos;s what the combined stack looks like:
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Tool</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Monthly</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Yearly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">HoneyBook Starter</td>
                    <td className="px-4 py-3 text-zinc-400">$36/mo</td>
                    <td className="px-4 py-3 text-zinc-400">$390/yr</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Cashcast Pro</td>
                    <td className="px-4 py-3 text-teal-400">$7.99/mo</td>
                    <td className="px-4 py-3 text-teal-400">$79/yr</td>
                  </tr>
                  <tr className="bg-zinc-900/40">
                    <td className="px-4 py-3 text-white font-medium">Total</td>
                    <td className="px-4 py-3 text-white font-medium">$43.99/mo</td>
                    <td className="px-4 py-3 text-white font-medium">$469/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-400 text-sm mt-4">
              Or get Cashcast Lifetime ($249 one-time) and pay $390/yr total going forward.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Can I use Cashcast and HoneyBook together?</h3>
                <p className="text-zinc-400 text-sm">
                  Yes! They serve different purposes and work great together. HoneyBook handles client relationships;
                  Cashcast handles financial forecasting. Many photographers use both.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Does Cashcast integrate directly with HoneyBook?</h3>
                <p className="text-zinc-400 text-sm">
                  There&apos;s no direct API integration since HoneyBook doesn&apos;t offer a public API.
                  However, CSV export/import works well for syncing invoice data.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Do I need both tools?</h3>
                <p className="text-zinc-400 text-sm">
                  If you&apos;re happy with HoneyBook for client management but struggle with cash flow visibility,
                  adding Cashcast fills that gap. If you only need simple invoicing, Cashcast&apos;s built-in invoicing
                  might be enough and you could skip HoneyBook entirely.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 p-6 md:p-8 mt-12">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Works with your HoneyBook data</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
              Add Cash Flow Visibility to Your HoneyBook Workflow
            </h2>
            <p className="text-zinc-300 mb-6">
              Keep using HoneyBook for what it does best. Add Cashcast to see when you&apos;ll actually have the money—and
              whether you can afford that new lens next month. Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/compare/honeybook"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                Full Comparison
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Related articles */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog/honeybook-cash-flow-forecasting"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Does HoneyBook Have Cash Flow Forecasting?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  What HoneyBook&apos;s Cash Flow feature actually does (and doesn&apos;t do)
                </p>
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
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
