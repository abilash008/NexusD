# Sprint 02 Summary — Practice Engine for Certification Preparations & Timed Mocks

**Sprint Window:** Weeks 3–4  
**Committed Velocity:** 19 Story Points  
**Delivered Velocity:** 19 Story Points (100% Completion)  
**Status:** Accepted & Shipped  
**File Location:** `/DOCS/03-sprints/sprint-02/sprint-02-summary.md`  

---

## 1. Executive Summary

Sprint 02 delivered the core interactive exam engine for ServiceNow certifications, launching with the full-fidelity Certified System Administrator (CSA) simulation aligned exclusively to the **Australia & Brazil Releases**. 

The engine provides candidates with an authentic exam simulation, including a persistent 90-minute countdown timer with `localStorage` recovery across browser reloads, an interactive 60-question drawer navigator, multi-select validation ("Choose 2", "Choose 3"), instant blueprint scoring against the 70% passing threshold, domain-level weakness breakdowns, comprehensive review filtering, and automatic attempt telemetry persistence.

---

## 2. Stories Delivered

| Story ID | Description | Points | Status | Key Artifacts |
| :--- | :--- | :---: | :---: | :--- |
| **US-2.1** | Question Bank Persistence & 60-Question Blueprint Seed | 3 | **Done** | `src/data/csa-questions.ts` |
| **US-2.2** | Practice Hub & Mode Selection UI | 3 | **Done** | `src/app/certifications/csa/page.tsx` |
| **US-2.3** | Interactive Timed Mock Exam Runner | 8 | **Done** | `src/app/certifications/csa/mock/page.tsx` |
| **US-2.4** | Instant Scoring, Pass/Fail Result & Full Review Engine | 5 | **Done** | `src/app/certifications/csa/mock/page.tsx`, `/api/exams/submit` |
| **Total** | **Sprint 02 Velocity** | **19** | **100%** | **4 Core Modules** |

---

## 3. Key Feature Deliverables

### 3.1. 60-Question Verified Question Bank (`src/data/csa-questions.ts`)
- **Strict Blueprint Alignment:** 60 verified questions mapped across official CSA domains:
  - Domain 1: User Interface & Navigation (12 questions / 20%)
  - Domain 2: Collaboration & Task Management (12 questions / 20%)
  - Domain 3: Database Administration & Schema (18 questions / 30%)
  - Domain 4: Self-Service & Process Automation (12 questions / 20%)
  - Domain 5: Introduction to Development (6 questions / 10%)
- **Multi-Select Support:** Authentic "Choose 2" and "Choose 3" multi-option validation with dedicated badges and square checkbox styling.
- **Australia & Brazil Release Guardrail:** Every single question is verified against current 2026 ServiceNow behavior with detailed architectural explanations.

### 3.2. Timed Mock Exam Runner (`/certifications/csa/mock`)
- **90-Minute Countdown Timer:** Automatically ticks down with urgency warning (<10 min turns red with pulse); persists across accidental page refreshes via `localStorage`.
- **60-Question Navigation Grid Drawer:** Visual matrix reflecting Answered (blue), Flagged (amber), and Unanswered (neutral) states with 1-click jumps to any question.
- **Question Bookmarking:** Instant flag toggle for deferred candidate review.
- **Submission Confirmation Dialog:** Modal warning summarizing answered vs. unanswered counts before scoring.
- **Historical Telemetry Table:** Renders recent exam attempts (Date, Score %, Correct Count, Time Spent, Status) from local storage and API.

### 3.3. Instant Scoring & Full Review Engine
- **Blueprint Scoring:** Instant evaluation against the 70% passing threshold (42 / 60 required).
- **Domain Accuracy Bars:** Visual breakdown identifying specific strengths and weak areas across all 5 blueprint domains.
- **Comprehensive Question Review:** Full breakdown of all 60 questions with user selection indicators, correct answers, and architectural explanations.
- **Review Filters:** 1-click filter pills for "All (60)", "Incorrect (X)", and "Flagged (Y)".

### 3.4. Practice Mode & Domain Drills (`/certifications/csa/practice`)
- **1-Click Domain Practice:** Each domain card on `/certifications/csa` provides a direct button to `/certifications/csa/practice?domain=[slug]`.
- **URL Parameter Syncing:** Implemented with Next.js `useSearchParams()` wrapped inside `<Suspense>` for zero hydration/prerender issues.
- **Instant Practice Feedback:** Reveals correct answers and architectural explanations immediately after answering.

### 3.5. Server-Side Attempt Persistence (`/api/exams/submit`)
- **Route Handler:** Persists exam attempts into Neon PostgreSQL (`user_exam_attempts` and `user_answers`) when `DATABASE_URL` is configured.
- **Zero-Crash Graceful Fallback:** Operates offline or in guest mode without errors, ensuring candidate flow is never interrupted.

---

## 4. Definition of Done (DoD) & Verification

| DoD Criteria | Target | Result | Status |
| :--- | :--- | :--- | :---: |
| Next.js Production Build | 0 errors | Compiled 13 routes in 2.1s | **Pass** |
| TypeScript Validation | 0 type errors | Checked clean in 3.7s | **Pass** |
| Design System Conformance | Deep Navy (`#0B192C`), Electric Blue (`#0066FF`) | 100% compliant tokens | **Pass** |
| Release Labeling | Australia & Brazil only | 100% compliant (0 legacy mentions) | **Pass** |
| AWS Portability | Standalone build & standard Postgres | Verified | **Pass** |

---

## 5. Next Sprint Preview: Sprint 03

- **Focus:** Study Blueprints & Student Performance Analytics (Epic 3 & Epic 8).
- **Key Stories:**
  - Topic-by-topic study syllabus for CSA domains.
  - Interactive cheat sheets and ServiceNow architecture diagrams.
  - Deep telemetry dashboard (`/dashboard/analytics`) visualizing domain readiness trends over time.
