# SEO & AIEO Implementation Guide

This document outlines the SEO (Search Engine Optimization) and AIEO (AI Engine Optimization) implementation for Cashcast. AIEO focuses on making content discoverable and citable by AI systems like ChatGPT, Claude, Perplexity, and voice assistants.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Structured Data Schemas](#structured-data-schemas)
3. [Page-Level SEO](#page-level-seo)
4. [AIEO-Specific Features](#aieo-specific-features)
5. [RSS Feed](#rss-feed)
6. [Robots & Sitemap](#robots--sitemap)
7. [Social Media Integration](#social-media-integration)
8. [Best Practices](#best-practices)
9. [Maintenance Checklist](#maintenance-checklist)

---

## Architecture Overview

### File Structure

```
components/seo/
├── schemas.tsx       # All JSON-LD schema definitions
├── breadcrumbs.tsx   # Breadcrumb navigation component
app/
├── layout.tsx        # Root layout with global schemas
├── sitemap.ts        # Dynamic sitemap generation
├── robots.ts         # Dynamic robots.txt
├── feed.xml/
│   └── route.ts      # RSS feed endpoint
```

### Key Technologies

- **Next.js Metadata API**: For meta tags, Open Graph, Twitter Cards
- **JSON-LD**: For structured data (Schema.org)
- **RSS 2.0**: For content syndication
- **Programmatic Sitemap**: Auto-generated from content

---

## Structured Data Schemas

All schemas are defined in `components/seo/schemas.tsx`.

### Organization Schema

Establishes brand identity across search engines and AI systems.

```typescript
import { organizationSchema } from '@/components/seo/schemas';
```

**Includes:**
- Company name, URL, logo
- Social profiles (sameAs)
- Contact information
- Knowledge panel signals (knowsAbout)

### Website Schema

Enables sitelinks search box in Google results.

```typescript
import { websiteSchema } from '@/components/seo/schemas';
```

### Product/Pricing Schema

Structured pricing information for rich results.

```typescript
import { pricingSchema } from '@/components/seo/schemas';
```

**Features:**
- AggregateOffer with price range ($0 - $149)
- Individual offers (Free, Pro Monthly, Lifetime)
- Price validity dates

### Article Schema (with Author)

For blog posts with E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals.

```typescript
import { generateArticleSchema, defaultAuthor } from '@/components/seo/schemas';

const articleSchema = generateArticleSchema({
  headline: 'Article Title',
  description: 'Article description',
  datePublished: '2026-01-23',
  dateModified: '2026-02-01',
  author: defaultAuthor, // or custom author
  url: 'https://cashcast.money/blog/slug',
  keywords: ['keyword1', 'keyword2'],
});
```

### FAQ Schema

Enables FAQ rich results and helps AI systems extract Q&A pairs.

```typescript
import { generateFAQSchema } from '@/components/seo/schemas';

const faqSchema = generateFAQSchema([
  { question: 'What is X?', answer: 'X is...' },
  { question: 'How does Y work?', answer: 'Y works by...' },
]);
```

### HowTo Schema

For instructional content (tutorials, guides).

```typescript
import { generateHowToSchema } from '@/components/seo/schemas';

const howToSchema = generateHowToSchema({
  name: 'How to Set Up Cash Flow Forecasting',
  description: 'A step-by-step guide...',
  totalTime: 'PT10M', // ISO 8601 duration
  steps: [
    { name: 'Create Account', text: 'Sign up at...' },
    { name: 'Add Bills', text: 'Enter your recurring...' },
  ],
  url: 'https://cashcast.money/blog/setup-guide',
});
```

### Tool Schemas (SoftwareApplication)

Pre-defined schemas for each free tool.

```typescript
import { toolSchemas } from '@/components/seo/schemas';

// Available: canIAffordIt, freelanceRateCalculator, incomeVariabilityCalculator,
//            invoicePaymentPredictor, taxReserveCalculator, emailSignatureGenerator
```

### Breadcrumb Schema

Auto-generated with the Breadcrumbs component.

```typescript
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';

<Breadcrumbs
  items={[
    breadcrumbs.home,
    breadcrumbs.blog,
    { name: 'Post Title', url: 'https://cashcast.money/blog/slug' },
  ]}
/>
```

---

## Page-Level SEO

### Metadata Configuration

Every public page should export metadata:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | Cashcast',
  description: 'Page description (150-160 characters)',
  keywords: ['keyword1', 'keyword2'],
  alternates: {
    canonical: 'https://cashcast.money/page-path',
  },
  openGraph: {
    title: 'Page Title',
    description: 'OG description',
    url: 'https://cashcast.money/page-path',
    siteName: 'Cashcast',
    type: 'website', // or 'article' for blog posts
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Twitter description',
  },
};
```

### NoIndex for Private Pages

Dashboard and authenticated pages must be excluded from indexing:

```typescript
// In dashboard/layout.tsx and onboarding/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
```

---

## AIEO-Specific Features

AIEO (AI Engine Optimization) helps AI systems understand, cite, and recommend your content.

### 1. Speakable Schema

For voice assistant optimization. Add speakable CSS selectors to important content:

```typescript
import { generateSpeakableSchema } from '@/components/seo/schemas';

const speakableSchema = generateSpeakableSchema({
  headline: 'What is Safe to Spend?',
  summary: 'Safe to Spend is the maximum amount...',
  url: 'https://cashcast.money/blog/what-is-safe-to-spend',
});
```

In your HTML, mark speakable content:

```html
<h1 class="speakable-headline">What is Safe to Spend?</h1>
<p class="speakable-summary">Safe to Spend is the maximum amount...</p>
```

### 2. Definition Boxes

Clear, citable definitions for key concepts:

```typescript
import { definitions } from '@/components/seo/schemas';

// Use in components:
<div className="definition-box">
  <h2>{definitions.safeToSpend.term}</h2>
  <p>{definitions.safeToSpend.definition}</p>
  <p>Also known as: {definitions.safeToSpend.alsoKnownAs.join(', ')}</p>
</div>
```

**Available definitions:**
- `safeToSpend`
- `cashFlowCalendar`
- `cashFlowForecast`
- `irregularIncome`
- `runwayCollect`

### 3. Author Attribution (E-E-A-T)

```typescript
import { generateAuthorSchema, defaultAuthor } from '@/components/seo/schemas';

// For blog posts, author is included in article schema
const articleSchema = generateArticleSchema({
  // ...
  author: {
    name: 'Expert Name',
    jobTitle: 'Personal Finance Expert',
    description: 'Bio description...',
    url: 'https://cashcast.money/about',
  },
});
```

### 4. FAQ Structured Data

Every page with Q&A content should include FAQ schema:

```typescript
const faqs = [
  { question: 'Question 1?', answer: 'Answer 1.' },
  { question: 'Question 2?', answer: 'Answer 2.' },
];

const faqSchema = generateFAQSchema(faqs);

// Add to page:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>
```

---

## RSS Feed

The RSS feed is available at `/feed.xml` and is auto-discovered via the root layout.

### Features

- All blog posts in reverse chronological order
- Full metadata (title, description, author, category)
- Proper caching headers (1 hour)
- Standard RSS 2.0 with Atom namespace

### Implementation

Located at `app/feed.xml/route.ts`. Updates automatically when blog posts are added to `lib/blog/posts.ts`.

---

## Robots & Sitemap

### robots.txt

Located at `app/robots.ts`:

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /onboarding/
Sitemap: https://cashcast.money/sitemap.xml
```

### Sitemap

Located at `app/sitemap.ts`. Automatically includes:

- Core pages (home, pricing, signup)
- All blog posts (from `lib/blog/posts.ts`)
- Comparison pages
- Free tools
- Auth and legal pages

---

## Social Media Integration

### Social Profiles

Update in `components/seo/schemas.tsx`:

```typescript
export const socialProfiles = {
  twitter: 'https://twitter.com/cashcastmoney',
  linkedin: 'https://linkedin.com/company/cashcast',
  youtube: 'https://youtube.com/@cashcast',
  github: 'https://github.com/cashcast',
} as const;
```

These are automatically included in the Organization schema's `sameAs` array.

### Open Graph Images

- Default: `/og-image.png` (1200x630px)
- Per-page custom images can be added in metadata

---

## Best Practices

### Content Guidelines for AIEO

1. **Lead with definitions**: Start articles with clear, quotable definitions
2. **Use structured headings**: H2 for main sections, H3 for subsections
3. **Include FAQ sections**: End articles with common questions
4. **Add "Also known as"**: Include synonyms and related terms
5. **Date content**: Always include publication and modification dates

### Technical Guidelines

1. **Canonical URLs**: Always set `alternates.canonical`
2. **Unique titles**: Each page needs a unique `<title>`
3. **Description length**: 150-160 characters
4. **Image alt text**: Descriptive alt text for all images
5. **Internal linking**: Link between related content

### Schema Validation

Test schemas at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Maintenance Checklist

### Weekly

- [ ] Verify RSS feed is updating (`/feed.xml`)
- [ ] Check Google Search Console for errors
- [ ] Monitor Core Web Vitals

### Monthly

- [ ] Update `priceValidUntil` dates in pricing schema
- [ ] Review and update social profiles
- [ ] Add new tools to sitemap and tool schemas
- [ ] Audit structured data with Google Rich Results Test

### Quarterly

- [ ] Review and update keywords across pages
- [ ] Add new FAQ items based on support questions
- [ ] Update definitions based on user feedback
- [ ] Audit AIEO performance (AI citation tracking)

### When Adding New Content

**New Blog Post:**
1. Add to `lib/blog/posts.ts`
2. Create page with Article + FAQ schemas
3. Add breadcrumbs
4. Include speakable content

**New Tool:**
1. Add to `toolSchemas` in `schemas.tsx`
2. Add to sitemap
3. Create WebApplication schema on page
4. Add breadcrumbs

**New Comparison Page:**
1. Add to sitemap
2. Create with FAQ schema
3. Add breadcrumbs
4. Include comparison table markup

---

## Files Modified in This Implementation

| File | Changes |
|------|---------|
| `components/seo/schemas.tsx` | Added social profiles, Author schema, HowTo schema, Speakable schema, tool schemas, pricing schema, FAQ helper |
| `app/layout.tsx` | Added RSS feed link |
| `app/dashboard/layout.tsx` | Added noindex meta |
| `app/onboarding/layout.tsx` | Created with noindex meta |
| `app/pricing/page.tsx` | Enhanced metadata, added pricing + FAQ schemas |
| `app/feed.xml/route.ts` | Created RSS feed |
| `app/sitemap.ts` | Added missing tools and comparison pages |
| `docs/SEO-AIEO-IMPLEMENTATION.md` | This documentation |

---

*Last updated: May 2026*
