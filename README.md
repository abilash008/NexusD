# NexusD — ServiceNow Certification & Career Enablement Platform

> **2026 Modern Platform Standard** • Aligned to ServiceNow **Australia & Brazil Releases** • Built with Next.js App Router, TypeScript, and Tailwind CSS.

---

## 🚀 Overview

**NexusD** (https://nexusd.in) is an enterprise-grade certification preparation and career acceleration platform purpose-built for the ServiceNow ecosystem. Designed for freshers, career switchers, and implementation consultants, NexusD provides blueprint-aligned practice engines, realistic 90-minute timed mock simulations, domain syllabus blueprints, and a master question bank with 3-mode native PDF export.

---

## 📜 Certification Tracks & Blueprint Standards

Examinations are released in a strict sequence with official ServiceNow examination metrics:

### Core Phase 1 Tracks

| Order | Track Code | Full Certification Title | Blueprint Reference | Questions | Duration | Pass Mark | Free Tier Volume | Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **1** | **CSA** | Certified System Administrator | **KB0011554** | **60 Qs** | **90 Mins** | **70%** (42 / 60) | **60 Free Questions** | 🟢 Live |
| **2** | **CAD** | Certified Application Developer | **KB0011498** | **60 Qs** | **90 Mins** | **70%** (42 / 60) | 60 Free on Launch | 🟢 Live |
| **3** | **CIS-DF** | CIS — Data Foundations (CMDB & CSDM) | **KB0012913** | **75 Qs** | **90 Mins** | **70%** (53 / 75) | Free Tier Included | 🟢 Live |
| **4** | **CIS-ITSM** | CIS — IT Service Management | **KB0011560** | **60 Qs** | **90 Mins** | **70%** (42 / 60) | Free Tier Included | 🟢 Live |

> **Official Blueprint Distinction: CIS-DF vs. CIS-Discovery:**
> - **CIS-DF (Certified Implementation Specialist - Data Foundations: CMDB and CSDM - KB0012913):** Specializes exclusively in CMDB architecture, Identification & Reconciliation Engine (IRE), CMDB Data Manager lifecycle policies, CMDB Health scorecards (Completeness, Correctness, Compliance), and CSDM v4.0 domain governance.
> - **CIS-Discovery (ITOM Discovery):** Specializes in IT Operations, network scanning, MID Server clustering and sizing, IP schedules, SNMP/SSH/WMI credentials, and Discovery patterns.

### Subsequent Expansion Roadmap
- **CIS-Discovery** (ITOM Discovery — 75 Qs • 90 Mins • 70%)
- **CIS-EM** (Event Management — 75 Qs • 90 Mins • 70%)
- **CIS-HR** (HR Service Delivery — 75 Qs • 90 Mins • 70%)
- **CIS-SAM** (Software Asset Management — 75 Qs • 90 Mins • 70%)
- **CIS-HAM** (Hardware Asset Management — 75 Qs • 90 Mins • 70%)
- **CIS-CSM** (Customer Service Management — 75 Qs • 90 Mins • 70%)
- **CTA** (Certified Technical Architect — Review Board & Case Study)

---

## 🎯 Platform Features & Architecture

### 1. Practice Engine (`/certifications/[track]/practice`)
- **Domain-Weighted Drills:** Practice either domain-by-domain or across all domains simultaneously.
- **Dynamic Client Shuffling:** Questions are shuffled dynamically using Fisher-Yates on every drill attempt and retake while remaining 100% hydration-safe during Server-Side Rendering (SSR).
- **Instant Architectural Feedback:** Real-time answer validation with deep architectural justifications cited against official ServiceNow release conventions.

### 2. Timed Mock Simulator (`/certifications/[track]/mock`)
- **Dynamic Multi-Track Engine:** Runs simulations dynamically for any track (CSA, CAD, CIS-DF, CIS-ITSM) with stratified domain sampling according to official ServiceNow blueprint quotas.
- **Strict Authentication Gating:** Requires an authenticated candidate account to protect historical telemetry accuracy and prevent guest data corruption.
- **Universal Exit Interception (Pause vs. Quit):** Capturing event listeners intercept all departure pathways (browser back button, sidebar, header links, dashboard, profile, and study guides):
  - **Option 1: Pause Exam (Save Progress):** Saves remaining timer seconds, question index, flagged items, and answers to user-scoped storage (`nexusd_${trackId}_paused_${userId}`).
  - **Option 2: Quit Exam (Discard):** Cleanly purges the in-progress session and exits to the chosen destination.
- **Realistic Exam Feel:** 90-minute strict countdown timer with urgent visual warnings (< 10 mins).
- **Exam Navigator Grid:** Full question jump drawer indicating answered, flagged, and unanswered items.
- **Detailed Scorecard:** Displays overall pass/fail benchmark, percentage score, time taken, domain-by-domain mastery bars, and attempt history table.

### 3. Master Question Bank & 3-Mode PDF Exporter (`/study/[track]/question-bank`)
- **In-Browser Interactive Repository:** Filter by domain, search by keyword, filter by question type (single choice vs. multi-select), and toggle architectural explanations.
- **Configurable Pagination:** User-selectable page size (10, 20, 25, 50, or All) with smart ellipsis navigation and Pro Vault lock indicators.
- **3-Mode Native PDF Exporter:**
  - **Mode 1: Exam Paper:** Clean question stem and option checkboxes for test conditions.
  - **Mode 2: Revision Key:** Verified answers marked with `[✓]` for swift memorization.
  - **Mode 3: Master Guide:** Complete study manual with verified answers and detailed architecture rationales.
  - Generates crisp vector PDFs via clean CSS `@media print` rules without third-party watermarks.

### 4. Live Razorpay Standard Web Checkout (`/pricing`, `/payment/*`)
- **Live Standard Web Checkout:** Powered by Razorpay Standard Checkout modal (`https://checkout.razorpay.com/v1/checkout.js`).
- **Server-Side Order Creation:** Authenticated endpoint `POST /api/create-order` creates orders with paise conversion and server validation.
- **Cryptographic Signature Verification:** `POST /api/verify-payment` performs HMAC-SHA256 verification (`order_id + "|" + payment_id` against `RAZORPAY_KEY_SECRET`) before granting entitlements.
- **Flexible Certification Pass Plans:**
  - **Single-Track Pro Pass (₹499):** 1-Year validity (365 days) for individual tracks (CSA, CAD, CIS-DF, or CIS-ITSM).
  - **All-Access Career Pass (₹999):** **2-Year validity (730 days)** granting unlimited access to all 4+ certification tracks, question vaults, and PDF packs.
- **Entitlement Gating:** Active access provisioning in Neon PostgreSQL (`userEntitlements`), preventing duplicate purchases and granting instant Pro access.

### 5. Hardened Authentication & Password Policy (`/signup`, `/login`)
- **Dedicated Registration (`/signup`):** Real user signups backed by Neon PostgreSQL.
- **Strict Password Validation:** Enforces minimum 8 characters, at least 1 uppercase letter, 1 special character, and 1 digit on both client and server.
- **NextAuth.js v5 Integration:** Credentials and Google OAuth providers with bcrypt password hashing. Real database checks eliminate dummy credential bypasses.

### 6. Multi-Track Telemetry & Performance Analytics (`/dashboard/analytics`)
- **Zero Mock Data Policy:** Telemetry driven entirely by genuine user examination attempts.
- **Certification Track Switcher:** Seamlessly switch between CSA, CAD, CIS-DF, and CIS-ITSM to inspect readiness.
- **Calculated Telemetry:**
  - **Overall Readiness Gauge:** Benchmarked against official 70% passing threshold with status badges.
  - **Velocity & Question Pacing:** Average seconds spent per question compared against the 90s exam target.
  - **Official Domain Breakdown:** Real-time domain accuracy percentages isolating candidate's weakest domain.
  - **Contextual Study Directives:** Direct links to official blueprint study guides.
- **Single Source of Truth:** Authenticated candidates load exclusively from Neon DB (`userExamAttempts`). Client `localStorage` is automatically purged on load.
- **History Wipe Action:** "Clear Records" button invokes `DELETE /api/exams/attempts` and resets browser storage with a single click.

### 7. Modern Dashboard & Candidate Portfolio (`/dashboard`, `/profile`)
- **EdTech Standard Dashboard:**
  - **Track Switcher:** Quick certification toggle updating hero metrics and practice links dynamically.
  - **Readiness Gauge & Habit Streak:** 7-day study consistency tracker with interactive weekly activity pills.
  - **4-Stage Milestone Roadmap:** Metro-line storytelling taking students from Diagnostic assessment to Blueprint notes, Mock simulations, and Revision review.
  - **Domain Competency Bars:** Progress breakdown across official syllabus weights.
- **Candidate Portfolio Hub:**
  - Executive bio, target roles, and target certification paths.
  - Structured academic timeline (degrees, institutions, CGPA, graduation years, coursework).
  - Professional work experience history (titles, companies, durations, contributions).
  - Gamified profile completeness meter (0–100%) with verified recruiter visibility.
  - Webassessor ID & Now Learning ID verification badges.
  - Shareable candidate profile link and 1-click printable resume portfolio.

### 8. Universal Small-to-Medium Typography Standard
- **Disciplined Scale:** Every page standardizes on a small-to-medium typography scale to ensure legibility and visual elegance:
  - Page H1: `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`
  - Section H2: `text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white`
  - Card H3: `text-base font-semibold text-slate-900 dark:text-white`
  - Metrics / Counters: `text-2xl sm:text-3xl font-bold font-mono`
  - Buttons: Standardized `h-10` or `h-11 px-5 text-xs sm:text-sm font-semibold`
- **Zero Bloat:** Banned `text-5xl` through `text-7xl` and oversized `font-black` weights in favor of clean `font-bold` and `font-semibold`.
- **Geist Fonts:** Explicitly registered Geist Sans (`--font-sans`) and Geist Mono (`--font-mono`) in Tailwind v4 `@theme inline`.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16+ (App Router, Turbopack)
- **Language:** TypeScript 5+ (Strict typing)
- **Styling:** Tailwind CSS v4 with custom dark mode variables & WCAG AA contrast
- **Components:** Radix UI primitives & Lucide React icons
- **State & Storage:** React Context (`SidebarContext`), Neon PostgreSQL persistent telemetry
- **Database & ORM:** Neon Serverless PostgreSQL (`@neondatabase/serverless`) & Drizzle ORM
- **Authentication:** Auth.js (NextAuth v5) + bcrypt password hashing
- **Payments:** Razorpay Standard Web Checkout (Live API)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/abilash008/NexusD.git
cd NexusD

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Key File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Hardened Sign-In Flow
│   │   └── signup/page.tsx          # Real Sign-Up with Password Validation
│   ├── dashboard/
│   │   ├── page.tsx                 # Learner Dashboard Overview
│   │   └── analytics/page.tsx       # Multi-Track Telemetry & Readiness Engine
│   ├── profile/page.tsx             # Candidate Profile Hub & Entitlements
│   ├── certifications/
│   │   ├── page.tsx                 # Multi-Exam Catalogue & Roadmap
│   │   └── csa/
│   │       ├── practice/page.tsx    # 60-Question Shuffled Practice Engine
│   │       └── mock/page.tsx        # 90-Min Timed Countdown Simulation
│   ├── study/
│   │   ├── page.tsx                 # Study Blueprints Overview
│   │   └── csa/
│   │       ├── page.tsx             # 5 Domain Syllabus Guides
│   │       └── question-bank/       # Master Bank & 3-Mode PDF Exporter
│   ├── pricing/page.tsx             # Plans, Free Starter & Pro Passes
│   ├── admin/                       # Protected Admin CMS & Errata Triage
│   └── api/
│       ├── create-order/route.ts    # Razorpay Order Creation API
│       ├── verify-payment/route.ts  # HMAC-SHA256 Signature Verification API
│       ├── exams/attempts/route.ts  # GET & DELETE Persistent Attempt Telemetry
│       └── exams/submit/route.ts    # Exam Attempt Submission API
├── components/
│   ├── layout/                      # Pinned & Collapsible Glassy Sidebar
│   ├── subscription/                # Razorpay Standard Checkout Button & Modal
│   ├── theme/                       # Light / Dark / System Toggle
│   └── ui/                          # Button, Card, Badge, Progress
├── lib/
│   ├── db/                          # Drizzle ORM Schema & Neon Postgres Client
│   └── admin.ts                     # Admin Role Gate & Errata Utilities
└── data/
    └── csa-questions.ts             # 85+ Blueprint Questions, 60 Free Quotas & Shuffler
```

---

## ⚖️ Legal Disclaimer

NexusD is an independent educational platform. ServiceNow, Now Platform, and associated trademarks are registered trademarks of ServiceNow, Inc. NexusD practice exams and study blueprints are independent revision materials aligned to publicly released ServiceNow exam blueprints (Australia & Brazil releases).

© 2026 NexusD Learning Systems (nexusd.in). All rights reserved.
