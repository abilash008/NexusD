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
import { useSession } from "next-auth/react";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import {
  PRICING_PLANS,
  COMPETITOR_COMPARISONS,
  PRICING_FAQS,
} from "@/lib/pricing-plans";
import { useEntitlements } from "@/hooks/use-entitlements";

export default function PricingPage() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"general" | "export_pdf" | "unlock_questions">("general");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("all_access");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const { isPro, entitlement, daysRemaining, isCertificationActive } = useEntitlements();

  const isAuthenticated = Boolean(session?.user);

  const isAllAccessActive = Boolean(isAuthenticated && isCertificationActive && entitlement?.planId === "all_access");
  const isPlanActive = (planKey: string) => {
    if (!isAuthenticated || !isCertificationActive) return false;
    if (entitlement?.planId === "all_access") return true;
    if (entitlement?.planId === planKey) return true;
    const certCode = planKey.replace("_pass", "");
    return Boolean(entitlement?.certifications?.includes(certCode));
  };

  const openSubscribe = (planId: string, reason: "general" | "export_pdf" | "unlock_questions" = "general") => {
    setSelectedPlanId(planId);
    setModalReason(reason);
    setModalOpen(true);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const allAccessPlan = PRICING_PLANS.all_access;
  const singleTracks = [
    { key: "csa_pass", plan: PRICING_PLANS.csa_pass, path: "/certifications/csa" },
    { key: "cad_pass", plan: PRICING_PLANS.cad_pass, path: "/certifications/cad" },
    { key: "cis_df_pass", plan: PRICING_PLANS.cis_df_pass, path: "/certifications/cis-df" },
    { key: "cis_itsm_pass", plan: PRICING_PLANS.cis_itsm_pass, path: "/certifications/cis-itsm" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* 1. Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="accent" className="px-3 py-1 text-xs font-semibold">
          Transparent, Fair Indian Pricing • Razorpay Secured
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Invest in Your ServiceNow Career
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Start free with <strong>60 blueprint-aligned practice questions</strong> and real-time timed mock simulations. Upgrade anytime for full question vaults, 3-mode printable PDF packs, and career multi-track passes.
        </p>

        {isAuthenticated && isPro && entitlement && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Your Account is Active: {entitlement.planId === "all_access" ? "All-Access 2-Year Pass" : "Certification Pro Pass"} ({daysRemaining} days left)
          </div>
        )}
      </div>

      {/* 2. Flagship Hero Tier: 2-Year All-Access Pass */}
      <div className="relative rounded-2xl border-2 border-[#0066FF] dark:border-[#38BDF8] bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:from-[#131D31] dark:via-[#0F172A] dark:to-[#172554]/40 p-6 sm:p-8 shadow-xl ring-2 ring-[#0066FF]/10">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#0066FF] text-white text-[11px] font-bold shadow-xs tracking-wide uppercase">
          ⭐ Most Popular • 2 Full Years (730 Days) Access
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {allAccessPlan.name}
                </h2>
                <Badge variant="accent" className="text-[11px] font-semibold">
                  CSA + CAD + CIS-DF + CIS-ITSM
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {allAccessPlan.tagline} Perfect for aspirants aiming to advance from System Administrator to Application Developer and Implementation Specialist over the next two years.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {allAccessPlan.features.slice(0, 6).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <Check className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                  <span className={feat.bold ? "font-semibold text-slate-900 dark:text-white" : ""}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing CTA */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 rounded-xl p-5 sm:p-6 border border-blue-100 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="space-y-1">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#0066FF] dark:text-[#38BDF8] font-mono">
                  ₹{allAccessPlan.priceInr}
                </span>
                <span className="text-xs text-slate-400 line-through">₹{allAccessPlan.originalPriceInr}</span>
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                one-time payment • <strong>2 full years (730 days)</strong> unlimited access
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Just ₹41 / month across 4 complete certifications
              </div>
            </div>

            {isAllAccessActive ? (
              <Button
                disabled
                variant="outline"
                size="lg"
                className="w-full text-xs font-semibold cursor-not-allowed bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 opacity-90 gap-1.5 h-11"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Active All-Access Plan ({daysRemaining}d left)
              </Button>
            ) : (
              <Button
                variant="accent"
                size="lg"
                onClick={() => openSubscribe("all_access", "general")}
                className="w-full text-xs sm:text-sm font-semibold gap-2 shadow-sm cursor-pointer h-11"
              >
                {allAccessPlan.ctaText} <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Instant activation via UPI, RuPay, Cards & NetBanking • 7-day money-back guarantee
            </div>
          </div>
        </div>
      </div>

      {/* 3. Individual Single-Track Passes Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs font-semibold">
            Single-Track Certification Passes
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Target a Specific Certification Track
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Focusing exclusively on one exam? Get 1-year unlimited access to the complete question bank, 3-mode PDF packs, and timed simulations for ₹499.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {singleTracks.map(({ key, plan, path }) => {
            const active = isPlanActive(key);

            return (
              <Card
                key={key}
                className="p-5 sm:p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        1-Year Pass
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                      ₹{plan.priceInr}
                    </span>
                    <span className="text-xs text-slate-400 line-through">₹{plan.originalPriceInr}</span>
                    <span className="text-[11px] text-slate-500">/ 1 yr</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {plan.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className={feat.bold ? "font-semibold text-slate-800 dark:text-slate-200" : ""}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  {active ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full text-xs font-semibold cursor-not-allowed bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 opacity-90 gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Active ({daysRemaining}d left)
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => openSubscribe(key, "unlock_questions")}
                      className="w-full text-xs font-semibold cursor-pointer"
                    >
                      {plan.ctaText}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Free Starter Tier Overview */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131D31]/80 max-w-4xl mx-auto shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-semibold">
              Free Starter Tier
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Try Before You Subscribe
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Every learner gets free access to <strong>60 blueprint-aligned questions per track</strong>, full 90-minute timed mock exams with pause/resume capability, and syllabus guides at zero cost.
            </p>
          </div>

          <Link href="/certifications/csa/practice" className="shrink-0 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-xs dark:border-slate-700">
              Start Free Practice Mode
            </Button>
          </Link>
        </div>
      </Card>

      {/* 3. Competitive Comparison Matrix: NexusD vs Other Providers */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            Architectural Benchmark
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
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
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
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
        initialPlanId={selectedPlanId}
      />
    </div>
  );
}
