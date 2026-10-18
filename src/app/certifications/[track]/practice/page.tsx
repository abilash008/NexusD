"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PracticeQuestion } from "@/data/csa-questions";
import {
  getExamConfig,
  generateTrackPracticeDrill,
  getFreeTrackQuestions,
  shuffleQuestionsAndOptions,
} from "@/lib/exam-engine";
import { getAllQuestions } from "@/lib/admin-questions";

function DynamicPracticeExamContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const trackId = ((params?.track as string) || "csa").toLowerCase();
  const examConfig = getExamConfig(trackId);
  const domainParam = searchParams.get("domain");

  const [selectedDomain, setSelectedDomain] = useState<string>(domainParam || "all");
  const [allTrackQuestions, setAllTrackQuestions] = useState<PracticeQuestion[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load questions dynamically from local storage and Neon DB API
  useEffect(() => {
    let isMounted = true;
    const targetDomain = domainParam && domainParam !== "all" ? domainParam : "all";
    setSelectedDomain(targetDomain);

    async function loadQuestions() {
      let pool = getAllQuestions(trackId);

      try {
        const res = await fetch(`/api/questions?cert=${trackId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.questions) && data.questions.length > 0) {
            pool = data.questions;
          }
        }
      } catch (err) {
        console.warn("[PracticeEngine] Remote fetch fallback to local pool:", err);
      }

      if (!isMounted) return;

      setAllTrackQuestions(pool);

      const filtered = targetDomain === "all"
        ? pool
        : pool.filter(
            (q) =>
              q.domainSlug?.toLowerCase() === targetDomain.toLowerCase() ||
              q.domain?.toLowerCase() === targetDomain.toLowerCase()
          );

      setActiveQuestions(shuffleQuestionsAndOptions(filtered));
      setCurrentIndex(0);
      setIsCompleted(false);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setIsLoaded(true);
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [trackId, domainParam]);

  // Handle domain change with instant shuffling and URL sync
  const handleDomainFilterChange = (slug: string) => {
    setSelectedDomain(slug);
    const filtered = slug === "all"
      ? allTrackQuestions
      : allTrackQuestions.filter(
          (q) =>
            q.domainSlug?.toLowerCase() === slug.toLowerCase() ||
            q.domain?.toLowerCase() === slug.toLowerCase()
        );

    setActiveQuestions(shuffleQuestionsAndOptions(filtered));
    setCurrentIndex(0);
    setIsCompleted(false);
    setSelectedAnswers({});
    setFlaggedQuestions({});

    // Synchronize browser URL query param
    try {
      const url = new URL(window.location.href);
      if (slug === "all") {
        url.searchParams.delete("domain");
      } else {
        url.searchParams.set("domain", slug);
      }
      window.history.replaceState({}, "", url.toString());
    } catch (e) {}
  };

  // Timer loop
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Bounds
  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const currentSelections = selectedAnswers[currentQuestion?.id] || [];
  const requiredCount = currentQuestion?.requiredSelectCount || 1;
  const isQuestionAnswered = currentQuestion?.isMultiSelect
    ? currentSelections.length >= requiredCount
    : currentSelections.length > 0;

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    if (currentQuestion.isMultiSelect) {
      let updated: string[];
      if (currentSelections.includes(optionId)) {
        updated = currentSelections.filter((id) => id !== optionId);
      } else {
        if (currentSelections.length >= requiredCount) {
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
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const checkIsCorrect = (q: PracticeQuestion, selections: string[] = []) => {
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    if (selections.length !== correctIds.length) return false;
    return correctIds.every((id) => selections.includes(id));
  };

  const handleFinishPractice = () => {
    setIsCompleted(true);
  };

  const resetPractice = () => {
    handleDomainFilterChange(selectedDomain);
  };

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent mx-auto" />
        <p className="text-sm text-slate-500">Loading {examConfig.code} practice drill...</p>
      </div>
    );
  }

  if (activeQuestions.length === 0) {
    // SCENARIO 1: The entire track has ZERO questions uploaded
    if (allTrackQuestions.length === 0) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
          <Badge variant="outline" className="text-xs py-1 px-3">
            {examConfig.code} Question Bank Status
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {examConfig.title} Practice Engine
          </h1>
          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Question Bank Awaiting Upload
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Official examination questions for {examConfig.title} ({examConfig.code}) are currently being verified against official ServiceNow documentation and uploaded to the database. Practice drills will be enabled as soon as the question vault is populated.
                </p>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link href={`/certifications/${trackId}`} className="flex-1">
                <Button variant="outline" className="w-full text-xs cursor-pointer">
                  ← Return to {examConfig.code} Hub
                </Button>
              </Link>
              <Link href="/certifications" className="flex-1">
                <Button variant="default" className="w-full text-xs gap-1.5 cursor-pointer">
                  Explore All Certifications <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    // SCENARIO 2: Questions exist in the track, but this specific filtered domain has 0 questions
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <Badge variant="outline" className="text-xs py-1 px-3">
          {examConfig.code} Domain Filter
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          No Questions Found for this Domain
        </h1>
        <Card className="p-6 text-left border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            There are currently no questions cataloged under this specific domain for {examConfig.title}. There are {allTrackQuestions.length} practice questions available across other domains.
          </p>
          <div className="flex gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleDomainFilterChange("all")}
              className="text-xs cursor-pointer gap-1.5"
            >
              View All Domains ({allTrackQuestions.length} Questions) <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Link href={`/certifications/${trackId}`}>
              <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                Return to {examConfig.code} Hub
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Summary View
  if (isCompleted) {
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      const selections = selectedAnswers[q.id] || [];
      if (checkIsCorrect(q, selections)) correctCount += 1;
    });
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassing = percentage >= (examConfig.passingPercentage || 70);

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant={isPassing ? "success" : "warning"} className="text-xs py-1 px-3">
            {isPassing ? "BENCHMARK MET (≥70%)" : "PRACTICE RECOMMENDED (<70%)"}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {examConfig.code} Practice Drill Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Time elapsed: {formatTimer(timeElapsedSeconds)} • {correctCount} of {totalQuestions} Correct ({percentage}%)
          </p>
        </div>

        <Card className="p-6 sm:p-8 text-center space-y-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white">
            {percentage}%
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {isPassing
              ? `Great job! You showed strong understanding across ${selectedDomain === "all" ? "all domains" : selectedDomain}. Ready for the real test?`
              : "Review the question rationales below to reinforce official ServiceNow architecture concepts."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="default" onClick={resetPractice} className="gap-2 cursor-pointer">
              <RotateCcw className="h-4 w-4" /> Practice Again
            </Button>
            <Link href={`/certifications/${trackId}/mock`}>
              <Button variant="accent" className="gap-2 cursor-pointer">
                Launch {examConfig.durationMinutes || 90}-Min Timed Mock <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Detailed Review */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Question Drill Review</h2>
          <div className="space-y-4">
            {activeQuestions.map((q, idx) => {
              const userChoices = selectedAnswers[q.id] || [];
              const isCorrect = checkIsCorrect(q, userChoices);

              return (
                <Card key={q.id} className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" className="text-xs">{q.domain}</Badge>
                    <Badge variant={isCorrect ? "success" : "destructive"} className="text-xs">
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {idx + 1}. {q.questionText}
                  </p>
                  <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 p-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-[#0066FF] dark:text-blue-400 block pb-1">
                      Architectural Justification:
                    </span>
                    {q.explanation}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Drill Runner
  const isFlagged = flaggedQuestions[currentQuestion?.id];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/certifications/${trackId}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <ArrowLeft className="h-4 w-4" /> {examConfig.code} Hub
            </Button>
          </Link>
          <Badge variant="accent" className="text-xs">
            {examConfig.code} Practice Mode (Untimed)
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Clock className="h-3.5 w-3.5" /> {formatTimer(timeElapsedSeconds)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFlag}
            className={`gap-1.5 text-xs cursor-pointer ${
              isFlagged ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800" : ""
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
            {isFlagged ? "Flagged" : "Flag"}
          </Button>
        </div>
      </div>

      {/* Domain Filter Pills */}
      {examConfig.domains && examConfig.domains.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Filter Domain:</span>
          <button
            type="button"
            onClick={() => handleDomainFilterChange("all")}
            className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer shrink-0 ${
              selectedDomain === "all"
                ? "bg-[#0B192C] dark:bg-blue-600 text-white font-semibold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Domains (60 Qs)
          </button>
          {examConfig.domains.map((dom) => {
            const count = getFreeTrackQuestions(trackId).filter(
              (q) => q.domainSlug === dom.slug || q.domain === dom.name
            ).length;
            return (
              <button
                key={dom.slug}
                type="button"
                onClick={() => handleDomainFilterChange(dom.slug)}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedDomain === dom.slug
                    ? "bg-[#0066FF] text-white font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>{dom.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedDomain === dom.slug
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {count > 0 ? `${count} Qs` : `${dom.weight}%`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPercent)}% Completed</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex justify-between items-center">
            <Badge variant="accent" className="text-xs">{currentQuestion.domain}</Badge>
            {currentQuestion.isMultiSelect && (
              <Badge variant="warning" className="text-xs gap-1 font-semibold">
                <CheckSquare className="h-3 w-3" />
                Choose {requiredCount} ({currentSelections.length} of {requiredCount} selected)
              </Badge>
            )}
          </div>

          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelections.includes(option.id);
              const hasAnswered = isQuestionAnswered;
              const isCorrect = option.isCorrect;

              let optClass = "border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200";
              if (hasAnswered) {
                if (isCorrect) {
                  optClass = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold";
                } else if (isSelected && !isCorrect) {
                  optClass = "border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200";
                }
              } else if (isSelected) {
                optClass = "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0B192C] font-semibold";
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex items-center justify-between ${optClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center text-xs ${
                        currentQuestion.isMultiSelect ? "rounded-md" : "rounded-full"
                      } border ${
                        isSelected
                          ? "border-[#0066FF] bg-[#0066FF] text-white"
                          : "border-slate-300 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-sm">{option.text}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      Correct Answer
                    </span>
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                      Your Choice
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instant Feedback Explanation (Reveals once answered) */}
          {isQuestionAnswered && (
            <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
              <div className="font-bold text-[#0066FF] dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Architectural Explanation
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="gap-2 cursor-pointer text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            variant="accent"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="gap-2 cursor-pointer text-xs font-semibold"
          >
            Next Question <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleFinishPractice}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-bold"
          >
            Complete Drill <CheckCircle2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function DynamicPracticeExamPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent mx-auto" />
        </div>
      }
    >
      <DynamicPracticeExamContent />
    </Suspense>
  );
}
