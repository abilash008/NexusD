"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Calendar,
  CreditCard,
  Hash,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { getStoredEntitlement } from "@/lib/entitlements";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const orderId = searchParams.get("order_id") || "order_sandbox_csa";
  const paymentId = searchParams.get("payment_id") || "pay_sandbox_csa";
  const planIdParam = (searchParams.get("plan_id") as "csa_pass" | "all_access") || "all_access";
  const receiptNo = searchParams.get("receipt_no") || `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const [stored, setStored] = useState(getStoredEntitlement());

  useEffect(() => {
    setMounted(true);
    setStored(getStoredEntitlement());
  }, []);

  const effectivePlanId = stored?.planId || planIdParam;
  const plan = PRICING_PLANS[effectivePlanId] || PRICING_PLANS.all_access;
  const isAllAccess = effectivePlanId === "all_access";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Success Notification Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-sm animate-in zoom-in duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <Badge variant="accent" className="px-3 py-1 text-xs">
            Payment Verified & Entitlement Active
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Welcome to NexusD Pro!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Your transaction has been confirmed via Razorpay. Full question vaults, 3-mode printable PDF exports, and simulation engines are now unlocked for your account.
          </p>
        </div>
      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0066FF] dark:text-[#38BDF8]">
              <BookOpen className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 dark:text-white">CSA Question Bank Vault</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore all 85+ blueprint-aligned questions with answers, explanations, and generate high-res printable PDFs.
            </p>
          </div>
          <Link href="/study/csa/question-bank">
            <Button variant="default" className="w-full text-xs font-semibold gap-2">
              Launch Unlocked Vault <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Zap className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 dark:text-white">Timed 90-Min Mock Exam</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Test yourself under realistic Webassessor examination conditions with 60 randomized questions and instant diagnostic scoring.
            </p>
          </div>
          <Link href="/certifications/csa/mock">
            <Button variant="outline" className="w-full text-xs font-semibold gap-2 dark:border-slate-700">
              Start Mock Exam <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Official Tax Invoice & Receipt Card */}
      <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-lg space-y-8 print:shadow-none print:border-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-[#0B192C] dark:text-white flex items-center gap-2">
              <span className="text-[#0066FF] dark:text-[#38BDF8]">Nexus</span>D
              <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider ml-1">
                Official Receipt
              </Badge>
            </div>
            <p className="text-xs text-slate-500">ServiceNow Career & Certification Enablement</p>
            <p className="text-[11px] text-slate-400">support@nexusd.in • nexusd.in</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Invoice Reference
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {stored?.receiptNumber || receiptNo}
            </div>
            <div className="text-xs text-slate-500 flex items-center sm:justify-end gap-1">
              <Calendar className="h-3 w-3" /> {currentDate}
            </div>
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" /> Razorpay Order ID
            </span>
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {stored?.orderId || orderId}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Payment Reference
            </span>
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {stored?.paymentId || paymentId}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Gateway Status
            </span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">
              Captured (Success)
            </div>
          </div>
        </div>

        {/* Itemized Invoice Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchased Item Summary
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-center">Validity</th>
                  <th className="p-3.5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3.5 space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isAllAccess
                        ? "CSA, CAD, CIS-DF, CIS-ITSM Complete Question Vaults & PDF Exporters"
                        : "ServiceNow CSA Question Vault, Explanations & 3-Mode PDF Exporters"}
                    </div>
                  </td>
                  <td className="p-3.5 text-center text-slate-600 dark:text-slate-300 font-semibold">
                    1 Year (365 Days)
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{plan.priceInr}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Calculation Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-slate-500 max-w-sm space-y-1">
            <p>
              <strong>Payment Method:</strong> Razorpay Secured (UPI, Netbanking, Cards)
            </p>
            <p className="text-[11px] text-slate-400">
              Validity applies to certification track question vaults & mock exams for 1 year from purchase. Standard platform features remain permanently accessible. Keep this receipt for corporate reimbursement.
            </p>
          </div>

          <div className="space-y-1.5 text-right w-full sm:w-auto">
            <div className="flex justify-between sm:justify-end gap-6 text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono">₹{plan.priceInr}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-slate-600 dark:text-slate-400">
              <span>Taxes (GST):</span>
              <span className="font-mono">₹0.00 (Inclusive)</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 font-bold text-sm text-[#0B192C] dark:text-white border-t border-slate-200 dark:border-slate-800 pt-1.5">
              <span>Total Paid:</span>
              <span className="font-mono text-[#0066FF] dark:text-[#38BDF8]">
                ₹{plan.priceInr}
              </span>
            </div>
          </div>
        </div>

        {/* Print / Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2 text-xs w-full sm:w-auto dark:border-slate-700"
          >
            <Printer className="h-4 w-4" /> Print / Save Invoice PDF
          </Button>
          <Link href="/study/csa/question-bank" className="w-full sm:w-auto">
            <Button variant="accent" size="sm" className="gap-2 text-xs w-full sm:w-auto font-bold">
              Continue to Study Blueprints <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">
          Loading payment confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
