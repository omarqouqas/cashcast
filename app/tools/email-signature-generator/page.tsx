import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { EmailSignatureGenerator } from '@/components/tools/email-signature-generator';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { Mail, Palette, Copy, Smartphone, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Email Signature Generator | Create Professional Signatures | Cashcast',
  description:
    'Create a free professional email signature in seconds. Choose from 4 templates, add your photo, social links, and copy to Gmail, Outlook, or Apple Mail.',
  keywords: [
    'email signature generator',
    'free email signature',
    'professional email signature',
    'html email signature',
    'email signature template',
    'gmail signature',
    'outlook signature',
    'email signature maker',
    'freelance email signature',
  ],
  alternates: {
    canonical: 'https://cashcast.money/tools/email-signature-generator',
  },
  openGraph: {
    title: 'Free Email Signature Generator - Create Professional Signatures',
    description:
      'Create a professional email signature in seconds. 4 templates, social links, photo support. Works with Gmail, Outlook, and Apple Mail.',
    url: 'https://cashcast.money/tools/email-signature-generator',
    siteName: 'Cashcast',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Email Signature Generator | Cashcast',
    description:
      'Create professional email signatures for free. Choose from 4 templates and copy to any email client.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Email Signature Generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://cashcast.money/tools/email-signature-generator',
} as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I add an email signature in Gmail?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Gmail: 1) Click the gear icon and select "See all settings", 2) Scroll down to the Signature section, 3) Click "Create new", 4) Paste your signature using Ctrl+V (Cmd+V on Mac), 5) Click "Save Changes" at the bottom. Your signature will now appear on all new emails.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I add an email signature in Outlook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Outlook: 1) Go to File > Options > Mail > Signatures, 2) Click "New" to create a signature, 3) Paste your signature using Ctrl+V, 4) Select when to use it (new messages, replies), 5) Click "OK". For Outlook web, go to Settings > View all Outlook settings > Mail > Compose and reply > Email signature.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I include in a professional email signature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A professional email signature should include: your full name, job title, company (if applicable), phone number, email address, and website. Optional additions include LinkedIn profile, a professional photo, and location. Keep it concise—4-7 lines maximum.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why use an HTML email signature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HTML email signatures look more professional with formatted text, clickable links, and images. They maintain consistent styling across email clients and make it easy for recipients to click your website, social profiles, or phone number directly.',
      },
    },
  ],
} as const;

const faqs = [
  {
    question: 'How do I add an email signature in Gmail?',
    answer:
      'In Gmail: Click the gear icon → "See all settings" → Scroll to Signature → "Create new" → Paste your signature → Save Changes. Your signature will appear on all new emails.',
  },
  {
    question: 'How do I add an email signature in Outlook?',
    answer:
      'In Outlook desktop: File → Options → Mail → Signatures → New → Paste → OK. In Outlook web: Settings → View all Outlook settings → Mail → Compose and reply → Email signature.',
  },
  {
    question: 'What should I include in a professional email signature?',
    answer:
      'Include: full name, job title, company, phone, email, and website. Optional: LinkedIn, photo, location. Keep it to 4-7 lines maximum.',
  },
  {
    question: 'Why use an HTML email signature?',
    answer:
      'HTML signatures look more professional with formatted text, clickable links, and images. They work consistently across email clients and make contact info actionable.',
  },
];

export default function EmailSignatureGeneratorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Dot grid background */}
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
              breadcrumbs.tools,
              { name: 'Email Signature Generator', url: 'https://cashcast.money/tools/email-signature-generator' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Mail className="h-4 w-4 text-teal-400" />
              <span>Free tool • No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Free Email Signature Generator
            </h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Create a professional email signature in seconds. Choose from 4 templates, add your details,
              and copy to Gmail, Outlook, or Apple Mail.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Palette className="h-4 w-4 text-teal-300" />
                  4 Templates
                </div>
                <p className="mt-2 text-sm text-zinc-400">Minimal, Professional, With Photo, or Modern Card.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Copy className="h-4 w-4 text-teal-300" />
                  One-click copy
                </div>
                <p className="mt-2 text-sm text-zinc-400">Copy as HTML or plain text. Paste anywhere.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Smartphone className="h-4 w-4 text-teal-300" />
                  Works everywhere
                </div>
                <p className="mt-2 text-sm text-zinc-400">Gmail, Outlook, Apple Mail, and more.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <EmailSignatureGenerator />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              This tool generates email signatures using standard HTML that works in most email clients. Photo
              URLs must be publicly accessible to display correctly. We don&apos;t store any of your data.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                    {faq.question}
                    <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-white mb-4">Related Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/tools/freelance-rate-calculator"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelance Rate Calculator
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Calculate your ideal hourly rate based on income goals and expenses.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Try calculator <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/tools/invoice-payment-predictor"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Invoice Payment Predictor
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Predict when you&apos;ll actually get paid based on client history.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Try calculator <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-300">
              Got your signature? Now track when clients will pay your invoices.
            </p>
            <Link
              href="/auth/signup"
              className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
            >
              Try Cashcast Free
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
