"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Check,
  Loader2,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PracticeQuestion } from "@/data/csa-questions";
import {
  downloadSampleExcelTemplate,
  parseExcelOrCsvFile,
  ParsedBulkRow,
} from "@/lib/excel-import";
import { saveQuestionsBulk } from "@/lib/admin-questions";
import { CertificationTrack, getAllCertifications } from "@/lib/admin-certifications";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCertId?: string;
  onSuccess: (count: number) => void;
}

export function BulkUploadModal({
  isOpen,
  onClose,
  activeCertId = "csa",
  onSuccess,
}: BulkUploadModalProps) {
  const [selectedCert, setSelectedCert] = useState<string>(activeCertId);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    validQuestions: PracticeQuestion[];
    rows: ParsedBulkRow[];
    errors: string[];
  } | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const certs = getAllCertifications();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setIsParsing(true);
    setParsedData(null);

    try {
      const result = await parseExcelOrCsvFile(selected);
      setParsedData({
        validQuestions: result.validQuestions,
        rows: result.rows,
        errors: result.errors,
      });
    } catch (err) {
      console.error("Error parsing file:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommitImport = () => {
    if (!parsedData || parsedData.validQuestions.length === 0) return;

    setIsCommitting(true);
    try {
      saveQuestionsBulk(parsedData.validQuestions);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(parsedData.validQuestions.length);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Error committing import:", err);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl my-8 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bulk Upload Exam Questions (Excel / CSV)
              </h3>
              <p className="text-xs text-slate-500">
                Import dozens of exam questions simultaneously. The importer automatically validates answer keys, option formats, and syllabus domain tags.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Template Download Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#0066FF]" />
              Need the template structure?
            </span>
            <p className="text-[11px] text-slate-500">
              Download our pre-structured Excel template containing sample questions and official domain slugs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCert}
              onChange={(e) => setSelectedCert(e.target.value)}
              className="text-xs py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {certs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} Template
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadSampleExcelTemplate(selectedCert)}
              className="gap-1.5 text-xs font-semibold shrink-0 dark:border-slate-700"
            >
              <Download className="h-3.5 w-3.5 text-[#0066FF]" /> Download Template (.xlsx)
            </Button>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 my-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto animate-in zoom-in" />
            <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              Successfully Imported {parsedData?.validQuestions.length} Questions!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              The live question catalog and active student mock simulators have been updated.
            </p>
          </div>
        ) : (
          <>
            {/* Step 2: Upload Dropzone */}
            <div className="shrink-0">
              <label
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  file
                    ? "border-[#0066FF] bg-blue-50/20 dark:bg-blue-950/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                }`}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {file ? file.name : "Click to browse or drag & drop .xlsx / .csv spreadsheet"}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Supports Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
                </span>
              </label>
            </div>

            {/* Parsing Indicator */}
            {isParsing && (
              <div className="py-6 text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#0066FF] mx-auto" />
                <p className="text-xs text-slate-500">Validating and parsing questions...</p>
              </div>
            )}

            {/* Step 3: Parsed Data Preview & Validation Warnings */}
            {parsedData && (
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Import Preview
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                      {parsedData.validQuestions.length} Valid
                    </Badge>
                    {parsedData.errors.length > 0 && (
                      <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px]">
                        {parsedData.errors.length} Issues
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Error Box if any issues found */}
                {parsedData.errors.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 space-y-1 max-h-24 overflow-y-auto">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Noticeable row issues:
                    </div>
                    {parsedData.errors.map((err, i) => (
                      <div key={i} className="pl-4">
                        • {err}
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview Table Container */}
                <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Row</th>
                        <th className="py-2 px-3">Exam</th>
                        <th className="py-2 px-3">Domain</th>
                        <th className="py-2 px-3">Question Stem</th>
                        <th className="py-2 px-3">Format</th>
                        <th className="py-2 px-3">Key</th>
                        <th className="py-2 px-3">Tier</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {parsedData.rows.map((row) => (
                        <tr
                          key={row.rowNumber}
                          className={row.error ? "bg-red-50/40 dark:bg-red-950/20" : ""}
                        >
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                            #{row.rowNumber}
                          </td>
                          <td className="py-2 px-3">
                            <Badge variant="accent" className="text-[10px] uppercase font-mono">
                              {row.question?.certificationId || "CSA"}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 max-w-[130px] truncate text-[11px] text-slate-600 dark:text-slate-400">
                            {row.question?.domain || "General"}
                          </td>
                          <td className="py-2 px-3 max-w-[240px] truncate font-medium text-slate-900 dark:text-white">
                            {row.question?.questionText || row.raw["Question Text"] || "Empty"}
                          </td>
                          <td className="py-2 px-3 text-[11px]">
                            {row.question?.isMultiSelect ? "Multi" : "Single"}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {row.question?.options
                              .filter((o) => o.isCorrect)
                              .map((o) => o.text.substring(0, 15))
                              .join(", ") || "-"}
                          </td>
                          <td className="py-2 px-3">
                            <Badge
                              className={`text-[9px] ${
                                row.question?.isFree
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-blue-500/10 text-[#0066FF]"
                              }`}
                            >
                              {row.question?.isFree ? "Free" : "Pro"}
                            </Badge>
                          </td>
                          <td className="py-2 px-3">
                            {row.error ? (
                              <span className="text-[10px] text-red-600 font-semibold">Error</span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                                <Check className="h-3 w-3" /> Ready
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>

              <Button
                type="button"
                variant="accent"
                size="sm"
                disabled={
                  !parsedData || parsedData.validQuestions.length === 0 || isCommitting
                }
                onClick={handleCommitImport}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                {isCommitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Importing...
                  </>
                ) : (
                  <>
                    <FileCheck className="h-3.5 w-3.5" />
                    Commit Import ({parsedData?.validQuestions.length || 0} Questions)
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
