"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Edit3,
  Search,
  Filter,
  Check,
  MessageSquare,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getStoredReports,
  updateReportStatus,
  QuestionReportItem,
} from "@/lib/reports";
import { getAllQuestions } from "@/lib/admin-questions";
import { PracticeQuestion } from "@/data/csa-questions";

const ISSUE_TYPE_LABELS: Record<string, string> = {
  incorrect_answer: "Incorrect Answer Key",
  outdated_syllabus: "Outdated Syllabus",
  typo_wording: "Typo or Phrasing",
  explanation_unclear: "Unclear Explanation",
  other: "General Feedback",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<QuestionReportItem[]>([]);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved" | "dismissed">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminNotesDrafts, setAdminNotesDrafts] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    setReports(getStoredReports());
    setQuestions(getAllQuestions());
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("nexusd_reports_updated", handleUpdate);
    window.addEventListener("nexusd_questions_updated", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_reports_updated", handleUpdate);
      window.removeEventListener("nexusd_questions_updated", handleUpdate);
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Build question lookup map
  const questionMap = useMemo(() => {
    const map = new Map<string, PracticeQuestion>();
    questions.forEach((q) => map.set(q.id.toLowerCase(), q));
    return map;
  }, [questions]);

  // Counts
  const counts = useMemo(() => {
    const pending = reports.filter((r) => r.status === "pending").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const dismissed = reports.filter((r) => r.status === "dismissed").length;
    return { all: reports.length, pending, resolved, dismissed };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.issueType !== typeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesQuestionId = r.questionId.toLowerCase().includes(q);
        const matchesEmail = r.reporterEmail.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        if (!matchesId && !matchesQuestionId && !matchesEmail && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [reports, statusFilter, typeFilter, searchQuery]);

  const handleStatusChange = (
    reportId: string,
    newStatus: "pending" | "resolved" | "dismissed",
    customNote?: string
  ) => {
    const note = customNote ?? adminNotesDrafts[reportId];
    updateReportStatus(reportId, newStatus, note);
    loadData();
    showNotification(`Report status updated to ${newStatus}.`);
  };

  const handleSaveNotes = (reportId: string) => {
    const note = adminNotesDrafts[reportId];
    if (note === undefined) return;
    const existing = reports.find((r) => r.id === reportId);
    if (!existing) return;
    updateReportStatus(reportId, existing.status, note);
    loadData();
    showNotification(`Admin notes saved for report.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2.5">
            <Flag className="h-7 w-7 text-amber-500" />
            Errata Dispute Triage Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Review student dispute submissions, verify answer keys against official release guides, and maintain catalog integrity.
          </p>
        </div>

        <Link href="/admin/questions">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold dark:border-slate-700">
            <Edit3 className="h-4 w-4" /> Open Question CMS
          </Button>
        </Link>
      </div>

      {/* KPI Triage Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card
          onClick={() => setStatusFilter("all")}
          className={`p-4 border transition-colors cursor-pointer ${
            statusFilter === "all"
              ? "border-[#0066FF] bg-blue-50/40 dark:bg-blue-950/30"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">All Inquiries</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {counts.all}
          </div>
        </Card>

        <Card
          onClick={() => setStatusFilter("pending")}
          className={`p-4 border transition-colors cursor-pointer ${
            statusFilter === "pending"
              ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]"
          }`}
        >
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Action Required
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
            {counts.pending}
          </div>
        </Card>

        <Card
          onClick={() => setStatusFilter("resolved")}
          className={`p-4 border transition-colors cursor-pointer ${
            statusFilter === "resolved"
              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {counts.resolved}
          </div>
        </Card>

        <Card
          onClick={() => setStatusFilter("dismissed")}
          className={`p-4 border transition-colors cursor-pointer ${
            statusFilter === "dismissed"
              ? "border-slate-400 bg-slate-100/60 dark:bg-slate-800/40"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31]"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">Dismissed</div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono mt-1">
            {counts.dismissed}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by question ID, reporter email, or description..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Issue Type Filter */}
          <div className="w-full md:w-56">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="all">All Issue Categories</option>
              {Object.entries(ISSUE_TYPE_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
          Showing <strong>{filteredReports.length}</strong> reports matching criteria
        </div>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Errata Reports in this Queue
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === "pending"
              ? "Outstanding question disputes have been completely triaged! Excellent work maintaining catalog health."
              : "No dispute tickets match your active filter parameters."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const linkedQuestion = questionMap.get(report.questionId.toLowerCase());
            const currentNote =
              adminNotesDrafts[report.id] !== undefined
                ? adminNotesDrafts[report.id]
                : report.adminNotes || "";

            return (
              <Card
                key={report.id}
                className={`p-5 sm:p-6 border bg-white dark:bg-[#131D31] shadow-xs space-y-4 transition-all ${
                  report.status === "pending"
                    ? "border-amber-300 dark:border-amber-900/60"
                    : report.status === "resolved"
                    ? "border-emerald-200 dark:border-emerald-950/60"
                    : "border-slate-200 dark:border-slate-800 opacity-80"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {report.id.toUpperCase()}
                    </span>

                    <Badge variant="accent" className="text-[10px]">
                      {report.questionId.toUpperCase()}
                    </Badge>

                    <Badge
                      className={`text-[10px] ${
                        report.issueType === "incorrect_answer"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                          : report.issueType === "outdated_syllabus"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8] border border-blue-500/20"
                      }`}
                    >
                      {ISSUE_TYPE_LABELS[report.issueType] || report.issueType}
                    </Badge>

                    {/* Status Badge */}
                    {report.status === "pending" ? (
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px]">
                        Pending Review
                      </Badge>
                    ) : report.status === "resolved" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30 text-[10px]">
                        Dismissed
                      </Badge>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(report.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                {/* Feedback Description & Reporter Info */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Student Feedback Report:
                    </span>
                    <span className="font-mono">Reporter: {report.reporterEmail}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                    "{report.description}"
                  </p>
                </div>

                {/* Linked Question Context */}
                {linkedQuestion ? (
                  <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
                        Catalog Question Preview ({linkedQuestion.domain})
                      </span>
                      <Link href={`/admin/questions?edit=${linkedQuestion.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-[#0066FF] dark:text-[#38BDF8] gap-1 hover:underline"
                        >
                          <Edit3 className="h-3 w-3" /> Edit in CMS
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {linkedQuestion.questionText}
                    </p>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                      <div>
                        <strong className="text-emerald-700 dark:text-emerald-400">Current Key:</strong>{" "}
                        {linkedQuestion.options
                          .filter((o) => o.isCorrect)
                          .map((o) => o.text)
                          .join(", ")}
                      </div>
                      <div className="text-slate-500 italic">
                        <strong>Explanation:</strong> {linkedQuestion.explanation}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Associated question ID "{report.questionId}" not found in current catalog.
                  </div>
                )}

                {/* Admin Notes & Action Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Admin notes input */}
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) =>
                        setAdminNotesDrafts((prev) => ({
                          ...prev,
                          [report.id]: e.target.value,
                        }))
                      }
                      placeholder="Add admin resolution notes (e.g. 'Updated question stem option B in release audit')..."
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                    />
                    {adminNotesDrafts[report.id] !== undefined && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveNotes(report.id)}
                        className="h-8 text-xs shrink-0"
                      >
                        Save Note
                      </Button>
                    )}
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {report.status !== "resolved" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            report.id,
                            "resolved",
                            currentNote || "Resolution verified against release specification."
                          )
                        }
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" /> Mark Resolved
                      </Button>
                    )}

                    {report.status !== "dismissed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(report.id, "dismissed")}
                        className="h-8 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        Dismiss
                      </Button>
                    )}

                    {report.status !== "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(report.id, "pending")}
                        className="h-8 text-xs text-amber-600 hover:text-amber-700 gap-1"
                      >
                        <RotateCcw className="h-3 w-3" /> Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
