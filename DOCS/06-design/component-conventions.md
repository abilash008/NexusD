# Component System Conventions & Design Tokens — NexusD

**File Location:** `/DOCS/06-design/component-conventions.md`  
**Status:** Canonical Design Reference  
**Last Updated:** Sprint 1  

---

## 1. Design Principles & Anti-Patterns

1. **Strict Token Adherence:** Never use arbitrary Tailwind hex classes (e.g., `text-[#123456]`, `bg-[#0a192f]`). All colors must map to CSS variables `--primary`, `--accent`, `--card`, `--background`, `--muted-foreground`, etc.
2. **Purposeful Navy:** Navy (`#0B192C` / `--primary`) is reserved for top navigation, primary action buttons, dark hero headers, and footers. Never use navy as a massive background canvas for content areas.
3. **High-Contrast Typography:** Body text must maintain WCAG AA contrast. Question stems, options, and explanations must be crisp on neutral surfaces.
4. **No One-Off Styled Components:** Every card, button, modal, badge, and input must use the reusable primitives located in `@/components/ui/`.

---

## 2. Spacing & Container Hierarchy

* **Page Shell Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
* **Article / Exam Content Container:** `max-w-4xl mx-auto px-4 sm:px-6`
* **Card Padding:**
  - Standard card: `p-6` (24px)
  - Compact / List item: `p-4` (16px)
  - Question container: `p-6 md:p-8 space-y-6`
* **Vertical Section Rhythm:**
  - Major page sections: `py-12 md:py-16`
  - Form fields: `space-y-4`
  - Question options list: `space-y-3`

---

## 3. Typography Scale & Tailwind Classes

| Level | Tailwind Classes | Usage |
| :--- | :--- | :--- |
| **Display H1** | `text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900` | Landing hero, major certification headings |
| **Section H2** | `text-2xl font-bold tracking-tight text-slate-900` | Exam modes, analytics sections, blueprint modules |
| **Card H3** | `text-lg font-semibold text-slate-900` | Question numbers, card headers, metric titles |
| **Body (Normal)** | `text-base text-slate-700 leading-relaxed` | Question text, study guide paragraphs |
| **Body (Small)** | `text-sm text-slate-600` | Helper text, option choices, metadata |
| **Caption / Monospace** | `text-xs font-mono text-slate-500 tracking-wide` | Timers, question ID counters, question domain tags |

---

## 4. Button Variants & Semantic Usage

NexusD standardizes on the following button variants:

```tsx
// 1. Primary Action (CTA) — Dominant Navy
<Button variant="default">Start Practice Exam</Button>
// Styles: bg-primary text-primary-foreground hover:bg-primary/90 (Navy)

// 2. High-Energy / Conversion CTA — Electric Accent Blue
<Button variant="accent">Unlock Full Mock Pass</Button>
// Styles: bg-blue-600 text-white hover:bg-blue-700 shadow-sm

// 3. Secondary Navigation / Tooling
<Button variant="outline">Flag Question</Button>
// Styles: border border-slate-200 bg-white hover:bg-slate-50 text-slate-700

// 4. Ghost / Tertiary
<Button variant="ghost">Next Question →</Button>
// Styles: hover:bg-slate-100 text-slate-700

// 5. Destructive
<Button variant="destructive">Abandon Exam</Button>
// Styles: bg-red-600 text-white hover:bg-red-700
```

---

## 5. Exam Option & Question Card Conventions

The certification practice experience must follow consistent interaction states across all practice modes:

* **Default / Unselected Option:**
  `border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-800 transition-all cursor-pointer rounded-lg p-4`
* **Selected (Pending Submit):**
  `border-2 border-blue-600 bg-blue-50/50 text-blue-950 font-medium rounded-lg p-4 shadow-sm`
* **Correct Answer (Review Mode):**
  `border-2 border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium rounded-lg p-4`
* **Incorrect User Answer (Review Mode):**
  `border-2 border-red-500 bg-red-50/70 text-red-950 rounded-lg p-4`

---

## 6. Form Fields & Modals

* **Input Fields:** `h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`
* **Labels:** `text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`
* **Dialog Modals:** Centered with dark backdrop overlay (`bg-black/40 backdrop-blur-sm`), clean white card container (`bg-white rounded-xl shadow-xl border border-slate-100 p-6`).
