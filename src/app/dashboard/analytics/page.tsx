"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Award,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Zap,
  History,
  RotateCcw,
  Check,
  ShieldCheck,
  Layers,
  ChevronRight,
  Gauge,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEntitlements } from "@/hooks/use-entitlements";

interface ExamAttempt {
  id: string;
  date: string;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  correctAnswersCount: number;
  totalQuestions: number;
  mode?: string;
  domainScores?: Record<string, { total: number; correct: number }>;
}

interface DomainDef {
  slug: string;
  name: string;
  weight: string;
  weightNum: number;
}

interface CertTrack {
  id: string;
  code: string;
  name: string;
  description: string;
  blueprintRelease: string;
  questionCount: number;
  passingScore: number;
  domains: DomainDef[];
  practiceUrl: string;
  mockUrl: string;
  studyUrl: string;
}

const CERTIFICATION_TRACKS: CertTrack[] = [
  {
    id: "csa",
    code: "CSA",
    name: "Certified System Administrator",
    description: "Core administration, database schema, workflow automation, and UI navigation.",
    blueprintRelease: "Australia & Brazil (2025/2026)",
    questionCount: 85,
    passingScore: 70,
    practiceUrl: "/certifications/csa/practice",
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
    domains: [
      { slug: "db-admin", name: "Database Administration & Schema", weight: "30%", weightNum: 30 },
      { slug: "ui-nav", name: "User Interface & Navigation", weight: "20%", weightNum: 20 },
      { slug: "collaboration", name: "Collaboration & Task Management", weight: "20%", weightNum: 20 },
      { slug: "automation", name: "Self-Service & Process Automation", weight: "20%", weightNum: 20 },
      { slug: "development", name: "Introduction to Development", weight: "10%", weightNum: 10 },
    ],
  },
  {
    id: "cad",
    code: "CAD",
    name: "Certified Application Developer",
    description: "Application data model, custom UI design, server scripting, and integration APIs.",
    blueprintRelease: "Australia & Brazil (2025/2026)",
    questionCount: 75,
    passingScore: 70,
    practiceUrl: "/certifications/csa/practice", // Active track router
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
    domains: [
      { slug: "cad-data-model", name: "Application Data Model & Tables", weight: "28%", weightNum: 28 },
      { slug: "cad-ui-design", name: "User Interface Design & Client Scripting", weight: "22%", weightNum: 22 },
      { slug: "cad-business-logic", name: "Business Rules, Script Includes & Events", weight: "27%", weightNum: 27 },
      { slug: "cad-security", name: "Application Security & Access Control (ACL)", weight: "15%", weightNum: 15 },
      { slug: "cad-integrations", name: "Web Services & Integration Hub", weight: "8%", weightNum: 8 },
    ],
  },
  {
    id: "cis-df",
    code: "CIS-DF",
    name: "CIS — Discovery Specialist",
    description: "Discovery schedules, pattern designer, CMDB identification, and MID server tuning.",
    blueprintRelease: "Australia & Brazil (2025/2026)",
    questionCount: 65,
    passingScore: 70,
    practiceUrl: "/certifications/csa/practice",
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
    domains: [
      { slug: "cis-df-patterns", name: "Discovery Pattern Design & Syntax", weight: "35%", weightNum: 35 },
      { slug: "cis-df-architecture", name: "Architecture, Credentials & MID Servers", weight: "25%", weightNum: 25 },
      { slug: "cis-df-ire", name: "CMDB Identification & Reconciliation (IRE)", weight: "25%", weightNum: 25 },
      { slug: "cis-df-troubleshooting", name: "Troubleshooting, Tuning & Discovery Logs", weight: "15%", weightNum: 15 },
    ],
  },
  {
    id: "cis-itsm",
    code: "CIS-ITSM",
    name: "CIS — IT Service Management",
    description: "Incident, problem, change workflows, service catalog, and CSDM architecture.",
    blueprintRelease: "Australia & Brazil (2025/2026)",
    questionCount: 70,
    passingScore: 70,
    practiceUrl: "/certifications/csa/practice",
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
    domains: [
      { slug: "cis-itsm-incident", name: "Incident Management Architecture & States", weight: "25%", weightNum: 25 },
      { slug: "cis-itsm-change", name: "Change & Release Management Workflows", weight: "25%", weightNum: 25 },
      { slug: "cis-itsm-catalog", name: "Service Catalog & Request Fulfillment", weight: "25%", weightNum: 25 },
      { slug: "cis-itsm-problem", name: "Problem Management & Knowledge Bases", weight: "15%", weightNum: 15 },
      { slug: "cis-itsm-cmdb", name: "Configuration Management & CSDM 4.0 Alignment", weight: "10%", weightNum: 10 },
    ],
  },
];

