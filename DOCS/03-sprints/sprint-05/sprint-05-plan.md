# Sprint 05 Plan — Admin CMS, Errata Dispute Triage & Pre-Launch Polish

**Sprint Goal:** Build the authenticated administrative portal (`/admin`) to give the platform owner direct CMS control over certification question banks, authoring new questions, managing 1-year passes, and triaging student-reported errata/disputes in real time without redeploying code.

**Sprint Window:** Weeks 9–10  
**Target Velocity:** 10 Story Points  
**Status:** In Progress  
**File Location:** `/DOCS/03-sprints/sprint-05/sprint-05-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-7.1** | Protected Admin Dashboard & Role Gate (`/admin`) | 2 | In Progress |
| **US-7.2** | Question Authoring & CMS Management Interface (`/admin/questions`) | 5 | In Progress |
| **US-7.3** | In-App Errata Reporting & Dispute Triage Queue (`/admin/reports`) | 3 | In Progress |
| **Total** | **Sprint 05 Commitment** | **10 Points** | -- |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-7.1: Protected Admin Dashboard & Role Gate (`/admin`)
- [ ] Admin route layout at `/admin` with role guard (`role === 'admin'` or `admin@nexusd.in`).
- [ ] Developer / evaluator quick-access toggle for local previewing without forced OAuth re-login.
- [ ] High-level operational metrics overview:
  - Total Questions Cataloged across certification tracks (CSA, CAD, etc.).
  - Total User Exam Attempts & Average Pass Rate.
  - Active 1-Year Certification Subscriptions & Revenue in ₹ INR.
  - Pending Errata & Dispute Reports Queue.
- [ ] Responsive navigation sidebar conforming to Deep Navy (`#0B192C`) design system.

### US-7.2: Question Authoring & CMS Management Interface (`/admin/questions`)
- [ ] Question management list view with:
  - Keyword search across question text and explanation.
  - Filter by Blueprint Domain (`ui-nav`, `collaboration`, `db-admin`, `automation`, `development`).
  - Filter by Access Tier (Free 60 Quota vs. Pro Vault).
- [ ] Full Question Authoring / Editing Modal:
  - Blueprint Domain selector with official weightings.
  - Single Choice vs. Multiple Choice toggle with required selection count.
  - Dynamic option items builder with "Is Correct" toggles.
  - Comprehensive architectural explanation with official ServiceNow documentation references.
  - Difficulty level and Release tag (`Australia & Brazil Releases`).
- [ ] Immediate reactivity: New or edited questions take effect immediately in the runtime question bank.

### US-7.3: In-App Errata Reporting & Dispute Triage Queue (`/admin/reports`)
- [ ] Student-facing "Report Errata" dialog accessible from question cards:
  - In `/study/csa/question-bank` and mock exam review `/certifications/csa/mock`.
  - Categories: *Incorrect Answer Key*, *Outdated Release Syllabus*, *Typo / Confusing Phrasing*, *Explanation Clarification*.
- [ ] Submissions API at `/api/questions/report`.
- [ ] Admin Triage Queue at `/admin/reports`:
  - List reported questions with reporter comment, timestamp, and issue badge.
  - Actions: Mark as Resolved, Dismiss, or 1-click jump to edit the question in the CMS.

---

## 3. Sprint 05 Definition of Done (DoD) Checks

- [ ] **Security Standards:** Admin routes protected from unauthorized access; sensitive mutations validated.
- [ ] **UI/UX Consistency:** Strict adherence to `#0B192C` Deep Navy, `#0066FF` Electric Blue, Slate neutrals, and WCAG AA contrast.
- [ ] **Build Validation:** `npm run build` passes with 0 errors across all static and dynamic admin routes.
- [ ] **Documentation Update:** Document Sprint 05 completion in `DOCS/03-sprints/sprint-05/sprint-05-summary.md` and `DOCS/00-START-HERE.md`.
