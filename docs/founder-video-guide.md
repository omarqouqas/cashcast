# Founder Video Guide

**Purpose:** Create a 60-second authentic founder video to build trust and increase conversions on the landing page.

**Research Insight:** "In an environment saturated with polished marketing, a raw, 60-second video of the founder explaining why they built the tool can outperform high-production content for B2B conversions."

---

## The Script (60 seconds)

### Version A: Empathy-Driven (Recommended)

```
[0-10 seconds - Hook]
"I kept hearing the same thing from my freelancer friends:
'I have money in my account, but I don't know if I can actually spend it.'"

[10-25 seconds - Problem]
"They'd get paid, feel good for a day,
then remember rent is due in three weeks and a client still hasn't paid.
Spreadsheets that took hours and were wrong by Tuesday.
That constant low-grade anxiety about money."

[25-40 seconds - Solution]
"So I built Cash Flow Forecaster for them.
It shows one number: what's actually safe to spend today,
without overdrafting later.
Add your bills, your expected income, and see your real bank balance
90 days into the future."

[40-55 seconds - Proof + CTA]
"No bank connection required. No complicated setup.
Just clarity on whether you can afford that new laptop,
take that trip, or need to chase that invoice.
Try it free — link's below."

[55-60 seconds - Sign off]
"I'm Omar. I built this for every freelancer tired of guessing."
```

### Version B: Story-Driven

```
[0-10 seconds - Hook]
"A designer friend called me stressed out of her mind.
She had $8,000 in her account but didn't know if she could buy a $200 chair."

[10-25 seconds - Problem]
"Turns out, after rent, taxes, and two late-paying clients,
she actually had about $400 of breathing room.
She'd been doing this mental math for years.
So had every other freelancer I knew."

[25-40 seconds - Solution]
"I'm a developer, so I built them a tool.
Cash Flow Forecaster maps out your real bank balance
for the next 90 days — every bill, every expected payment.
One number tells you what's safe to spend right now."

[40-55 seconds - Key Benefit]
"No more spreadsheets. No more guessing.
Just open the app and know exactly where you stand."

[55-60 seconds - CTA]
"Try it free. Link below.
Built for freelancers, by someone who listens to them."
```

### Version C: Ultra-Short (45 seconds)

```
[0-10 seconds - Hook]
"Every freelancer I know has the same problem:
money in the bank, but no idea if they can spend it."

[10-25 seconds - Problem + Solution]
"Bills coming up. Clients paying late. Taxes due in April.
So I built Cash Flow Forecaster —
it shows your real bank balance 90 days ahead,
accounting for everything coming in and going out."

[25-40 seconds - Key Feature]
"One number: Safe to Spend.
What you can actually use today without screwing yourself next month."

[40-45 seconds - CTA]
"Try it free. No credit card needed. Link below."
```

---

## Recording Tips

### Setting
- **Background:** Clean, simple — home office, plain wall, or blurred background
- **Lighting:** Face a window (natural light) or use a ring light
- **Audio:** Quiet room, no echo. AirPods/lapel mic > phone mic
- **Framing:** Head and shoulders, eyes in upper third of frame

### Delivery
- **Tone:** Conversational, like talking to a friend who freelances
- **Speed:** Slightly slower than normal — nervous speakers rush
- **Eye contact:** Look at camera lens, not screen
- **Authenticity:** Imperfect is fine. One or two takes max. Don't over-polish.

### What to Avoid
- Reading from a script (memorize key points, speak naturally)
- Corporate tone or marketing speak
- Over-explaining features
- Being too long (60 seconds max, 45 is ideal)

---

## Recommended Tools

### Recording (Choose One)

| Tool | Platform | Best For | Cost |
|------|----------|----------|------|
| **iPhone/Android Camera** | Mobile | Quickest setup, surprisingly good quality | Free |
| **Loom** | Desktop/Web | Screen + face recording, easy sharing | Free tier |
| **QuickTime (Mac)** | Mac | Simple webcam recording | Free |
| **OBS Studio** | All | Pro-level control, free | Free |
| **Riverside.fm** | Web | High-quality remote recording | Free tier |

**Recommendation:** Use your phone in landscape mode. Prop it at eye level. Natural light from a window.

### Editing (If Needed)

| Tool | Platform | Best For | Cost |
|------|----------|----------|------|
| **CapCut** | Mobile/Desktop | Quick edits, captions, trending | Free |
| **iMovie** | Mac/iOS | Simple cuts, built-in | Free |
| **Descript** | Desktop | Edit video like a doc, auto-captions | Free tier |
| **Canva Video** | Web | Add text overlays, branding | Free tier |

**Recommendation:** CapCut or Descript. Both have auto-captions which boost engagement.

### Captions (Important!)

85% of social videos are watched on mute. Add captions.

| Tool | Notes |
|------|-------|
| **CapCut** | Auto-generates captions, styleable |
| **Descript** | Best accuracy, edit by editing text |
| **Veed.io** | Web-based, quick auto-captions |
| **Rev.com** | Human-accurate, paid |

