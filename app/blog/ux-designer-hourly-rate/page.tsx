import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Palette,
  Layers,
  Monitor,
} from 'lucide-react';

const post = getPostBySlug('ux-designer-hourly-rate')!;

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
    cssSelector: ['.speakable-headline', '.speakable-summary'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the average hourly rate for a freelance UX designer in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average freelance UX designer hourly rate in 2026 ranges from $75-175/hour for mid-level designers and $150-350/hour for senior designers in the US market. Rates vary significantly by specialization, location, and client type. Enterprise clients typically pay 50-100% more than small businesses or startups.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do freelance UX designers charge for a project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelance UX designers typically charge $5,000-15,000 for a basic website UX design, $15,000-50,000 for a mobile app UX project, and $25,000-100,000+ for comprehensive product design including research, strategy, and design systems. Project pricing is based on estimated hours multiplied by hourly rate plus a 20-30% buffer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect UX designer hourly rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key factors include: years of experience (junior vs senior), specialization (UX research, UI design, product design), location (major tech hubs pay more), client type (enterprise vs startup), project complexity, and portfolio strength. Designers with specialized skills like design systems, accessibility, or AI/ML interfaces command premium rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should UX designers charge hourly or project-based rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the project. Hourly rates work better for ongoing retainers, unclear scope, or research-heavy work. Project-based pricing is better for well-defined deliverables like landing page designs, mobile app screens, or design system components. Many designers use hourly for discovery phases and project-based for execution.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do UX designer rates compare to UI designer rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UX designers and UI designers have similar rate ranges, though UX research specialists often command slightly higher rates due to specialized methodology skills. Product designers who do both UX and UI can charge premium rates ($150-250/hr) because they offer end-to-end value. Pure visual/UI designers average $75-150/hr.',
      },
    },
  ],
};

const ratesByExperience = [
  { level: 'Junior (0-2 years)', range: '$50-85/hr', project: '$3,000-8,000', notes: 'Portfolio work, smaller clients' },
  { level: 'Mid-Level (3-5 years)', range: '$85-125/hr', project: '$8,000-20,000', notes: 'Standard market rate' },
  { level: 'Senior (6-10 years)', range: '$125-175/hr', project: '$15,000-40,000', notes: 'Strategic projects' },
  { level: 'Lead/Principal (10+ years)', range: '$175-350/hr', project: '$30,000-100,000+', notes: 'Enterprise, specialized' },
];

const ratesBySpecialization = [
  { specialty: 'UX Research', range: '$100-200/hr', demand: 'High', notes: 'User interviews, usability testing, synthesis' },
  { specialty: 'UX/UI Design (Generalist)', range: '$85-150/hr', demand: 'Very High', notes: 'Most common freelance role' },
  { specialty: 'Product Design', range: '$125-225/hr', demand: 'High', notes: 'End-to-end design + strategy' },
  { specialty: 'Design Systems', range: '$150-250/hr', demand: 'High', notes: 'Component libraries, tokens, documentation' },
  { specialty: 'Interaction Design', range: '$100-175/hr', demand: 'Medium', notes: 'Animations, micro-interactions, prototyping' },
  { specialty: 'Service Design', range: '$125-200/hr', demand: 'Medium', notes: 'Customer journeys, blueprints, CX' },
  { specialty: 'Accessibility (a11y)', range: '$125-200/hr', demand: 'Growing', notes: 'WCAG compliance, inclusive design' },
  { specialty: 'AI/ML Interface Design', range: '$150-300/hr', demand: 'Very High', notes: 'AI products, conversational UI' },
];

const ratesByLocation = [
  { location: 'San Francisco / Silicon Valley', range: '$150-300/hr', multiplier: '1.5x' },
  { location: 'New York City', range: '$125-250/hr', multiplier: '1.3x' },
  { location: 'Los Angeles / Seattle', range: '$110-200/hr', multiplier: '1.15x' },
  { location: 'Austin / Denver / Boston', range: '$100-175/hr', multiplier: '1.0x' },
  { location: 'Other US Cities', range: '$75-150/hr', multiplier: '0.85x' },
  { location: 'Remote (US clients)', range: '$100-200/hr', multiplier: '1.0x' },
  { location: 'UK / Western Europe', range: '£60-150/hr', multiplier: '0.9x' },
  { location: 'Eastern Europe', range: '$40-100/hr', multiplier: '0.5x' },
];

