# SEO Publish Checklist

Run through this list every time a new blog post, tool page, or compare page is published.

1. ✅ Build passes (`pnpm build`)
2. ✅ Type check passes (`pnpm type-check`)
3. ✅ Page has Article + FAQ schema (use components from `components/seo/schemas.tsx`)
4. ✅ HowTo schema added if the post has step-by-step content
5. ✅ Title under 60 chars (before `| Cashcast` suffix); meta description under 155 chars
6. ✅ Title leads with a specific benefit, number, or audience callout — not generic
7. ✅ Internal links to 2-3 related pages added
8. ✅ Added to `lib/blog/posts.ts` registry (for blog posts) or relevant index
9. ✅ Added to `app/sitemap.ts` with appropriate priority (0.7-0.9 for blog, 0.9-1.0 for tools)
10. ✅ **Manual indexing requested in Google Search Console** (URL Inspection → Request Indexing) — saves 5-10 days of crawl wait
11. ✅ Committed and pushed
12. ✅ One internal link added from an existing high-traffic post (link equity boost)
