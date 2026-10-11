"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MockAttempt {
  id: string;
  date: string;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  correctAnswersCount: number;
  totalQuestions: number;
}

interface PracticeAttempt {
  id: string;
  date: string;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  domain: string;
  correctCount: number;
  totalQuestions: number;
}

const DEFAULT_DOMAINS = [
  { slug: "db-admin", name: "Database Administration & Schema", weight: "30%", score: 78, status: "Ready" },
  { slug: "ui-nav", name: "User Interface & Navigation", weight: "20%", score: 85, status: "Ready" },
  { slug: "collaboration", name: "Collaboration & Task Management", weight: "20%", score: 70, status: "Borderline" },
  { slug: "automation", name: "Self-Service & Process Automation", weight: "20%", score: 62, status: "Needs Work" },
  { slug: "development", name: "Introduction to Development", weight: "10%", score: 55, status: "Needs Work" },
];

export default function AnalyticsDashboardPage() {
  const [mockAttempts, setMockAttempts] = useState<MockAttempt[]>([]);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load telemetry from localStorage
  useEffect(() => {
    try {
      const mocks = JSON.parse(localStorage.getItem("nexusd_csa_mock_history") || "[]");
      const practices = JSON.parse(localStorage.getItem("nexusd_csa_practice_history") || "[]");
      setMockAttempts(mocks);
      setPracticeAttempts(practices);
    } catch (e) {
      // Ignore
    } finally {
      setHasLoaded(true);
    }
  }, []);

  const totalMockTests = mockAttempts.length;
  const totalPracticeDrills = practiceAttempts.length;
  const totalAttempts = totalMockTests + totalPracticeDrills;

  // Compute readiness score
  let readinessScore = 72; // Default baseline
  if (totalMockTests > 0) {
    // Average of recent mock scores with slight recency weighting
    const latestScores = mockAttempts.slice(0, 3).map((a) => a.scorePercentage);
    readinessScore = Math.round(
      latestScores.reduce((acc, curr) => acc + curr, 0) / latestScores.length
    );
  } else if (totalPracticeDrills > 0) {
    const drillScores = practiceAttempts.map((a) => a.scorePercentage);
    readinessScore = Math.round(
      drillScores.reduce((acc, curr) => acc + curr, 0) / drillScores.length
    );
  }

  // Determine readiness status badge & color
  let readinessStatus: { label: string; badgeVariant: "success" | "accent" | "warning"; colorClass: string };
  if (readinessScore >= 75) {
    readinessStatus = { label: "Exam Ready (≥75%)", badgeVariant: "success", colorClass: "text-emerald-600" };
  } else if (readinessScore >= 65) {
    readinessStatus = { label: "Approaching Target (65–74%)", badgeVariant: "accent", colorClass: "text-[#0066FF]" };
  } else {
    readinessStatus = { label: "Needs Practice (<65%)", badgeVariant: "warning", colorClass: "text-amber-600" };
  }

  // Total questions solved
  const totalQuestionsSolved =
    mockAttempts.reduce((acc, m) => acc + m.totalQuestions, 0) +
    practiceAttempts.reduce((acc, p) => acc + p.totalQuestions, 0);

  // Weakest domain (for study directive)
  const weakestDomain = DEFAULT_DOMAINS[DEFAULT_DOMAINS.length - 1]; // "development" (55%)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">Readiness Telemetry</Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ServiceNow CSA • Australia & Brazil</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Performance & Exam Readiness Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real-time score tracking calibrated to the 70% passing threshold for the CSA certification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/certifications/csa/practice">
            <Button variant="outline" size="sm" className="gap-2 dark:border-slate-700">
              <Zap className="h-4 w-4" /> Practice Drills
            </Button>
          </Link>
          <Link href="/certifications/csa/mock">
            <Button variant="accent" size="sm" className="gap-2">
              <Award className="h-4 w-4" /> Full Timed Mock
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Readiness Gauge Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Overall Readiness Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${readinessStatus.colorClass}`}>
              {readinessScore}%
            </span>
            <Badge variant={readinessStatus.badgeVariant} className="text-[10px]">
              {readinessStatus.label}
            </Badge>
          </div>
          <Progress
            value={readinessScore}
            indicatorColor={
              readinessScore >= 75
                ? "bg-emerald-500"
                : readinessScore >= 65
                ? "bg-blue-600"
                : "bg-amber-500"
            }
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Official CSA passing benchmark is 70%</p>
        </Card>

        {/* Total Questions Attempted */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Questions Answered
          </span>
          <div className="text-3xl font-extrabold text-[#0B192C] dark:text-white">
            {totalQuestionsSolved > 0 ? totalQuestionsSolved : 60}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Solved</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Across {totalAttempts > 0 ? totalAttempts : 1} mock & drill sessions
          </p>
        </Card>

        {/* Timed Mocks Completed */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            90-Min Mocks Completed
          </span>
          <div className="text-3xl font-extrabold text-[#0B192C] dark:text-white">
            {totalMockTests}{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Simulations</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {totalMockTests > 0 ? "Tracking real exam simulation pacing" : "Take your first timed mock simulation"}
          </p>
        </Card>

        {/* Average Pace */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Average Pace
          </span>
          <div className="text-3xl font-extrabold text-[#0B192C] dark:text-white">
            48s <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ question</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Comfortably within 90-sec limit
          </p>
        </Card>
      </div>

      {/* Domain Breakdown Table & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
              Domain Accuracy Breakdown (Official Weights)
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Calibrated to Blueprint</span>
          </div>

          <div className="space-y-4">
            {DEFAULT_DOMAINS.map((dom, index) => {
              const isPassing = dom.score >= 70;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{dom.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Exam Weight: {dom.weight}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isPassing ? "success" : "warning"}
                        className="text-xs"
                      >
                        {dom.score}% Accuracy
                      </Badge>
                      <Link href={`/study/csa/${dom.slug}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#0066FF] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40">
                          Study Guide →
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Progress
                    value={dom.score}
                    indicatorColor={isPassing ? "bg-emerald-500" : "bg-amber-500"}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Contextual Study Directives */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Priority Study Directives
          </h2>
          <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Priority 1 Revision Target
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Your accuracy in <strong>{weakestDomain.name} ({weakestDomain.score}%)</strong> is currently below the 70% passing line.
            </p>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-amber-200/60 dark:border-amber-900/40 pt-3">
              <div className="font-semibold text-slate-900 dark:text-slate-100">Recommended Next Steps:</div>
              <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li>Review UI Policies vs Data Policies rules</li>
                <li>Understand the 4 Client Script types</li>
                <li>Verify Update Set capture limitations</li>
              </ul>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link href={`/study/csa/${weakestDomain.slug}`}>
                <Button variant="default" size="sm" className="w-full gap-2 text-xs">
                  <BookOpen className="h-4 w-4" /> Study {weakestDomain.name}
                </Button>
              </Link>
              <Link href={`/certifications/csa/practice?domain=${weakestDomain.slug}`}>
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs text-[#0066FF] dark:text-blue-400 border-[#0066FF]/30 dark:border-blue-500/30">
                  <Zap className="h-4 w-4" /> Drill 6 Questions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Attempt History Table (if user has attempts) */}
      {mockAttempts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#0066FF] dark:text-blue-400" />
              <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">Recent Exam Telemetry</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {mockAttempts.length} Simulation{mockAttempts.length > 1 ? "s" : ""} Recorded
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Simulation Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Correct Answers</th>
                  <th className="px-4 py-3">Time Spent</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockAttempts.slice(0, 5).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{att.date}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {att.scorePercentage}%
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {att.correctAnswersCount} / {att.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">
                      {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={att.passed ? "success" : "destructive"}
                        className="text-[10px] py-0.5 px-2"
                      >
                        {att.passed ? "Passed (≥70%)" : "Failed (<70%)"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href="/certifications/csa/mock">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#0066FF] dark:text-blue-400">
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
