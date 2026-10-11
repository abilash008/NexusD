# Cloud Infrastructure & AWS Migration Strategy — NexusD

**File Location:** `/DOCS/04-architecture/cloud-infrastructure-and-migration.md`  
**Status:** Baselined Architecture Policy  
**Date:** 2026-10-11  

---

## 1. Two-Phase Hosting Blueprint

NexusD adopts a deliberate two-stage infrastructure model to ensure **zero upfront hosting expenses during validation**, while maintaining **strict code and database portability for enterprise deployment on Amazon Web Services (AWS)**.

```
┌──────────────────────────────────────────────┐
│       PHASE 1: Zero-Cost Validation          │
│ • Frontend & API: Vercel (Next.js Serverless)│
│ • Database: Neon (Serverless PostgreSQL)     │
│ • Email: Zoho Mail Hosting                   │
│ • Storage / Local assets: Public / Ephemeral │
└──────────────────────┬───────────────────────┘
                       │ Post-Validation Scale
                       ▼
┌──────────────────────────────────────────────┐
│       PHASE 2: Enterprise AWS Migration      │
│ • Compute: AWS EC2 / ECS Fargate (Dockerized)│
│ • Database: AWS RDS PostgreSQL / Aurora      │
│ • Object Storage: AWS S3 + CloudFront CDN    │
│ • DNS & Domain: AWS Route 53 (nexusd.in)     │
│ • Email Routing: AWS SES / Zoho SMTP         │
└──────────────────────────────────────────────┘
```

---

## 2. Architecture Principles for Seamless AWS Migration

To ensure migration to AWS requires zero code rewrites, all development from Sprint 1 onward must obey these 5 guardrails:

### 1. Database Portability (Neon $\rightarrow$ AWS RDS)
* **Standard PostgreSQL SQL:** Drizzle ORM schema must use standard PostgreSQL types (`serial`, `uuid`, `text`, `timestamp with time zone`, `jsonb`, `integer`).
* **Zero Proprietary Extensions:** Do not depend on Neon-specific extensions. Migrations managed via `drizzle-kit` will run identically against AWS RDS PostgreSQL with a simple change of `DATABASE_URL`.
* **Connection Pooling:** We use connection pooling abstractions so switching between serverless HTTP poolers (Neon) and persistent poolers (AWS RDS Proxy / PgBouncer) is a configuration switch.

### 2. Standalone Containerization (Vercel $\rightarrow$ AWS EC2 / ECS)
* Next.js configuration will include `output: 'standalone'` in `next.config.js`.
* Maintain a root multi-stage `Dockerfile` in the repository.
* The application can build and run both as serverless lambda functions on Vercel and as a lightweight Alpine container on an EC2 instance or ECS cluster.

### 3. S3-Compatible File & Object Storage Adapter
* Whenever file uploads are introduced (e.g., user avatars, resumes in Epic 10/11, certification documents), store files using an **S3-compatible client interface** (`@aws-sdk/client-s3`).
* In Phase 1 local development or testing, pre-signed URLs or local storage can be utilized; in Phase 2, this directly targets private AWS S3 buckets with CloudFront CDN distribution.

### 4. 100% Environment-Variable Driven Configuration
* Never hardcode platform URLs, cloud service endpoints, or provider credentials.
* Secrets and endpoints are strictly injected via `.env`:
  ```env
  DATABASE_URL="postgresql://..."
  NEXTAUTH_URL="https://nexusd.in"
  NEXTAUTH_SECRET="..."
  AWS_REGION="ap-south-1"             # AWS Mumbai region for lowest Indian latency
  AWS_S3_BUCKET="nexusd-media-prod"
  RAZORPAY_KEY_ID="..."
  RAZORPAY_KEY_SECRET="..."
  ```

### 5. Network Latency & Geo-Location Optimization
* Target AWS Region: **`ap-south-1` (Mumbai)**.
* Both Neon's database region during Phase 1 and the AWS RDS / EC2 instances during Phase 2 will be pinned to Mumbai/India to ensure single-digit millisecond latency for Indian learners.
