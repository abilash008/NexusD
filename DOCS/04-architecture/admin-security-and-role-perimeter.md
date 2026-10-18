# Confidential Administrator Security & Role Perimeter Architecture

> **System Component:** Platform Administration & CMS Access Control  
> **Target Perimeters:** `/admin`, `/admin/*`, `/admin/login`  
> **Status:** Active & Enforced in Production  
> **Specification Version:** 2026.1.0  

---

## 1. Executive Summary & Security Objectives

The NexusD Administrator Console provides high-privilege operations including:
- Question Bank authoring, key verification, and difficulty calibration.
- Certification track blueprint creation and domain weight governance.
- Student errata disputes and question dispute triage.
- Direct operational telemetry access.

Because these capabilities contain confidential assessment material and system controls, standard student credentials (or unauthenticated sessions) must **never** be permitted to access `/admin` or any of its sub-routes.

### Core Security Objectives
1. **Zero Public Administrator Self-Registration:** There is no registration or sign-up mechanism for administrative accounts in the UI.
2. **Backend-Governed Credentials:** Platform administrator accounts are initialized and governed strictly from backend automation and database seeding.
3. **Dedicated Administrative Gateway (`/admin/login`):** An isolated, high-security entrance detached from regular student authentication.
4. **Candidate Login Lockdown:** Administrative credentials cannot be used to authenticate through the candidate sign-in portal (`/login`).
5. **Bi-Directional Role Quarantine:** Active administrator sessions are strictly locked to the administrative console and quarantined from student/candidate routes (`/`, `/dashboard`, `/profile`, `/certifications/*`, `/study/*`).
6. **Browser History & Back-Button Lockdown:** Pressing the browser's back button inside the administrative console cannot navigate to candidate views (`popstate` interception and Edge Middleware redirection).
7. **Exit Admin Confirmation Modal:** Exiting the admin console requires explicit administrator confirmation via an interactive modal to prevent accidental session termination.
8. **Brand-Aligned Sign-Out Page (`/auth/signout`):** Custom high-fidelity authentication termination screen displaying active identity details and confirm/cancel options.
9. **Defense-in-Depth (Dual-Layer Guard):** Enforcement is executed at both the HTTP/Edge layer (Next.js Middleware) and the React component lifecycle layer (`AdminLayout`).

---

## 2. Multi-Layer Defense Architecture

```mermaid
flowchart TD
    UserReq["Incoming HTTP Request"] --> MW{"Next.js Edge Middleware (src/middleware.ts)"}
    
    MW -- "Admin Session requesting Student Route" --> RedirectAdmin["HTTP 307 Redirect back to /admin"]
    MW -- "Unauthenticated on /admin/* (except login)" --> RedirectLogin["HTTP 307 Redirect to /admin/login?callbackUrl=..."]
    MW -- "Path is /admin/login" --> AllowLogin["Render Admin Gateway (/admin/login)"]
    MW -- "Valid Admin on /admin/*" --> LayoutGate{"Admin Layout Guard (src/app/admin/layout.tsx)"}
    
    LayoutGate -- "Status: Loading" --> Spinner["Show Security Clearance Spinner"]
    LayoutGate -- "Status: Unauthenticated" --> ClientRedirect["Client router.replace(/admin/login)"]
    LayoutGate -- "Role != admin (Student)" --> DeniedScreen["403 Forbidden Screen: Administrator Clearance Required"]
    LayoutGate -- "Role == admin" --> AdminCMS["Render Full Admin CMS Workspace"]
    
    AdminCMS -- "Browser Back Button Pressed" --> PopState["popstate Hook Traps History -> Stays in /admin"]
    AdminCMS -- "Exit Admin Clicked" --> ExitModal["Confirmation Modal -> Confirm Sign Out -> /admin/login"]
```

---

## 3. Detailed Component Specifications

### 3.1 Backend Seeding & Credential Engine (`src/lib/admin-auth.ts`)
- **Authoritative Seeding (`ensureAdminUser()`):** Automatically ensures an administrative user exists in Neon PostgreSQL upon server startup or the first authentication challenge.
- **Bcrypt Hash Security:** Hashes default credentials using bcrypt with 10 salt rounds prior to persistence.
- **Automatic Role Elevation:** If an existing user matches the configured master admin email or username, their role is verified and elevated to `'admin'`.
- **Environment Overrides:**
  - `ADMIN_EMAIL`: Email address for master admin (Default: `admin@nexusd.in`).
  - `ADMIN_USERNAME`: Username for admin login (Default: `admin`).
  - `ADMIN_PASSWORD`: Master administrative password (Default: `AdminNexusD@2026!`).

### 3.2 Public Signup & Login Lockdown (`src/app/signup/actions.ts`, `src/app/login/actions.ts`)
- **Reserved Identifier Shield:** The public registration endpoint intercepts and blocks any attempt to register using reserved administration handles (`admin`, `administrator`, `root`, `superuser`, or `ADMIN_CONFIG.username`).
- **Reserved Email Protection:** Rejects any registration matching `ADMIN_CONFIG.email`.
- **Role Enforcement:** All public student accounts are explicitly hardcoded to `role: "user"`.
- **Candidate Login Filter (`loginWithCredentials`):** When an administrator's email or username is entered into `/login`, the server action blocks submission before NextAuth authorization, returning: *"Administrator accounts cannot sign in through the candidate portal. Please access the dedicated Admin Gateway at /admin/login."*

