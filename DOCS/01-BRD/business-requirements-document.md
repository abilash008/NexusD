# Business Requirements Document (BRD) — NexusD
**Document Version:** 1.0.0  
**Domain:** [nexusd.in](https://nexusd.in)  
**Status:** Submitted for Review  
**Author:** Antigravity AI & Founder  
**Date:** October 2026  

---

## 1. Executive Summary & Vision

**NexusD** is a specialized, modern web platform engineered exclusively for the global and Indian **ServiceNow** ecosystem. 

Existing alternatives such as `certyiq.com` suffer from outdated user interfaces, sluggish response times, cluttered navigation, high pricing, and a narrow question-dump focus that fails to provide true end-to-end career enablement. NexusD solves this by delivering an ultra-fast, visually polished, and cost-effective hub combining:
- High-fidelity, blueprint-aligned certification practice questions with comprehensive explanations.
- Structured, domain-based study blueprints and career transition roadmaps.
- Affordable 1:1 mentorship from verified ServiceNow practitioners.
- A dedicated ServiceNow-only community, job board, and interview preparation suite.

The platform is designed to be mobile-first, low-latency, and search-engine optimized (SEO) from day one, developed with modern web standards to ensure high maintainability by a solo, part-time developer.

---

## 2. Problem Statement

1. **Fragmented & Outdated Preparation Material:** Candidates preparing for certifications (e.g., CSA, CAD, CIS) rely on low-quality dumps or clunky websites (e.g., CertYIQ) with incorrect answers, zero explanation depth, and poor mobile experiences.
2. **Prohibitive Cost Barriers:** Official ServiceNow training and typical freelance mentorship platforms charge exorbitant fees that price out Indian freshers, non-IT professionals, and junior developers.
3. **Generic Career Platforms Fail ServiceNow Specialization:** Generic platforms (LinkedIn, Naukri, LeetCode) lack ServiceNow context: they do not understand sub-modules (ITSM, ITOM, HRSD, GRC), cannot evaluate ServiceNow-specific resume claims, and fail to provide targeted hiring channels.
4. **Lack of Verified Practitioner Mentorship:** Beginners struggle to connect with experienced ServiceNow developers and architects who can provide practical guidance, mock interviews, and career transition advice.

---

## 3. Target Audiences & Persona Needs

NexusD explicitly serves three core segments. Onboarding captures this background to personalize career paths without conflating background data with system security roles.

### 3.1 Persona A: The College Graduate / Fresher
* **Profile:** Engineering, BCA, or MCA graduates looking to break into enterprise tech via ServiceNow.
* **Pain Points:** Lacks formal enterprise experience; overwhelmed by ServiceNow certification tracks; cannot afford \$300+ bootcamps.
* **Core Needs:** 
  - Clear entry roadmap: Start with **Certified System Administrator (CSA)**.
  - Affordable timed practice mock exams with granular scoring.
  - Basic resume guidance highlighting academic projects and ServiceNow developer instance (PDI) practice.

### 3.2 Persona B: The Non-IT Career Switcher
* **Profile:** Professionals working in operations, non-technical support, sales, or non-IT sectors seeking transition into ServiceNow Developer, Business Analyst, or Administrator roles.
* **Pain Points:** Unsure whether their past domain knowledge transfers; anxious about scripting/coding requirements (JavaScript, Glide API); needs confidence before paying for ServiceNow exam vouchers.
* **Core Needs:**
  - Transition guides tailored to their background (e.g., Support $\rightarrow$ ITSM Admin; Operations $\rightarrow$ Business Analyst / HRSD).
  - Low-friction practice questions breaking down platform terminology.
  - Direct 1:1 mentorship with someone who successfully made a non-IT transition.

### 3.3 Persona C: The ServiceNow Trainee / Junior Developer
* **Profile:** Developers with 0–2 years of experience currently in training at system integrators (e.g., TCS, Infosys, Wipro, Cognizant, Deloitte) or working on client projects.
* **Pain Points:** Company requires passing CSA or CAD on tight deadlines; needs real-world interview preparation for project allocation or lateral moves; needs deeper architectural understanding.
* **Core Needs:**
  - Advanced certifications: **Certified Application Developer (CAD)**, **CIS-ITSM**, **CIS-DF**.
  - Company-specific interview question banks (e.g., Deloitte/TCS interview rounds).
  - Peer community for troubleshooting real GlideRecord/Flow Designer patterns.

---

## 4. Scope of the Platform

### 4.1 In Scope (Multi-Phase Overview)

| Area | Feature / Epic | Phase Alignment |
| :--- | :--- | :--- |
| **Identity & Context** | User Accounts & Onboarding (Background segment + ServiceNow career tracks) | **Phase 1 (MVP)** |
| **Exam Engine** | Practice Engine for Certification Preparations (CSA initial slice; timed/untimed, instant scoring, explanations) | **Phase 1 (MVP)** |
| **Knowledge Base** | Certification Study Blueprints & Domain Guides (CSA initial slice) | **Phase 1 (MVP)** |
| **Monetization** | Subscription & One-Time Mock Pack Payments (Razorpay INR integration) | **Phase 1 (MVP)** |
| **Backoffice** | Lightweight Admin Panel (CMS for questions, explanations, topics) | **Phase 1 (MVP)** |
| **Telemetry** | User Performance Analytics (Score trends, pass readiness, weak domain alerts) | **Phase 1 (MVP)** |
| **Mentorship** | 1:1 Mentorship Marketplace (Profiles, calendar booking, session feedback) | **Phase 2** |
| **Career Content** | Dedicated Career Guidance Paths (Fresher/Switcher/Trainee roadmaps) | **Phase 2** |
| **Peer Learning** | ServiceNow Community (Threaded Q&A, feeds, reactions, moderation) | **Phase 2** |
| **Hiring Hub** | ServiceNow-Exclusive Job Board (Verified employer & community referral posts) | **Phase 2** |
| **ATS Intelligence** | Resume Reality Check (ServiceNow ATS compatibility & claim validator) | **Phase 2** |
| **Interview Prep** | Company-Tagged Interview Question Bank (Crowdsourced + seeded interview questions) | **Phase 2** |
| **Compensation** | Salary & Compensation Transparency (Crowdsourced benchmarks) | **Phase 3** (Scale-gated) |
| **Trust Signal** | Verified-Mentor Badge System (Demonstrated portfolio verification) | **Phase 3** (Scale-gated) |

### 4.2 Explicitly Out of Scope
* **Freelance Work Marketplace (Upwork/Fiverr for ServiceNow):** Deferred to long-term Phase 3+. Requires two-sided cold start, escrow payments, dispute arbitration, and substantial legal liability.
* **Custom In-App WebRTC Video Calling:** 1:1 mentorship will utilize Google Meet / Cal.com link generation rather than building custom video streaming infrastructure.
* **Native Mobile Apps (iOS/Android):** Responsive PWA / mobile-first web app will be used in Phase 1 & 2.

---

## 5. Success Metrics & Performance Budgets

### 5.1 Business & User Engagement KPIs
* **Activation Rate:** $> 70\%$ of new signups complete onboarding and attempt at least 5 practice questions within 10 minutes.
* **Practice Exam Completion:** $> 60\%$ completion rate on started timed practice exams.
* **Payment Conversion:** $> 3\%$ conversion from free tier (10 sample questions) to paid full mock exam packs.
* **Customer Cost-Advantage:** Priced at least $50\%\text{--}70\%$ below existing market exam packs and mentorship rates.

### 5.2 Technical & Performance Budgets
* **Lighthouse Performance Score:** $\ge 90$ on desktop, $\ge 85$ on mobile.
* **Largest Contentful Paint (LCP):** $< 2.0\text{ s}$ across public and practice routes.
* **Interaction to Next Paint (INP):** $< 150\text{ ms}$ during exam question transitions and option selection.
* **Cumulative Layout Shift (CLS):** $< 0.05$.
* **SEO & Indexability:** $100\%$ of public certification hubs, study pages, and public listings prerendered via SSR/SSG with dynamic Open Graph tags, canonical URLs, and automated `sitemap.xml`.

---

## 6. Tech Stack Confirmation, Evaluation & Decisions

### 6.1 Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
* **Status:** **Confirmed.**
* **Rationale:** Next.js App Router provides native SSR and Static Site Generation (SSG) required for SEO-dominant landing and certification pages. shadcn/ui provides unstyled, accessible Radix-based primitives that integrate directly with Tailwind CSS, ensuring lightweight bundle sizes without heavy external component runtimes.

### 6.2 Backend: Next.js Route Handlers (Serverless)
* **Status:** **Confirmed.**
* **Rationale:** Route Handlers cover all CRUD, auth callbacks, webhook ingestions (Razorpay), and scoring logic within a single unified codebase, eliminating the operational overhead of running a separate Express server during Phase 1.

### 6.3 Real-Time Community Strategy (Decision Required by Brief)
* **Evaluation:**
  - *Option A:* Next.js Serverless Route Handlers + SWR / React Query optimistic caching and polling.
  - *Option B:* Persistent Node.js + Express + Socket.io service hosted on Render.
* **Decision:** **Option A (Next.js Serverless + Optimistic UI & Polling).**
* **Justification:** Render’s free-tier web services sleep after 15 minutes of inactivity, causing 50-second cold-starts when clients reconnect to WebSockets. For a structured technical Q&A community (similar to Stack Overflow or Reddit), users do not require sub-second chat updates. Optimistic UI updates for likes, comments, and replies, paired with SWR revalidation on window focus or gentle interval polling, delivers an instantaneous user feel with zero additional hosting bills or cross-origin operational overhead. Documented in [ADR 001](file:///c:/NexusD/DOCS/05-decisions/001-realtime-community-approach.md).

### 6.4 Database & ORM: Neon PostgreSQL + Drizzle ORM
* **Evaluation:** Prisma vs. Drizzle ORM.
* **Decision:** **Drizzle ORM** (recommended) over Neon Serverless Postgres.
* **Justification:** Prisma utilizes a binary query engine that incurs noticeable cold-start penalties in Vercel serverless functions and bloats serverless bundle size. Drizzle ORM is a lightweight, pure TypeScript SQL query builder that connects directly via `@neondatabase/serverless` over HTTP/WebSocket connection pooling. It features sub-millisecond cold starts, type-safe migrations via `drizzle-kit`, and minimal bundle overhead, perfectly suited for Neon’s free tier. Documented in [ADR 002](file:///c:/NexusD/DOCS/05-decisions/002-tech-stack-selections.md).

### 6.5 Authentication: Auth.js (NextAuth v5)
* **Evaluation:** Auth.js vs. Clerk Free Tier vs. Supabase Auth.
* **Decision:** **Auth.js (NextAuth v5)** with Drizzle Adapter on Neon.
* **Justification:** While Clerk offers convenient drop-in modals, its free tier is limited to 10,000 MAUs, and custom styling to match NexusD’s exact navy/accent-blue design tokens is constrained. Supabase Auth introduces unnecessary third-party services when PostgreSQL is already hosted on Neon. Auth.js is open-source, runs natively inside Next.js, has zero MAU fees forever, and stores users and custom onboarding fields directly in our Postgres database. Documented in [ADR 002](file:///c:/NexusD/DOCS/05-decisions/002-tech-stack-selections.md).

### 6.6 Payment Gateway: Razorpay
* **Evaluation:** Razorpay vs. Stripe for India.
* **Decision:** **Razorpay.**
* **Justification:** NexusD targets the Indian developer and student market (`nexusd.in`). Razorpay provides native, high-conversion support for UPI (Google Pay, PhonePe, Paytm, CRED), NetBanking across 50+ Indian banks, and domestic debit cards. Stripe India enforces strict cross-border export documentation (IEC) and has cumbersome e-mandate friction for domestic INR transactions. Documented in [ADR 002](file:///c:/NexusD/DOCS/05-decisions/002-tech-stack-selections.md).

### 6.7 Email & Messaging Infrastructure
* **Domain:** `nexusd.in` (configured via Zoho Mail hosting).
* **Mappings:**
  - `no-reply@nexusd.in`: System auth tokens, password resets, payment invoices, test result emails.
  - `support@nexusd.in`: User ticket escalations and billing inquiries.
  - `contact@nexusd.in`: Public website contact form.
  - `hello@nexusd.in`: User onboarding welcome emails.
  - `info@nexusd.in`: Public platform information.
  - `admin@nexusd.in`: System moderation notifications and administrative alerts.
  - `talent-acquisition@nexusd.in`: Job board employer inquiries.
  - `hr@nexusd.in`: Mentor agreements and partner contracts.

### 6.8 Cloud Infrastructure & AWS Migration Strategy
* **Phase 1 (Zero-Cost Validation):** Vercel (Next.js App Router / Serverless API) + Neon (Serverless PostgreSQL) + Render (background workers if needed).
* **Phase 2 (Enterprise AWS Footprint):** Post-validation and scale transition to dedicated AWS infrastructure:
  - Compute: AWS EC2 / ECS Fargate (containerized via standalone Next.js builds).
  - Database: AWS RDS PostgreSQL / Aurora (ap-south-1 Mumbai region).
  - Storage: AWS S3 + CloudFront CDN.
  - DNS & Custom Domain: AWS Route 53 (`nexusd.in`).
* **Engineering Policy:** All database schemas, storage drivers, and build pipelines must maintain strict AWS portability from Sprint 1 onward (detailed in [ADR 003](file:///c:/NexusD/DOCS/05-decisions/003-cloud-migration-aws-readiness.md) and [`DOCS/04-architecture/cloud-infrastructure-and-migration.md`](file:///c:/NexusD/DOCS/04-architecture/cloud-infrastructure-and-migration.md)).

---

## 7. Resolution of Section 7 Open Questions

### Question 1: Content Ownership Model (Curated vs. User-Submitted in Phase 1)
* **Recommendation:** **100% Curated & Admin-Authored in Phase 1.**
* **Reasoning:** In certification prep (CSA/CAD), answer accuracy and clear explanations are the primary trust signals. User-submitted dumps in early stages inevitably introduce incorrect answers, unverified dumps, and duplicate questions that degrade platform credibility. Phase 1 must feature exclusively high-quality, verified questions vetted against official ServiceNow exam blueprints. Contributor submission workflows (with admin approval) will be introduced in Phase 2 for the Company Interview Question Bank (Epic 14).

### Question 2: Mentorship Delivery Format (Scheduled 1:1 Video Calls vs. Async Chat)
* **Recommendation:** **Scheduled 1:1 Video Calls via Calendar Link Integration (e.g., Cal.com / Google Meet) for Phase 2.**
* **Reasoning:** 
  1. Mentorship in the ServiceNow ecosystem is highest-value when conducting resume walkthroughs, mock technical rounds, and live screen sharing (showing PDI configurations, Flow Designer, ACLs). Async chat fails to provide this high-touch experience.
  2. Building custom in-app video calling is an unnecessary engineering sinkhole. Using an integration (generating a Google Meet / Zoom link via Cal.com or webhook on booking) keeps build time under 3 days while delivering a seamless, professional experience. Async messaging will act only as a pre-session brief channel.

### Question 3: Recommended Realistic Phase 1 MVP Scope
* **Recommendation:** **Focus Phase 1 on the "Practice Engine for Certification Preparations" launching with CSA.**
* **Proposed Phase 1 MVP Epics:**
  1. **Epic 1: User Accounts & Contextual Onboarding** (Google/Email auth + background segment + ServiceNow role taxonomy).
  2. **Epic 2: Practice Engine for Certification Preparations** (Core engine for ServiceNow credentials, launched with CSA slice; timed & untimed modes, pause/resume, bookmarking, instant scoring, question-level explanations, domain breakdown).
  3. **Epic 3: Certification Study Blueprints & Domain Guides** (Structured reference guides matching official blueprints, starting with CSA).
  4. **Epic 6: Razorpay Payments & Access Pass** (Free tier with 10–15 practice questions; paid one-time unlock for full mock tests & question bank).
  5. **Epic 7: Admin CMS** (Clean UI to upload, edit, tag, and publish questions and explanations without touching code).
  6. **Epic 8: User Performance Analytics** (Historical test attempts, domain-wise score analysis, pass readiness indicator).
* **Rationale:** This forms a complete, cohesive, immediately monetizable product that is drastically superior to CertYIQ. It delivers immediate value to freshers and trainees within weeks, rather than spreading effort thin across community feeds and job boards before acquiring users.

---

## 8. Brand Identity & Color System Proposal

The brand identity centers on a deep navy blue paired with a vibrant electric blue accent on a clean slate background.

| Color Role | Hex Code | Purpose & Application | Contrast vs White (WCAG) |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | `#0B192C` | Header/Navbar, Primary Headings, Dark Cards, Footer | **15.6 : 1** (Passes AAA) |
| **Secondary Navy** | `#1E3E62` | Subtle borders, muted dark elements, tags | **7.8 : 1** (Passes AAA) |
| **Vibrant Accent Blue** | `#0066FF` | Primary CTA buttons, links, active indicators, icons | **4.6 : 1** (Passes AA) |
| **Neutral Canvas** | `#F8FAFC` | Main app background (Slate 50) | Baseline |
| **Surface Card** | `#FFFFFF` | Content containers, modal windows, question cards | Baseline |
| **Border Neutral** | `#E2E8F0` | Dividers, card borders, input borders (Slate 200) | Form element standard |
| **Text Primary** | `#0F172A` | Body copy, question stems, titles (Slate 900) | **16.1 : 1** (Passes AAA) |
| **Text Muted** | `#64748B` | Timers, metadata, helper text (Slate 500) | **4.7 : 1** (Passes AA) |
| **Success Green** | `#10B981` | Correct answers, passing scores, completed states | **3.0 : 1** (UI state) |
| **Warning Amber** | `#F59E0B` | Time running low alert, flagged questions | **2.1 : 1** (UI state) |
| **Destructive Red** | `#EF4444` | Incorrect answers, score fails, cancel actions | **4.1 : 1** (Passes AA) |

*Full tokens, typography scales, and Tailwind utility classes are documented in [`DOCS/06-design/brand-and-palette.md`](file:///c:/NexusD/DOCS/06-design/brand-and-palette.md).*

---

## 9. Forward-Looking Phase 3 Note: Freelance Marketplace

Longer-term, NexusD may evolve into a specialized freelance marketplace connecting businesses seeking ServiceNow development with verified platform practitioners.

* **Scope Status:** **Strictly out of scope for Phase 1 and Phase 2.**
* **Architectural Safeguard:** The user profile and onboarding data models designed in Phase 1 will store structured career tracks, skills, and verification records in a decoupled schema, ensuring seamless extension into freelancer profiles in the future without costly data migrations.

---

## 10. Next Steps & Phase Gate

This document completes **Step 1 (BRD)**.

The next action requires founder confirmation on the proposed **Phase 1 MVP scope** (Step 2.0) and technical selections. Once approved, we will break Phase 1 into user stories, Fibonacci estimates, and sprint sequences in [`DOCS/02-agile-plan/`](file:///c:/NexusD/DOCS/02-agile-plan/).
