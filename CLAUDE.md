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
