# ServiceNow Certification Architecture & Development Guidelines

> Authoritative reference for exam metrics, blueprint distribution, question bank management, and grading engines across NexusD.

---

## 1. Official Exam Metrics Matrix

Every certification track implemented on NexusD must strictly follow official ServiceNow examination metrics:

| Certification Track | Code | Question Count | Time Allowed | Pass Standard | Min Correct | Initial Free Questions |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Certified System Administrator** | `CSA` | **60 Questions** | **90 Minutes** | **70%** | **42 / 60** | **60 Free Questions** |
| **Certified Application Developer** | `CAD` | **60 Questions** | **90 Minutes** | **70%** | **42 / 60** | **60 Free Questions** |
| **CIS — Data Foundation (CMDB & CSDM)** | `CIS-DF` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — IT Service Management** | `CIS-ITSM` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — ITOM Discovery** | `CIS-Discovery` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Event Management** | `CIS-EM` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — HR Service Delivery** | `CIS-HR` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Software Asset Management** | `CIS-SAM` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Hardware Asset Management** | `CIS-HAM` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Customer Service Management** | `CIS-CSM` | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |

### Core Rule:
- **Foundational & Developer Tracks (CSA & CAD):** Fixed at **60 questions in 90 minutes with a 70% passing threshold**.
- **Implementation Specialist Tracks (CIS Series):** Fixed at **75 questions in 90 minutes with a 70% passing threshold**.

---

## 2. Order of Implementation

Certifications are rolled out in a phased order:

1. **CSA** — Complete (Live in production)
2. **CAD** — Next in authoring
3. **CIS-DF (CMDB & CSDM)** — Data Foundation & CSDM v4.0 architecture
4. **CIS-ITSM** — Incident, Problem, Change, Request, Service Catalog, Knowledge, SLA/OLA
5. **Roadmap Tracks:** CIS-Discovery, CIS-EM, CIS-HR, CIS-SAM, CIS-HAM, CIS-CSM, CTA.

---

## 3. Free vs. Pro Allocation Policy

1. **Free Tier Allocation:**
   - Free questions are proportional to the total size of the exam's question repository:
     - Large repositories (hundreds of questions, e.g. CSA): **60 free questions**.
     - Moderate repositories: **40 free questions**.
     - Targeted specialist tracks: **20 free questions**.
   - The free question quota must satisfy official blueprint domain weightings.
2. **Practice & Mock Shuffling:**
   - Free questions are shuffled randomly on every attempt using client-side Fisher-Yates shufflers.
   - Deterministic initial states must always be used for SSR to prevent React hydration mismatches.
3. **Pro Blueprint Vault:**
   - Questions beyond the free allocation are gated behind the Pro Vault.
   - Locked cards display the domain name badge in the top-left, a blurred question stem, and an upgrade prompt.
4. **PDF & Print Exports:**
   - 3-mode printable PDF export (Exam Paper, Revision Key, Master Guide) is a Pro feature gated by the Subscription Modal.
5. **Plan Validity & Certification Pass Policy:**
   - **Single-Track Passes (₹499):** Carry a **1-year validity period (365 days)** from purchase date for single-track mastery (CSA, CAD, CIS-DF, CIS-ITSM).
   - **All-Access Career Pass (₹999):** Carries a **2-year validity period (730 days)** from purchase date, granting unlimited access to all 4+ current and upcoming certification tracks, question master vaults, and 3-mode PDF packs.
   - Core platform capabilities (user accounts, study blueprint guides, community spaces, and performance telemetry) remain free forever.

---

## 4. UI/UX Rules for Question Display

- **No Sequential ID Hardcoding:** Do not display sequential question codes like `CSA-01`, `CSA-02` in cards or review lists.
- **Top-Left Domain Name Tag:** Always render the domain name tag in the top-left corner of every question card:
  ```tsx
  <Badge variant="accent" className="text-xs">
    {question.domain}
  </Badge>
  ```
- **Multi-Select Clarification:** Always specify `Choose X` when a question has `isMultiSelect: true`.
- **Release Version:** Clearly display the release alignment (`Australia & Brazil Releases`).

---

## 5. Mock Exam Access & State Persistence Rules

1. **Authentication Requirement for Mock Simulations:**
   - **Practice Mode:** 100% free and accessible to both guests and signed-in candidates with instant feedback.
   - **Mock Exam Simulations:** Require an authenticated user account (`status === "authenticated"`).
   - **Rationale:** Candidate performance analytics, readiness gauges, domain accuracy tracking, and historical scores are calculated strictly from completed mock exams recorded in Neon DB.
2. **Zero Guest Cache Policy:**
   - Unauthenticated users attempting to access mock exams are presented with an authentication gate.
   - Any guest attempt artifacts (`nexusd_${trackId}_mock_*`, `nexusd_${trackId}_paused_*`) are purged from `localStorage` immediately via `purgeGuestExamStorage(trackId)` upon detecting an unauthenticated state, preventing telemetry pollution.
