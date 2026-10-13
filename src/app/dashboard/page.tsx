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
  Flame,
  Calendar,
  Layers,
  FileText,
  RotateCcw,
  Check,
  Play,
  PauseCircle,
  HelpCircle,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEntitlements } from "@/hooks/use-entitlements";
import {
  DEFAULT_CERTIFICATION_TRACKS,
  CertificationTrack,
} from "@/lib/admin-certifications";
import { getExamConfig, getExamStorageKeys, PausedExamSession } from "@/lib/exam-engine";

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const { isPro, entitlement, daysRemaining, isCertificationActive } = useEntitlements();

  // Active track selector: CSA, CAD, CIS-DF, CIS-ITSM
  const [activeTrackId, setActiveTrackId] = useState<string>("csa");
  const [pausedSession, setPausedSession] = useState<PausedExamSession | null>(null);

  const [profile, setProfile] = useState<{
    backgroundSegment?: string;
    targetRoles?: string[];
  }>({});

  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  // Initialize active track from localStorage
  useEffect(() => {
    try {
      const savedTrack = localStorage.getItem("nexusd_active_track");
      if (savedTrack && DEFAULT_CERTIFICATION_TRACKS.some((t) => t.id === savedTrack)) {
        setActiveTrackId(savedTrack);
      }
      const stored = localStorage.getItem("nexusd_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Save selected track
  const handleSelectTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    try {
      localStorage.setItem("nexusd_active_track", trackId);
    } catch (e) {}
  };

  const currentTrack: CertificationTrack =
    getExamConfig(activeTrackId) || DEFAULT_CERTIFICATION_TRACKS[0];

  const userId = session?.user?.email || (session?.user as any)?.id || "guest";
  const storageKeys = getExamStorageKeys(activeTrackId, userId);

  // Check for paused session and attempt history for the active track
  useEffect(() => {
    // 1. Check for paused session in localStorage
    try {
      const savedPaused = localStorage.getItem(storageKeys.pausedKey);
      if (savedPaused) {
        const parsed = JSON.parse(savedPaused) as PausedExamSession;
        if (parsed && parsed.timeRemainingSeconds > 0 && Array.isArray(parsed.questionIds)) {
          setPausedSession(parsed);
        } else {
          setPausedSession(null);
        }
      } else {
        setPausedSession(null);
      }
    } catch (e) {
      setPausedSession(null);
    }

    // 2. Fetch Attempts History
    if (session?.user) {
      fetch(`/api/exams/attempts?certificationId=${activeTrackId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.attempts)) {
            const atts = data.attempts;
            setAttemptsCount(atts.length);
            if (atts.length > 0) {
              setLatestScore(atts[0].scorePercentage ?? null);
              const sum = atts.reduce((acc: number, curr: any) => acc + (curr.scorePercentage || 0), 0);
              setAverageScore(Math.round(sum / atts.length));
            } else {
              setLatestScore(null);
              setAverageScore(null);
            }
          } else {
            setAttemptsCount(0);
            setLatestScore(null);
            setAverageScore(null);
          }
        })
        .catch(() => {
          setAttemptsCount(0);
          setLatestScore(null);
          setAverageScore(null);
        });
    } else {
      // Guest localStorage check
      try {
        const historyKey = storageKeys.historyKey;
        const localHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        setAttemptsCount(localHistory.length);
        if (localHistory.length > 0) {
          setLatestScore(localHistory[0].scorePercentage ?? null);
          const sum = localHistory.reduce((acc: number, curr: any) => acc + (curr.scorePercentage || 0), 0);
          setAverageScore(Math.round(sum / localHistory.length));
        } else {
          setLatestScore(null);
          setAverageScore(null);
        }
      } catch (e) {
        setAttemptsCount(0);
        setLatestScore(null);
        setAverageScore(null);
      }
    }
  }, [activeTrackId, session, storageKeys.pausedKey, storageKeys.historyKey]);

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

  const displayName = session?.user?.name ? session.user.name.split(" ")[0] : null;
  const isAuthenticated = Boolean(session?.user);

  // Is active track covered by pro entitlement?
  const isCurrentTrackPro = Boolean(
    isPro &&
      (entitlement?.planId === "all_access" ||
        entitlement?.planId === `${activeTrackId}_pass` ||
        entitlement?.certifications?.includes(activeTrackId))
  );

  const formatTimerMin = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    return `${mins}m left`;
  };

  // Readiness status badge calculation
  const getReadinessStatus = (score: number | null) => {
    if (score === null) return { label: "Not Calibrated", color: "text-slate-400 bg-slate-100 dark:bg-slate-800" };
    if (score >= currentTrack.passingPercentage) return { label: "Exam Ready", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300" };
    if (score >= currentTrack.passingPercentage - 10) return { label: "Approaching Pass", color: "text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300" };
    return { label: "Needs Practice", color: "text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-300" };
  };

  const readinessStatus = getReadinessStatus(latestScore);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Track Switcher Navigation Bar (Dynamic certification pivot) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-[#0066FF]" /> Active Certification Track:
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {currentTrack.code} — {currentTrack.title}
          </div>
        </div>

        {/* Dynamic Track Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {DEFAULT_CERTIFICATION_TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0066FF] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <span>{track.code}</span>
                {track.status === "active" && (
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Top Welcome Banner & Persona Status */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 dark:from-[#131D31] dark:via-[#0F172A] dark:to-[#131D31] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                {getSegmentLabel(profile.backgroundSegment)}
              </Badge>

              {isAuthenticated && isPro ? (
                <Badge
                  variant="success"
                  className="gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {entitlement?.planId === "all_access" ? "All-Access 2-Year Pass" : `${currentTrack.code} Pro Pass`} ({daysRemaining}d left)
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Free Starter Tier (60 Qs)
                </Badge>
              )}

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {currentTrack.releaseVersion}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {displayName ? `Welcome back, ${displayName}` : "Ready to Accelerate Your ServiceNow Career"}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">
              {currentTrack.shortDescription} Practice with official blueprint quotas, instant explanations, and 90-minute timed mock simulations.
            </p>
          </div>

          {/* Quick Action CTAs targeting the active track */}
          <div className="flex flex-wrap gap-2.5">
            <Link href={`/certifications/${activeTrackId}/practice`}>
              <Button variant="accent" size="lg" className="gap-2 shadow-sm whitespace-nowrap cursor-pointer">
                <Zap className="h-4 w-4" /> Start Practice Test
              </Button>
            </Link>
            <Link href={`/certifications/${activeTrackId}/mock`}>
              <Button variant="default" size="lg" className="gap-2 whitespace-nowrap cursor-pointer bg-[#0B192C] hover:bg-[#1A2E44] text-white">
                <Clock className="h-4 w-4 text-[#38BDF8]" /> Start Mock Exam
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="lg" className="whitespace-nowrap border-slate-300 dark:border-slate-700 dark:text-slate-200 cursor-pointer">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Paused Mock Exam Banner (Dynamic Resumption Trigger) */}
      {pausedSession && (
        <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0">
              <PauseCircle className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <span>Active {currentTrack.code} Mock Exam In Progress</span>
                <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-mono">
                  {formatTimerMin(pausedSession.timeRemainingSeconds)}
                </Badge>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                You paused Question {pausedSession.currentIndex + 1} of {currentTrack.totalQuestions}. Your answers and timer are securely saved.
              </p>
            </div>
          </div>

          <Link href={`/certifications/${activeTrackId}/mock`} className="w-full sm:w-auto shrink-0">
            <Button variant="default" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 cursor-pointer">
              <Play className="h-3.5 w-3.5 fill-white" /> Resume Paused Exam
            </Button>
          </Link>
        </div>
      )}

      {/* 4. Bento Motivation Grid: 3 Core Learner Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Dynamic Readiness Gauge */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {currentTrack.code} Readiness
              </span>
              <Target className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
            </div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              Readiness Gauge
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Calibrated from official mock simulation scorecards.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                  {latestScore !== null ? `${latestScore}%` : "--"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${readinessStatus.color}`}>
                  {readinessStatus.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {attemptsCount > 0
                  ? `${attemptsCount} test ${attemptsCount === 1 ? "attempt" : "attempts"} logged for ${currentTrack.code}.`
                  : `Take your first ${currentTrack.code} mock exam to calibrate your readiness.`}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Passing Benchmark:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentTrack.passingPercentage}% Required</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Average Performance:</span>
                <span className="font-semibold text-[#0066FF] dark:text-[#38BDF8]">
                  {averageScore !== null ? `${averageScore}%` : "Pending Data"}
                </span>
              </div>
            </div>

            <Link href="/dashboard/analytics" className="block pt-2">
              <Button variant="outline" className="w-full text-xs font-semibold dark:border-slate-700 dark:hover:bg-slate-800 gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                View Deep Domain Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: 7-Day Study Momentum & Habit Streak */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Study Habit Loop
              </span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              7-Day Study Momentum
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Consistency determines exam-day confidence.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4 text-center space-y-1">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                <Flame className="h-5 w-5 fill-amber-500" />
                <span>{attemptsCount > 0 ? `${Math.min(attemptsCount, 7)}-Day Habit Streak` : "Start Streak Today"}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {attemptsCount > 0 ? "Outstanding momentum! Keep drilling daily." : "Practice at least 10 questions daily to build retention."}
              </p>
            </div>

            {/* 7-Day Interactive Day Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Weekly Activity:</div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                  const isActive = idx < Math.min(attemptsCount, 7);
                  return (
                    <div
                      key={idx}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link href={`/certifications/${activeTrackId}/practice`} className="block pt-2">
              <Button variant="accent" className="w-full text-xs font-semibold gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Continue Daily Drill
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Domain Blueprint Mastery Breakdown */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Official Blueprint
              </span>
              <Layers className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
            </div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              Domain Competencies
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {currentTrack.domains.length} syllabus domains with weighted distribution.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="space-y-2.5">
              {currentTrack.domains.map((dom) => (
                <div key={dom.slug} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                      {dom.name}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 font-bold">
                      {dom.weight}%
                    </span>
                  </div>
                  <Progress value={dom.weight * 2.5} className="h-1.5" />
                </div>
              ))}
            </div>

            <Link href={`/study/${activeTrackId}`} className="block pt-2">
              <Button variant="outline" className="w-full text-xs font-semibold dark:border-slate-700 dark:hover:bg-slate-800 gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                Explore {currentTrack.code} Study Blueprints
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 5. Four-Stage Certification Milestone Roadmap (Metro-Line Storytelling) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="accent" className="text-[10px]">
              Proven 4-Step Methodology
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTrack.code} Certification Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Follow this structured pathway to clear your ServiceNow {currentTrack.title} on your first attempt.
            </p>
          </div>

          <Link href={`/certifications/${activeTrackId}/practice`}>
            <Button variant="outline" size="sm" className="text-xs dark:border-slate-700">
              Launch Diagnostic Drill →
            </Button>
          </Link>
        </div>

        {/* Metro-Line Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] font-mono">
                STAGE 01
              </span>
              <CheckCircle2 className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Diagnostic Assessment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete the free 60-question baseline set to discover domain strengths and blind spots.
              </p>
            </div>
            <Link href={`/certifications/${activeTrackId}/practice`} className="block pt-1">
              <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1">
                Start Stage 1 <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                STAGE 02
              </span>
              <BookOpen className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Blueprint Domain Mastery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review study blueprints, database schemas, Flow Designer concepts, and official documentation.
              </p>
            </div>
            <Link href={`/study/${activeTrackId}`} className="block pt-1">
              <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1">
                Read Study Guides <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                STAGE 03
              </span>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Timed 90-Min Simulations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Take realistic timed mock exams with stratified blueprint sampling and instant telemetry.
              </p>
            </div>
            <Link href={`/certifications/${activeTrackId}/mock`} className="block pt-1">
              <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1">
                Launch Timed Exam <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                STAGE 04
              </span>
              <Award className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Exam-Day Readiness
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Score 80%+ consistently on mocks and export 3-mode printable revision PDFs before test day.
              </p>
            </div>
            <Link href="/pricing" className="block pt-1">
              <span className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1">
                Unlock Pro Exporter <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Quick Access Shortcuts (Active Track Hub) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/study/${activeTrackId}/question-bank`}>
          <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] hover:border-[#0066FF] transition-all cursor-pointer shadow-2xs group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
                    {currentTrack.code} Question Bank
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Browse questions with complete answer keys
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/analytics">
          <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] hover:border-[#0066FF] transition-all cursor-pointer shadow-2xs group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
                    Domain Analytics Engine
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Track weaknesses across official syllabus
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/pricing">
          <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] hover:border-[#0066FF] transition-all cursor-pointer shadow-2xs group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
                    Certification Passes
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Single track passes or 2-Year All-Access
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
