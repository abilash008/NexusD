"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LogOut,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NexusLogo } from "@/components/brand/nexus-logo";

export default function SignOutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAdmin = (session?.user as any)?.role === "admin";
  const userEmail = session?.user?.email || "candidate@nexusd.in";
  const userName = session?.user?.name || (isAdmin ? "Platform Administrator" : "ServiceNow Candidate");

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("[SignOut Error]:", err);
      setIsSigningOut(false);
    }
  };

  const handleCancel = () => {
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.back();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-block bg-white/90 dark:bg-transparent rounded-xl p-2 shadow-2xs hover:opacity-90 transition-opacity"
            >
              <NexusLogo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign Out of NexusD
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Confirm termination of your active platform authentication session.
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-lg transition-colors">
          <CardHeader className="space-y-2 pb-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center mx-auto">
              <LogOut className="h-6 w-6 stroke-[2.2]" />
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-white">
              Are you sure you want to sign out?
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Your in-progress exam states and telemetry are securely saved to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Active Account Identity Card */}
            {status === "authenticated" && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1524] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Active Account
                  </span>
                  {isAdmin ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      Administrator
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Student Candidate
                    </Badge>
                  )}
                </div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  {userEmail}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Button
                type="button"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Confirm Sign Out</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isSigningOut}
                onClick={handleCancel}
                className="w-full h-11 text-xs sm:text-sm font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Cancel & Stay Signed In</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
