"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CertificationTrack,
  getAllCertifications,
  deleteCertification,
} from "@/lib/admin-certifications";
import { getAllQuestions } from "@/lib/admin-questions";
import { ExamEditorModal } from "@/components/admin/exam-editor-modal";

export default function AdminExamsPage() {
  const [certs, setCerts] = useState<CertificationTrack[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<CertificationTrack | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const refreshData = () => {
    setCerts(getAllCertifications());
    setAllQuestions(getAllQuestions());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener("nexusd_certifications_updated", handleUpdate);
    window.addEventListener("nexusd_questions_updated", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_certifications_updated", handleUpdate);
      window.removeEventListener("nexusd_questions_updated", handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Questions count per exam map
  const questionCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    allQuestions.forEach((q) => {
      const cId = (q.certificationId || "csa").toLowerCase();
      map[cId] = (map[cId] || 0) + 1;
    });
    return map;
  }, [allQuestions]);

  const handleCreateNew = () => {
    setEditingExam(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (exam: CertificationTrack) => {
    setEditingExam(exam);
    setIsEditorOpen(true);
  };

  const handleDelete = (examId: string, examCode: string) => {
    if (examId === "csa") {
      alert("The foundational CSA track cannot be deleted.");
      return;
    }
    if (confirm(`Are you sure you want to delete track '${examCode}'?`)) {
      deleteCertification(examId);
      refreshData();
      showToast(`Track ${examCode} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Certification Tracks & Exam Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Create and maintain certification tracks (CSA, CAD, CIS, etc.), customize examination blueprint domains, and manage 1-year pass structures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            onClick={handleCreateNew}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" /> Create New Exam Track
          </Button>
        </div>
      </div>

      {/* Certification Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certs.map((track) => {
          const qCount = questionCountMap[track.id.toLowerCase()] || 0;

          return (
            <Card
              key={track.id}
              className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold px-2.5 py-1 rounded-lg bg-[#0B192C] text-white tracking-wide">
                        {track.code}
                      </span>
                      <Badge
                        className={`text-[10px] uppercase font-mono ${
                          track.status === "active"
                            ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                            : track.status === "upcoming"
                            ? "bg-blue-500/15 text-[#0066FF] border border-blue-500/30"
                            : "bg-slate-500/15 text-slate-500 border border-slate-500/30"
                        }`}
                      >
                        {track.status}
                      </Badge>
                      <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[10px] font-mono">
                        ₹{track.priceINR} (1-Year Pass)
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {track.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(track)}
                      className="h-8 px-2 text-xs text-slate-500 hover:text-[#0066FF]"
                      title="Edit Track"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    {track.id !== "csa" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(track.id, track.code)}
                        className="h-8 px-2 text-xs text-slate-400 hover:text-red-500"
                        title="Delete Track"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {track.shortDescription}
                </p>

                {/* Exam Specs Pills */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">
                      {track.durationMinutes} Mins
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Passing Score</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                      {track.passingPercentage}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Questions</span>
                    <strong className="font-mono text-blue-600 dark:text-blue-400">
                      {qCount} in Bank
                    </strong>
                  </div>
                </div>

                {/* Blueprint Domains */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Official Blueprint Domains ({track.domains.length}):
                  </span>
                  <div className="space-y-1 text-xs">
                    {track.domains.map((dom) => (
                      <div
                        key={dom.slug}
                        className="flex items-center justify-between p-1.5 rounded-md bg-slate-50/50 dark:bg-slate-900/30 text-[11px]"
                      >
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
                          {dom.name}
                        </span>
                        <span className="font-mono font-bold text-slate-500 shrink-0">
                          {dom.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Syllabus: {track.releaseVersion}
                </span>

                <Link href={`/admin/questions?cert=${track.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 text-[#0066FF] dark:text-[#38BDF8] border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Manage Questions ({qCount})
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <ExamEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          examToEdit={editingExam}
          onSaveSuccess={(saved) => {
            refreshData();
            showToast(`Certification track ${saved.code} successfully saved!`);
          }}
        />
      )}
    </div>
  );
}
