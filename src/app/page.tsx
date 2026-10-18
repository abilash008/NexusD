"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Check,
  Star,
  Users,
  BarChart3,
  Flame,
  Target,
  FileText,
  Download,
  ShieldCheck,
  Compass,
  Play,
  RotateCcw,
  GraduationCap,
  Briefcase,
  Building,
  HelpCircle,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CERTIFICATION_TRACKS } from "@/lib/admin-certifications";
import { CSA_FREE_60_QUESTIONS } from "@/data/csa-questions";

// Curate single-select 4-option questions from the official free 60 blueprint
const DEMO_QUESTIONS = CSA_FREE_60_QUESTIONS.filter(
  (q) => !q.isMultiSelect && q.options && q.options.length === 4
);

const DEMO_FALLBACK_QUESTION = {
  id: "demo-preview",
  domain: "User Interface & Navigation",
  domainSlug: "ui-nav",
  questionText: "Which component of the Next Experience Unified Navigation contains the Application Navigator, Favorites, and Workspaces menus?",
  isMultiSelect: false,
  options: [
    { id: "opt-1", text: "Contextual App Bar", isCorrect: false },
    { id: "opt-2", text: "All Menu (Unified Navigation Header)", isCorrect: true },
    { id: "opt-3", text: "Filter Navigator Pane", isCorrect: false },
    { id: "opt-4", text: "Global Search Banner", isCorrect: false },
  ],
  explanation: "In Next Experience Unified Navigation, the top navigation header provides access to the 'All' menu (which houses the full Application Navigator), Favorites, History, and Workspaces.",
  releaseVersion: "Australia & Brazil",
};

const DOMAIN_WEIGHTS: Record<string, number> = {
  "User Interface & Navigation": 20,
  "Collaboration & Task Management": 20,
  "Database Administration & Schema": 30,
  "Self-Service & Process Automation": 20,
  "Introduction to Development": 10,
};

