import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDomainStudyGuide, DomainStudyGuide } from "@/data/csa-study-guides";
import { getExamConfig } from "@/lib/exam-engine";

interface PageProps {
  params: Promise<{ track: string; domain: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { track, domain } = await params;
  const trackId = (track || "csa").toLowerCase();
  const config = getExamConfig(trackId);
  const guide = getDomainStudyGuide(trackId, domain);

  if (!guide) {
    const domainMatch = config.domains?.find((d) => d.slug === domain);
    const domainName = domainMatch ? domainMatch.name : domain;
    return {
      title: `${domainName} — ServiceNow ${config.code} Study Guide | NexusD`,
      description: `Revision blueprint for ServiceNow ${config.title} ${domainName} domain.`,
    };
  }

  return {
    title: `${guide.name} (${guide.weight}%) — ServiceNow ${config.code} Study Guide | NexusD`,
    description: `Comprehensive revision guide for ServiceNow ${config.title} ${guide.name} domain. Aligned to Australia & Brazil releases.`,
  };
}

export default async function DynamicDomainStudyGuidePage({ params }: PageProps) {
  const { track, domain } = await params;
  const trackId = (track || "csa").toLowerCase();
  const config = getExamConfig(trackId);

  let guide = getDomainStudyGuide(trackId, domain);

  if (!guide) {
    const matchedDomain = config.domains?.find(
      (d) => d.slug.toLowerCase() === domain.toLowerCase()
    );
    if (!matchedDomain) {
      notFound();
    }

    // Synthesize guide from registered domain configuration
    guide = {
      slug: matchedDomain.slug,
      name: matchedDomain.name,
      weight: matchedDomain.weight || 20,
      questionCount: Math.round(((matchedDomain.weight || 20) / 100) * (config.totalQuestions || 60)),
      overview: `Official blueprint syllabus guide for ${matchedDomain.name} on the ServiceNow ${config.code} examination.`,
      releaseNotes: `Aligned to ServiceNow ${config.releaseVersion || "Australia & Brazil"} standards.`,
      topics: [
        {
          title: `${matchedDomain.name} Core Architecture`,
          summary: `Key functional patterns, architectural principles, and configuration options tested for ${matchedDomain.name}.`,
          keyPoints: [
            `Understand the standard configuration lifecycle for ${matchedDomain.name}.`,
            `Identify best practices and security implications recommended by ServiceNow.`,
            `Distinguish between out-of-the-box configuration and custom scripting.`
          ],
          examTips: `Review release notes and terminology specific to ${config.code} ${matchedDomain.name}.`,
        }
      ],
      keyTerminology: [
        { term: matchedDomain.name, definition: `Evaluated knowledge domain carrying ${matchedDomain.weight || 20}% exam blueprint weighting.` }
      ],
      practiceUrl: `/certifications/${trackId}/practice?domain=${matchedDomain.slug}`
    };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
        <Link href="/study" className="hover:text-slate-900 dark:hover:text-white">
          Study Blueprints
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
        <Link href={`/study/${trackId}`} className="hover:text-slate-900 dark:hover:text-white">
          {config.code} Guides
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{guide.name}</span>
      </nav>

      {/* Guide Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3">
            Domain Exam Weight: {guide.weight}%
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {guide.questionCount} Exam Blueprint Questions
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {config.releaseVersion || "Australia & Brazil Releases"}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {guide.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {guide.overview}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href={guide.practiceUrl}>
            <Button variant="accent" className="h-11 px-5 text-xs sm:text-sm font-semibold gap-2">
              <Zap className="h-4 w-4" /> Practice {guide.questionCount} Domain Questions
            </Button>
          </Link>
          <Link href={`/certifications/${trackId}/mock`}>
            <Button variant="outline" className="h-11 px-5 text-xs sm:text-sm font-semibold gap-2 dark:border-slate-700">
              Full {config.durationMinutes || 90}-Min Mock <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Topics In-Depth Breakdown */}
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Core Examination Topics & Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Every topic below maps directly to questions encountered on the official ServiceNow {config.code} examination.
          </p>
        </div>

        <div className="space-y-6">
          {guide.topics.map((topic, idx) => (
            <Card key={idx} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Module {idx + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Key Architecture Points */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#0066FF] dark:text-blue-400" />
                  Key Architectural Points
                </h4>
                <ul className="text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  {topic.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5">
                      <span className="text-[#0066FF] dark:text-blue-400 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exam Tip & Pitfalls Callout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 space-y-1.5 text-xs">
                  <div className="font-bold text-[#0066FF] dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Exam Strategy & Tips
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.examTips}</p>
                </div>

                {topic.pitfalls && (
                  <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 space-y-1.5 text-xs">
                    <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Common Exam Trap
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.pitfalls}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Terminology Glossary */}
      {guide.keyTerminology && guide.keyTerminology.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Key Terminology & Definitions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guide.keyTerminology.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-1.5 shadow-2xs"
              >
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">
                  {item.term}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Practice CTA */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50/30 dark:from-slate-900 dark:to-blue-950/30 p-8 text-center space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Reinforce Your Knowledge in Practice Mode
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Test your mastery of {guide.name} with instant architectural feedback and step-by-step explanations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={guide.practiceUrl}>
            <Button variant="accent" className="h-11 px-5 text-xs sm:text-sm font-semibold gap-2">
              <Zap className="h-4 w-4" /> Start {guide.name} Drills
            </Button>
          </Link>
          <Link href={`/study/${trackId}`}>
            <Button variant="outline" className="h-11 px-5 text-xs sm:text-sm font-semibold gap-2 dark:border-slate-700">
              <ArrowLeft className="h-4 w-4" /> Back to All {config.code} Domains
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
