"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Download,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  Shield,
  Loader2,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { loadRazorpayScript } from "@/lib/razorpay";
import { useEntitlements } from "@/hooks/use-entitlements";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "export_pdf" | "unlock_questions" | "general";
  initialReason?: "export_pdf" | "unlock_questions" | "general";
  initialPlanId?: string;
  onSimulateUnlock?: () => void;
  onSubscribed?: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  reason,
  initialReason,
  initialPlanId,
  onSimulateUnlock,
  onSubscribed,
}: SubscriptionModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: authStatus } = useSession();
  const { entitlement, daysRemaining, isCertificationActive, grantPlan } = useEntitlements();

  const effectiveReason = reason || initialReason || "general";
  const isAuthenticated = Boolean(session?.user);

  // Check which plans are currently active for this user
  const isAllAccessActive = Boolean(isCertificationActive && entitlement?.planId === "all_access");
  const isPlanActive = (planKey: string) => {
    if (!isCertificationActive) return false;
    if (entitlement?.planId === "all_access") return true;
    if (entitlement?.planId === planKey) return true;
    const certCode = planKey.replace("_pass", "");
    return Boolean(entitlement?.certifications?.includes(certCode));
  };

  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    if (initialPlanId && PRICING_PLANS[initialPlanId]) return initialPlanId;
    return isAllAccessActive ? "all_access" : "all_access";
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize when initialPlanId changes
  React.useEffect(() => {
    if (initialPlanId && PRICING_PLANS[initialPlanId]) {
      setSelectedPlan(initialPlanId);
    }
  }, [initialPlanId]);

  if (!isOpen) return null;

  const currentPlanConfig = PRICING_PLANS[selectedPlan] || PRICING_PLANS.all_access;
  const isCurrentPlanActive = isPlanActive(selectedPlan);

  // Single tracks list
  const singleTrackKeys = ["csa_pass", "cad_pass", "cis_df_pass", "cis_itsm_pass"];

  // Razorpay standard checkout flow
  const handleInitiatePayment = async () => {
    // 1. Must be logged in
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname || "/pricing");
      router.push(`/login?callbackUrl=${returnUrl}`);
      return;
    }

    // 2. Cannot purchase if already active
    if (isCurrentPlanActive) {
      setErrorMessage(
        `You already hold an active pass covering this certification (${daysRemaining} days remaining).`
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Call server-side order creation route
      const createRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const orderData = await createRes.json();
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.error || "Failed to create order on server");
      }

      const order = orderData.order;

      // 2. Load Razorpay Client SDK for live/test checkout
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof (window as any).Razorpay === "undefined") {
        throw new Error("Razorpay checkout SDK failed to load. Please try again.");
      }

      const options = {
        key: orderData.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "NexusD",
        description: currentPlanConfig.name,
        image: "/favicon.ico",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId: selectedPlan,
              }),
            });

            const verifyData = await verifyRes.json();
            const receiptNo = verifyData?.entitlement?.receiptNumber || `INV-${Date.now()}`;

            grantPlan(selectedPlan, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              receiptNumber: receiptNo,
            });

            setIsSuccess(true);
            setTimeout(() => {
              if (onSimulateUnlock) onSimulateUnlock();
              if (onSubscribed) onSubscribed();
              onClose();
              router.push(
                `/payment/success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}&plan_id=${selectedPlan}&receipt_no=${receiptNo}`
              );
            }, 800);
          } catch (err: any) {
            setErrorMessage(err.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user?.name || "ServiceNow Practitioner",
          email: session?.user?.email || "developer@nexusd.in",
        },
        theme: {
          color: "#0066FF",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (failResponse: any) {
        setIsProcessing(false);
        setErrorMessage(
          failResponse?.error?.description || "Payment failed. Please try another method."
        );
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setIsProcessing(false);
      setErrorMessage(err?.message || "Failed to launch payment checkout.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-[#0066FF] dark:text-[#38BDF8]">
            <Sparkles className="h-3.5 w-3.5" />
            NexusD Pro Certification Passes
          </div>

          <h2 className="text-2xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {effectiveReason === "export_pdf"
              ? "Unlock PDF Exporter & Full Question Vault"
              : "Upgrade to NexusD Pro Access"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {effectiveReason === "export_pdf"
              ? "High-fidelity PDF and printable offline sheets are reserved for NexusD Pro members. Subscribe to download complete question papers, answer keys, and architectural explanations."
              : "Get full certification question vaults, 3-mode printable PDF exporters, and 2026 Australia & Brazil release syllabus updates."}
          </p>
        </div>

        {/* Auth status banner if not signed in */}
        {!isAuthenticated && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1 text-left">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Sign In Required to Purchase
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                You must be logged in to your NexusD account to purchase so your certification pass is securely linked to your profile.
              </p>
            </div>
          </div>
        )}

        {/* Active plan banner if user already holds active pass */}
        {isAuthenticated && isCertificationActive && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1 text-left">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Active Certification Subscription ({daysRemaining} Days Left)
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                {isAllAccessActive
                  ? "You have 2-year unlimited access to all 4 certification tracks (CSA, CAD, CIS-DF, CIS-ITSM). No additional purchase is required."
                  : `You have an active pass covering your enrolled certifications. You can upgrade to the 2-Year All-Access Pass below.`}
              </p>
            </div>
          </div>
        )}

        {/* Error alert if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Featured 2-Year All Access Card */}
        <div
          onClick={() => {
            if (!isAllAccessActive) setSelectedPlan("all_access");
          }}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            isAllAccessActive
              ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-80 cursor-not-allowed"
              : selectedPlan === "all_access"
              ? "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/50 ring-2 ring-[#0066FF]/30 cursor-pointer"
              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 cursor-pointer"
          }`}
        >
          {isAllAccessActive ? (
            <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> ACTIVE ({daysRemaining}d)
            </div>
          ) : (
            <div className="absolute -top-2.5 right-3 bg-[#0066FF] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              BEST VALUE • 2 YEARS ACCESS
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-[#38BDF8]">
              All-Access Career Pass
            </span>
            <Badge variant="accent" className="text-[10px]">
              All 4 Tracks
            </Badge>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            ₹999 <span className="text-xs font-normal text-slate-400">/ 2 full years (730 days)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            2-Year unlimited access to CSA, CAD, CIS-DF, and CIS-ITSM question vaults, PDF downloads & mock exams.
          </p>
        </div>

        {/* Individual Track Passes */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Or Choose Single-Track 1-Year Pass (₹499 each):
          </div>
          <div className="grid grid-cols-2 gap-2">
            {singleTrackKeys.map((planKey) => {
              const plan = PRICING_PLANS[planKey];
              const isActive = isPlanActive(planKey);
              const isSelected = selectedPlan === planKey;

              return (
                <div
                  key={planKey}
                  onClick={() => {
                    if (!isActive) setSelectedPlan(planKey);
                  }}
                  className={`p-3 rounded-xl border transition-all relative text-left ${
                    isActive
                      ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-80 cursor-not-allowed"
                      : isSelected
                      ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-[#0066FF] cursor-pointer"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 cursor-pointer"
                  }`}
                >
                  {isActive && (
                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" /> ACTIVE
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    ₹{plan.priceInr} <span className="text-[10px] font-normal text-slate-400">/ 1 yr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature List */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              1-Year Certification Pass Benefits:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">365-Day Access</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full Master Vault (Questions 61+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>3-Mode High-Res PDF Exporter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Shuffled Timed Mock Simulations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Australia & Brazil Release Sync</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {isSuccess ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Pro Access Activated! Redirecting to receipt...
            </div>
          ) : !isAuthenticated ? (
            /* 1. Unauthenticated state: Require login before paying */
            <div className="space-y-2.5">
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  const returnUrl = encodeURIComponent(pathname || "/pricing");
                  router.push(`/login?callbackUrl=${returnUrl}`);
                }}
                className="w-full gap-2 shadow-sm font-bold text-sm cursor-pointer"
              >
                <LogIn className="h-4 w-4" /> Sign In to Proceed to Payment
              </Button>
              <div className="text-center text-xs text-slate-500">
                New to NexusD?{" "}
                <Link
                  href="/signup"
                  onClick={onClose}
                  className="text-[#0066FF] dark:text-[#38BDF8] font-semibold hover:underline"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          ) : isCurrentPlanActive ? (
            /* 2. Active Subscription state: Button is disabled */
            <div className="space-y-2">
              <Button
                disabled
                variant="outline"
                size="lg"
                className="w-full gap-2 font-bold text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 cursor-not-allowed opacity-90"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Subscription Active ({daysRemaining} Days Left)
              </Button>
              <p className="text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                You already hold an active 1-year pass for this certification track. All questions, study blueprints, and PDF exports are fully unlocked.
              </p>
            </div>
          ) : (
            /* 3. Authenticated and eligible to purchase */
            <div className="space-y-2">
              <Button
                variant="accent"
                size="lg"
                disabled={isProcessing}
                onClick={handleInitiatePayment}
                className="w-full gap-2 shadow-sm font-bold text-sm cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Launching Razorpay Secured Checkout...
                  </>
                ) : (
                  <>
                    Pay ₹{currentPlanConfig.priceInr} via Razorpay (UPI / Cards / NetBanking){" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Trust badges footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-slate-400" /> 256-Bit SSL Secured
            </span>
            <span>{selectedPlan === "all_access" ? "2-Year Unlimited Access" : "1-Year Certification Validity"}</span>
            <span>Standard Platform Features Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
