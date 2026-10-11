"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  QrCode,
  Shield,
  Loader2,
  FileText,
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
  onSimulateUnlock?: () => void;
  onSubscribed?: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  reason,
  initialReason,
  onSimulateUnlock,
  onSubscribed,
}: SubscriptionModalProps) {
  const router = useRouter();
  const { grantPlan } = useEntitlements();
  const effectiveReason = reason || initialReason || "general";

  const [selectedPlan, setSelectedPlan] = useState<"csa_pass" | "all_access">("all_access");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlanConfig = PRICING_PLANS[selectedPlan];

  // Primary payment initiator (Razorpay Checkout Modal + Sandbox Fallback)
  const handleInitiatePayment = async (mode: "razorpay" | "sandbox" = "razorpay") => {
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

      // If user specifically requested sandbox mode or if order is sandbox-flagged
      if (mode === "sandbox" || order.isSandbox) {
        // Instant sandbox verification
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            paymentId: `pay_sandbox_${Date.now()}`,
            signature: "sig_sandbox_valid",
            planId: selectedPlan,
          }),
        });

        const verifyData = await verifyRes.json();
        const receiptNo = verifyData?.entitlement?.receiptNumber || `INV-${Date.now()}`;

        // Save entitlement locally & trigger callbacks
        grantPlan(selectedPlan, {
          orderId: order.id,
          paymentId: `pay_sandbox_${Date.now()}`,
          receiptNumber: receiptNo,
        });

        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
          if (onSimulateUnlock) onSimulateUnlock();
          if (onSubscribed) onSubscribed();
          onClose();
          router.push(
            `/payment/success?order_id=${order.id}&payment_id=pay_sandbox&plan_id=${selectedPlan}&receipt_no=${receiptNo}`
          );
        }, 1000);
        return;
      }

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
          name: orderData.user?.name || "ServiceNow Practitioner",
          email: orderData.user?.email || "developer@nexusd.in",
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
            NexusD Pro Certification Pass
          </div>

          <h2 className="text-2xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {effectiveReason === "export_pdf"
              ? "Unlock PDF Exporter & Full Question Vault"
              : "Upgrade to NexusD Pro Access"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {effectiveReason === "export_pdf"
              ? "High-fidelity PDF and printable offline sheets are reserved for NexusD Pro members. Subscribe to download complete question papers, answer keys, and architectural explanations."
              : "Get 1-year access to full certification question vaults, 3-mode printable PDF exporters, and Australia & Brazil release syllabus updates."}
          </p>
        </div>

        {/* Error alert if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Plan 1: CSA Specific Pass */}
          <div
            onClick={() => setSelectedPlan("csa_pass")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlan === "csa_pass"
                ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-[#0066FF]"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                CSA Exam Pass
              </span>
              <Badge variant="outline" className="text-[10px] dark:border-slate-700">
                1-Year Pass
              </Badge>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹499 <span className="text-xs font-normal text-slate-400">/ 1 year</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Full 85+ CSA question bank, unlimited PDF downloads & 1-year release updates.
            </p>
          </div>

          {/* Plan 2: All Access Pass (Recommended) */}
          <div
            onClick={() => setSelectedPlan("all_access")}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlan === "all_access"
                ? "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/50 ring-2 ring-[#0066FF]/30"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40"
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-[#0066FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-[#38BDF8]">
                All-Access Pass
              </span>
              <Badge variant="accent" className="text-[10px]">
                All 4 Tracks
              </Badge>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹999 <span className="text-xs font-normal text-slate-400">/ 1 year</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              1-Year access to <strong>CSA, CAD, CIS-DF, and CIS-ITSM</strong> question banks & exports.
            </p>
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
          ) : (
            <div className="space-y-2">
              <Button
                variant="accent"
                size="lg"
                disabled={isProcessing}
                onClick={() => handleInitiatePayment("razorpay")}
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

              {/* Developer Sandbox Instant Preview Button */}
              <button
                type="button"
                onClick={() => handleInitiatePayment("sandbox")}
                disabled={isProcessing}
                className="w-full text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1 flex items-center justify-center gap-1.5 cursor-pointer underline decoration-dotted"
              >
                <Zap className="h-3 w-3 text-amber-500" />
                Instant Test Activation (Sandbox Preview Mode)
              </button>
            </div>
          )}

          {/* Trust badges footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-slate-400" /> 256-Bit SSL Secured
            </span>
            <span>1-Year Certification Validity</span>
            <span>Standard Platform Features Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
