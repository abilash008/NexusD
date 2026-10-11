# Sprint 01 Plan — Foundations, Design System & Auth Context

**Sprint Goal:** Stand up the Next.js 15+ App Router application with Tailwind CSS and the documented Navy/Electric Blue design system, connect Drizzle ORM to Neon PostgreSQL, implement Auth.js (NextAuth v5), and build the contextual onboarding flow capturing background segment and target ServiceNow role taxonomy.

**Sprint Window:** Weeks 1–2  
**Target Velocity:** 16 Story Points  
**Status:** Ready to Start  
**File Location:** `/DOCS/03-sprints/sprint-01/sprint-01-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-1.1** | Project Setup, Component System & Design Tokens | 3 | Ready |
| **US-1.2** | Database Connection & Schema Setup (Neon + Drizzle) | 3 | Ready |
| **US-1.3** | Authentication with Auth.js (NextAuth v5) | 5 | Ready |
| **US-1.4** | Contextual Onboarding Flow (Background & Role Taxonomy) | 5 | Ready |
| **Total** | **Sprint 01 Commitment** | **16 Points** | -- |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-1.1: Project Setup & Component Conventions
- [ ] Initialize Next.js App Router (TypeScript, Tailwind CSS, ESLint, Lucide icons).
- [ ] Configure Tailwind CSS color tokens with Deep Navy (`#0B192C`), Electric Blue (`#0066FF`), and Slate neutrals.
- [ ] Install and configure shadcn/ui base primitives (`button`, `card`, `input`, `badge`, `dialog`, `dropdown-menu`, `tabs`, `progress`).
- [ ] Document component rules in `/DOCS/06-design/component-conventions.md`.
- [ ] Render responsive global Navbar, navigation links, and Footer shell.

### US-1.2: Database Connection & Schema Setup (Neon + Drizzle)
- [ ] Install Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`).
- [ ] Create `src/lib/db/` connection client with connection pooling.
- [ ] Define initial Drizzle schema:
  - NextAuth tables: `users`, `accounts`, `sessions`, `verificationTokens`.
  - Profile tables: `user_profiles` (capturing `background_segment` and `target_roles`).
- [ ] Setup and test migration workflow (`drizzle-kit push` / `drizzle-kit generate`).

### US-1.3: Authentication with Auth.js (NextAuth v5)
- [ ] Configure Auth.js route handler (`/api/auth/[...nextauth]`) using Drizzle adapter.
- [ ] Setup Google OAuth provider and Email Magic Link (Resend/Zoho SMTP).
- [ ] Build branded login/signup modal and page matching NexusD styling.
- [ ] Verify session persistence across server and client components.

### US-1.4: Contextual Onboarding Flow
- [ ] Middleware / redirect logic routing users with incomplete profiles to `/onboarding`.
- [ ] Step 1 UI: Select background (`fresher`, `career_switcher`, `servicenow_trainee`).
- [ ] Step 2 UI: Select target ServiceNow roles from the official taxonomy:
  - System Administrator
  - Application Developer
  - Technical Consultant / Implementation Specialist
  - Solution Architect
  - Business Analyst
  - Platform Architect
  - Scrum Master / PM
  - Modules: ITSM, ITOM, HRSD, CSM, SecOps, GRC.
- [ ] Save to `user_profiles` table upon completion and redirect to `/dashboard`.

---

## 3. Sprint 1 Definition of Done (DoD) Checks

- [ ] **UI/UX Consistency:** All new components strictly reuse the documented design system; no custom one-off hex colors outside CSS variables.
- [ ] **Performance Check:** Minimal bundle size; no heavy unneeded runtime dependencies; zero cold-start database lag.
- [ ] **Documentation Update:** Update `sprint-01-summary.md` and `DOCS/00-START-HERE.md` upon completion.
