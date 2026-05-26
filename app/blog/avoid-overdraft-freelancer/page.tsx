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
  AlertTriangle,
  Bell,
  PiggyBank,
  ArrowRight,
  DollarSign,
  Shield,
} from 'lucide-react';

const post = getPostBySlug('avoid-overdraft-freelancer')!;

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
      name: 'Why do freelancers overdraft more than employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelancers have irregular income - payments arrive unpredictably while bills hit on fixed dates. A client paying 2 weeks late can cause an overdraft even if you technically earned enough money. Employees get predictable paychecks that align with their bills.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much buffer should a freelancer keep to avoid overdrafts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most financial advisors recommend keeping 1-3 months of expenses as a buffer in your checking account. For freelancers with highly variable income (like photographers or event professionals), aim for 3 months. This covers gaps between invoice payments and unexpected slow periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best way to predict overdrafts before they happen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a cash flow forecasting tool that shows your projected balance day-by-day. Enter your expected income (with realistic payment dates, not invoice dates) and all recurring bills. The forecast will show low-balance days weeks in advance, giving you time to take action.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I use overdraft protection as a freelancer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Overdraft protection can help as a last resort, but it often comes with fees ($25-35 per overdraft) or high interest rates. It is better to prevent overdrafts through cash flow forecasting and maintaining a buffer. Use overdraft protection as insurance, not a regular safety net.',
      },
    },
  ],
};

