# ADR 002: Core Stack Selections — ORM, Authentication, and Payment Gateway

**Status:** Accepted / Proposed for Implementation  
**Date:** 2026-10-11  
**Deciders:** Antigravity AI, Founder  
**Context Reference:** Prompt Section 3  

---

## 1. ORM Selection: Drizzle ORM vs. Prisma

### Context
NexusD runs on **Next.js App Router (Vercel Serverless)** connecting to **Neon (Serverless PostgreSQL)**.

### Evaluation
* **Prisma:**
  - *Pros:* Widely used, human-readable schema syntax, intuitive auto-generated client.
  - *Cons:* Relies on an underlying binary query engine (Rust). On serverless environments, this binary introduces cold-start latency ($250\text{--}800\text{ ms}$) and inflates lambda bundle sizes. Prisma Accelerate solves this but introduces an additional paid service layer.
* **Drizzle ORM:**
  - *Pros:* Zero binary dependencies, pure TypeScript, microscopic bundle footprint ($< 35\text{ KB}$), runs directly on `@neondatabase/serverless` using HTTP/WebSocket pooling with sub-millisecond cold starts. Direct SQL-like control ensures zero N+1 query surprises.
  - *Cons:* Slightly steeper learning curve than Prisma schema DSL, but highly standard for modern TS teams.

### Decision
We select **Drizzle ORM** as the primary ORM for NexusD.
*(Note: If the founder has a strong personal preference for Prisma, Prisma 5+ can be used as a fallback, but Drizzle is strongly recommended for serverless performance).*

---

## 2. Authentication Solution: Auth.js (NextAuth v5) vs. Clerk vs. Supabase

### Context
We need authentication (Google OAuth + Email magic link / credentials) with custom onboarding metadata (user background segment and ServiceNow target roles) without high recurring costs.

### Evaluation
* **Clerk:**
  - *Pros:* Excellent pre-built UI and developer experience.
  - *Cons:* Free tier caps at 10,000 Monthly Active Users (MAUs), after which pricing jumps (\$0.02/user + \$25/month). Deep visual customization to match custom navy/blue palettes is restricted by their component isolation.
* **Supabase Auth:**
  - *Pros:* Generous free tier.
  - *Cons:* Requires managing a secondary Supabase project when PostgreSQL is already hosted on Neon.
* **Auth.js (NextAuth v5):**
  - *Pros:* 100% open-source, zero SaaS usage fees, zero user caps forever. Stores user accounts and sessions directly in Neon PostgreSQL via the Drizzle adapter. Enables complete design ownership with shadcn/ui.
  - *Cons:* Requires writing the sign-in/sign-up forms (which we build cleanly with shadcn/ui).

### Decision
We select **Auth.js (NextAuth v5)** with Drizzle Adapter in Neon.

---

## 3. Payment Gateway: Razorpay vs. Stripe (for Indian Market)

### Context
NexusD targets Indian freshers, switchers, and developers with INR pricing (`nexusd.in`), offering low-cost mock test access and mentorship.

### Evaluation
* **Stripe India:**
  - *Pros:* Global reputation and clean developer documentation.
  - *Cons:* RBI regulations make Stripe onboarding very stringent for Indian domestic entities (mandatory IEC import-export codes, complex business verification). Stripe has poor native UPI adoption compared to domestic gateways, and recurring e-mandates often fail for domestic Indian debit cards.
* **Razorpay:**
  - *Pros:* The domestic standard in India. Flawless native UPI support (Google Pay, PhonePe, Paytm, CRED), NetBanking across 50+ domestic banks, and domestic card processing. Extremely straightforward onboarding for Indian founders, with webhooks easily processed by Next.js Route Handlers.
  - *Cons:* Focus is primarily domestic INR (international USD requires activating international payments).

### Decision
We select **Razorpay** as the payment gateway.
