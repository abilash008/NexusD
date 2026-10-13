"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Zap,
  Layers,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  Award,
  Lock,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import { ReportQuestionDialog } from "@/components/questions/report-question-dialog";
import { getAllQuestions } from "@/lib/admin-questions";
import { getExamConfig } from "@/lib/exam-engine";
import { useEntitlements } from "@/hooks/use-entitlements";
import { PracticeQuestion } from "@/data/csa-questions";

type ExportMode = "exam_paper" | "answer_key" | "master_guide";

export default function DynamicQuestionBankPage() {
  const params = useParams();
  const trackId = ((params?.track as string) || "csa").toLowerCase();
  const examConfig = getExamConfig(trackId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [expandedExplanations, setExpandedExplanations] = useState<
    Record<string, boolean>
  >({});
  const [showAllExplanations, setShowAllExplanations] = useState(false);

  // Pagination State (Default 10 questions per page, user-selectable)
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionListRef = React.useRef<HTMLDivElement>(null);

  const scrollToQuestionsTop = () => {
    if (questionListRef.current) {
      const yOffset = -80;
      const y =
        questionListRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Export Modal & Print settings
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>("master_guide");
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all");

  // Subscription Paywall State
  const { isFeatureUnlocked } = useEntitlements();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLegacySubscribed, setIsLegacySubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionReason, setSubscriptionReason] = useState<"export_pdf" | "unlock_questions" | "general">("general");

  // Questions and Errata Reporting State
  const [questionsData, setQuestionsData] = useState<PracticeQuestion[]>([]);
  const [reportingQuestion, setReportingQuestion] = useState<PracticeQuestion | null>(null);

  useEffect(() => {
    setHasMounted(true);
    try {
      if (localStorage.getItem("nexusd_pro_subscribed") === "true") {
        setIsLegacySubscribed(true);
      }
    } catch (e) {}

    // Synchronize questions with admin updates & overrides
    setQuestionsData(getAllQuestions(trackId));
    const handleQuestionsUpdate = () => {
      setQuestionsData(getAllQuestions(trackId));
    };
    window.addEventListener("nexusd_questions_updated", handleQuestionsUpdate);
    return () => {
      window.removeEventListener("nexusd_questions_updated", handleQuestionsUpdate);
    };
  }, [trackId]);

  const isSubscribed = isFeatureUnlocked(trackId) || isLegacySubscribed;

  // Filter questions based on active UI filters
  const filteredQuestions = useMemo(() => {
    return questionsData.filter((q) => {
      // Domain filter
      if (selectedDomain !== "all" && q.domainSlug !== selectedDomain) {
        return false;
      }
      // Type filter
      if (selectedType === "single" && q.isMultiSelect) return false;
      if (selectedType === "multi" && !q.isMultiSelect) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesExplanation = q.explanation.toLowerCase().includes(query);
        const matchesOptions = q.options.some((o) =>
          o.text.toLowerCase().includes(query)
        );
        if (!matchesText && !matchesExplanation && !matchesOptions) return false;
      }
      return true;
    });
  }, [questionsData, searchQuery, selectedDomain, selectedType]);

  const totalQuestionsCount = filteredQuestions.length;
  const totalPages =
    pageSize === -1
      ? 1
      : Math.max(1, Math.ceil(totalQuestionsCount / pageSize));

  // Reset to page 1 whenever filters or page size change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDomain, selectedType, pageSize]);

  // Paginated questions slice for the active page
  const paginatedQuestions = useMemo(() => {
    if (pageSize === -1) return filteredQuestions;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis-start");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-end");
    }

    pages.push(totalPages);
    return pages;
  };

  // Questions to be exported for print
  const exportQuestionsList = useMemo(() => {
    if (exportScope === "filtered") {
      return filteredQuestions;
    }
    return questionsData;
  }, [exportScope, filteredQuestions, questionsData]);

  // Interactive answer handler
  const handleSelectOption = (question: PracticeQuestion, optionId: string) => {
    const current = userAnswers[question.id] || [];
    let updated: string[];

    if (question.isMultiSelect) {
      if (current.includes(optionId)) {
        updated = current.filter((id) => id !== optionId);
      } else {
        const limit = question.requiredSelectCount || 2;
        if (current.length >= limit) {
          updated = [...current.slice(1), optionId];
        } else {
          updated = [...current, optionId];
        }
      }
    } else {
      updated = [optionId];
    }

    setUserAnswers((prev) => ({ ...prev, [question.id]: updated }));
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllExplanations = () => {
    const nextVal = !showAllExplanations;
    setShowAllExplanations(nextVal);
    const updated: Record<string, boolean> = {};
    questionsData.forEach((q) => {
      updated[q.id] = nextVal;
    });
    setExpandedExplanations(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* =====================================================================
          SCREEN-ONLY VIEW
         ===================================================================== */}
      <div className="print:hidden mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/study"
            className="hover:text-blue-600 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Study Blueprints
          </Link>
          <span>/</span>
          <Link
            href={`/study/${trackId}`}
            className="hover:text-blue-600 font-medium"
          >
            {examConfig.code} Guides
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {examConfig.code} Master Question Bank
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" className="text-xs">
                Master Question Bank
              </Badge>
              <Badge variant="outline" className="text-xs font-mono dark:border-slate-700">
                {questionsData.length} Verified Questions
              </Badge>
              <Badge variant="success" className="text-xs font-semibold">
                Free Tier Included
              </Badge>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {examConfig.releaseVersion || "Australia & Brazil Releases"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
              ServiceNow {examConfig.code} Master Question Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore and practice the complete repository of {examConfig.title} blueprint questions in-browser, or generate pristine printable PDFs formatted in 3 customizable modes for offline revision.
            </p>
          </div>

          {/* PDF Export Trigger Button */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                if (!isSubscribed) {
                  setSubscriptionReason("export_pdf");
                  setShowSubscriptionModal(true);
                } else {
                  setShowExportModal(true);
                }
              }}
              className="gap-2 shadow-sm font-semibold cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export to PDF / Print
            </Button>
            <Link href={`/certifications/${trackId}/mock`}>
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto dark:border-slate-700 dark:hover:bg-slate-800">
                <Zap className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" /> {examConfig.durationMinutes || 90}-Min Mock Exam
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-4 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions by keyword or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0E1524] text-slate-800 dark:text-white focus:bg-white dark:focus:bg-[#0E1524] focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Question Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                Type:
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1524] py-2 px-3 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="all">All Question Types</option>
                <option value="single">Single Choice Only</option>
                <option value="multi">Multi-Select Only</option>
              </select>
            </div>

            {/* Toggle All Explanations */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllExplanations}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 shrink-0"
            >
              {showAllExplanations ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" /> Hide All
                  Explanations
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Reveal All
                  Explanations
                </>
              )}
            </Button>
          </div>

          {/* Domain Category Tabs */}
          {examConfig.domains && examConfig.domains.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedDomain("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDomain === "all"
                    ? "bg-[#0066FF] text-white font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All Domains ({questionsData.length})
              </button>
              {examConfig.domains.map((dom) => {
                const count = questionsData.filter(
                  (q) => q.domainSlug === dom.slug || q.domain === dom.name
                ).length;
                return (
                  <button
                    key={dom.slug}
                    onClick={() => setSelectedDomain(dom.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedDomain === dom.slug
                        ? "bg-[#0066FF] text-white font-semibold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{dom.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        selectedDomain === dom.slug
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter Banner & Top Page Size Selector */}
        <div
          ref={questionListRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-1"
        >
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {totalQuestionsCount === 0
                ? "0"
                : `${(currentPage - 1) * (pageSize === -1 ? totalQuestionsCount : pageSize) + 1}–${
                    pageSize === -1
                      ? totalQuestionsCount
                      : Math.min(currentPage * pageSize, totalQuestionsCount)
                  }`}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {totalQuestionsCount}
            </span>{" "}
            questions
            {totalQuestionsCount !== questionsData.length && (
              <span className="text-slate-500 dark:text-slate-400">
                {" "}
                (filtered from {questionsData.length})
              </span>
            )}
            {searchQuery && (
              <span className="ml-1 text-[#0066FF] dark:text-[#38BDF8]">
                matching "{searchQuery}"
              </span>
            )}
          </div>

          {/* Quick Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131D31] text-slate-800 dark:text-slate-200 px-2.5 py-1 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#0066FF] cursor-pointer"
            >
              <option value={10}>10 questions</option>
              <option value={20}>20 questions</option>
              <option value={25}>25 questions</option>
              <option value={50}>50 questions</option>
              <option value={-1}>All ({totalQuestionsCount})</option>
            </select>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-5">
          {filteredQuestions.length === 0 ? (
            <Card className="p-12 text-center space-y-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]">
              <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No questions matched your search criteria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try searching for broader terms or reset domain filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                  setSelectedType("all");
                }}
              >
                Reset All Filters
              </Button>
            </Card>
          ) : (
            paginatedQuestions.map((q, idx) => {
              const questionGlobalIndex =
                (currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + idx + 1;
              const userSelections = userAnswers[q.id] || [];
              const isAnswered = userSelections.length > 0;
              const isExplanationOpen =
                showAllExplanations || Boolean(expandedExplanations[q.id]);

              if (!isSubscribed && !q.isFree) {
                return (
                  <Card
                    key={q.id}
                    className="relative overflow-hidden border border-amber-500/30 dark:border-amber-500/20 p-5 sm:p-6 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-[#1A1813] dark:via-[#131D31] dark:to-[#171A24] shadow-xs space-y-4"
                  >
                    {/* Locked Question Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="accent" className="text-[11px]">
                          {q.domain}
                        </Badge>
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] gap-1 font-semibold">
                          <Lock className="h-3 w-3" /> Pro Blueprint Vault
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        Pro Question
                      </span>
                    </div>

                    {/* Obfuscated Stem & Upgrade Prompt */}
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white filter blur-[3px] select-none opacity-50">
                        {q.questionText}
                      </p>
                      <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-500/5 dark:bg-amber-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            Pro Vault Question
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Upgrade to NexusD Pro to unlock full questions, verified explanations, and 3-mode PDF export for offline study.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSubscriptionReason("unlock_questions");
                            setShowSubscriptionModal(true);
                          }}
                          className="shrink-0 font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                        >
                          Unlock Pro Track <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              }

              return (
                <Card
                  key={q.id}
                  className="p-5 sm:p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-5 transition-colors"
                >
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] font-mono text-xs font-bold border border-blue-100 dark:border-blue-900/60">
                        {questionGlobalIndex}
                      </span>
                      <Badge variant="accent" className="text-[11px]">
                        {q.domain}
                      </Badge>
                      {q.isMultiSelect ? (
                        <Badge variant="outline" className="text-[11px] font-mono dark:border-slate-700">
                          Multi-Select (Choose {q.requiredSelectCount || 2})
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">
                          Single Choice
                        </Badge>
                      )}
                      {q.isFree && (
                        <Badge variant="success" className="text-[10px]">
                          Free Tier
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {q.id.toUpperCase()}
                      </span>
                      <button
                        onClick={() => setReportingQuestion(q)}
                        className="text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 p-1 rounded-md transition-colors"
                        title="Report errata / question dispute"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.questionText}
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = userSelections.includes(opt.id);
                      const isCorrect = opt.isCorrect;

                      let optionStyle =
                        "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0E1524] text-slate-700 dark:text-slate-300";

                      if (isSelected) {
                        if (isAnswered) {
                          optionStyle = isCorrect
                            ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-medium"
                            : "border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 font-medium";
                        } else {
                          optionStyle =
                            "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/30 text-[#0066FF] dark:text-[#38BDF8] font-medium";
                        }
                      } else if (isAnswered && isCorrect && isExplanationOpen) {
                        optionStyle =
                          "border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 border-dashed";
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(q, opt.id)}
                          className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all text-xs sm:text-sm ${optionStyle}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {q.isMultiSelect ? (
                              isSelected ? (
                                <CheckSquare className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-400" />
                              )
                            ) : (
                              <span
                                className={`flex h-4 w-4 rounded-full border text-[10px] items-center justify-center font-bold ${
                                  isSelected
                                    ? "border-[#0066FF] bg-[#0066FF] text-white"
                                    : "border-slate-300 dark:border-slate-600 text-slate-500"
                                }`}
                              >
                                {letter}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 leading-snug">
                            {opt.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation Button & Content */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExplanation(q.id)}
                        className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto"
                      >
                        {isExplanationOpen ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Hide Architectural Justification
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Reveal Verified Answer & Explanation
                          </>
                        )}
                      </Button>
                    </div>

                    {isExplanationOpen && (
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          Correct Answer Keys:{" "}
                          <span className="font-mono text-emerald-700 dark:text-emerald-300">
                            {q.options
                              .filter((o) => o.isCorrect)
                              .map((o) => o.text)
                              .join(" & ")}
                          </span>
                        </div>
                        <p>{q.explanation}</p>
                        <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700">
                          Blueprint Standards: {q.releaseVersion || examConfig.releaseVersion}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  scrollToQuestionsTop();
                }}
                disabled={currentPage === 1}
                className="gap-1 text-xs dark:border-slate-700"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </Button>

              {getPageNumbers().map((p, pIdx) => {
                if (p === "ellipsis-start" || p === "ellipsis-end") {
                  return (
                    <span key={`ell-${pIdx}`} className="px-2 text-xs text-slate-400">
                      …
                    </span>
                  );
                }
                const pageNum = p as number;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      scrollToQuestionsTop();
                    }}
                    className={`h-8 w-8 p-0 text-xs ${
                      currentPage === pageNum ? "font-bold" : "dark:border-slate-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  scrollToQuestionsTop();
                }}
                disabled={currentPage === totalPages}
                className="gap-1 text-xs dark:border-slate-700"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Paywall Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        reason={subscriptionReason}
      />

      {/* Errata Dispute Report Modal Dialog */}
      <ReportQuestionDialog
        isOpen={Boolean(reportingQuestion)}
        onClose={() => setReportingQuestion(null)}
        questionId={reportingQuestion?.id || ""}
        domainName={reportingQuestion?.domain}
        questionSnippet={reportingQuestion?.questionText}
      />

      {/* PDF Export Settings Dialog */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-lg p-6 bg-white dark:bg-[#131D31] border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-[#0066FF]" /> 3-Mode Native PDF Exporter
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select export formatting mode for ServiceNow {examConfig.code}
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Mode 1: Exam Paper */}
              <div
                onClick={() => setExportMode("exam_paper")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  exportMode === "exam_paper"
                    ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Mode 1: Exam Paper (Practice Test)
                  </span>
                  <Badge variant="outline" className="text-[10px]">Blank Paper</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Questions and options with blank checkboxes. No answers or explanations revealed.
                </p>
              </div>

              {/* Mode 2: Revision Key */}
              <div
                onClick={() => setExportMode("answer_key")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  exportMode === "answer_key"
                    ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Mode 2: Quick Revision Key Sheet
                  </span>
                  <Badge variant="success" className="text-[10px]">Keys Marked</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Questions and options with correct answers highlighted [✓] for rapid memorization.
                </p>
              </div>

              {/* Mode 3: Master Guide */}
              <div
                onClick={() => setExportMode("master_guide")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  exportMode === "master_guide"
                    ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Mode 3: Master Architectural Guide
                  </span>
                  <Badge variant="accent" className="text-[10px]">Full Explanations</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Questions, options, verified answers, and technical architecture justifications.
                </p>
              </div>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Scope:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportScope("all")}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    exportScope === "all"
                      ? "border-[#0066FF] bg-blue-50/40 text-blue-900 dark:text-blue-300 font-semibold"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">All Questions</div>
                  <div className="text-[11px] text-slate-500">
                    Full bank ({questionsData.length} Qs)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope("filtered")}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    exportScope === "filtered"
                      ? "border-[#0066FF] bg-blue-50/40 text-blue-900 dark:text-blue-300 font-semibold"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">Filtered Results</div>
                  <div className="text-[11px] text-slate-500">
                    Active filters ({filteredQuestions.length} Qs)
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  setShowExportModal(false);
                  setTimeout(() => handlePrint(), 300);
                }}
                className="gap-2 font-semibold"
              >
                <Printer className="h-4 w-4" /> Print / Save as PDF
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* =====================================================================
          PRINT-ONLY HIGH FIDELITY LAYOUT (ACTIVE ONLY WHEN window.print() FIRES)
         ===================================================================== */}
      <div className="hidden print:block p-8 bg-white text-black font-sans leading-relaxed">
        <style jsx global>{`
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
            .page-break-avoid {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
            @page {
              margin: 1.5cm;
              size: A4 portrait;
            }
          }
        `}</style>

        {/* Printable Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">
                NexusD — Certification Practice Engine
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                ServiceNow {examConfig.title} Examination
              </div>
              <div className="text-xs text-slate-600 font-mono mt-0.5">
                Official Blueprint Syllabus • {examConfig.releaseVersion || "Australia & Brazil Releases"}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 text-xs font-bold font-mono border border-slate-900 rounded uppercase">
                {exportMode === "exam_paper" && "MODE 1: EXAM PAPER"}
                {exportMode === "answer_key" && "MODE 2: REVISION KEY"}
                {exportMode === "master_guide" && "MODE 3: MASTER STUDY GUIDE"}
              </span>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Total Questions: {exportQuestionsList.length}
              </div>
            </div>
          </div>

          {/* Candidate exam sheet form header (Only for Mode 1 Exam Paper) */}
          {exportMode === "exam_paper" && (
            <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>Candidate Name: _____________________</div>
              <div>Date: ________________</div>
              <div>Score: _____ / {exportQuestionsList.length}</div>
            </div>
          )}

          {/* Instructions Block */}
          <div className="mt-3 text-[11px] text-slate-600 italic">
            {exportMode === "exam_paper" &&
              "Instructions: Read each question carefully. Select the best answer for single-choice questions, or the specified number of options for multi-select questions."}
            {exportMode === "answer_key" &&
              "Quick Reference Key: Verified answers are indicated with [✓] and bolded text for swift benchmark memorization."}
            {exportMode === "master_guide" &&
              "Comprehensive Architecture Manual: Contains verified answer keys alongside detailed technical justifications and ServiceNow release conventions."}
          </div>
        </div>

        {/* Printable Questions Listing */}
        <div className="space-y-6">
          {exportQuestionsList.map((q, idx) => (
            <div
              key={q.id}
              className="page-break-avoid border-b border-slate-200 pb-5 space-y-2.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-xs font-bold text-slate-900">
                  Question {idx + 1} of {exportQuestionsList.length}{" "}
                  <span className="font-normal text-slate-500">
                    [{q.domain}]
                  </span>
                </div>
                {q.isMultiSelect && (
                  <span className="text-[11px] font-bold text-slate-700">
                    (Choose {q.requiredSelectCount || 2})
                  </span>
                )}
              </div>

              <div className="text-sm font-semibold text-slate-900 leading-snug">
                {q.questionText}
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-2 text-xs">
                {q.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isCorrect = opt.isCorrect;
                  const showAsCorrect =
                    isCorrect &&
                    (exportMode === "answer_key" || exportMode === "master_guide");

                  return (
                    <div
                      key={opt.id}
                      className={`flex items-start gap-2.5 py-1 px-2 rounded ${
                        showAsCorrect
                          ? "bg-slate-100 font-bold text-black border-l-2 border-slate-900"
                          : "text-slate-800"
                      }`}
                    >
                      <span className="font-mono font-bold shrink-0">
                        {exportMode === "exam_paper" ? (
                          q.isMultiSelect ? (
                            `[   ] ${letter}.`
                          ) : (
                            `(   ) ${letter}.`
                          )
                        ) : showAsCorrect ? (
                          `[ ✓ ] ${letter}.`
                        ) : (
                          `[   ] ${letter}.`
                        )}
                      </span>
                      <span className="leading-tight">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Architecture Rationale (Mode 3 Only) */}
              {exportMode === "master_guide" && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px] space-y-1 text-slate-800">
                  <div className="font-bold text-slate-900">
                    Technical Architecture Justification:
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                    Release Standards: {q.releaseVersion || examConfig.releaseVersion}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-400 text-center text-[10px] text-slate-500 font-mono">
          © 2026 NexusD Learning Systems • Generated from official blueprint bank for ServiceNow {examConfig.code} • https://nexusd.in
        </div>
      </div>
    </>
  );
}
