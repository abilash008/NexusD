# Project Brief for Antigravity — NexusD: ServiceNow Career & Certification Platform

**Brand name:** NexusD (domain: nexusd.in)

## 1. Vision

Build a web platform focused exclusively on the ServiceNow ecosystem, serving three audiences:
1. **Freshers** wanting to break into ServiceNow development
2. **Non-IT professionals** wanting to switch into ServiceNow Developer / IT roles
3. **Trainees/early-career developers** currently being trained on ServiceNow

The platform should be a more powerful, more productive alternative to certyiq.com (reference: certyiq.com, certyiq.com/papers/servicenow/csa/1, certyiq.com/papers/servicenow/cad/1), offering:
- Exam-style practice questions and study materials across ServiceNow certifications (CSA, CAD, CIS-ITSM, CIS-DF, etc.)
- Career guidance content specific to breaking into the ServiceNow ecosystem
- Paid 1:1 mentorship with experienced ServiceNow professionals, priced well below typical market mentorship rates
- All of this significantly cheaper than existing alternatives, while being faster, better-designed, and a better user experience

## 2. Non-Negotiable Quality Bar

- Visually rich, modern, professional design — not a generic template look
- Fully responsive (mobile-first, works cleanly on phone/tablet/desktop)
- Low latency — fast page loads, fast interactions, especially during timed practice exams
- Best-in-class UX: intuitive navigation, minimal friction from signup to first practice question

## 2a. Brand Identity & Color Palette

The brand is **NexusD** — logo is a stylized compass/arrow mark in deep navy blue paired with a brighter accent blue, with "NexusD" wordmark in the same navy. I like this color combination (navy blue as the dominant/primary color, a brighter blue as the accent) and want the whole website built around it — used **tastefully, not overwhelming**:

- **Primary**: deep navy blue — for header/nav, primary buttons, headings, footer
- **Accent**: a brighter, slightly more vibrant blue — for links, hover states, highlights, active states, icons, CTAs that need to pop against the navy
- **Neutral base**: the rest of the UI (backgrounds, cards, body text) should stay clean white/light-gray (or dark-mode equivalents) so the navy/blue palette reads as a deliberate accent system, not a wall of blue. Use navy and accent-blue purposefully — section headers, key buttons, active nav items, icons, data highlights — not as a background flood.
- Antigravity should propose an actual hex palette (primary navy, accent blue, 2–3 supporting neutrals, a success/warning/error set) consistent with this direction, and confirm it in the BRD/design phase before implementation, rather than guessing silently.
- Logo file will be supplied separately when available; for now, build the palette and UI direction to match the described navy + accent-blue identity.

## 2b. UI/UX, Performance & SEO Requirements (critical — there is no separate design phase for this project)

There is no dedicated UI/UX design phase planned for this build — no Figma mockups, no hired designer. That means design consistency has to come from a **disciplined, documented design system established early**, not from ad-hoc page-by-page styling that drifts as features get added. Treat the points below as binding requirements, not aspirations, and document the resulting conventions in `/DOCS/06-design/` (per Section 5a) so every later sprint follows the same rules instead of reinventing them.

**UI consistency (no design phase, so this matters more, not less):**
- Establish a documented component system in Sprint 1 — not just "use shadcn/ui," but a written set of conventions: spacing scale, typography scale (heading sizes, body sizes, line heights), button variants and when to use each, card/container patterns, form field patterns. Write this to `/DOCS/06-design/component-conventions.md` before building more than a couple of pages, so later sprints reuse patterns instead of inventing new ones per feature.
- Every new epic/feature should reuse existing components and patterns from that system rather than introducing one-off styling. If a new pattern is genuinely needed, add it to the documented system, don't let it live as a one-off.

**UX:**
- Minimal friction from signup to first meaningful action (first practice question, first community post, etc.) — map and minimize the click/step count for each core user journey before building it, not after.
- Consistent navigation and information architecture across all epics — a user moving from Practice Questions to Community to Job Board should feel like one product, not four bolted-together ones.
- Accessibility basics: semantic HTML, sufficient color contrast (check the navy/accent-blue palette against WCAG AA at minimum), keyboard navigability, alt text on images — bake this in from the start since retrofitting accessibility later is expensive.

