import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Lightbulb,
} from 'lucide-react';

const post = getPostBySlug('cash-flow-forecasting-self-employed')!;

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
  name: 'How to Forecast Your Cash Flow as a Self-Employed Person',
  description: 'A step-by-step guide to forecasting cash flow when you have irregular income from freelancing or self-employment.',
  totalTime: 'PT60M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'List recurring bills with categories and frequencies',
      text: 'Document every recurring expense: rent/mortgage, utilities, subscriptions, insurance, loan payments. Note the amount, due date, and frequency (weekly, monthly, quarterly, annual).',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'List recurring income including pending invoices',
      text: 'Add predictable income sources and pending invoices. Include payment terms (Net 30, Net 60) and realistic expected payment dates based on each client\'s history.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Plot at least 90 days ahead (365 is better)',
      text: 'Map income and expenses onto a calendar or cash flow tool. See your projected balance for each day, identifying when money comes in and goes out.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Find your Lowest Day',
      text: 'Identify the day in your forecast window where your balance hits its lowest point. This is your danger zone—the day you\'re most likely to overdraft if something goes wrong.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Calculate Safe to Spend',
      text: 'Subtract your safety buffer from your lowest projected balance. This gives you Safe to Spend—the maximum you can spend today without risking an overdraft in the forecast period.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far ahead should a self-employed person forecast cash flow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At minimum, forecast 90 days ahead. This captures most quarterly expenses like estimated taxes and insurance. Ideally, forecast 365 days to see annual patterns, seasonal slowdowns, and large irregular expenses. For most self-employed people, 12 months is practical without becoming too speculative.',
      },
    },
    {
      '@type': 'Question',
      name: 'What\'s the difference between cash flow forecasting and budgeting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Budgeting sets spending limits by category (e.g., "$500/month for groceries"). Cash flow forecasting predicts your actual bank balance on specific dates. You can be under budget for the month but still overdraft on the 15th if your income arrives on the 20th. Forecasting solves the timing problem that budgeting misses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I forecast irregular freelance income?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use conservative estimates: only count confirmed projects and invoices. For pending invoices, add a buffer to the payment terms (if a client is Net 30, plan for Net 45). Track client payment patterns over time. Some freelancers create three scenarios: worst case, expected, and best case.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much buffer should I keep as a self-employed person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Keep at minimum one month of essential expenses as a cash buffer—separate from your emergency fund. Many financial advisors recommend 3-6 months of expenses for the self-employed due to income volatility. Your buffer protects against late payments, slow months, and unexpected expenses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I separate business and personal cash flow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Legally and for tax purposes, yes—separate bank accounts are recommended. But for cash flow forecasting as a sole proprietor, you often need to see the complete picture. Your rent comes from the same pot as your business software subscriptions. Forecast holistically, even if accounts are separate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I forecast quarterly taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Estimate 25-30% of net self-employment income for federal taxes (15.3% self-employment tax + income tax). Set aside this percentage from each payment you receive. Plot quarterly due dates (April 15, June 15, September 15, January 15) as bills in your forecast. Use a tax reserve calculator to refine the percentage for your bracket.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my client pays late?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Build late payments into your forecast assumptions. If a client has a history of paying Net 45 when terms are Net 30, forecast Net 45. Run a "what if" scenario removing that income entirely. Having a backup plan prevents a single late payment from causing a crisis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I forecast cash flow without connecting my bank account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Manual cash flow forecasting—using a spreadsheet or dedicated app—works well and doesn\'t require sharing bank credentials. Enter your starting balance, known bills, and expected income. Many freelancers prefer this approach for privacy and accuracy.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Cashcast different from PocketSmith for the self-employed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cashcast is built specifically for freelancers and self-employed users with irregular income. It includes invoicing with automatic forecast sync, tax bucketing for quarterly estimates, and a "Safe to Spend" metric that PocketSmith doesn\'t have. Cashcast costs $7.99/month vs PocketSmith\'s $9.95+/month, with a $149 lifetime option.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is cash flow forecasting worth it if I make less than $50k/year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes—arguably it\'s more important. With less income, there\'s less room for error. A single overdraft fee ($35) or missed early payment discount can have a bigger impact proportionally. Forecasting prevents costly surprises regardless of income level.',
      },
    },
  ],
};

