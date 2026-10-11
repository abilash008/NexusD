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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "ServiceNow Developer Community & Study Circles — NexusD",
  description:
    "Join the NexusD ServiceNow learning community. Collaborate with aspirants, participate in weekly mock reviews, and connect with certified architects.",
};

const CHANNELS = [
  {
    title: "CSA Aspirant Study Circle",
    description: "Daily question breakdowns, exam traps, and real-time query resolution for Certified System Administrator candidates.",
    members: "1,240+ Aspirants",
    tag: "Active Cohort",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    title: "CAD & Scripting Masters",
    description: "Deep dive into Client Scripts, Business Rules, Script Includes, Flow Designer spokes, and custom application scoping.",
    members: "820+ Developers",
    tag: "Developer Track",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    title: "CMDB & CSDM Implementation Group",
    description: "Architectural discussions on CSDM v4.0, IRE reconciliation rules, and Service Graph Connectors for CIS-DF and CIS-ITSM.",
    members: "610+ Consultants",
    tag: "Architect Track",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-8 md:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-xs px-3 py-1">
            NexusD Learning Ecosystem
          </Badge>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            2,600+ Certified Members
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Connect, Collaborate & Clear Your ServiceNow Exams
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Pair up with peers preparing for the same release cycle, discuss challenging blueprint scenarios, and get guidance from certified ServiceNow practitioners.
          </p>
        </div>
      </div>

      {/* Community Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHANNELS.map((ch, idx) => (
          <Card
            key={idx}
            className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-5 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={`text-[10px] font-semibold border ${ch.badgeColor}`}>
                  {ch.tag}
                </Badge>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  {ch.members}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {ch.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {ch.description}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://chat.whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block"
              >
                <Button
                  variant="outline"
                  className="w-full text-xs gap-1.5 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Join Study Circle <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Platform Resources & Quick Links */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-[#131D31] dark:via-[#111A2E] dark:to-[#17223B] p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-xl font-bold text-[#0B192C] dark:text-white">
            Ready to test your exam preparedness?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Launch our 60-question free practice drill or attempt the full 90-minute timed mock simulation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/certifications/csa/practice">
            <Button variant="accent" size="sm" className="gap-2 text-xs">
              <BookOpen className="h-4 w-4" /> Start Free Practice
            </Button>
          </Link>
          <Link href="/certifications/csa/mock">
            <Button variant="default" size="sm" className="gap-2 text-xs">
              <Award className="h-4 w-4" /> 90-Min Mock Exam
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
