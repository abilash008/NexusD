# Sprint 07 Summary — Platform Modernization, Universal Typography Scale, Dynamic Mock Engine & Candidate Portfolio

**Sprint Goal:** Standardize font styles and font sizes across the entire codebase to a disciplined small-to-medium scale, implement dynamic multi-track mock test session protection with universal exit interception (Pause vs. Quit), extend the All-Access Pass validity to 2 years, overhaul the dashboard and candidate profile into an industry-leading EdTech experience, and ensure dynamic question rotation on the landing page.

**Sprint Window:** Platform Revamp & Design Systems  
**Velocity Delivered:** 18 / 18 Story Points (100% Completion)  
**Status:** Complete & Live in Production (`https://nexusd.in`)  
**File Location:** `/DOCS/03-sprints/sprint-07/sprint-07-summary.md`

---

## 1. Deliverables & User Stories Completed

| Story ID | Story Title | Points | Status | Verification Route / Artifact |
| :--- | :--- | :---: | :---: | :--- |
| **US-7.1** | Universal Small-to-Medium Typography Scale & Token System | 4 | Completed | `src/app/globals.css`, all 22 page routes |
| **US-7.2** | Universal Mock Test Interception & Dynamic Pause/Quit | 3 | Completed | `/certifications/[track]/mock` |
| **US-7.3** | Stratified Domain Weighting & Fresh Dual-Shuffling Architecture | 3 | Completed | `/certifications/[track]/practice`, `/mock` |
| **US-7.4** | 2-Year All-Access Pass Validity Standardization (730 Days) | 2 | Completed | `/pricing`, `/api/user/entitlements`, `/admin` |
| **US-7.5** | High-Impact EdTech Dashboard Redesign | 3 | Completed | `/dashboard` |
| **US-7.6** | Professional Candidate Portfolio & Credential Suite | 2 | Completed | `/profile` |
| **US-7.7** | Dynamic Landing Page Live Practice Question Rotation | 1 | Completed | `/` (`src/app/page.tsx`) |
| **Total** | **Sprint 07 Delivered** | **18 Points** | **100%** | **Turbopack Build Verified (31/31 Routes Clean)** |

---

## 2. Key Architecture & Feature Details

### 2.1 Universal Small-to-Medium Typography Scale
* **Core Constraint:** Complete elimination of oversized headings (`text-5xl`, `text-6xl`, `text-7xl`) and harsh `font-black` / `font-extrabold` weights across all 31 application routes.
* **Disciplined Token Hierarchy:**
  - **Page H1:** `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`
  - **Section H2:** `text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white`
  - **Card / Pillar H3:** `text-base font-semibold text-slate-900 dark:text-white`
  - **Quantitative Metrics & Scores:** `text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white`
  - **Body Text:** `text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed`
  - **Buttons:** Uniform heights `h-10` or `h-11 px-5 text-xs sm:text-sm font-semibold`
  - **Micro Badges:** `text-[10px] sm:text-[11px] font-semibold py-0.5 px-2.5`
* **Tailwind v4 Theme Registration (`src/app/globals.css`):**
  Registered `--font-sans: var(--font-geist-sans)` and `--font-mono: var(--font-geist-mono)` in `@theme inline` to guarantee identical font rendering between server and client components.

### 2.2 Universal Mock Test Interception & Dynamic Session Protection
* **Multi-Track Dynamic Parity:** Completely eliminated hardcoded track references (`csa`), making all simulation logic dynamic for any certification track (`CSA`, `CAD`, `CIS-DF`, `CIS-ITSM`).
* **Strict Authentication Gate:** Mock exam simulations require an authenticated account (`status === "authenticated"`). Free practice mode remains 100% open to guests. Unauthenticated users are barred from corrupting telemetry or caching guest state.
* **Universal Navigation Interception:**
  - Attached a capturing-phase DOM listener (`document.addEventListener("click", handleDocumentClick, true)`) in `src/app/certifications/[track]/mock/page.tsx`.
  - Catches all link clicks across the entire screen (sidebar, top navigation, brand logo, study guides, candidate profile, browser back button).
  - Pauses navigation and displays a 2-option modal:
    - **Option 1: Pause Exam (Save Progress):** Saves remaining countdown seconds, question index, flagged items, and answers to user-scoped storage (`nexusd_${trackId}_paused_${userId}`), then navigates to the destination.
    - **Option 2: Quit Exam (Discard):** Cleanly purges the in-progress session without saving and navigates.
    - **Option 3: Stay in Exam:** Continues the test with zero time lost.

### 2.3 Stratified Domain Weighting & Dual-Shuffling Architecture
* **Syllabus-Aligned Domain Sampling:** Rather than serving static sets of questions in loop, mock exams dynamically extract 60 questions matching official ServiceNow syllabus domain percentages (e.g., CSA: 20% UI, 20% Collaboration, 30% DB Admin, 20% Automation, 10% Scripting).
* **Dual-Shuffle Engine (Fisher-Yates):**
  - **Question Sequence Shuffling:** Shuffles question order (1 through 60) on every attempt.
  - **Option Choices Shuffling:** Shuffles options (A, B, C, D) within every question independently while keeping correct answer IDs intact.

### 2.4 2-Year All-Access Pass Validity Standardization (730 Days)
* Standardized the **₹999 All-Access Pass** to a **2-Year validity period (730 days)** across all views:
  - Pricing page card highlights and comparison table.
  - Profile entitlements and countdown displays (`daysRemaining`).
  - Admin command center pass telemetry.
  - Single-track pass (₹499) remains 1-Year (365 days).

### 2.5 High-Impact EdTech Dashboard Redesign
* **Active Certification Track Switcher:** Dynamic pill bar allowing candidates to toggle between CSA, CAD, CIS-DF, and CIS-ITSM, immediately updating hero metrics and practice launch targets.
* **7-Day Study Habit Streak Loop:** Mon–Sun habit tracker encouraging daily practice consistency.
* **Readiness Gauge:** Real-time exam readiness percentage benchmarked against the official 70% passing threshold.
* **4-Stage Milestone Roadmap:** Metro-line storytelling taking students from Diagnostic assessment to Blueprint notes, Mock simulations, and Revision review.
* **Paused Exam Resumption Banner:** Prominent resumption card if an active paused mock exam is pending.

### 2.6 Professional Candidate Portfolio (`/profile`)
* **Executive Summary:** Bio, target ServiceNow roles, and target certifications.
* **Academic History Timeline:** Degrees, institutions, CGPA/percentage, graduation years, and relevant coursework.
* **Professional Experience Timeline:** Platform internships, roles, company names, durations, and key platform achievements.
* **ServiceNow Credential Verification:** Dedicated fields and verified badges for Webassessor ID and Now Learning ID.
* **Gamified Profile Completeness Meter (0–100%):** Real-time score guiding candidates toward recruiter search optimization.
* **Actions:** 1-click printable PDF resume portfolio and shareable portfolio link.

### 2.7 Dynamic Landing Page Live Demo
* Replaced the static single question on the landing page live demo with dynamic rotation from the verified question repository, ensuring fresh engagement on every visit.

---

## 3. Production Verification
* **Turbopack Build:** All 31 routes compiled cleanly with 0 TypeScript / ESLint errors via `npm run build`.
* **Deployment:** Staged, committed (`de6a71a`), and pushed directly to `origin/main`.
