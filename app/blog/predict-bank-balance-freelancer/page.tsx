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
  TrendingUp,
  ArrowRight,
  Eye,
  Calculator,
  Sparkles,
} from 'lucide-react';

const post = getPostBySlug('predict-bank-balance-freelancer')!;

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
      name: 'Can you really predict your bank balance accurately?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, with reasonable accuracy for the short term (1-4 weeks) and useful estimates for the medium term (1-3 months). The key is entering realistic expected payment dates (not invoice dates) and all recurring bills. Long-term predictions (6+ months) become less precise but still help with planning.',
      },
    },
    {
      '@type': 'Question',
      name: 'What information do I need to predict my bank balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need: (1) Your current bank balance, (2) All expected income with realistic payment dates, (3) All recurring bills with their due dates and amounts, and (4) Any one-time expenses you know about. The more complete your data, the more accurate your forecast.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far ahead can I predict my bank balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most cash flow tools let you forecast 90-365 days ahead. Short-term forecasts (next 30 days) are most accurate because you know exactly which bills are coming. Longer forecasts help with planning but require assumptions about future income that may change.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a budget and a bank balance forecast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A budget shows monthly totals (you plan to spend $500 on food). A bank balance forecast shows day-by-day projections (on March 15, you will have $2,340). Budgets answer "Am I spending too much?" Forecasts answer "Will I have enough on the 15th to pay rent?"',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Predict Your Bank Balance as a Freelancer',
  description: 'A step-by-step guide to forecasting your future bank balance with irregular income.',
  totalTime: 'PT15M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Start with Your Current Balance',
      text: 'Note your current checking account balance. This is your starting point for the forecast.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'List All Expected Income',
      text: 'Enter all income you expect to receive, including invoices, retainers, and recurring payments. Use realistic payment dates based on client history, not invoice dates.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Add All Recurring Bills',
      text: 'Enter every recurring expense: rent, subscriptions, insurance, utilities, loan payments. Include the exact due date and amount for each.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Add Known One-Time Expenses',
      text: 'Include any upcoming one-time expenses: tax payments, equipment purchases, annual fees, or planned large purchases.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Review the Day-by-Day Projection',
      text: 'Look at your projected balance for each day. Identify low points where you might need to take action: follow up on invoices, delay purchases, or transfer from savings.',
    },
  ],
};

