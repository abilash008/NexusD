export interface QuestionReportItem {
  id: string;
  questionId: string;
  certificationId: string;
  reporterEmail: string;
  issueType: "incorrect_answer" | "outdated_syllabus" | "typo_wording" | "explanation_unclear" | "other";
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

const REPORTS_STORAGE_KEY = "nexusd_question_reports";

// Initial sample reports to showcase the triage workflow immediately
const SEED_REPORTS: QuestionReportItem[] = [
  {
    id: "rep-001",
    questionId: "csa-02",
    certificationId: "csa",
    reporterEmail: "trainee.vikram@tcs.com",
    issueType: "explanation_unclear",
    description: "In CSA-02 regarding Filter Conditions, could you clarify whether Execution Plan is ever considered part of query criteria in Australia release?",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "rep-002",
    questionId: "csa-14",
    certificationId: "csa",
    reporterEmail: "sneha.k@wipro.com",
    issueType: "outdated_syllabus",
    description: "Please verify if the Next Experience unified navigation shortcut was changed in Brazil release.",
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "rep-003",
    questionId: "csa-33",
    certificationId: "csa",
    reporterEmail: "rohit.dev@cognizant.com",
    issueType: "typo_wording",
    description: "Typo in the stem: 'import set' is written as 'inport set' in option B.",
    status: "resolved",
    adminNotes: "Fixed typo in option text.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

export function getStoredReports(): QuestionReportItem[] {
  if (typeof window === "undefined") return SEED_REPORTS;
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading question reports:", err);
    return SEED_REPORTS;
  }
}

export function saveStoredReport(report: Omit<QuestionReportItem, "id" | "createdAt" | "status">): QuestionReportItem {
  const newReport: QuestionReportItem = {
    ...report,
    id: `rep-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const reports = getStoredReports();
      reports.unshift(newReport);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
      window.dispatchEvent(new CustomEvent("nexusd_reports_updated", { detail: newReport }));
    } catch (err) {
      console.error("Error saving report locally:", err);
    }
  }

  return newReport;
}

export function updateReportStatus(
  reportId: string,
  status: "pending" | "resolved" | "dismissed",
  adminNotes?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const reports = getStoredReports();
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          adminNotes: adminNotes || r.adminNotes,
          resolvedAt: status === "resolved" ? new Date().toISOString() : r.resolvedAt,
        };
      }
      return r;
    });

    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("nexusd_reports_updated"));
  } catch (err) {
    console.error("Error updating report status:", err);
  }
}
