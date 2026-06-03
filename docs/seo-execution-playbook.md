# Cashcast SEO Execution Playbook

**Created:** May 29, 2026 (Day 85)
**Source:** Adapted from Agensi founder's r/SaaS post (1.5M impressions, 12.9K clicks, 1,200 AI-referral sessions/month in 3 months — solo founder + Claude)
**Budget:** Fits inside ~3 hrs/week of the 5 hrs/week founder time

---

## What this playbook is

A weekly execution cadence for AEO + LLM-discovery SEO. The Agensi founder hit explosive growth in 3 months by:
1. Writing targeted articles answering specific user-intent questions
2. Putting schema markup on EVERY page (not just product pages)
3. Running weekly GSC analysis to fix small technical issues
4. Building marketplace-style landing pages at scale
5. Using Claude as analyst, founder as decision-maker

Cashcast adapts 70-80% of this. The "1 article/day" pace is replaced with "1 article/week + refactor 1 existing post/week" to fit a part-time founder.

---

## The 5 plays (in priority order)

### Play 1 — Schema markup audit (one-time, ~3 hrs)

**Why:** The Agensi founder credited structured data as the reason AI assistants (ChatGPT, Gemini, Perplexity, Claude, Kagi) started citing the site organically. 1,200 sessions/month from AI referrals with no outreach.

