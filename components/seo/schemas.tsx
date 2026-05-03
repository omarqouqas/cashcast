/**
 * Structured data schemas for SEO/AEO/AIEO optimization
 * These schemas help search engines and AI assistants understand the content better
 *
 * AIEO (AI Engine Optimization) focuses on:
 * - Clear, citable definitions
 * - Speakable content for voice assistants
 * - Author expertise signals (E-E-A-T)
 * - FAQ schemas for AI knowledge extraction
 * - HowTo schemas for instructional content
 */

// ============================================================================
// SOCIAL PROFILES - Update these as profiles are created
// ============================================================================
export const socialProfiles = {
  linkedin: 'https://www.linkedin.com/company/cashcast/',
  youtube: 'https://www.youtube.com/channel/UCTHeSCHpXOGCN_Y1db5kfCg',
} as const;

// ============================================================================
// ORGANIZATION SCHEMA - Brand recognition and trust signals
// ============================================================================
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cashcast',
  url: 'https://cashcast.money',
  logo: 'https://cashcast.money/icon-512x512.png',
  description: 'Cash flow calendar app for freelancers with irregular income. See your bank balance up to 365 days ahead.',
  foundingDate: '2024',
  sameAs: [
    socialProfiles.linkedin,
    socialProfiles.youtube,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@cashcast.money',
    contactType: 'customer support',
    availableLanguage: 'English',
  },
  offers: {
    '@type': 'Offer',
    description: 'Free cash flow calendar for freelancers',
    price: '0',
    priceCurrency: 'USD',
  },
  // Knowledge panel signals
  knowsAbout: [
    'Cash flow forecasting',
    'Freelancer finances',
    'Irregular income management',
    'Personal finance',
    'Budgeting for self-employed',
    'Invoice tracking',
  ],
} as const;

// WebSite schema for sitelinks search box
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cashcast',
  url: 'https://cashcast.money',
  description: 'Cash flow calendar app for freelancers with irregular income',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://cashcast.money/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
} as const;

// Helper to generate BreadcrumbList schema
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Predefined breadcrumb paths
export const breadcrumbs = {
  home: { name: 'Home', url: 'https://cashcast.money' },
  tools: { name: 'Free Tools', url: 'https://cashcast.money/tools' },
  compare: { name: 'Compare', url: 'https://cashcast.money/compare' },
  pricing: { name: 'Pricing', url: 'https://cashcast.money/pricing' },
  blog: { name: 'Blog', url: 'https://cashcast.money/blog' },
} as const;

// AEO-optimized definitional content for common questions
export const definitions = {
  safeToSpend: {
    term: 'Safe to Spend',
    definition: 'Safe to Spend is the maximum amount you can spend today without risking an overdraft in the next 14 days. It\'s calculated by taking your lowest projected balance over the next two weeks and subtracting your safety buffer. This gives freelancers with irregular income a clear, single number that answers "Can I afford this?" without guessing.',
    alsoKnownAs: ['available balance', 'spendable amount', 'discretionary income', 'cushion'],
  },
  cashFlowCalendar: {
    term: 'Cash Flow Calendar',
    definition: 'A cash flow calendar is a visual tool that maps your expected income (like invoices, paychecks, or client payments) and upcoming bills onto specific dates. Unlike a traditional budget that shows monthly totals, a cash flow calendar shows your projected bank balance day-by-day, helping you spot low-balance days before they happen.',
    alsoKnownAs: ['bill calendar', 'payment calendar', 'balance forecast', 'income calendar'],
  },
  cashFlowForecast: {
    term: 'Cash Flow Forecast',
    definition: 'A cash flow forecast predicts your future bank balance based on known income and expenses. For freelancers, this means projecting when invoices will be paid, when bills are due, and what your balance will be on any given day. A good cash flow forecast helps you avoid overdrafts, plan large purchases, and manage irregular income.',
    alsoKnownAs: ['balance projection', 'cash projection', 'liquidity forecast', 'financial forecast'],
  },
  irregularIncome: {
    term: 'Irregular Income',
    definition: 'Irregular income refers to earnings that don\'t arrive on a predictable schedule or in consistent amounts. Freelancers, consultants, gig workers, and contractors typically have irregular income because they\'re paid per project, by the hour, or based on invoice terms like Net-30. This makes traditional monthly budgeting difficult and requires day-by-day cash flow planning.',
    alsoKnownAs: ['variable income', 'unpredictable income', 'project-based income', 'freelance income'],
  },
  runwayCollect: {
    term: 'Runway Collect',
    definition: 'Runway Collect is Cashcast\'s built-in invoicing feature that lets freelancers create professional invoices, send one-click payment links via Stripe, and automatically sync expected payments to their cash flow forecast. When a client pays, the invoice status updates automatically.',
    alsoKnownAs: ['invoicing feature', 'payment collection', 'invoice management'],
  },
} as const;

// ============================================================================
// AUTHOR/PERSON SCHEMA - E-E-A-T signals for blog content
// ============================================================================
export interface AuthorInfo {
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
}

export const defaultAuthor: AuthorInfo = {
  name: 'Cashcast Team',
  jobTitle: 'Personal Finance Experts',
  description: 'The Cashcast team specializes in cash flow management and financial planning for freelancers, consultants, and self-employed professionals.',
  url: 'https://cashcast.money/about',
};

