# Cashcast — Vibe Marketing Strategy

**Created:** May 29, 2026 (Day 85)
**Source:** 7 distribution strategies from "The Vibe Marketer" / Late Checkout Agency YouTube video
**Founder context:** Full-time employee, parent of 2, ~5 hrs/week founder time, does NOT use own voice (ElevenLabs + CapCut for video)
**Premise:** Distribution is now the moat. AI commoditized building. Audience and brand cannot be commoditized.

---

## The 7 strategies — TL;DR

| # | Strategy | Cashcast verdict | Priority |
|---|---|---|---|
| 1 | MCP Server (AI sales team) | HIGH IMPACT, one-time build. Freelancers ask Claude/ChatGPT finance questions; an MCP server makes Cashcast discoverable. | **#3 (Month 2-3)** |
| 2 | Programmatic SEO (10K pages) | Massive upside, high upfront effort. Cashcast has the bones (rate guides + comparison pages). Defer. | **#4 (Month 3+)** |
| 3 | Free Tool as Top of Funnel | Already partially doing. Each new tool = perpetual organic traffic. Fits 5-hr/week. | **#2 (Week 2-4)** |
| 4 | Answer Engine Optimization (AEO) | Incremental refinement to existing SEO. Low effort, real upside. | **#5 (ongoing within existing posts)** |
| 5 | Viral Artifacts | High potential but privacy-sensitive (financial data). Needs careful design. | **#6 (Month 4+)** |
| 6 | Buy a Niche Newsletter | $5K-$20K cost. Not feasible at $0 MRR. | **SKIP — revisit at $2K+ MRR** |
| 7 | AI Content Repurposing Engine | PERFECT FIT. Brain-dump once → AI generates a week of content. No voice needed. | **#1 (Week 1-2)** |

**Brutal truth at 5 hrs/week:** You can run 1–2 strategies actively. The rest are queued. Don't try to do all 7.

---

## Strategy 7 (priority #1) — AI Content Repurposing Engine

**Why it's #1 for Cashcast:**
The only strategy that simultaneously (a) scales content output 10×, (b) fits inside 5-hr/week, (c) needs no upfront capital, and (d) starts this week. It solves the "what do I post this week" friction that's been limiting distribution to occasional LinkedIn posts.

**The "one pillar, many channels" workflow (NO-VOICE VERSION):**

The founder does not use their own voice. The "pillar" is a written brain-dump or a chat with Claude — NOT a voice recording. This is actually faster: no recording, no transcription, no audio cleanup.

```
Step 1: Capture the pillar (15 min — typing on lunch break or commute)
  → Open Claude. Either:
    (a) Brain-dump 300-500 words on a topic, OR
    (b) Ask Claude to interview you: "Ask me 5 questions about [topic],
        I'll answer each in a sentence" — then answer
  → Topic examples:
    "Why freelancers should forecast quarterly taxes"
    "The real cost of late-paying clients"
    "5 cash flow mistakes I see freelancers make"

Step 2: Claude generates the content pack (instant)
  → "Here's my brain-dump on [topic]. Generate:
     - 5 punchy tweets (under 280 chars)
     - 3 LinkedIn posts (story-driven, medium length)
     - 2 YouTube Short scripts (45-sec, hook-payoff, ElevenLabs-ready
       — VO lines only, no stage directions in the spoken text)
     - 1 newsletter draft (~400 words)
     - 1 blog post outline (H2s + key points)
     - 5 quote-graphic lines (one strong sentence each)"

Step 3: ElevenLabs voices the 2 Short scripts (5 min)
  → Paste each VO script → Adam voice (Stability 50, Similarity 75,
    Style 15) → download MP3

Step 4: CapCut produces the Shorts (15-20 min each, weekend block)
  → Screen recording of Cashcast UI + ElevenLabs MP3 + text overlays
  → 9:16 vertical, manual text overlays (free), no paid auto-captions
  → Cross-post same MP4 to TikTok

Step 5: Schedule the text content (15 min)
  → Buffer or Publer for Twitter (1/day) + LinkedIn (1/week Tuesday AM)
  → Newsletter → Cashcast email queue (when it exists)
  → Blog outline → next month's blog post
```

