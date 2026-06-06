import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Code,
  Database,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

const post = getPostBySlug('web-developer-hourly-rate')!;

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
    modifiedTime: post.updatedAt,
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
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.speakable-headline', '.speakable-summary', '.definition-box'],
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Calculate Your Web Developer Hourly Rate',
  description:
    'A five-step method for setting a freelance web developer hourly rate based on your real costs, target income, and billable hours rather than a market average.',
  totalTime: 'PT30M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Add up your annual cost of doing business',
      text: 'Total everything you spend to operate: software subscriptions, hardware, insurance, accounting, marketing, and self-employment taxes (typically 25-30% of net income). This is the number your rate has to cover before you pay yourself.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Set your target take-home salary',
      text: 'Decide what you want to actually earn for the year after expenses and taxes. Use a salaried web developer benchmark as a floor, then add a premium for the risk and overhead of freelancing.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Estimate your real billable hours',
      text: 'A full-time year is 2,080 hours, but freelancers rarely bill more than 1,000-1,300 of them. Sales, admin, learning, and downtime are unpaid. Use a realistic billable-hours number, not the theoretical maximum.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Divide to get your baseline rate',
      text: 'Add your annual costs, taxes, and target salary, then divide by your realistic billable hours. For example, $105,000 in total needs divided by 1,200 billable hours is roughly $88 per hour.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Adjust for specialty, experience, and market',
      text: 'Move your baseline up for in-demand specialties (React, DevOps, AI integration), senior experience, and high-paying client types or regions. Move it down only if you are deliberately building a portfolio.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the average hourly rate for a web developer in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most freelance web developers charge $50-200/hour in 2026. Junior frontend developers land around $35-75/hour, mid-level full-stack developers at $75-150/hour, and senior backend or DevOps specialists at $125-250/hour. According to the annual Stack Overflow Developer Survey, rates track closely with years of experience and specialization.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I charge as a freelance web developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start from your numbers, not the market average. Add your annual business expenses, taxes (25-30% for self-employment), and target salary, then divide by your realistic billable hours (usually 1,000-1,300 per year, not 2,080). A developer needing $90,000 take-home with $15,000 in costs and 1,200 billable hours lands near $95/hour before specialty adjustments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is $50 an hour too low for a web developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '$50/hour is at the floor of the 2026 market — reasonable for a junior developer building a portfolio or working through an agency, but low for anyone mid-level or above. After self-employment taxes, software, and unpaid admin time, $50/hour gross often nets closer to $30/hour. Most mid-level freelance web developers charge $75-150/hour.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the difference in pay between frontend and backend developers?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frontend and backend rates overlap heavily, but backend and DevOps work tends to pay 10-20% more at the senior level because scaling, security, and data-integrity mistakes are expensive. Mid-level frontend devs charge roughly $75-125/hour; mid-level backend devs $85-140/hour. Full-stack developers who do both typically command the top of the range.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do React developers charge per hour?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelance React developers charge $100-175/hour in 2026, with Next.js specialists at the higher end ($110-185/hour). React remains one of the most in-demand frontend skills in the Stack Overflow Developer Survey, which keeps rates strong even as the talent pool grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I charge hourly or per project as a web developer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use hourly for open-ended work — maintenance, bug fixes, and projects with unclear scope — because it puts scope risk on the client. Use project-based pricing for defined builds, where you can quote a fixed price and keep the upside if you work efficiently. Retainers ($2,000-15,000/month) work best for ongoing relationships and the most predictable cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I know if my rate is too low?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Three signals: every prospect says yes immediately, you're fully booked but still can't cover taxes and a slow month, or your effective hourly rate after unpaid admin drops below your local market floor. If you haven't raised your rate in over a year while demand stayed steady, you're almost certainly underpriced.",
      },
    },
    {
      '@type': 'Question',
      name: 'What hourly rate do senior web developers charge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Senior freelance web developers (6-10 years) charge $125-250/hour in 2026, and leads or architects with 10+ years reach $175-300/hour. Specialty pushes this higher: AI integration, high-scale backend, and DevOps work routinely clear $200/hour for senior practitioners.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I raise my web developer hourly rate with existing clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Give 30-60 days notice, anchor the increase to delivered results, and apply it at a natural boundary like a new project or quarter. A simple script: 'Starting [date], my rate moves to $X/hour.' Then name a specific outcome you delivered. Expect to raise rates with new clients first, then bring existing ones up over time.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do web developers charge for the time they spend learning or fixing bugs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Bugs introduced during a project are normally fixed on the developer's time, not billed — that's part of delivering working software. Learning a tool specifically for a client's project is sometimes billed at a reduced rate by agreement, but general skill-building is not. This is why baseline rates build in unpaid hours: the billable year is closer to 1,200 hours than 2,080.",
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Junior (0-2 yrs)', frontend: '$35-75', backend: '$45-85', fullstack: '$50-90', devops: '$60-100' },
  { level: 'Mid-Level (3-5 yrs)', frontend: '$75-125', backend: '$85-140', fullstack: '$90-150', devops: '$110-175' },
  { level: 'Senior (6-10 yrs)', frontend: '$110-175', backend: '$125-200', fullstack: '$125-200', devops: '$150-225' },
  { level: 'Lead / Architect (10+ yrs)', frontend: '$150-225', backend: '$175-275', fullstack: '$175-275', devops: '$200-300' },
];

