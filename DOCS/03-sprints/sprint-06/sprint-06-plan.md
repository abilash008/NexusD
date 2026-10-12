# Sprint 06 Plan — Production Launch, Live Razorpay Checkout, Auth Security & Multi-Track Telemetry

**Sprint Goal:** Successfully deploy `nexusd.in` to live production on Vercel, replace sandbox payment flows with live Razorpay Standard Web Checkout and cryptographic HMAC-SHA256 signature verification, harden user authentication with real Neon DB checks and strict password validation rules, deliver a multi-track performance analytics suite with zero mock data, and enforce Neon DB as the single source of truth for candidate telemetry.

**Sprint Window:** Weeks 11–12 (Production Hardening & Go-Live)  
**Target Velocity:** 14 Story Points  
**Status:** Complete  
**File Location:** `/DOCS/03-sprints/sprint-06/sprint-06-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-6.1** | Production Vercel Deployment & Build Verification (`nexusd.in`) | 3 | Complete |
| **US-6.2** | Live Razorpay Standard Web Checkout Integration & Webhooks | 4 | Complete |
| **US-6.3** | Hardened Authentication, Dedicated `/signup` & Password Policy | 3 | Complete |
| **US-6.4** | Multi-Track Certification Analytics & Zero-Demo Engine (`/dashboard/analytics`) | 2 | Complete |
| **US-6.5** | Telemetry Single Source of Truth & Local Storage Isolation | 2 | Complete |
| **Total** | **Sprint 06 Commitment** | **14 Points** | **100%** |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-6.1: Production Vercel Deployment & Build Verification
- [x] Configure production environment variables in Vercel (`DATABASE_URL`, `AUTH_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`).
- [x] Resolve build blockers and verify `npm run build` succeeds cleanly across all 40 static and dynamic routes.
- [x] Configure DNS routing and SSL for `https://nexusd.in`.
- [x] Ensure production assets, logos, and favicons load correctly in light and dark modes.

### US-6.2: Live Razorpay Standard Web Checkout Integration & Webhooks
- [x] Migrate payment gateway configuration from test sandbox to live credentials (`rzp_live_*`).
- [x] Embed Razorpay Standard Web Checkout script (`https://checkout.razorpay.com/v1/checkout.js`) with responsive payment modal.
- [x] Implement backend order creation endpoint (`POST /api/create-order` & `/api/payments/create-order`) with amount in paise and session validation.
- [x] Implement backend verification endpoint (`POST /api/verify-payment` & `/api/payments/verify`) using HMAC-SHA256 (`order_id + "|" + payment_id` against `RAZORPAY_KEY_SECRET`).
- [x] Automatically grant 365-day access pass in Neon PostgreSQL (`userEntitlements`) upon successful verification.
- [x] Remove sandbox test activation banners, prevent duplicate purchases for active subscriptions, and require login prior to checkout.

### US-6.3: Hardened Authentication, Dedicated `/signup` & Password Policy
- [x] Remove dummy authentication bypass; enforce real credential lookups against Neon PostgreSQL `users` table via NextAuth v5 and bcrypt.
- [x] Create dedicated registration page (`/signup`) with fields: username, email, password, and confirm password.
- [x] Enforce strict password complexity validation on both client and API:
  - Minimum 8 characters
  - At least 1 uppercase letter (`[A-Z]`)
  - At least 1 special character (`[!@#$%^&*(),.?":{}|<>]`)
  - At least 1 digit (`[0-9]`)
- [x] Create dedicated sign-in page (`/login`) with error feedback on invalid credentials.
- [x] Fix dashboard UI flickering and ensure unified dark/light styling on login/logout.

### US-6.4: Multi-Track Certification Analytics & Zero-Demo Engine
- [x] Remove all hardcoded dummy/demo analytics data from `/dashboard/analytics`.
- [x] Add certification track switcher across all 4 Phase 1 certifications: **CSA**, **CAD**, **CIS-DF**, and **CIS-ITSM**.
- [x] Display track-specific blueprint releases, domain quotas, and user entitlement status (`Free Starter`, `Subscribed`, `Pro Track`).
- [x] Implement real telemetry calculations:
  - Readiness score gauge calibrated against official 70% passing threshold.
  - Questions solved counter across real sessions.
  - Timed mocks completed count.
  - Question velocity pace (seconds/question) benchmarked against the 90s exam target.
  - Official blueprint domain breakdown with dynamic accuracy progress bars.
  - Weakest domain identification and contextual study directives.
  - Exam attempt history table with date, score, time, pass/fail badge, and retake action.

### US-6.5: Telemetry Single Source of Truth & Local Storage Isolation
- [x] Isolate authenticated user telemetry exclusively to persistent records in Neon PostgreSQL (`userExamAttempts`).
- [x] Stop merging dirty pre-production client test runs from `localStorage` (`nexusd_csa_mock_history`, `nexusd_csa_practice_history`) into authenticated views.
- [x] Automatically purge legacy local storage test keys on page load when a session is active.
- [x] Implement `DELETE /api/exams/attempts` route to allow wiping attempt history from the database.
- [x] Add prominent "Clear Records" button in both the top action bar and the history log table.

---

## 3. Sprint 06 Definition of Done (DoD) Checks

- [x] **Production Verification:** Live at `https://nexusd.in` with live payment gateway and secure authentication.
- [x] **Zero Mock Data:** All telemetry and stats strictly reflect real database state (0 records in DB = 0 records shown).
- [x] **Cryptographic Integrity:** Payment signatures verified with server-side HMAC-SHA256 before entitlement provisioning.
- [x] **Credential Security:** Passwords hashed with bcrypt; strict 8-character, uppercase, special character, digit complexity policy enforced.
- [x] **Build Baseline:** Next.js 16.4.0 Turbopack compiles 40 routes with 0 TypeScript/ESLint errors.
- [x] **Documentation Complete:** Pair maintained with `sprint-06-plan.md` and `sprint-06-summary.md`.
