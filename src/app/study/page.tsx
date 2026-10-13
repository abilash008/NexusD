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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CERTIFICATION_TRACKS } from "@/lib/admin-certifications";

export const metadata = {
  title: "ServiceNow Study Blueprints & Master Question Banks — NexusD",
  description:
    "Explore authoritative ServiceNow study blueprints and master question banks across all tracks (CSA, CAD, CIS-DF, CIS-ITSM) with 3-mode native PDF export for offline revision.",
};

export default function StudyCatalogPage() {
  const tracks = DEFAULT_CERTIFICATION_TRACKS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-8 md:p-10 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3">
            Multi-Track Study Blueprints
          </Badge>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Australia & Brazil Releases
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            ServiceNow Certification Study Blueprints
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-3xl leading-relaxed">
            Access in-depth architectural syllabus guides, interactive question bank browsers, and export complete question sets into print-ready PDF revision sheets across all ServiceNow certification tracks.
          </p>
        </div>
      </div>

      {/* Grid of All Certification Tracks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white">
            Official Certification Syllabus Blueprints
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {tracks.length} Active Tracks Available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="p-6 md:p-8 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-6 flex flex-col justify-between hover:border-blue-500/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {track.code} Track
                    </span>
                  </div>
                  <Badge variant="accent" className="font-mono text-xs">
                    {track.totalQuestions} Questions • {track.durationMinutes}m
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#0B192C] dark:text-white">
                    {track.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {track.shortDescription}
                  </p>
                </div>

                {/* Domains list */}
                {track.domains && track.domains.length > 0 && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-700/60 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Knowledge Domains ({track.domains.length}):
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {track.domains.map((dom, dIdx) => (
                        <li key={dom.slug || dIdx} className="flex items-center justify-between">
                          <span>• {dom.name}</span>
                          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                            {dom.weight}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link href={`/study/${track.id}`}>
                  <Button variant="default" className="w-full gap-2 text-xs">
                    <BookOpen className="h-4 w-4" /> Domain Syllabus
                  </Button>
                </Link>
                <Link href={`/study/${track.id}/question-bank`}>
                  <Button variant="accent" className="w-full gap-2 text-xs">
                    <Download className="h-4 w-4" /> Question Bank & PDF
                  </Button>
                </Link>
                <Link href={`/certifications/${track.id}/practice`}>
                  <Button variant="outline" className="w-full gap-2 text-xs dark:border-slate-700">
                    <Zap className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" /> Practice Mode
                  </Button>
                </Link>
                <Link href={`/certifications/${track.id}/mock`}>
                  <Button variant="outline" className="w-full gap-2 text-xs dark:border-slate-700">
                    Timed Mock <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subsequent Roadmap Tracks */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
          Future ServiceNow Certification Expansions:
        </div>
        <p className="leading-relaxed">
          CIS-Discovery (75 Qs) • CIS-EM (75 Qs) • CIS-HR (75 Qs) • CIS-SAM (75 Qs) • CIS-HAM (75 Qs) • CIS-CSM (75 Qs) • CTA (Certified Technical Architect) • CMA (Certified Master Architect)
        </p>
      </div>
    </div>
  );
}