**Effort:** ~1.5-2 hrs/week for a full week of multi-channel content. No voice recording needed — typing/chatting with Claude IS the pillar. Faster than the voice-based version. Fits inside 5-hr/week budget with room to spare.

**Tooling:** Claude (content generation) + ElevenLabs (Short voiceovers) + CapCut (Short editing) + Buffer/Publer (scheduling). Total cost: ~$5/mo ElevenLabs + ~$0-15/mo scheduler.

**Timeline:** Start Week 1. Capture first pillar this weekend.

---

## Strategy 3 (priority #2) — Free Tools as Top of Funnel

**Why it matters for Cashcast:**
Already partially doing this (rate calculator, "Can I afford it?", signature generator). Each free tool = always-on marketing that needs no ongoing work. Perfect for a part-time founder.

**New tools to ship (one per month):**
- **Quarterly tax estimator for freelancers** — enter YTD income, see what you owe and when (highest priority — freelancers Google this 4× a year)
- **Late payment calculator** — what your client owes with interest, plus a "follow-up email" generator
- **Annual income smoother** — paste 12 months of irregular income, see your safe monthly burn
- **Project profitability calculator** — enter rate, hours, expenses; see real hourly rate after taxes

**Each tool should:**
- Require NO signup
- Have a "share result" button
- Link back to Cashcast contextually
- Have a unique SEO landing page with FAQ schema
- Get a launch tweet + LinkedIn post + 1 Short

**Effort per tool:** ~2 hrs (one weekend block + one evening block for content).
**Timeline:** Ship Quarterly Tax Estimator in Weeks 2-3. Then 1 new tool per month.

---

## Strategy 1 (priority #3) — MCP Server

**Why it matters for Cashcast:**
Freelancers increasingly ask Claude/ChatGPT financial questions. An MCP server makes Cashcast surface in those conversations — zero CAC, perfect product fit. Building an MCP server in 2026 is positioned like building for mobile in 2010.

**Tools the server would expose:**
- `get_safe_to_spend(user_id)` — current safe-to-spend amount
- `check_can_i_afford(amount, when)` — affordability check
- `get_runway(user_id)` — months of runway
- `get_next_invoice_payment(user_id)` — when next invoice clears
- `get_quarterly_tax_estimate(user_id)` — what's owed and when

**Where to publish:** Smithery, MCPT, OpenTools registries.
**Effort:** 1-3 days dedicated — needs a vacation day or extended weekend block, NOT 5-hr/week pace.
**Timeline:** Month 2-3.
**Risk:** Financial data + AI = privacy considerations. Auth flow must not expose user data through MCP responses.

---

## Strategy 2 (priority #4) — Programmatic SEO

**Why it matters for Cashcast:**
The 10 existing freelance rate guides prove the keyword pattern works. Programmatic SEO scales from 10 pages to 1,000+.

**Cashcast-applicable patterns:**
- `/tools/[profession]-[city]-rate` — "graphic designer NYC hourly rate" (50 professions × 100 cities = 5,000 pages)
- `/blog/cash-flow-for-[profession]`
- `/compare/[competitor]-vs-cashcast-for-[profession]`
- `/tools/late-payment-calculator-for-[profession]`

**The math:** 10,000 pages × 30 visits/month × 2% signup = real volume from build-once pages.
**Effort:** 2-4 weeks to set up template + data pipeline (Firecrawl) + AI generation + human QA.
**Timeline:** Month 3+.
**Critical caveat:** Google penalizes thin AI content. Each page needs genuine value (rate data, market context, location insights). Human-in-the-loop required. Start with 100-page MVP before scaling.

---

## Strategy 4 (priority #5) — Answer Engine Optimization (AEO)

**Why it matters for Cashcast:**
Pieter Levels reported AI referrals jumping 4% → 20% in one month. AI engines (ChatGPT, Perplexity, Claude search) cite well-structured content. Cashcast's 40+ posts mostly aren't AEO-optimized.

**What changes from regular SEO:**
- Lead each post with a definitive 1-2 sentence answer to the title question
- Add comparison tables for any "X vs Y" content
- Schema markup: FAQ, HowTo, Article with `speakable`
- Citation-friendly paragraph chunks (one defensible claim each)
- Numerical answers where possible ("save 30% for taxes" — exact, not vague)

