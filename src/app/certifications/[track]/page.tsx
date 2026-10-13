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
  ShieldAlert,
  Zap,
  Layers,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExamConfig } from "@/lib/exam-engine";

export default function DynamicCertificationHubPage() {
  const params = useParams();
  const trackId = ((params?.track as string) || "csa").toLowerCase();
  const examConfig = getExamConfig(trackId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Certification Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-sm py-1 px-3">
            Exam Blueprint: {examConfig.releaseVersion}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Exam Code: {examConfig.code}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {examConfig.title}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {examConfig.shortDescription}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">
              Mock Standard
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {examConfig.totalQuestions} Questions
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              Official Blueprint Quota
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">
              Time Limit
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {examConfig.durationMinutes} Minutes
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              ~{Math.round((examConfig.durationMinutes / examConfig.totalQuestions) * 60)}s per Question
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">
              Passing Score
            </span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {examConfig.passingPercentage}% Required
            </div>
            <span className="text-[10px] text-slate-400 block">
              {Math.ceil((examConfig.totalQuestions * examConfig.passingPercentage) / 100)} / {examConfig.totalQuestions} Correct
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">
              Domains
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {examConfig.domains?.length || 5} Blueprint Areas
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 block">
              Weighted Drills Available
            </span>
          </div>
        </div>

        {/* Launch Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href={`/certifications/${trackId}/practice`}>
            <Button variant="accent" size="lg" className="gap-2 cursor-pointer font-bold">
              <Zap className="h-4 w-4" /> Start Free Practice Mode
            </Button>
          </Link>
          <Link href={`/certifications/${trackId}/mock`}>
            <Button variant="default" size="lg" className="gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white cursor-pointer">
              <Clock className="h-4 w-4" /> Launch {examConfig.durationMinutes}-Min Timed Mock
            </Button>
          </Link>
          <Link href={`/study/${trackId}`}>
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700 cursor-pointer">
              <BookOpen className="h-4 w-4" /> Syllabus Domain Guides
            </Button>
          </Link>
        </div>
      </div>

      {/* Blueprint Domains Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white">
            Official {examConfig.code} Exam Blueprint Breakdown
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            NexusD practice questions and mock tests are distributed precisely across these official domain weightings.
          </p>
        </div>

        {examConfig.domains && examConfig.domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examConfig.domains.map((domain, index) => (
              <div
                key={domain.slug || index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Domain {index + 1}
                    </span>
                    <Badge variant="accent" className="font-mono text-xs">
                      {domain.weight}% Exam Weight
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Official syllabus coverage for {domain.name} ({domain.weight}% weighting).
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    Weight: {domain.weight}%
                  </span>
                  <Link href={`/certifications/${trackId}/practice?domain=${domain.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-[#0066FF] dark:text-blue-400 border-[#0066FF]/30 dark:border-blue-500/30 hover:bg-[#0066FF]/10 hover:border-[#0066FF] cursor-pointer"
                    >
                      Practice Domain <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-slate-500">
            No domain weights specified for this custom examination track.
          </Card>
        )}
      </div>
    </div>
  );
}