const comparisonData = [
  {
    tool: 'Spreadsheet (Excel/Sheets)',
    irregularIncome: 'Manual, requires formulas',
    forecastLength: 'Unlimited (if you build it)',
    learningCurve: 'Medium-High',
    price: 'Free (if you have Office/Google)',
    bestFor: 'DIYers who like building systems',
  },
  {
    tool: 'YNAB',
    irregularIncome: 'Partial (envelope budgeting)',
    forecastLength: 'None (budgeting only)',
    learningCurve: 'High (philosophy shift)',
    price: '$14.99/month',
    bestFor: 'People who need spending discipline',
  },
  {
    tool: 'PocketSmith',
    irregularIncome: 'Basic (often miscategorizes)',
    forecastLength: '6 months to 30 years',
    learningCurve: 'High',
    price: '$9.95-26.63/month',
    bestFor: 'Long-term wealth planning',
  },
  {
    tool: 'Cashcast',
    irregularIncome: 'Built for it (core feature)',
    forecastLength: '90 days free / 365 days Pro',
    learningCurve: 'Low (5 min setup)',
    price: '$7.99/month or $149 lifetime',
    bestFor: 'Freelancers & self-employed',
  },
];

const mistakesData = [
  {
    mistake: 'Only tracking monthly totals',
    description: 'Monthly budgets hide timing problems. You can be "under budget" for the month while overdrafting on the 15th because your income arrives on the 20th. Day-by-day visibility catches what monthly summaries miss.',
  },
  {
    mistake: 'Counting income before it arrives',
    description: 'That Net 30 invoice isn\'t cash until it\'s in your account. Clients pay late, disputes happen, companies go bankrupt. Forecast based on when payment will likely arrive, not when it\'s "due."',
  },
  {
    mistake: 'Forgetting annual and quarterly expenses',
    description: 'Insurance premiums, professional licenses, software renewals, estimated taxes—these "surprise" you because they\'re not in your monthly view. A 12-month forecast surface these before they hit.',
  },
  {
    mistake: 'Not accounting for payment terms',
    description: 'You finish a project today, but if the client is Net 60, that money arrives in two months. Many freelancers confuse "work completed" with "income received." Your forecast should reflect actual cash timing.',
  },
  {
    mistake: 'Skipping the safety buffer',
    description: 'Forecasting to $0 on your lowest day means any surprise—a late payment, an unexpected bill—puts you negative. Always subtract a buffer from your lowest day to find your true Safe to Spend.',
  },
];

