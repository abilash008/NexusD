"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Award,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Zap,
  Layers,
  HelpCircle,
  AlertCircle,
  FileText,
  Download,
  Target,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExamConfig } from "@/lib/exam-engine";

export default function DynamicCertificationHubPage() {
  const params = useParams();
  const trackId = ((params?.track as string) || "csa").toLowerCase();
  const examConfig = getExamConfig(trackId);

  const passingQuestionsCount = Math.ceil(
    (examConfig.totalQuestions * examConfig.passingPercentage) / 100
  );
  const secondsPerQuestion = Math.round(
    (examConfig.durationMinutes * 60) / examConfig.totalQuestions
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Certification Header Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-8 md:p-12 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3 font-semibold">
            ServiceNow {examConfig.code} Hub
          </Badge>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {examConfig.releaseVersion} Verified
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {examConfig.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {examConfig.shortDescription}
          </p>
        </div>

        {/* Quick Exam Specifications Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Exam Questions
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {examConfig.totalQuestions} Qs
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
              Stratified Blueprint Quota
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Time Allowed
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {examConfig.durationMinutes} Mins
            </div>
            <span className="text-[11px] text-slate-500 font-mono block">
              ~{secondsPerQuestion}s per Question Pacing
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Passing Mark
            </span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {examConfig.passingPercentage}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              {passingQuestionsCount} / {examConfig.totalQuestions} required
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Blueprint Areas
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0066FF] dark:text-[#38BDF8] font-mono">
              {examConfig.domains?.length || 5} Domains
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">
              Weighted Practice Available
            </span>
          </div>
        </div>

        {/* Launch Buttons Row */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href={`/certifications/${trackId}/practice`}>
            <Button variant="accent" size="lg" className="gap-2 font-semibold text-xs sm:text-sm h-11 px-5 shadow-sm cursor-pointer">
              <Zap className="h-4 w-4" /> Start Free Practice Mode (60 Qs)
            </Button>
          </Link>
          <Link href={`/certifications/${trackId}/mock`}>
            <Button variant="default" size="lg" className="gap-2 bg-[#0B192C] hover:bg-[#1A2E44] text-white font-semibold text-xs sm:text-sm h-11 px-5 cursor-pointer">
              <Clock className="h-4 w-4 text-[#38BDF8]" /> Launch {examConfig.durationMinutes}-Min Timed Mock
            </Button>
          </Link>
          <Link href={`/study/${trackId}`}>
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700 font-semibold text-xs sm:text-sm h-11 px-5 cursor-pointer">
              <BookOpen className="h-4 w-4" /> Study Blueprints
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Pillars: Practice, Mock, Study Guide, Question Bank */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Practice Mode */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0066FF] transition-all">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Badge variant="accent" className="text-[10px]">
                Untimed Learning
              </Badge>
              <Zap className="h-4 w-4 text-[#0066FF]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Domain Practice Drills
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Solve blueprint questions with instant answer reveals, official Now documentation links, and domain filters.
            </p>
          </div>

          <Link href={`/certifications/${trackId}/practice`} className="block pt-1">
            <Button variant="accent" className="w-full text-xs font-semibold gap-1.5 cursor-pointer">
              Launch Practice Mode <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>

        {/* Card 2: Timed Mock Simulation */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0066FF] transition-all">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="text-[10px] bg-[#0B192C] text-white">
                Exam Conditions
              </Badge>
              <Clock className="h-4 w-4 text-[#0066FF]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Timed Mock Simulator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full {examConfig.durationMinutes}-minute countdown simulator with universal Pause/Resume, anti-memorization dual shuffle, and cloud scoring.
            </p>
          </div>

          <Link href={`/certifications/${trackId}/mock`} className="block pt-1">
            <Button variant="default" className="w-full text-xs font-semibold gap-1.5 bg-[#0B192C] hover:bg-[#1A2E44] text-white cursor-pointer">
              Launch Timed Exam <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>

        {/* Card 3: Question Bank & PDF Exporter */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0066FF] transition-all">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] dark:border-slate-700">
                Print & Revise
              </Badge>
              <Download className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Question Bank & PDF Sheets
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Browse complete master question vaults and download 3-mode printable revision PDF sheets for offline exam preparation.
            </p>
          </div>

          <Link href={`/study/${trackId}/question-bank`} className="block pt-1">
            <Button variant="outline" className="w-full text-xs font-semibold dark:border-slate-700 cursor-pointer">
              Browse Vault & PDFs <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Blueprint Domain Breakdown Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Official {examConfig.code} Examination Blueprint Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            NexusD simulations sample questions strictly according to these official ServiceNow blueprint domain percentages.
          </p>
        </div>

        {examConfig.domains && examConfig.domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examConfig.domains.map((domain, index) => {
              const domainQuestionTarget = Math.round(
                (examConfig.totalQuestions * domain.weight) / 100
              );

              return (
                <div
                  key={domain.slug || index}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        DOMAIN {index + 1}
                      </span>
                      <Badge variant="accent" className="font-mono text-xs">
                        {domain.weight}% Weight (~{domainQuestionTarget} Qs)
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {domain.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Core architectural syllabus topic covering {domain.name}. High frequency exam scenarios on Australia & Brazil releases.
                    </p>
                  </div>

                  <Link href={`/certifications/${trackId}/practice?domain=${domain.slug}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs dark:border-slate-700">
                      Practice This Domain Specifically →
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
