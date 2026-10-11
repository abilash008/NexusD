# Sprint 04 Summary — Razorpay Monetization, Paywall Gates & Invoicing

**Sprint Window:** Weeks 7–8  
**Committed Velocity:** 12 Story Points  
**Delivered Velocity:** 12 Story Points (100% Completion)  
**Status:** Accepted & Shipped  
**File Location:** `/DOCS/03-sprints/sprint-04/sprint-04-summary.md`  

---

## 1. Executive Summary

Sprint 04 successfully delivered native Indian payment integration via Razorpay (UPI, Netbanking, Cards in INR) alongside an entitlement access gating system and branded printable tax receipts.

The pricing engine at `/pricing` provides complete transparency with zero foreign transaction fees, an 8-point architectural comparison matrix vs. other providers / traditional alternatives, and an interactive FAQ. Server-side order generation and HMAC-SHA256 signature verification protect premium question vaults, while an instant development sandbox bypass allows zero-friction local testing without requiring live banking credentials.

---

## 2. Stories Delivered

| Story ID | Description | Points | Status | Key Artifacts |
| :--- | :--- | :---: | :---: | :--- |
| **US-6.1** | Pricing Page & Entitlement Matrix UI (`/pricing`) | 3 | **Done** | `src/app/pricing/page.tsx`, `src/lib/pricing-plans.ts` |
| **US-6.2** | Razorpay Order API & Checkout Modal (UPI/Cards in INR) | 5 | **Done** | `src/app/api/payments/create-order/route.ts`, `src/components/subscription/subscription-modal.tsx`, `src/lib/razorpay.ts` |
| **US-6.3** | Webhook Verification, Access Gating & Invoice Receipt Generation | 4 | **Done** | `src/app/api/payments/verify/route.ts`, `src/app/api/payments/webhook/route.ts`, `src/app/payment/success/page.tsx`, `src/hooks/use-entitlements.ts` |
| **Total** | **Sprint 04 Velocity** | **12** | **100%** | **7 Core Modules** |

---

## 3. Key Feature Deliverables

### 3.1. Pricing Page & Entitlement Matrix (`/pricing`)
* **3-Tier Structure:**
  1. **Free Starter (₹0):** 60 free questions, full 90-min countdown simulation, shuffled attempts, 5 domain blueprints.
  2. **CSA Pro Pass (₹499 one-time):** 1-Year access (365 days) to the complete 85+ question vault, Australia & Brazil release updates, unlimited 90-min mock simulations, 3-mode printable PDF exporter, detailed explanations.
  3. **All-Access Career Pass (₹999 one-time):** 1-Year access across all certification tracks (CSA + CAD + CIS-DF + CIS-ITSM), 3-mode PDF exports, 75-question CIS simulations, readiness telemetry, priority roadmap access. Note: Standard platform features (accounts, community, baseline study blueprints) remain free without expiration.
* **Architectural Benchmark Matrix vs. Other Providers:**
  - Evaluates Australia & Brazil release alignment, explanation depth, PDF exports, native UPI payments in INR, simulation fidelity, diagnostic readiness gauges, and transparent 1-year pricing.
* **Interactive FAQ Accordion:**
  - Answers key customer questions regarding payment security, 1-year certification validity, immediate entitlement activation, corporate reimbursement invoices, and refund policy.

### 3.2. Razorpay Order Creation & Checkout Modal
* **Server-Side Order API (`/api/payments/create-order`):**
  - Securely creates Razorpay orders in INR with amounts in paise (`49900` or `99900`).
  - Automatically falls back to a sandbox test order when live API keys are absent in `.env`.
* **Checkout Modal (`SubscriptionModal`):**
  - Dynamically loads Razorpay Standard Checkout SDK.
  - Supports native Indian UPI (Google Pay, PhonePe, Paytm, QR code), Credit/Debit Cards, and Netbanking.
  - Features an instant "Sandbox Preview Mode" button for immediate evaluation in development environments.

### 3.3. Webhook & Signature Verification (`/api/payments/verify` & `/api/payments/webhook`)
* **Cryptographic Verification:**
  - Validates HMAC-SHA256 signature using `crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")`.
* **Database Persistence:**
  - Logs transactions in `payments` table and records granted access in `user_entitlements` table.
* **Webhook Handler (`/api/payments/webhook`):**
  - Listens for `payment.captured` and `order.paid` events.

### 3.4. Branded Tax Invoice Receipt (`/payment/success`)
* **Formal Receipt Generation:**
  - Displays Order ID, Razorpay Payment Reference, timestamp, customer name and email, and itemized subtotal/tax calculations.
  - 1-Click "Print / Save Invoice PDF" action using dedicated print stylesheets.
  - Direct CTAs to access the newly unlocked question vaults and simulation engines.

### 3.5. Real-Time Access Gating
* **`useEntitlements` Hook:**
  - Synchronizes entitlement state across browser tabs and components.
  - Immediately unlocks questions 61+ and 3-mode PDF exporters upon payment completion.

---

## 4. Definition of Done (DoD) & Verification

| DoD Criteria | Target | Result | Status |
| :--- | :--- | :--- | :---: |
| Next.js Production Build | 0 errors | **29 routes compiled cleanly** | **Pass** |
| TypeScript Validation | 0 type errors | **Checked clean in 4.3s** | **Pass** |
| Payment Security | HMAC-SHA256 verification | **100% verified with test cases** | **Pass** |
| Currency Standard | Indian Rupees (INR ₹) only | **Compliant across all UI & API tiers** | **Pass** |
| Design Tokens | Deep Navy (`#0B192C`), Electric Blue (`#0066FF`), Slate neutrals | **100% compliant** | **Pass** |
| Offline / Dev Portability | Graceful sandbox mode | **Verified without remote API keys** | **Pass** |