**Action:**
- List every public page on cashcast.money (blog posts, tools, compare pages, glossary, landing, pricing)
- For each, confirm presence of:
  - Article schema with `speakable` markup
  - FAQ schema (where there's Q&A content)
  - HowTo schema (where there's step-by-step content)
  - BreadcrumbList schema
  - Organization + WebSite schemas (already done globally per Day 85 work)
  - Product schema with aggregateRating + review (where pricing is shown)
- Use Claude to scan existing page TSX files and report which schemas are missing on which pages
- Fix in one weekend block

**Owner:** Solo founder. One weekend morning.

---

### Play 2 — Weekly GSC analysis habit (30-45 min/week, Sundays)

**Why:** The Agensi founder said: "Every week I'd export GSC data, feed it to Claude, and ask 'what's broken.' Fixing 10 small things per week compounds fast." Found duplicate schema on 90 URLs, a hydration bug causing 49% bounce rate, redirect chains, title tag truncation past 60 chars. **This is the single most under-rated tactic in the post.**

**Action:** Every Sunday evening (or after kids' bedtime):

1. Open Google Search Console
2. Export reports:
   - **Performance → Queries** (last 28 days)
   - **Performance → Pages** (last 28 days)
   - **Coverage** (indexed, excluded, errors)
   - **Core Web Vitals**
   - **Mobile Usability** (if available)
3. Paste exports into Claude with this prompt:

```
Here are 4 GSC exports from cashcast.money for the last 28 days.
What's broken? Identify in priority order:
1. Pages with high impressions but <1% CTR (title/meta issues)
2. Indexation errors or "discovered but not indexed" pages
3. Duplicate or conflicting schema markup
4. Pages dropping in ranking week-over-week
5. Title tags >60 chars (truncation)
6. Meta descriptions >155 chars (truncation)
7. Core Web Vitals failures
8. Mobile usability issues
9. Any pattern you spot that I'd miss

Give me 5-10 specific fixes ranked by ROI.
```

4. Fix the top 5-10 things this week.
5. Re-run next Sunday.

**Owner:** Solo founder. 30-45 min/week.

---

### Play 3 — AEO refactor of existing 40+ blog posts (1-2 posts/week)

**Why:** Existing posts likely lead with generic intros instead of definitive answers. AI engines cite content structured for direct answer extraction.

**Refactor checklist per post:**
- [ ] Open with a 1-2 sentence definitive answer to the title's question (becomes the snippet citation)
- [ ] Add or expand FAQ schema (8-10 questions, structured)
- [ ] Add comparison table if it's an "X vs Y" or alternatives post
- [ ] Add 3-5 internal links to related posts/tools
- [ ] Strip generic AI openers ("In today's fast-paced freelance world…" — delete on sight)
- [ ] Numerical answers wherever possible ("save 30% for taxes" not "save a portion")
- [ ] Citation-friendly paragraph chunks (one defensible claim each, paragraph-bounded)

**Cadence:** Refactor 1-2 posts/week. At 1.5/week average × 6 months = 36 posts refactored. By end of Month 6, ~90% of existing inventory is AEO-optimized.

**Owner:** Solo founder. ~1 hr/refactor. Stack with weekend block when possible.

---

### Play 4 — AI/SaaS directory backlinks for DR boost (1-2 submissions/week)

**Why:** Agensi founder hit DR 43 in 3 months primarily through AI directory backlinks (do-follow). Each submission takes ~30 min the first time.

**Target directories (submit 1-2 per week over 6-10 weeks):**

| # | Directory | DR | Cost | Notes |
|---|---|---|---|---|
| 1 | **F6s.com** | 70+ | Free | High value, takes time to approve |
| 2 | **Uneed.best** | 50+ | Free | Maker-focused, fast review |
| 3 | **AlternativeTo** | 80+ | Free | Highest DR target; list Cashcast as alternative to YNAB/Mint/PocketSmith |
| 4 | **SaaSHub** | 70+ | Free | Comparison-style, allows you to list against competitors |
| 5 | **ToolFinder.com** | 50+ | Free | |
| 6 | **There's An AI For That** | 65+ | Free (Cashcast has AI features) | |
| 7 | **GetApp** | 80+ | Free + paid options | High-intent buyer traffic |
| 8 | **Capterra** | 90+ | Free + paid | Very high DR, audience match low (mostly biz buyers) |
| 9 | **G2** | 85+ | Free listing | Reviews matter — push happy users to review |
| 10 | **OpenTools.com** | 40+ | Free | |
| 11 | **FutureTools.io** | 50+ | Free | AI-tool focused (Cashcast has AI) |
| 12 | **ProductHunt** | 90+ | Free | Save for the Month 5/6 official launch |
| 13 | **BetaList** | 65+ | Paid ($79 fast / free slow) | Established platform |
| 14 | **Indie Hackers products** | 60+ | Free | List the product profile |
| 15 | **MicroLaunch** | DR60+ | $39 | Already evaluated — buy for the backlink |

**Owner:** Solo founder. 30 min/submission × 1-2/week = ~1 hr/week.

---

### Play 5 — Manual GSC indexing requests (one-time backlog clear + ongoing)

**Why:** Saves 5-10 days of crawl wait per URL. Critical for new posts to start ranking faster.

**One-time backlog (one evening block, ~80 min):**
- Open GSC → URL Inspection
- Paste every existing post URL one at a time → "Request Indexing"
- 40 posts × ~2 min each ≈ 80 min total

**Ongoing:**
- Every new publish triggers a Request Indexing call
- Add to publish checklist

**Owner:** Solo founder. One-time 80 min + 2 min per future publish.

---

## Weekly cadence template

| Time | Activity | Duration |
|---|---|---|
| Sunday evening (after kids bedtime) | GSC analysis with Claude → fix 5-10 things | 30-45 min |
| One weekday lunch break | Submit 1 directory | 30 min |
| Weekend morning block | Refactor 1 existing blog post for AEO | 60 min |
| Ad-hoc within other writing time | Add schema to any new content | Variable |
| **Total** | | **~2-3 hrs/week** |

Fits inside the 5-hr/week founder budget with ~2 hrs left over for content production (Shorts, new blog drafts).

---

## What success looks like by Day 175 (6 months out)

**Realistic targets (compared to Agensi's 3-month results):**

| Metric | Agensi (3 mo) | Cashcast 6-mo target | Cashcast 12-mo target |
|---|---|---|---|
| Articles published/refactored | 100+ | 60+ | 100+ |
| GSC impressions | 1.5M | 300K-600K | 1M-1.5M |
| GSC clicks | 12.9K | 2K-5K | 8K-15K |
| AI-referral sessions/month | 1,200 | 300-700 | 1,000-2,000 |
| Domain rating | 43 | 25-30 | 35-45 |
| Daily active users | 1,000+ | 100-300 | 500-1,000 |

**Why slower:** part-time pace, US-focused freelancer niche (smaller than developer tools), starting DR lower.

**Why still achievable:** existing 40+ post inventory, established product, the playbook is proven.

---

## What this playbook is NOT

- ❌ Not a "1 article/day" sprint — that pace doesn't fit a part-time founder
- ❌ Not a replacement for the vibe-marketing strategy or 90-day distribution plan — it's the execution layer underneath
- ❌ Not a guarantee — SEO has Core Updates, Google can change algorithms, AI search behavior shifts
- ❌ Not a substitute for product-market fit — this drives traffic; conversion still depends on the upgrade funnel work shipped on Day 85

---

## The single most important takeaway

The Agensi founder's exact quote: **"None of this is glamorous. It's plumbing. But fixing 10 small things per week compounds fast."**

Most founders skip this playbook because it's boring. Showing up Sunday after Sunday with a GSC export and fixing 10 small things does not produce a tweet-worthy "I 10×ed my SaaS in 90 days" moment. It produces 1.5M impressions in 3 months.

**Start this Sunday.** Export GSC, paste to Claude, fix 5 things. Repeat next Sunday. By Month 3, you'll have data to compare.