export default function AvoidOverdraftPage() {
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
            { name: 'Avoid Overdraft', url: `https://cashcast.money/blog/${post.slug}` },
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
            <h2 className="text-2xl font-semibold text-white mb-4">Why Freelancers Overdraft (It&apos;s Not What You Think)</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              You had a great month. You invoiced $8,000. But on the 15th, your rent check bounced.
              How is that possible?
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              <strong className="text-white">The timing problem.</strong> As a freelancer, you don&apos;t control when money arrives.
              You control when you send invoices, but clients pay on their schedule—often 30, 45, or 60 days later.
              Meanwhile, your bills hit on fixed dates whether the money has arrived or not.
            </p>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 my-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 text-sm">
                    <strong className="text-amber-300">The core issue:</strong> Most freelancers track what they&apos;re <em>owed</em>,
                    not what they&apos;ll actually <em>have</em>. An $8,000 invoice means nothing if it won&apos;t be paid until after rent is due.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Employees rarely face this problem. Their paycheck arrives like clockwork every two weeks.
              Freelancers live in a world where income is unpredictable but expenses are not.
            </p>
          </section>

          {/* The 5 Strategies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5 Ways to Never Overdraft Again</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Here&apos;s how successful freelancers avoid the overdraft trap—ranked from most to least effective.
            </p>

            {/* Strategy 1 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-white">Forecast Your Cash Flow Day-by-Day</h3>
                  <p className="text-sm text-teal-400">Most effective</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Don&apos;t just track your current balance—project your <em>future</em> balance. Enter all expected income
                (with realistic payment dates, not invoice dates) and all upcoming bills. A cash flow forecast shows you
                exactly which days you&apos;ll be low on funds—weeks before it happens.
              </p>
              <div className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>See your projected balance for any day up to a year ahead</span>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-white">Keep a Buffer in Your Checking Account</h3>
                  <p className="text-sm text-zinc-500">Essential safety net</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Maintain 1-3 months of expenses as a buffer. This absorbs the shock when a client pays late
                or a slow month hits unexpectedly. Think of it as your personal &quot;float&quot; that keeps bills covered
                while you wait for payments to arrive.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2 text-zinc-300">
                  <PiggyBank className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Low variability: 1 month buffer</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <PiggyBank className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>High variability: 3 months buffer</span>
                </div>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-white">Set Up Low Balance Alerts</h3>
                  <p className="text-sm text-zinc-500">Early warning system</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Configure alerts to notify you when your projected balance drops below a threshold (e.g., $1,000).
                This gives you time to take action—follow up on late invoices, delay a purchase, or move money from savings.
              </p>
              <div className="flex items-start gap-2 text-sm text-zinc-300">
                <Bell className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Get notified via email, SMS, or push before you hit zero</span>
              </div>
            </div>

            {/* Strategy 4 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-white">Get Paid Faster</h3>
                  <p className="text-sm text-zinc-500">Reduce the gap</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Shorten the time between work and payment. Require deposits upfront (50% is common).
                Use payment links in invoices for instant payment. Offer a small discount (2-3%) for early payment.
                Switch from Net-30 to Net-15 or due-on-receipt for smaller projects.
              </p>
              <div className="flex items-start gap-2 text-sm text-zinc-300">
                <DollarSign className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>50% deposit + payment link = money in days, not months</span>
              </div>
            </div>

            {/* Strategy 5 */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">5</div>
                <div>
                  <h3 className="font-semibold text-white">Align Bills with Income Patterns</h3>
                  <p className="text-sm text-zinc-500">Reduce collisions</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm">
                If most of your payments arrive mid-month, try to move bill due dates to the 20th instead of the 1st.
                Many companies let you change due dates. This reduces &quot;bill collisions&quot; where multiple expenses
                hit before income arrives.
              </p>
            </div>
          </section>

          {/* The Math */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">The Math: Why Timing Matters More Than Amount</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Let&apos;s look at a real example. Sarah is a freelance designer who invoices $6,000/month.
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Day</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Event</th>
                    <th className="px-4 py-3 text-right text-zinc-300 font-medium">Amount</th>
                    <th className="px-4 py-3 text-right text-zinc-300 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 1</td>
                    <td className="px-4 py-3 text-zinc-400">Starting balance</td>
                    <td className="px-4 py-3 text-right text-zinc-400">—</td>
                    <td className="px-4 py-3 text-right text-emerald-400">$2,500</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 1</td>
                    <td className="px-4 py-3 text-zinc-400">Rent</td>
                    <td className="px-4 py-3 text-right text-rose-400">-$1,800</td>
                    <td className="px-4 py-3 text-right text-zinc-200">$700</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 5</td>
                    <td className="px-4 py-3 text-zinc-400">Software subscriptions</td>
                    <td className="px-4 py-3 text-right text-rose-400">-$350</td>
                    <td className="px-4 py-3 text-right text-zinc-200">$350</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 10</td>
                    <td className="px-4 py-3 text-zinc-400">Car insurance</td>
                    <td className="px-4 py-3 text-right text-rose-400">-$200</td>
                    <td className="px-4 py-3 text-right text-amber-400">$150</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 15</td>
                    <td className="px-4 py-3 text-zinc-400">Phone bill</td>
                    <td className="px-4 py-3 text-right text-rose-400">-$85</td>
                    <td className="px-4 py-3 text-right text-amber-400">$65</td>
                  </tr>
                  <tr className="bg-rose-500/10">
                    <td className="px-4 py-3 text-zinc-200">March 18</td>
                    <td className="px-4 py-3 text-zinc-400">Utilities</td>
                    <td className="px-4 py-3 text-right text-rose-400">-$150</td>
                    <td className="px-4 py-3 text-right text-rose-400 font-medium">-$85 ❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">March 25</td>
                    <td className="px-4 py-3 text-zinc-400">Client payment arrives</td>
                    <td className="px-4 py-3 text-right text-emerald-400">+$3,500</td>
                    <td className="px-4 py-3 text-right text-emerald-400">$3,415</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Sarah <em>earned</em> enough money. The $3,500 payment was coming. But it arrived 7 days too late.
              Result: overdraft fees, embarrassment, and stress.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white">The fix:</strong> If Sarah had forecast her cash flow, she would have seen
              the March 18 danger zone two weeks in advance. She could have followed up with the client, dipped into savings,
              or delayed a non-essential purchase.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Why do freelancers overdraft more than employees?</h3>
                <p className="text-zinc-400 text-sm">
                  Freelancers have irregular income—payments arrive unpredictably while bills hit on fixed dates.
                  A client paying 2 weeks late can cause an overdraft even if you technically earned enough money.
                  Employees get predictable paychecks that align with their bills.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">How much buffer should a freelancer keep?</h3>
                <p className="text-zinc-400 text-sm">
                  Most advisors recommend 1-3 months of expenses. For freelancers with highly variable income
                  (photographers, event professionals, seasonal businesses), aim for 3 months. This covers
                  gaps between payments and unexpected slow periods.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Should I use overdraft protection?</h3>
                <p className="text-zinc-400 text-sm">
                  Overdraft protection can help as a last resort, but it often comes with fees ($25-35 per overdraft)
                  or high interest. It&apos;s better to prevent overdrafts through forecasting and buffers.
                  Use overdraft protection as insurance, not a regular safety net.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">What&apos;s the best tool to predict overdrafts?</h3>
                <p className="text-zinc-400 text-sm">
                  A cash flow forecasting app that shows your projected balance day-by-day. Unlike budgeting apps
                  that show monthly totals, a cash flow calendar shows exactly which days you&apos;ll be low—giving you
                  time to take action before it happens.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 p-6 md:p-8 mt-12">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Prevent overdrafts before they happen</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
              See Your Future Balance—Not Just Your Current One
            </h2>
            <p className="text-zinc-300 mb-6">
              Cashcast shows your projected bank balance for any day up to a year ahead.
              Enter your bills and expected income, and we&apos;ll alert you before your balance drops too low.
              Stop reacting to overdrafts—prevent them.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/tools/can-i-afford-it"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                Try &quot;Can I Afford It?&quot;
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
                href="/blog/freelancer-emergency-fund-how-much"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelancer Emergency Fund: How Much?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Calculate your ideal safety buffer
                </p>
              </Link>
              <Link
                href="/blog/how-to-manage-irregular-income-as-freelancer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  How to Manage Irregular Income
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Strategies for unpredictable paychecks
                </p>
              </Link>
              <Link
                href="/blog/what-is-safe-to-spend"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  What Is Safe to Spend?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  One number that answers &quot;Can I afford this?&quot;
                </p>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
