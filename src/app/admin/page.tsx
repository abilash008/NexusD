"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Flag,
  Users,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  BarChart3,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllQuestions } from "@/lib/admin-questions";
import { getAllCertifications, CertificationTrack } from "@/lib/admin-certifications";
import { getStoredReports, updateReportStatus, QuestionReportItem } from "@/lib/reports";

export default function AdminDashboardPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [certs, setCerts] = useState<CertificationTrack[]>([]);
  const [reports, setReports] = useState<QuestionReportItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuestions(getAllQuestions());
    setCerts(getAllCertifications());
    setReports(getStoredReports());

    // Fetch live question inventory from database
    fetch("/api/questions?cert=all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.questions)) {
          setQuestions((prev) => (data.questions.length > 0 ? data.questions : prev));
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      setQuestions(getAllQuestions());
      setCerts(getAllCertifications());
      setReports(getStoredReports());
    };

    window.addEventListener("nexusd_questions_updated", handleUpdate);
    window.addEventListener("nexusd_certifications_updated", handleUpdate);
    window.addEventListener("nexusd_reports_updated", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_questions_updated", handleUpdate);
      window.removeEventListener("nexusd_certifications_updated", handleUpdate);
      window.removeEventListener("nexusd_reports_updated", handleUpdate);
    };
  }, []);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const resolvedReports = reports.filter((r) => r.status === "resolved");

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real-time management for ServiceNow certification tracks, question repositories, and student feedback triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions">
            <Button variant="accent" size="sm" className="gap-1.5 text-xs font-semibold">
              <Plus className="h-4 w-4" /> Author Question
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs dark:border-slate-700">
              <Flag className="h-4 w-4 text-amber-500" /> Triage Reports ({pendingReports.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cataloged Questions</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8]">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {questions.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {questions.length > 0
              ? `${Math.min(60, questions.length)} Free Quota • ${Math.max(0, questions.length - 60)} Pro Vault`
              : "0 Questions Cataloged • Use Authoring or Bulk Upload"}
          </p>
        </Card>

        <Link href="/admin/exams" className="block">
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2 shadow-xs hover:border-[#0066FF] transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Certification Tracks</span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {certs.length || 4} Tracks
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
              {certs.map((c) => c.code).join(" • ") || "CSA • CAD • CIS"}
            </p>
          </Card>
        </Link>

        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Errata Reports</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            {resolvedReports.length} resolved to date
          </p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payment Pass Structure</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            2-Year Access
          </div>
          <p className="text-[11px] text-slate-500">
            ₹499 Single Pass • ₹999 2-Year All-Access
          </p>
        </Card>
      </div>

      {/* Main Grid: Pending Reports & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unresolved Errata Queue */}
        <Card className="lg:col-span-2 p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Unresolved Question Disputes & Feedback
              </h3>
              <p className="text-xs text-slate-500">
                Reports submitted by students undergoing timed mock tests and practice drills.
              </p>
            </div>
            <Link href="/admin/reports">
              <Button variant="ghost" size="sm" className="text-xs text-[#0066FF] gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                Queue is Clear!
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All student-reported question errata have been triaged and resolved.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-[10px]">
                        {report.questionId.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {report.issueType.replace("_", " ")}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    "{report.description}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Reported by: {report.reporterEmail}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/questions?edit=${report.questionId}`}>
                        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
                          Edit Question
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateReportStatus(report.id, "resolved", "Resolved via overview")}
                        className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Col: Quick Access Tools & Blueprint Sync */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0066FF]" />
              Quick Administrative Actions
            </h3>
            <div className="space-y-2">
              <Link href="/admin/exams" className="block">
                <Button variant="outline" className="w-full justify-between text-xs dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Manage Certification Tracks</span>
                  <Award className="h-4 w-4 text-emerald-600" />
                </Button>
              </Link>
              <Link href="/admin/questions" className="block">
                <Button variant="outline" className="w-full justify-between text-xs dark:border-slate-700">
                  <span>Author & Upload Questions</span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </Button>
              </Link>
              <Link href="/admin/reports" className="block">
                <Button variant="outline" className="w-full justify-between text-xs dark:border-slate-700 text-amber-600 dark:text-amber-400">
                  <span>Triage Errata Disputes</span>
                  <Flag className="h-4 w-4 text-amber-500" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Release Syllabus Guard */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Syllabus Standard Compliance
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              NexusD enforces <strong>Australia & Brazil 2026</strong> release standards. Ensure any newly authored question matches official examination blueprint weighting and avoids deprecated features.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