export function generateAuthorSchema(author: AuthorInfo = defaultAuthor) {
  return {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.description,
    url: author.url,
    image: author.image,
    worksFor: {
      '@type': 'Organization',
      name: 'Cashcast',
      url: 'https://cashcast.money',
    },
  };
}

// ============================================================================
// SPEAKABLE SCHEMA - AIEO for voice assistants (Alexa, Siri, Google Assistant)
// ============================================================================
export interface SpeakableContent {
  headline: string;
  summary: string;
  url: string;
}

export function generateSpeakableSchema(content: SpeakableContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.headline,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-headline', '.speakable-summary', '.definition-box'],
    },
    url: content.url,
  };
}

// ============================================================================
// HOWTO SCHEMA - For tutorial/guide content (AIEO-optimized)
// ============================================================================
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToSchema {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration format, e.g., "PT30M" for 30 minutes
  estimatedCost?: { currency: string; value: string };
  steps: HowToStep[];
  url: string;
}

export function generateHowToSchema(howTo: HowToSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    totalTime: howTo.totalTime,
    estimatedCost: howTo.estimatedCost ? {
      '@type': 'MonetaryAmount',
      currency: howTo.estimatedCost.currency,
      value: howTo.estimatedCost.value,
    } : undefined,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
    url: howTo.url,
  };
}

// ============================================================================
// ARTICLE SCHEMA WITH ENHANCED AUTHOR - For blog posts
// ============================================================================
export interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: AuthorInfo;
  url: string;
  image?: string;
  keywords?: string[];
}

export function generateArticleSchema(article: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: generateAuthorSchema(article.author),
    publisher: {
      '@type': 'Organization',
      name: 'Cashcast',
      url: 'https://cashcast.money',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cashcast.money/icon-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    image: article.image || 'https://cashcast.money/og-image.png',
    keywords: article.keywords?.join(', '),
    // Speakable specification for voice assistants
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-headline', '.speakable-summary', '.definition-box'],
    },
  };
}

// ============================================================================
// SOFTWARE APPLICATION SCHEMAS - For each tool
// ============================================================================
export const toolSchemas = {
  canIAffordIt: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Can I Afford It? Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Free cash flow projection calculator to check if you can afford a purchase without going negative.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/can-i-afford-it',
    creator: organizationSchema,
  },
  freelanceRateCalculator: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Freelance Rate Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculate your ideal freelance hourly rate based on expenses, desired income, and billable hours.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/freelance-rate-calculator',
    creator: organizationSchema,
  },
  incomeVariabilityCalculator: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Income Variability Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Analyze how variable your freelance income is and plan for low-income months.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/income-variability-calculator',
    creator: organizationSchema,
  },
  invoicePaymentPredictor: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Invoice Payment Predictor',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Predict when your invoices will be paid based on client payment patterns and terms.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/invoice-payment-predictor',
    creator: organizationSchema,
  },
  taxReserveCalculator: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tax Reserve Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculate how much to set aside for quarterly estimated taxes as a freelancer or 1099 contractor.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/tax-reserve-calculator',
    creator: organizationSchema,
  },
  emailSignatureGenerator: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Email Signature Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Create a professional email signature for freelancers with payment links and contact info.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    url: 'https://cashcast.money/tools/email-signature-generator',
    creator: organizationSchema,
  },
} as const;

// ============================================================================
// AGGREGATE OFFER SCHEMA - For pricing page
// ============================================================================
export const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cashcast',
  description: 'Cash flow calendar app for freelancers with irregular income. See your bank balance up to 365 days ahead.',
  brand: {
    '@type': 'Brand',
    name: 'Cashcast',
  },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '149',
    priceCurrency: 'USD',
    offerCount: 3,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'USD',
        description: '90-day cash flow forecast, track up to 10 bills and 10 income sources',
        availability: 'https://schema.org/InStock',
        url: 'https://cashcast.money/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan (Monthly)',
        price: '7.99',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        description: '365-day forecast, unlimited bills and income, invoicing with Runway Collect, tax tracking',
        availability: 'https://schema.org/InStock',
        url: 'https://cashcast.money/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime Deal',
        price: '149',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        description: 'All Pro features forever with a one-time payment. No recurring fees.',
        availability: 'https://schema.org/InStock',
        url: 'https://cashcast.money/pricing',
      },
    ],
  },
} as const;

// ============================================================================
// FAQ SCHEMA HELPER - Reusable across pages
// ============================================================================
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// PRODUCT SCHEMA - Main app (legacy export for compatibility)
// ============================================================================
export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cashcast Pro',
  description: '365-day cash flow forecast with unlimited bills, invoicing, and tax tracking for freelancers',
  brand: {
    '@type': 'Brand',
    name: 'Cashcast',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
      description: '90-day forecast, 10 bills, 10 income sources',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Pro Plan',
      price: '7.99',
      priceCurrency: 'USD',
      priceValidUntil: '2026-12-31',
      description: '365-day forecast, unlimited bills and income, invoicing, tax tracking',
      availability: 'https://schema.org/InStock',
    },
  ],
} as const;
