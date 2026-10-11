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
| **3** | **Authentication** | ✅ **Confirmed** | **Auth.js (NextAuth v5)** with Drizzle adapter. Zero MAU fee, self-hosted in Neon, custom shadcn/ui. |
| **4** | **Payment Gateway** | ✅ **Confirmed** | **Razorpay** for native Indian UPI, domestic NetBanking, and INR card support on `nexusd.in`. |
| **5** | **Community Real-Time** | ✅ **Confirmed** | **Option A (ADR 001):** Next.js Route Handlers + Optimistic UI & SWR Polling. Avoids Render sleeping instances and keeps hosting at $0. |

---

## 2. Active Implementation Queue

With Step 2 approved, the delivery backlog is locked in [`DOCS/02-agile-plan/agile-delivery-plan.md`](file:///c:/NexusD/DOCS/02-agile-plan/agile-delivery-plan.md).

* **Immediate Next Action:** Begin **Sprint 1 (Foundations, Design System & Auth Context)**:
  - `US-1.1`: Next.js 15+ App Router, Tailwind, shadcn/ui tokens, Navy/Blue theme, component conventions.
  - `US-1.2`: Drizzle ORM schema, migrations, and Neon Postgres setup.
  - `US-1.3`: Auth.js (NextAuth v5) configuration with Google OAuth and Magic Link.
  - `US-1.4`: Contextual onboarding flow (Background segment + ServiceNow target role taxonomy).
