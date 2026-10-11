import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Download,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "ServiceNow Study Blueprints & Master Question Banks — NexusD",
  description:
    "Explore authoritative ServiceNow study blueprints and master question banks with 3-mode native PDF export for offline revision. Australia & Brazil releases.",
};

export default function StudyCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-8 md:p-10 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3">
            Study Guides & Question Banks
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
            Access in-depth architectural syllabus guides, interactive question bank browsers, and export complete question sets into print-ready PDF revision sheets.
          </p>
        </div>
      </div>

      {/* Featured: CSA Master Study Hub */}
      <div className="rounded-2xl border-2 border-blue-500/30 dark:border-blue-500/40 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-[#131D31] dark:via-[#111A2E] dark:to-[#17223B] p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Active Certification Track
            </span>
          </div>
          <Badge variant="accent">Official CSA Blueprint (60 Questions • 5 Domains)</Badge>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B192C] dark:text-white">
            ServiceNow Certified System Administrator (CSA)
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            The foundational certification for all ServiceNow consultants and developers. Fully authored and verified against the 2026 Australia & Brazil releases.
          </p>
        </div>

        {/* Dual Cards: 1) Domain Blueprints & 2) Master Question Bank with PDF Export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Domain Study Guides */}
          <Card className="p-6 bg-white dark:bg-[#131D31] border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0066FF] dark:text-[#38BDF8] font-bold text-sm">
                <BookOpen className="h-5 w-5" />
                <h3>5 Domain Syllabus Blueprints</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Step-by-step masterclasses covering User Interface, Collaboration, Database Administration (30%), Self-Service, and Development with verified tips and exam traps.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <li>• Domain 1: User Interface & Navigation (20%)</li>
                <li>• Domain 2: Collaboration & Task Management (20%)</li>
                <li>• Domain 3: Database Administration & Schema (30%)</li>
                <li>• Domain 4: Self-Service & Process Automation (20%)</li>
                <li>• Domain 5: Introduction to Development (10%)</li>
              </ul>
            </div>
            <Link href="/study/csa">
              <Button variant="default" className="w-full gap-2 text-xs">
                Explore 5 Domain Guides <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Card 2: Question Bank & PDF Exporter */}
          <Card className="p-6 bg-white dark:bg-[#131D31] border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0066FF] dark:text-[#38BDF8] font-bold text-sm">
                <FileText className="h-5 w-5" />
                <h3>Master Question Bank & PDF Exporter</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Practice the complete repository of questions in the platform, or export them into high-fidelity printable PDFs across 3 customizable modes:
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-700/60">
                <div className="font-semibold text-slate-900 dark:text-white">• Mode 1: Exam Paper (Questions + Options only)</div>
                <div className="font-semibold text-slate-900 dark:text-white">• Mode 2: Revision Key (Correct answers marked)</div>
                <div className="font-semibold text-slate-900 dark:text-white">• Mode 3: Master Guide (Answers + Explanations)</div>
              </div>
            </div>
            <Link href="/study/csa/question-bank">
              <Button variant="accent" className="w-full gap-2 text-xs">
                <Download className="h-4 w-4" /> Open Question Bank & PDF Exporter
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Upcoming Certification Tracks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Upcoming Study Blueprints
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Next Tracks: CAD → CIS-DF → CIS-ITSM
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-slate-50/60 dark:bg-[#0E1524]/60 border-slate-200 dark:border-slate-800 opacity-80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CAD — App Developer</span>
              <Badge variant="outline" className="text-[10px] gap-1 dark:border-slate-700"><Lock className="h-3 w-3" /> 60 Qs • 90m</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoped applications, Script Includes, Client Scripts, REST APIs, and Flow Designer integration spokes.
            </p>
          </Card>

          <Card className="p-5 bg-slate-50/60 dark:bg-[#0E1524]/60 border-slate-200 dark:border-slate-800 opacity-80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CIS-DF (CMDB & CSDM)</span>
              <Badge variant="outline" className="text-[10px] gap-1 dark:border-slate-700"><Lock className="h-3 w-3" /> 75 Qs • 90m</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CMDB health, CSDM v4.0 architecture, IRE reconciliation rules, and Service Graph Connectors.
            </p>
          </Card>

          <Card className="p-5 bg-slate-50/60 dark:bg-[#0E1524]/60 border-slate-200 dark:border-slate-800 opacity-80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CIS-ITSM — Specialist</span>
              <Badge variant="outline" className="text-[10px] gap-1 dark:border-slate-700"><Lock className="h-3 w-3" /> 75 Qs • 90m</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Incident, Problem, Change, Request, Service Catalog, Knowledge, and Service Level Management.
            </p>
          </Card>
        </div>

        {/* Subsequent Roadmap Tracks */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            Roadmap Pipeline:
          </div>
          <div>
            CIS-Discovery (75 Qs) • CIS-EM (75 Qs) • CIS-HR (75 Qs) • CIS-SAM (75 Qs) • CIS-HAM (75 Qs) • CIS-CSM (75 Qs) • CTA (Architect Board)
          </div>
        </div>
      </div>
    </div>
  );
}
