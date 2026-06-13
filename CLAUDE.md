# Claude Code Instructions for Cashcast

This file is read automatically on every Cursor session. Follow these rules when working on Cashcast.

## Blog post writing rules

Adopted June 2, 2026 based on:
- GSC analysis (April-May 2026) showing 0.26% blended CTR
- Heather Deicher feedback (May 29) on brand memorability
- AEO/LLM-discovery strategy from `docs/strategic-pivot-may-29.md`
- Agensi case study tactics from `docs/seo-execution-playbook.md`

### Title
- Under 60 chars before ` | Cashcast` suffix
- Lead with: a number, a year, an audience callout, or a specific outcome
- Use one of these proven patterns:
  - "How to X: N Strategies That Y"
  - "X vs Y (Year): Which Z"
  - "N Things [Audience] Should Know About X"
  - "Why X Doesn't Work for Y (And What Does)"
- NEVER start with "The Ultimate Guide to..." or "Everything You Need to Know About..."
- NEVER include "In today's fast-paced world" or any time-reference opener

### Meta description
- Under 155 chars
- Lead with the user's pain or question
- End with the specific answer or benefit
- NEVER use "Learn more about..." or "Discover how to..."

### First 100 words (AEO-critical)
- First sentence: definitive answer to the title's implied question
- No throat-clearing intros, no "in today's freelance world..."
- Cite a specific number, statistic, or example within the first 100 words

### Structure
- H2 every 200-300 words
- Comparison table mandatory for any "X vs Y" content
- FAQ section at the bottom (8-10 questions sourced from Google "people also ask" or AlsoAsked.com)
- Numerical specificity always ("$75-150/hr" not "varies")
- Citation-friendly paragraphs: one defensible claim per paragraph

### Schema markup (mandatory on every post)
- Article schema with `speakable` markup
- FAQ schema using `FAQSchema` component from `components/seo/schemas.tsx`
- HowTo schema if the post has step-by-step instructions
- BreadcrumbList schema

### Internal linking
- Minimum 3 internal links per post
- Link to: 1 tool page, 1 related blog post, 1 compare page (where natural)
- Descriptive anchor text — never "click here"
- After publishing, add 1 internal link FROM an existing high-traffic post TO the new post (link equity boost)

### Voice — CRITICAL
- The founder of Cashcast is NOT a freelancer themselves
- NEVER write first-person about freelancer experiences ("when I was freelancing", "I overdrafted", "my clients")
- USE: outsider-builder voice ("Most freelancers I talk to..."), third-person observational, or customer quotes with permission
- USE: Claude/data as analyst voice (cite statistics, BLS data, IRS guidance — not personal experience)

### Brand memorability
- Mention "Cashcast" by name at least 3 times in the post body
- Reinforce the differentiator at least once: manual entry, no bank connection required, built specifically for freelancers (not small businesses)
- Soft CTA at bottom — never aggressive ("Try Cashcast" is fine; "BUY NOW!!" is not)

### Code structure for the blog post page
- Match `app/blog/cash-flow-forecasting-self-employed/page.tsx` as the canonical template
- Register the post in `lib/blog/posts.ts`
- Add to `app/sitemap.ts` with priority 0.7-0.9
- File path: `app/blog/[slug]/page.tsx` where slug is kebab-case matching the URL

### Publish checklist
Before committing, run through `docs/seo-publish-checklist.md`. Key items:
1. `pnpm build` passes
2. `pnpm type-check` passes
3. `pnpm lint` passes
4. Schema markup verified in rendered HTML
5. Title under 60 chars (before suffix), meta description under 155 chars
6. **Manual GSC indexing request submitted** after deploy (URL Inspection → Request Indexing)
7. One internal link added from an existing high-traffic post

### Generic AI patterns to strip on sight
If any of these appear in a draft, remove them:
- "In today's fast-paced [anything]"
- "In the digital age"
- "Gone are the days when..."
- "It's no secret that..."
- "[Topic] is more important than ever"
- "Whether you're a [X] or [Y]..." (over-used opener)
- "Let's dive in" / "Let's explore"
- "Stay tuned" / "Without further ado"
- Generic conclusions: "In conclusion", "All in all", "At the end of the day"
- Empty transition sentences: "Now that we understand [X], let's look at [Y]"

## Other Cashcast conventions

