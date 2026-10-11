# Sprint 04 Plan — Razorpay Monetization, Paywall Gates & Invoicing

**Sprint Goal:** Implement native Indian payments via Razorpay (UPI, Netbanking, Cards in INR) with a clear, high-converting pricing page (`/pricing`), secure server-side order generation and signature verification, entitlement gating for premium mock tests, and branded invoice receipt generation.

**Sprint Window:** Weeks 7–8  
**Target Velocity:** 12 Story Points  
**Status:** Planned  
**File Location:** `/DOCS/03-sprints/sprint-04/sprint-04-plan.md`  

---

## 1. Committed User Stories

| Story ID | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **US-6.1** | Pricing Page & Entitlement Matrix UI (`/pricing`) | 3 | Planned |
| **US-6.2** | Razorpay Order Creation API & Checkout Modal (UPI/Cards in INR) | 5 | Planned |
| **US-6.3** | Webhook Verification, Access Gating & Invoice Receipt Generation | 4 | Planned |
| **Total** | **Sprint 04 Commitment** | **12 Points** | -- |

---

## 2. Story Acceptance Criteria & Execution Checklist

### US-6.1: Pricing Page & Entitlement Matrix UI
- [ ] Dedicated pricing page at `/pricing` adhering to the Deep Navy/Electric Blue design system.
- [ ] Tier breakdown:
  - **Free Tier (₹0):** 15-question preview practice, all 5 domain study blueprints, baseline analytics.
  - **Full CSA Mock Pass (₹499 one-time):** 1-Year access to the complete 85+ question vault, Australia & Brazil timed mock exam, detailed analytics, unlimited retakes.
  - **All-Access Certification Bundle (₹999 / ₹1,499):** 1-Year access pass across all certification tracks (CSA + CAD + CIS-DF + CIS-ITSM). Standard platform features remain free.
- [ ] Feature comparison matrix highlighting competitive edge vs. other providers / traditional alternatives (faster UI, Australia & Brazil 2026 alignment, detailed architectural explanations, native Indian UPI).
- [ ] FAQ accordion addressing payment security, validity, refunds, and access activation.

### US-6.2: Razorpay Order Creation API & Checkout Modal
- [ ] API Route `/api/payments/create-order` creating server-side Razorpay orders in INR.
- [ ] Razorpay Checkout modal script integration with pre-filled user details (name, email).
- [ ] Multi-payment support: UPI (Google Pay, PhonePe, Paytm, QR code), Credit/Debit Cards, Netbanking.
- [ ] Development sandbox mode with mock verification fallback when `RAZORPAY_KEY_SECRET` is unconfigured.

### US-6.3: Webhook Verification, Access Gating & Invoice Receipt Generation
- [ ] Webhook / Callback handler at `/api/payments/verify`:
  - Validates HMAC SHA-256 signature using `razorpay_signature`.
  - Records payment transaction in `payments` table and grants entitlement in `user_entitlements`.
- [ ] Access Gating middleware / check on `/certifications/csa/mock` (prompts users to upgrade if free preview completed).
- [ ] Payment Success confirmation modal / receipt page (`/payment/success?order_id=...`).
- [ ] Email receipt dispatcher using Zoho Mail infrastructure (`support@nexusd.in`).

---

## 3. Sprint 04 Definition of Done (DoD) Checks

- [ ] **Security Standards:** Webhook signatures validated via HMAC SHA-256; zero secret keys exposed on client side.
- [ ] **UI/UX Consistency:** Reuses documented design tokens (`#0B192C` Navy, `#0066FF` Electric Blue, Slate neutrals).
- [ ] **Currency & Pricing:** All pricing presented in Indian Rupees (INR ₹) with zero conversion fees.
- [ ] **Offline / Dev Portability:** Graceful mock payment flow when live API keys are not supplied in `.env`.
- [ ] **Build Validation:** Production build compiles with zero errors.
- [ ] **Documentation Update:** Update `sprint-04-summary.md` and `DOCS/00-START-HERE.md` upon completion.
