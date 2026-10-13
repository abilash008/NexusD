# Open Items & Decision History — NexusD

**Current Milestone:** Step 1 & Step 2 Complete $\rightarrow$ Ready for Step 3 (Sprint 1 Implementation)  
**Date:** 2026-10-11  
**File Location:** `/DOCS/07-open-items/open-decisions.md`  

---

## 1. Confirmed Decisions (Step 2.0 Gate Passed)

All 5 core architectural and scoping decisions have been formally confirmed:

| # | Decision Topic | Status | Confirmed Selection |
| :---: | :--- | :---: | :--- |
| **1** | **Phase 1 MVP Scope** | ✅ **Confirmed** | **Epics 1, 2, 3, 6, 7, and 8:** Practice Engine for Certification Preparations (launching with CSA), Study Blueprints, Razorpay, Admin CMS, and Performance Analytics. Other epics deferred to Phase 2/3. |
| **2** | **Database ORM** | ✅ **Confirmed** | **Drizzle ORM** with Neon PostgreSQL (`@neondatabase/serverless` connection pooler). Zero cold starts. |
| **3** | **Authentication** | ✅ **Confirmed** | **Auth.js (NextAuth v5)** with Drizzle adapter and real Neon DB checks. Zero MAU fee, self-hosted in Neon, custom shadcn/ui. |
| **4** | **Payment Gateway** | ✅ **Confirmed** | **Razorpay** for native Indian UPI, domestic NetBanking, and INR card support on `nexusd.in`. |
| **5** | **Community Real-Time** | ✅ **Confirmed** | **Option A (ADR 001):** Next.js Route Handlers + Optimistic UI & SWR Polling. Avoids Render sleeping instances and keeps hosting at $0. |
| **6** | **Live Razorpay Checkout Architecture** | ✅ **Confirmed & Live** | **Standard Web Checkout Modal (`checkout.js`)** with backend order creation (`/api/create-order`), cryptographic HMAC-SHA256 signature verification (`/api/verify-payment`), and automated 365-day access entitlement activation. |
| **7** | **Telemetry Source of Truth Policy** | ✅ **Confirmed & Live** | **Strict Neon DB Isolation:** Authenticated candidate telemetry (`/dashboard`, `/dashboard/analytics`) reads exclusively from Neon DB `userExamAttempts`. Dirty client `localStorage` caches are purged on load. Explicit `DELETE /api/exams/attempts` and Clear Records UI provided. |
| **8** | **Credential Security & Complexity Policy** | ✅ **Confirmed & Live** | **Strict Account Validation:** Dedicated `/signup` flow enforcing mandatory minimum 8 characters, at least 1 uppercase, 1 special character, and 1 digit, backed by bcrypt password hashing. |
| **9** | **Mock Exam Auth Gate & Pause/Quit Progress Policy** | ✅ **Confirmed & Implemented** | **Auth Gate & In-Exam Leave Modal:** Mock simulations require an authenticated account to protect analytics and attempt telemetry. Unauthenticated sessions are blocked with a dedicated gate, and any guest mock cache is purged from `localStorage`. In-exam leave navigation (browser back button or web page header button) provides 2 clear options: 1) Pause Exam (saves progress & timer), 2) Quit Exam (discards without saving). Practice mode remains free and open for guests. |
| **10** | **Practice Mode 60 Free Questions & Dual Shuffling Architecture** | ✅ **Confirmed & Implemented** | **Consistent 60 Free Questions Set:** Practice mode strictly delivers the consistent free 60 question set (`getFreeTrackQuestions(trackId)`) for each track (e.g. `csa-01` through `csa-60`), never leaking the extended 85+ question Pro Vault. **Dual-Shuffling:** Every time a practice test or mock exam is initiated or retaken, questions AND their options (A, B, C, D) are freshly shuffled via Fisher-Yates while maintaining answer correctness and question stems. |
| **11** | **Multi-Track Pricing Architecture & 2-Year All-Access Pass** | ✅ **Confirmed & Implemented** | **Single-Track & All-Access Models:** Individual passes available for all 4 mainline certifications (CSA, CAD, CIS-DF, CIS-ITSM) at ₹499 each with 1-Year (365 days) access. The premier **All-Access Career Pass** is set to **2 Full Years (730 Days)** validity at ₹999, unlocking all current and upcoming tracks, unlimited PDF exporters, and question master vaults. |
| **12** | **Stratified Domain-Weighted Random Sampling & Dual-Tier Telemetry** | ✅ **Confirmed & Implemented** | **Anti-Inflation Exam Assembly:** Stratified domain-weighted sampling algorithm (`generateTrackMockExam`) enforces exact blueprint quotas per domain from master repositories (e.g., 250+ questions). Free tier gets 1 baseline diagnostic exam (fixed 60 set with dual shuffle) to calibrate blind spots; Pro tier unlocks dynamic sampling with spaced repetition, preventing rote memorization and preserving accurate telemetry scores. |
| **13** | **Universal In-Exam Navigation Interception** | ✅ **Confirmed & Implemented** | **Universal DOM Click Interception:** Capturing-phase listener (`document.addEventListener("click", handleDocumentClick, true)`) intercepts all Next.js internal client-side navigation (`<a>` clicks across sidebar, dashboard, candidate profile, study guides, and brand logo). Halts navigation, saves pending URL, and displays Pause/Quit confirmation, routing seamlessly to the destination upon candidate choice. |
| **14** | **Candidate Profile Architecture & Dual-Layer Persistence** | ✅ **Confirmed & Implemented** | **Complete Profile & Credentials Suite:** Cover banner, availability status pill, gamified completeness meter (0-100%), education & experience timelines, technical skills matrix, and interactive multi-tab edit modal. Synchronized across Neon PostgreSQL (`user_profiles` via `/api/user/profile`) and offline-first `localStorage` (`nexusd_profile`). |

---

## 2. Active Implementation Queue

With Phase 1 MVP and Multi-Track Certification Architecture delivered and live in production on [`nexusd.in`](https://nexusd.in):

* **Current Status:** Phase 1 MVP & Multi-Track Certification Simulator Live in Production.
* **Next Active Sprint / Phase 2 Queue:**
  - **Epic 4:** Tailored Career Guidance Roadmaps (Fresher / Switcher / Trainee guides).
  - **Epic 5:** 1:1 Mentorship Marketplace (Practitioner profiles, Cal.com/Google Meet scheduling, reviews).
  - **Epic 9:** ServiceNow Community (Threaded Q&A, optimistic likes/comments, moderation).
  - **Epic 10:** ServiceNow-Exclusive Job Board (Employer & peer referral listings, portfolio applications).
  - **ServiceNow University Expansion:** Badges, exam completion credentials, candidate portfolio, and resume showcase.