export default function HomePage() {
  // Interactive Live Demo Question Card State (Shuffled dynamically across the free blueprint)
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [selectedDemoOption, setSelectedDemoOption] = useState<string | null>(null);
  const [isDemoAnswerSubmitted, setIsDemoAnswerSubmitted] = useState(false);

  // Pick a random question from the pool on client mount so every visit/refresh gives a fresh question
  useEffect(() => {
    if (DEMO_QUESTIONS.length > 0) {
      const rand = Math.floor(Math.random() * DEMO_QUESTIONS.length);
      setCurrentDemoIndex(rand);
    }
  }, []);

  const currentQuestion = DEMO_QUESTIONS[currentDemoIndex] || DEMO_QUESTIONS[0] || DEMO_FALLBACK_QUESTION;
  const originalQuestionIndex = CSA_FREE_60_QUESTIONS.findIndex((q) => q.id === currentQuestion.id);
  const questionNumber = originalQuestionIndex >= 0 ? originalQuestionIndex + 1 : currentDemoIndex + 1;
  const domainWeight = DOMAIN_WEIGHTS[currentQuestion.domain] || 20;

  const handleNextDemoQuestion = () => {
    setSelectedDemoOption(null);
    setIsDemoAnswerSubmitted(false);
    setCurrentDemoIndex((prev) => {
      let next = Math.floor(Math.random() * DEMO_QUESTIONS.length);
      if (next === prev && DEMO_QUESTIONS.length > 1) {
        next = (prev + 1) % DEMO_QUESTIONS.length;
      }
      return next;
    });
  };

  const tracks = DEFAULT_CERTIFICATION_TRACKS;

  return (
    <div className="flex flex-col min-h-screen space-y-20 pb-16 overflow-hidden">
      {/* 1. Hero Section with Interactive Live Simulator Widget */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-slate-50/30 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] transition-colors">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Release Version Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-4 py-1.5 text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Australia & Brazil 2026 Exam Syllabus Sync</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Pass Your ServiceNow Exam on the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#38BDF8]">
                  First Attempt
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The high-performance practice engine built exclusively for the ServiceNow ecosystem. <strong>60 free blueprint questions per track</strong>, realistic 90-minute timed mock exams with pause/resume, and stratified domain quotas.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/certifications/csa/practice" className="w-full sm:w-auto">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto text-xs sm:text-sm font-semibold gap-2 shadow-md shadow-blue-500/10 h-11 px-5 cursor-pointer"
                  >
                    <Zap className="h-4 w-4" /> Start Free Practice Exam (60 Qs)
                  </Button>
                </Link>

                <Link href="/certifications" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-xs sm:text-sm font-semibold gap-2 dark:border-slate-700 dark:text-slate-200 h-11 px-5 cursor-pointer"
                  >
                    <Compass className="h-4 w-4" /> Explore All Certifications
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8] shrink-0" />
                  <span>90-Min Countdown Mock Timer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-slate-700 dark:text-slate-300 shrink-0" />
                  <span>Official Blueprint Quotas</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Exam Preview Widget (Hooking candidates) */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border-2 border-blue-200/80 dark:border-slate-700 bg-white dark:bg-[#131D31] p-6 shadow-2xl space-y-5 relative">
                {/* Header Simulator Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      LIVE PRACTICE DEMO
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleNextDemoQuestion}
                      title="Load another random practice question"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-[#0066FF] dark:hover:bg-blue-950/60 dark:hover:text-[#38BDF8] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      <Shuffle className="h-2.5 w-2.5" />
                      <span>Shuffle</span>
                    </button>
                    <Badge variant="accent" className="text-[10px] py-0 px-2 font-mono">
                      CSA Blueprint • Q {questionNumber} of 60
                    </Badge>
                  </div>
                </div>

                {/* Domain Tag */}
                <div className="space-y-2">
                  <Badge variant="outline" className="text-[10px] dark:border-slate-700 text-[#0066FF] dark:text-[#38BDF8]">
                    {currentQuestion.domain} ({domainWeight}% Weight)
                  </Badge>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {currentQuestion.questionText}
                  </p>
                </div>

                {/* Interactive Options List */}
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedDemoOption === opt.id;
                    const showCorrect = isDemoAnswerSubmitted && opt.isCorrect;
                    const showWrong = isDemoAnswerSubmitted && isSelected && !opt.isCorrect;
                    const letter = String.fromCharCode(65 + idx);

                    let optClass = "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:border-blue-400";
                    if (isSelected && !isDemoAnswerSubmitted) {
                      optClass = "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] font-semibold";
                    }
                    if (showCorrect) {
                      optClass = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold";
                    }
                    if (showWrong) {
                      optClass = "border-red-400 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (!isDemoAnswerSubmitted) setSelectedDemoOption(opt.id);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`inline-flex items-center justify-center h-5 w-5 rounded-md text-[10px] font-bold font-mono shrink-0 ${
                              showCorrect
                                ? "bg-emerald-600 text-white"
                                : showWrong
                                ? "bg-red-600 text-white"
                                : isSelected
                                ? "bg-[#0066FF] text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </div>
                        {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />}
                        {showWrong && <XCircle className="h-4 w-4 text-red-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Reveal Button & Actions */}
                {!isDemoAnswerSubmitted ? (
                  <Button
                    variant="accent"
                    size="sm"
                    disabled={selectedDemoOption === null}
                    onClick={() => setIsDemoAnswerSubmitted(true)}
                    className="w-full text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    Check Answer & Reveal Explanation <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-[11px] text-slate-700 dark:text-slate-300 space-y-2.5 animate-in fade-in">
                    <div className="font-bold text-[#0066FF] dark:text-[#38BDF8] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Architectural Explanation:
                    </div>
                    <p className="leading-relaxed">{currentQuestion.explanation}</p>
                    <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleNextDemoQuestion}
                        className="inline-flex items-center gap-1 text-[11px] text-[#0066FF] dark:text-[#38BDF8] hover:underline font-bold cursor-pointer"
                      >
                        <Shuffle className="h-3 w-3" /> Try Another Question
                      </button>
                      <Link
                        href="/certifications/csa/practice"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold"
                      >
                        Practice All 60 Free Qs <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Metrics Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="space-y-1 pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-[#0066FF] dark:text-[#38BDF8] font-mono">
                60 Qs
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Free per Track (Shuffled)
              </div>
            </div>

            <div className="space-y-1 pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                4+
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                ServiceNow Certification Tracks
              </div>
            </div>

            <div className="space-y-1 pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                70%
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Official Passing Standard
              </div>
            </div>

            <div className="space-y-1 pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                2 Years
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                All-Access Pass Validity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Multi-Track Certification Catalog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <Badge variant="accent" className="text-xs">
              Multi-Exam Architecture
            </Badge>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ServiceNow Certification Tracks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Targeted practice engines mirroring official ServiceNow blueprint distributions for every exam tier.
            </p>
          </div>

          <Link href="/certifications">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 dark:border-slate-700">
              View All 4+ Tracks <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-5 shadow-xs hover:border-[#0066FF] hover:shadow-md transition-all group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px] dark:border-slate-700 text-[#0066FF] dark:text-[#38BDF8]">
                    {track.code}
                  </Badge>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    60 Free Qs
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {track.shortDescription}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-mono text-slate-500">
                  <span>{track.totalQuestions} Questions</span>
                  <span>{track.durationMinutes} Minutes</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{track.passingPercentage}% Pass</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link href={`/certifications/${track.id}/practice`} className="block">
                  <Button variant="accent" size="sm" className="w-full text-xs font-bold gap-1 cursor-pointer">
                    <Zap className="h-3.5 w-3.5" /> Practice Drill
                  </Button>
                </Link>
                <Link href={`/certifications/${track.id}/mock`} className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold dark:border-slate-700 cursor-pointer">
                    Timed Mock Exam →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Four-Stage Certification Mastery Roadmap (Storytelling) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <Badge variant="accent" className="text-xs">
              Proven 4-Step Methodology
            </Badge>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              From Beginner to Certified in 4 Milestones
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Designed specifically to avoid memorization traps and build authentic architectural competency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-2">
              <div className="text-[11px] font-mono font-bold text-[#0066FF] dark:text-[#38BDF8]">
                STEP 01
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Diagnostic Baseline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Take the free 60-question baseline exam to uncover exact strengths and knowledge blind spots across the 5 domains.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-500">
                STEP 02
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Domain Deep-Dives
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Study syllabus blueprints, table schemas, Flow Designer triggers, and cross-reference official ServiceNow documentation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-500">
                STEP 03
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Timed 90-Min Simulations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Experience full countdown mock tests with Pause/Resume capability, stratified domain quotas, and live telemetry scoring.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-500">
                STEP 04
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Exam-Day Readiness
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Consistently score 80%+ on randomized simulations and download printable 3-mode offline revision PDF sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Architectural Benchmark: NexusD vs Outdated Alternatives */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <Badge variant="outline" className="text-xs">
            Why NexusD Works
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered Beyond Static Dumps & Outdated Quizzes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Why traditional PDF dumps and unstructured quizzes fail candidates on recent exam releases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] w-fit">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              Stratified Domain Quotas
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every mock test matches official blueprint quotas (e.g. exactly 18 Database questions, 12 Navigation, 12 Automation) rather than uncalibrated random dumps.
            </p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit">
              <RotateCcw className="h-4 w-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              Anti-Memorization Dual Shuffling
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Both question order and answer option letters (A, B, C, D) are freshly shuffled on every retake, preventing false confidence from pattern recognition.
            </p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2.5">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 w-fit">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              Neon DB Telemetry & Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Real historical scoring, pass rate calibration, and domain accuracy breakdowns stored securely in the cloud to guide your revision.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Built for Your Background */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131D31]/80 p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <Badge variant="outline" className="text-xs">
              Personalized Tracks
            </Badge>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tailored for Every Learning Path
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Whether you are in college, transitioning from non-IT, or an enterprise trainee with tight certification deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                <GraduationCap className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">College Freshers</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Break into high-paying enterprise IT roles without years of experience. Learn platform schema, PDIs, and earn your CSA credential before graduation.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Briefcase className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Career Switchers</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transition from non-IT, operations, or support roles into ServiceNow Administrator or Developer positions with plain-English concept breakdowns.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Building className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Enterprise Trainees</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Working at TCS, Infosys, Wipro, Cognizant, or Deloitte with a strict client-mandated certification deadline? Practice with real exam pacing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call-to-Action Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-600 via-[#0066FF] to-blue-700 text-white p-6 sm:p-10 shadow-xl text-center space-y-5 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              Start Your ServiceNow Certification Journey Today
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Join thousands of ServiceNow candidates preparing with full 60-question blueprint tests, timed simulations, and domain-level telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/certifications/csa/practice">
              <Button
                variant="default"
                size="lg"
                className="bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm h-11 px-6 shadow-md cursor-pointer"
              >
                Launch Free Practice Mode (60 Qs) →
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/80 text-white hover:bg-white/10 font-semibold text-xs sm:text-sm h-11 px-6 cursor-pointer"
              >
                View 2-Year All-Access Pass (₹999)
              </Button>
            </Link>
          </div>

          <div className="pt-1 text-[11px] text-blue-200">
            Free forever tier available • Instant access • Australia & Brazil Releases
          </div>
        </div>
      </section>
    </div>
  );
}
