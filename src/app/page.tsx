import React from "react";
import Link from "next/link";
import {
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] dark:from-[#0B1120] dark:via-[#0E1726] dark:to-[#0B1120] py-16 md:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-[#0066FF] dark:text-[#38BDF8] shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Practice Engine for Certification Preparations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B192C] dark:text-white leading-tight">
              Ace Your ServiceNow Exam with{" "}
              <span className="text-[#0066FF] dark:text-[#38BDF8] relative inline-block">
                Precision & Speed
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              The high-performance practice engine engineered for Indian freshers, non-IT switchers, and enterprise trainees. Better explanations, zero latency, and blueprint-aligned preparation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link href="/certifications">
                <Button variant="accent" size="lg" className="w-full sm:w-auto text-base gap-2">
                  <Award className="h-5 w-5" />
                  Launch Practice Engine (Free)
                </Button>
              </Link>
              <Link href="/study">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base gap-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  <BookOpen className="h-5 w-5" />
                  Explore Study Guides & Blueprints
                </Button>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Updated for Australia & Brazil Releases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
                <span>Instant Scoring & Explanations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                <span>100% Curated & Vetted Questions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Certification: CSA */}
      <section className="py-16 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent">Practice Engine for Certification Preparations</Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">Starting with CSA Slice</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B192C] dark:text-white">
                Certified System Administrator (CSA)
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                The universal entry requirement into the ServiceNow ecosystem, with CAD & CIS preparation modules in active development.
              </p>
            </div>
            <Link href="/certifications/csa">
              <Button variant="default" className="gap-2">
                Open Practice Engine <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Tier Card */}
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-[#131D31] hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Free Preview</span>
                  <Badge variant="success">Available Now</Badge>
                </div>
                <CardTitle className="text-xl">Free Sample Mock Exam</CardTitle>
                <CardDescription>
                  Experience the interface with 15 handpicked blueprint questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    15 practice questions with full explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Untimed practice & instant feedback mode
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    No credit card required
                  </li>
                </ul>
                <Link href="/certifications/csa/practice" className="block pt-2">
                  <Button variant="outline" className="w-full dark:border-slate-700 dark:hover:bg-slate-800">
                    Launch Free Test
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Timed Exam Mode */}
            <Card className="border-blue-200 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20 relative shadow-sm">
              <div className="absolute -top-3 right-4">
                <Badge variant="default" className="bg-[#0066FF] text-white">Recommended</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0066FF] dark:text-[#38BDF8] uppercase tracking-wider">Full Simulation</span>
                  <Clock className="h-4 w-4 text-[#0066FF] dark:text-[#38BDF8]" />
                </div>
                <CardTitle className="text-xl">Full Timed Mock Series</CardTitle>
                <CardDescription>
                  Simulate the exact real testing conditions: 60 questions in 90 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                    Full 60-question randomized mock exams
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                    Accurate 90-minute countdown timer & bookmarking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                    Domain-level pass probability analytics
                  </li>
                </ul>
                <Link href="/certifications/csa/mock" className="block pt-2">
                  <Button variant="accent" className="w-full">
                    Take Full Timed Mock
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Study Blueprint */}
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-[#131D31] hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Knowledge Hub</span>
                  <Layers className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <CardTitle className="text-xl">Domain Study Guide</CardTitle>
                <CardDescription>
                  Deep conceptual guides breaking down each exam blueprint topic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
                    User Interface & Navigation (20%)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
                    Database Administration & Schema (30%)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
                    Process Automation & Scripting (50%)
                  </li>
                </ul>
                <Link href="/study/csa" className="block pt-2">
                  <Button variant="outline" className="w-full dark:border-slate-700 dark:hover:bg-slate-800">
                    Read Study Guides
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section className="py-16 bg-[#F8FAFC] dark:bg-[#0B1120]/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B192C] dark:text-white">
              Built Specifically for Your Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              NexusD personalizes your path based on where you are starting from.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#131D31] rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">College Freshers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Break into enterprise IT without prior experience. Master the CSA blueprint, understand personal developer instances (PDIs), and build confidence before taking the exam.
              </p>
            </div>

            <div className="bg-white dark:bg-[#131D31] rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Non-IT Career Switchers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Transition smoothly from operations, support, or non-technical backgrounds into ServiceNow Administrator or Business Analyst roles with zero jargon.
              </p>
            </div>

            <div className="bg-white dark:bg-[#131D31] rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Trainees</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Working at TCS, Infosys, Wipro, or Deloitte and need to pass your mandatory internal certification deadline? Prepare fast with high-accuracy questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