**Performance (must not degrade as features are added):**
- Define a performance budget early (e.g., target Lighthouse Performance score, target Largest Contentful Paint / Time to Interactive) and document it in `/DOCS/06-design/` or `/DOCS/04-architecture/`.
- Use Next.js's built-in optimizations deliberately: Image component for all images, code-splitting/dynamic imports for heavy or rarely-used components (e.g., the admin panel, rich community editors), route-level lazy loading, avoid shipping unused JS to every page.
- As each new epic is added (Community, Job Board, etc.), its implementation sprint should include a performance check — bundle size impact, any new render-blocking resources — before marking that sprint done. This is where "performance should not degrade as features are appended" has to be actively enforced, not assumed.
- Database queries (via Prisma/Drizzle) should be checked for N+1 patterns and properly indexed as data volume grows, especially for the practice question bank and Community feed.

**SEO (important since organic discovery matters for a cost-conscious, bootstrapped platform):**
- Use Next.js App Router's SSR/SSG capabilities for anything that should be publicly indexable and discoverable — certification practice landing pages, study material/content library pages, job board listings, community posts. Client-side-only rendering for these pages would hurt discoverability and defeats the purpose of organic growth.
- Proper metadata (title, description, Open Graph tags) per page type, not just the homepage.
- Clean, semantic, human-readable URLs (e.g., `/certifications/csa/practice` not `/p?id=123`).
- `sitemap.xml` and `robots.txt` generated and kept current as content grows.
- Core Web Vitals (LCP, INP, CLS) should be treated as a real metric to monitor, not an afterthought — Google's search ranking factors in page experience, and a slow platform actively hurts the SEO goal too, so performance and SEO work together here, not separately.

## 3. Tech Stack (confirmed — build the plan around this, don't re-litigate it)

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS, shadcn/ui component library
- **Backend**: Node.js (Next.js API routes/Route Handlers as the default for everything — auth, CRUD, payments webhooks, booking, practice-question logic; consider a separate Express/Nest service only if a specific feature genuinely needs it — justify in the plan if so)
  - **Explicit decision needed from you in Step 1 (BRD):** the Community epic (see Core Feature Area 9) raises a specific real-time question — live comment counts, instant notifications on replies/reactions, etc. Next.js serverless API routes can't hold persistent WebSocket connections. Decide explicitly, with justification, between: (a) Phase 1 Community ships with simple polling/refresh-based updates, staying entirely on Next.js routes, no extra infra — lower cost, lower complexity, recommended default for an MVP; or (b) a small persistent Node/Express + Socket.io service deployed on Render handles real-time Community updates from the start. Don't pick silently — state the recommendation and reasoning in the BRD.
- **Database**: PostgreSQL, using Neon (serverless Postgres, free tier) for early development
- **ORM**: Prisma or Drizzle (recommend one and justify briefly)
- **Auth**: a modern auth solution suited to Next.js (evaluate options, e.g., Auth.js/NextAuth, Clerk free tier, or Supabase Auth — recommend one)
- **Payments**: a provider suited to the Indian market for low-cost subscriptions/one-time payments (evaluate Razorpay vs. Stripe for India and recommend)
- **Deployment (Phase 1 — free/low-cost validation)**: Vercel (frontend) + Render (any separate backend service, if needed) + Neon (DB)
- **Deployment (Phase 2 — post-validation, production scale)**: migrate to AWS EC2 + S3, with a custom domain

## 4. Core Feature Areas (for epic breakdown)

1. **User accounts & onboarding** — signup/login, then a one-time post-signup onboarding flow (not a system "role" used for permissions — this is profile/context data). On first login, ask the user two separate things and store both on their profile:
   - **Their background/segment** (fresher / non-IT career switcher / current ServiceNow trainee) — used to personalize content and recommendations, not to gate access or drive app permissions.
   - **The ServiceNow role(s) they're targeting or currently working toward** — present the full real list of ServiceNow ecosystem roles for them to select from (don't hardcode just one or two examples). Research and list the actual standard ServiceNow role/career-track taxonomy as used in the industry (e.g., System Administrator, Application Developer, Technical Consultant/Implementation Specialist, Solution Architect, Business Analyst, ITSM/ITOM/HRSD/CSM/SecOps/GRC specialist tracks, Scrum Master/Project Manager on ServiceNow projects, Platform Architect, etc. — confirm and complete this list against real ServiceNow career-path documentation rather than guessing). Store as structured data (e.g., a role/segment table or enum), so it can drive content personalization (recommended certifications, study paths, community groups) later.
   - Keep this cleanly separate from any internal app-permission "role" (e.g., admin vs. regular user vs. mentor) — don't conflate the two concepts in the data model.