export default function AnalyticsDashboardPage() {
  const { data: session } = useSession();
  const { isPro, entitlement, daysRemaining, isCertificationActive } = useEntitlements();

  const [selectedCertId, setSelectedCertId] = useState<string>("csa");
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedTrack =
    CERTIFICATION_TRACKS.find((t) => t.id === selectedCertId) || CERTIFICATION_TRACKS[0];

  // Helper to check if user has active subscription for the given certification
  const isSubscribedToTrack = (trackId: string): boolean => {
    if (!session?.user || !isCertificationActive || !entitlement) return false;
    if (entitlement.planId === "all_access") return true;
    if (entitlement.planId === "csa_pass" && trackId === "csa") return true;
    return entitlement.certifications?.includes(trackId) ?? false;
  };

  // Load real telemetry data for the selected track
  useEffect(() => {
    setIsLoading(true);

    const loadData = async () => {
      let loadedAttempts: ExamAttempt[] = [];

      // 1. If signed in, query server API for persistent Neon DB records
      if (session?.user) {
        try {
          const res = await fetch(`/api/exams/attempts?certificationId=${selectedCertId}`);
          const data = await res.json();
          if (data?.success && Array.isArray(data.attempts)) {
            loadedAttempts = data.attempts;
          }
        } catch (err) {
          // Fallback to local storage
        }
      }

      // 2. Also check local storage for browser attempts
      try {
        const storageKey =
          selectedCertId === "csa" ? "nexusd_csa_mock_history" : `nexusd_${selectedCertId}_mock_history`;
        const localMocks = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const practiceKey =
          selectedCertId === "csa" ? "nexusd_csa_practice_history" : `nexusd_${selectedCertId}_practice_history`;
        const localPractices = JSON.parse(localStorage.getItem(practiceKey) || "[]");

        // Merge without duplicates
        const combined = [...loadedAttempts];
        for (const item of [...localMocks, ...localPractices]) {
          if (!combined.some((a) => a.id === item.id)) {
            combined.push({
              id: item.id || `local-${Math.random()}`,
              date: item.date || "Recent",
              scorePercentage: item.scorePercentage ?? 0,
              passed: Boolean(item.passed),
              timeSpentSeconds: item.timeSpentSeconds ?? 0,
              correctAnswersCount: item.correctAnswersCount ?? item.correctCount ?? 0,
              totalQuestions: item.totalQuestions ?? 60,
              mode: item.mode || "practice",
              domainScores: item.domainScores,
            });
          }
        }
        loadedAttempts = combined;
      } catch (e) {
        // Ignore
      }

      setAttempts(loadedAttempts);
      setIsLoading(false);
    };

    loadData();
  }, [selectedCertId, session]);

  // Aggregate real telemetry metrics (No fake numbers!)
  const totalAttempts = attempts.length;
  const mockAttempts = attempts.filter((a) => a.mode === "timed_mock" || a.totalQuestions >= 60);

  const totalQuestionsSolved = attempts.reduce((acc, a) => acc + (a.totalQuestions || 0), 0);
  const totalTimeSpentSeconds = attempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);

  // Compute average pace (seconds per question)
  const averagePace =
    totalQuestionsSolved > 0
      ? Math.round(totalTimeSpentSeconds / totalQuestionsSolved)
      : null;

  // Compute Readiness Score from real attempt history
  let readinessScore: number | null = null;
  if (totalAttempts > 0) {
    const recentScores = attempts.slice(0, 3).map((a) => a.scorePercentage);
    readinessScore = Math.round(
      recentScores.reduce((acc, curr) => acc + curr, 0) / recentScores.length
    );
  }

  // Determine readiness status based strictly on real score
  let readinessBadge: { label: string; variant: "success" | "accent" | "warning"; colorClass: string };
  if (readinessScore !== null) {
    if (readinessScore >= 75) {
      readinessBadge = { label: "Exam Ready (≥75%)", variant: "success", colorClass: "text-emerald-600 dark:text-emerald-400" };
    } else if (readinessScore >= 65) {
      readinessBadge = { label: "Approaching Target (65–74%)", variant: "accent", colorClass: "text-[#0066FF] dark:text-[#38BDF8]" };
    } else {
      readinessBadge = { label: "Needs Practice (<65%)", variant: "warning", colorClass: "text-amber-600 dark:text-amber-400" };
    }
  } else {
    readinessBadge = { label: "Calibration Required", variant: "warning", colorClass: "text-slate-500 dark:text-slate-400" };
  }

  // Calculate domain accuracy strictly from real test attempts
  const domainStats = selectedTrack.domains.map((dom) => {
    let testedCount = 0;
    let correctCount = 0;

    for (const att of attempts) {
      if (att.domainScores && att.domainScores[dom.slug]) {
        testedCount += att.domainScores[dom.slug].total || 0;
        correctCount += att.domainScores[dom.slug].correct || 0;
      }
    }

    const accuracy = testedCount > 0 ? Math.round((correctCount / testedCount) * 100) : null;
    return {
      ...dom,
      testedCount,
      correctCount,
      accuracy,
      isEvaluated: testedCount > 0,
      isPassing: accuracy !== null && accuracy >= 70,
    };
  });

  // Identify weakest evaluated domain, if any
  const evaluatedDomains = domainStats.filter((d) => d.isEvaluated);
  const weakestDomain =
    evaluatedDomains.length > 0
      ? evaluatedDomains.reduce((lowest, curr) =>
          curr.accuracy !== null && (lowest.accuracy === null || curr.accuracy < lowest.accuracy)
            ? curr
            : lowest
        )
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Telemetry Meta */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="px-2.5 py-0.5 text-xs font-semibold">
              Performance Telemetry
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Calibrated to {selectedTrack.passingScore}% Passing Threshold
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ServiceNow Certification Readiness Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
            Select your subscribed or targeted certification below to view domain accuracy, mock velocity, and pacing telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href={selectedTrack.practiceUrl}>
            <Button variant="outline" size="sm" className="gap-2 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer">
              <Zap className="h-4 w-4" /> Practice Drills
            </Button>
          </Link>
          <Link href={selectedTrack.mockUrl}>
            <Button variant="accent" size="sm" className="gap-2 font-bold cursor-pointer">
              <Award className="h-4 w-4" /> 90-Min Timed Mock
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Certification Track Switcher (Select your Exam) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            Select Certification Track for Telemetry:
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {CERTIFICATION_TRACKS.length} Exam Tracks Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CERTIFICATION_TRACKS.map((track) => {
            const isSelected = track.id === selectedCertId;
            const isSubscribed = isSubscribedToTrack(track.id);

            return (
              <div
                key={track.id}
                onClick={() => setSelectedCertId(track.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "border-[#0066FF] dark:border-[#38BDF8] bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-[#0066FF]/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-black tracking-wide text-slate-900 dark:text-white font-mono">
                      {track.code}
                    </span>
                    {isSubscribed ? (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">
                        <Check className="h-2.5 w-2.5 mr-0.5" /> Subscribed
                      </Badge>
                    ) : track.id === "csa" ? (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 dark:border-slate-700 text-slate-500">
                        Free Starter
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 dark:border-slate-700 text-slate-400">
                        Pro Track
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {track.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {track.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{track.domains.length} Blueprint Domains</span>
                  <span className="font-semibold text-[#0066FF] dark:text-[#38BDF8]">
                    {isSelected ? "Active View" : "Click to view →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Real Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Readiness Gauge */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Readiness
            </span>
            <Target className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${readinessBadge.colorClass}`}>
              {readinessScore !== null ? `${readinessScore}%` : "--"}
            </span>
            <Badge variant={readinessBadge.variant} className="text-[10px]">
              {readinessBadge.label}
            </Badge>
          </div>

          <Progress
            value={readinessScore ?? 0}
            indicatorColor={
              readinessScore !== null && readinessScore >= 70
                ? "bg-emerald-500"
                : "bg-blue-600"
            }
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {readinessScore !== null
              ? `Benchmark is ${selectedTrack.passingScore}% passing score.`
              : "Take a practice test or mock exam to calibrate."}
          </p>
        </Card>

        {/* Metric 2: Total Questions Answered */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Questions Solved
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalQuestionsSolved}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Questions</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Across {totalAttempts} recorded session{totalAttempts === 1 ? "" : "s"}
          </p>
        </Card>

        {/* Metric 3: Timed Mocks Completed */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Timed Mocks
            </span>
            <Clock className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {mockAttempts.length}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Completed</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            90-minute timed exam simulations
          </p>
        </Card>

        {/* Metric 4: Average Pace per Question */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Pace
            </span>
            <Gauge className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {averagePace !== null ? `${averagePace}s` : "--"}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ question</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {averagePace !== null
              ? averagePace <= 90
                ? "Optimal velocity (under 90s exam target)"
                : "Pacing slower than 90s exam target"
              : "Calculated from completed tests"}
          </p>
        </Card>
      </div>

      {/* 4. Empty State Notice if zero attempts recorded */}
      {totalAttempts === 0 && (
        <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
              No test attempts logged yet for {selectedTrack.name} ({selectedTrack.code})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
              Complete your first untimed practice drill or 90-minute mock exam to calibrate your domain accuracy, velocity telemetry, and exam readiness scores.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={selectedTrack.practiceUrl}>
              <Button variant="accent" size="sm" className="font-semibold shadow-xs">
                Launch Diagnostic Drill
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 5. Domain Breakdown Table & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Official Domain Breakdown ({selectedTrack.code})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedTrack.blueprintRelease}
            </span>
          </div>

          <div className="space-y-3">
            {domainStats.map((dom, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-4 space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {dom.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Blueprint Weight: {dom.weight} • {dom.testedCount} Questions Tested
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {dom.isEvaluated ? (
                      <Badge
                        variant={dom.isPassing ? "success" : "warning"}
                        className="text-xs font-mono"
                      >
                        {dom.accuracy}% Accuracy
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs dark:border-slate-700 text-slate-400">
                        Pending Evaluation
                      </Badge>
                    )}

                    <Link href={`${selectedTrack.studyUrl}/${dom.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[#0066FF] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        Study Guide →
                      </Button>
                    </Link>
                  </div>
                </div>

                <Progress
                  value={dom.accuracy ?? 0}
                  indicatorColor={
                    dom.accuracy !== null
                      ? dom.accuracy >= 70
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                      : "bg-slate-300 dark:bg-slate-700"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. Contextual Study Directives */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Study Recommendations
          </h2>

          <Card className="border-blue-200/80 dark:border-blue-900/40 bg-blue-50/30 dark:bg-[#131D31] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Sparkles className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
              {weakestDomain
                ? `Priority Focus: ${weakestDomain.name}`
                : "Initial Diagnostic Recommendation"}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {weakestDomain
                ? `Your current accuracy in ${weakestDomain.name} is ${weakestDomain.accuracy}%, which is below the 70% passing line. Review this domain before your next timed mock.`
                : `To pass the ${selectedTrack.name} exam, focus your study on high-weight domains (like Database Administration at 30%) and complete at least three full 90-minute simulations.`}
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-3">
              <div className="font-semibold text-slate-900 dark:text-slate-100">Recommended Steps:</div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300">
                <li>Read the official ServiceNow blueprint study notes</li>
                <li>Complete practice drills with explanations revealed</li>
                <li>Practice under the 90-minute countdown simulation</li>
                <li>Review Australia & Brazil release changes</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link href={selectedTrack.studyUrl}>
                <Button variant="default" size="sm" className="w-full gap-2 text-xs font-semibold cursor-pointer">
                  <BookOpen className="h-4 w-4" /> Open Blueprint Guide
                </Button>
              </Link>
              <Link href={selectedTrack.practiceUrl}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs text-[#0066FF] dark:text-[#38BDF8] border-[#0066FF]/30 dark:border-blue-500/30 cursor-pointer"
                >
                  <Zap className="h-4 w-4" /> Start Practice Questions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 7. Real Attempt History Table */}
      {attempts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#0066FF] dark:text-[#38BDF8]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Exam History & Score Log ({selectedTrack.code})
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {attempts.length} Record{attempts.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Attempt Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Correct Answers</th>
                  <th className="px-4 py-3">Time Spent</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attempts.slice(0, 10).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{att.date}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {att.scorePercentage}%
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">
                      {att.correctAnswersCount} / {att.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">
                      {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={att.passed ? "success" : "destructive"}
                        className="text-[10px] py-0.5 px-2 font-semibold"
                      >
                        {att.passed ? "Passed (≥70%)" : "Failed (<70%)"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={selectedTrack.mockUrl}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#0066FF] dark:text-[#38BDF8]">
                          Retake
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