const projectPricing = [
  { project: 'Website Redesign (5-10 pages)', low: '$8,000', mid: '$15,000', high: '$30,000' },
  { project: 'Mobile App Design (MVP)', low: '$15,000', mid: '$30,000', high: '$60,000' },
  { project: 'Landing Page Design', low: '$2,500', mid: '$5,000', high: '$10,000' },
  { project: 'Design System (Basic)', low: '$15,000', mid: '$35,000', high: '$75,000' },
  { project: 'User Research Study', low: '$5,000', mid: '$12,000', high: '$25,000' },
  { project: 'Usability Audit', low: '$3,000', mid: '$7,500', high: '$15,000' },
  { project: 'SaaS Product Design', low: '$25,000', mid: '$60,000', high: '$150,000' },
];

export default function UXDesignerHourlyRatePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'UX Designer Rates', url: `https://cashcast.money/blog/${post.slug}` },
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
          If you&apos;re a freelance UX designer wondering what to charge—or a company trying to understand market rates—this
          guide breaks down UX designer hourly rates for 2026. We cover rates by experience level, specialization,
          location, and project type, based on industry data and real freelancer experiences.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Quick Answer</p>
              <p className="text-sm text-zinc-300">
                Freelance UX designer rates in 2026 typically range from <strong className="text-teal-300">$75-175/hour</strong> for
                mid-to-senior designers in the US market. Enterprise-focused or highly specialized designers charge <strong className="text-teal-300">$175-350/hour</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Experience */}
        <h2 id="by-experience">UX Designer Rates by Experience Level</h2>

        <p>
          Experience is the biggest factor in UX designer rates. Here&apos;s what freelancers at different levels typically charge:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Level</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Hourly</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Project</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Notes</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesByExperience.map((rate, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{rate.level}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{rate.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">{rate.project}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{rate.notes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Key Insight</p>
              <p className="text-sm text-zinc-300">
                The jump from mid-level to senior represents a significant rate increase (40-50%). This reflects
                the value of strategic thinking, client management skills, and the ability to work independently
                on complex problems.
              </p>
            </div>
          </div>
        </div>

        {/* Rates by Specialization */}
        <h2 id="by-specialization">UX Designer Rates by Specialization</h2>

        <p>
          Specialization can significantly impact your rate. Niche skills command premium pricing:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Specialty</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Rate Range</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Demand</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Focus</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesBySpecialization.map((spec, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{spec.specialty}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{spec.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-300">{spec.demand}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{spec.notes}</div>
              </div>
            ))}
          </div>
        </div>

        <h3>Hot Specializations for 2026</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Layers className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">AI/ML Interface Design</p>
            <p className="text-sm text-zinc-400">
              Designing for AI products, chatbots, and ML-powered features. High demand, premium rates ($150-300/hr).
            </p>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <Palette className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Design Systems</p>
            <p className="text-sm text-zinc-400">
              Building scalable component libraries and design tokens. Enterprise clients pay well ($150-250/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Users className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">Accessibility (a11y)</p>
            <p className="text-sm text-zinc-400">
              WCAG compliance and inclusive design. Growing demand due to regulations ($125-200/hr).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Monitor className="h-5 w-5 text-teal-400 mb-3" />
            <p className="font-semibold text-white mb-2">B2B SaaS Design</p>
            <p className="text-sm text-zinc-400">
              Complex enterprise software and dashboards. Consistent demand, good rates ($100-175/hr).
            </p>
          </div>
        </div>

        {/* Rates by Location */}
        <h2 id="by-location">UX Designer Rates by Location</h2>

        <p>
          Location still matters for freelance rates, though remote work has narrowed the gaps. Here&apos;s how rates compare:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Location</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">Rate Range</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white">vs. Average</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {ratesByLocation.map((loc, index) => (
              <div key={index} className="grid grid-cols-3 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  {loc.location}
                </div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium">{loc.range}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400">{loc.multiplier}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Remote Work Reality</p>
              <p className="text-sm text-zinc-300">
                Remote freelancers working with US clients can often charge US rates regardless of their location.
                The key is demonstrating value, strong communication, and timezone flexibility. Many clients care
                more about quality than geography.
              </p>
            </div>
          </div>
        </div>

        {/* Project Pricing */}
        <h2 id="project-pricing">UX Design Project Pricing</h2>

        <p>
          Many UX designers prefer project-based pricing for defined deliverables. Here are typical project rates:
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-900 p-4 font-semibold text-white">Project Type</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Budget</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Standard</div>
            <div className="bg-zinc-900 p-4 font-semibold text-white text-center">Premium</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {projectPricing.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-px bg-zinc-800">
                <div className="bg-zinc-900/60 p-4 text-sm text-white">{item.project}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400 text-center">{item.low}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-teal-300 font-medium text-center">{item.mid}</div>
                <div className="bg-zinc-900/60 p-4 text-sm text-zinc-400 text-center">{item.high}</div>
              </div>
            ))}
          </div>
        </div>

        <h3>When to Use Project vs. Hourly Pricing</h3>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="font-semibold text-white mb-3">Use Hourly Pricing For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Ongoing retainers and embedded work
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Discovery and research phases
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Clients who frequently change scope
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 mt-1">•</span>
                Projects with unclear requirements
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
            <p className="font-semibold text-white mb-3">Use Project Pricing For:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Well-defined deliverables
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Repeat project types you can estimate
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                When efficiency benefits you
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                Enterprise clients (prefer fixed budgets)
              </li>
            </ul>
          </div>
        </div>

        {/* Client Types */}
        <h2 id="by-client">Rates by Client Type</h2>

        <p>
          Who you work with affects what you can charge. Different clients have different budgets and expectations:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Enterprise / Fortune 500</span>
              </div>
              <span className="text-teal-300 font-bold">$150-350/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Larger budgets, longer sales cycles, more stakeholders. Expect formal processes, NDAs, and slower decisions.
              Higher rates but may require insurance and formal contracts.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Funded Startups (Series A+)</span>
              </div>
              <span className="text-teal-300 font-bold">$100-200/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Good budgets, fast-moving, value design. Often willing to pay for quality. May offer equity (usually not worth it).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Agencies</span>
              </div>
              <span className="text-teal-300 font-bold">$75-150/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Steady work, clear briefs, but lower rates (they mark up to clients). Good for filling pipeline gaps.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="font-semibold text-white">Small Businesses / Early Startups</span>
              </div>
              <span className="text-teal-300 font-bold">$50-100/hr</span>
            </div>
            <p className="text-sm text-zinc-400">
              Smaller budgets, but often more creative freedom. Good for building portfolio. Be clear about scope limits.
            </p>
          </div>
        </div>

        {/* How to Increase Rates */}
        <h2 id="increase-rates">How to Increase Your UX Designer Rates</h2>

        <p>Ready to raise your rates? Here&apos;s what actually moves the needle:</p>

        <div className="not-prose my-8 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Specialize in a Niche</p>
                <p className="text-sm text-zinc-400">
                  &quot;I design fintech apps&quot; commands higher rates than &quot;I design apps.&quot; Pick an industry (healthcare, fintech, SaaS)
                  or skill (research, design systems, accessibility) and go deep.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Target Larger Clients</p>
                <p className="text-sm text-zinc-400">
                  Enterprise and funded startup clients pay 2-3x what small businesses pay. Update your portfolio
                  and positioning to attract bigger fish.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Build Case Studies with Results</p>
                <p className="text-sm text-zinc-400">
                  &quot;Redesigned checkout flow, increasing conversion by 34%&quot; is worth more than &quot;Designed e-commerce site.&quot;
                  Quantify your impact whenever possible.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Raise Rates with New Clients First</p>
                <p className="text-sm text-zinc-400">
                  Test higher rates with incoming leads. If they say yes, you know you can charge more. Gradually
                  bring existing clients up to your new standard rate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <h2 id="key-takeaways">Key Takeaways</h2>

        <ul>
          <li><strong>Mid-level UX designers</strong> charge $85-125/hour; senior designers charge $125-175+/hour</li>
          <li><strong>Specialization matters:</strong> AI/ML interface design, design systems, and accessibility command premium rates</li>
          <li><strong>Location still affects rates</strong>, but remote work has narrowed the gap—quality matters more than geography</li>
          <li><strong>Client type is a major factor:</strong> Enterprise pays 2-3x what small businesses pay</li>
          <li><strong>Project pricing</strong> often works better than hourly for well-defined deliverables</li>
          <li><strong>To increase rates:</strong> specialize, target larger clients, and quantify your results</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <Calculator className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Calculate Your UX Designer Rate
          </h3>
          <p className="text-zinc-300 mb-4">
            Use our free calculator to find your minimum, standard, and premium hourly rates based on your income goals and expenses.
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
            href="/blog/when-to-raise-freelance-rates"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              When to Raise Your Rates
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Signs you&apos;re undercharging and how to increase.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
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
              Compare rates across developer specializations.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/graphic-designer-hourly-rate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Graphic Designer Hourly Rates (2026)
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Rates for brand, motion, and print design.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              View rates <ArrowRight className="h-3.5 w-3.5" />
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
        </div>
      </section>
    </article>
  );
}
