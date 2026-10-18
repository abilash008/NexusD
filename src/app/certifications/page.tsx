"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Lock,
  Zap,
  BookOpen,
  Filter,
  Compass,
  FileText,
  Target,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CERTIFICATIONS = [
  {
    id: "csa",
    code: "CSA",
    title: "Certified System Administrator",
    category: "foundational",
    level: "Foundational & Prerequisite",
    release: "Australia & Brazil 2026",
    status: "available",
    questions: 60,
    durationMinutes: 90,
    passingPercentage: 70,
    freeAllocation: "60 Free Questions Included",
    description:
      "The universal gateway into the ServiceNow ecosystem. Covers User Interface navigation, Collaboration & Tasks, Database Administration & Schema (30%), Flow Designer automation, and core scripting fundamentals.",
    domains: [
      { name: "Platform Overview and Navigation", weight: 7 },
      { name: "Instance Configuration", weight: 10 },
      { name: "Configuring Applications for Collaboration", weight: 20 },
      { name: "Self-Service & Automation", weight: 20 },
      { name: "Database Management and Platform Security", weight: 30 },
      { name: "Data Migration and Integration", weight: 13 },
    ],
    hubUrl: "/certifications/csa",
    practiceUrl: "/certifications/csa/practice",
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
  },
  {
    id: "cad",
    code: "CAD",
    title: "Certified Application Developer",
    category: "developer",
    level: "Core Developer Track",
    release: "Australia & Brazil 2026",
    status: "available",
    questions: 60,
    durationMinutes: 90,
    passingPercentage: 70,
    freeAllocation: "60 Free Questions Included",
    description:
      "Scoped application development, data model architecture, Script Includes, Client Scripts, Flow Designer custom actions, REST APIs, and application security ACLs.",
    domains: [
      { name: "Designing and Creating an Application", weight: 20 },
      { name: "Application User Interface", weight: 20 },
      { name: "Security and Restricting Access", weight: 20 },
      { name: "Application Automation", weight: 20 },
      { name: "Working with External Data", weight: 10 },
      { name: "Managing Applications", weight: 10 },
    ],
    hubUrl: "/certifications/cad",
    practiceUrl: "/certifications/cad/practice",
    mockUrl: "/certifications/cad/mock",
    studyUrl: "/study/cad",
  },
  {
    id: "cis-df",
    code: "CIS-DF",
    title: "Certified Implementation Specialist — Data Foundations (CMDB and CSDM)",
    category: "specialist",
    level: "CMDB & CSDM Architect",
    release: "Australia & Brazil 2026",
    status: "available",
    questions: 75,
    durationMinutes: 90,
    passingPercentage: 70,
    freeAllocation: "Proportional Free Tier",
    description:
      "Official ServiceNow blueprint (KB0012913) covering CMDB Health Dashboard, Identification and Reconciliation Engine (IRE), CMDB Data Manager policies, and CSDM v4.0 architecture.",
    domains: [
      { name: "Govern (Health, IRE & Data Manager)", weight: 35 },
      { name: "Insight (CMDB Workspace & Query Builder)", weight: 20 },
      { name: "Ingest (IntegrationHub ETL & Connectors)", weight: 19 },
      { name: "Configuration (CI Class Manager)", weight: 15 },
      { name: "CSDM Fundamentals (CSDM Domains & Crawl-Fly)", weight: 11 },
    ],
    hubUrl: "/certifications/cis-df",
    practiceUrl: "/certifications/cis-df/practice",
    mockUrl: "/certifications/cis-df/mock",
    studyUrl: "/study/cis-df",
  },
  {
    id: "cis-itsm",
    code: "CIS-ITSM",
    title: "Certified Implementation Specialist — ITSM",
    category: "specialist",
    level: "Implementation Consultant",
    release: "Australia & Brazil 2026",
    status: "available",
    questions: 60,
    durationMinutes: 90,
    passingPercentage: 70,
    freeAllocation: "Proportional Free Tier",
    description:
      "Official ServiceNow blueprint (KB0011560) covering Incident Management, Change Management, Service Catalog & Request, Problem Management, Service Portfolio, and ITSM CMDB.",
    domains: [
      { name: "Incident Management", weight: 25 },
      { name: "Change Management", weight: 25 },
      { name: "Service Catalog and Request Management", weight: 25 },
      { name: "Problem Management", weight: 15 },
      { name: "Service Portfolio Management", weight: 5 },
      { name: "Configuration Management Database (CMDB)", weight: 5 },
    ],
    hubUrl: "/certifications/cis-itsm",
    practiceUrl: "/certifications/cis-itsm/practice",
    mockUrl: "/certifications/cis-itsm/mock",
    studyUrl: "/study/cis-itsm",
  },
];

