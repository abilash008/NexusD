"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  Flag,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveStoredReport } from "@/lib/reports";

interface ReportQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  domainName?: string;
  questionSnippet?: string;
}

const ISSUE_CATEGORIES = [
  { id: "incorrect_answer", label: "Incorrect Answer Key" },
  { id: "outdated_syllabus", label: "Outdated Release Syllabus" },
  { id: "typo_wording", label: "Typo or Confusing Phrasing" },
  { id: "explanation_unclear", label: "Explanation Needs Clarification" },
  { id: "other", label: "Other Feedback" },
] as const;

export function ReportQuestionDialog({
  isOpen,
  onClose,
  questionId,
  domainName,
  questionSnippet,
}: ReportQuestionDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "incorrect_answer" | "outdated_syllabus" | "typo_wording" | "explanation_unclear" | "other"
  >("incorrect_answer");
  const [description, setDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Post to server endpoint
      await fetch("/api/questions/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          issueType: selectedCategory,
          description: description.trim(),
          reporterEmail: userEmail || "student@nexusd.in",
        }),
      });

      // 2. Persist locally for immediate admin preview
      saveStoredReport({
        questionId,
        certificationId: "csa",
        reporterEmail: userEmail || "student@nexusd.in",
        issueType: selectedCategory,
        description: description.trim(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setDescription("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Report submit error:", err);
      // Fallback local save
      saveStoredReport({
        questionId,
        certificationId: "csa",
        reporterEmail: userEmail || "student@nexusd.in",
        issueType: selectedCategory,
        description: description.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setDescription("");
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flag className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Question Errata
            </h3>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {domainName && (
              <Badge variant="accent" className="text-[10px]">
                {domainName}
              </Badge>
            )}
            <span className="text-xs font-mono text-slate-400">ID: {questionId}</span>
          </div>
          {questionSnippet && (
            <p className="text-xs text-slate-500 italic line-clamp-2 pt-1">
              "{questionSnippet}"
            </p>
          )}
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400 animate-in zoom-in" />
            <div className="font-bold text-sm">Thank You for Improving NexusD!</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your errata report has been submitted to the platform content triage queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Issue Category Radio/Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                What issue did you encounter?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] font-semibold"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Describe the issue or correction suggestion:
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why the option or explanation seems incorrect, or provide documentation reference..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* User Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Your Email (optional, if you'd like follow-up confirmation):
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                size="sm"
                disabled={isSubmitting || !description.trim()}
                className="gap-1.5 text-xs font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