export default function PredictBankBalancePage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            breadcrumbs.home,
            breadcrumbs.blog,
            { name: 'Predict Bank Balance', url: `https://cashcast.money/blog/${post.slug}` },
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

          {/* The Question */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">The Question Every Freelancer Asks</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              <em>&quot;What will my bank balance be on the 15th?&quot;</em>
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              As a freelancer, you need to answer this question constantly. Before making a purchase.
              Before taking on a new project with payment 60 days out. Before deciding if you can afford
              to take a week off.
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Employees can answer easily—they know exactly when their paycheck arrives.
              But with irregular income, you&apos;re left guessing. Or worse, checking your bank app daily
              and hoping for the best.
            </p>

            <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 my-6">
              <div className="flex gap-3">
                <Eye className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 text-sm">
                    <strong className="text-teal-300">The solution:</strong> Stop guessing.
                    With a simple cash flow forecast, you can predict your bank balance for any future date—with
                    surprising accuracy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Budget vs Forecast */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Budget vs. Bank Balance Forecast</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Most freelancers try to use a budget to manage money. But budgets and forecasts answer different questions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Budget (Monthly)</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">Shows monthly totals</p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• &quot;I plan to spend $500 on food&quot;</li>
                  <li>• &quot;My income should be ~$5,000&quot;</li>
                  <li>• Works backward from the past</li>
                  <li>• Answers: &quot;Am I overspending?&quot;</li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Forecast (Day-by-Day)</h3>
                </div>
                <p className="text-sm text-teal-300 mb-3">Shows daily balance projections</p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>• &quot;On March 15, I&apos;ll have $2,340&quot;</li>
                  <li>• &quot;My lowest point is March 22&quot;</li>
                  <li>• Looks forward to the future</li>
                  <li>• Answers: &quot;Can I afford this?&quot;</li>
                </ul>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              For freelancers with irregular income, day-by-day forecasting is far more useful than monthly budgets.
              You need to know if you&apos;ll have money on <em>specific dates</em> when specific bills are due.
            </p>
          </section>

          {/* How to Predict */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">How to Predict Your Bank Balance (5 Steps)</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Here&apos;s the process to forecast your future balance. You can do this in a spreadsheet,
              or use a dedicated cash flow app that automates the math.
            </p>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">1</div>
                  <h3 className="font-semibold text-white">Start with Your Current Balance</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  Check your bank account right now. This is day zero of your forecast.
                  Example: $3,500 in checking.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">2</div>
                  <h3 className="font-semibold text-white">List All Expected Income (with Realistic Dates)</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11 mb-3">
                  Enter every payment you expect to receive. <strong className="text-white">Critical:</strong> Use the date
                  you&apos;ll actually get paid, not the invoice date. If a client typically pays Net-30, add 30 days.
                </p>
                <div className="ml-11 text-sm text-zinc-400">
                  <p>• Retainer client: $2,000 on the 1st</p>
                  <p>• Project invoice ($3,000): ~April 15 (based on client history)</p>
                  <p>• Recurring subscription income: $500 on the 5th</p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">3</div>
                  <h3 className="font-semibold text-white">Add All Recurring Bills</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11 mb-3">
                  Enter every bill that hits regularly. Include the exact due date and amount.
                </p>
                <div className="ml-11 text-sm text-zinc-400">
                  <p>• Rent: $1,800 on the 1st</p>
                  <p>• Software subscriptions: $350 on the 5th</p>
                  <p>• Phone: $85 on the 15th</p>
                  <p>• Insurance: $200 on the 10th</p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">4</div>
                  <h3 className="font-semibold text-white">Add Known One-Time Expenses</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  Include anything coming up that&apos;s not recurring: quarterly tax payments, annual subscriptions,
                  planned equipment purchases, conference tickets, etc.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-semibold">5</div>
                  <h3 className="font-semibold text-white">Calculate the Running Balance</h3>
                </div>
                <p className="text-zinc-400 text-sm ml-11">
                  For each day, add income and subtract expenses from the previous day&apos;s balance.
                  The result is your projected balance for that day. Look for dates where the balance drops
                  dangerously low.
                </p>
              </div>
            </div>
          </section>

          {/* Accuracy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">How Accurate Is a Bank Balance Prediction?</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Accuracy depends on the time horizon and how well you know your income patterns:
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Time Horizon</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Accuracy</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">1-2 weeks</td>
                    <td className="px-4 py-3 text-emerald-400">Very high (~95%)</td>
                    <td className="px-4 py-3 text-zinc-400">Bills are fixed, income is mostly known</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">2-4 weeks</td>
                    <td className="px-4 py-3 text-emerald-400">High (~85%)</td>
                    <td className="px-4 py-3 text-zinc-400">Some income uncertainty, bills still predictable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">1-3 months</td>
                    <td className="px-4 py-3 text-amber-400">Moderate (~70%)</td>
                    <td className="px-4 py-3 text-zinc-400">More unknowns, but patterns emerge</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">3-12 months</td>
                    <td className="px-4 py-3 text-zinc-400">Directional (~50%)</td>
                    <td className="px-4 py-3 text-zinc-400">Good for planning, not precision</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Even a &quot;moderately accurate&quot; forecast is infinitely better than guessing.
              The goal isn&apos;t perfection—it&apos;s visibility. Seeing that you <em>might</em> be low on March 20
              is enough to take action, even if the exact number is off by $200.
            </p>
          </section>

          {/* AI Enhancement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Making Predictions Smarter with AI</h2>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Basic forecasting uses simple math: balance + income - expenses. But modern tools can improve accuracy:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monte Carlo Simulations</p>
                  <p className="text-sm text-zinc-400">Run thousands of scenarios with varying payment timing to show probability ranges (e.g., &quot;80% chance your balance stays above $1,000&quot;)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Pattern Recognition</p>
                  <p className="text-sm text-zinc-400">Learn from your history—if a client always pays 5 days late, adjust future predictions automatically</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calculator className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Confidence Bands</p>
                  <p className="text-sm text-zinc-400">Show best-case, expected, and worst-case projections so you can plan for uncertainty</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Can you really predict your bank balance accurately?</h3>
                <p className="text-zinc-400 text-sm">
                  Yes, with reasonable accuracy for the short term (1-4 weeks) and useful estimates for the medium term (1-3 months).
                  The key is entering realistic expected payment dates and all recurring bills.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">What information do I need?</h3>
                <p className="text-zinc-400 text-sm">
                  Your current balance, all expected income with realistic payment dates, all recurring bills with due dates,
                  and any known one-time expenses. The more complete your data, the better your forecast.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Should I use a spreadsheet or an app?</h3>
                <p className="text-zinc-400 text-sm">
                  Spreadsheets work but require manual updates. Dedicated cash flow apps auto-repeat recurring entries,
                  send low-balance alerts, and save hours of maintenance. Most freelancers find apps worth the small cost.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">How often should I update my forecast?</h3>
                <p className="text-zinc-400 text-sm">
                  Check weekly and update whenever something changes: new invoice sent, payment received, unexpected expense.
                  The forecast is only useful if it reflects reality.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 p-6 md:p-8 mt-12">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">See your financial future</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
              Know Your Balance for Any Future Date
            </h2>
            <p className="text-zinc-300 mb-6">
              Cashcast shows your projected bank balance for any day up to a year ahead.
              Enter your income and bills once, and we&apos;ll calculate the rest—with AI-powered probability
              ranges that account for payment timing uncertainty.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                Learn More About Forecasting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Related articles */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog/avoid-overdraft-freelancer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  How to Avoid Overdraft as a Freelancer
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  5 strategies to never bounce a payment
                </p>
              </Link>
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
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
