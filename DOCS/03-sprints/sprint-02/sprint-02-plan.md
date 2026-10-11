# Sprint 02 Plan — Practice Engine for Certification Preparations & Timed Mocks

**Sprint Goal:** Deliver the full-scale interactive exam engine for ServiceNow certifications (launching with the 60-question Certified System Administrator - CSA simulation). Features a persistent 90-minute countdown timer with `localStorage` recovery, full 60-question grid navigation drawer, domain-filtered practice, multi-select validation, instant blueprint scoring, and persistent attempt history.

**Sprint Window:** Weeks 3–4  
**Target Velocity:** 19 Story Points  
**Status:** Completed  
**File Location:** `/DOCS/03-sprints/sprint-02/sprint-02-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-2.1** | Question Bank Persistence & 60-Question Blueprint Seed | 3 | Completed |
| **US-2.2** | Practice Hub & Mode Selection UI (Practice, Timed Mock, Domain Filter) | 3 | Completed |
| **US-2.3** | Interactive Timed Mock Exam Runner (Timer, 60-Question Drawer, Bookmarking) | 8 | Completed |
| **US-2.4** | Instant Scoring, Pass/Fail Result & Full Review Engine | 5 | Completed |
| **Total** | **Sprint 02 Commitment** | **19 Points** | **100% Completed** |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-2.1: Question Bank Expansion (60 Questions, Australia & Brazil Aligned)
- [x] 60 verified questions distributed across the 5 official CSA blueprint weightings:
  - Domain 1: User Interface & Navigation (12 questions / 20%)
  - Domain 2: Collaboration & Task Management (12 questions / 20%)
  - Domain 3: Database Administration & Schema (18 questions / 30%)
  - Domain 4: Self-Service & Process Automation (12 questions / 20%)
  - Domain 5: Introduction to Development (6 questions / 10%)
- [x] Support for single-choice and multi-choice ("Choose 2", "Choose 3") questions.
- [x] Detailed architectural explanations for each question.
- [x] All tagged with `Australia & Brazil` release version.

### US-2.2: Practice Hub & Mode Selection UI
- [x] Update `/certifications/csa` with clear entry cards:
  - 15-Question Free Preview Practice Mode
  - Full 60-Question 90-Minute Timed Mock Exam
  - Domain-Specific Practice drills (with direct 1-click CTA buttons per domain)
- [x] Display official blueprint breakdown with question counts per domain.

### US-2.3: Interactive Timed Mock Runner (`/certifications/csa/mock`)
- [x] 90-Minute countdown timer that persists in `localStorage` across page reloads.
- [x] 60-question interactive navigation drawer/grid:
  - Visual status: Answered (Blue), Flagged for Review (Amber), Unanswered (Neutral).
  - Jump directly to any question from 1 to 60.
- [x] Question bookmarking / flagging toggle.
- [x] Multi-select validation with helpful badge ("Choose 2 options").
- [x] Submission confirmation modal warning if unanswered questions remain.

### US-2.4: Instant Scoring, Pass/Fail Result & Full Review Engine
- [x] Instant score calculation against the 70% passing threshold (42 / 60 to pass).
- [x] Granular domain performance breakdown bars.
- [x] Full review mode allowing review of all 60 questions with user selection, correct answers, and explanations.
- [x] Filter review by "Incorrect Only" or "Flagged Only".
- [x] Server action / route handler (`/api/exams/submit`) for saving attempt telemetry.

---

## 3. Sprint 02 Definition of Done (DoD) Checks

- [x] **UI/UX Consistency:** Reuses documented design tokens (`#0B192C` Navy, `#0066FF` Electric Blue, Slate neutrals) and components from `/DOCS/06-design/component-conventions.md`.
- [x] **Performance Check:** Fast client-side rendering with zero UI lag when navigating between 60 questions. Clean sub-second build.
- [x] **Release Accuracy:** Exclusively references Australia & Brazil releases.
- [x] **Documentation Update:** Update `sprint-02-summary.md` and `DOCS/00-START-HERE.md` upon completion.
