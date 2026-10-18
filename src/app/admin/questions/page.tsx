"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Check,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowUpDown,
  ExternalLink,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllQuestions,
  saveQuestion,
  resetQuestion,
  deleteQuestion,
} from "@/lib/admin-questions";
import {
  getAllCertifications,
  CertificationTrack,
} from "@/lib/admin-certifications";
import {
  PracticeQuestion,
  QuestionOption,
} from "@/data/csa-questions";
import { BulkUploadModal } from "@/components/admin/bulk-upload-modal";

function QuestionCMSContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [certs, setCerts] = useState<CertificationTrack[]>([]);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [selectedCert, setSelectedCert] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "free" | "pro">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Load questions and certifications
  const refreshData = () => {
    setCerts(getAllCertifications());
    setQuestions(getAllQuestions());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();

    // Set initial cert from URL query if present
    const certParam = searchParams.get("cert");
    if (certParam) {
      setSelectedCert(certParam.toLowerCase());
    }

    const handleUpdate = () => refreshData();
    window.addEventListener("nexusd_questions_updated", handleUpdate);
    window.addEventListener("nexusd_certifications_updated", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_questions_updated", handleUpdate);
      window.removeEventListener("nexusd_certifications_updated", handleUpdate);
    };
  }, [searchParams]);

  // Handle URL query param: ?edit=<questionId>
  useEffect(() => {
    if (!mounted || questions.length === 0) return;
    const editId = searchParams.get("edit");
    if (editId) {
      const target = questions.find((q) => q.id.toLowerCase() === editId.toLowerCase());
      if (target) {
        setEditingQuestion(target);
        setIsEditorOpen(true);
      }
    }
  }, [mounted, searchParams, questions]);

  // Notifications helper
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Active cert object
  const activeCertObj = useMemo(() => {
    if (selectedCert === "all") return null;
    return certs.find((c) => c.id.toLowerCase() === selectedCert.toLowerCase()) || null;
  }, [certs, selectedCert]);

  // Available domain options for current filter
  const currentDomainOptions = useMemo(() => {
    if (activeCertObj) {
      return activeCertObj.domains;
    }
    // If "all" selected, aggregate unique domains from all certs
    const map = new Map<string, { slug: string; name: string }>();
    certs.forEach((c) => {
      c.domains.forEach((d) => map.set(d.slug, { slug: d.slug, name: `${d.name} (${c.code})` }));
    });
    return Array.from(map.values());
  }, [certs, activeCertObj]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Certification Filter
      const qCert = (q.certificationId || "csa").toLowerCase();
      if (selectedCert !== "all" && qCert !== selectedCert.toLowerCase()) {
        return false;
      }

      // Domain filter
      if (selectedDomain !== "all" && q.domainSlug !== selectedDomain) {
        return false;
      }

      // Tier filter
      if (selectedTier === "free" && !q.isFree) return false;
      if (selectedTier === "pro" && q.isFree) return false;

      // Text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesExplanation = q.explanation.toLowerCase().includes(query);
        const matchesOptions = q.options.some((o) => o.text.toLowerCase().includes(query));
        if (!matchesText && !matchesId && !matchesExplanation && !matchesOptions) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedCert, selectedDomain, selectedTier, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Open Editor for New Question
  const handleCreateNew = () => {
    const targetCertId = selectedCert !== "all" ? selectedCert : (certs[0]?.id || "csa");
    const targetCert = certs.find((c) => c.id.toLowerCase() === targetCertId.toLowerCase()) || certs[0];
    const firstDomain = targetCert?.domains[0] || { slug: "general", name: "General Concepts" };

    const newId = `${targetCert?.id || "csa"}-custom-${Date.now().toString(36).slice(-4)}`;
    const blankQuestion: PracticeQuestion = {
      id: newId,
      certificationId: targetCert?.id || "csa",
      domain: firstDomain.name,
      domainSlug: firstDomain.slug,
      questionText: "",
      isMultiSelect: false,
      requiredSelectCount: 1,
      options: [
        { id: "opt-1", text: "", isCorrect: true },
        { id: "opt-2", text: "", isCorrect: false },
        { id: "opt-3", text: "", isCorrect: false },
        { id: "opt-4", text: "", isCorrect: false },
      ],
      explanation: "",
      releaseVersion: targetCert?.releaseVersion || "Australia & Brazil 2026",
      isFree: false,
    };
    setEditingQuestion(blankQuestion);
    setIsEditorOpen(true);
  };

  // Open Editor for Existing Question
  const handleEdit = (question: PracticeQuestion) => {
    setEditingQuestion(JSON.parse(JSON.stringify(question))); // Deep clone
    setIsEditorOpen(true);
  };

  // Reset Overridden Question back to default
  const handleReset = (questionId: string) => {
    if (confirm(`Reset question ${questionId} to its seed repository default?`)) {
      resetQuestion(questionId);
      refreshData();
      showToast(`Question ${questionId} reset to seed default.`, "info");
    }
  };

  // Save Question Callback
  const handleSaveQuestion = (saved: PracticeQuestion) => {
    saveQuestion(saved);
    refreshData();
    setIsEditorOpen(false);
    setEditingQuestion(null);
    showToast(`Question ${saved.id} successfully saved to the active catalog!`);
  };

  // Check if a question has local custom overrides
  const isQuestionOverridden = (id: string) => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("nexusd_custom_questions");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed[id]);
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-[#0066FF] dark:text-[#38BDF8]" />
            Question Authoring CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Author and import exam questions across all ServiceNow certifications (CSA, CAD, CIS, etc.).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBulkUploadOpen(true)}
            className="gap-1.5 text-xs font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Bulk Upload (Excel / CSV)
          </Button>

          {/* Author New Question Button */}
          <Button
            variant="accent"
            size="sm"
            onClick={handleCreateNew}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" /> Author Question
          </Button>

          <Link href="/admin/exams">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-slate-500 hover:text-[#0066FF]"
            >
              <Award className="h-4 w-4" /> Manage Tracks
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Exam Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => {
            setSelectedCert("all");
            setSelectedDomain("all");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCert === "all"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "bg-white dark:bg-[#131D31] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <span>All Certifications</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200">
            {questions.length}
          </span>
        </button>

        {certs.map((c) => {
          const isSelected = selectedCert.toLowerCase() === c.id.toLowerCase();
          const count = questions.filter((q) => (q.certificationId || "csa").toLowerCase() === c.id.toLowerCase()).length;

          return (
            <button
              type="button"
              key={c.id}
              onClick={() => {
                setSelectedCert(c.id);
                setSelectedDomain("all");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? "bg-[#0066FF] text-white shadow-xs"
                  : "bg-white dark:bg-[#131D31] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <span>{c.code}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-blue-800 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {count} Qs
              </span>
            </button>
          );
        })}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by question ID, prompt stem, option text, or blueprint explanation..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Exam Domain Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="all">
                {activeCertObj ? `All ${activeCertObj.code} Domains` : "All Domains"}
              </option>
              {currentDomainOptions.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedTier("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTier === "all"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tiers
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTier("free");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTier === "free"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Free Quota
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTier("pro");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTier === "pro"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pro Vault
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span>
            Showing <strong>{filteredQuestions.length}</strong> questions{" "}
            {selectedCert !== "all" && `under ${activeCertObj?.code || selectedCert.toUpperCase()}`}
          </span>
          <span className="font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </Card>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] space-y-3">
          <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No questions found matching criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {selectedCert !== "all"
              ? `There are currently no questions cataloged under ${activeCertObj?.code || selectedCert}. You can author one now or upload an Excel sheet.`
              : "Try adjusting your search query, selecting another domain, or author a new question."}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("all");
                setSelectedTier("all");
              }}
            >
              Clear Filters
            </Button>
            <Button variant="accent" size="sm" onClick={handleCreateNew}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Author First Question
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {paginatedQuestions.map((q) => {
            const isOverridden = isQuestionOverridden(q.id);
            const qCert = (q.certificationId || "csa").toUpperCase();

            return (
              <Card
                key={q.id}
                className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {q.id.toUpperCase()}
                    </span>

                    <Badge className="bg-[#0B192C] text-white dark:bg-blue-600 text-[10px] font-mono uppercase">
                      {qCert}
                    </Badge>

                    <Badge variant="accent" className="text-[10px]">
                      {q.domain}
                    </Badge>

                    {q.isFree ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                        Free Quota
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8] border border-blue-500/20 text-[10px]">
                        Pro Vault
                      </Badge>
                    )}

                    {q.isMultiSelect ? (
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Multi-Select ({q.requiredSelectCount || 2})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        Single Choice
                      </span>
                    )}

                    {isOverridden && (
                      <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px]">
                        Custom / Overridden
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {isOverridden && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(q.id)}
                        className="h-8 px-2.5 text-xs text-slate-500 hover:text-red-600 gap-1"
                        title="Reset to default seed question"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(q)}
                      className="h-8 px-3 text-xs gap-1.5 font-semibold text-[#0066FF] dark:text-[#38BDF8] border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit Question
                    </Button>
                  </div>
                </div>

                {/* Question Stem */}
                <p className="text-sm font-semibold text-[#0B192C] dark:text-white leading-relaxed">
                  {q.questionText}
                </p>

                {/* Options Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {q.options.map((opt, i) => (
                    <div
                      key={opt.id || i}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                        opt.isCorrect
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase font-bold shrink-0 pt-0.5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                      {opt.isCorrect && (
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation Footer */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Official Blueprint Explanation:</strong> {q.explanation}
                    <span className="block pt-1 font-mono text-[10px] text-blue-600 dark:text-blue-400">
                      Exam: {qCert} • Release Alignment: {q.releaseVersion}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-xs"
          >
            Previous
          </Button>
          <span className="text-xs text-slate-500 font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      )}

      {/* Question Authoring & Editing Modal */}
      {isEditorOpen && editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion}
          certs={certs}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
        />
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          activeCertId={selectedCert !== "all" ? selectedCert : "csa"}
          onClose={() => setIsBulkUploadOpen(false)}
          onSuccess={(count) => {
            refreshData();
            showToast(`Bulk upload completed! Imported ${count} questions.`);
          }}
        />
      )}
    </div>
  );
}

interface QuestionEditorModalProps {
  question: PracticeQuestion;
  certs: CertificationTrack[];
  onClose: () => void;
  onSave: (question: PracticeQuestion) => void;
}

function QuestionEditorModal({ question, certs, onClose, onSave }: QuestionEditorModalProps) {
  const [formData, setFormData] = useState<PracticeQuestion>({ ...question });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active cert based on formData.certificationId
  const activeCert = useMemo(() => {
    const cId = (formData.certificationId || "csa").toLowerCase();
    return certs.find((c) => c.id.toLowerCase() === cId) || certs[0];
  }, [certs, formData.certificationId]);

  // When admin switches certification track
  const handleCertChange = (certId: string) => {
    const targetCert = certs.find((c) => c.id.toLowerCase() === certId.toLowerCase()) || certs[0];
    const firstDomain = targetCert.domains[0] || { slug: "general", name: "General Concepts" };

    setFormData((prev) => ({
      ...prev,
      certificationId: targetCert.id,
      domain: firstDomain.name,
      domainSlug: firstDomain.slug,
      releaseVersion: targetCert.releaseVersion || prev.releaseVersion,
    }));
  };

  // Handle domain change
  const handleDomainChange = (slug: string) => {
    const domainObj = activeCert.domains.find((d) => d.slug === slug);
    if (domainObj) {
      setFormData((prev) => ({
        ...prev,
        domainSlug: domainObj.slug,
        domain: domainObj.name,
      }));
    }
  };

  // Option text change
  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = { ...updatedOptions[index], text };
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  // Toggle option correctness
  const handleToggleCorrectness = (index: number) => {
    if (formData.isMultiSelect) {
      const updatedOptions = formData.options.map((opt, i) =>
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
      setFormData((prev) => ({ ...prev, options: updatedOptions }));
    } else {
      const updatedOptions = formData.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
      setFormData((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  // Add option
  const handleAddOption = () => {
    if (formData.options.length >= 6) return;
    const newOpt: QuestionOption = {
      id: `opt-${Date.now().toString(36).slice(-3)}`,
      text: "",
      isCorrect: false,
    };
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOpt],
    }));
  };

  // Remove option
  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const updated = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  // Validate and submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.questionText.trim()) {
      setErrorMsg("Question prompt stem cannot be empty.");
      return;
    }

    if (formData.options.some((o) => !o.text.trim())) {
      setErrorMsg("All options must contain non-empty text.");
      return;
    }

    const correctCount = formData.options.filter((o) => o.isCorrect).length;
    if (formData.isMultiSelect) {
      const required = formData.requiredSelectCount || 2;
      if (correctCount !== required) {
        setErrorMsg(
          `For Multi-Select requiring ${required} selections, exactly ${required} options must be marked correct (currently ${correctCount} marked).`
        );
        return;
      }
    } else {
      if (correctCount !== 1) {
        setErrorMsg("Single choice questions must have exactly 1 correct answer selected.");
        return;
      }
    }

    if (!formData.explanation.trim()) {
      setErrorMsg("Architectural blueprint explanation cannot be empty.");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8]">
              <Edit3 className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {formData.id.includes("custom")
                ? "Author New Question"
                : `Edit Question: ${formData.id.toUpperCase()}`}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Select the target examination track first to dynamically load its blueprint domains and release standards.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: EXAM SELECTION (FIRST) */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#0066FF]" />
                  Target Certification Track
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select which certification this question belongs to.
                </p>
              </div>

              {/* Exam dropdown */}
              <select
                value={formData.certificationId || "csa"}
                onChange={(e) => handleCertChange(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                {certs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metadata Row: ID, Domain, Release */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData((p) => ({ ...p, id: e.target.value }))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Blueprint Domain ({activeCert.code})
              </label>
              <select
                value={formData.domainSlug}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {activeCert.domains.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.weight}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Release Version
              </label>
              <input
                type="text"
                value={formData.releaseVersion}
                onChange={(e) => setFormData((p) => ({ ...p, releaseVersion: e.target.value }))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Tier & Type Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            {/* Free vs Pro Access */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Catalog Tier</span>
                <p className="text-[11px] text-slate-500">
                  {formData.isFree ? "Free Quota" : "Pro Vault (1-Year Pass)"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isFree: !p.isFree }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
                  formData.isFree
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                    : "bg-blue-50 dark:bg-blue-950/60 border-blue-300 text-[#0066FF] dark:text-[#38BDF8]"
                }`}
              >
                {formData.isFree ? "Free Quota" : "Pro Vault"}
              </button>
            </div>

            {/* Single vs Multi Select */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Question Format</span>
                <p className="text-[11px] text-slate-500">
                  {formData.isMultiSelect
                    ? `Multi-Select (${formData.requiredSelectCount || 2} Answers)`
                    : "Single Choice (1 Answer)"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {formData.isMultiSelect && (
                  <input
                    type="number"
                    min={2}
                    max={formData.options.length}
                    value={formData.requiredSelectCount || 2}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        requiredSelectCount: parseInt(e.target.value) || 2,
                      }))
                    }
                    className="w-12 text-xs p-1 rounded border border-slate-300 dark:border-slate-700 text-center bg-white dark:bg-slate-800"
                    title="Required selection count"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      isMultiSelect: !p.isMultiSelect,
                      requiredSelectCount: !p.isMultiSelect ? 2 : 1,
                    }))
                  }
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
                    formData.isMultiSelect
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {formData.isMultiSelect ? "Multi-Select" : "Single Choice"}
                </button>
              </div>
            </div>
          </div>

          {/* Question Stem Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Question Stem (Prompt)
            </label>
            <textarea
              required
              rows={3}
              value={formData.questionText}
              onChange={(e) => setFormData((p) => ({ ...p, questionText: e.target.value }))}
              placeholder="Enter the scenario or exam question prompt..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Options Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Options & Correct Answer Key (Click radio/checkbox to set correct)
              </label>
              {formData.options.length < 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOption}
                  className="h-7 text-xs text-[#0066FF] dark:text-[#38BDF8] gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Option
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {formData.options.map((opt, i) => (
                <div
                  key={opt.id || i}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    opt.isCorrect
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  {/* Correct Selector */}
                  <button
                    type="button"
                    onClick={() => handleToggleCorrectness(i)}
                    className={`h-5 w-5 shrink-0 flex items-center justify-center rounded cursor-pointer transition-colors ${
                      formData.isMultiSelect ? "rounded-sm" : "rounded-full"
                    } border ${
                      opt.isCorrect
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {opt.isCorrect && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <span className="font-mono text-xs font-bold text-slate-500 shrink-0">
                    {String.fromCharCode(65 + i)}.
                  </span>

                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)} text...`}
                    className="flex-1 text-xs p-1.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0066FF] bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  />

                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(i)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Architectural Explanation & Blueprint Rationale
            </label>
            <textarea
              required
              rows={3}
              value={formData.explanation}
              onChange={(e) => setFormData((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Cite ServiceNow documentation, why the correct answer is valid, and why distractors are incorrect..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Save className="h-3.5 w-3.5" /> Save to Active Catalog
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminQuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500">
          Loading Question Authoring CMS...
        </div>
      }
    >
      <QuestionCMSContent />
    </Suspense>
  );
}
