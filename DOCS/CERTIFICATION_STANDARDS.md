# ServiceNow Certification Architecture & Development Guidelines

> Authoritative reference for exam metrics, blueprint distribution, question bank management, and grading engines across NexusD.

---

## 1. Official Exam Metrics Matrix

Every certification track implemented on NexusD must strictly follow official ServiceNow examination metrics:

| Certification Track | Code | Blueprint Reference | Question Count | Time Allowed | Pass Standard | Min Correct | Initial Free Questions |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Certified System Administrator** | `CSA` | **KB0011554** | **60 Questions** | **90 Minutes** | **70%** | **42 / 60** | **60 Free Questions** |
| **Certified Application Developer** | `CAD` | **KB0011498** | **60 Questions** | **90 Minutes** | **70%** | **42 / 60** | **60 Free Questions** |
| **CIS — Data Foundations (CMDB & CSDM)** | `CIS-DF` | **KB0012913** | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — IT Service Management** | `CIS-ITSM` | **KB0011560** | **60 Questions** | **90 Minutes** | **70%** | **42 / 60** | Proportional Free Tier |
| **CIS — ITOM Discovery** *(Roadmap)* | `CIS-Discovery` | Official ITOM | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Event Management** *(Roadmap)* | `CIS-EM` | Official ITOM | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — HR Service Delivery** *(Roadmap)* | `CIS-HR` | Official HRSD | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Software Asset Management** *(Roadmap)* | `CIS-SAM` | Official SAM | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Hardware Asset Management** *(Roadmap)* | `CIS-HAM` | Official HAM | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |
| **CIS — Customer Service Management** *(Roadmap)* | `CIS-CSM` | Official CSM | **75 Questions** | **90 Minutes** | **70%** | **53 / 75** | Proportional Free Tier |

### Core Blueprint Distinction: CIS-Discovery vs. CIS-Data Foundations (CIS-DF)
> [!IMPORTANT]
> **CIS-Discovery and CIS-DF are completely different certifications covering distinct domains:**
> - **CIS-Discovery (ITOM):** Focused strictly on IT Operations, network scanning, MID Server clustering and sizing, IP schedules, SNMP/SSH/WMI/WinRM credentials, Discovery Pattern Designer, and probe/sensor processing.
> - **CIS-Data Foundations (CIS-DF - KB0012913):** Focused strictly on the Configuration Management Database (CMDB) and Common Service Data Model (CSDM v4.0), Identification & Reconciliation Engine (IRE), CMDB Data Manager policies, CMDB Health Dashboard (Completeness, Correctness, Compliance), and multi-source ingestion governance.

---

## 2. Order of Implementation

Certifications are rolled out in a phased order:

1. **CSA** — Complete (Live in production, 85+ questions, aligned to KB0011554)
2. **CAD** — Complete (Live in production, aligned to KB0011498)
3. **CIS-DF (CMDB & CSDM)** — Complete (Live in production, aligned to KB0012913)
4. **CIS-ITSM** — Complete (Live in production, aligned to KB0011560)
5. **Roadmap Tracks:** CIS-Discovery (ITOM), CIS-EM, CIS-HR, CIS-SAM, CIS-HAM, CIS-CSM, CTA.

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
     - *CSA Exam (60 Qs - KB0011554):* Platform Overview and Navigation (4 Qs / 7%), Instance Configuration (6 Qs / 10%), Configuring Applications for Collaboration (12 Qs / 20%), Self-Service & Automation (12 Qs / 20%), Database Management and Platform Security (18 Qs / 30%), Data Migration and Integration (8 Qs / 13%). Total: 60 questions in 90 minutes.
     - *CAD Exam (60 Qs - KB0011498):* Designing and Creating an Application (12 Qs / 20%), Application User Interface (12 Qs / 20%), Security and Restricting Access (12 Qs / 20%), Application Automation (12 Qs / 20%), Working with External Data (6 Qs / 10%), Managing Applications (6 Qs / 10%). Total: 60 questions in 90 minutes.
     - *CIS-DF Exam (75 Qs - KB0012913):* Govern (26 Qs / 35%), Insight (15 Qs / 20%), Ingest (14 Qs / 19%), Configuration (11 Qs / 15%), CSDM Fundamentals (9 Qs / 11%). Total: 75 questions in 90 minutes.
     - *CIS-ITSM Exam (60 Qs - KB0011560):* Incident Management (15 Qs / 25%), Change Management (15 Qs / 25%), Service Catalog and Request Management (15 Qs / 25%), Problem Management (9 Qs / 15%), Service Portfolio Management (3 Qs / 5%), Configuration Management Database (3 Qs / 5%). Total: 60 questions in 90 minutes.
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

---

## 9. Universal Small-to-Medium Typography Standard

To prevent visual fatigue, maintain page-to-page consistency, and avoid bloated headings, all exam, study, and dashboard components follow a disciplined **Small-to-Medium Typography Standard**:

1. **Page Title (H1):** Strictly `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`.
2. **Section Title (H2):** Strictly `text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white`.
3. **Card / Topic Title (H3):** Strictly `text-base font-semibold text-slate-900 dark:text-white` (or `text-sm sm:text-base`).
4. **Metric Counters / Telemetry:** Strictly `text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white`.
5. **No Bloated Fonts:** `text-5xl`, `text-6xl`, and `text-7xl` are strictly banned across the entire platform, including scorecards and hero banners.
6. **Weight Consistency:** Inconsistent and heavy `font-black` and `font-extrabold` weights are eliminated in favor of `font-bold` for headings and `font-semibold` for cards and actions.
7. **Button Dimensions:** Standardized button heights (`h-10` or `h-11 px-5 text-xs sm:text-sm font-semibold`), removing arbitrary multi-line vertical padding.

---

## 10. Dashboard & Candidate Portfolio Experience (EdTech Benchmark)

1. **Active Track Switcher:**
   - Universal certification selector allowing students to toggle context between CSA, CAD, CIS-DF, and CIS-ITSM seamlessly.
   - Dynamic routing: Launching practice or mock exams routes dynamically to the active track (`/certifications/${activeTrackId}/practice` and `/certifications/${activeTrackId}/mock`), eliminating hardcoded track bias.
2. **Gamified 7-Day Habit Streak Loop:**
   - Tracks weekly drilling activity (Monday through Sunday) to foster consistent exam preparation habits.
3. **Four-Stage Certification Roadmap:**
   - Metro-line storytelling guiding candidates through:
     - Stage 1: Diagnostic Assessment (Free 60-question drill).
     - Stage 2: Knowledge Domain Deep-Dive (Official blueprint notes).
     - Stage 3: Timed 90-Min Exam Simulation (Realistic Webassessor simulation).
     - Stage 4: Mastery & Readiness Review (80%+ consistency threshold and PDF pack export).
4. **Dynamic Landing Page Live Demo:**
   - Rotates questions dynamically from the question repository on each load/interaction rather than serving a static placeholder item.
