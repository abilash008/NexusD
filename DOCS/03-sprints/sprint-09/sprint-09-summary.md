# Sprint 09 Summary — Dynamic Database Architecture, Zero-Hardcoded Questions & Admin Isolation

**Sprint Goal:** Purge all static questions and answer options from source code; establish a pure database-driven question pipeline powered by Neon PostgreSQL; make the candidate profile dynamic with user-scoped isolation; remove cross-boundary portal links from the confidential admin CMS; and introduce automated question verification and ingestion tooling.

**Sprint Window:** Question Pipeline Architecture & Administrative Boundary Isolation  
**Velocity Delivered:** 16 / 16 Story Points (100% Completion)  
**Status:** Complete & Verified in Production Build (`https://nexusd.in`)  
**File Location:** `/docs/03-sprints/sprint-09/sprint-09-summary.md`  

---

## 1. Deliverables & User Stories Completed

| Story ID | Story Title | Points | Status | Verification Route / Artifact |
| :--- | :--- | :---: | :---: | :--- |
| **US-9.1** | Candidate Profile Dynamic State & Empty Defaults | 3 | Completed | `/profile` (`src/app/profile/page.tsx`) |
| **US-9.2** | Admin Boundary Isolation (Remove Student Portal Links) | 2 | Completed | `/admin/*` (`src/app/admin/layout.tsx`, `/login`) |
| **US-9.3** | Codebase Question Purge (Zero Hardcoded Stems/Options) | 4 | Completed | `src/data/csa-questions.ts`, `multi-track-questions.ts` |
| **US-9.4** | Dynamic Question API Route (Neon PostgreSQL Queries) | 3 | Completed | `/api/questions` (`src/app/api/questions/route.ts`) |
| **US-9.5** | Automated Question Validation & Neon DB Importer CLI | 3 | Completed | `scripts/import-questions-to-neon.ts` |
| **US-9.6** | Graceful Zero-Question Empty State Handling | 1 | Completed | `/practice`, `/mock`, `/question-bank` |
| **Total** | **Sprint 09 Delivered** | **16 Points** | **100%** | **Production Build Verified (33/33 Routes Clean)** |

---

## 2. Technical Implementation Details

### 2.1 Dynamic Candidate Profile (`src/app/profile/page.tsx`)
- **Purged Mock Data:** Completely removed static hardcoded placeholder data (`Vithi Sharma`, `Cognizant`, `VIT`, fake phone number, mock exam scores).
- **Clean Empty Defaults:** Introduced `EMPTY_PROFILE` structure. When a new user logs in, their profile displays actual authenticated email and name from NextAuth session, with empty placeholders for unpopulated fields.
- **User-Scoped Isolation:** Replaced shared `localStorage.getItem("nexusd_profile")` with user-scoped key `nexusd_profile_${userEmailOrId}`, ensuring multiple users or admin accounts on the same workstation never leak profile state.

### 2.2 Complete Isolation of Admin Boundary
- **Removed "Back to Student Portal" Buttons:** Removed cross-portal navigation buttons from `src/app/admin/layout.tsx` and `src/app/admin/login/page.tsx`.
- **Removed Admin Links from Public Student Views:** Removed "Admin Question CMS" CTA from public exam runners (`src/app/certifications/[track]/mock/page.tsx`), maintaining strict boundary separation.
- **Pure Administrator Focus:** Quick action links in `/admin` now point exclusively to administrative tools (`/admin/questions`, `/admin/exams`, `/admin/reports`).

### 2.3 Elimination of Hardcoded Questions from Source Code
- Emptied all static arrays in `src/data/csa-questions.ts`:
  - `CSA_SEED_QUESTIONS = []`
  - `CSA_ALL_QUESTIONS = []`
  - `CSA_FREE_60_QUESTIONS = []`
  - `CSA_PRO_QUESTIONS = []`
- Emptied all static arrays in `src/data/multi-track-questions.ts`:
  - `CAD_SEED_QUESTIONS = []`
  - `CIS_DF_SEED_QUESTIONS = []`
  - `CIS_ITSM_SEED_QUESTIONS = []`
- Landing page interactive preview now renders a safe default question state without hardcoding exam pools into client bundles.

### 2.4 Dynamic Neon DB Questions API (`/api/questions`)
- **Route Handler:** `src/app/api/questions/route.ts`
- **GET Endpoint:** Allows clients to query questions dynamically from Neon PostgreSQL filtered by `certificationId`, `domainId`, `isFree`, and `limit`. Automatically joins `questions` with `questionOptions`.
- **POST Endpoint:** Admin-gated endpoint requiring an active administrator session (`session.user.role === "admin"`) to insert verified questions and options directly into the database.

### 2.5 Neon DB Ingestion Script & Verification Protocol (`scripts/import-questions-to-neon.ts`)
- Script supports automated schema verification, certification track validation, domain slug mapping, and atomic batch insertions into `questions` and `questionOptions` tables.
- **ServiceNow Release Documentation Protocol:** When raw question lists are provided by administrators:
  1. Question stems and answer keys are cross-verified against official ServiceNow product documentation (Australia and Brazil release notes and product guides).
  2. Question rationale, domain taxonomy, and option veracity are verified.
  3. Script executes validation before database commit.

### 2.6 Graceful Zero-Question States
- **Practice Runner (`/certifications/[track]/practice`):** Renders clean "Question Bank Awaiting Upload" card with return navigation.
- **Mock Simulator (`/certifications/[track]/mock`):** Displays "Track Questions in Authoring" status card without runtime index crashes.
- **Study Question Bank (`/study/[track]/question-bank`):** Distinguishes between zero questions in database vs. zero search results from active query filters.

---

## 3. Definition of Done (DoD) Verification
- [x] Zero questions or answer options hardcoded in application source code.
- [x] Candidate profile loads empty dynamic state scoped strictly to active authenticated user.
- [x] Admin layout and login gateway contain zero links to student portal.
- [x] Public student pages contain zero links to administrative CMS routes.
- [x] Neon DB import script and `/api/questions` route created and verified.
- [x] Production build passes with 0 errors across 33 routes (`next build`).
- [x] Changes pushed to GitHub repository (`origin/main`).
