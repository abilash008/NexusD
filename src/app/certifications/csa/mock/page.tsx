"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import { ReportQuestionDialog } from "@/components/questions/report-question-dialog";
import { useEntitlements } from "@/hooks/use-entitlements";
import {
  CSA_FREE_60_QUESTIONS,
  CSA_SEED_QUESTIONS,
  generateDomainWeightedMockExam,
  type PracticeQuestion,
} from "@/data/csa-questions";

const TOTAL_TIME_SECONDS = 90 * 60; // 90 minutes = 5400 seconds

interface MockAttemptRecord {
  id: string;
  date: string;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  correctAnswersCount: number;
  totalQuestions: number;
}

export default function CSATimedMockExamPage() {
  // Deterministic baseline for SSR to prevent hydration mismatches
  const [activeMockQuestions, setActiveMockQuestions] = useState<PracticeQuestion[]>(
    CSA_FREE_60_QUESTIONS
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(TOTAL_TIME_SECONDS);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isPro } = useEntitlements();
  const [showSubModal, setShowSubModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");
  const [attemptHistory, setAttemptHistory] = useState<MockAttemptRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState<PracticeQuestion | null>(null);

  // LocalStorage state persistence & domain-weighted sampling
  useEffect(() => {
    try {
      const savedTime = localStorage.getItem("csa_mock_timer");
      const savedAnswers = localStorage.getItem("csa_mock_answers");
      const savedFlags = localStorage.getItem("csa_mock_flags");
      const savedHistory = localStorage.getItem("nexusd_csa_mock_history");
      const savedQids = localStorage.getItem("csa_mock_active_qids");

      // Restore active randomized mock questions or generate fresh 60-question set
      if (savedQids) {
        const qidList: string[] = JSON.parse(savedQids);
        const restored = qidList
          .map((id) => CSA_FREE_60_QUESTIONS.find((q) => q.id === id))
          .filter(Boolean) as PracticeQuestion[];
        if (restored.length === 60) {
          setActiveMockQuestions(restored);
        } else {
          const fresh = generateDomainWeightedMockExam(CSA_FREE_60_QUESTIONS);
          setActiveMockQuestions(fresh);
          localStorage.setItem("csa_mock_active_qids", JSON.stringify(fresh.map((q) => q.id)));
        }
      } else {
        const fresh = generateDomainWeightedMockExam(CSA_FREE_60_QUESTIONS);
        setActiveMockQuestions(fresh);
        localStorage.setItem("csa_mock_active_qids", JSON.stringify(fresh.map((q) => q.id)));
      }

      if (savedTime) setTimeRemainingSeconds(Number(savedTime));
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        // Normalize any legacy single-string answers to string arrays
        const normalized: Record<string, string[]> = {};
        Object.entries(parsed).forEach(([k, v]) => {
          normalized[k] = Array.isArray(v) ? (v as string[]) : [v as string];
        });
        setSelectedAnswers(normalized);
      }
      if (savedFlags) setFlaggedQuestions(JSON.parse(savedFlags));
      if (savedHistory) setAttemptHistory(JSON.parse(savedHistory));
    } catch (e) {
      // Fallback
      setActiveMockQuestions(generateDomainWeightedMockExam(CSA_FREE_60_QUESTIONS));
    }
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        const updated = prev - 1;
        try {
          localStorage.setItem("csa_mock_timer", String(updated));
        } catch (e) {}
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, selectedAnswers, flaggedQuestions]);

  const currentQuestions =
    activeMockQuestions.length > 0 ? activeMockQuestions : CSA_FREE_60_QUESTIONS;
  const currentQuestion = currentQuestions[currentIndex] || currentQuestions[0];
  const totalQuestions = currentQuestions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const currentSelections = selectedAnswers[currentQuestion?.id] || [];
  const requiredCount = currentQuestion?.requiredSelectCount || 1;

  const answeredCount = Object.keys(selectedAnswers).filter(
    (id) => selectedAnswers[id]?.length > 0
  ).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Handle option selection supporting single and multi-select
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

    const updated = {
      ...selectedAnswers,
      [currentQuestion.id]: updatedList,
    };
    setSelectedAnswers(updated);
    try {
      localStorage.setItem("csa_mock_answers", JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    const updated = {
      ...flaggedQuestions,
      [currentQuestion.id]: !flaggedQuestions[currentQuestion.id],
    };
    setFlaggedQuestions(updated);
    try {
      localStorage.setItem("csa_mock_flags", JSON.stringify(updated));
    } catch (e) {}
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

  // Check correctness of a question
  const checkIsCorrect = (q: PracticeQuestion, selections: string[] = []) => {
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    if (selections.length !== correctIds.length) return false;
    return correctIds.every((id) => selections.includes(id));
  };

  // Reset exam to start over with a fresh domain-weighted random sample
  const resetExam = () => {
    localStorage.removeItem("csa_mock_timer");
    localStorage.removeItem("csa_mock_answers");
    localStorage.removeItem("csa_mock_flags");
    localStorage.removeItem("csa_mock_active_qids");
    const fresh = generateDomainWeightedMockExam(CSA_FREE_60_QUESTIONS);
    setActiveMockQuestions(fresh);
    localStorage.setItem("csa_mock_active_qids", JSON.stringify(fresh.map((q) => q.id)));
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(TOTAL_TIME_SECONDS);
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowConfirmModal(false);
  };

  // Calculate Results
  const calculateResults = () => {
    let correctCount = 0;
    const domainScores: Record<string, { total: number; correct: number }> = {};
    const questionsToScore =
      activeMockQuestions.length > 0 ? activeMockQuestions : CSA_FREE_60_QUESTIONS;

    questionsToScore.forEach((q) => {
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

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= 70;

    return { correctCount, scorePercentage, passed, domainScores };
  };

  // Submit and record attempt
  const handleFinishExam = async () => {
    setShowConfirmModal(false);
    setIsCompleted(true);
    const results = calculateResults();
    const timeSpent = TOTAL_TIME_SECONDS - timeRemainingSeconds;

    const newRecord: MockAttemptRecord = {
      id: `attempt-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      scorePercentage: results.scorePercentage,
      passed: results.passed,
      timeSpentSeconds: timeSpent,
      correctAnswersCount: results.correctCount,
      totalQuestions,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("nexusd_csa_mock_history") || "[]"
      );
      const updated = [newRecord, ...existing.slice(0, 9)];
      localStorage.setItem("nexusd_csa_mock_history", JSON.stringify(updated));
      setAttemptHistory(updated);
    } catch (e) {}

    // Send attempt to server API
    try {
      setIsSubmitting(true);
      await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificationId: "csa",
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
  // Score Report View
  // =========================================================================
  if (isCompleted) {
    const results = calculateResults();
    const timeSpentSeconds = TOTAL_TIME_SECONDS - timeRemainingSeconds;

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Pass/Fail Header */}
        <div className="text-center space-y-3">
          <Badge
            variant={results.passed ? "success" : "destructive"}
            className="text-sm py-1.5 px-5 font-semibold"
          >
            {results.passed
              ? "OFFICIAL BENCHMARK PASSED (≥70%)"
              : "RE-STUDY RECOMMENDED (<70%)"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            CSA Full Timed Mock Exam Scorecard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Completed in {formatTimer(timeSpentSeconds)} • {results.correctCount} of {totalQuestions} Questions Correct
          </p>
        </div>

        {/* Big Score Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm p-6 md:p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-6xl md:text-7xl font-extrabold text-[#0B192C] dark:text-white font-mono">
              {results.scorePercentage}%
            </div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Passing Standard: 70% (42 / 60 required)
            </div>
          </div>

          <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {results.passed
              ? "Outstanding preparation! Your score satisfies the official ServiceNow Certified System Administrator standard. Review flagged questions below to polish final details."
              : "Keep practicing. Focus especially on domains scoring under 70% in the breakdown below before attempting the official exam."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button variant="default" onClick={resetExam} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Retake Full Mock Exam
            </Button>
            <Link href="/certifications/csa/practice">
              <Button variant="accent" className="gap-2">
                Practice Weak Domains <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!isPro && (
              <Button
                variant="outline"
                onClick={() => setShowSubModal(true)}
                className="gap-2 border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-500" /> Unlock Pro Vault & PDFs (₹499)
              </Button>
            )}
          </div>
        </Card>

        {/* Domain-by-Domain Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Domain Accuracy Breakdown (60 Questions)
          </h2>
          <div className="space-y-3">
            {Object.entries(results.domainScores).map(([domain, data]) => {
              const domainPercent = Math.round((data.correct / data.total) * 100);
              const isPassing = domainPercent >= 70;

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

        {/* Past Attempts History Table (if any) */}
        {attemptHistory.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#0066FF] dark:text-blue-400" />
              <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">Recent Mock Attempts</h2>
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

        {/* Question Review Section with Filter Pills */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
              Comprehensive Question Review
            </h2>

            {/* Filter Pills */}
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
              const origIndex = CSA_SEED_QUESTIONS.findIndex((item) => item.id === q.id);

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

                  {/* Explanation Callout */}
                  <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0066FF] dark:text-blue-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Architectural Explanation ({q.releaseVersion})
                      </div>
                      <button
                        type="button"
                        onClick={() => setReportingQuestion(q)}
                        className="text-[11px] text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Report question errata or syllabus discrepancy"
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

        {/* Pro Upgrade Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubModal}
          onClose={() => setShowSubModal(false)}
          reason="general"
        />

        {/* Errata Dispute Report Dialog */}
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
  // Active Timed Exam Runner View
  // =========================================================================
  const isFlagged = flaggedQuestions[currentQuestion.id];
  const isTimeUrgent = timeRemainingSeconds < 10 * 60; // < 10 minutes left

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header & Sticky Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        {/* Left: Mode & Question count */}
        <div className="flex items-center gap-3">
          <Badge variant="default" className="bg-[#0B192C] dark:bg-blue-600 text-white">
            Full Timed Mock (60 Questions)
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDrawer(true)}
            className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 dark:border-slate-700"
          >
            <Grid className="h-3.5 w-3.5" />
            Navigator ({answeredCount}/60)
          </Button>
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
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
            Aligned to {currentQuestion.releaseVersion}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Options List */}
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

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowDrawer(true)}
          className="gap-2 text-xs dark:border-slate-700"
        >
          <Grid className="h-4 w-4" /> Question List ({answeredCount}/60)
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            variant="accent"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="gap-2"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => setShowConfirmModal(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Review & Finish <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* =========================================================================
          60-Question Navigation Grid Drawer Modal
         ========================================================================= */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Exam Question Navigator (60 Questions)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDrawer(false)}
              >
                Close ✕
              </Button>
            </div>

            {/* Legend */}
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

            {/* Grid */}
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

      {/* =========================================================================
          Submission Confirmation Dialog
         ========================================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Exam?</h3>
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Are you sure you want to finish and submit your exam?</p>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{answeredCount} of 60</span>
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
                className="dark:border-slate-700"
              >
                Continue Exam
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleFinishExam}
              >
                Yes, Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
