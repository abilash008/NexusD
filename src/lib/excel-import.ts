import * as XLSX from "xlsx";
import { PracticeQuestion, QuestionOption } from "@/data/csa-questions";
import { getAllCertifications } from "@/lib/admin-certifications";

export interface ParsedBulkRow {
  rowNumber: number;
  question?: PracticeQuestion;
  error?: string;
  raw: any;
}

/**
 * Generates and triggers download of a standardized Excel template for question authoring
 */
export function downloadSampleExcelTemplate(defaultCertId: string = "csa"): void {
  if (typeof window === "undefined") return;

  const certs = getAllCertifications();
  const currentCert = certs.find((c) => c.id.toLowerCase() === defaultCertId.toLowerCase()) || certs[0];

  // 1. Sample Data Rows
  const sampleRows = [
    {
      Certification: currentCert.id,
      "Domain Slug": currentCert.domains[0]?.slug || "ui-nav",
      "Domain Name": currentCert.domains[0]?.name || "User Interface & Navigation",
      "Question Text": "Which Next Experience component provides unified access to the Application Navigator and Favorites?",
      "Question Format": "single",
      "Option A": "Contextual App Bar",
      "Option B": "All Menu Header",
      "Option C": "Filter Navigator Pane",
      "Option D": "User Preference Widget",
      "Option E": "",
      "Correct Answer": "B",
      "Architectural Explanation": "In the Next Experience Unified Navigation, the top header houses the 'All' menu providing access to the Application Navigator.",
      "Release Version": currentCert.releaseVersion || "Australia & Brazil 2026",
      "Access Tier": "pro",
    },
    {
      Certification: currentCert.id,
      "Domain Slug": currentCert.domains[1]?.slug || "collaboration",
      "Domain Name": currentCert.domains[1]?.name || "Collaboration & Task Management",
      "Question Text": "Which two features enable automatic assignment of incident records to the appropriate tier-2 group? (Choose two)",
      "Question Format": "multi",
      "Option A": "Assignment Rules",
      "Option B": "Client Scripts",
      "Option C": "Flow Designer / Workflow",
      "Option D": "UI Policies",
      "Option E": "",
      "Correct Answer": "A,C",
      "Architectural Explanation": "Assignment Rules and Flow Designer automated triggers handle server-side record assignments. Client scripts and UI policies execute client-side in browser.",
      "Release Version": currentCert.releaseVersion || "Australia & Brazil 2026",
      "Access Tier": "free",
    },
  ];

  // 2. Reference Guide Rows (Domain mapping)
  const guideRows = certs.flatMap((c) =>
    c.domains.map((d) => ({
      "Certification Code": c.id,
      "Certification Title": c.title,
      "Domain Slug (Use in Column B)": d.slug,
      "Domain Name": d.name,
      "Blueprint Weight %": `${d.weight}%`,
    }))
  );

  // 3. Build Workbook
  const wb = XLSX.utils.book_new();

  const wsTemplate = XLSX.utils.json_to_sheet(sampleRows);
  const wsGuide = XLSX.utils.json_to_sheet(guideRows);

  // Set column widths for readability
  wsTemplate["!cols"] = [
    { wch: 14 }, // Certification
    { wch: 16 }, // Domain Slug
    { wch: 30 }, // Domain Name
    { wch: 45 }, // Question Text
    { wch: 15 }, // Format
    { wch: 25 }, // Opt A
    { wch: 25 }, // Opt B
    { wch: 25 }, // Opt C
    { wch: 25 }, // Opt D
    { wch: 20 }, // Opt E
    { wch: 14 }, // Correct Answer
    { wch: 50 }, // Explanation
    { wch: 22 }, // Release Version
    { wch: 12 }, // Access Tier
  ];

  XLSX.utils.book_append_sheet(wb, wsTemplate, "Questions Template");
  XLSX.utils.book_append_sheet(wb, wsGuide, "Valid Certification Domains");

  // 4. Download file
  XLSX.writeFile(wb, `NexusD_Bulk_Questions_Template_${defaultCertId.toUpperCase()}.xlsx`);
}

/**
 * Parses an uploaded .xlsx or .csv file and validates rows into PracticeQuestion objects
 */
