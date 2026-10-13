"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3,
  HelpCircle,
  Grid,
  AlertCircle,
  Filter,
  Check,
  CheckSquare,
  History,
  Flag,
  Lock,
  PauseCircle,
  Play,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import { ReportQuestionDialog } from "@/components/questions/report-question-dialog";
import { useEntitlements } from "@/hooks/use-entitlements";
import { PracticeQuestion } from "@/data/csa-questions";
import {
  getExamConfig,
  getExamStorageKeys,
  purgeGuestExamStorage,
  getExamQuestions,
  generateTrackMockExam,
  PausedExamSession,
} from "@/lib/exam-engine";

interface MockAttemptRecord {
  id: string;
  date: string;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  correctAnswersCount: number;
  totalQuestions: number;
}

export default function DynamicTimedMockExamPage() {
  const params = useParams();
  const trackId = ((params?.track as string) || "csa").toLowerCase();
  const examConfig = getExamConfig(trackId);
  const totalExamTimeSeconds = (examConfig.durationMinutes || 90) * 60;

  const { data: session, status } = useSession();
  const router = useRouter();
  const { isPro } = useEntitlements();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Dynamic storage keys scoped by trackId and user
  const storageKeys = getExamStorageKeys(trackId, userId);

  // State management
  const [activeMockQuestions, setActiveMockQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(totalExamTimeSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pausedSession, setPausedSession] = useState<PausedExamSession | null>(null);
  const [hasCheckedPaused, setHasCheckedPaused] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");
  const [attemptHistory, setAttemptHistory] = useState<MockAttemptRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState<PracticeQuestion | null>(null);

  // Navigation guard
  const isDeliberatelyNavigatingRef = useRef(false);
  const pendingNavigationUrlRef = useRef<string | null>(null);

  // 1. Unauthenticated Security & Cache Cleanup
  useEffect(() => {
    if (status === "unauthenticated") {
      purgeGuestExamStorage(trackId);
    }
  }, [status, trackId]);

  // 2. Check for Paused Session or Start Fresh for Authenticated User
  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") setHasCheckedPaused(true);
      return;
    }

    try {
      const savedPausedStr = localStorage.getItem(storageKeys.pausedKey);
      if (savedPausedStr) {
        const parsed = JSON.parse(savedPausedStr) as PausedExamSession;
        if (
          parsed &&
          parsed.timeRemainingSeconds > 0 &&
          Array.isArray(parsed.questionIds) &&
          parsed.questionIds.length > 0
        ) {
          setPausedSession(parsed);
          setHasCheckedPaused(true);
          return;
        }
      }
    } catch (e) {}

    // No valid paused session found -> generate randomized mock set
    const fresh = generateTrackMockExam(trackId, examConfig.totalQuestions);
    setActiveMockQuestions(fresh);
    setTimeRemainingSeconds(totalExamTimeSeconds);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setHasCheckedPaused(true);
  }, [status, storageKeys.pausedKey, trackId, examConfig.totalQuestions, totalExamTimeSeconds]);

  // 3. Fetch Real Attempt History from Neon DB for Authenticated User
  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/exams/attempts?certificationId=${trackId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.attempts)) {
            setAttemptHistory(data.attempts);
          }
        })
        .catch(() => {});
    }
  }, [status, trackId, isCompleted]);

  // 4. Timer Countdown Loop (Runs only when exam is actively ongoing)
  useEffect(() => {
    if (
      status !== "authenticated" ||
      isCompleted ||
      pausedSession !== null ||
      !hasCheckedPaused ||
      activeMockQuestions.length === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, isCompleted, pausedSession, hasCheckedPaused, activeMockQuestions.length]);

  // 5. Intercept Browser Back Navigation, Tab Closure, AND Internal Link Clicks (Sidebar/Dashboard/Guides/Profile)
  useEffect(() => {
    if (
      status !== "authenticated" ||
      isCompleted ||
      pausedSession !== null ||
      !hasCheckedPaused ||
      activeMockQuestions.length === 0
    ) {
      return;
    }

    window.history.pushState({ mockExamActive: true }, "", window.location.href);

    const handlePopState = () => {
      if (isDeliberatelyNavigatingRef.current) return;
      window.history.pushState({ mockExamActive: true }, "", window.location.href);
      pendingNavigationUrlRef.current = null;
      setShowLeaveModal(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDeliberatelyNavigatingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (isDeliberatelyNavigatingRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
        return;
      }

      // Check if it's pointing away from the current page
      const currentOriginPath = window.location.pathname;
      if (href === currentOriginPath || href === window.location.href) {
        return;
      }

      // Intercept navigation
      e.preventDefault();
      e.stopPropagation();

      pendingNavigationUrlRef.current = href;
      setShowLeaveModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [status, isCompleted, pausedSession, hasCheckedPaused, activeMockQuestions.length]);

  // Derived variables
  const currentQuestions = activeMockQuestions;
  const currentQuestion = currentQuestions[currentIndex] || currentQuestions[0];
  const totalQuestions = currentQuestions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const currentSelections = selectedAnswers[currentQuestion?.id] || [];
  const requiredCount = currentQuestion?.requiredSelectCount || 1;

  const answeredCount = Object.keys(selectedAnswers).filter(
    (id) => selectedAnswers[id]?.length > 0
  ).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    let updatedList: string[];

    if (currentQuestion.isMultiSelect) {
      if (currentSelections.includes(optionId)) {
        updatedList = currentSelections.filter((id) => id !== optionId);
      } else {
        if (currentSelections.length >= requiredCount) {
          updatedList = [...currentSelections.slice(1), optionId];
        } else {
          updatedList = [...currentSelections, optionId];
        }
      }
    } else {
      updatedList = [optionId];
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updatedList,
    }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const checkIsCorrect = (q: PracticeQuestion, selections: string[] = []) => {
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    if (selections.length !== correctIds.length) return false;
    return correctIds.every((id) => selections.includes(id));
  };

  // Resume Paused Exam Handler
  const handleResumePausedExam = () => {
    if (!pausedSession) return;
    const allTrackQuestions = getExamQuestions(trackId);
    const restored = pausedSession.questionIds
      .map((id) => allTrackQuestions.find((q) => q.id === id))
      .filter(Boolean) as PracticeQuestion[];

    if (restored.length > 0) {
      setActiveMockQuestions(restored);
    } else {
      setActiveMockQuestions(generateTrackMockExam(trackId, examConfig.totalQuestions));
    }

    setTimeRemainingSeconds(pausedSession.timeRemainingSeconds);
    setCurrentIndex(pausedSession.currentIndex || 0);
    setSelectedAnswers(pausedSession.selectedAnswers || {});
    setFlaggedQuestions(pausedSession.flaggedQuestions || {});
    setPausedSession(null);
  };

  // Discard Paused Session & Start Fresh
  const handleDiscardPausedExam = () => {
    try {
      localStorage.removeItem(storageKeys.pausedKey);
    } catch (e) {}
    setPausedSession(null);
    const fresh = generateTrackMockExam(trackId, examConfig.totalQuestions);
    setActiveMockQuestions(fresh);
    setTimeRemainingSeconds(totalExamTimeSeconds);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
  };

  // Action 1: Pause Exam (Saves Progress & Navigates back)
  const handlePauseExam = () => {
    isDeliberatelyNavigatingRef.current = true;
    try {
      const sessionData: PausedExamSession = {
        userId: userId || "auth_user",
        timeRemainingSeconds,
        currentIndex,
        selectedAnswers,
        flaggedQuestions,
        questionIds: currentQuestions.map((q) => q.id),
        pausedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKeys.pausedKey, JSON.stringify(sessionData));
    } catch (e) {}

    setShowLeaveModal(false);
    const destination = pendingNavigationUrlRef.current || `/certifications/${trackId}`;
    pendingNavigationUrlRef.current = null;
    router.push(destination);
  };

  // Action 2: Quit Exam (Wipes In-Progress State Without Saving & Navigates)
  const handleQuitExam = () => {
    isDeliberatelyNavigatingRef.current = true;
    purgeGuestExamStorage(trackId, userId);
    setShowLeaveModal(false);
    const destination = pendingNavigationUrlRef.current || `/certifications/${trackId}`;
    pendingNavigationUrlRef.current = null;
    router.push(destination);
  };

  // Reset exam for retake
  const resetExam = () => {
    purgeGuestExamStorage(trackId, userId);
    const fresh = generateTrackMockExam(trackId, examConfig.totalQuestions);
    setActiveMockQuestions(fresh);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(totalExamTimeSeconds);
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowConfirmModal(false);
    setPausedSession(null);
  };

  // Calculate Results
  const calculateResults = () => {
    let correctCount = 0;
    const domainScores: Record<string, { total: number; correct: number }> = {};

    currentQuestions.forEach((q) => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { total: 0, correct: 0 };
      }
      domainScores[q.domain].total += 1;

      const userChoices = selectedAnswers[q.id] || [];
      if (checkIsCorrect(q, userChoices)) {
        correctCount += 1;
        domainScores[q.domain].correct += 1;
      }
    });

    const scorePercentage =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= (examConfig.passingPercentage || 70);

    return { correctCount, scorePercentage, passed, domainScores };
  };

  // Submit and record attempt
  const handleFinishExam = async () => {
    setShowConfirmModal(false);
    setIsCompleted(true);
    try {
      localStorage.removeItem(storageKeys.pausedKey);
    } catch (e) {}

    const results = calculateResults();
    const timeSpent = totalExamTimeSeconds - timeRemainingSeconds;

    try {
      setIsSubmitting(true);
      await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificationId: trackId,
          mode: "timed_mock",
          totalQuestions,
          correctAnswersCount: results.correctCount,
          scorePercentage: results.scorePercentage,
          passed: results.passed,
          timeSpentSeconds: timeSpent,
          domainScores: results.domainScores,
          answers: currentQuestions.map((q) => ({
            questionId: q.id,
            selectedOptionIds: selectedAnswers[q.id] || [],
            isCorrect: checkIsCorrect(q, selectedAnswers[q.id]),
            isFlagged: Boolean(flaggedQuestions[q.id]),
          })),
        }),
      });

      const res = await fetch(`/api/exams/attempts?certificationId=${trackId}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.attempts)) {
        setAttemptHistory(data.attempts);
      }
    } catch (e) {
      console.warn("Failed to sync attempt to server:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter questions for review
  const filteredQuestions = currentQuestions.filter((q) => {
    if (reviewFilter === "flagged") return Boolean(flaggedQuestions[q.id]);
    if (reviewFilter === "incorrect") {
      const userChoices = selectedAnswers[q.id] || [];
      return !checkIsCorrect(q, userChoices);
    }
    return true;
  });

  // =========================================================================
  // VIEW 1: Loading State
  // =========================================================================
  if (status === "loading" || !hasCheckedPaused) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-28 text-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent mx-auto" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Verifying {examConfig.code} examination credentials...
        </p>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: Unauthenticated Sign-In Required Gate
  // (Prevents caching, protects official analytics, guides to Practice mode)
  // =========================================================================
  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="warning" className="text-xs py-1 px-3.5 gap-1.5 font-semibold">
            <Lock className="h-3.5 w-3.5" /> Authentication Required for Mock Exams
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {examConfig.title} Timed Mock Simulation
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Strict {examConfig.durationMinutes}-minute timed simulation with {examConfig.totalQuestions} questions and official {examConfig.passingPercentage}% passing benchmark.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 p-3 text-[#0066FF] dark:text-blue-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Why is an account required for Mock Tests?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Candidate performance telemetry, pass readiness gauges, and domain weakness analytics for {examConfig.code} are calculated exclusively from completed mock exams. Signing in ensures your attempt records and pause states are reliably preserved without data corruption.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 p-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              Practice Exam Mode is 100% Free & Open Without Sign In
            </div>
            <p>
              Want to practice {examConfig.code} questions right now without signing in? Untimed Practice Mode is open to everyone with instant answers and deep architectural explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href={`/login?callbackUrl=/certifications/${trackId}/mock`} className="flex-1">
              <Button variant="default" className="w-full gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white cursor-pointer">
                Sign In to Start Mock Exam <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/signup?callbackUrl=/certifications/${trackId}/mock`} className="flex-1">
              <Button variant="accent" className="w-full gap-2 cursor-pointer">
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <Link
              href={`/certifications/${trackId}/practice`}
              className="text-[#0066FF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Zap className="h-3.5 w-3.5" /> Start Untimed {examConfig.code} Practice Mode (Free)
            </Link>
            <Link
              href={`/certifications/${trackId}`}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              ← Back to {examConfig.code} Overview
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: Empty Track Guard (Questions still being authored)
  // =========================================================================
  if (currentQuestions.length === 0 && pausedSession === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8 space-y-6 text-center">
        <Badge variant="outline" className="text-xs py-1 px-3">
          {examConfig.code} Repository Status
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white">
          {examConfig.title} Mock Simulator
        </h1>
        <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Track Questions in Authoring
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                New questions for {examConfig.code} are currently being authored or imported. Administrators can upload questions via the Admin CMS using bulk Excel/CSV or the question authoring suite.
              </p>
            </div>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href={`/certifications/${trackId}`} className="flex-1">
              <Button variant="outline" className="w-full text-xs">
                ← Return to {examConfig.code} Hub
              </Button>
            </Link>
            <Link href="/admin/questions" className="flex-1">
              <Button variant="default" className="w-full text-xs gap-1.5">
                Admin Question CMS <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: Paused Session Recovery Screen
  // =========================================================================
  if (pausedSession !== null) {
    const pausedAnswered = Object.keys(pausedSession.selectedAnswers || {}).filter(
      (id) => (pausedSession.selectedAnswers[id] || []).length > 0
    ).length;
    const pausedFlagged = Object.values(pausedSession.flaggedQuestions || {}).filter(Boolean).length;

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="accent" className="text-xs py-1 px-3 gap-1.5 font-semibold">
            <PauseCircle className="h-3.5 w-3.5" /> Saved Exam in Progress
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Resume {examConfig.code} Timed Mock Simulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            You previously paused an active mock exam session for {examConfig.title}. You can resume where you left off or discard it to start fresh.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Time Remaining:</span>
              <span className="text-base font-mono font-bold text-[#0B192C] dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#0066FF]" />
                {formatTimer(pausedSession.timeRemainingSeconds)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Questions Answered:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {pausedAnswered} of {pausedSession.questionIds.length} questions
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Questions Flagged:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {pausedFlagged} flagged
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Current Question:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Question {(pausedSession.currentIndex || 0) + 1} of {pausedSession.questionIds.length}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400">
              <span>Paused on:</span>
              <span>{new Date(pausedSession.pausedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={handleResumePausedExam}
              className="w-full gap-2 font-bold cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" /> Resume Exam Session
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDiscardPausedExam}
              className="w-full gap-2 text-slate-600 dark:text-slate-300 dark:border-slate-700 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Discard & Start Fresh Exam
            </Button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href={`/certifications/${trackId}`}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              ← Return to {examConfig.code} Overview
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: Score Report View (Post-Submission)
  // =========================================================================
  if (isCompleted) {
    const results = calculateResults();
    const timeSpentSeconds = totalExamTimeSeconds - timeRemainingSeconds;

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge
            variant={results.passed ? "success" : "destructive"}
            className="text-sm py-1.5 px-5 font-semibold"
          >
            {results.passed
              ? `OFFICIAL BENCHMARK PASSED (≥${examConfig.passingPercentage}%)`
              : `RE-STUDY RECOMMENDED (<${examConfig.passingPercentage}%)`}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {examConfig.code} Timed Mock Exam Scorecard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Completed in {formatTimer(timeSpentSeconds)} • {results.correctCount} of {totalQuestions} Questions Correct
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm p-6 md:p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-6xl md:text-7xl font-extrabold text-[#0B192C] dark:text-white font-mono">
              {results.scorePercentage}%
            </div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Passing Standard: {examConfig.passingPercentage}% ({Math.ceil((totalQuestions * examConfig.passingPercentage) / 100)} / {totalQuestions} required)
            </div>
          </div>

          <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {results.passed
              ? `Outstanding preparation! Your score satisfies the official ServiceNow ${examConfig.title} standard.`
              : `Keep practicing. Focus especially on domains scoring under ${examConfig.passingPercentage}% in the breakdown below.`}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button variant="default" onClick={resetExam} className="gap-2 cursor-pointer">
              <RotateCcw className="h-4 w-4" /> Retake {examConfig.code} Mock Exam
            </Button>
            <Link href={`/certifications/${trackId}/practice`}>
              <Button variant="accent" className="gap-2 cursor-pointer">
                Practice Weak Domains <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="gap-2 dark:border-slate-700 cursor-pointer">
                <BarChart3 className="h-4 w-4 text-[#0066FF]" /> Performance Analytics
              </Button>
            </Link>
            {!isPro && (
              <Button
                variant="outline"
                onClick={() => setShowSubModal(true)}
                className="gap-2 border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-500" /> Unlock Pro Vault & PDFs (₹{examConfig.priceINR || 499})
              </Button>
            )}
          </div>
        </Card>

        {/* Domain Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Domain Accuracy Breakdown ({totalQuestions} Questions)
          </h2>
          <div className="space-y-3">
            {Object.entries(results.domainScores).map(([domain, data]) => {
              const domainPercent = Math.round((data.correct / data.total) * 100);
              const isPassing = domainPercent >= (examConfig.passingPercentage || 70);

              return (
                <div
                  key={domain}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{domain}</span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        isPassing ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {data.correct} / {data.total} ({domainPercent}%)
                    </span>
                  </div>
                  <Progress
                    value={domainPercent}
                    indicatorColor={isPassing ? "bg-emerald-500" : "bg-amber-500"}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Attempts Table */}
        {attemptHistory.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#0066FF] dark:text-blue-400" />
              <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
                Recent {examConfig.code} Mock Attempts
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Correct</th>
                    <th className="px-4 py-3">Time Spent</th>
                    <th className="px-4 py-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attemptHistory.slice(0, 5).map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{att.date}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                        {att.scorePercentage}%
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {att.correctAnswersCount} / {att.totalQuestions}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">
                        {formatTimer(att.timeSpentSeconds)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={att.passed ? "success" : "destructive"}
                          className="text-[10px] py-0.5 px-2"
                        >
                          {att.passed ? "Passed" : "Failed"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Question Review Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
              Comprehensive Question Review
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <Button
                variant={reviewFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewFilter("all")}
              >
                All ({totalQuestions})
              </Button>
              <Button
                variant={reviewFilter === "incorrect" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewFilter("incorrect")}
              >
                Incorrect ({totalQuestions - results.correctCount})
              </Button>
              <Button
                variant={reviewFilter === "flagged" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewFilter("flagged")}
              >
                Flagged ({flaggedCount})
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredQuestions.map((q) => {
              const userChoices = selectedAnswers[q.id] || [];
              const isUserCorrect = checkIsCorrect(q, userChoices);

              return (
                <Card key={q.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-xs">
                        {q.domain}
                      </Badge>
                      {q.isMultiSelect && (
                        <Badge variant="outline" className="text-[11px]">
                          Choose {q.requiredSelectCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {flaggedQuestions[q.id] && (
                        <Badge variant="warning" className="gap-1 text-[11px]">
                          <Bookmark className="h-3 w-3 fill-amber-500" /> Flagged
                        </Badge>
                      )}
                      {isUserCorrect ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {q.questionText}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = userChoices.includes(opt.id);
                      const isCorrect = opt.isCorrect;

                      let optClass = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";
                      if (isCorrect) {
                        optClass = "border-emerald-400 dark:border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optClass = "border-red-400 dark:border-red-600 bg-red-50/70 dark:bg-red-950/30 text-red-950 dark:text-red-200";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`rounded-lg border p-3 text-xs flex items-center justify-between ${optClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-4 w-4 shrink-0 flex items-center justify-center text-[10px] ${
                                q.isMultiSelect ? "rounded-xs" : "rounded-full"
                              } border ${
                                isSelected
                                  ? isCorrect
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-red-600 text-white border-red-600"
                                  : isCorrect
                                  ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {isSelected ? "✓" : isCorrect ? "•" : ""}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                              Correct Answer
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-400">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0066FF] dark:text-blue-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Architectural Explanation ({q.releaseVersion || examConfig.releaseVersion})
                      </div>
                      <button
                        type="button"
                        onClick={() => setReportingQuestion(q)}
                        className="text-[11px] text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Report question errata"
                      >
                        <Flag className="h-3 w-3" /> Report Errata
                      </button>
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <SubscriptionModal
          isOpen={showSubModal}
          onClose={() => setShowSubModal(false)}
          reason="general"
        />

        <ReportQuestionDialog
          isOpen={Boolean(reportingQuestion)}
          onClose={() => setReportingQuestion(null)}
          questionId={reportingQuestion?.id || ""}
          domainName={reportingQuestion?.domain}
          questionSnippet={reportingQuestion?.questionText}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 6: Active Timed Exam Runner View
  // =========================================================================
  const isFlagged = flaggedQuestions[currentQuestion?.id];
  const isTimeUrgent = timeRemainingSeconds < 10 * 60;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header & Sticky Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        {/* Left: Mode, Leave Button & Question count */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLeaveModal(true)}
            className="gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer px-2 sm:px-3"
            title="Leave or pause this exam"
          >
            <ArrowLeft className="h-4 w-4" /> Leave Exam
          </Button>

          <Badge variant="default" className="bg-[#0B192C] dark:bg-blue-600 text-white text-xs">
            {examConfig.code} Timed Mock ({totalQuestions} Qs)
          </Badge>
        </div>

        {/* Center: Countdown Timer */}
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-mono font-bold shadow-xs transition-colors ${
            isTimeUrgent
              ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <Clock className={`h-4 w-4 ${isTimeUrgent ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`} />
          <span>{formatTimer(timeRemainingSeconds)}</span>
        </div>

        {/* Right: Flag & Finish */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFlag}
            className={`gap-1.5 ${
              isFlagged
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                : "text-slate-700 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
            {isFlagged ? "Flagged" : "Flag"}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowConfirmModal(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{answeredCount} Answered • {unansweredCount} Left</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="text-xs">
                {currentQuestion.domain}
              </Badge>
              {currentQuestion.isMultiSelect && (
                <Badge variant="warning" className="text-xs gap-1 font-semibold">
                  <CheckSquare className="h-3 w-3" />
                  Choose {requiredCount} ({currentSelections.length} of {requiredCount} selected)
                </Badge>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Aligned to {currentQuestion.releaseVersion || examConfig.releaseVersion}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelections.includes(option.id);

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-2 border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0B192C] dark:text-white font-semibold ring-1 ring-[#0066FF]/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center text-xs transition-colors ${
                        currentQuestion.isMultiSelect ? "rounded-md" : "rounded-full"
                      } border ${
                        isSelected
                          ? "border-[#0066FF] bg-[#0066FF] text-white"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-sm">{option.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowDrawer(true)}
          className="gap-2 text-xs dark:border-slate-700 cursor-pointer"
        >
          <Grid className="h-4 w-4" /> Question List ({answeredCount}/{totalQuestions})
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            variant="accent"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="gap-2 cursor-pointer"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => setShowConfirmModal(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            Review & Finish <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigator Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {examConfig.code} Question Navigator ({totalQuestions} Questions)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDrawer(false)}
                className="cursor-pointer"
              >
                Close ✕
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span>Flagged ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 overflow-y-auto p-1 flex-1">
              {currentQuestions.map((q, idx) => {
                const isAns = (selectedAnswers[q.id]?.length || 0) > 0;
                const isCur = idx === currentIndex;
                const isFlg = flaggedQuestions[q.id];

                let boxStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
                if (isCur) boxStyle = "bg-[#0B192C] dark:bg-blue-600 text-white ring-2 ring-[#0066FF]";
                else if (isFlg) boxStyle = "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600 font-bold";
                else if (isAns) boxStyle = "bg-blue-600 text-white font-bold";

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowDrawer(false);
                    }}
                    className={`h-9 w-full rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center ${boxStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Leave Exam Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 p-2.5 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Mock Exam?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your {examConfig.durationMinutes}-minute timed {examConfig.code} simulation is currently in progress.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Time Remaining:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatTimer(timeRemainingSeconds)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Questions Answered:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {answeredCount} of {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Unanswered:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{unansweredCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Choose an option to exit:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handlePauseExam}
                className="w-full rounded-xl border-2 border-[#0066FF]/40 hover:border-[#0066FF] bg-blue-50/50 dark:bg-blue-950/40 p-3.5 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
                    <PauseCircle className="h-4 w-4 text-[#0066FF] dark:text-blue-400" />
                    1. Pause Exam (Save Progress)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Saves answers and remaining time. You can resume anytime.
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={handleQuitExam}
                className="w-full rounded-xl border border-red-200 dark:border-red-900/60 hover:border-red-400 bg-red-50/40 dark:bg-red-950/20 p-3.5 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    2. Quit Exam (Without Saving)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Discards all answers. Your next mock will start fresh.
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  pendingNavigationUrlRef.current = null;
                  setShowLeaveModal(false);
                }}
                className="dark:border-slate-700 cursor-pointer"
              >
                Stay in Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit {examConfig.code} Exam?</h3>
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Are you sure you want to finish and submit your exam?</p>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{answeredCount} of {totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{unansweredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Remaining:</span>
                  <span className="font-mono">{formatTimer(timeRemainingSeconds)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="dark:border-slate-700 cursor-pointer"
              >
                Continue Exam
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                onClick={handleFinishExam}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scoring..." : "Yes, Submit Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
