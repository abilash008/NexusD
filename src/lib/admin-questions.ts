import {
  PracticeQuestion,
  CSA_ALL_QUESTIONS,
  QuestionOption,
} from "@/data/csa-questions";
import {
  CAD_SEED_QUESTIONS,
  CIS_DF_SEED_QUESTIONS,
  CIS_ITSM_SEED_QUESTIONS,
} from "@/data/multi-track-questions";

const CUSTOM_QUESTIONS_STORAGE_KEY = "nexusd_custom_questions";

/**
 * Retrieves active questions (combining base seed bank across all tracks with custom/edited questions)
 * Optionally filtered by certification track ID (e.g. "csa", "cad", "cis-df", etc.)
 */
export function getAllQuestions(certificationId?: string): PracticeQuestion[] {
  const basePool: PracticeQuestion[] = [
    ...CSA_ALL_QUESTIONS.map((q) => ({
      ...q,
      certificationId: q.certificationId || "csa",
    })),
    ...CAD_SEED_QUESTIONS,
    ...CIS_DF_SEED_QUESTIONS,
    ...CIS_ITSM_SEED_QUESTIONS,
  ];

  let list: PracticeQuestion[] = [...basePool];

  if (typeof window !== "undefined") {
    try {
      const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
      if (customRaw) {
        const customOverrides: Record<string, PracticeQuestion> = JSON.parse(customRaw);

        const overriddenIds = new Set<string>();
        list = list.map((base) => {
          if (customOverrides[base.id]) {
            overriddenIds.add(base.id);
            return {
              ...customOverrides[base.id],
              certificationId: customOverrides[base.id].certificationId || "csa",
            };
          }
          return base;
        });

        Object.values(customOverrides).forEach((custom) => {
          if (!overriddenIds.has(custom.id)) {
            list.push({
              ...custom,
              certificationId: custom.certificationId || "csa",
            });
          }
        });
      }
    } catch (err) {
      console.error("Error loading custom questions:", err);
    }
  }

  if (certificationId && certificationId !== "all") {
    return list.filter(
      (q) => (q.certificationId || "csa").toLowerCase() === certificationId.toLowerCase()
    );
  }

  return list;
}

/**
 * Saves or updates a question in the custom repository
 */
export function saveQuestion(question: PracticeQuestion): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    const customMap: Record<string, PracticeQuestion> = customRaw ? JSON.parse(customRaw) : {};

    const normalized: PracticeQuestion = {
      ...question,
      certificationId: question.certificationId || "csa",
    };

    customMap[question.id] = normalized;
    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(customMap));

    // Dispatch notification event for live re-renders
    window.dispatchEvent(new CustomEvent("nexusd_questions_updated", { detail: normalized }));
  } catch (err) {
    console.error("Error saving question:", err);
  }
}

/**
 * Saves multiple questions in bulk (used by Excel / CSV bulk upload)
 */
export function saveQuestionsBulk(newQuestions: PracticeQuestion[]): void {
  if (typeof window === "undefined" || newQuestions.length === 0) return;

  try {
    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    const customMap: Record<string, PracticeQuestion> = customRaw ? JSON.parse(customRaw) : {};

    newQuestions.forEach((q) => {
      customMap[q.id] = {
        ...q,
        certificationId: q.certificationId || "csa",
      };
    });

    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(customMap));
    window.dispatchEvent(new CustomEvent("nexusd_questions_updated", { detail: { bulkCount: newQuestions.length } }));
  } catch (err) {
    console.error("Error saving questions in bulk:", err);
  }
}

/**
 * Removes or resets an edited question back to default
 */
export function resetQuestion(questionId: string): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (!customRaw) return;

    const customMap: Record<string, PracticeQuestion> = JSON.parse(customRaw);
    delete customMap[questionId];

    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(customMap));
    window.dispatchEvent(new CustomEvent("nexusd_questions_updated", { detail: { id: questionId } }));
  } catch (err) {
    console.error("Error resetting question:", err);
  }
}

/**
 * Deletes a custom-authored question completely
 */
export function deleteQuestion(questionId: string): void {
  resetQuestion(questionId);
}
