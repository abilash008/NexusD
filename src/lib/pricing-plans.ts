export interface PricingPlan {
  id: "csa_pass" | "cad_pass" | "cis_df_pass" | "cis_itsm_pass" | "all_access" | string;
  name: string;
  badge?: string;
  tagline: string;
  priceInr: number;
  originalPriceInr?: number;
  amountPaise: number;
  billingText: string;
  validityYears: number;
  isPopular?: boolean;
  certificationsIncluded: string[];
  features: { text: string; included: boolean; bold?: boolean }[];
  ctaText: string;
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  csa_pass: {
    id: "csa_pass",
    name: "CSA Pro Pass",
    tagline: "Single-track mastery for the ServiceNow Certified System Administrator exam.",
    priceInr: 499,
    originalPriceInr: 999,
    amountPaise: 49900,
    billingText: "one-time payment • 1-year certification access",
    validityYears: 1,
    isPopular: false,
    certificationsIncluded: ["csa"],
    features: [
      { text: "1-Year Access to Complete 85+ Question Vault", included: true, bold: true },
      { text: "3-Mode Printable PDF Exporter (Exam, Key, Master)", included: true, bold: true },
      { text: "Unlimited Shuffled 90-Min Timed Simulations", included: true },
      { text: "Deep Architectural Explanations with Official Docs Links", included: true },
      { text: "Australia & Brazil Release Updates for 365 Days", included: true },
      { text: "Detailed Weakness Telemetry & Readiness Gauge", included: true },
      { text: "CAD & CIS Specialist Tracks", included: false },
    ],
    ctaText: "Get CSA Pro Pass",
  },
  cad_pass: {
    id: "cad_pass",
    name: "CAD Pro Pass",
    tagline: "Scoped application development, scripting, Flow Designer, and REST APIs.",
    priceInr: 499,
    originalPriceInr: 999,
    amountPaise: 49900,
    billingText: "one-time payment • 1-year certification access",
    validityYears: 1,
    isPopular: false,
    certificationsIncluded: ["cad"],
    features: [
      { text: "1-Year Access to Complete CAD Question Vault", included: true, bold: true },
      { text: "3-Mode Printable PDF Exporter (Exam, Key, Master)", included: true, bold: true },
      { text: "Unlimited Shuffled 90-Min Timed Simulations", included: true },
      { text: "Server & Client Scripting Architectural Explanations", included: true },
      { text: "Australia & Brazil Release Standards for 365 Days", included: true },
      { text: "Detailed Weakness Telemetry & Readiness Gauge", included: true },
      { text: "CSA & CIS Specialist Tracks", included: false },
    ],
    ctaText: "Get CAD Pro Pass",
  },
  cis_df_pass: {
    id: "cis_df_pass",
    name: "CIS-Data Foundations Pass",
    tagline: "Enterprise CMDB architecture, CSDM v4.0, Data Manager, and IRE reconciliation rules.",
    priceInr: 499,
    originalPriceInr: 999,
    amountPaise: 49900,
    billingText: "one-time payment • 1-year certification access",
    validityYears: 1,
    isPopular: false,
    certificationsIncluded: ["cis-df"],
    features: [
      { text: "1-Year Access to Complete CIS-DF Question Vault", included: true, bold: true },
      { text: "3-Mode Printable PDF Exporter (Exam, Key, Master)", included: true, bold: true },
      { text: "75-Question / 90-Min Timed CMDB & CSDM Simulations", included: true, bold: true },
      { text: "IRE Reconciliation, Data Manager & CSDM v4.0 Deep Explanations", included: true },
      { text: "Australia & Brazil Release Standards for 365 Days", included: true },
      { text: "Detailed Weakness Telemetry & Readiness Gauge", included: true },
      { text: "Other Specialist Tracks", included: false },
    ],
    ctaText: "Get CIS-DF Pass",
  },
  cis_itsm_pass: {
    id: "cis_itsm_pass",
    name: "CIS-ITSM Specialist Pass",
    tagline: "Enterprise ITIL lifecycle, Incident, Change, Request, Service Catalog & SLAs.",
    priceInr: 499,
    originalPriceInr: 999,
    amountPaise: 49900,
    billingText: "one-time payment • 1-year certification access",
    validityYears: 1,
    isPopular: false,
    certificationsIncluded: ["cis-itsm"],
    features: [
      { text: "1-Year Access to Complete CIS-ITSM Question Vault", included: true, bold: true },
      { text: "3-Mode Printable PDF Exporter (Exam, Key, Master)", included: true, bold: true },
      { text: "60-Question / 90-Min Timed ITSM Simulations", included: true, bold: true },
      { text: "ITIL 4 Alignment & Process Architectural Explanations", included: true },
      { text: "Australia & Brazil Release Standards for 365 Days", included: true },
      { text: "Detailed Weakness Telemetry & Readiness Gauge", included: true },
      { text: "Other Specialist Tracks", included: false },
    ],
    ctaText: "Get CIS-ITSM Pass",
  },
  all_access: {
    id: "all_access",
    name: "All-Access Career Pass",
    badge: "BEST VALUE • 2 YEARS ACCESS",
    tagline: "Unlimited multi-track enablement across Admin, Developer & Implementation tracks.",
    priceInr: 999,
    originalPriceInr: 2999,
    amountPaise: 99900,
    billingText: "one-time payment • 2-year unlimited certification access",
    validityYears: 2,
    isPopular: true,
    certificationsIncluded: ["csa", "cad", "cis-df", "cis-itsm"],
    features: [
      { text: "2-Year Unlimited Access to CSA + CAD + CIS-DF + CIS-ITSM", included: true, bold: true },
      { text: "Unlimited 3-Mode High-Res PDF & Print Exports (All Tracks)", included: true, bold: true },
      { text: "Unlimited 60 & 75-Question Timed Mock Simulations", included: true, bold: true },
      { text: "Full Question Master Vaults Across All 4+ Tracks", included: true },
      { text: "Deep Architectural Explanations & Exam Pitfall Alerts", included: true },
      { text: "Full Student Performance Telemetry & Domain Directives", included: true },
      { text: "Guaranteed Updates for Australia, Brazil & 2026/2027 Releases", included: true, bold: true },
      { text: "Priority Access to Upcoming CIS-Discovery, HR & Security Tracks", included: true },
    ],
    ctaText: "Unlock 2-Year All-Access Pass",
  },
};

