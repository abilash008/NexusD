# Email Infrastructure & Routing Architecture — NexusD

**Domain:** `nexusd.in`  
**Provider:** Zoho Mail Hosting  
**Status:** Configured on Zoho Mail Admin  
**Document Location:** `/DOCS/04-architecture/email-infrastructure.md`  

---

## 1. Overview

NexusD uses custom domain email addresses under `nexusd.in` hosted via Zoho Mail. These addresses serve distinct transactional, operational, user support, and partnership roles across the platform.

Transactional emails sent by the Next.js backend (e.g., via Resend, AWS SES, or Zoho SMTP) will route from the addresses specified below to maintain high sender reputation and clear separation of concerns.

---

## 2. Address Directory & System Mappings

| Email Address | Mailbox / Group Type | Platform Purpose & Integrated Touchpoints |
| :--- | :--- | :--- |
| **`no-reply@nexusd.in`** | Transactional Distribution List | **System & Automated Notifications:**<br>• Account verification links & magic logins<br>• Password reset requests<br>• Razorpay payment receipts & subscription invoices<br>• Exam completion summaries & pass certificates<br>• Mentorship session booking reminders |
| **`support@nexusd.in`** | Support Distribution List | **User Helpdesk & Billing Inquiries:**<br>• Practice question dispute / errata reports<br>• Payment failure or refund escalations<br>• Account access recovery assistance<br>• Mentorship rescheduling disputes |
| **`contact@nexusd.in`** | General Inbox | **General Contact & Inbound Queries:**<br>• Website `/contact` form submission destination<br>• General user outreach<br>• Press / public inquiries |
| **`hello@nexusd.in`** | Marketing & Welcome | **User Lifecycle & Engagement:**<br>• Post-onboarding welcome email sequence<br>• Feature update announcements & platform newsletters<br>• Community highlights |
| **`info@nexusd.in`** | Informational Group | **Platform Information & Legal:**<br>• Privacy policy / terms of service inquiries<br>• Public informational requests |
| **`admin@nexusd.in`** | Administrative Group | **Platform Operations & Alerts:**<br>• Community post flag / moderation alerts<br>• Critical system error alerts<br>• Employer account verification submissions (Epic 10)<br>• Mentor onboarding application alerts (Epic 5) |
| **`talent-acquisition@nexusd.in`** | Recruiting Group | **Job Board & Hiring Partnerships (Epic 10):**<br>• Employer hiring inquiries<br>• Enterprise recruiting packages<br>• Direct communication with hiring managers posting roles |
| **`hr@nexusd.in`** | Human Resources / Contracting | **Mentor Contracts & Platform Partnerships:**<br>• Mentor contractor agreements & payouts (Epic 5)<br>• Verified mentor document verification (Epic 13)<br>• Internal contractor management |

---

## 3. Implementation Guidelines for Next.js

1. **Transactional Sender:** In `.env.local` / production environment variables:
   ```env
   EMAIL_FROM_TRANSACTIONAL="NexusD <no-reply@nexusd.in>"
   EMAIL_SUPPORT="support@nexusd.in"
   EMAIL_CONTACT="contact@nexusd.in"
   EMAIL_ADMIN="admin@nexusd.in"
   ```
2. **Contact Form Action:** The `/contact` page Server Action will send submitted form payloads directly to `contact@nexusd.in` with reply-to set to the submitting user's email.
3. **Question Reporting Modal:** When a user clicks "Report Question Issue" in the exam engine, the notification routes automatically to `support@nexusd.in` and `admin@nexusd.in` with the question ID and explanation context.
