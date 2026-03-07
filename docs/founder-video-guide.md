# Founder Video Guide

**Purpose:** Create a 60-second authentic founder video to build trust and increase conversions on the landing page.

**Research Insight:** "In an environment saturated with polished marketing, a raw, 60-second video of the founder explaining why they built the tool can outperform high-production content for B2B conversions."

---

## The Script (60 seconds)

### Version A: Problem-Focused (Recommended)

```
[0-10 seconds - Hook]
"I used to spend every Sunday night in a spreadsheet,
trying to figure out if I could actually afford to pay my bills next month."

[10-25 seconds - Problem]
"As a freelancer, my income was all over the place.
One month I'd have three clients paying me, the next month... silence.
I never knew if the money in my bank account was actually mine to spend,
or if I needed it for rent in 6 weeks."

[25-40 seconds - Solution]
"So I built Cash Flow Forecaster.
It shows you one number: what's actually safe to spend today,
without overdrafting later.
You add your bills, your expected income, and it maps out
your real bank balance for the next 90 days."

[40-55 seconds - Proof + CTA]
"No bank connection required. No spreadsheets.
Just clarity on whether you can take that vacation,
buy that equipment, or need to chase that invoice.
Try it free — link's below."

[55-60 seconds - Sign off]
"I'm Omar, and I built this for freelancers like us."
```

### Version B: Emotional/Relatable

```
[0-10 seconds - Hook]
"You know that feeling when a client says 'payment sent'
and you refresh your bank account twelve times?"

[10-25 seconds - Problem]
"I lived that for years. Never knowing if I'd make rent.
Spreadsheets that were outdated the moment I made them.
That Sunday night anxiety — wondering if I'd miscalculated something."

[25-40 seconds - Solution]
"Cash Flow Forecaster fixes that.
It takes your bills, your invoices, your expected payments,
and shows you exactly what your bank balance will be —
90 days into the future."

[40-55 seconds - Key Benefit]
"One number tells you what's safe to spend today.
No surprises. No overdrafts. No more spreadsheet hell.
It takes 5 minutes to set up."

[55-60 seconds - CTA]
"Link's in the description. Try it free.
Built by a freelancer, for freelancers."
```

### Version C: Ultra-Short (45 seconds)

```
[0-8 seconds - Hook]
"I built Cash Flow Forecaster because I was tired of
not knowing if I could afford things."

[8-25 seconds - Problem + Solution]
"As a freelancer, my income was unpredictable.
So I built a tool that shows your real bank balance
90 days ahead — accounting for every bill and payment coming in."

[25-40 seconds - Key Feature]
"One number: Safe to Spend.
It tells you exactly what you can spend today
without screwing yourself next month."

[40-45 seconds - CTA]
"Try it free. No credit card. Link below."
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
Tweet 1: Video + "I built @cashflowforecast because I was tired of not knowing if I could afford things."

Tweet 2: "The problem: As a freelancer, I never knew if the money in my bank was actually mine to spend."

Tweet 3: "The solution: One number — Safe to Spend — tells you what's available after all upcoming bills."

Tweet 4: "Try it free: [link]"
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

**Next Steps:**
1. Pick a script version (A recommended)
2. Practice 2-3 times out loud
3. Record with phone + natural light
4. Edit with CapCut (add captions)
5. Upload to YouTube
6. Embed on landing page
7. Post to Twitter/LinkedIn

**Timeline:** This can be done in 1-2 hours total.
