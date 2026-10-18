# 00-START-HERE — NexusD Project Knowledge Base & Master Index

> **Welcome!** If you are joining this project in a new session or as an AI assistant, **read this document first**. It provides the operational context, current project phase, architectural blueprint, and directory map.

---

## 1. Project Overview

* **Product Name:** NexusD
* **Domain:** [`nexusd.in`](https://nexusd.in)
* **Mission:** Build a high-performance, modern, and affordable career and certification enablement platform tailored exclusively to the ServiceNow ecosystem.
* **Target Personas:**
  1. **Freshers** seeking entry-level ServiceNow roles (e.g., CSA, Junior Admin/Developer).
  2. **Non-IT Professionals** switching careers into ServiceNow development/consulting.
  3. **Trainees & Early-Career Developers** undergoing corporate training or upskilling.
* **Core Reference Competitor:** `certyiq.com` (NexusD is engineered to be faster, better-designed, more comprehensive, and significantly more affordable).
* **Delivery Model:** Solo, part-time developer velocity using strict agile sprints and continuous documentation.

---

## 2. Current Project Status

| Milestone | Status | Key Deliverable / Link |
| :--- | :--- | :--- |
| **Project Brief & Vision** | ✅ Complete | [`docs/antigravity_prompt.md`](file:///c:/NexusD/docs/antigravity_prompt.md) |
| **Step 1: Business Requirements Document (BRD)** | ✅ Approved | [`DOCS/01-BRD/business-requirements-document.md`](file:///c:/NexusD/DOCS/01-BRD/business-requirements-document.md) |
| **Step 1: Brand & Palette Proposal** | ✅ Approved | [`DOCS/06-design/brand-and-palette.md`](file:///c:/NexusD/DOCS/06-design/brand-and-palette.md) |
| **Step 1: Architecture Decision Records (ADRs)** | ✅ Approved | [`DOCS/05-decisions/`](file:///c:/NexusD/DOCS/05-decisions/) |
| **Step 2.0: MVP Scope Selection** | ✅ Confirmed | Epics 1, 2, 3, 6, 7, 8 locked for Phase 1 |
| **Step 2: Agile Delivery Plan & Backlog** | ✅ Baselined | [`DOCS/02-agile-plan/agile-delivery-plan.md`](file:///c:/NexusD/DOCS/02-agile-plan/agile-delivery-plan.md) |
| **Step 3: Implementation — Sprint 1** | ✅ Complete | [`DOCS/03-sprints/sprint-01/sprint-01-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-01/sprint-01-summary.md) |
| **Step 3: Implementation — Sprint 2** | ✅ Complete | [`DOCS/03-sprints/sprint-02/sprint-02-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-02/sprint-02-summary.md) |
| **Step 3: Implementation — Sprint 3** | ✅ Complete | [`DOCS/03-sprints/sprint-03/sprint-03-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-03/sprint-03-summary.md) |
| **Step 3: Implementation — Sprint 4** | ✅ Complete | [`DOCS/03-sprints/sprint-04/sprint-04-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-04/sprint-04-summary.md) |
| **Step 3: Implementation — Sprint 5** | ✅ Complete | [`DOCS/03-sprints/sprint-05/sprint-05-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-05/sprint-05-summary.md) |
| **Step 3: Implementation — Sprint 6** | ✅ Complete | [`DOCS/03-sprints/sprint-06/sprint-06-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-06/sprint-06-summary.md) |
| **Step 3: Implementation — Sprint 7** | ✅ Complete | [`DOCS/03-sprints/sprint-07/sprint-07-summary.md`](file:///c:/NexusD/DOCS/03-sprints/sprint-07/sprint-07-summary.md) (Typography Scale, Dynamic Mock Engine, 2-Yr Pass, EdTech Dashboard & Profile) |
| **Step 3: Implementation — Sprint 8** | ✅ Complete | [`docs/03-sprints/sprint-08/sprint-08-summary.md`](file:///c:/NexusD/docs/03-sprints/sprint-08/sprint-08-summary.md) (Confidential Admin Perimeter, Dedicated Gateway, Edge Middleware & CIS-DF Blueprint) |
| **Production Launch Status** | 🚀 **Live in Production** | Live at [`nexusd.in`](https://nexusd.in) (Live Razorpay Standard Checkout, Hardened NextAuth + Neon DB, Multi-Track Telemetry) |

---

## 3. Master Documentation Directory Map

```text
/c:/NexusD/DOCS/
├── 00-START-HERE.md                 ← (This file) Master entry point and project state
├── 01-BRD/
│   └── business-requirements-document.md  ← Full BRD, target personas, scope, and open questions
├── 02-agile-plan/
│   └── agile-delivery-plan.md       ← Epics, user stories, Fibonacci estimates, sprint roadmap
├── 03-sprints/                      ← Per-sprint execution logs, acceptance criteria, DoD checklists
│   ├── sprint-01/
│   ├── sprint-02/
│   ├── sprint-03/
│   ├── sprint-04/
│   ├── sprint-05/
│   ├── sprint-06/                   ← Live deployment, Razorpay Standard Checkout, Auth & Telemetry
│   ├── sprint-07/                   ← Typography Scale Standard, Dynamic Mock Engine, Dashboard & Profile Revamp
│   └── sprint-08/                   ← Confidential Admin Gateway, Edge Middleware, CIS-DF Blueprint Compliance
├── 04-architecture/
│   ├── admin-security-and-role-perimeter.md ← Multi-layer admin security, edge proxy, and credential lifecycle
│   ├── cloud-infrastructure-and-migration.md ← Two-phase hosting model & AWS migration blueprint
│   ├── email-infrastructure.md      ← Zoho Mail routing and domain configuration
│   └── tech-stack.md                ← Tech stack, database schema, and serverless architecture
├── 05-decisions/                    ← Architecture Decision Records (ADRs)
│   ├── 001-realtime-community-approach.md
│   ├── 002-tech-stack-selections.md
│   ├── 003-cloud-migration-aws-readiness.md
│   └── 004-confidential-admin-authentication.md ← Dedicated admin gateway, edge middleware, and backend seeding
├── 06-design/
│   ├── brand-and-palette.md         ← Navy/Blue hex codes, WCAG AA contrast, tone
│   └── component-conventions.md     ← Documented shadcn/ui design tokens & conventions
├── CERTIFICATION_STANDARDS.md       ← Official ServiceNow examination metrics, blueprints (CIS-DF vs Discovery)
└── 07-open-items/
    └── open-decisions.md            ← Confirmed decisions & active implementation queue
```

---

## 4. Key Architectural Standards & Non-Negotiables

1. **Brand Palette:** Deep Navy (`#0B192C`) as dominant anchor, Vibrant Accent Blue (`#0066FF`) for CTAs/active states, clean slate neutrals (`#F8FAFC`). No "wall of blue".
2. **Design System Consistency:** Every UI element reuses documented components from [`DOCS/06-design/component-conventions.md`](file:///c:/NexusD/DOCS/06-design/component-conventions.md). No arbitrary one-off inline styling.
3. **Performance First:** Next.js App Router with SSR/SSG for public SEO routes (`/certifications/...`, `/study/...`, `/jobs/...`). Strict performance budget checked before completing any sprint. Zero N+1 queries.
4. **Two-Phase Cloud Strategy & AWS Readiness:** Phase 1 uses zero-cost tiers (Vercel + Neon + Render); Phase 2 migrates to enterprise AWS (EC2/ECS, RDS, S3, CloudFront). All code is built container-ready (`output: 'standalone'`) with pure PostgreSQL schemas in Drizzle ORM to allow zero-refactor migration.
5. **Cross-Session Rule:** Never complete a task or make a design/code decision without updating the appropriate document in `/DOCS`.
