import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "ServiceNow Certified System Administrator (CSA) Practice Exams — NexusD",
  description:
    "Prepare for the ServiceNow CSA exam with 100% verified practice questions, timed 90-minute simulations, and blueprint-aligned domain guides.",
};

const CSA_DOMAINS = [
  {
    name: "User Interface & Navigation",
    slug: "ui-nav",
    weight: "20%",
    questions: "12 Questions",
    topics: "Next Experience UI, Lists & Forms, Filters & Breadcrumbs, Personalize vs Configure, Branding & System Properties",
  },
  {
    name: "Collaboration & Task Management",
    slug: "collaboration",
    weight: "20%",
    questions: "12 Questions",
    topics: "User & Role Management, Groups, Task Management, Activity Stream, Notifications & Events",
  },
  {
    name: "Database Administration & Schema",
    slug: "db-admin",
    weight: "30%",
    questions: "18 Questions",
    topics: "Schema Map, Tables & Dictionary, Table Extension, Import Sets & Transform Maps, CMDB & Discovery overview",
  },
  {
    name: "Self-Service & Process Automation",
    slug: "automation",
    weight: "20%",
    questions: "12 Questions",
    topics: "Knowledge Management, Service Catalog & Record Producers, Flow Designer, Execution Plans & Workflows",
  },
  {
    name: "Introduction to Development",
    slug: "development",
    weight: "10%",
    questions: "6 Questions",
    topics: "UI Policies & Data Policies, Client Scripts (onLoad, onChange, onSubmit), Business Rules, Update Sets",
  },
];

export default function CSACertificationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Certification Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="text-sm py-1 px-3">
            Exam Blueprint: Australia & Brazil Releases
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Exam Code: CSA</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            ServiceNow Certified System Administrator (CSA)
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            The CSA certification proves that a candidate has the skills and essential knowledge to configure, implement, and maintain the ServiceNow platform. This is the prerequisite foundation for all subsequent ServiceNow developer and specialist career paths.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Mock Standard</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">60 Questions</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">60 Free Questions Included</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Time Limit</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">90 Minutes</div>
            <span className="text-[10px] text-slate-400 block font-mono">1.5 Mins per Question</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Passing Score</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">70% Required</div>
            <span className="text-[10px] text-slate-400 block">42 / 60 Correct</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Repository Bank</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">85+ Questions</div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 block">Pro PDF Export Available</span>
          </div>
        </div>

        {/* Launch Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/certifications/csa/practice">
            <Button variant="accent" size="lg" className="gap-2">
              <Zap className="h-4 w-4" /> Start Free Practice Mode
            </Button>
          </Link>
          <Link href="/certifications/csa/mock">
            <Button variant="default" size="lg" className="gap-2">
              <Clock className="h-4 w-4" /> Launch 90-Min Timed Mock
            </Button>
          </Link>
          <Link href="/study/csa/question-bank">
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700">
              <Layers className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" /> Question Bank & PDF Export
            </Button>
          </Link>
          <Link href="/study/csa">
            <Button variant="outline" size="lg" className="gap-2 dark:border-slate-700">
              <BookOpen className="h-4 w-4" /> Syllabus Domain Guides
            </Button>
          </Link>
        </div>
      </div>

      {/* Blueprint Domains Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white">
            Official CSA Exam Blueprint Breakdown
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            NexusD practice questions and mock tests are distributed precisely across these official domain weightings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CSA_DOMAINS.map((domain, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Domain {index + 1}</span>
                  <Badge variant="accent" className="font-mono text-xs">
                    {domain.weight} Exam Weight
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{domain.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{domain.topics}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                  {domain.questions}
                </span>
                <Link href={`/certifications/csa/practice?domain=${domain.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-[#0066FF] dark:text-blue-400 border-[#0066FF]/30 dark:border-blue-500/30 hover:bg-[#0066FF]/10 hover:border-[#0066FF]"
                  >
                    Practice Domain <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
