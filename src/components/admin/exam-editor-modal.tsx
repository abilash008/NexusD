"use client";

import React, { useState } from "react";
import {
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CertificationTrack,
  ExamDomain,
  saveCertification,
} from "@/lib/admin-certifications";

interface ExamEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  examToEdit?: CertificationTrack | null;
  onSaveSuccess: (savedExam: CertificationTrack) => void;
}

export function ExamEditorModal({
  isOpen,
  onClose,
  examToEdit,
  onSaveSuccess,
}: ExamEditorModalProps) {
  const isEditing = Boolean(examToEdit);

  const [formData, setFormData] = useState<CertificationTrack>(() => {
    if (examToEdit) return JSON.parse(JSON.stringify(examToEdit));
    return {
      id: "",
      code: "",
      title: "",
      shortDescription: "",
      releaseVersion: "Australia & Brazil 2026",
      durationMinutes: 90,
      passingPercentage: 70,
      totalQuestions: 60,
      status: "active",
      priceINR: 499,
      domains: [
        { slug: "domain-1", name: "Core Architecture & Configuration", weight: 40 },
        { slug: "domain-2", name: "Process Automation & Integration", weight: 35 },
        { slug: "domain-3", name: "Troubleshooting & Security Governance", weight: 25 },
      ],
      createdAt: new Date().toISOString(),
    };
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-slugify code
  const handleCodeChange = (val: string) => {
    const cleanCode = val.trim().toUpperCase();
    const cleanId = cleanCode.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    setFormData((p) => ({
      ...p,
      code: cleanCode,
      id: isEditing ? p.id : cleanId,
    }));
  };

  // Add Domain
  const handleAddDomain = () => {
    const newIdx = formData.domains.length + 1;
    const newDomain: ExamDomain = {
      slug: `domain-${newIdx}`,
      name: `New Examination Domain ${newIdx}`,
      weight: 10,
    };
    setFormData((p) => ({
      ...p,
      domains: [...p.domains, newDomain],
    }));
  };

  // Remove Domain
  const handleRemoveDomain = (index: number) => {
    if (formData.domains.length <= 1) return;
    const updated = formData.domains.filter((_, i) => i !== index);
    setFormData((p) => ({ ...p, domains: updated }));
  };

  // Update Domain Field
  const handleDomainChange = (
    index: number,
    field: "name" | "slug" | "weight",
    value: any
  ) => {
    const updated = [...formData.domains];
    if (field === "name") {
      const slugVal = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      updated[index] = { ...updated[index], name: value, slug: slugVal || updated[index].slug };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormData((p) => ({ ...p, domains: updated }));
  };

  // Total weight
  const totalWeight = formData.domains.reduce((acc, d) => acc + (Number(d.weight) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.code.trim()) {
      setErrorMsg("Exam code (e.g. CAD, CIS-ITSM) is required.");
      return;
    }
    if (!formData.id.trim()) {
      setErrorMsg("Unique Exam Identifier ID is required.");
      return;
    }
    if (!formData.title.trim()) {
      setErrorMsg("Full certification title is required.");
      return;
    }
    if (formData.domains.length === 0) {
      setErrorMsg("At least one blueprint domain must be configured.");
      return;
    }
    if (formData.domains.some((d) => !d.name.trim() || !d.slug.trim())) {
      setErrorMsg("All blueprint domains must have non-empty titles and slugs.");
      return;
    }

    saveCertification(formData);
    onSaveSuccess(formData);
    onClose();
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

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? `Edit Certification Track: ${formData.code}` : "Create New Certification Exam Track"}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Define a new ServiceNow certification pathway with custom blueprint domains, timed simulator benchmarks, and pricing.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Code, ID, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Exam Code (Short)
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="e.g. CAD, CIS-DF"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Track Slug / ID
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                value={formData.id}
                onChange={(e) => setFormData((p) => ({ ...p, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-") }))}
                placeholder="e.g. cad, cis-df"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Catalog Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="active">Active (Available)</option>
                <option value="draft">Draft (Admin Only)</option>
                <option value="upcoming">Upcoming (Roadmap)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Certification Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. ServiceNow Certified Application Developer (CAD)"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          {/* Row 3: Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Short Description & Scope
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="Brief summary of skills assessed..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Row 4: Exam Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={15}
                max={240}
                value={formData.durationMinutes}
                onChange={(e) => setFormData((p) => ({ ...p, durationMinutes: Number(e.target.value) || 90 }))}
                className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Pass Score (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={formData.passingPercentage}
                onChange={(e) => setFormData((p) => ({ ...p, passingPercentage: Number(e.target.value) || 70 }))}
                className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Total Exam Qs
              </label>
              <input
                type="number"
                min={10}
                max={150}
                value={formData.totalQuestions}
                onChange={(e) => setFormData((p) => ({ ...p, totalQuestions: Number(e.target.value) || 60 }))}
                className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                1-Year Pass (₹)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={formData.priceINR}
                onChange={(e) => setFormData((p) => ({ ...p, priceINR: Number(e.target.value) || 499 }))}
                className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-[#0066FF]"
              />
            </div>
          </div>

          {/* Row 5: Blueprint Domains Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Blueprint Domains & Weightings
                </label>
                <p className="text-[11px] text-slate-500">
                  Cumulative weight: <strong className={totalWeight === 100 ? "text-emerald-600" : "text-amber-600"}>{totalWeight}%</strong>
                  {totalWeight !== 100 && " (Recommended to sum to 100%)"}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddDomain}
                className="h-7 text-xs text-[#0066FF] dark:text-[#38BDF8] gap-1"
              >
                <Plus className="h-3 w-3" /> Add Domain
              </Button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {formData.domains.map((dom, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-2 text-xs"
                >
                  <span className="font-mono text-slate-400 font-bold shrink-0">#{i + 1}</span>

                  <input
                    type="text"
                    required
                    placeholder="Domain Title (e.g. Database Administration)"
                    value={dom.name}
                    onChange={(e) => handleDomainChange(i, "name", e.target.value)}
                    className="flex-1 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Slug (e.g. db-admin)"
                    value={dom.slug}
                    onChange={(e) => handleDomainChange(i, "slug", e.target.value)}
                    className="w-28 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={dom.weight}
                      onChange={(e) => handleDomainChange(i, "weight", Number(e.target.value) || 0)}
                      className="w-14 p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>

                  {formData.domains.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDomain(i)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              <Save className="h-3.5 w-3.5" /> {isEditing ? "Save Exam Changes" : "Create Exam Track"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
