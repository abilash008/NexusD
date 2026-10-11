# ADR 001: Real-Time Community Strategy (Polling vs. Persistent WebSockets)

**Status:** Accepted / Proposed for MVP  
**Date:** 2026-10-11  
**Deciders:** Antigravity AI, Founder  
**Context Reference:** Prompt Section 3, Section 4 (Epic 9)  

---

## 1. Context & Problem Statement

Core Feature Area 9 (ServiceNow Community) requires discussion feeds, comment threads, upvotes/likes, and notification counts. 

Next.js serverless Route Handlers deployed on Vercel operate statelessly and cannot maintain persistent WebSocket connections. We must decide between:
- **Option A:** Serverless Next.js API Route Handlers utilizing optimistic UI updates combined with client-side polling / SWR revalidation.
- **Option B:** A dedicated, persistent Node.js + Express + Socket.io microservice hosted on Render.

---

## 2. Decision Options Considered

### Option A: Serverless Route Handlers with Optimistic UI & SWR / React Query Polling
* **Architecture:** When a user likes a post or submits a comment, the client updates the UI optimistically immediately ($< 50\text{ ms}$). A standard `POST` request is sent to the Next.js Route Handler and written to Neon Postgres. Data revalidation is handled via SWR / React Query on window focus, route transition, or a gentle interval (e.g., 30–60s) for active threads.
* **Cost:** \$0 (included in Vercel & Neon free tier).
* **Complexity:** Minimal; single codebase, unified NextAuth session, zero CORS setup.

### Option B: Standalone Node.js + Socket.io Service on Render
* **Architecture:** A persistent Node.js container runs on Render, maintaining WebSocket connections to connected browsers, broadcasting events over Redis pub/sub or in-memory rooms.
* **Cost:** Free tier initially, but subject to Render’s free tier sleep policy (spins down after 15 minutes of inactivity; wakes up with a 50+ second delay).
* **Complexity:** High; requires maintaining two repositories or a monorepo, cross-domain CORS, shared authentication secret validation, and cold-start mitigations.

---

## 3. Decision

We choose **Option A: Serverless Route Handlers with Optimistic UI and Polling for Phase 1 & 2**.

---

## 4. Rationale & Consequences

1. **UX Fit:** The NexusD Community is a technical Q&A forum and discussion board (similar to Stack Overflow and Reddit), not a fast-paced live gaming chat. Users read, write, and reflect. A 5-second delay in seeing another user's comment is completely acceptable and standard for forums.
2. **Perceived Latency:** With optimistic UI state updates, the author of an action perceives zero latency.
3. **Operational Simplicity for Solo Developer:** Eliminating a secondary containerized service allows the developer to focus on high-value certification questions, exam engine stability, and SEO.
4. **Reliability on Free Tiers:** Free-tier Render instances sleep, causing terrible reconnection lag for users. Vercel serverless functions wake up in $< 200\text{ ms}$.

### Re-evaluation Trigger
If live mentor-student chat or collaborative real-time study rooms are introduced in Phase 2/3, we will evaluate PartyKit, Supabase Realtime, or a dedicated Node service.