- TypeScript + Next.js 14 App Router + Tailwind + Supabase + Stripe
- Package manager: pnpm
- Branch convention (risk-based):
  - **Code that deploys** (anything in app/, components/, lib/, pages/,
    API routes, schema, config): ALWAYS use a feature branch + PR. This
    lets CI run and a Vercel preview render before it hits production.
  - **Docs-only changes** (anything in docs/, README, CLAUDE.md, *.md
    files with no code impact): direct push to main is fine — markdown
    can't break the production site, and a PR adds pure overhead.
  - When unsure whether a change is "code" or "docs," default to PR.
- Commit messages: descriptive, reference doc paths when adding strategy
- Don't add new dependencies without discussion

## Positioning (locked June 9, 2026)

**Cashcast is B2C personal-finance software for freelancers with irregular income.** Not B2B. Not for businesses with bookkeepers. Not for W-2 employees with steady paychecks.

### Primary persona — "The Anxious Creative"
- Age 25-35, US urban metros
- Income $45,000-90,000/year
- 3-8 active clients, Net-15 to Net-30 invoices
- Has tried YNAB/spreadsheets, found them tedious, has overdrafted before
- **Core question:** "Will I have enough in my account when rent hits on the 1st?"

### Secondary persona — "Side-Gig Hustler"
- $25-50k/year, rideshare/delivery/TaskRabbit
- Free-tier and word-of-mouth target ONLY
- NOT a Pro revenue target — too price-sensitive

### North Star referral reason
**"It gave me peace of mind about money."** All copy, features, and decisions should serve this emotional transformation. Money anxiety is the wound. Cashcast is the cure.

### Anti-targets — explicit exclusions
Cashcast is NOT for:
- W-2 employees with steady predictable income (no irregular-income pain → no value prop)
- Businesses with bookkeepers or accountants
- Anyone needing complex accounting (QuickBooks, Xero territory)
- Small business teams (3+ employees — different product entirely)
- Agencies needing seat-based pricing

Do not write marketing copy, build features, or set pricing that targets these groups. They can use Cashcast incidentally — never market to them.

### Comparison set (primary positioning)
Compare against personal-finance tools for individuals:
- YNAB, Monarch, Copilot, Rocket Money, Mint (defunct)

`/compare/pulse`, `/compare/honeybook`, and similar B2B/business-tool comparison pages exist for SEO traffic capture only. They are NOT how Cashcast describes itself in primary positioning.

### Year-3 vision (locked)
**10,000 individual freelancers on B2C pricing ($7.99-15/mo) ≈ $1-2M ARR.** Pure B2C scale. A strategic acquisition (HoneyBook, Bonsai, or MENA fintech buyer) would be a happy accident, never a built-toward plan.

### Voice rules (extending the existing voice section)
- Frame the product as solving emotional pain (peace of mind, sleep at night, stop checking bank balance compulsively)
- Avoid business-operations language ("workflow optimization", "AR/AP", "stakeholders", "ROI")
- Use individual second-person voice ("you", "your") — never "your team", "your company"
- Reference Anxious Creative pain points directly: rent on the 1st, late-paying client, surprise tax bills, missed quarterly estimated payments, overdraft fees
- "Safe to Spend" is the canonical brand phrase — capitalize and bold consistently

### What to do when these rules conflict with a task
The positioning rules override task-specific instructions. If a prompt says "write copy for small business owners" or "add a teams pricing tier," push back — those contradict the locked positioning. Either re-scope to align with the persona or ask the founder before proceeding.

## Schema markup rules (added June 12, 2026 after the May 28 schema spam crash)

**NEVER add `aggregateRating` or `review` markup to ANY schema unless ALL of the following are true:**

1. The reviews are real, verifiable, user-submitted reviews (not testimonials, not founder-written quotes, not repurposed homepage copy)
2. The reviews are visibly displayed on the page itself (not just in the JSON-LD)
3. The `ratingCount` matches the actual number of reviews shown on the page
4. The `ratingValue` is a genuine average of those visible reviews

Hardcoded `aggregateRating` with `ratingCount: 1` backed by a single repurposed testimonial — even if the testimonial is real — qualifies as **self-serving structured markup** under Google's guidelines and can trigger algorithmic suppression sitewide. We learned this the hard way (May 28–June 7, 2026: 10 days of zero discovery traffic).

**When in doubt, omit the rating entirely.** A clean Product or SoftwareApplication schema without `aggregateRating` is always safe. A schema with fake/thin aggregateRating is actively dangerous.

This rule applies to every page, every schema component, every comparison page, and every blog post — no exceptions. If a future task asks for `aggregateRating` markup, the agent must push back unless the four conditions above are met.