---

## Where to Use the Video

### 1. Landing Page (Primary)

**Placement Options:**

**Option A: Hero Section**
- Add video thumbnail with play button next to hero text
- Opens in modal on click
- High visibility, immediate trust signal

**Option B: Below Hero, Above Features**
- Dedicated "Why I Built This" section
- Less intrusive, users who scroll are more engaged

**Option C: Social Proof Section**
- Place near testimonials
- Reinforces authenticity

**Implementation:**
```tsx
// Example placement in app/page.tsx
<section className="px-6 py-12">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-2xl font-semibold text-white">Why I Built This</h2>
    <div className="mt-6 aspect-video rounded-xl overflow-hidden">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... />
    </div>
  </div>
</section>
```

### 2. Social Media Distribution

| Platform | Format | Notes |
|----------|--------|-------|
| **Twitter/X** | Native upload | Pin to profile, use in launch thread |
| **LinkedIn** | Native upload | Tag #freelance #entrepreneur |
| **YouTube** | Full video | SEO value, embed on site |
| **TikTok** | Vertical recut | Younger freelancer audience |
| **Instagram Reels** | Vertical recut | Designer/creative audience |

**Twitter Thread Format:**
```
Tweet 1: Video + "I kept hearing the same thing from freelancer friends: 'I have money but I don't know if I can spend it.' So I built them a tool."

Tweet 2: "The problem: Freelancers never know if the money in their bank is actually theirs. Bills, taxes, late clients — it's constant mental math."

Tweet 3: "The solution: Cash Flow Forecaster shows your real bank balance 90 days ahead. One number tells you what's safe to spend today."

Tweet 4: "No bank connection. No spreadsheets. Try it free: [link]"
```

### 3. Email Sequences

- **Welcome email:** Embed video or thumbnail with link
- **Onboarding Day 3:** "Here's why I built this" touchpoint
- **Win-back emails:** Personal touch for inactive users

### 4. Product Hunt Launch

- Founder video is expected/required for good PH launches
- Shows authenticity, differentiates from faceless SaaS

### 5. Indie Hackers / Hacker News

- Post with personal story + video link
- Community values founder authenticity

---

## Video Hosting Options

| Platform | Pros | Cons |
|----------|------|------|
| **YouTube (Unlisted/Public)** | Free, reliable, SEO | YouTube branding, recommendations |
| **Vimeo** | Clean player, no ads | Paid for customization |
| **Loom** | Easy sharing, analytics | Loom branding on free |
| **Cloudinary** | Dev-friendly, fast CDN | Setup required |
| **Upload to Vercel/S3** | Full control | Bandwidth costs |

**Recommendation:** YouTube (public) for SEO + social, embed on landing page.

---

## Checklist

### Pre-Recording
- [ ] Memorize key points (don't read script verbatim)
- [ ] Test lighting and audio
- [ ] Clean background
- [ ] Phone/camera at eye level
- [ ] Quiet environment

### Recording
- [ ] Record 2-3 takes max
- [ ] Keep under 60 seconds
- [ ] Speak to camera like a friend
- [ ] End with clear CTA

### Post-Recording
- [ ] Trim start/end dead air
- [ ] Add captions (CapCut or Descript)
- [ ] Export 1080p minimum

### Distribution
- [ ] Upload to YouTube
- [ ] Embed on landing page
- [ ] Post to Twitter with thread
- [ ] Post to LinkedIn
- [ ] Add to welcome email
- [ ] Save for Product Hunt launch

---

## Measuring Success

Track these after adding video to landing page:

| Metric | Tool | Goal |
|--------|------|------|
| Video plays | YouTube Analytics / PostHog | 20%+ of page visitors |
| Play-through rate | YouTube Analytics | 50%+ watch to end |
| Conversion lift | PostHog A/B test | 10-20% signup increase |
| Time on page | PostHog | Increase by 30+ seconds |

---

## Example Founder Videos (Inspiration)

- **Basecamp** - DHH's raw product demos
- **Notion** - Authentic founder interviews
- **Linear** - Clean, minimal founder intros
- **Indie Hackers** - Successful launch videos

The best ones feel like a conversation, not a commercial.

---

## Your Unique Angle

**You're not a freelancer — and that's actually a strength.**

- You built this by *listening* to freelancers, not assuming
- You're a developer who solved a real problem for people you care about
- This makes the story relatable: "I saw my friends struggling, so I built them a solution"

This angle builds trust because it shows empathy without pretending to be something you're not.

---

**Next Steps:**
1. Pick a script version (A recommended)
2. Practice 2-3 times out loud
3. Record with phone + natural light
4. Edit with CapCut (add captions)
5. Upload to YouTube
6. Embed on landing page
7. Post to Twitter/LinkedIn

**Timeline:** This can be done in 1-2 hours total.