const ratesBySpecialty = [
  { specialty: 'React', range: '$100-175/hr', notes: 'Highest-demand frontend skill' },
  { specialty: 'Next.js', range: '$110-185/hr', notes: 'Full-stack React, SSR and edge' },
  { specialty: 'Vue / Nuxt', range: '$90-160/hr', notes: 'Strong in Europe and Asia' },
  { specialty: 'Python / Django', range: '$100-190/hr', notes: 'APIs, data, AI integration' },
  { specialty: 'Node.js', range: '$90-175/hr', notes: 'JavaScript backends, real-time' },
  { specialty: 'Ruby on Rails', range: '$100-180/hr', notes: 'Smaller pool keeps rates up' },
  { specialty: 'Mobile (React Native / Flutter)', range: '$100-200/hr', notes: 'Cross-platform apps' },
];

const ratesByLocation = [
  { location: 'US — San Francisco / Bay Area', range: '$150-300/hr', note: 'Highest US market' },
  { location: 'US — NYC / Seattle / LA', range: '$125-250/hr', note: 'Major tech hubs' },
  { location: 'US — Midwest / South', range: '$90-175/hr', note: 'Lower cost of living' },
  { location: 'US — Remote (US clients)', range: '$100-200/hr', note: 'Remote compresses the gap' },
  { location: 'UK', range: '£60-150/hr', note: '≈ $75-190/hr' },
  { location: 'Western Europe', range: '€70-160/hr', note: '≈ $75-175/hr' },
  { location: 'Latin America', range: '$40-100/hr', note: 'Popular nearshore region' },
  { location: 'India', range: '$25-70/hr', note: 'Largest offshore pool' },
];

const pricingModels = [
  { attribute: 'Best for', hourly: 'Maintenance, unclear scope', project: 'Defined builds', retainer: 'Ongoing relationships' },
  { attribute: 'How you bill', hourly: 'Per hour tracked', project: 'Fixed price per deliverable', retainer: 'Fixed monthly fee' },
  { attribute: 'Who carries scope risk', hourly: 'Client', project: 'Developer', retainer: 'Shared' },
  { attribute: 'Cash flow predictability', hourly: 'Low to medium', project: 'Lumpy (milestones)', retainer: 'High (recurring)' },
  { attribute: 'Typical range', hourly: '$50-250/hr', project: '$2k-200k+', retainer: '$2k-15k/mo' },
];

export default function WebDeveloperHourlyRatePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'Web Developer Rates', url: `https://cashcast.money/blog/${post.slug}` },
        ]}
        className="mb-8"
      />

      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-medium text-teal-400">
            {post.category}
          </span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <time dateTime={post.updatedAt || post.publishedAt}>
            Updated{' '}
            {new Date(post.updatedAt || post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1 className="speakable-headline text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="speakable-summary mt-4 text-lg text-zinc-300 leading-relaxed">{post.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-950 font-bold text-sm">
            CF
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.author.name}</p>
            <p className="text-sm text-zinc-500">{post.author.role}</p>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-zinc max-w-none">
        {/* Introduction — definitive AEO answer */}
        <p>
          Most freelance web developers charge between <strong>$50 and $200 per hour in 2026</strong>, with
          junior frontend devs at $35-75/hr, mid-level full-stack devs at $75-150/hr, and senior backend or
          DevOps specialists at $125-250/hr. Specialty, geography, and client size shift the range significantly.
          Here&apos;s the complete breakdown — including how to set yours and what to do if a client pushes back.
        </p>

        <div className="definition-box not-prose my-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">The short answer</p>
              <p className="text-zinc-300 leading-relaxed">
                A typical 2026 freelance web developer rate is{' '}
                <strong className="text-teal-300">$75-175/hour</strong> for mid-to-senior US developers.
                Specialized work — AI integration, high-scale backend, DevOps — runs{' '}
                <strong className="text-teal-300">$150-300/hour</strong>. Junior and offshore developers start
                lower, around $25-75/hour.
              </p>
            </div>
          </div>
        </div>

        <p>
          Those numbers come from market data rather than guesswork. The{' '}
          <a
            href="https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            U.S. Bureau of Labor Statistics
          </a>{' '}
          reports a median wage around $85,000/year for salaried web developers — but a staff salary and a
          freelance hourly rate are not the same thing. Freelancers have to cover their own taxes, benefits,
          downtime, and unpaid admin, which is why the hourly figure looks high until you do the math. Most
          freelance web developers we&apos;ve spoken to underprice for exactly that reason.
        </p>

        {/* H2 #1 — Experience level */}
        <h2 id="by-experience">Web Developer Hourly Rate Ranges by Experience Level</h2>

        <p>
          Experience is the single biggest lever on rate. This table crosses experience level with role, since a
          senior backend developer and a junior frontend developer are barely in the same market:
        </p>

        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Experience</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Frontend</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Backend</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Full-Stack</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">DevOps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {ratesByExperience.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-white font-medium">{row.level}</td>
                  <td className="px-4 py-3 text-teal-300">{row.frontend}</td>
                  <td className="px-4 py-3 text-teal-300">{row.backend}</td>
                  <td className="px-4 py-3 text-teal-300">{row.fullstack}</td>
                  <td className="px-4 py-3 text-teal-300">{row.devops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">The senior jump is real</p>
              <p className="text-sm text-zinc-300">
                Rates typically climb 50-100% from mid-level to senior. The reason isn&apos;t raw coding speed —
                it&apos;s the ability to make architecture decisions, work unsupervised, and own outcomes. The
                Stack Overflow Developer Survey shows the same pattern year after year: compensation scales with
                experience and specialization more than with the language itself.
              </p>
            </div>
          </div>
        </div>

        {/* H2 #2 — Specialty */}
        <h2 id="by-specialty">Web Developer Hourly Rate by Specialty</h2>

        <p>
          Two developers with identical experience can charge very different rates depending on their stack and
          focus. Demand and the size of the talent pool both matter:
        </p>

        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-[560px] w-full text-sm">
            <thead className="bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Specialty</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Rate Range</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {ratesBySpecialty.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-white font-medium flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 text-zinc-500" />
                    {row.specialty}
                  </td>
                  <td className="px-4 py-3 text-teal-300 font-medium">{row.range}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>React and Next.js</strong> sit at the top of the frontend market because nearly every new web
          product uses them, and the React ecosystem rewards developers who can also handle data fetching,
          rendering strategy, and performance. <strong>Python/Django</strong> rates have climbed alongside AI
          integration work — a Django developer who can wire up an LLM feature is charging closer to $190/hour
          than $100. Older stacks like <strong>Ruby on Rails</strong> hold surprisingly strong rates precisely
          because the talent pool shrank while the apps built on them still need maintaining.
        </p>

        {/* H2 #3 — Geography */}
        <h2 id="by-location">Geographic Rate Differences</h2>

        <p>
          Geography still moves rates, but remote work has compressed the gap. A US-based remote developer
          working for US clients can charge close to in-hub rates, while offshore regions compete primarily on
          price:
        </p>

        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-[560px] w-full text-sm">
            <thead className="bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Location</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Rate Range</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {ratesByLocation.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-white font-medium flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                    {row.location}
                  </td>
                  <td className="px-4 py-3 text-teal-300 font-medium">{row.range}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          The practical takeaway: your rate is set by your <em>client&apos;s</em> location and budget more than
          your own. A developer in the US Midwest billing a New York startup remotely can charge NYC-adjacent
          rates. The same developer billing a local small business cannot.
        </p>

        {/* H2 #4 — How to calculate (HowTo schema) */}
        <h2 id="how-to-calculate">How to Calculate Your Web Developer Hourly Rate</h2>

        <p>
          Market ranges are a sanity check, not a number. The rate that actually keeps you solvent comes from
          your own costs and goals. Here&apos;s the five-step method — the same logic behind our{' '}
          <Link href="/tools/freelance-rate-calculator" className="text-teal-400 hover:text-teal-300">
            free freelance rate calculator
          </Link>
          .
        </p>

        <h3 id="step-1">Step 1: Add up your annual cost of doing business</h3>
        <p>
          Total everything you spend to operate: software subscriptions, hardware, insurance, accounting,
          marketing, and self-employment taxes (typically 25-30% of net income). This is what your rate has to
          cover before you pay yourself a cent.
        </p>

        <h3 id="step-2">Step 2: Set your target take-home salary</h3>
        <p>
          Decide what you want to actually earn for the year. Use a salaried web developer benchmark as your
          floor, then add a premium for the risk, overhead, and benefit gaps that come with freelancing.
        </p>

        <h3 id="step-3">Step 3: Estimate your real billable hours</h3>
        <p>
          A full-time year is 2,080 hours, but freelancers rarely bill more than 1,000-1,300 of them. Sales,
          admin, learning, and slow weeks are unpaid. Use a realistic billable-hours number — overestimating
          here is the most common reason developers set their rate too low.
        </p>

        <h3 id="step-4">Step 4: Divide to get your baseline rate</h3>
        <p>
          Add your annual costs, taxes, and target salary, then divide by your realistic billable hours. A
          developer with $105,000 in total needs and 1,200 billable hours arrives at roughly <strong>$88/hour</strong>{' '}
          as a baseline.
        </p>

        <h3 id="step-5">Step 5: Adjust for specialty, experience, and market</h3>
        <p>
          Move your baseline up for in-demand specialties, senior experience, and high-paying client types.
          Move it down only if you&apos;re deliberately building a portfolio. For the full method with worked
          examples, see our guide on{' '}
          <Link href="/blog/how-to-calculate-freelance-rate" className="text-teal-400 hover:text-teal-300">
            how to calculate your freelance rate
          </Link>
          .
        </p>

        {/* H2 #5 — Hourly vs project vs retainer */}
        <h2 id="pricing-models">Hourly vs Project-Based vs Retainer Pricing</h2>

        <p>
          The rate is only half the decision — how you package it changes how much you earn and how predictable
          your income is. Here&apos;s how the three models compare:
        </p>

        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium"> </th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Hourly</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Project-Based</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Retainer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {pricingModels.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-white font-medium">{row.attribute}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.hourly}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.project}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.retainer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Hourly</strong> protects you when scope is fuzzy — the client absorbs overruns.{' '}
          <strong>Project-based</strong> pricing rewards efficiency: quote a fixed price and keep the upside if
          you deliver faster than expected. <strong>Retainers</strong> trade a little rate for the most
          predictable cash flow, which matters enormously when you&apos;re trying to forecast irregular income.
        </p>

        {/* H2 #6 — Negotiation */}
        <h2 id="negotiation">What to Do When Clients Negotiate Your Rate</h2>

        <p>
          Pushback on rate is normal and rarely a rejection — it&apos;s an opening move. Most freelance web
          developers we&apos;ve spoken to handle it with frames, not discounts:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">When they say &quot;that&apos;s more than we budgeted&quot;</p>
                <p className="text-sm text-zinc-400">
                  Don&apos;t drop the rate — reduce the scope. &quot;I can work to that budget. Here&apos;s what I&apos;d
                  build first, and what we&apos;d add in a phase two.&quot; You protect your rate and give them a
                  real path forward.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">When they ask for a &quot;long-term discount&quot;</p>
                <p className="text-sm text-zinc-400">
                  Tie the discount to commitment, not hope. &quot;My retainer rate is $X/hour for a guaranteed 20
                  hours a month. The project rate is $Y.&quot; The lower number requires something concrete in return.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">When they compare you to a cheaper offshore quote</p>
                <p className="text-sm text-zinc-400">
                  Reframe around risk and total cost. &quot;You can absolutely find $30/hour developers. The
                  question is what a rebuild costs if the first version doesn&apos;t ship.&quot; Compete on outcomes,
                  never on price.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">When to walk away</p>
              <p className="text-sm text-zinc-300">
                Walk if a client wants senior work at junior rates, treats your rate as the only variable, or
                pushes for a discount before scope is even defined. A client who negotiates hard before the work
                starts negotiates harder when the invoice is due. For how rates compare in adjacent roles, see
                our{' '}
                <Link href="/blog/software-engineer-hourly-rate" className="text-teal-400 hover:text-teal-300">
                  software engineer hourly rate guide
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Forecasting aside — brand + differentiator + pillar link */}
        <div className="not-prose my-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Setting the rate is half the problem</p>
              <p className="text-sm text-zinc-300">
                The other half is surviving the gap between finishing the work and getting paid. That&apos;s the
                problem Cashcast was built for: a cash flow forecast made specifically for freelancers, with
                manual entry and no bank connection required, so you can see your balance up to 365 days ahead
                and know what&apos;s safe to spend before the next invoice clears. For the full method, read our
                guide to{' '}
                <Link href="/blog/cash-flow-forecasting-self-employed" className="text-teal-400 hover:text-teal-300">
                  cash flow forecasting for the self-employed
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">Track your freelance income with Cashcast</h3>
          <p className="text-zinc-300 mb-4">
            Once your rate is set, Cashcast keeps the income side honest — a daily forecast up to 365 days ahead
            and automatic Safe to Spend, free for 90 days at cashcast.money. No bank connection required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Try Cashcast Free
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                {faq.name}
                <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                {faq.acceptedAnswer.text}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Content */}
      <section className="mt-12 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Related Resources</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tools/freelance-rate-calculator"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-teal-400 font-medium">Free Tool</span>
            </div>
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Freelance Rate Calculator
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Calculate your personalized hourly rate.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Try calculator <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/how-to-calculate-freelance-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              How to Calculate Freelance Rates
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              The complete formula for setting your rates.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/software-engineer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Software Engineer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Compare rates by tech stack and specialization.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/cash-flow-forecasting-self-employed"
            className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 hover:border-teal-500/50 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-teal-400 font-medium">Pillar Guide</span>
            </div>
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Cash Flow Forecasting for the Self-Employed
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Turn an irregular rate into a stable forecast.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