export async function parseExcelOrCsvFile(
  file: File
): Promise<{ success: boolean; validQuestions: PracticeQuestion[]; rows: ParsedBulkRow[]; errors: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        if (!worksheet) {
          resolve({
            success: false,
            validQuestions: [],
            rows: [],
            errors: ["The uploaded spreadsheet does not contain any readable sheets."],
          });
          return;
        }

        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (rawRows.length === 0) {
          resolve({
            success: false,
            validQuestions: [],
            rows: [],
            errors: ["The spreadsheet contains no data rows."],
          });
          return;
        }

        const parsedRows: ParsedBulkRow[] = [];
        const validQuestions: PracticeQuestion[] = [];
        const errors: string[] = [];

        rawRows.forEach((row, idx) => {
          const rowNum = idx + 2; // account for header line

          // Extract fields with multiple possible column names for tolerance
          const certId = (row["Certification"] || row["Certification Code"] || row["Exam"] || "csa")
            .toString()
            .trim()
            .toLowerCase();

          const domainSlug = (row["Domain Slug"] || row["DomainSlug"] || "general")
            .toString()
            .trim();

          const domainName = (row["Domain Name"] || row["Domain"] || domainSlug)
            .toString()
            .trim();

          const questionText = (row["Question Text"] || row["Question"] || row["Prompt"] || "")
            .toString()
            .trim();

          const formatStr = (row["Question Format"] || row["Format"] || row["Type"] || "single")
            .toString()
            .trim()
            .toLowerCase();

          const isMulti = formatStr.includes("multi") || formatStr.includes("multiple");

          const optA = (row["Option A"] || row["A"] || "").toString().trim();
          const optB = (row["Option B"] || row["B"] || "").toString().trim();
          const optC = (row["Option C"] || row["C"] || "").toString().trim();
          const optD = (row["Option D"] || row["D"] || "").toString().trim();
          const optE = (row["Option E"] || row["E"] || "").toString().trim();

          const correctKey = (row["Correct Answer"] || row["Answer"] || row["Key"] || "")
            .toString()
            .trim()
            .toUpperCase();

          const explanation = (row["Architectural Explanation"] || row["Explanation"] || row["Rationale"] || "")
            .toString()
            .trim();

          const release = (row["Release Version"] || row["Release"] || "Australia & Brazil 2026")
            .toString()
            .trim();

          const tier = (row["Access Tier"] || row["Tier"] || "pro")
            .toString()
            .trim()
            .toLowerCase();

          const isFree = tier === "free";

          // Validation
          if (!questionText) {
            parsedRows.push({ rowNumber: rowNum, error: `Row ${rowNum}: Question text is missing.`, raw: row });
            errors.push(`Row ${rowNum}: Missing question stem.`);
            return;
          }

          if (!optA || !optB) {
            parsedRows.push({ rowNumber: rowNum, error: `Row ${rowNum}: Must have at least Option A and Option B.`, raw: row });
            errors.push(`Row ${rowNum}: Incomplete options (Option A and B are mandatory).`);
            return;
          }

          if (!correctKey) {
            parsedRows.push({ rowNumber: rowNum, error: `Row ${rowNum}: Correct Answer key is missing.`, raw: row });
            errors.push(`Row ${rowNum}: Missing correct answer key.`);
            return;
          }

          // Build Options list
          const rawOptions: { letter: string; text: string }[] = [
            { letter: "A", text: optA },
            { letter: "B", text: optB },
          ];
          if (optC) rawOptions.push({ letter: "C", text: optC });
          if (optD) rawOptions.push({ letter: "D", text: optD });
          if (optE) rawOptions.push({ letter: "E", text: optE });

          // Parse correct answer letters (e.g. "B" or "A,C" or "A, C" or "A and C")
          const correctLetters = new Set(
            correctKey
              .split(/[\s,;&/]+/)
              .map((s: string) => s.trim().toUpperCase())
              .filter(Boolean)
          );

          const options: QuestionOption[] = rawOptions.map((opt, oIdx) => ({
            id: `opt-${oIdx + 1}`,
            text: opt.text,
            isCorrect: correctLetters.has(opt.letter),
          }));

          const correctCount = options.filter((o) => o.isCorrect).length;
          if (correctCount === 0) {
            parsedRows.push({
              rowNumber: rowNum,
              error: `Row ${rowNum}: Correct answer key '${correctKey}' does not match any provided options.`,
              raw: row,
            });
            errors.push(`Row ${rowNum}: Correct answer key '${correctKey}' does not match any valid options.`);
            return;
          }

          // Build Question Object
          const uniqueId = `${certId}-bulk-${Date.now().toString(36).slice(-4)}-${idx + 1}`;
          const finalQuestion: PracticeQuestion = {
            id: uniqueId,
            certificationId: certId,
            domain: domainName,
            domainSlug: domainSlug || "general",
            questionText,
            isMultiSelect: isMulti || correctCount > 1,
            requiredSelectCount: isMulti || correctCount > 1 ? correctCount : 1,
            options,
            explanation: explanation || "Verified against official ServiceNow blueprint specifications.",
            releaseVersion: release,
            isFree,
          };

          parsedRows.push({ rowNumber: rowNum, question: finalQuestion, raw: row });
          validQuestions.push(finalQuestion);
        });

        resolve({
          success: validQuestions.length > 0,
          validQuestions,
          rows: parsedRows,
          errors,
        });
      } catch (err: any) {
        console.error("Excel parse error:", err);
        resolve({
          success: false,
          validQuestions: [],
          rows: [],
          errors: [`Failed to parse file: ${err?.message || "Invalid spreadsheet format."}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        validQuestions: [],
        rows: [],
        errors: ["Failed to read file from disk."],
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