**Action plan:**
1. Audit top 10 trafficked posts. Refactor for AEO format.
2. Find the top 20 questions freelancers ask (Google "people also ask", AlsoAsked.com, Perplexity).
3. Write definitive answers — standalone posts or expanded FAQ sections.

**Effort:** 1-2 hrs per post. Fits inside existing weekly content time.
**Timeline:** Refactor 1 existing post per week starting Week 4.

---

## Strategy 5 (priority #6) — Viral Artifacts

**Why it matters for Cashcast:**
Spotify Wrapped → 100M+ shares each December. People share what makes them look good or self-aware. Financial wins are shareable IF framed without exposing private balances.

**Cashcast-specific artifacts (privacy-safe):**
- **Cashcast Wrapped (yearly):** "You forecasted X days ahead. Avoided Y overdrafts. Longest runway: Z months." — behavioral wins, no dollar amounts.
- **"I forecast X months out" badge** for Twitter/LinkedIn bios
- **Streak counter:** "30 days of cash flow tracking" (Duolingo-style)
- **Freelancer Money Persona quiz** — generates a shareable, branded result card

**Effort:** 1-2 weeks per artifact (design + dev). Heavy for current pace.
**Timeline:** Month 4+. Consider Cashcast Wrapped for December 2026 (start designing in October).

---

## Strategy 6 — Buy a Niche Newsletter

**SKIP at current stage.**
- Cost: $5K-$20K. Cashcast has $99 in revenue (friends-and-family).
- **Free alternative:** content swaps / guest essays with existing freelancer newsletters.
- **Revisit when:** Cashcast hits $2K+ MRR.

---

## Implementation order (aligned with 5-hr/week, no-voice)

### Weeks 1-2: AI Content Repurposing Engine
- Week 1: Capture first pillar (brain-dump or Claude interview). Generate content pack. Schedule first week of text. Produce 1 Short (ElevenLabs + CapCut).
- Week 2: Repeat with a new topic. Two pillars now cycling.

### Weeks 3-6: First Free Tool — Quarterly Tax Estimator
- Week 3: Scaffold the tool (90-min weekend block).
- Week 4: Launch — tweet, LinkedIn, Short, blog post.
- Weeks 5-6: Monitor, iterate.

### Month 2 (Weeks 7-10): Plan + build MCP Server
- Week 7: Architecture, tools, auth flow, registry plan.
- Weeks 8-10: Build during a vacation day / extended block. Submit to Smithery + MCPT + OpenTools.

### Month 3 (Weeks 11-14): Free Tool #2 + AEO refactor
- New tool: Late Payment Calculator.
- AEO: refactor 4 top-trafficked posts.

### Months 4-6 (Weeks 15-26): Programmatic SEO MVP + Viral Artifact
- Programmatic SEO: ship 100-page MVP using rate-guide template.
- Viral artifact: design Cashcast Wrapped; ship in December.

---

## What this strategy doc is NOT
- ❌ Not a "do all 7 at once" plan
- ❌ Not a replacement for the 90-day distribution plan — it complements it (the repurposing engine IS the engine that feeds the Shorts + blog cadence)
- ❌ Not a guarantee — vibe marketing is new; AI search behavior shifts
- ❌ Not paid-ads — no paid spend (except optional $39 MicroLaunch + ~$5-20/mo tools)

---

## The single most important takeaway

The video's framing — "distribution is the new moat" — is correct for Cashcast. 85 days of building done; the product is solid. The next 6 months should be 80% distribution, 20% maintenance.

Of the 7 strategies, the **AI Content Repurposing Engine** is the unlock. Once running, one 15-minute brain-dump becomes a week of content across 5+ channels — voiced by ElevenLabs, edited in CapCut, no founder voice required. That's how a 5-hr/week founder competes with full-time marketers.

**Start this weekend: brain-dump one freelancer cash flow topic into Claude, generate the content pack, ship the outputs over 7 days.**

---

**This is a living document. Re-evaluate after Month 1 — is the repurposing engine running consistently? If yes, proceed to free tool. If no, fix the engine before adding more strategies.**