2. **Certification practice question bank** — organized by certification (CSA, CAD, CIS-ITSM, CIS-DF, etc.), timed and untimed practice modes, instant scoring, explanations per question, progress tracking across attempts
3. **Study materials / content library** — structured guides per certification, organized by topic/domain matching real exam blueprints
4. **Career guidance content** — articles/paths tailored to the three target audiences (fresher, non-IT switcher, trainee)
5. **1:1 mentorship marketplace** — mentor profiles, availability/booking (calendar-based), session payment, post-session feedback/rating
6. **Pricing & payments** — subscription tiers and/or pay-per-mentorship-session, priced below market
7. **Admin/content management** — a way to add/edit questions, study material, and manage mentors without touching code directly (even a simple internal admin panel)
8. **Analytics (basic, Phase 1)** — track user practice performance, popular certifications, mentor booking volume
9. **Community** — a peer discussion space where users post questions, answers, and general posts related to ServiceNow/career topics. Each post supports comments (threaded Q&A style), reactions (likes/upvotes), shares, and reposts. Think a lightweight StackOverflow-meets-LinkedIn-feed hybrid, scoped to this platform's audience. Include basic moderation (report post/comment, admin takedown) given it's user-generated content.
10. **ServiceNow-exclusive job board** — a dedicated job marketplace, scoped entirely to ServiceNow ecosystem roles, functioning like a niche LinkedIn/Naukri/Indeed. Two posting paths into the same listings:
    - **Employers/companies** (verified employer accounts) can post official job openings — role, ServiceNow track/specialization (tie into the same role taxonomy used in onboarding, Core Feature Area 1), experience band, location/remote, description, and application method.
    - **Individual users** can also post openings — covering real scenarios like an employee referring a role at their own company, a manager hiring directly, or a consultant/agency sharing a lead — not just corporate HR postings.
    - **Any user can apply** directly through the platform (structured application: resume/profile submission, cover note) — applications tracked so both the poster and applicant can see status, not just a mailto: link.
    - Basic employer verification (even lightweight — e.g., work email domain check or admin approval) to curb spam/fake listings, given this is open to individual posters too.
    - Natural integration points with existing epics: tie into Community (users can discuss/share listings), and into the user's "What I Built" / portfolio & certification profile so applicants show real demonstrated ServiceNow ability alongside their application, not just a resume — this is a meaningful differentiator versus generic job boards where every applicant looks the same on paper.
    - Basic moderation here too (report listing, admin takedown) since postings are user-generated.
11. **Resume Reality Check — ServiceNow-specific resume/ATS reviewer** — an automated resume review tool scoped to ServiceNow roles. Checks ATS formatting/compatibility, and flags claims that aren't backed up elsewhere on the platform (e.g., a claimed skill/module with no corresponding entry in the user's portfolio or certification record), nudging toward specific, defensible language rather than generic resume advice. Where feasible, cross-reference against the user's own certification records and portfolio/"what I built" entries (see Epic 10's integration note) to ground the feedback in what they can actually demonstrate.
12. **Salary & compensation transparency (crowd-sourced)** — anonymized, self-reported compensation data submitted by users, broken down by ServiceNow role/track (reuse the role taxonomy from Epic 1), experience band, and company type/size. Aggregated and displayed as ranges/benchmarks, not individual identifiable entries. Needs a minimum-submissions threshold per bucket before displaying data, to protect anonymity and avoid showing a single person's number as "the market rate." Low priority until there's a real user base — flag as dependent on reaching sufficient scale (see Phase sequencing note below).
13. **Verified-mentor badge system** — extend the mentor profiles in Epic 5 with an optional verification signal tied into the portfolio/"what I built" concept from Epic 10 — a mentor who has documented real demonstrated ServiceNow work (not just a self-written bio) gets a visible "verified experience" badge. This is a trust differentiator most freelance/mentorship platforms don't offer, where mentor credibility is usually just self-reported.
14. **Crowd-sourced, company-tagged interview question bank** — users submit real interview questions they were personally asked, anonymized, tagged by company and topic/domain (not freeform text dumps — structured similarly to a practice question entry). Moderated before publishing (admin review or community flagging) to keep quality high and avoid spam/joke submissions. Seed content can come from real question banks already compiled for this project's own research (Infosys/Deloitte/TCS-style ServiceNow interview rounds).