const ROADMAP_TRACKS = [
  { code: "CIS-Discovery", title: "CIS — ITOM Discovery (MID Servers & IP Schedules)", questions: "75 Questions • 90 Mins" },
  { code: "CIS-EM", title: "CIS — Event Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-HR", title: "CIS — HR Service Delivery", questions: "75 Questions • 90 Mins" },
  { code: "CIS-SAM", title: "CIS — Software Asset Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-HAM", title: "CIS — Hardware Asset Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-CSM", title: "CIS — Customer Service Management", questions: "75 Questions • 90 Mins" },
  { code: "CTA", title: "Certified Technical Architect", questions: "Review Board & Case Study" },
];

export default function CertificationsCatalogPage() {
  const [filterCategory, setFilterCategory] = useState<"all" | "foundational" | "developer" | "specialist">("all");

  const filteredCerts = CERTIFICATIONS.filter((c) => {
    if (filterCategory === "all") return true;
    return c.category === filterCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-8 md:p-12 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3 font-semibold">
            ServiceNow Certification Catalog
          </Badge>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Australia & Brazil 2026 Releases Verified
          </span>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Choose Your ServiceNow Certification Path
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Every track is engineered with official domain quotas, 90-minute timed mock simulations with Pause/Resume, anti-memorization dual shuffling, and instant explanation blueprints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { id: "all", label: `All Tracks (${CERTIFICATIONS.length})` },
            { id: "foundational", label: "Foundational (CSA)" },
            { id: "developer", label: "Developer (CAD)" },
            { id: "specialist", label: "Specialist (CIS Series)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? "bg-[#0066FF] text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.map((cert) => (
          <Card
            key={cert.id}
            className="p-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-5 shadow-xs hover:border-[#0066FF] hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] dark:border-slate-700">
                    {cert.code}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">
                    {cert.level}
                  </span>
                </div>
                <Badge variant="success" className="text-[11px] py-0.5 px-2">
                  {cert.freeAllocation}
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {cert.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {/* Exam Specs Strip */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{cert.questions} Qs</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Limit</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{cert.durationMinutes} Mins</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Benchmark</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{cert.passingPercentage}%</span>
                </div>
              </div>

              {/* Domains Breakdown Preview */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Blueprint Knowledge Domains:</span>
                  <span className="text-[11px] text-slate-400">{cert.domains.length} Domains</span>
                </div>
                <div className="space-y-1.5">
                  {cert.domains.slice(0, 3).map((dom, dIdx) => (
                    <div key={dIdx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="truncate pr-2">• {dom.name}</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">{dom.weight}%</span>
                    </div>
                  ))}
                  {cert.domains.length > 3 && (
                    <div className="text-[11px] text-[#0066FF] dark:text-[#38BDF8] font-medium">
                      + {cert.domains.length - 3} more blueprint areas
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5">
              <Link href={cert.practiceUrl} className="flex-1">
                <Button variant="accent" className="w-full text-xs font-bold gap-1.5 shadow-xs cursor-pointer">
                  <Zap className="h-3.5 w-3.5" /> Start Free Practice
                </Button>
              </Link>
              <Link href={cert.mockUrl} className="flex-1">
                <Button variant="default" className="w-full text-xs font-bold gap-1.5 bg-[#0B192C] hover:bg-[#1A2E44] text-white cursor-pointer">
                  <Clock className="h-3.5 w-3.5 text-[#38BDF8]" /> Launch Timed Mock
                </Button>
              </Link>
              <Link href={cert.studyUrl}>
                <Button variant="outline" className="text-xs dark:border-slate-700 cursor-pointer" title="Study Guides">
                  <BookOpen className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Roadmap & Upcoming Tracks */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs dark:border-slate-700">
            Roadmap Pipeline
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Upcoming Specialist & Architect Exam Simulators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Following our core 4 tracks, these specialist simulators are currently in authoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROADMAP_TRACKS.map((track) => (
            <div
              key={track.code}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1524]/60 flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {track.title}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {track.questions}
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0 dark:border-slate-700">
                Coming Soon
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
