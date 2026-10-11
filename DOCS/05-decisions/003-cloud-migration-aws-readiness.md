# ADR 003: Architecture Strategy for AWS Migration Readiness

**Status:** Accepted / Architectural Standard  
**Date:** 2026-10-11  
**Deciders:** Antigravity AI, Founder  
**Context Reference:** Prompt Section 3, Section 6, Founder Guidance  

---

## 1. Context & Problem Statement

NexusD is initially deploying on free/low-cost serverless infrastructure (**Vercel** for Next.js, **Neon** for PostgreSQL, **Render** for auxiliary services if needed) to validate product-market fit without recurring hosting expenses. 

Once the product is operational and generating traction, the entire platform will migrate to a dedicated, production **Amazon Web Services (AWS)** footprint (EC2 / ECS, RDS PostgreSQL, S3, CloudFront, Route 53).

We must ensure that early engineering choices do not create technical debt or vendor lock-in that would make the AWS migration difficult or require a rewrite.

---

## 2. Decision

We establish an **AWS-Ready Architecture Policy** for all Phase 1 implementation:

1. **Standardized SQL Layer:** All schemas written in Drizzle ORM must stick strictly to vanilla PostgreSQL 16+ data types and relational structures. No Neon-specific or Vercel-proprietary SQL dialects.
2. **Container-Ready Next.js Build:** Configure `output: 'standalone'` in Next.js to enable turnkey Docker packaging for AWS EC2 or ECS Fargate deployment.
3. **Storage Abstraction:** Any binary or file upload logic will be written against standard AWS S3 SDK interfaces (`@aws-sdk/client-s3`), making AWS S3 integration seamless.
4. **Environment Isolation:** All hostnames, database connection strings, and credential secrets reside purely in `.env`, allowing migration by re-pointing environment variables.
5. **Region Alignment:** Target **`ap-south-1` (Mumbai)** as the primary AWS datacenter to provide minimum network latency to users in India.

---

## 3. Consequences

* **Positive:**
  - Zero migration refactoring needed when shifting database or compute to AWS.
  - Development remains 100% free and lean during early validation.
  - Direct path to enterprise-grade AWS reliability, custom domain management, and compliance.
* **Negative / Overhead:**
  - Requires maintaining Docker build configurations alongside standard Vercel deploys (minimal cost, high future payoff).
