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
5. **1-Year Validity Policy:**
   - Pro certification passes (question vaults, full mock simulators, and PDF exports) carry a **1-year validity period (365 days)** from purchase date.
   - Core platform capabilities (user accounts, study blueprint guides, community spaces, and performance telemetry) remain free and do not expire.

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
