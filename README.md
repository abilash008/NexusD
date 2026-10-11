# NexusD — ServiceNow Certification & Career Enablement Platform

> **2026 Modern Platform Standard** • Aligned to ServiceNow **Australia & Brazil Releases** • Built with Next.js App Router, TypeScript, and Tailwind CSS.

---

## 🚀 Overview

**NexusD** (https://nexusd.in) is an enterprise-grade certification preparation and career acceleration platform purpose-built for the ServiceNow ecosystem. Designed for freshers, career switchers, and implementation consultants, NexusD provides blueprint-aligned practice engines, realistic 90-minute timed mock simulations, domain syllabus blueprints, and a master question bank with 3-mode native PDF export.

---

## 📜 Certification Tracks & Blueprint Standards

Examinations are released in a strict sequence with official ServiceNow examination metrics:

### Core Phase 1 Tracks

| Order | Track Code | Full Certification Title | Questions | Duration | Pass Mark | Free Tier Volume | Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **1** | **CSA** | Certified System Administrator | **60 Qs** | **90 Mins** | **70%** (42 / 60) | **60 Free Questions** | 🟢 Live |
| **2** | **CAD** | Certified Application Developer | **60 Qs** | **90 Mins** | **70%** (42 / 60) | 60 Free on Launch | 🟡 In Authoring |
| **3** | **CIS-DF** | CIS — Data Foundation (CMDB & CSDM) | **75 Qs** | **90 Mins** | **70%** (53 / 75) | Free Tier Included | 🟡 In Authoring |
| **4** | **CIS-ITSM** | CIS — IT Service Management | **75 Qs** | **90 Mins** | **70%** (53 / 75) | Free Tier Included | 🔵 Roadmap |

> **Crucial Exam Standard:**
> - **CSA & CAD:** 60 Questions • 90 Minutes • 70% Passing Standard
> - **All CIS Specialist Exams:** **75 Questions • 90 Minutes • 70% Passing Standard**

### Subsequent Expansion Roadmap
- **CIS-Discovery** (ITOM Discovery — 75 Qs • 90 Mins • 70%)
- **CIS-EM** (Event Management — 75 Qs • 90 Mins • 70%)
- **CIS-HR** (HR Service Delivery — 75 Qs • 90 Mins • 70%)
- **CIS-SAM** (Software Asset Management — 75 Qs • 90 Mins • 70%)
- **CIS-HAM** (Hardware Asset Management — 75 Qs • 90 Mins • 70%)
- **CIS-CSM** (Customer Service Management — 75 Qs • 90 Mins • 70%)
- **CTA** (Certified Technical Architect — Review Board & Case Study)

---

## 🎯 Platform Features & Architecture

### 1. Practice Engine (`/certifications/[track]/practice`)
- **Domain-Weighted Drills:** Practice either domain-by-domain or across all domains simultaneously.
- **Dynamic Client Shuffling:** Questions are shuffled dynamically using Fisher-Yates on every drill attempt and retake while remaining 100% hydration-safe during Server-Side Rendering (SSR).
- **Instant Architectural Feedback:** Real-time answer validation with deep architectural justifications cited against official ServiceNow release conventions.

### 2. Timed Mock Simulator (`/certifications/[track]/mock`)
- **Realistic Exam Feel:** 90-minute strict countdown timer with urgent visual warnings (< 10 mins).
- **Exam Navigator Grid:** Full 60-question jump drawer indicating answered, flagged, and unanswered items.
- **Session Recovery:** Auto-saves time, answers, and flags to `localStorage` to survive accidental page refreshes.
- **Detailed Scorecard:** Displays overall pass/fail status, percentage score, time taken, domain-by-domain mastery bars, and attempt history table.

### 3. Master Question Bank & 3-Mode PDF Exporter (`/study/[track]/question-bank`)
- **In-Browser Interactive Repository:** Filter by domain, search by keyword, filter by question type (single choice vs. multi-select), and toggle architectural explanations.
- **Configurable Pagination:** User-selectable page size (10, 20, 25, 50, or All) with smart ellipsis navigation and Pro Vault lock indicators.
- **3-Mode Native PDF Exporter:**
  - **Mode 1: Exam Paper:** Clean question stem and option checkboxes for test conditions.
  - **Mode 2: Revision Key:** Verified answers marked with `[✓]` for swift memorization.
  - **Mode 3: Master Guide:** Complete study manual with verified answers and detailed architecture rationales.
  - Generates crisp vector PDFs via clean CSS `@media print` rules without third-party watermarks.

### 4. Subscription & Access Control (Free vs. Pro)
- **Free Tier Policy:** 
  - CSA includes **60 free blueprint questions** covering all 5 domain quotas.
  - Free allocation scales with total bank size: 60 questions for large banks (hundreds of questions), 40 or 20 for specialized tracks.
- **Pro Blueprint Vault:**
  - Questions beyond 60 (e.g. 61–85+) are protected behind a cosmic glassy locked card displaying the Domain Tag in the top left and an upgrade CTA.
  - PDF & Print exports require an active subscription.
  - Pricing tiers: **CSA Pro Pass (₹499)** or **All-Access Pass (₹999)**.
  - Features sandbox checkout simulation with persistent `localStorage` unlock for testing.

### 5. UI/UX Design System (2026 Standards)
- **Fluid Sidebar:** Collapsible and pinnable with screen-fitting layout adjustments (`mr-[240px]` on desktop when pinned).
- **Dual-Theme Logos:** Automatically switches between light mode and dark glassy logos (`/nd-logo.png` & `/nexusd-full-logo.png` vs. `/nd-logo-dark.png` & `/nexusd-full-logo-dark.png`).
- **Domain Tag Primacy:** Question cards prioritize domain identification tags in the top-left corner (`<Badge variant="accent">`) without sequential numbering (`CSA-01`).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15+ (App Router, Turbopack)
- **Language:** TypeScript 5+ (Strict typing)
- **Styling:** Tailwind CSS v4 with custom dark mode variables
- **Components:** Radix UI primitives & Lucide React icons
- **State & Storage:** React Context (`SidebarContext`), `localStorage` persistence
- **Database / Auth:** NextAuth.js / Drizzle ORM (Better-SQLite3)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/nexusd/nexusd-platform.git
cd nexusd-platform

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Key File Structure

```
src/
├── app/
│   ├── certifications/
│   │   ├── page.tsx                 # Multi-Exam Catalogue & Roadmap
│   │   └── csa/
│   │       ├── page.tsx             # CSA Certification Hub
│   │       ├── practice/page.tsx    # 60-Question Shuffled Practice Engine
│   │       └── mock/page.tsx        # 90-Min Timed Countdown Simulation
│   ├── study/
│   │   ├── page.tsx                 # Study Blueprints Overview
│   │   └── csa/
│   │       ├── page.tsx             # 5 Domain Syllabus Guides
│   │       └── question-bank/       # Master Bank & 3-Mode PDF Exporter
│   ├── pricing/page.tsx             # Plans, Free Starter & Pro Passes
│   └── layout.tsx                   # Root Layout with ThemeProvider & Sidebar
├── components/
│   ├── layout/                      # Pinned & Collapsible Glassy Sidebar
│   ├── subscription/                # 2026 Cosmic Glassy Subscription Modal
│   ├── theme/                       # Light / Dark / System Toggle
│   └── ui/                          # Button, Card, Badge, Progress
└── data/
    └── csa-questions.ts             # 85+ Blueprint Questions, 60 Free Quotas & Shuffler
```

---

## ⚖️ Legal Disclaimer

NexusD is an independent educational platform. ServiceNow, Now Platform, and associated trademarks are registered trademarks of ServiceNow, Inc. NexusD practice exams and study blueprints are independent revision materials aligned to publicly released ServiceNow exam blueprints (Australia & Brazil releases).

© 2026 NexusD Learning Systems (nexusd.in). All rights reserved.
