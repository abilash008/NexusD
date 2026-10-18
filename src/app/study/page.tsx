"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Download,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Layers,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CERTIFICATION_TRACKS } from "@/lib/admin-certifications";

export default function StudyCatalogPage() {
  const tracks = DEFAULT_CERTIFICATION_TRACKS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-8 md:p-12 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3 font-semibold">
            ServiceNow Knowledge Blueprints
          </Badge>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Australia & Brazil Releases Verified
          </span>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Certification Study Blueprints & PDF Vaults
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            In-depth architectural syllabus breakdowns, question bank browsers with verified answers, and 3-mode high-resolution printable PDF exports for offline revision.
          </p>
        </div>
      </div>

      {/* 3-Mode Printable PDF Feature Callout */}
      <Card className="p-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/50 via-white to-slate-50 dark:from-[#131D31] dark:via-[#0F172A] dark:to-[#131D31] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[11px] font-semibold text-[#0066FF] dark:text-[#38BDF8]">
              <Printer className="h-3.5 w-3.5" /> Native 3-Mode PDF Exporter
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Revise Offline Anywhere with Clean PDF Packs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Export high-fidelity revision sheets in 3 specialized modes: <strong>Exam Paper Mode</strong> (clean test layout without answers), <strong>Revision Key Mode</strong> (correct answers highlighted), and <strong>Master Guide Mode</strong> (with comprehensive explanations and documentation URLs).
            </p>
          </div>

          <Link href="/pricing" className="shrink-0">
            <Button variant="accent" size="sm" className="text-xs font-semibold gap-2 h-10 px-4 shadow-xs cursor-pointer">
              <Sparkles className="h-3.5 w-3.5" /> Unlock Pro Exporter
            </Button>
          </Link>
        </div>
      </Card>

      {/* Grid of All Certification Tracks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Official Certification Syllabus Blueprints
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {tracks.length} Active Tracks Available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="p-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-5 flex flex-col justify-between hover:border-[#0066FF] hover:shadow-md transition-all"
            >
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold font-mono text-[#0066FF] dark:text-[#38BDF8] uppercase tracking-wider">
                      {track.code} Track
                    </span>
                  </div>
                  <Badge variant="accent" className="font-mono text-[11px]">
                    {track.totalQuestions} Questions • {track.durationMinutes}m
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {track.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {track.shortDescription}
                  </p>
                </div>

                {/* Domains list */}
                {track.domains && track.domains.length > 0 && (
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Blueprint Knowledge Domains ({track.domains.length}):
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      {track.domains.map((dom, dIdx) => (
                        <li key={dom.slug || dIdx} className="flex items-center justify-between">
                          <span className="truncate pr-2">• {dom.name}</span>
                          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-bold shrink-0">
                            {dom.weight}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link href={`/study/${track.id}`}>
                  <Button variant="default" className="w-full gap-2 text-xs font-bold bg-[#0B192C] hover:bg-[#1A2E44] text-white">
                    <BookOpen className="h-4 w-4" /> Domain Syllabus
                  </Button>
                </Link>
                <Link href={`/study/${track.id}/question-bank`}>
                  <Button variant="accent" className="w-full gap-2 text-xs font-bold">
                    <Download className="h-4 w-4" /> Question Bank & PDF
                  </Button>
                </Link>
                <Link href={`/certifications/${track.id}/practice`}>
                  <Button variant="outline" className="w-full gap-2 text-xs font-semibold dark:border-slate-700">
                    <Zap className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" /> Practice Mode
                  </Button>
                </Link>
                <Link href={`/certifications/${track.id}/mock`}>
                  <Button variant="outline" className="w-full gap-2 text-xs font-semibold dark:border-slate-700">
                    Timed Mock <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
