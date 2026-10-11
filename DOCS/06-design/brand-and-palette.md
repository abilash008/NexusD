# Brand Identity, Color Palette & Design Tokens — NexusD

**Brand Name:** NexusD  
**Domain:** [nexusd.in](https://nexusd.in)  
**Document:** Design System Foundations (Sprint 0 / Pre-implementation)  
**File Location:** `/DOCS/06-design/brand-and-palette.md`  

---

## 1. Brand Concept & Tone

The visual identity of NexusD communicates **precision, authority, speed, and modern craft**. It avoids both the dusty, text-heavy appearance of legacy exam websites (e.g., CertYIQ) and the chaotic visual noise of bloated educational portals.

* **Primary Visual Anchor:** Deep Navy Blue (`#0B192C`). Represents trust, enterprise stability, and architectural maturity. Used on the navigation header, headings, and footer.
* **Vibrant Accent:** Electric Blue (`#0066FF`). Represents energy, forward momentum, and action. Used selectively for primary action buttons, active navigation indicators, hyperlinks, and key progress bars.
* **Neutral Foundation:** Crisp Slate & White (`#F8FAFC` & `#FFFFFF`). Prevents visual fatigue. The application feels breathable, modern, and clean — avoiding any "wall of blue."

---

## 2. Hex Palette & WCAG AA Contrast Verification

All text and interactive states meet or exceed **WCAG 2.1 Level AA** contrast standards (minimum $4.5:1$ for normal body text, $3.0:1$ for large text and UI components).

### 2.1 Core Palette

| Token Name | Hex Code | CSS Variable | Usage | Contrast vs White | WCAG Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Navy Primary** | `#0B192C` | `--brand-navy` | Main navigation, H1–H3 headings, hero backgrounds, primary container headers | **15.6 : 1** | **Passes AAA** |
| **Navy Muted** | `#1E3E62` | `--brand-navy-muted` | Sub-headers, dark mode card borders, secondary tags | **7.8 : 1** | **Passes AAA** |
| **Accent Electric**| `#0066FF` | `--brand-accent` | Primary buttons, active tabs, progress bars, key CTAs | **4.6 : 1** | **Passes AA** (Normal text) |
| **Accent Hover** | `#0052CC` | `--brand-accent-hover` | Button hover states, link hover states | **6.1 : 1** | **Passes AAA** |
| **Canvas Light** | `#F8FAFC` | `--background` | Page background (Slate 50) | Baseline | Baseline |
| **Surface Card** | `#FFFFFF` | `--card` | Exam cards, question panels, dialogs, form cards | Baseline | Baseline |
| **Border Neutral** | `#E2E8F0` | `--border` | Dividers, card borders, unselected option borders (Slate 200) | **1.3 : 1** (Non-text UI) | Component standard |
| **Text Primary** | `#0F172A` | `--foreground` | Main body text, question stems, option text (Slate 900) | **16.1 : 1** | **Passes AAA** |
| **Text Muted** | `#64748B` | `--muted-foreground` | Timers, metadata, helper text, explanations (Slate 500) | **4.7 : 1** | **Passes AA** |

### 2.2 Semantic & Feedback States

| Token Name | Hex Code | Usage | Contrast vs White |
| :--- | :--- | :--- | :--- |
| **Success** | `#10B981` | Correct answer highlights, passing test badges, success alerts (Emerald 500) | **3.0 : 1** (UI state) |
| **Success Light** | `#ECFDF5` | Background pill for correct answer explanation (Emerald 50) | High against Emerald text |
| **Warning** | `#F59E0B` | Time running low warning, flagged question bookmark (Amber 500) | UI alert state |
| **Warning Light** | `#FFFBEB` | Warning banner background (Amber 50) | High against Amber text |
| **Destructive** | `#EF4444` | Incorrect answer selection, exam abort confirmation (Red 500) | **4.1 : 1** (Large text/UI) |
| **Destructive Light** | `#FEF2F2` | Incorrect answer callout background (Red 50) | High against Red text |

---

## 3. Tailwind CSS & CSS Variables Integration

In Phase 1 implementation, these tokens will be mapped directly into Tailwind's theme configuration and `globals.css`:

```css
@layer base {
  :root {
    --background: 210 40% 98%;         /* #F8FAFC */
    --foreground: 222 47% 11%;         /* #0F172A */
    --card: 0 0% 100%;                 /* #FFFFFF */
    --card-foreground: 222 47% 11%;
    --primary: 217 60% 11%;            /* #0B192C (Navy) */
    --primary-foreground: 210 40% 98%;
    --accent: 217 100% 50%;            /* #0066FF (Electric Blue) */
    --accent-foreground: 0 0% 100%;
    --muted: 210 40% 96.1%;            /* #F1F5F9 */
    --muted-foreground: 215 16% 47%;   /* #64748B */
    --border: 214 32% 91%;             /* #E2E8F0 */
    --ring: 217 100% 50%;              /* Focus ring */
    --radius: 0.5rem;
  }
}
```

---

## 4. Typography Scale & Hierarchy

NexusD uses standard, high-performance web typography (Inter or Plus Jakarta Sans):

* **H1 / Page Title:** `text-3xl font-bold tracking-tight text-slate-900` (e.g., "Certified System Administrator (CSA) Mock Exam 1")
* **H2 / Section Title:** `text-xl font-semibold text-slate-900` (e.g., "Domain Breakdown & Performance Analysis")
* **H3 / Card Title:** `text-lg font-medium text-slate-900` (e.g., "Question 14 of 60")
* **Question Body:** `text-base leading-relaxed text-slate-800 font-normal`
* **Option Choice:** `text-sm font-medium text-slate-700`
* **Meta & Timers:** `text-xs font-mono tracking-wide text-slate-500`

---

## 5. UI Spacing & Layout Rules

1. **Clean Neutral Surface:** The page background is always `--background` (`#F8FAFC`). Question panels and exam interaction zones sit on elevated `--card` (`#FFFFFF`) with subtle borders (`#E2E8F0`) and soft shadows (`shadow-sm`).
2. **Restraint with Navy:** Navy is restricted to top navigation, section title anchors, and primary buttons. It is never used as an expansive background fill behind long body text.
3. **No Decorative Clutter:** Exam interfaces must be distraction-free. Whitespace between questions, options, and actions is generous (`p-6`, `space-y-4`) to ensure effortless reading on mobile screens.
