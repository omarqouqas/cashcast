import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PieChart,
  Briefcase,
} from 'lucide-react';

const post = getPostBySlug('how-to-calculate-freelance-rate')!;

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
  name: 'How to Calculate Your Freelance Hourly Rate',
  description: 'A step-by-step guide to calculating the right hourly rate for your freelance business.',
  totalTime: 'PT15M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Determine your target annual income',
      text: 'Start with the salary you want to earn before taxes and expenses. Research market rates for your role and experience level.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Calculate your business expenses',
      text: 'Add up annual costs including self-employment tax (15.3%), health insurance, retirement contributions, software, equipment, and professional services.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Estimate realistic billable hours',
      text: 'Most freelancers bill 50-70% of their time. Plan for 1,000-1,400 billable hours per year, not 2,080.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Apply the freelance rate formula',
      text: 'Divide your total annual needs (income + expenses + buffer) by your billable hours to get your minimum hourly rate.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Add a profit margin',
      text: 'Add 20-30% buffer to account for slow months, scope creep, and business growth.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the formula for calculating freelance hourly rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The freelance rate formula is: (Target Annual Income + Business Expenses + Profit Buffer) ÷ Annual Billable Hours = Minimum Hourly Rate. For example, if you want $80,000/year income, have $25,000 in expenses, add a $15,000 buffer, and work 1,200 billable hours: ($80,000 + $25,000 + $15,000) ÷ 1,200 = $100/hour.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many billable hours can a freelancer realistically work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most freelancers can bill 1,000-1,400 hours per year, which is 50-70% of a standard 2,080-hour work year. The remaining time goes to marketing, admin, invoicing, networking, and finding new clients. New freelancers often overestimate billable hours when calculating their rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What expenses should freelancers include when calculating rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Include: Self-employment tax (15.3% in the US), health insurance premiums, retirement savings (aim for 15%), business insurance, software subscriptions, equipment and depreciation, home office costs, professional development, accounting/legal fees, and a buffer for unexpected expenses. These typically add 30-50% on top of your desired take-home income.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I convert a full-time salary to a freelance rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To convert a salary to freelance rate: Take the annual salary, add 30-50% for benefits and expenses you now pay yourself, then divide by 1,000-1,200 billable hours (not 2,080). A $100,000 salary typically converts to $100-130/hour as a freelancer, not $48/hour (which would be salary ÷ 2,080).',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I charge different rates for different clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, variable pricing is common and often smart. Charge more for: enterprise clients with larger budgets, rush or urgent projects, complex or specialized work, difficult clients requiring extra revisions. Charge less (selectively) for: long-term retainer clients, interesting portfolio work, clients you want to build relationships with, or non-profits you support.',
      },
    },
  ],
};

const expenseCategories = [
  { name: 'Self-employment tax', percentage: '15.3%', description: 'Social Security + Medicare (US)' },
  { name: 'Health insurance', amount: '$6,000-15,000/yr', description: 'Individual or family coverage' },
  { name: 'Retirement savings', percentage: '10-15%', description: 'SEP IRA, Solo 401k, etc.' },
  { name: 'Software & tools', amount: '$1,000-5,000/yr', description: 'Design tools, project management, etc.' },
  { name: 'Equipment', amount: '$1,000-3,000/yr', description: 'Computer, monitors, desk (depreciated)' },
  { name: 'Professional services', amount: '$500-2,000/yr', description: 'Accountant, lawyer, insurance' },
  { name: 'Marketing & networking', amount: '$500-2,000/yr', description: 'Website, ads, events, memberships' },
  { name: 'Buffer for slow months', percentage: '10-20%', description: 'Income varies, plan for gaps' },
];

