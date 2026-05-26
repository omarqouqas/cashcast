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
  Camera,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const post = getPostBySlug('honeybook-alternatives-photographers')!;

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
      name: 'What is the best HoneyBook alternative for photographers in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best alternative depends on what you need. For full CRM replacement, Dubsado ($20-40/mo) is popular. For cash flow visibility that HoneyBook lacks, Cashcast ($7.99/mo) adds forecasting. Many photographers use a lighter CRM plus Cashcast to save money while gaining financial visibility.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are photographers leaving HoneyBook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main reasons are the 51-89% price increase in February 2025 (Starter went from $19 to $36/mo), feature bloat for solo photographers who do not need all the CRM features, and the lack of cash flow forecasting to manage seasonal income.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Dubsado better than HoneyBook for photographers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dubsado offers similar CRM features at a lower price ($20-40/mo vs $36-109/mo). It is highly customizable but has a steeper learning curve. Neither Dubsado nor HoneyBook offers cash flow forecasting, so photographers with seasonal income may want to add a tool like Cashcast regardless of which CRM they choose.',
      },
    },
  ],
};

export default function HoneyBookAlternativesPhotographersPage() {
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
            { name: 'HoneyBook Alternatives', url: `https://cashcast.money/blog/${post.slug}` },
          ]}
          className="mb-8"
        />

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-3 py-1 rounded-full border bg-teal-500/10 text-teal-300 border-teal-500/20">
              {post.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
              Updated for 2026
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
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-rose-400" />
                <span className="font-medium text-rose-300">February 2025 Price Increase</span>
              </div>
              <p className="text-zinc-300 text-sm">
                HoneyBook raised prices by 51-89%. Starter went from $19/mo to $36/mo. Essentials from $39/mo to $59/mo.
                Many photographers are re-evaluating whether they need all those features—or if simpler, cheaper tools would work.
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4">
              If you&apos;re a photographer considering alternatives to HoneyBook, you have three paths:
            </p>

            <ol className="space-y-2 text-zinc-300 mb-6">
              <li><strong className="text-white">1. Full CRM replacement</strong> — Switch to Dubsado, Bloom, or Sprout Studio</li>
              <li><strong className="text-white">2. Lighter stack</strong> — Use simpler tools (Google Forms + Stripe + Cashcast)</li>
              <li><strong className="text-white">3. Keep HoneyBook + add forecasting</strong> — Fill the cash flow gap with Cashcast</li>
            </ol>

            <p className="text-zinc-300 leading-relaxed">
              This guide breaks down each option with real pricing and trade-offs.
            </p>
          </section>

          {/* Option 1: Full CRM Replacement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Option 1: Full CRM Replacement</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              If you need the full CRM experience—client pipelines, contracts, proposals, scheduling—these are the main alternatives:
            </p>

            {/* Dubsado */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Dubsado</h3>
                <span className="text-sm text-emerald-400 font-medium">$20-40/mo</span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                The most popular HoneyBook alternative. Similar features, highly customizable, lower price.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-400 font-medium mb-2">Pros</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• 44-63% cheaper than HoneyBook</li>
                    <li>• Highly customizable workflows</li>
                    <li>• Free tier available (3 clients)</li>
                    <li>• Strong photographer community</li>
                  </ul>
                </div>
                <div>
                  <p className="text-rose-400 font-medium mb-2">Cons</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Steeper learning curve</li>
                    <li>• No cash flow forecasting</li>
                    <li>• Setup takes longer</li>
                    <li>• Mobile app is limited</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bloom */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Bloom</h3>
                <span className="text-sm text-amber-400 font-medium">$29-79/mo</span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Built specifically for photographers. Includes galleries, which HoneyBook doesn&apos;t have.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-400 font-medium mb-2">Pros</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Built-in client galleries</li>
                    <li>• Photography-specific features</li>
                    <li>• Clean, modern interface</li>
                    <li>• Good contract templates</li>
                  </ul>
                </div>
                <div>
                  <p className="text-rose-400 font-medium mb-2">Cons</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Similar price to HoneyBook</li>
                    <li>• No cash flow forecasting</li>
                    <li>• Smaller user community</li>
                    <li>• Less customizable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sprout Studio */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sprout Studio</h3>
                <span className="text-sm text-amber-400 font-medium">$34-58/mo</span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                All-in-one for photographers: CRM, galleries, bookkeeping, and contracts in one tool.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-400 font-medium mb-2">Pros</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Includes bookkeeping features</li>
                    <li>• Built-in galleries</li>
                    <li>• Photography-focused</li>
                    <li>• Studio management tools</li>
                  </ul>
                </div>
                <div>
                  <p className="text-rose-400 font-medium mb-2">Cons</p>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Similar price to HoneyBook</li>
                    <li>• No cash flow forecasting</li>
                    <li>• Can feel bloated for solos</li>
                    <li>• Learning curve</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <p className="text-zinc-300 text-sm">
                <strong className="text-amber-300">Note:</strong> None of these CRM alternatives offer cash flow forecasting.
                If seasonal income visibility is your main pain point, switching CRMs won&apos;t solve it.
              </p>
            </div>
          </section>

          {/* Option 2: Lighter Stack */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Option 2: The Lighter Stack</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Many solo photographers don&apos;t need a full CRM. If you book 20-50 clients per year and manage
              them via email, you might be paying $400+/year for features you don&apos;t use.
            </p>

            <p className="text-zinc-300 leading-relaxed mb-4">
              The lighter stack approach:
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Need</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Tool</th>
                    <th className="px-4 py-3 text-left text-zinc-300 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Booking inquiries</td>
                    <td className="px-4 py-3 text-zinc-400">Google Forms or Typeform</td>
                    <td className="px-4 py-3 text-emerald-400">Free</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Contracts</td>
                    <td className="px-4 py-3 text-zinc-400">HelloSign or DocuSign</td>
                    <td className="px-4 py-3 text-zinc-400">$15-25/mo</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Invoicing & payments</td>
                    <td className="px-4 py-3 text-zinc-400">Stripe Invoicing or Cashcast</td>
                    <td className="px-4 py-3 text-zinc-400">2.9% + free or $7.99/mo</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Cash flow forecasting</td>
                    <td className="px-4 py-3 text-zinc-400">Cashcast</td>
                    <td className="px-4 py-3 text-teal-400">$7.99/mo</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-200">Galleries</td>
                    <td className="px-4 py-3 text-zinc-400">Pic-Time or Pixieset</td>
                    <td className="px-4 py-3 text-zinc-400">$0-20/mo</td>
                  </tr>
                  <tr className="bg-zinc-900/40">
                    <td className="px-4 py-3 text-white font-medium" colSpan={2}>Total</td>
                    <td className="px-4 py-3 text-white font-medium">$23-53/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              This stack costs <strong className="text-emerald-400">36-53% less than HoneyBook Starter</strong> and includes
              something HoneyBook doesn&apos;t: cash flow forecasting for your seasonal income.
            </p>
          </section>

          {/* Option 3: Keep HoneyBook + Add Forecasting */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Option 3: Keep HoneyBook + Add Forecasting</h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              If you&apos;re happy with HoneyBook&apos;s CRM features but struggling with cash flow visibility during
              off-season, you don&apos;t need to switch. Just add the missing piece.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-3">What HoneyBook does well</h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <span>Client pipeline management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <span>Beautiful proposals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <span>Contracts + e-signatures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <span>Automated workflows</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
                <h3 className="font-semibold text-white mb-3">What Cashcast adds</h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                    <span>365-day cash flow forecast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                    <span>Bill tracking and alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                    <span>&quot;Can I Afford It?&quot; tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                    <span>Low balance warnings</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white">Total cost:</strong> HoneyBook Starter ($36/mo) + Cashcast Pro ($7.99/mo) = <strong className="text-white">$43.99/mo</strong>.
              Or get Cashcast Lifetime ($99 one-time) to lock in the price forever.
            </p>
          </section>

          {/* Which Option is Right for You */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Which Option is Right for You?</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Choose full CRM replacement if...</h3>
                </div>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>• You want similar features at a lower price</li>
                  <li>• You have time to learn a new system</li>
                  <li>• You don&apos;t mind migrating client data</li>
                  <li>• Cash flow forecasting isn&apos;t your main concern</li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Choose the lighter stack if...</h3>
                </div>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>• You book fewer than 50 clients/year</li>
                  <li>• You manage most communication via email</li>
                  <li>• You want to minimize subscription costs</li>
                  <li>• Cash flow visibility is a priority</li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Keep HoneyBook + add Cashcast if...</h3>
                </div>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>• You&apos;re happy with HoneyBook&apos;s CRM features</li>
                  <li>• You don&apos;t want to migrate your data</li>
                  <li>• Seasonal cash flow is your main pain point</li>
                  <li>• You want cash flow visibility without switching tools</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">What is the best HoneyBook alternative for photographers?</h3>
                <p className="text-zinc-400 text-sm">
                  It depends on your needs. For full CRM: Dubsado ($20-40/mo). For cash flow visibility:
                  Cashcast ($7.99/mo). Many photographers use a lighter CRM + Cashcast to save money while
                  gaining financial forecasting.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Is Dubsado better than HoneyBook?</h3>
                <p className="text-zinc-400 text-sm">
                  Dubsado is 44-63% cheaper with similar features, but has a steeper learning curve.
                  Neither offers cash flow forecasting, so photographers with seasonal income may need
                  an additional tool regardless.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">Why doesn&apos;t HoneyBook have cash flow forecasting?</h3>
                <p className="text-zinc-400 text-sm">
                  HoneyBook is a CRM, not a financial planning tool. It tracks client relationships and invoices,
                  but doesn&apos;t track your bills, project future balances, or alert you before cash crunches.
                  That&apos;s why many photographers add a dedicated forecasting tool.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-zinc-900/40 p-6 md:p-8 mt-12">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Built for seasonal income</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
              See Your Financial Future—Not Just Your Invoices
            </h2>
            <p className="text-zinc-300 mb-6">
              Whether you keep HoneyBook or switch to something else, Cashcast adds the cash flow visibility
              photographers need. See your projected balance through wedding season and beyond. Start free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/compare/honeybook"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                HoneyBook Comparison
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
                  Cash Flow Forecasting for HoneyBook Users
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  What HoneyBook is missing and how to add it
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
