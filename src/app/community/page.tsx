"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Sparkles,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Share2,
  Building,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COHORTS = [
  {
    title: "CSA Aspirant Study Circle",
    track: "CSA Foundational",
    description: "Daily question breakdowns, exam traps, and real-time query resolution for Certified System Administrator candidates.",
    members: "1,450+ Aspirants",
    tag: "Active Cohort",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    linkText: "Join CSA WhatsApp Cohort",
    linkUrl: "https://chat.whatsapp.com",
  },
  {
    title: "CAD & Scripting Masters",
    track: "CAD Developer",
    description: "Deep dive into Client Scripts, Business Rules, Script Includes, Flow Designer spokes, and custom application scoping.",
    members: "920+ Developers",
    tag: "Developer Track",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    linkText: "Join CAD Developer Circle",
    linkUrl: "https://chat.whatsapp.com",
  },
  {
    title: "CMDB & CSDM Implementation Group",
    track: "CIS-DF & CIS-ITSM",
    description: "Architectural discussions on CSDM v4.0, IRE reconciliation rules, and Service Graph Connectors for Implementation Specialists.",
    members: "680+ Consultants",
    tag: "Architect Track",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    linkText: "Join Implementation Group",
    linkUrl: "https://chat.whatsapp.com",
  },
];

const RECENT_DISCUSSIONS = [
  {
    id: 1,
    topic: "Australia & Brazil 2026: Flow Designer vs Workflow Editor Question Frequency",
    replies: 28,
    author: "Rahul S. (CSA Certified)",
    track: "CSA Blueprint",
  },
  {
    id: 2,
    topic: "IRE Identification Rules: How to handle Duplicate CI resolution in CIS-DF exam",
    replies: 19,
    author: "Pooja M. (CIS-DF Consultant)",
    track: "CIS-DF Blueprint",
  },
  {
    id: 3,
    topic: "Script Includes: Client Callable vs Server Only syntax pitfalls in CAD mock tests",
    replies: 34,
    author: "Anand K. (CAD Practitioner)",
    track: "CAD Blueprint",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-8 md:p-12 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs py-1 px-3 font-semibold">
            NexusD Candidate Network
          </Badge>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            3,000+ Active Aspirants Across India & Global
          </span>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Connect, Collaborate & Clear Your Exams
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Collaborate with peers preparing for the same ServiceNow release, discuss tricky scenario questions, share exam-day experiences, and connect with certified practitioners.
          </p>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Active Study Circles & WhatsApp Cohorts
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Live Peer Groups
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COHORTS.map((ch, idx) => (
            <Card
              key={idx}
              className="p-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-5 shadow-xs hover:border-[#0066FF] hover:shadow-md transition-all"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge className={`text-[10px] font-semibold border ${ch.badgeColor}`}>
                    {ch.tag}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    {ch.members}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#0066FF] dark:text-[#38BDF8] uppercase tracking-wider">
                    {ch.track}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ch.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={ch.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block"
                >
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold gap-1.5 dark:border-slate-700 cursor-pointer"
                  >
                    {ch.linkText} <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Discussion Topics Strip */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#0066FF]" /> Community Exam Debriefs & Q&A
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recent discussions and scenario breakdowns from candidates taking recent exams.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {RECENT_DISCUSSIONS.map((d) => (
            <div key={d.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white hover:text-[#0066FF] cursor-pointer transition-colors">
                  {d.topic}
                </span>
                <div className="flex items-center gap-3 text-slate-500">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 dark:border-slate-700">
                    {d.track}
                  </Badge>
                  <span>Shared by {d.author}</span>
                </div>
              </div>
              <span className="font-mono text-slate-400 text-xs shrink-0 font-medium">
                {d.replies} responses
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/60 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Ready to calibrate your exam readiness score?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Launch our 60-question free practice drill or attempt the full 90-minute timed mock simulation across any certification track.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/certifications">
            <Button variant="accent" size="sm" className="gap-2 text-xs font-semibold cursor-pointer h-10 px-4">
              <Zap className="h-4 w-4" /> Start Practice Drill
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-[#0B192C] hover:bg-[#1A2E44] text-white cursor-pointer h-10 px-4">
              <Compass className="h-4 w-4" /> Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