3. **In-Exam Leave & Universal Navigation Interception:**
   - In Next.js App Router, internal client-side navigation (`<Link>` clicks in the sidebar, header, candidate profile, study guides, brand logo) does not dispatch `popstate`.
   - To prevent accidental loss of progress, a capturing-phase DOM listener (`document.addEventListener("click", handleDocumentClick, true)`) intercepts **all link clicks** across the entire page during an active exam:
     - Navigation is paused (`e.preventDefault()`, `e.stopPropagation()`).
     - Desired destination is recorded in `pendingNavigationUrlRef.current`.
     - Confirmation modal offers:
       - **Option 1: Pause Exam (Save Progress):** Saves remaining countdown time, selected answers, flags, question order, and current index into user-scoped storage (`nexusd_${trackId}_paused_${userId}`), then navigates to the destination.
       - **Option 2: Quit Exam (Without Saving):** Discards the in-progress attempt state completely via `purgeGuestExamStorage(trackId, userId)`, then navigates to the destination.
       - **Option 3: Stay in Exam:** Dismisses modal and continues the active exam without losing time.
4. **Post-Submission Cleanup:**
   - Submitting an exam clears any paused in-progress session and persists the completed score into Neon PostgreSQL (`userExamAttempts` and `userAnswers`).

---

## 6. Practice Mode Question Set & Dual Shuffling Architecture

1. **Consistent Free 60 Questions Set:**
   - For all certification tracks, Practice Mode (`/certifications/[track]/practice`) provides a consistent, dedicated set of 60 free questions (`getFreeTrackQuestions(trackId)`).
   - This set of 60 questions remains the exact same benchmark across all practice drills for the track (never inflated to the extended Pro question bank of 85+).
2. **Fresh Dual-Shuffling on Every Test Attempt:**
   - Whenever a candidate begins, restarts, or retakes a Practice Drill or Mock Simulation:
     - **Question Order Shuffling:** The sequence of questions (1 through 60) is randomized using the Fisher-Yates algorithm.
     - **Option Order Shuffling:** The options array (A, B, C, D) within each question is independently randomized, while preserving question stem, explanations, and option ID correctness mappings.
   - This ensures candidates cannot memorize answer letter positions (e.g., "Option B is always correct") and guarantees a genuine test of comprehension.
3. **Domain Filtering Precision:**
   - Selecting a domain filter (e.g., `User Interface & Navigation` carrying 20%) isolates the questions belonging to that domain strictly from the consistent 60 free question set (e.g., 12 questions for UI & Nav).
   - Domain pills synchronize with the browser query parameter (`?domain=slug`) and display exact question counts (`All Domains (60 Qs)`).

---

## 7. Stratified Domain-Weighted Random Sampling & Dual-Tier Telemetry

1. **The Telemetry Challenge (Synthetic Inflation):**
   - Presenting the exact same 60 questions on repeated mock simulations causes synthetic score inflation due to rote memorization rather than concept mastery.
2. **Stratified Blueprint Assembler Engine (`generateTrackMockExam`):**
   - Given a master question bank (e.g., 250+ questions per track), dynamic mock exams are assembled by sampling domain pools strictly according to official ServiceNow blueprint percentages:
     - *CSA Exam (60 Qs):* UI (12 Qs / 20%), Collaboration (12 Qs / 20%), DB Administration (18 Qs / 30%), Process Automation (12 Qs / 20%), Introduction to Development (6 Qs / 10%).
     - *CAD Exam (60 Qs):* App Design (9 Qs / 15%), Data Model (15 Qs / 25%), Automation Logic (18 Qs / 30%), Scripting & REST (12 Qs / 20%), UI Views (6 Qs / 10%).
     - *CIS-DF Exam (75 Qs):* Discovery & Mid Server (26 Qs / 35%), CMDB & IRE (26 Qs / 35%), Diagnostics (23 Qs / 30%).
3. **Freemium Telemetry Separation:**
   - **Free Tier:** 1 baseline diagnostic exam (fixed 60 set with dual shuffle) to calibrate initial readiness and identify blind spots.
   - **Pro Pass:** Unlimited dynamic mock simulations drawn from the 250+ question pool with adaptive spaced repetition, ensuring telemetry scores truly reflect candidate competence.

---

## 8. Candidate Profile & Credential Suite Architecture

1. **Gamified Profile Completeness (0-100%):**
   - Evaluates Basic Profile & Bio, Academic Qualifications, Professional Experience, Technical Skills Matrix, and Official ServiceNow IDs.
2. **Structured Background Timelines:**
   - **Education:** Degrees, universities, graduation years, CGPA/grades, and relevant coursework.
   - **Experience:** Internships and platform roles with company name, duration, and ServiceNow contributions.
   - **Skills Matrix:** Interactive skill chips with add/remove support.
3. **Dual-Layer Persistence:**
   - Offline-first instant reactivity via `localStorage` (`nexusd_profile`).
   - Authenticated cloud synchronization via `POST /api/user/profile` persisting to Neon PostgreSQL (`user_profiles`).