### 3.3 NextAuth Authorization & Session Expansion (`src/auth.ts`, `src/types/next-auth.d.ts`)
- **Portal Parameter Verification:** In `authorize()`, users with `role: "admin"` are strictly verified against `portal === "admin"`. Attempting to log into an admin account with `portal: "student"` yields `null` (rejection).
- **Google OAuth Admin Filter:** The `signIn` callback inspects OAuth logins; if the Google account matches a master admin address, login is aborted with an error redirect instructing use of the admin gateway.
- **Custom Sign-Out Route:** Configured `pages: { signOut: "/auth/signout" }` to bind all NextAuth termination flows to the custom branded page.
- **JWT & Session Role Injection:** NextAuth callbacks preserve `token.role` and `session.user.role`, enabling type-safe authorization checks across client and server components.

### 3.4 Next.js Edge Middleware Interception (`src/middleware.ts`)
- **Global Route Matcher:** Evaluates all platform requests (excluding static assets and images).
- **Admin Perimeter Protection:** If unauthenticated requests target `/admin/*` (except `/admin/login`), immediately issues a 307 redirect to `/admin/login`.
- **Active Admin Quarantine:** If `token.role === "admin"`, requests targeting student/public routes (`/`, `/dashboard`, `/profile`, `/certifications/*`, etc.) are intercepted and redirected back to `/admin`.
- **API Exemption:** Ensures `/api/*` endpoints and `/auth/signout` remain accessible during active administrative sessions.

### 3.5 Component Layout Guard & History Trap (`src/app/admin/layout.tsx`)
- **Bypass on Login:** If `pathname === "/admin/login"`, renders `{children}` directly without administrative navigation or headers.
- **Browser Back Button Trap:** Registers a `popstate` event listener with `window.history.pushState` on initial load. If the user clicks the browser Back button in an attempt to navigate out of the admin console, the event is trapped and the route is held within `/admin`.
- **Exit Admin Confirmation Modal:** Clicking **Exit Admin** presents an accessible confirmation modal with active account details, warning the administrator of session termination before invoking `signOut({ callbackUrl: "/admin/login" })`.
- **Student Clearance Denial Screen:** If `status === "authenticated"` but `role !== "admin"`, displays a dedicated 403 Forbidden screen:
  - Displays the student's active email.
  - Explains that student accounts cannot access confidential CMS data.
  - Provides a 1-click **Sign In with Administrator Credentials** action.
  - Provides a **Return to Student Dashboard** fallback.
- **Public Chrome Suppression:** The learner sidebar ([`Sidebar.tsx`](file:///c:/NexusD/src/components/layout/sidebar.tsx)), learner footer ([`Footer.tsx`](file:///c:/NexusD/src/components/layout/footer.tsx)), and responsive margin padding ([`LayoutShell.tsx`](file:///c:/NexusD/src/components/layout-shell.tsx)) automatically unmount when navigating on `/admin/*` routes.

### 3.6 Custom Branded Sign-Out Page (`src/app/auth/signout/page.tsx`)
- **Brand System Cohesion:** Dark Navy / Electric Blue aesthetic with the NexusD emblem and status indicator.
- **Identity Clarity:** Renders the active account's name, email, and dynamic role badge (`Administrator` vs `Student Candidate`).
- **Interactive Safeguards:** Includes a prominent "Confirm Sign Out" red action button with loading spinner, alongside a "Cancel & Stay Signed In" button that routes users back to their respective portal (`/admin` for administrators, `router.back()` for candidates).

### 3.7 Dedicated Administrator Gateway (`src/app/admin/login/page.tsx`)
- **Design Philosophy:** Dark, enterprise-grade midnight navy aesthetic with perimeter alert badges and terminal icons.
- **Zero Registration Entry:** Strictly omits any "Sign up", "Create account", or registration navigation.
- **Client-Side Student Interception:** If a user logs into `/admin/login` using valid student credentials, the page immediately calls `signOut()`, rejects entry, and warns that only accounts with administrator clearance can proceed.
- **Audit Disclaimer:** Clearly notifies users that all access attempts, timestamps, and IP addresses are recorded.

---

## 4. Operational Runbook: Administrator Login & Exit

### Logging In as Administrator:
1. Navigate directly to `/admin` in the browser URL.
2. The edge middleware will intercept the request and redirect to:
   ```
   https://nexusd.in/admin/login?callbackUrl=%2Fadmin
   ```
3. Enter administrator credentials:
   - **Identifier:** `admin@nexusd.in` (or `admin`)
   - **Password:** Configured master password (`AdminNexusD@2026!` default)
4. Click **Authenticate Administrator**.
5. The gateway verifies credentials, confirms `role === "admin"`, and redirects into the Administrator Command Center.

### Exiting Administrator Mode:
1. In the top-right header of the Admin CMS, click **Exit Admin**.
2. An interactive confirmation dialog will appear: *"Confirm Administrator Sign Out: Are you sure you want to sign out from the Administrative Console?"*
3. Click **Confirm & Sign Out** (or **Cancel** to stay).
4. The administrative session is terminated, and the user is securely redirected to `/admin/login`.

---

## 5. Security Recommendations for Production Hardening

1. **Environment Secret Management:** Ensure `ADMIN_PASSWORD` and `AUTH_SECRET` are stored securely in cloud secret managers (e.g., AWS Secrets Manager, Vercel Environment Variables) and rotated quarterly.
2. **Two-Factor Authentication (2FA):** Integrate TOTP (Time-based One-Time Password via authenticator apps) as an additional gate on `/admin/login`.
3. **IP Range Restrictions:** For enterprise installations, validate `request.headers.get("x-forwarded-for")` in `src/middleware.ts` against authorized corporate CIDR blocks.
4. **Audit Logging Table:** Persist administrative actions (question creations, answer key edits, report resolutions) into an `audit_logs` PostgreSQL table.