## 4a. Feature Sequencing Note for Epics 11–14

Epics 11–14 were added after the initial 10 and depend on platform maturity to varying degrees:
- **Epic 11 (Resume Reality Check)** can reasonably be built in Phase 1/2 — it mainly depends on Epics 1 (role taxonomy) and the portfolio concept noted under Epic 10, not on a large user base.
- **Epic 14 (crowd interview questions)** is usable with a small seed set from day one (the user has existing real interview-question material to seed it) and grows more valuable over time — reasonable for Phase 1/2.
- **Epic 12 (salary transparency)** and **Epic 13 (verified-mentor badges)** both need real user volume/data to be meaningful (salary data needs enough submissions per bucket to be anonymized and trustworthy; mentor verification needs an established portfolio feature with real submitted work behind it). Treat these as later Phase 2 additions, sequenced after Epics 1–11 are live and have real usage, not bundled into the initial sprint plan alongside the core 10.

## 5. What I Need From You (Antigravity)

### Step 1 — Business Requirements Document (BRD)
Produce a BRD covering: problem statement, target users and their distinct needs, scope (in/out), success metrics, assumptions, and a high-level solution approach. Confirm/challenge my tech stack choices above with brief justification — don't just accept them blindly if something is a poor fit.

### Step 2 — Agile Delivery Plan

**This step has a mandatory sub-step before any sprint planning happens.** There are now 14 Core Feature Areas (Section 4) — far more than a solo, part-time developer can build broad-but-shallow at once. You must not sprint-plan all 14 in parallel or in one flat backlog. Instead:

**Step 2.0 — Phase 1 MVP Selection (do this first, get my explicit confirmation before proceeding to full sprint planning):**
- Propose a **Phase 1 MVP** consisting of the *smallest subset* of epics (and a narrow slice within each) that forms a genuinely usable, coherent product on its own — not a token sliver of every epic, but a real product someone could sign up for and get value from today.
- For every epic NOT included in Phase 1, explicitly list it under **Phase 2** or **Phase 3** with a one-line reason why it's deferred (e.g., "needs real user volume first," "depends on Epic X being live," "high build complexity relative to value this early").
- Use Section 4a's sequencing note as a starting point (Epics 12 and 13 are already flagged as scale-dependent) but apply the same discipline across all 14 — don't assume every epic not mentioned there belongs in Phase 1 by default.
- Present this Phase 1/2/3 split to me as a distinct deliverable and wait for my confirmation before breaking Phase 1 into epics/stories/sprints. Do not proceed to Step 2's full breakdown until I've approved the Phase 1 scope.

Once Phase 1 scope is confirmed, break ONLY the confirmed Phase 1 epics into:
- **Epics** (one per confirmed Phase 1 feature area, or re-grouped if a better breakdown makes sense — explain your reasoning if you deviate)
- **User Stories** under each epic, each with a clear "As a [user], I want [goal], so that [benefit]" format
- **Story point estimates** (Fibonacci: 1, 2, 3, 5, 8, 13) for each story, with brief reasoning for any story sized 8 or above
- **Sprints** — group stories into sprints (recommend sprint length — I'm thinking 1–2 weeks, but suggest what fits the scope better), sequenced so each sprint produces something demonstrable, starting with the narrowest possible end-to-end slice (e.g., one certification's practice questions working fully, before expanding to all certifications)
- Flag dependencies between stories/epics explicitly (e.g., payments must exist before mentorship booking can go live)

Phase 2 and Phase 3 epics stay as a backlog outline only (epic-level, not broken into stories/sprints) until Phase 1 actually ships and I ask you to plan the next phase.

### Step 3 — Sprint-by-Sprint Implementation
Once the full plan above is approved, implement sprint by sprint, in order:
- Before starting each sprint, restate that sprint's stories and acceptance criteria
- Implement the stories for that sprint
- **Before marking any sprint done, explicitly check it against Section 2b (UI/UX, Performance & SEO Requirements):** does this sprint's work reuse the documented component system rather than introduce one-off styling? Any new performance cost (bundle size, render-blocking resources, N+1 queries)? If the sprint adds publicly-indexable pages, do they have proper SSR/SSG, metadata, and clean URLs? Note the answer briefly in that sprint's `/DOCS/03-sprints/sprint-XX/` summary — this is a required part of done, not optional.
- At the end of each sprint, summarize what was completed, flag anything deferred or changed, and confirm before moving to the next sprint

