# ADR 004: Confidential Admin Authentication, Dedicated Perimeter Gateway & Role Separation

**Status:** Accepted  
**Date:** 2026-10-18  
**Deciders:** Technical Lead & System Architecture Team  
**Consulted:** Security, Core Platform Engineering  

---

## 1. Context & Problem Statement

The `/admin` portal on NexusD contains mission-critical capabilities:
- Full question bank CRUD operations with answer keys and architectural justifications.
- Certification track definitions and domain weight parameters.
- Student errata reports and dispute resolutions.
- System metrics and pass/fail telemetry.

Previously, the `/admin` route lacked strict route guarding and role verification, which created two major vulnerabilities:
1. Direct URL navigation to `/admin` allowed unauthenticated visitors or regular student accounts to inspect and interact with administrative tools.
2. There was no distinct separation between candidate registration and administrator provisioning, creating risks of unauthorized self-registration or confusion between student accounts and administrative identities.

A secure, confidential authentication perimeter was needed to guarantee that administrative access is strictly restricted to authorized platform personnel.

---

## 2. Decision Drivers

- **Assessment Confidentiality:** Certification questions, correct option keys, and dispute triages must remain confidential to protect the integrity of timed mock exams.
- **Strict Role Separation:** Student accounts must never be allowed to access administrative capabilities.
- **Zero Self-Registration for Admins:** Administrative credentials must be managed strictly in the backend; the UI must never expose a public admin registration form.
- **Instant URL Challenge:** Any browser entry of `/admin` or `/admin/*` must immediately prompt for credentials.
- **Defense in Depth:** Both edge/HTTP-level interception and React client/server component lifecycle checks must be enforced.

---

## 3. Considered Options

1. **Option 1 (Basic Role Check in Layout only):** Only verify `useSession()` in `AdminLayout`.
   - *Drawback:* Initial HTML and client bundles for admin routes could still be delivered before client execution, leading to potential flash of content or bundle leaks.
2. **Option 2 (Single Shared Login Page with Role Redirects):** Use the public `/login` page and redirect admins to `/admin` upon sign-in.
   - *Drawback:* Blurs the perimeter between students and administrators. Students entering `/admin` would be redirected to the consumer login page with public "Sign up" links, violating the requirement for confidential handling and separate credentials.
3. **Option 3 (Multi-Tiered Perimeter Guard with Dedicated Gateway — SELECTED):**
   - **Dedicated Admin Gateway (`/admin/login`):** An isolated, high-security login terminal without any sign-up link.
   - **Backend-Provisioned Credentials (`src/lib/admin-auth.ts`):** Automated database seeding in PostgreSQL with bcrypt hashing and `role: "admin"`.
   - **Edge Middleware Proxy (`src/middleware.ts`):** Edge-level token verification intercepting all `/admin/:path*` requests before page render.
   - **Component Layout Guard (`src/app/admin/layout.tsx`):** 403 Forbidden clearance barrier intercepting student sessions.
   - **Public Signup Hardening (`src/app/signup/actions.ts`):** Strict block on reserved administrative usernames and emails.

---

## 4. Decision Outcome

**Option 3 was chosen and implemented.**

### Architecture Specification:
1. **Provisioning:** Administrator credentials are initialized via backend automation (`ensureAdminUser()`) storing hashed credentials in PostgreSQL.
2. **Gateway:** Built `/admin/login`, featuring an enterprise dark-theme security perimeter without sign-up forms.
3. **Route Guarding:** Implemented `src/middleware.ts` to inspect NextAuth JWT tokens on all `/admin/:path*` routes and enforce immediate redirection for unauthorized visitors.
4. **Student Handling:** If an active student session accesses `/admin`, `AdminLayout` presents a 403 Forbidden screen informing them of their student status with options to sign in as admin or return to `/dashboard`.
5. **UI Isolation:** Public sidebar, footer, and shell padding automatically detach on admin routes to prevent layout interference.

---

## 5. Consequences & Trade-offs

### Positive Consequences:
- **Zero Data Leakage:** Unauthorized users and students cannot view or interact with administrative CMS screens.
- **No Self-Registration Vulnerability:** Public registration cannot spoof or create admin accounts.
- **Seamless Developer Experience:** Admin credentials can be configured via standard environment variables (`ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- **Clean Audit Trail:** Clear separation between student examination activity and administrative CMS authoring.

### Negative / Operational Consequences:
- Platform administrators who also study on the platform must maintain two separate sessions (or sign out of one before using the other).
- Password rotation for administrators requires updating environment variables or running database update scripts.
