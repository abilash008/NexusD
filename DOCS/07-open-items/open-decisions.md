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

---

## 2. Active Implementation Queue

With Phase 1 MVP delivered and live in production on [`nexusd.in`](https://nexusd.in):

* **Current Status:** Phase 1 MVP Live in Production.
* **Next Active Sprint / Phase 2 Queue:**
  - **Epic 4:** Tailored Career Guidance Roadmaps (Fresher / Switcher / Trainee guides).
  - **Epic 5:** 1:1 Mentorship Marketplace (Practitioner profiles, Cal.com/Google Meet scheduling, reviews).
  - **Epic 9:** ServiceNow Community (Threaded Q&A, optimistic likes/comments, moderation).
  - **Epic 10:** ServiceNow-Exclusive Job Board (Employer & peer referral listings, portfolio applications).
  - **ServiceNow University Expansion:** Badges, exam completion credentials, candidate portfolio, and resume showcase.
