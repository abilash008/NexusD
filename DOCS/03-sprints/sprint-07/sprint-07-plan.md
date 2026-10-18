# Sprint 07 Plan — Platform Modernization, Universal Typography Scale, Dynamic Mock Engine & Candidate Portfolio

**Sprint Goal:** Standardize font styles and font sizes across the entire codebase to a disciplined small-to-medium scale, implement dynamic multi-track mock test session protection with universal exit interception (Pause vs. Quit), extend the All-Access Pass validity to 2 years (730 days), overhaul the dashboard and candidate profile into an industry-leading EdTech experience, and ensure dynamic question rotation on the landing page.

**Sprint Window:** Platform Revamp & Design Systems  
**Target Velocity:** 18 Story Points  
**Status:** Complete (Verified in Production Build)  
**File Location:** `/docs/03-sprints/sprint-07/sprint-07-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-7.1** | Universal Small-to-Medium Typography Scale & Token System | 4 | Complete |
| **US-7.2** | Universal Mock Test Interception & Dynamic Pause/Quit | 3 | Complete |
| **US-7.3** | Stratified Domain Weighting & Fresh Dual-Shuffling Architecture | 3 | Complete |
| **US-7.4** | 2-Year All-Access Pass Validity Standardization (730 Days) | 2 | Complete |
| **US-7.5** | High-Impact EdTech Dashboard Redesign | 3 | Complete |
| **US-7.6** | Professional Candidate Portfolio & Credential Suite | 2 | Complete |
| **US-7.7** | Dynamic Landing Page Live Practice Question Rotation | 1 | Complete |
| **Total** | **Sprint 07 Commitment** | **18 Points** | **100%** |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-7.1: Universal Small-to-Medium Typography Scale & Token System
- [x] Eliminate oversized headings (`text-5xl`, `text-6xl`, `text-7xl`) and aggressive `font-black`/`font-extrabold` weights across all 31 application routes.
- [x] Standardize H1 headings to `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`.
- [x] Standardize H2 section titles to `text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white`.
- [x] Standardize card and feature titles (H3) to `text-base font-semibold text-slate-900 dark:text-white`.
- [x] Enforce body copy scale as `text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed`.
- [x] Register Geist sans and mono font variables in Tailwind v4 `@theme inline` inside `src/app/globals.css` to guarantee font consistency between server and client components.
- [x] Standardize UI button dimensions to uniform heights `h-10` or `h-11 px-5 text-xs sm:text-sm font-semibold`.

### US-7.2: Universal Mock Test Interception & Dynamic Pause/Quit
- [x] Remove hardcoded track identifiers (`csa`), ensuring timed mock logic is dynamic across all tracks (`CSA`, `CAD`, `CIS-DF`, `CIS-ITSM`).
- [x] Enforce authentication gate on mock exam simulation (`status === "authenticated"`), protecting student telemetry from unauthenticated cache corruption.
- [x] Implement capturing-phase DOM event listener on all link clicks across the entire application shell during an active exam.
- [x] Render a 3-choice modal when an exam taker attempts to leave:
  - **Pause Exam:** Persists remaining time, current question index, flagged items, and answers to `nexusd_${trackId}_paused_${userId}` before navigating away.
  - **Quit Exam:** Cleanly wipes the active attempt state and navigates away.
  - **Stay in Exam:** Closes modal and resumes countdown with zero time lost.
- [x] Preserve paused exam state across page refreshes and display a resumption banner on dashboard/mock page.

### US-7.3: Stratified Domain Weighting & Fresh Dual-Shuffling Architecture
- [x] Implement stratified domain extraction so generated mock exams strictly mirror official ServiceNow blueprint percentages.
- [x] Build Fisher-Yates dual-shuffle engine:
  - Shuffles the question presentation order on every fresh attempt.
  - Shuffles answer choices (A, B, C, D) independently per question while preserving correct answer mappings.
- [x] Ensure domain weights and required option counts are properly reflected in both practice drill and timed mock test modes.

### US-7.4: 2-Year All-Access Pass Validity Standardization (730 Days)
- [x] Fix pricing card and comparison table inconsistency: ensure the ₹999 All-Access Pass displays a 2-Year validity period (730 days) instead of 1-Year.
- [x] Update entitlement provisioning in backend and profile views (`daysRemaining = 730`).
- [x] Keep single-track pass (₹499) at 1-Year validity (365 days).
- [x] Align pricing copy across landing page, pricing page, checkout modals, and admin portal.

### US-7.5: High-Impact EdTech Dashboard Redesign
- [x] Redesign `/dashboard` with dynamic certification track switcher pill bar (CSA, CAD, CIS-DF, CIS-ITSM).
- [x] Implement 7-day Mon–Sun study habit streak loop with visual completion indicators.
- [x] Add real-time exam readiness gauge benchmarked against the official 70% passing threshold.
- [x] Introduce a 4-stage milestone roadmap (Diagnostic assessment, Blueprint notes, Mock simulations, Revision review).
- [x] Display prominent "Resume Paused Exam" card when a saved session exists in storage.

### US-7.6: Professional Candidate Portfolio & Credential Suite
- [x] Overhaul `/profile` into an industry-grade candidate resume and portfolio page.
- [x] Include structured sections: Executive Summary, Target ServiceNow Roles, Academic History, Platform Experience, and ServiceNow Credential Verification (Webassessor ID & Now Learning ID).
- [x] Add real-time gamified Profile Completeness meter (0–100%).
- [x] Provide 1-click printable portfolio PDF action and shareable link.

### US-7.7: Dynamic Landing Page Live Practice Question Rotation
- [x] Replace static hardcoded question on the landing page hero preview.
- [x] Implement dynamic rotation selecting random questions on each visit or user interaction.
- [x] Ensure interactive feedback (correct/incorrect answer highlight, explanation reveal) works smoothly without hardcoded question state.

---

## 3. Sprint 07 Definition of Done (DoD) Checks

- [x] **Typography Consistency:** Audited all 31 routes to ensure strict adherence to small-to-medium font sizes (`text-xs` to `text-3xl`).
- [x] **Universal Interception:** Navigation intercepted across internal links, browser back button, and window close events during exams.
- [x] **Pricing Accuracy:** ₹999 plan verified as 2-Year (730 days) across UI and entitlements logic.
- [x] **Build Baseline:** Turbopack builds cleanly with 0 TypeScript/ESLint errors across 31 routes.
- [x] **Deployment:** Committed (`de6a71a`) and pushed to `origin/main`.