export default function HowToCalculateFreelanceRatePage() {
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
          { name: 'Calculate Freelance Rate', url: `https://cashcast.money/blog/${post.slug}` },
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
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
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
        {/* Introduction */}
        <p>
          Most freelancers get their rates wrong. They either guess based on what sounds reasonable, copy what
          competitors charge, or simply divide a salary by 2,080 hours. All of these methods leave money on the table
          or—worse—lead to burnout from overwork.
        </p>

        <p>
          The right approach to calculating your freelance rate is methodical: start with what you need to earn,
          add the real costs of running a business, account for non-billable time, and build in margin for the
          unpredictability of freelance work.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Calculator</p>
              <p className="text-sm text-zinc-300 mb-3">
                Want to skip the math? Use our free freelance rate calculator to get your minimum, suggested, and premium rates instantly.
              </p>
              <Link
                href="/tools/freelance-rate-calculator"
                className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium"
              >
                Try the calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* The Freelance Rate Formula */}
        <h2 id="formula">The Freelance Rate Formula</h2>

        <p>Here&apos;s the formula every freelancer should know:</p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="text-center">
            <p className="text-sm text-zinc-400 mb-3">Freelance Hourly Rate Formula</p>
            <div className="text-xl md:text-2xl font-mono text-white">
              <span className="text-teal-300">(Income + Expenses + Buffer)</span>
              <span className="text-zinc-500 mx-2">÷</span>
              <span className="text-teal-300">Billable Hours</span>
            </div>
            <p className="text-sm text-zinc-400 mt-4">= Your Minimum Hourly Rate</p>
          </div>
        </div>

        <p>Let&apos;s break down each component:</p>

        {/* Step 1: Target Income */}
        <h2 id="step-1-income">Step 1: Determine Your Target Annual Income</h2>

        <p>
          Start with what you want to take home after business expenses—your equivalent of a salary. This isn&apos;t
          what you&apos;ll invoice; it&apos;s what ends up in your pocket.
        </p>

        <p>How to determine this number:</p>

        <ul>
          <li><strong>Research market rates</strong> for your role and experience level (Glassdoor, Levels.fyi, industry surveys)</li>
          <li><strong>Consider your cost of living</strong>—what do you actually need to cover rent, food, transportation, etc.?</li>
          <li><strong>Factor in your lifestyle goals</strong>—do you want to save aggressively, travel, or have flexibility?</li>
          <li><strong>Be realistic but ambitious</strong>—undervaluing yourself leads to resentment and burnout</li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Example: Senior UX Designer</p>
              <p className="text-sm text-zinc-300">
                Full-time salary range: $90,000-$140,000. A freelancer with similar experience should target
                <strong> at least</strong> $100,000 in take-home income, given the additional risk and lack of benefits.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Business Expenses */}
        <h2 id="step-2-expenses">Step 2: Calculate Your Business Expenses</h2>

        <p>
          This is where most freelancers underestimate. When you&apos;re employed, your company covers many costs invisibly—
          health insurance, retirement matching, payroll taxes, equipment, software. As a freelancer, you pay all of these yourself.
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Expense</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Cost</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Notes</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {expenseCategories.map((expense, index) => (
              <div key={index} className="grid grid-cols-3 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{expense.name}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">
                  {expense.percentage || expense.amount}
                </div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{expense.description}</div>
              </div>
            ))}
          </div>
        </div>

        <h3>Sample Expense Calculation</h3>

        <p>For a freelancer targeting $100,000 take-home income:</p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Self-employment tax (15.3%)</span>
              <span className="text-white">$15,300</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Health insurance</span>
              <span className="text-white">$9,600</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Retirement savings (12%)</span>
              <span className="text-white">$12,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Software & tools</span>
              <span className="text-white">$3,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Equipment (depreciated)</span>
              <span className="text-white">$2,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Professional services</span>
              <span className="text-white">$1,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Marketing & networking</span>
              <span className="text-white">$1,500</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="text-zinc-300 font-semibold">Total business expenses</span>
              <span className="text-teal-400 font-semibold">$44,900/year</span>
            </div>
          </div>
        </div>

        <p>
          That&apos;s nearly <strong>45% on top of your target income</strong>. This is why dividing a salary by 2,080
          hours produces a rate that&apos;s way too low.
        </p>

        {/* Step 3: Billable Hours */}
        <h2 id="step-3-billable-hours">Step 3: Estimate Realistic Billable Hours</h2>

        <p>
          Here&apos;s the second biggest mistake freelancers make: assuming they can bill 40 hours a week, 52 weeks a year.
          In reality, much of your time goes to non-billable work:
        </p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <PieChart className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Non-Billable Time</p>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Marketing and lead generation</li>
              <li>• Proposals and estimates</li>
              <li>• Client communication</li>
              <li>• Invoicing and admin</li>
              <li>• Professional development</li>
              <li>• Networking</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Clock className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Realistic Estimates</p>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• <strong className="text-white">New freelancers:</strong> 800-1,000 hrs/yr</li>
              <li>• <strong className="text-white">Established:</strong> 1,000-1,200 hrs/yr</li>
              <li>• <strong className="text-white">Very busy:</strong> 1,200-1,400 hrs/yr</li>
              <li>• <strong className="text-white">Employee equivalent:</strong> 2,080 hrs/yr</li>
            </ul>
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">The 50% Rule</p>
              <p className="text-sm text-zinc-300">
                A common rule of thumb: you&apos;ll bill about 50% of your working hours. If you work 40-hour weeks,
                expect ~20 billable hours. The rest is running your business.
              </p>
            </div>
          </div>
        </div>

        <p>
          For our calculation, we&apos;ll use <strong>1,200 billable hours per year</strong>—a realistic target for an
          established freelancer working full-time.
        </p>

        {/* Step 4: The Calculation */}
        <h2 id="step-4-calculation">Step 4: Apply the Formula</h2>

        <p>Now let&apos;s put it all together:</p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Target income</span>
              <span className="text-white">$100,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">+ Business expenses</span>
              <span className="text-white">$44,900</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">+ Buffer for slow months (15%)</span>
              <span className="text-white">$21,735</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="text-zinc-300 font-semibold">Total annual needs</span>
              <span className="text-white font-semibold">$166,635</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">÷ Billable hours</span>
              <span className="text-white">1,200</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="text-teal-300 font-bold">Minimum hourly rate</span>
              <span className="text-teal-400 font-bold text-lg">$139/hour</span>
            </div>
          </div>
        </div>

        <p>
          That $139/hour might feel high if you&apos;re comparing it to an employee&apos;s &quot;hourly rate.&quot; But remember:
          a $100,000 salary divided by 2,080 hours is only $48/hour. The difference accounts for all the costs
          and realities of freelancing.
        </p>

        {/* Step 5: Rate Tiers */}
        <h2 id="step-5-rate-tiers">Step 5: Create Rate Tiers</h2>

        <p>
          Your minimum rate is just that—a floor. Smart freelancers use tiered pricing:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Minimum Rate</span>
              <span className="text-teal-300 font-bold">$139/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Your floor. Use for: long-term retainer clients, interesting portfolio work, or when you really want the project.
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Standard Rate (+15-20%)</span>
              <span className="text-teal-300 font-bold">$160-167/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Your default quote for most projects. Gives you room to negotiate if needed.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Premium Rate (+30-50%)</span>
              <span className="text-teal-300 font-bold">$180-210/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              For: rush projects, complex work, enterprise clients, difficult clients, or when you&apos;re fully booked.
            </p>
          </div>
        </div>

        {/* Salary Conversion */}
        <h2 id="salary-conversion">Converting a Salary to Freelance Rate</h2>

        <p>
          If you&apos;re transitioning from employment, here&apos;s a quick conversion method:
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-white font-medium">Take your annual salary</p>
                <p className="text-zinc-400">Example: $100,000</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-white font-medium">Add 30-50% for benefits and expenses</p>
                <p className="text-zinc-400">$100,000 × 1.4 = $140,000</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-white font-medium">Divide by billable hours (not 2,080)</p>
                <p className="text-zinc-400">$140,000 ÷ 1,200 = <strong className="text-teal-400">$117/hour</strong></p>
              </div>
            </li>
          </ol>
        </div>

        <p>
          This quick method gets you in the ballpark. For a more precise rate, use the full formula above.
        </p>

        {/* Industry Rates */}
        <h2 id="industry-rates">Freelance Rates by Industry (2026)</h2>

        <p>Here are typical freelance hourly rates by field (US market, mid-to-senior experience):</p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Field</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Typical Range</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Premium</div>
          </div>
          <div className="divide-y divide-zinc-800">
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">Web Development</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$100-175/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$200-300/hr</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">UX/UI Design</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$100-175/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$200-350/hr</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">Copywriting</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$75-150/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$175-250/hr</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">Marketing Consulting</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$100-200/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$250-500/hr</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">Data Science / AI</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$150-250/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$300-500/hr</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-white">Video Production</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-teal-300">$75-150/hr</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">$200-400/hr</div>
            </div>
          </div>
        </div>

        <p>
          <em>Note: Rates vary significantly by location, specialization, and client type. Enterprise clients typically pay 50-100% more than small businesses.</em>
        </p>

        {/* Common Mistakes */}
        <h2 id="common-mistakes">Common Freelance Pricing Mistakes</h2>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Dividing salary by 2,080 hours</p>
                <p className="text-sm text-zinc-400">
                  This assumes full-time billable work with employer-paid benefits. It produces rates that are
                  40-60% too low.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Forgetting self-employment tax</p>
                <p className="text-sm text-zinc-400">
                  That&apos;s 15.3% off the top before income tax. A $100/hour rate is really $84.70 after SE tax.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Assuming 100% utilization</p>
                <p className="text-sm text-zinc-400">
                  Even busy freelancers rarely bill more than 70% of their time. Plan for marketing, admin, and gaps between projects.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Competing on price</p>
                <p className="text-sm text-zinc-400">
                  Racing to the bottom attracts price-sensitive clients who will leave for someone cheaper.
                  Compete on value, expertise, and reliability instead.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project vs Hourly */}
        <h2 id="project-vs-hourly">Hourly vs. Project-Based Pricing</h2>

        <p>
          Once you know your hourly rate, you can use it as a foundation for project-based pricing—which is often
          more profitable:
        </p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Clock className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Hourly Pricing</p>
            <p className="text-sm text-zinc-400 mb-3">Best for:</p>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Unclear scope</li>
              <li>• Ongoing retainers</li>
              <li>• Clients who change minds frequently</li>
              <li>• When you&apos;re new to a type of work</li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Briefcase className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Project Pricing</p>
            <p className="text-sm text-zinc-400 mb-3">Best for:</p>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Well-defined deliverables</li>
              <li>• Repeat projects you can estimate</li>
              <li>• When efficiency benefits you</li>
              <li>• Higher perceived value</li>
            </ul>
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Project Pricing Formula</p>
              <p className="text-sm text-zinc-300">
                Estimate hours honestly, multiply by your hourly rate, then add 20-30% buffer for scope creep
                and communication overhead. As you get faster, your effective hourly rate increases.
              </p>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Use the formula:</strong> (Income + Expenses + Buffer) ÷ Billable Hours = Minimum Rate</li>
          <li><strong>Plan for 1,000-1,400 billable hours</strong>, not 2,080—you&apos;re running a business, not just doing the work</li>
          <li><strong>Add 30-50% on top of desired income</strong> for taxes, benefits, and business expenses</li>
          <li><strong>Create rate tiers</strong>—minimum, standard, and premium—for different situations</li>
          <li><strong>Review annually</strong> and raise rates to match inflation and growing expertise</li>
          <li><strong>If no one ever says no</strong>, your rates are too low</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your Freelance Rate Now
          </h3>
          <p className="text-zinc-300 mb-4">
            Use our free calculator to find your minimum, standard, and premium hourly rates based on your specific situation.
          </p>
          <Link
            href="/tools/freelance-rate-calculator"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Try the Calculator Free
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
              Know your rate—then forecast when that money actually arrives.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
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
              Calculate your ideal hourly rate instantly.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Try calculator <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/when-to-raise-freelance-rates"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              When to Raise Your Rates
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Signs you&apos;re undercharging and how to tell clients about increases.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/ux-designer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              UX Designer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Comprehensive rate guide for freelance UX designers.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/web-developer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Web Developer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Freelance web developer rates by specialization.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
