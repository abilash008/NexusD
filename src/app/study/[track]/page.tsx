import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Terminal,
  Database,
  Users,
  Compass,
  Cpu,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExamConfig } from "@/lib/exam-engine";
import { getTrackStudyGuides } from "@/data/csa-study-guides";

interface PageProps {
  params: Promise<{ track: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { track } = await params;
  const trackId = (track || "csa").toLowerCase();
  const config = getExamConfig(trackId);

  return {
    title: `ServiceNow ${config.code} Exam Blueprint & Domain Study Guides — NexusD`,
    description: `Comprehensive domain-by-domain study guides matching the official ServiceNow ${config.title} exam blueprint. Australia & Brazil releases.`,
  };
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  "ui-nav": <Compass className="h-5 w-5 text-[#0066FF]" />,
  collaboration: <Users className="h-5 w-5 text-[#0066FF]" />,
  "db-admin": <Database className="h-5 w-5 text-[#0066FF]" />,
  automation: <Cpu className="h-5 w-5 text-[#0066FF]" />,
  development: <Terminal className="h-5 w-5 text-[#0066FF]" />,
  "app-design": <Compass className="h-5 w-5 text-[#0066FF]" />,
  "data-model": <Database className="h-5 w-5 text-[#0066FF]" />,
  "app-automation": <Cpu className="h-5 w-5 text-[#0066FF]" />,
  integration: <Terminal className="h-5 w-5 text-[#0066FF]" />,
  "ui-experience": <Users className="h-5 w-5 text-[#0066FF]" />,
  "discovery-setup": <Terminal className="h-5 w-5 text-[#0066FF]" />,
  "cmdb-schema": <Database className="h-5 w-5 text-[#0066FF]" />,
  troubleshooting: <Cpu className="h-5 w-5 text-[#0066FF]" />,
  "incident-mgmt": <Users className="h-5 w-5 text-[#0066FF]" />,
  "change-mgmt": <Cpu className="h-5 w-5 text-[#0066FF]" />,
  "service-catalog": <Compass className="h-5 w-5 text-[#0066FF]" />,
  "slm-metrics": <Award className="h-5 w-5 text-[#0066FF]" />,
};

export default async function DynamicStudyGuidePage({ params }: PageProps) {
  const { track } = await params;
  const trackId = (track || "csa").toLowerCase();
  const config = getExamConfig(trackId);
  const studyGuides = getTrackStudyGuides(trackId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Guide Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3">
            Official Blueprint Syllabus
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Exam Code: {config.code}
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {config.releaseVersion || "Australia & Brazil Releases"}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {config.title} Study Blueprints
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-3xl">
            {config.shortDescription ||
              `Master the official knowledge domains evaluated on the ServiceNow ${config.code} exam.`}{" "}
            Includes core architecture deep-dives, key terminology, common exam pitfalls, and 1-click practice drills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href={`/study/${trackId}/question-bank`}>
            <Button variant="accent" size="lg" className="gap-2">
              <Download className="h-4 w-4" /> Master Question Bank & PDF Exporter
            </Button>
          </Link>
          <Link href={`/certifications/${trackId}/practice`}>
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700">
              <Zap className="h-4 w-4 text-[#0066FF] dark:text-blue-400" /> Free Practice Mode
            </Button>
          </Link>
          <Link href={`/certifications/${trackId}/mock`}>
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700">
              Launch {config.durationMinutes || 90}-Min Timed Mock <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Blueprint Domain Modules Grid */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white">
            Explore the {studyGuides.length} Knowledge Domains
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a domain below for comprehensive revision notes, architectural diagrams, and targeted practice questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyGuides.map((guide, idx) => (
            <Card
              key={guide.slug}
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {DOMAIN_ICONS[guide.slug] || <Compass className="h-5 w-5 text-[#0066FF]" />}
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Domain {idx + 1}
                    </span>
                  </div>
                  <Badge variant="accent" className="font-mono text-xs">
                    {guide.weight}% Exam Weight
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-[#0B192C] dark:text-white">
                  {guide.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {guide.overview}
                </p>

                {/* Sub-topics list */}
                {guide.topics && guide.topics.length > 0 && (
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider block mb-1">
                      Key Topics Covered:
                    </span>
                    {guide.topics.slice(0, 3).map((top, tIdx) => (
                      <div key={tIdx} className="truncate text-slate-600 dark:text-slate-400">
                        • {top.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <Link href={`/study/${trackId}/${guide.slug}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full gap-1.5 text-xs">
                    <BookOpen className="h-3.5 w-3.5" /> Read Guide
                  </Button>
                </Link>
                <Link href={`/certifications/${trackId}/practice?domain=${guide.slug}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs text-[#0066FF] dark:text-blue-400 border-[#0066FF]/30 dark:border-blue-500/30 hover:bg-[#0066FF]/10 dark:hover:bg-blue-950/40"
                  >
                    <Zap className="h-3.5 w-3.5" /> Practice ({guide.questionCount || 10} Qs)
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Blueprint Strategy Callout */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
          <Sparkles className="h-5 w-5 text-[#0066FF] dark:text-blue-400" />
          Official {config.code} Exam Strategy & Best Practices
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">1. Domain Weighting Priority</span>
            <p>Focus study hours according to blueprint percentages. Core architectural domains account for the majority of points.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">2. Multi-Select Precision</span>
            <p>15–20% of exam items require selecting multiple valid options. Watch for exact counts indicated in the question prompts.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">3. Modern Release Standards</span>
            <p>All items in this blueprint are calibrated to current ServiceNow {config.releaseVersion || "Australia & Brazil"} release paradigms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
