import React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "ServiceNow Certifications Catalog — NexusD",
  description:
    "Choose your ServiceNow certification track: CSA, CAD, CIS-ITSM. Verified practice questions and timed mock simulations aligned to Australia & Brazil releases.",
};

const CERTIFICATIONS = [
  {
    id: "csa",
    code: "CSA",
    title: "Certified System Administrator",
    level: "Foundational & Prerequisite",
    release: "Australia & Brazil 2026",
    status: "available",
    questions: "60 Questions",
    duration: "90 Minutes",
    passScore: "70%",
    freeQuestions: "60 Free Questions Included",
    description:
      "The mandatory prerequisite for all ServiceNow tracks. Covers Next Experience UI, User Administration & Groups, CMDB & Schema (30%), Flow Designer automation, and core scripting fundamentals.",
    domainsCount: 5,
    hubUrl: "/certifications/csa",
    practiceUrl: "/certifications/csa/practice",
    mockUrl: "/certifications/csa/mock",
    studyUrl: "/study/csa",
  },
  {
    id: "cad",
    code: "CAD",
    title: "Certified Application Developer",
    level: "Core Developer Track",
    release: "In Authoring",
    status: "coming_soon",
    questions: "60 Questions",
    duration: "90 Minutes",
    passScore: "70%",
    freeQuestions: "60 Free Questions on Launch",
    description:
      "Advanced application development: Custom application scoping, Script Includes, Client Scripts, REST APIs, Flow Designer custom actions, and security ACL architectures.",
    domainsCount: 5,
    hubUrl: "#",
    practiceUrl: "#",
    mockUrl: "#",
    studyUrl: "#",
  },
  {
    id: "cis-df",
    code: "CIS-DF (CMDB & CSDM)",
    title: "Certified Implementation Specialist — Data Foundation",
    level: "Data & Enterprise Architect",
    release: "In Authoring",
    status: "coming_soon",
    questions: "75 Questions",
    duration: "90 Minutes",
    passScore: "70%",
    freeQuestions: "Free Tier Included",
    description:
      "Enterprise Configuration Management Database (CMDB) data architecture, Common Service Data Model (CSDM v4.0), Identification and Reconciliation Engine (IRE), and Service Graph Connectors.",
    domainsCount: 5,
    hubUrl: "#",
    practiceUrl: "#",
    mockUrl: "#",
    studyUrl: "#",
  },
  {
    id: "cis-itsm",
    code: "CIS-ITSM",
    title: "Certified Implementation Specialist — ITSM",
    level: "Implementation Consultant",
    release: "Roadmap 2026",
    status: "coming_soon",
    questions: "75 Questions",
    duration: "90 Minutes",
    passScore: "70%",
    freeQuestions: "Free Tier Included",
    description:
      "Enterprise implementation of Incident Management, Problem Management, Change Management, Request Management, Service Catalog, and Service Level Management (SLA/OLA).",
    domainsCount: 6,
    hubUrl: "#",
    practiceUrl: "#",
    mockUrl: "#",
    studyUrl: "#",
  },
];

const ROADMAP_TRACKS = [
  { code: "CIS-Discovery", title: "CIS — ITOM Discovery", questions: "75 Questions • 90 Mins" },
  { code: "CIS-EM", title: "CIS — Event Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-HR", title: "CIS — HR Service Delivery", questions: "75 Questions • 90 Mins" },
  { code: "CIS-SAM", title: "CIS — Software Asset Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-HAM", title: "CIS — Hardware Asset Management", questions: "75 Questions • 90 Mins" },
  { code: "CIS-CSM", title: "CIS — Customer Service Management", questions: "75 Questions • 90 Mins" },
  { code: "CTA", title: "Certified Technical Architect", questions: "Review Board & Case Study" },
];

export default function CertificationsCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-8 md:p-10 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3">
            ServiceNow Certification Catalog
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Multi-Exam Practice Engine
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Choose Your ServiceNow Certification Path
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-3xl leading-relaxed">
            Select your target exam to launch high-accuracy practice drills, 90-minute timed mock simulations, or review official blueprint study guides.
          </p>
        </div>
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS.map((cert) => {
          const isAvailable = cert.status === "available";

          return (
            <Card
              key={cert.id}
              className={`p-6 md:p-8 flex flex-col justify-between space-y-6 transition-all ${
                isAvailable
                  ? "border-slate-300 dark:border-slate-800 shadow-sm bg-white dark:bg-[#131D31] hover:border-[#0066FF] dark:hover:border-[#0066FF] hover:shadow-md"
                  : "border-slate-200 dark:border-slate-800/60 bg-slate-50/60 dark:bg-[#0E1524]/60 opacity-80"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                    EXAM CODE: {cert.code}
                  </span>
                  {isAvailable ? (
                    <Badge variant="success" className="text-xs">
                      Available • Australia & Brazil
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs gap-1 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700">
                      <Lock className="h-3 w-3" /> Coming Soon
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold text-[#0B192C] dark:text-white">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0066FF] dark:text-[#38BDF8]">
                      {cert.level}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {cert.freeQuestions}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cert.description}
                </p>

                {/* Exam Metadata Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Questions</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cert.questions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Duration</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cert.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Pass Mark</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cert.passScore}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {isAvailable ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={cert.hubUrl} className="flex-1">
                      <Button variant="accent" className="w-full gap-2 text-xs">
                        <Zap className="h-4 w-4" /> Open Practice Engine
                      </Button>
                    </Link>
                    <Link href={cert.studyUrl}>
                      <Button variant="outline" className="gap-2 text-xs dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        <BookOpen className="h-4 w-4" /> Study Guides
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button variant="outline" disabled className="w-full text-xs text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed">
                    Authoring in Progress • Launches Soon
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Subsequent Certification Roadmap (Phase 2 & Phase 3) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs dark:border-slate-700">
            Platform Roadmap
          </Badge>
          <h2 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Upcoming Specialist & Architect Tracks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Following our core tracks (CSA, CAD, CIS-DF, CIS-ITSM), the following certification engines will be rolled out.
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
                Roadmap
              </Badge>
            </div>
          ))}
        </div>

        {/* Free Question Volume Note */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Free Practice Allocation Note: </span>
          Practice engines provide free blueprint questions upon launch (60 questions for broad certifications with hundreds in the repository like CSA; 40 or 20 for targeted specialist tracks). Pro members receive full question vault access and 3-mode PDF export.
        </div>
      </div>
    </div>
  );
}
