"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Award,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntitlements } from "@/hooks/use-entitlements";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { isPro, entitlement, daysRemaining } = useEntitlements();

  const [profile, setProfile] = useState<{
    backgroundSegment?: string;
    targetRoles?: string[];
  }>({});

  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexusd_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }

      const mocks = JSON.parse(localStorage.getItem("nexusd_csa_mock_history") || "[]");
      const practices = JSON.parse(localStorage.getItem("nexusd_csa_practice_history") || "[]");
      const total = mocks.length + practices.length;
      setAttemptsCount(total);

      if (mocks.length > 0) {
        setLatestScore(mocks[0].scorePercentage ?? null);
      } else if (practices.length > 0) {
        setLatestScore(practices[0].scorePercentage ?? null);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const getSegmentLabel = (seg?: string) => {
    switch (seg) {
      case "fresher":
        return "College Fresher Track";
      case "career_switcher":
        return "Career Switcher Track";
      case "servicenow_trainee":
        return "ServiceNow Trainee Fast-Track";
      default:
        return "ServiceNow Practitioner";
    }
  };

  const displayName = session?.user?.name
    ? session.user.name.split(" ")[0]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 dark:from-[#131D31] dark:via-[#0F172A] dark:to-[#131D31] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                {getSegmentLabel(profile.backgroundSegment)}
              </Badge>

              {isPro ? (
                <Badge variant="success" className="gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {entitlement?.planId === "all_access" ? "All-Access Pass" : "CSA Pro Pass"} ({daysRemaining}d left)
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Free Starter Tier
                </Badge>
              )}

              {profile.targetRoles && profile.targetRoles.length > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Targeting: {profile.targetRoles.slice(0, 2).join(", ")}
                  {profile.targetRoles.length > 2 ? ` +${profile.targetRoles.length - 2} more` : ""}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {displayName ? `Welcome back, ${displayName}` : "Ready to Accelerate Your ServiceNow Career"}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">
              Master the Certified System Administrator (CSA) syllabus with Australian & Brazil release questions, full domain breakdowns, and realistic 90-minute timed mock exams.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/certifications/csa/practice">
              <Button variant="accent" size="lg" className="gap-2 shadow-sm whitespace-nowrap cursor-pointer">
                <Zap className="h-4 w-4" /> Start Practice Test
              </Button>
            </Link>
            {!isPro && (
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="whitespace-nowrap border-slate-300 dark:border-slate-700 dark:text-slate-200 cursor-pointer">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Primary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Engine Hub */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent">Certification Engine</Badge>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                CSA Active • CAD & CIS Staging
              </span>
            </div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              ServiceNow Certification Practice Engine
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Complete blueprint coverage: UI & Navigation, Collaboration, Database Admin, Flow Designer, and Scripting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Practice Mode Card */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Practice Mode (Untimed)
                  </span>
                  <Badge variant="success">Free 60 Qs</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instant answer reveal, architectural breakdown, and official product docs links after every question.
                </p>
                <Link href="/certifications/csa/practice" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold dark:border-slate-700 dark:hover:bg-slate-800">
                    Launch Practice Mode
                  </Button>
                </Link>
              </div>

              {/* Timed Mock Card */}
              <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8]">
                    Timed Mock Mode (90 Min)
                  </span>
                  <Clock className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Realistic exam simulation with countdown timer, domain-weighted shuffle, and pass/fail telemetry.
                </p>
                <Link href="/certifications/csa/mock" className="block pt-2">
                  <Button variant="accent" size="sm" className="w-full text-xs font-bold">
                    Start Mock Exam
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
              <span>Domain coverage: 5 Official Examination Blueprints</span>
              <div className="flex items-center gap-4">
                <Link href="/study/csa" className="text-[#0066FF] dark:text-[#38BDF8] hover:underline font-medium">
                  Study Guide →
                </Link>
                <Link href="/study/csa/question-bank" className="text-[#0066FF] dark:text-[#38BDF8] hover:underline font-medium">
                  Full Question Vault →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Readiness Telemetry Widget */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Exam Readiness
              </span>
              <Target className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-white">
              Readiness Gauge
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Calibrated from your practice and mock exam history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 text-center space-y-2">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latestScore !== null ? `${latestScore}%` : "--"}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                  {latestScore !== null ? "(Recent Score)" : "/ 100% Target"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {attemptsCount > 0
                  ? `${attemptsCount} test ${attemptsCount === 1 ? "attempt" : "attempts"} logged on this browser.`
                  : "Take your first practice exam to calibrate your domain readiness score."}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Passing Threshold:</span>
                <span className="font-semibold text-slate-900 dark:text-white">70% Required</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Release Syllabus:</span>
                <span className="font-semibold text-[#0066FF] dark:text-[#38BDF8]">
                  Australia & Brazil (2025/2026)
                </span>
              </div>
            </div>

            <Link href="/dashboard/analytics" className="block pt-2">
              <Button variant="outline" className="w-full text-xs font-semibold dark:border-slate-700 dark:hover:bg-slate-800">
                <TrendingUp className="h-3.5 w-3.5 mr-1 text-[#0066FF] dark:text-[#38BDF8]" />
                View Deep Domain Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