export interface CompetitorComparisonRow {
  dimension: string;
  nexusd: string;
  otherProviders: string;
  whyItMatters: string;
}

export const COMPETITOR_COMPARISONS: CompetitorComparisonRow[] = [
  {
    dimension: "Exam Syllabus Sync",
    nexusd: "Strictly aligned with current Australia & Brazil releases (2026 syllabus).",
    otherProviders: "Often contain stale questions from deprecated Utah, Vancouver, or Washington releases.",
    whyItMatters: "Studying deprecated release features leads to immediate exam failure.",
  },
  {
    dimension: "Explanation Depth",
    nexusd: "Exhaustive architectural rationales explaining both correct and incorrect choices.",
    otherProviders: "Brief one-line answers often scraped from forums without technical rationale.",
    whyItMatters: "True platform mastery requires understanding why alternatives are wrong.",
  },
  {
    dimension: "Offline PDF Exports",
    nexusd: "3-Mode printable PDF generator (Clean Paper, Revision Key, Master Guide).",
    otherProviders: "No export capabilities; restricted exclusively to web browser view.",
    whyItMatters: "Print mock exams for distraction-free revision on paper or tablet annotation.",
  },
  {
    dimension: "Payment Gateway",
    nexusd: "Native Indian UPI (GPay, PhonePe, Paytm, QR), RuPay & Cards in INR (₹) with zero markup.",
    otherProviders: "Charges in USD ($) or high international conversion fees with frequent card declines.",
    whyItMatters: "Seamless checkout for Indian freshers, trainees, and career switchers.",
  },
  {
    dimension: "Mock Simulation Fidelity",
    nexusd: "True 60/75-Question 90-minute timed countdown with domain-weighted Fisher-Yates shuffle.",
    otherProviders: "Static non-shuffled lists with no real-time domain weighting or blueprint compliance.",
    whyItMatters: "Recreates exact Webassessor / ServiceNow examination environment.",
  },
  {
    dimension: "Diagnostics & Telemetry",
    nexusd: "Exam Readiness Gauge (<65% Needs Practice, ≥75% Ready) + Domain Weakness Alerts.",
    otherProviders: "Simple percentage score with no actionable learning directives.",
    whyItMatters: "Pinpoints your exact weak domains so you know precisely what to revise.",
  },
  {
    dimension: "Pricing & Transparency",
    nexusd: "₹499 per exam / ₹999 for 2-Year All-Access with zero auto-debits.",
    otherProviders: "Priced high at $39–$79 per exam or monthly recurring subscription traps.",
    whyItMatters: "Over 70% cheaper while delivering higher technical fidelity.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FaqItem[] = [
  {
    question: "What is the validity of the certification subscription?",
    answer:
      "Single-track certification passes (CSA, CAD, CIS-DF, CIS-ITSM) provide 1 full year (365 days) of active access from the date of purchase. The All-Access Career Pass provides 2 full years (730 days) of unlimited access across all current and future ServiceNow certification tracks. All release updates (Australia, Brazil, and subsequent 2026/2027 releases) are automatically included during your validity period.",
  },
  {
    question: "Is this a recurring subscription or a one-time payment?",
    answer:
      "All NexusD certification passes are 100% one-time payments. We never set up recurring monthly charges, surprise renewals, or automatic card debits. After your 1-year (or 2-year All-Access) validity period, your certification pass expires gracefully without surprise billing.",
  },
  {
    question: "Does the validity expiration lock me out of the platform?",
    answer:
      "No. Paid validity applies strictly and exclusively to paid certification content (premium question vaults beyond the free 60 questions, 3-mode printable PDF downloads, and official timed mock simulations). Core platform features—such as your account, progress history, community forums, and domain study blueprints—remain permanently accessible.",
  },
  {
    question: "How does payment work with Razorpay?",
    answer:
      "We process all payments through Razorpay, India's most trusted payment gateway. You can pay securely using any UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards (Visa, MasterCard, RuPay), NetBanking from 50+ banks, or Wallets. All transactions are protected by 256-bit SSL encryption.",
  },
  {
    question: "How quickly is my access unlocked after payment?",
    answer:
      "Activation is instant and automated. The moment your transaction succeeds via Razorpay, our secure webhook activates your user entitlement immediately. You will be redirected to your invoice receipt and can start practicing right away.",
  },
  {
    question: "Can I get an invoice receipt for corporate or employer reimbursement?",
    answer:
      "Yes! Upon payment completion, you are automatically issued a formal, branded tax receipt with unique receipt number, payment transaction ID, timestamp, and line item breakdown. You can view, print, or download it immediately from your account.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We stand 100% behind the quality of our content. If you find that our practice exams do not meet the syllabus standards of the official ServiceNow exam blueprint, contact support@nexusd.in within 7 days of purchase for a full refund.",
  },
];