export default function CashFlowForecastingSelfEmployedPage() {
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
          { name: 'Cash Flow Forecasting Self-Employed', url: `https://cashcast.money/blog/${post.slug}` },
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
        {/* Introduction - no H2, open with emotion */}
        <p>
          It&apos;s the 28th. Your client still hasn&apos;t paid. Rent&apos;s due Tuesday.
        </p>

        <p>
          You refresh your bank app again. Same number. You do the math in your head: the invoice was Net 30, so
          technically they have until the 2nd. But your landlord doesn&apos;t care about payment terms. Neither does
          your credit score.
        </p>

        <p>
          If you&apos;ve felt this specific anxiety, you&apos;re not alone. According to the{' '}
          <a href="https://www.bls.gov/news.release/conemp.htm" target="_blank" rel="noopener noreferrer">
            Bureau of Labor Statistics
          </a>
          , over 16 million Americans are self-employed, and that number is growing. But most financial advice—and
          most cash flow forecasting guides—are written for people with predictable biweekly paychecks.
        </p>

        <p>
          This guide is different. It&apos;s for the self-employed: freelancers, consultants, contractors, gig
          workers, and anyone else whose income doesn&apos;t arrive on a schedule. You don&apos;t need complex
          accounting software or an MBA. You need a system that works for irregular income, late clients, and the
          mental load of not knowing exactly when money will hit your account.
        </p>

        {/* What cash flow forecasting actually is when you're self-employed */}
        <h2 id="what-is-cash-flow-forecasting">What cash flow forecasting actually is when you&apos;re self-employed</h2>

        <p>
          Cash flow forecasting means predicting your bank balance on future dates. Not how much you&apos;ll
          earn this month—that&apos;s income projection. Not how much you should spend by category—that&apos;s
          budgeting. Cash flow forecasting answers a simpler question: <strong>What will my actual balance be
          on Thursday?</strong>
        </p>

        <p>
          For corporations, cash flow forecasting involves complex models, accounts receivable aging reports,
          and finance teams. For the self-employed, it&apos;s more personal. Your business cash flow and your
          personal cash flow are often the same thing—especially if you&apos;re a sole proprietor.
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">The blurring of personal and business cash</p>
              <p className="text-sm text-zinc-300">
                When you&apos;re self-employed, your business revenue pays for groceries. Your personal savings cover
                slow months. Your retirement contributions compete with reinvesting in equipment. Effective forecasting
                needs to see the whole picture, even if your accounts are technically separate.
              </p>
            </div>
          </div>
        </div>

        <p>
          Traditional forecasting tools assume steady, predictable revenue—monthly subscriptions, regular retainers,
          salaried employees. Self-employed forecasting needs to handle a $5,000 payment that could arrive anytime
          in a 30-day window, or a quarterly tax bill that lands right after a slow month.
        </p>

        {/* Why most self-employed people skip it */}
        <h2 id="why-people-skip-forecasting">Why most self-employed people skip it (and pay for it later)</h2>

        <p>
          Let&apos;s be honest: most freelancers don&apos;t forecast their cash flow. They wing it. The result?
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-rose-300 mb-1">Overdrafts and late fees</p>
                <p className="text-sm text-zinc-300">
                  A $35 overdraft fee because rent hit before that invoice payment arrived. Multiply by 2-3 times
                  per year, and you&apos;re paying a &quot;disorganization tax&quot; of $100+.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-rose-300 mb-1">Surprise tax bills</p>
                <p className="text-sm text-zinc-300">
                  Quarterly estimated taxes aren&apos;t optional. The{' '}
                  <a
                    href="https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300"
                  >
                    IRS requires self-employed people
                  </a>
                  {' '}to pay quarterly. Miss a payment and you&apos;ll owe penalties plus interest.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-rose-300 mb-1">The mental load of uncertainty</p>
                <p className="text-sm text-zinc-300">
                  You can&apos;t relax because you&apos;re always doing math in your head. &quot;Can I afford this?
                  What if that client pays late? Is next month going to be okay?&quot; This cognitive burden is
                  exhausting—and it&apos;s preventable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p>
          The irony is that avoiding forecasting doesn&apos;t save time. You spend that time worrying, checking
          your bank app repeatedly, and dealing with the consequences of surprises. A simple system takes an
          hour to set up and saves you mental energy every day.
        </p>

        {/* The two methods: spreadsheet vs. calendar */}
        <h2 id="spreadsheet-vs-calendar">The two methods: spreadsheet vs. calendar</h2>

        <p>
          There are two main approaches to cash flow forecasting. Both work; the right choice depends on how
          your brain processes information.
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Approach</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Spreadsheet</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Calendar</div>
          </div>
          <div className="divide-y divide-zinc-800">
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Best for</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Number-focused thinkers</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Visual thinkers</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">View</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Running balance column</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Day-by-day visual timeline</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Strengths</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Flexible, customizable formulas</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Immediate pattern recognition</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Weaknesses</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Manual updates, formula errors</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Less precise, tool-dependent</div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-800">
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Maintenance</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">High (manual entry)</div>
              <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">Low to medium (depends on tool)</div>
            </div>
          </div>
        </div>

        <p>
          <strong>When spreadsheets work:</strong> You&apos;re detail-oriented, comfortable with Excel or Google
          Sheets, and like building your own systems. You enjoy tweaking formulas and having complete control.
        </p>

        <p>
          <strong>When spreadsheets break:</strong> You&apos;re busy, formulas intimidate you, or you need to
          check your forecast on your phone between meetings. Spreadsheets also require discipline to update—if
          you skip a week, the whole thing becomes unreliable.
        </p>

        <p>
          <strong>The calendar approach:</strong> Visual tools like Cashcast show your cash flow as a calendar.
          You see each day, color-coded by balance. Red days mean danger. Green days mean safety. You spot
          patterns—like the consistent dip on the 3rd of every month—at a glance.
        </p>

        {/* The Safe to Spend method */}
        <h2 id="safe-to-spend-method">The Safe to Spend method (the freelancer angle)</h2>

        <p>
          Here&apos;s the concept that changes everything for self-employed people: <strong>Safe to Spend</strong>.
        </p>

        <div className="definition-box not-prose my-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
          <h3 className="text-xl font-semibold text-white mb-3">What is Safe to Spend?</h3>
          <p className="text-zinc-300 leading-relaxed text-lg">
            Safe to Spend is the maximum amount you can spend today without risking an overdraft in the next
            14 days. It&apos;s calculated by taking your <strong>lowest projected balance</strong> in the forecast
            period and subtracting your <strong>safety buffer</strong>.
          </p>
        </div>

        <p>
          Your current bank balance is misleading. You might have $4,000 today, but if $3,500 in bills hit this
          week, your <em>actual</em> available money is much lower. Safe to Spend accounts for everything
          that&apos;s about to happen.
        </p>

        <p>
          Why does this matter more for the self-employed than for salaried workers?
        </p>

        <ul>
          <li>
            <strong>Income timing is uncertain.</strong> A salaried worker knows pay hits on the 15th. You might
            get paid anytime in a 30-day window.
          </li>
          <li>
            <strong>Bills are fixed, income isn&apos;t.</strong> Rent is $1,800 on the 1st, every month. But your
            income last month was $6,000 and this month might be $3,000.
          </li>
          <li>
            <strong>Budgets fail the timing test.</strong> You can be &quot;under budget&quot; for the month
            while still overdrafting on the 15th because income arrives on the 20th.
          </li>
        </ul>

        <p>
          Safe to Spend answers the question every freelancer asks constantly: &quot;Can I afford this?&quot;
          Not &quot;Do I have enough income this month?&quot;—but &quot;Will spending this money cause a
          problem before my next payment arrives?&quot;
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Check your Safe to Spend</p>
              <p className="text-sm text-zinc-300 mb-3">
                Use our free calculator to see what you can spend today without breaking next month&apos;s bills.
              </p>
              <Link
                href="/tools/can-i-afford-it"
                className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 font-medium"
              >
                Try the Can I Afford It calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Step-by-step guide */}
        <h2 id="how-to-forecast">Step-by-step: how to forecast your cash flow in 60 minutes</h2>

        <p>
          This is the practical part. In one focused hour, you&apos;ll build a cash flow forecast that actually
          works. Here&apos;s how.
        </p>

        <h3 id="step-1">Step 1: List recurring bills (with categories and frequencies)</h3>

        <p>
          Start with what goes <em>out</em>. Pull up your bank statements from the last 3 months and list
          every recurring expense:
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between border-b border-zinc-700 pb-3">
              <span className="text-zinc-400">Expense</span>
              <span className="text-zinc-400">Amount</span>
              <span className="text-zinc-400">Frequency</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Rent/Mortgage</span>
              <span className="text-rose-300">$1,800</span>
              <span className="text-zinc-400">1st of month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Utilities</span>
              <span className="text-rose-300">$150</span>
              <span className="text-zinc-400">15th of month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Car Insurance</span>
              <span className="text-rose-300">$180</span>
              <span className="text-zinc-400">Monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Subscriptions (software)</span>
              <span className="text-rose-300">$200</span>
              <span className="text-zinc-400">Monthly (various dates)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Health Insurance</span>
              <span className="text-rose-300">$450</span>
              <span className="text-zinc-400">Monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Estimated Taxes (Q)</span>
              <span className="text-rose-300">$3,000</span>
              <span className="text-zinc-400">Quarterly</span>
            </div>
          </div>
        </div>

        <p>
          Don&apos;t forget the sneaky ones: annual domain renewals, quarterly insurance payments, yearly
          professional association dues. These &quot;surprise&quot; you only because they&apos;re not in your
          monthly view.
        </p>

        <h3 id="step-2">Step 2: List recurring income (predictable + pending invoices with payment terms)</h3>

        <p>
          Now add what comes <em>in</em>. Be conservative here—only count money you&apos;re confident will arrive.
        </p>

        <ul>
          <li>
            <strong>Confirmed retainers:</strong> Client A pays $2,000 on the 5th every month. That&apos;s reliable.
          </li>
          <li>
            <strong>Pending invoices:</strong> You invoiced Client B $4,500 on Net 30. They usually pay on time,
            so mark it for the due date—but make a note if they tend to be late.
          </li>
          <li>
            <strong>Uncertain income:</strong> A proposal you sent last week? Don&apos;t count it until it&apos;s signed.
          </li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">The optimism trap</p>
              <p className="text-sm text-zinc-300">
                Most self-employed people overestimate income and underestimate expenses. If a client is Net 30 but
                historically pays in 45 days, forecast for 45. Hope for the best, plan for the realistic.
              </p>
            </div>
          </div>
        </div>

        <h3 id="step-3">Step 3: Plot 90 days minimum (365 is better)</h3>

        <p>
          Now put it all together. Using a spreadsheet, cash flow app, or even paper calendar, plot your
          income and expenses on specific dates. Calculate the running balance for each day.
        </p>

        <p>
          Why 90 days minimum? Because quarterly expenses—like estimated taxes—need to be visible. Why 365
          is better? Because you&apos;ll see seasonal patterns. Maybe December is always slow. Maybe you have
          an annual insurance premium in March. A full year forecast surfaces these before they surprise you.
        </p>

        <h3 id="step-4">Step 4: Find your Lowest Day (the loss-aversion frame)</h3>

        <p>
          Scan your forecast for the single lowest balance in the next 30-90 days. This is your <strong>Lowest Day</strong>—
          the day you&apos;re most vulnerable to overdraft.
        </p>

        <p>
          Why does this matter psychologically? Behavioral economics shows we feel losses more intensely than
          gains. Knowing your Lowest Day—seeing it on a calendar—creates healthy anxiety that motivates action.
          If your lowest day shows a $200 balance and rent is $1,800, you know you need to either accelerate
          income or delay an expense.
        </p>

        <h3 id="step-5">Step 5: Calculate Safe to Spend</h3>

        <p>
          Take your Lowest Day balance and subtract your safety buffer. That&apos;s your Safe to Spend.
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="bg-zinc-950/60 rounded-lg p-4 font-mono text-sm">
            <p className="text-teal-300">Safe to Spend =</p>
            <p className="text-zinc-300 ml-4">Lowest projected balance (next 14-90 days)</p>
            <p className="text-zinc-300 ml-4">− Safety buffer ($500-2,000 depending on volatility)</p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400">
              <strong className="text-white">Example:</strong> Your lowest balance in the next 30 days is $2,500.
              Your buffer is $1,000. Your Safe to Spend is $1,500. Spending more than that today risks going
              below your buffer before your next payment arrives.
            </p>
          </div>
        </div>

        {/* Handling freelancer-specific traps */}
        <h2 id="freelancer-traps">Handling the freelancer-specific traps</h2>

        <p>
          Self-employed cash flow has unique challenges that salaried workers don&apos;t face. Here&apos;s how
          to handle each one.
        </p>

        <h3>Seasonal income</h3>

        <p>
          Wedding photographers are busy April-October, quiet November-March. Accountants peak January-April.
          Ski instructors work winters only. If your income is seasonal:
        </p>

        <ul>
          <li>Forecast a full 12 months to see the dips coming</li>
          <li>Calculate your &quot;average monthly income&quot; and set aside the excess during busy months</li>
          <li>Consider your slow season buffer separately from your regular buffer</li>
        </ul>

        <h3>Late-paying clients</h3>

        <p>
          Net 30 that becomes Net 60 is a reality of freelance life. Defense strategies:
        </p>

        <ul>
          <li>Track each client&apos;s actual payment pattern, not just their terms</li>
          <li>Forecast using realistic dates, not optimistic ones</li>
          <li>Run a &quot;what if&quot; scenario: what happens if this invoice is 2 weeks late?</li>
          <li>Send reminder emails before due dates, not after</li>
        </ul>

        <h3>Quarterly tax surprises</h3>

        <p>
          Self-employment tax is 15.3% (Social Security + Medicare). Add federal income tax and you&apos;re
          often setting aside 25-35% of net income. The quarterly due dates are:
        </p>

        <ul>
          <li>Q1: April 15</li>
          <li>Q2: June 15</li>
          <li>Q3: September 15</li>
          <li>Q4: January 15 (of the following year)</li>
        </ul>

        <p>
          Put these in your forecast as non-negotiable bills. Better yet, set aside a percentage from every
          payment you receive into a separate tax savings account.
        </p>

        <h3>Equipment and software purchases</h3>

        <p>
          Your laptop dies. Your software needs an upgrade. Your camera body is EOL. These aren&apos;t
          &quot;surprises&quot;—they&apos;re predictable if you plan for depreciation. Add a monthly
          &quot;equipment replacement&quot; line item to your forecast, even if you don&apos;t spend it
          every month.
        </p>

        {/* 5 mistakes */}
        <h2 id="common-mistakes">5 mistakes self-employed people make with cash flow forecasting</h2>

        <div className="not-prose my-8 space-y-6">
          {mistakesData.map((item, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">{item.mistake}</p>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools comparison */}
        <h2 id="tools-comparison">Forecasting tools for the self-employed — honest comparison</h2>

        <p>
          There are several ways to forecast cash flow. Here&apos;s an honest comparison of the main options,
          including where each one wins.
        </p>

        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Tool</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Irregular Income</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Forecast Length</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Learning Curve</th>
                <th className="px-4 py-3 text-left text-zinc-300 font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {comparisonData.map((row, index) => (
                <tr key={index} className={row.tool === 'Cashcast' ? 'bg-teal-500/5' : ''}>
                  <td className="px-4 py-3 text-white font-medium">{row.tool}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.irregularIncome}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.forecastLength}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.learningCurve}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Spreadsheets</strong> win on flexibility if you&apos;re technical. <strong>YNAB</strong> wins
          for spending discipline (but doesn&apos;t forecast). <strong>PocketSmith</strong> wins for long-term
          wealth planning. <strong>Cashcast</strong> wins for freelancers who need invoicing, tax tracking, and
          a simple &quot;what can I spend today&quot; answer.
        </p>

        <p>
          For a detailed comparison with PocketSmith specifically, see our{' '}
          <Link href="/compare/pocketsmith" className="text-teal-400 hover:text-teal-300">
            Cashcast vs PocketSmith comparison
          </Link>.
        </p>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calendar className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            See your cash flow in 5 minutes
          </h3>
          <p className="text-zinc-300 mb-4">
            Cashcast gives you a daily forecast up to 365 days ahead, automatic Safe to Spend calculation,
            and invoicing that syncs to your forecast. Try free for 90 days—no credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Start Free Trial
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
            href="/tools/can-i-afford-it"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-teal-400 font-medium">Free Tool</span>
            </div>
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Can I Afford It Calculator
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Check if a purchase fits your cash flow.
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
              How to Calculate Your Freelance Rate
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              The formula for setting sustainable rates.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/copywriter-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Freelance Copywriter Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rate guide for content and copywriting.
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
              Web Developer Hourly Rate (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates by specialty, experience, and location.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/compare/pocketsmith"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Cashcast vs PocketSmith
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              How Cashcast compares for freelancers.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Compare <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