## 5a. Cross-Session Documentation Requirement (critical — this is a multi-conversation build)

This build will NOT happen in a single continuous conversation with you. I will be returning across many separate sessions (different days, possibly different agent conversations entirely) to continue work. You will not have memory of earlier sessions unless it is written down. Treat this as working on a real production codebase with a new team member rotating in constantly — nothing can live only in conversation history.

**Requirement:** maintain a `/DOCS` folder at the project root, cleanly subdivided, as the single source of truth for project context. Structure it like this (adjust naming as needed, but keep the spirit):

```
/DOCS
  /00-START-HERE.md          ← master index: what the project is, current status, links to everything below, "read this first in any new session"
  /01-BRD/                   ← the Business Requirements Document and any revisions
  /02-agile-plan/            ← epics, full user story backlog, story points, sprint sequencing (the Step 2 output)
  /03-sprints/
    /sprint-01/               ← per-sprint: stories committed, acceptance criteria, what was actually built, what was deferred/changed, decisions made mid-sprint
    /sprint-02/
    ...
  /04-architecture/          ← tech stack decisions and why, data model/schema docs, API structure, folder/module layout of the actual codebase
  /05-decisions/             ← lightweight ADRs (Architecture Decision Records) for any non-trivial choice (e.g., "why polling over WebSockets for Community in Phase 1") — one short file per decision, dated
  /06-design/                 ← brand palette/hex values once finalized, UI/component conventions
  /07-open-items/             ← anything flagged as unresolved, deferred, or needing my input, so it isn't lost between sessions
```

**Non-negotiable rule:** after every single implementation step — not just at the end of a sprint, but after any meaningful change (a story completed, a decision made, a deviation from the plan) — update the relevant file(s) in `/DOCS` before considering that piece of work done. Documentation is not a wrap-up task at the end; it is part of the definition of done for every unit of work.

At the start of every new session, your first action should be to read `/DOCS/00-START-HERE.md` and whatever it points you to, to reconstruct full context before touching code — treat this as mandatory onboarding for yourself each time, since you won't have conversational memory of prior sessions.

## 6. Constraints & Preferences

- I'm building this solo, part-time, alongside a full-time job — the plan should assume incremental, sustainable progress, not a large team's velocity
- Prioritize getting a genuinely usable, narrow version live early (one certification fully working end-to-end) over building broad-but-shallow across everything at once
- Everything in Phase 1 must run on free-tier services (Vercel, Render, Neon) — flag anything that risks exceeding free-tier limits early
- Favor open-source and low-cost tools throughout; this platform's whole value proposition is being cheaper than alternatives, so keep operating costs lean

## 7. Open Questions for You to Address in the BRD

- Content ownership model: should practice questions be originally authored/curated only, or should the platform eventually support user/contributor-submitted questions (with moderation)? Recommend a Phase 1 approach.
- Mentorship format: scheduled 1:1 video calls (needs calendar/booking integration) vs. async chat-based mentorship — recommend which to build first, and why.
- Recommend a realistic MVP scope: what's the smallest version of this platform that's genuinely useful and could go live first, before the full feature set is built out.

## 8. Phase 3 — Future Expansion (do NOT build now; capture in the BRD as a forward-looking note only)

Longer-term, NexusD may expand from a learning/mentorship platform into a **niche freelance marketplace exclusively for the ServiceNow ecosystem** — connecting businesses/clients needing ServiceNow work done with vetted ServiceNow freelancers/consultants found through the platform (an "Upwork/Fiverr, but ServiceNow-only").

This is explicitly **out of scope for Phase 1 and Phase 2**. Do not design, plan, or estimate this in the Agile Delivery Plan. It's listed here only so the BRD can note it as a possible future direction and so nothing in the Phase 1/2 architecture accidentally forecloses it later (e.g., keep the user/profile data model reasonably extensible, since freelancer profiles would eventually build on the same user accounts and mentor-profile concepts from Epic 5).

Reasoning for deferring it: a freelance marketplace is a categorically harder product than a content/mentorship platform — it requires solving two-sided cold start (needing both clients and freelancers simultaneously), escrow/milestone payments, dispute resolution, and real platform liability for work quality and fraud. That's a 12–18 month build even at MVP, typically needing more than one person. Attempting it now would derail the achievable Phase 1 scope. Revisit only after Phase 1 is live, has real users/revenue, and ideally a co-founder or hired help.
