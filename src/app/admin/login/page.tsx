"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Terminal,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const { data: session, status } = useSession();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in as admin, redirect to admin console
  React.useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setErrorMsg("Please provide both administrator identifier and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        email: cleanId,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setErrorMsg("Authentication failed. Invalid administrator credentials.");
        setLoading(false);
        return;
      }

      // Fetch the authenticated session to confirm role
      const sessionRes = await fetch("/api/auth/session");
      const currentSession = await sessionRes.json();

      if (!currentSession?.user || currentSession.user.role !== "admin") {
        // Authenticated user is not an administrator (e.g. entered student credentials)
        await signOut({ redirect: false });
        setErrorMsg(
          "Access Denied: The provided credentials belong to a standard student account. Only verified platform administrators can enter this console."
        );
        setLoading(false);
        return;
      }

      setSuccessMsg("Administrator clearance verified. Redirecting to CMS...");
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 700);
    } catch (err: any) {
      console.error("[Admin Login Error]:", err);
      setErrorMsg("An unexpected server error occurred during authorization.");
      setLoading(false);
    }
  };

  const isCurrentStudentUser =
    status === "authenticated" && (session?.user as any)?.role !== "admin";

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-slate-800 bg-[#0B1528] text-white shadow-2xl p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        {/* Top Glow Ambient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-[#38BDF8]" />

        {/* Security Perimeter Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-[#38BDF8] mx-auto shadow-inner">
            <ShieldAlert className="h-7 w-7 text-[#38BDF8]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono font-medium mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              RESTRICTED PERIMETER
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrator Gateway
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Confidential internal console for NexusD question authoring, errata triage, and track management.
            </p>
          </div>
        </div>

        {/* Current Student Logged In Warning (if any) */}
        {isCurrentStudentUser && (
          <div className="mb-5 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="h-4 w-4" />
              Currently signed in as Student:
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
              {session?.user?.email}
            </p>
            <p className="text-[11px] text-slate-300 leading-normal">
              Student accounts do not have permission to view or manage the administration console. Please enter master administrator credentials below to proceed.
            </p>
          </div>
        )}

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl border border-red-500/40 bg-red-500/15 text-xs text-red-200 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-xs text-emerald-200 flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Admin Identifier (Email or Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Terminal className="h-4 w-4" />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@nexusd.in or admin"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Master Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-md transition-all gap-1.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Authenticate Administrator <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </form>

        {/* Security Audit Notice - strictly no signup */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-3">
          <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
            Audit Notice: All login attempts and IP fingerprints are logged. Administrator accounts are provisioned via secure backend automation. Self-registration is strictly disallowed.
          </p>

          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Return to Student Portal
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-white text-xs flex items-center gap-2 font-mono">
            <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Loading Administrator Gateway...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
