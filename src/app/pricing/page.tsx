"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
  HelpCircle,
  Clock,
  BookOpen,
  Award,
  Download,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import {
  PRICING_PLANS,
  COMPETITOR_COMPARISONS,
  PRICING_FAQS,
} from "@/lib/pricing-plans";
import { useEntitlements } from "@/hooks/use-entitlements";

export default function PricingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"general" | "export_pdf" | "unlock_questions">("general");
  const [selectedPlanId, setSelectedPlanId] = useState<"csa_pass" | "all_access">("all_access");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const { isPro, entitlement } = useEntitlements();

  const openSubscribe = (planId: "csa_pass" | "all_access", reason: "general" | "export_pdf" | "unlock_questions" = "general") => {
    setSelectedPlanId(planId);
    setModalReason(reason);
    setModalOpen(true);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-20">
      {/* 1. Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="accent" className="px-3 py-1 text-xs">
          Transparent, Fair Indian Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
          Invest in Your ServiceNow Career
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Start free with <strong>60 blueprint-aligned practice questions</strong> and real-time mock simulations. Upgrade anytime for full question vaults, 3-mode printable PDF packs, and multi-track certification passes.
        </p>

        {isPro && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Your Account is Active: {entitlement?.planId === "all_access" ? "All-Access Pro Pass" : "CSA Pro Pass"}
          </div>
        )}
      </div>

      {/* 2. Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Free Starter */}
        <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Starter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Essential revision for every ServiceNow aspirant.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">₹0</span>
              <span className="text-xs text-slate-500">/ Free forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>60 Free Questions</strong> with instant feedback</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full 90-Min Countdown Mock Simulation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Domain-weighted Fisher-Yates shuffle</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>All 5 Domain Study Blueprints</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                <span>✕ Questions 61+ locked</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                <span>✕ 3-Mode PDF & Print exports locked</span>
              </li>
            </ul>
          </div>

          <Link href="/certifications/csa/practice">
            <Button variant="outline" className="w-full text-xs dark:border-slate-700">
              Start Free Practice Mode
            </Button>
          </Link>
        </Card>

        {/* Tier 2: CSA Pro Pass */}
        <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {PRICING_PLANS.csa_pass.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {PRICING_PLANS.csa_pass.tagline}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                ₹{PRICING_PLANS.csa_pass.priceInr}
              </span>
              <span className="text-xs text-slate-400 line-through">₹{PRICING_PLANS.csa_pass.originalPriceInr}</span>
              <span className="text-xs text-slate-500">{PRICING_PLANS.csa_pass.billingText}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              {PRICING_PLANS.csa_pass.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {feat.included ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-slate-400 text-xs shrink-0">✕</span>
                  )}
                  <span className={feat.included ? (feat.bold ? "font-bold text-slate-900 dark:text-white" : "") : "text-slate-400 dark:text-slate-600"}>
                    {feat.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="default"
            onClick={() => openSubscribe("csa_pass", "unlock_questions")}
            className="w-full text-xs font-semibold cursor-pointer"
          >
            {PRICING_PLANS.csa_pass.ctaText}
          </Button>
        </Card>

        {/* Tier 3: All-Access Pass (Highlighted) */}
        <Card className="relative p-8 border-2 border-[#0066FF] dark:border-[#38BDF8] bg-gradient-to-b from-blue-50/60 to-white dark:from-[#131D31] dark:to-[#0F172A] flex flex-col justify-between space-y-6 shadow-xl ring-2 ring-[#0066FF]/20">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-xs">
            RECOMMENDED FOR ASPIRANTS
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {PRICING_PLANS.all_access.name}
                </h3>
                <Badge variant="accent" className="text-[10px]">
                  All 4 Tracks
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {PRICING_PLANS.all_access.tagline}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#0066FF] dark:text-[#38BDF8] font-mono">
                ₹{PRICING_PLANS.all_access.priceInr}
              </span>
              <span className="text-xs text-slate-400 line-through">₹{PRICING_PLANS.all_access.originalPriceInr}</span>
              <span className="text-xs text-slate-500">{PRICING_PLANS.all_access.billingText}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-blue-200 dark:border-slate-800">
              {PRICING_PLANS.all_access.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8] shrink-0" />
                  <span className={feat.bold ? "font-bold text-slate-900 dark:text-white" : ""}>
                    {feat.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="accent"
            size="lg"
            onClick={() => openSubscribe("all_access", "general")}
            className="w-full text-xs font-bold gap-2 shadow-sm cursor-pointer"
          >
            {PRICING_PLANS.all_access.ctaText} <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      </div>

      {/* 3. Competitive Comparison Matrix: NexusD vs Other Providers */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            Architectural Benchmark
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            How NexusD Outperforms Other Providers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Engineered from scratch to outperform traditional preparation platforms with sub-second speed, syllabus accuracy, and native Indian payment support.
          </p>
        </div>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                <tr>
                  <th className="p-4 w-1/4">Evaluation Dimension</th>
                  <th className="p-4 w-2/5 bg-blue-50/50 dark:bg-blue-950/30 text-[#0066FF] dark:text-[#38BDF8]">
                    NexusD (2026 Platform)
                  </th>
                  <th className="p-4 w-1/3 text-slate-400">Other Providers / Alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {COMPETITOR_COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-900 dark:text-white">{row.dimension}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {row.whyItMatters}
                      </div>
                    </td>
                    <td className="p-4 align-top bg-blue-50/30 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200">
                      <div className="flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                        <span>{row.nexusd}</span>
                      </div>
                    </td>
                    <td className="p-4 align-top text-slate-500 dark:text-slate-400">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{row.otherProviders}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. Interactive FAQ Accordion */}
      <div className="space-y-6 pt-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs">
            Got Questions?
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Everything you need to know about pricing, payment options, and exam coverage.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <Card
                key={idx}
                className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#0066FF] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 5. Trust & Guarantee Banner */}
      <Card className="p-8 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131D31] text-center space-y-4 max-w-3xl mx-auto shadow-xs">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            100% Satisfaction & Exam Syllabus Guarantee
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            All practice questions are strictly authored to mirror the Australia & Brazil 2026 ServiceNow blueprints. If you are not satisfied with the technical depth of our questions, reach out within 7 days for a full refund.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-slate-400" /> UPI, RuPay & NetBanking
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-slate-400" /> Razorpay 256-Bit SSL
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-slate-400" /> Instant Entitlement Activation
          </span>
        </div>
      </Card>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reason={modalReason}
      />
    </div>
  );
}
