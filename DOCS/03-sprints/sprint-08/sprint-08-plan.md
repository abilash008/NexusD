# Sprint 08 Plan — Confidential Admin Security Perimeter, Role Gating & Blueprint Compliance

**Sprint Goal:** Secure the administrative portal (`/admin`) behind a dedicated, confidential authentication perimeter, prevent student accounts from accessing CMS routes, establish backend-governed administrator provisioning without public self-registration, implement Next.js edge middleware interception, and enforce strict ServiceNow blueprint compliance for CIS-DF (KB0012913 vs. CIS-Discovery).

**Sprint Window:** Security Hardening & Blueprint Precision  
**Target Velocity:** 16 Story Points  
**Status:** Complete (Verified in Production Build)  
**File Location:** `/docs/03-sprints/sprint-08/sprint-08-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-8.1** | Backend Administrator Auto-Seeding & Elevation Service | 3 | Complete |
| **US-8.2** | Dedicated Admin Gateway Login Portal (`/admin/login`) | 3 | Complete |
| **US-8.3** | Next.js Edge Middleware Interception on `/admin/*` | 3 | Complete |
| **US-8.4** | Admin Layout Student Session Guard & 403 Forbidden Screen | 3 | Complete |
| **US-8.5** | Public Registration Lockdown (Reserved Admin Usernames/Emails) | 2 | Complete |
| **US-8.6** | Multi-Track Blueprint Compliance (CIS-DF KB0012913 vs. CIS-Discovery) | 2 | Complete |
| **Total** | **Sprint 08 Commitment** | **16 Points** | **100%** |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-8.1: Backend Administrator Auto-Seeding & Elevation Service
- [x] Create automated backend helper `ensureAdminUser()` in `src/lib/admin-auth.ts`.
- [x] Verify presence of administrator in Neon PostgreSQL upon NextAuth initialization.
- [x] Hash administrative password using `bcryptjs` (10 salt rounds).
- [x] Support environment variable configuration (`ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) with secure defaults.
- [x] Ensure automated role elevation to `role: "admin"` for the primary administrator account without requiring manual SQL queries.

### US-8.2: Dedicated Admin Gateway Login Portal (`/admin/login`)
- [x] Create isolated administrator sign-in page at `/admin/login` (`src/app/admin/login/page.tsx`).
- [x] Exclude all public self-registration ("Sign Up") links from the administrative login screen.
- [x] Validate credentials against NextAuth backend and verify that `session.user.role === "admin"`.
- [x] If an authenticated non-admin student attempts sign-in via `/admin/login`, immediately terminate session and display a 403 privilege alert.
- [x] Apply restricted security perimeter styling ("RESTRICTED PERIMETER • Unauthorized access is prohibited and logged").

### US-8.3: Next.js Edge Middleware Interception on `/admin/*`
- [x] Configure Next.js edge middleware in `src/middleware.ts` with matcher `["/admin", "/admin/:path*"]`.
- [x] Intercept unauthenticated and unauthorized requests before page rendering or server component execution.
- [x] Allow access to `/admin/login` without redirect loops.
- [x] For all other `/admin/*` routes, inspect NextAuth session token:
  - If token is missing or `token.role !== "admin"`, redirect with HTTP 307 to `/admin/login?callbackUrl=...`.

### US-8.4: Admin Layout Student Session Guard & 403 Forbidden Screen
- [x] In `src/app/admin/layout.tsx`, implement server/client component role verification.
- [x] Render a dedicated 403 Forbidden card if an active session has `role !== "admin"`.
- [x] Provide a clear switch account CTA and a safe link back to `/dashboard`.
- [x] Strip student shell elements (navigation sidebar, student footer, layout shell padding) when rendering administrative routes.

### US-8.5: Public Registration Lockdown (Reserved Admin Usernames/Emails)
- [x] In `src/app/signup/actions.ts`, add server-side validation to block registration using reserved usernames (`admin`, `administrator`, `root`, `superuser`).
- [x] Reject registration attempts using the configured admin email address.
- [x] Explicitly hardcode `role: "user"` on all public signup inserts into Neon DB, preventing role injection attacks.

### US-8.6: Multi-Track Blueprint Compliance (CIS-DF KB0012913 vs. CIS-Discovery)
- [x] Resolve confusion between CIS-DF (Certified Implementation Specialist - Data Foundations: CMDB and CSDM) and CIS-Discovery (ITOM Discovery).
- [x] Align CIS-DF across codebase and documentation with official ServiceNow University KB0012913 blueprint:
  - Title: Certified Implementation Specialist - Data Foundations (CMDB and CSDM)
  - Questions: 75 Questions (Beta/Mainline)
  - Duration: 90 Minutes
  - Passing Score: 70%
  - Core Focus: CMDB, CSDM Framework, Service Graph Connectors, Data Hygiene
- [x] Verify blueprint parameters for CSA (KB0011554), CAD (KB0011498), and CIS-ITSM (KB0011560).
- [x] Update `docs/CERTIFICATION_STANDARDS.md` with official ServiceNow University knowledge article specifications.

---

## 3. Sprint 08 Definition of Done (DoD) Checks

- [x] **Direct URL Protection:** Entering `/admin` directly in the browser forces authentication challenge.
- [x] **No Public Admin Signup:** Dedicated `/admin/login` contains zero sign-up options; admin accounts are backend-provisioned.
- [x] **Student Role Quarantine:** Student accounts attempting to access admin routes are blocked by middleware and layout guards.
- [x] **Blueprint Precision:** CIS-DF properly reflects CMDB/CSDM focus as per KB0012913.
- [x] **Build Verification:** Production build passes with 0 errors across 32 routes (`next build`).
- [x] **Deployment:** Committed (`a1d38e1`) and pushed to `origin/main`.
