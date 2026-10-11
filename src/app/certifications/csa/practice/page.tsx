"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Filter,
  Check,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CSA_FREE_60_QUESTIONS,
  CSA_DOMAINS_INFO,
  generateDomainWeightedMockExam,
  shuffleQuestions,
  type PracticeQuestion,
} from "@/data/csa-questions";

function getDomainPracticeQuestions(slug: string): PracticeQuestion[] {
  if (slug === "all") {
    return shuffleQuestions(CSA_FREE_60_QUESTIONS);
  }
  const domInfo = CSA_DOMAINS_INFO.find((d) => d.slug === slug);
  const targetCount = domInfo?.questionCount || 12;
  const pool = CSA_FREE_60_QUESTIONS.filter((q) => q.domainSlug === slug);
  return shuffleQuestions(pool).slice(0, targetCount);
}

function CSAPracticeExamContent() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");

  const [selectedDomain, setSelectedDomain] = useState<string>(domainParam || "all");
  // Deterministic baseline for SSR to prevent hydration mismatch
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>(() => {
    if (domainParam && domainParam !== "all") {
      const match = CSA_FREE_60_QUESTIONS.filter((q) => q.domainSlug === domainParam);
      return match.length > 0 ? match : CSA_FREE_60_QUESTIONS;
    }
    return CSA_FREE_60_QUESTIONS;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle questions on initial client mount to provide random practice experience
  useEffect(() => {
    setActiveQuestions(getDomainPracticeQuestions(domainParam || "all"));
  }, []);

  // Sync domain from URL search params if present
  useEffect(() => {
    if (domainParam && CSA_DOMAINS_INFO.some((d) => d.slug === domainParam)) {
      setSelectedDomain(domainParam);
      setActiveQuestions(getDomainPracticeQuestions(domainParam));
      setCurrentIndex(0);
      setIsCompleted(false);
      setSelectedAnswers({});
      setFlaggedQuestions({});
    }
  }, [domainParam]);

  // Safe question bounds
  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // Active user selections for current question
  const currentSelections = selectedAnswers[currentQuestion.id] || [];
  const requiredCount = currentQuestion.requiredSelectCount || 1;
  const isQuestionAnswered = currentQuestion.isMultiSelect
    ? currentSelections.length >= requiredCount
    : currentSelections.length > 0;

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Option selection handler supporting single and multi-select
  const handleSelectOption = (optionId: string) => {
    if (currentQuestion.isMultiSelect) {
      let updated: string[];
      if (currentSelections.includes(optionId)) {
        updated = currentSelections.filter((id) => id !== optionId);
      } else {
        if (currentSelections.length >= requiredCount) {
          // Replace first selection if maximum required count is already reached
          updated = [...currentSelections.slice(1), optionId];
        } else {
          updated = [...currentSelections, optionId];
        }
      }
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: updated,
      }));
    } else {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: [optionId],
      }));
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleDomainChange = (slug: string) => {
    setSelectedDomain(slug);
    setActiveQuestions(getDomainPracticeQuestions(slug));
    setCurrentIndex(0);
    setIsCompleted(false);
    setSelectedAnswers({});
    setFlaggedQuestions({});
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Check correctness of a question
  const checkIsCorrect = (q: PracticeQuestion, selections: string[] = []) => {
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    if (selections.length !== correctIds.length) return false;
    return correctIds.every((id) => selections.includes(id));
  };

  // Calculate Results
  const calculateResults = () => {
    let correctCount = 0;
    const domainScores: Record<string, { total: number; correct: number }> = {};

    activeQuestions.forEach((q) => {
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

  // Complete exam and persist attempt telemetry
  const handleFinishPractice = async () => {
    setIsCompleted(true);
    const results = calculateResults();

    const telemetryPayload = {
      certificationId: "csa",
      mode: "practice",
      totalQuestions,
      correctAnswersCount: results.correctCount,
      scorePercentage: results.scorePercentage,
      passed: results.passed,
      timeSpentSeconds: timeElapsedSeconds,
      domainScores: results.domainScores,
      answers: activeQuestions.map((q) => ({
        questionId: q.id,
        selectedOptionIds: selectedAnswers[q.id] || [],
        isCorrect: checkIsCorrect(q, selectedAnswers[q.id]),
        isFlagged: Boolean(flaggedQuestions[q.id]),
      })),
    };

    // Store attempt in localStorage for local history tracking
    try {
      const existingHistory = JSON.parse(
        localStorage.getItem("nexusd_csa_practice_history") || "[]"
      );
      const newEntry = {
        id: `prac-${Date.now()}`,
        date: new Date().toISOString(),
        scorePercentage: results.scorePercentage,
        passed: results.passed,
        timeSpentSeconds: timeElapsedSeconds,
        domain: selectedDomain,
        correctCount: results.correctCount,
        totalQuestions,
      };
      localStorage.setItem(
        "nexusd_csa_practice_history",
        JSON.stringify([newEntry, ...existingHistory.slice(0, 9)])
      );
    } catch (e) {}

    // Send attempt to server API
    try {
      setIsSubmitting(true);
      await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetryPayload),
      });
    } catch (e) {
      console.warn("Failed to sync attempt to server:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Score Report View
  if (isCompleted) {
    const results = calculateResults();

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge
            variant={results.passed ? "success" : "destructive"}
            className="text-sm py-1 px-4"
          >
            {results.passed ? "Practice Benchmark Met (≥70%)" : "Review Recommended (<70%)"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] tracking-tight">
            Practice Engine — Certification Preparation Results
          </h1>
          <p className="text-slate-600 text-sm">
            Completed in {formatTime(timeElapsedSeconds)} • {results.correctCount} of {totalQuestions} Correct
          </p>
        </div>

        {/* Big Score Card */}
        <Card className="border-slate-200 shadow-sm p-6 md:p-8 text-center space-y-4">
          <div className="text-6xl font-extrabold text-[#0B192C]">
            {results.scorePercentage}%
          </div>
          <div className="max-w-md mx-auto text-sm text-slate-600">
            {results.passed
              ? "Strong performance! You are demonstrating solid grasp of this domain section."
              : "Review the question explanations below to build confidence before scheduling the official exam."}
          </div>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="default"
              onClick={() => {
                setActiveQuestions(getDomainPracticeQuestions(selectedDomain));
                setIsCompleted(false);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setFlaggedQuestions({});
                setTimeElapsedSeconds(0);
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Retake Practice Drill
            </Button>
            <Link href="/certifications/csa/mock">
              <Button variant="accent" className="gap-2">
                Launch 90-Min Full Timed Mock <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Domain-by-Domain Score Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B192C]">
            Domain Accuracy Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(results.domainScores).map(([domain, data]) => {
              const domainPercent = Math.round((data.correct / data.total) * 100);
              const isDomainPassing = domainPercent >= 70;

              return (
                <div
                  key={domain}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{domain}</span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        isDomainPassing ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {data.correct} / {data.total} ({domainPercent}%)
                    </span>
                  </div>
                  <Progress
                    value={domainPercent}
                    indicatorColor={isDomainPassing ? "bg-emerald-500" : "bg-amber-500"}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-[#0B192C]">
            Detailed Question Explanations
          </h2>
          <div className="space-y-6">
            {activeQuestions.map((q, idx) => {
              const userChoices = selectedAnswers[q.id] || [];
              const isUserCorrect = checkIsCorrect(q, userChoices);

              return (
                <Card key={q.id} className="border-slate-200 shadow-2xs space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-xs">
                        {q.domain}
                      </Badge>
                      {q.isMultiSelect && (
                        <Badge variant="accent" className="text-[11px]">
                          Choose {q.requiredSelectCount}
                        </Badge>
                      )}
                    </div>
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

                  <p className="text-base font-semibold text-slate-900">
                    {q.questionText}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = userChoices.includes(opt.id);
                      const isCorrect = opt.isCorrect;

                      let optClass = "border-slate-200 bg-slate-50 text-slate-700";
                      if (isCorrect) {
                        optClass = "border-emerald-400 bg-emerald-50/70 text-emerald-950 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optClass = "border-red-400 bg-red-50/70 text-red-950";
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
                                  ? "border-emerald-500 text-emerald-600"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected ? "✓" : isCorrect ? "•" : ""}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-bold uppercase text-emerald-700">
                              Correct Answer
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-[10px] font-bold uppercase text-red-700">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Callout */}
                  <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-4 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#0066FF] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Architectural Explanation ({q.releaseVersion})
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Runner View
  const isFlagged = flaggedQuestions[currentQuestion.id];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Domain Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter Domain:
        </span>
        <button
          onClick={() => handleDomainChange("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedDomain === "all"
              ? "bg-[#0066FF] text-white font-semibold"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All Domains (60)
        </button>
        {CSA_DOMAINS_INFO.map((dom) => (
          <button
            key={dom.slug}
            onClick={() => handleDomainChange(dom.slug)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedDomain === dom.slug
                ? "bg-[#0066FF] text-white font-semibold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {dom.name} ({dom.questionCount})
          </button>
        ))}
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Badge variant="accent" className="font-medium">
            Practice Engine • Instant Feedback
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatTime(timeElapsedSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFlag}
            className={`gap-1.5 ${isFlagged ? "border-amber-400 bg-amber-50 text-amber-800" : ""}`}
          >
            <Bookmark className={`h-4 w-4 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
            {isFlagged ? "Flagged" : "Flag Question"}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleFinishPractice}
            className="text-xs"
          >
            Finish Practice Drill
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progressPercent)}% Completed</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      {/* Main Question Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-sm p-6 md:p-8 space-y-6 transition-colors">
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

            let cardStyle =
              "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1524] hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-200";

            if (isSelected) {
              cardStyle = "border-2 border-[#0066FF] dark:border-[#38BDF8] bg-blue-50/50 dark:bg-blue-950/40 text-[#0B192C] dark:text-white font-semibold";
            }

            // In Practice Mode: reveal correctness after answering full requirement
            if (isQuestionAnswered) {
              if (option.isCorrect) {
                cardStyle = "border-2 border-emerald-500 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold";
              } else if (isSelected && !option.isCorrect) {
                cardStyle = "border-2 border-red-500 dark:border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200";
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all flex items-center justify-between ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center text-xs transition-colors ${
                      currentQuestion.isMultiSelect ? "rounded-md" : "rounded-full"
                    } border ${
                      isSelected
                        ? "border-[#0066FF] bg-[#0066FF] text-white"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>

                {isQuestionAnswered && option.isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isQuestionAnswered && isSelected && !option.isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Practice Mode Explanation Box (revealed when question is answered) */}
        {isQuestionAnswered && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 p-5 space-y-2 mt-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Verified Explanation & Blueprint Insight
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </Card>

      {/* Bottom Navigation Drawer */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm sm:max-w-md px-2 py-1">
          {activeQuestions.map((q, idx) => {
            const isAns = (selectedAnswers[q.id]?.length || 0) > 0;
            const isCur = idx === currentIndex;
            const isFlg = flaggedQuestions[q.id];

            let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
            if (isCur) badgeStyle = "bg-[#0B192C] dark:bg-blue-600 text-white ring-2 ring-[#0066FF]";
            else if (isFlg) badgeStyle = "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700";
            else if (isAns) badgeStyle = "bg-blue-100 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-300";

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-7 w-7 shrink-0 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

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
            variant="accent"
            onClick={handleFinishPractice}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Finish & View Score <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CSAPracticeExamPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500 font-mono">Loading Practice Engine...</p>
        </div>
      }
    >
      <CSAPracticeExamContent />
    </Suspense>
  );
}
