# Sprint 09 Plan — Dynamic Database Architecture, Zero-Hardcoded Questions & Admin Isolation

**Sprint Goal:** Purge all static questions and answer options from source code; establish a pure database-driven question pipeline powered by Neon PostgreSQL; make the candidate profile dynamic with user-scoped isolation; remove cross-boundary portal links from the confidential admin CMS; and introduce automated question verification and ingestion tooling.

**Sprint Window:** Question Pipeline Architecture & Administrative Boundary Isolation  
**Target Velocity:** 16 Story Points  
**Status:** Complete (Verified in Production Build)  
**File Location:** `/docs/03-sprints/sprint-09/sprint-09-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-9.1** | Candidate Profile Dynamic State & Empty Defaults | 3 | Complete |
| **US-9.2** | Admin Boundary Isolation (Remove Student Portal Links) | 2 | Complete |
| **US-9.3** | Codebase Question Purge (Zero Hardcoded Stems/Options) | 4 | Complete |
| **US-9.4** | Dynamic Question API Route (Neon PostgreSQL Queries) | 3 | Complete |
| **US-9.5** | Automated Question Validation & Neon DB Importer CLI | 3 | Complete |
| **US-9.6** | Graceful Zero-Question Empty State Handling | 1 | Complete |
| **Total** | **Sprint 09 Commitment** | **16 Points** | **100%** |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-9.1: Candidate Profile Dynamic State & Empty Defaults
- [x] Identify and purge all hardcoded mock profile values (`Vithi Sharma`, `Cognizant`, `VIT`, fake phone number, mock exam scores) in `src/app/profile/page.tsx`.
- [x] Implement clean `EMPTY_PROFILE` default state that loads dynamically from the authenticated NextAuth user session (`session.user.name`, `session.user.email`).
- [x] Replace global shared `localStorage` key (`nexusd_profile`) with an isolated user-scoped key: `nexusd_profile_${userEmailOrId}`.
- [x] Ensure that logging in with different credentials renders clean, isolated candidate profile data without cross-contamination.

### US-9.2: Admin Boundary Isolation (Remove Student Portal Links)
- [x] Review and remove "Back to Student Portal" button from the administrative layout header (`src/app/admin/layout.tsx`).
- [x] Remove "Return to Student Portal" link from the dedicated admin gateway (`src/app/admin/login/page.tsx`).
- [x] Replace cross-portal navigation in `/admin` quick action cards with direct links to admin management tools (`/admin/questions`, `/admin/exams`, `/admin/reports`).
- [x] Remove administrative CMS links from candidate test runner views (`src/app/certifications/[track]/mock/page.tsx`), maintaining strict boundary separation.

### US-9.3: Codebase Question Purge (Zero Hardcoded Stems/Options)
- [x] Purge all static question entries from `src/data/csa-questions.ts`:
  - `CSA_SEED_QUESTIONS = []`
  - `CSA_ALL_QUESTIONS = []`
  - `CSA_FREE_60_QUESTIONS = []`
  - `CSA_PRO_QUESTIONS = []`
- [x] Purge all static question entries from `src/data/multi-track-questions.ts`:
  - `CAD_SEED_QUESTIONS = []`
  - `CIS_DF_SEED_QUESTIONS = []`
  - `CIS_ITSM_SEED_QUESTIONS = []`
- [x] Provide safe fallback for landing page live practice demo without packaging question banks into client bundles.

### US-9.4: Dynamic Question API Route (Neon PostgreSQL Queries)
- [x] Create API endpoint at `src/app/api/questions/route.ts`.
- [x] `GET /api/questions`:
  - Query questions and options from Neon PostgreSQL using Drizzle ORM.
  - Support query filters: `certificationId`, `domainId`, `isFree`, and `limit`.
  - Automatically join and format `questionOptions` for each question.
- [x] `POST /api/questions`:
  - Gate endpoint with administrative role check (`session.user.role === "admin"`).
  - Support programmatic insertion of verified questions and options into Neon DB.

### US-9.5: Automated Question Validation & Neon DB Importer CLI
- [x] Create standalone TypeScript script `scripts/import-questions-to-neon.ts`.
- [x] Define input schema for question objects: track code, domain slug, question stem, option array with correct flags, explanation, multi-select flag, and required select count.
- [x] Implement database foreign key verification (ensure certification track and domain exist before question insertion).
- [x] Execute atomic batch insertion into `questions` and `questionOptions` tables.
- [x] Establish official ServiceNow documentation cross-verification protocol against Australia and Brazil release guides before database ingestion.

### US-9.6: Graceful Zero-Question Empty State Handling
- [x] In `src/app/certifications/[track]/practice/page.tsx`: ensure empty questions array renders a clean "No Practice Questions Found" state rather than an index error.
- [x] In `src/app/certifications/[track]/mock/page.tsx`: verify empty question bank displays "Track Questions in Authoring" status card.
- [x] In `src/app/study/[track]/question-bank/page.tsx`: distinguish between empty database ("Question Bank Awaiting Upload") and no filter matches ("No questions matched your search criteria").

---

## 3. Sprint 09 Definition of Done (DoD) Checks

- [x] **Zero Hardcoded Questions:** Zero questions or options remain hardcoded in source files.
- [x] **Candidate Profile Clean:** Profile defaults to empty state scoped strictly to the authenticated user.
- [x] **Boundary Isolation:** Zero links connecting admin CMS to student portal views.
- [x] **Neon DB Pipeline:** Importer script and `/api/questions` route ready for verified question batches.
- [x] **Build Verification:** Production build passes with 0 errors across 33 routes (`next build`).
- [x] **Deployment:** Committed (`ee0f80a`) and pushed to `origin/main`.
