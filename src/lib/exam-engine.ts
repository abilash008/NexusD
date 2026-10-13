import {
  CertificationTrack,
  getCertificationById,
  DEFAULT_CERTIFICATION_TRACKS,
} from "./admin-certifications";
import { getAllQuestions } from "./admin-questions";
import {
  PracticeQuestion,
  shuffleQuestions,
  CSA_FREE_60_QUESTIONS,
} from "@/data/csa-questions";

export interface ExamStorageKeys {
  pausedKey: string;
  timerKey: string;
  answersKey: string;
  flagsKey: string;
  qidsKey: string;
  historyKey: string;
}

export interface PausedExamSession {
  userId: string;
  timeRemainingSeconds: number;
  currentIndex: number;
  selectedAnswers: Record<string, string[]>;
  flaggedQuestions: Record<string, boolean>;
  questionIds: string[];
  pausedAt: string;
}

/**
 * Robust Fisher-Yates array shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles questions order AND shuffles the options array order within each question
 * (preserves option IDs, correctness, and question text intact)
 */
export function shuffleQuestionsAndOptions(questions: PracticeQuestion[]): PracticeQuestion[] {
  const shuffledQuestions = shuffleArray(questions);
  return shuffledQuestions.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

/**
 * Returns dynamic, track-specific configuration (timing, passing benchmark, total questions, domains)
 */
export function getExamConfig(trackId: string): CertificationTrack {
  const normalizedId = (trackId || "csa").toLowerCase();
  const track = getCertificationById(normalizedId);
  if (track) return track;

  // Fallback if not found in registry
  const defaultFound = DEFAULT_CERTIFICATION_TRACKS.find(
    (t) => t.id.toLowerCase() === normalizedId
  );
  if (defaultFound) return defaultFound;

  return {
    id: normalizedId,
    code: normalizedId.toUpperCase(),
    title: `ServiceNow ${normalizedId.toUpperCase()} Certification`,
    shortDescription: "Official blueprint-aligned examination simulation.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates dynamic, track-scoped storage keys for any examination
 */
export function getExamStorageKeys(trackId: string, userId?: string): ExamStorageKeys {
  const normalizedId = (trackId || "csa").toLowerCase();
  return {
    pausedKey: `nexusd_${normalizedId}_paused_${userId || "auth"}`,
    timerKey: `nexusd_${normalizedId}_mock_timer`,
    answersKey: `nexusd_${normalizedId}_mock_answers`,
    flagsKey: `nexusd_${normalizedId}_mock_flags`,
    qidsKey: `nexusd_${normalizedId}_mock_active_qids`,
    historyKey: `nexusd_${normalizedId}_mock_history`,
  };
}

/**
 * Purges all transient and cached mock exam storage for a specific track
 */
export function purgeGuestExamStorage(trackId: string, userId?: string): void {
  if (typeof window === "undefined") return;

  try {
    const keys = getExamStorageKeys(trackId, userId);
    localStorage.removeItem(keys.pausedKey);
    localStorage.removeItem(keys.timerKey);
    localStorage.removeItem(keys.answersKey);
    localStorage.removeItem(keys.flagsKey);
    localStorage.removeItem(keys.qidsKey);
    localStorage.removeItem(keys.historyKey);

    // Also purge unauthenticated general session if any
    localStorage.removeItem(`nexusd_${trackId.toLowerCase()}_paused_auth`);
  } catch (e) {
    console.warn(`[purgeGuestExamStorage] Error clearing storage for ${trackId}:`, e);
  }
}

/**
 * Retrieves all active questions for a given certification track
 */
export function getExamQuestions(trackId: string): PracticeQuestion[] {
  const normalizedId = (trackId || "csa").toLowerCase();
  return getAllQuestions(normalizedId);
}

/**
 * Retrieves the consistent free 60 set of questions for any track.
 * This exact set of 60 questions remains the benchmark for practice tests every time.
 */
export function getFreeTrackQuestions(trackId: string): PracticeQuestion[] {
  const normalizedId = (trackId || "csa").toLowerCase();
  if (normalizedId === "csa") {
    return [...CSA_FREE_60_QUESTIONS];
  }

  const all = getExamQuestions(normalizedId);
  const freeItems = all.filter((q) => q.isFree !== false);
  if (freeItems.length >= 60) {
    return freeItems.slice(0, 60);
  }
  return all.slice(0, 60);
}

/**
 * Generates a practice drill from the consistent free 60 questions set.
 * The questions (and their options) are shuffled fresh on every attempt.
 */
export function generateTrackPracticeDrill(
  trackId: string,
  domainSlug?: string
): PracticeQuestion[] {
  const free60 = getFreeTrackQuestions(trackId);
  let subset = free60;

  if (domainSlug && domainSlug !== "all") {
    const normalizedSlug = domainSlug.toLowerCase();
    subset = free60.filter(
      (q) =>
        q.domainSlug?.toLowerCase() === normalizedSlug ||
        q.domain?.toLowerCase() === normalizedSlug
    );
  }

  return shuffleQuestionsAndOptions(subset);
}

/**
 * Generates a randomized mock examination question set using Stratified Domain-Weighted Sampling.
 * Strictly guarantees that questions are pulled to match each domain's official blueprint percentage!
 * e.g., for CSA:
 * - Domain 1 (UI & Nav - 20%): exactly 12 questions
 * - Domain 2 (Collaboration - 20%): exactly 12 questions
 * - Domain 3 (DB Admin - 30%): exactly 18 questions
 * - Domain 4 (Self-Service - 20%): exactly 12 questions
 * - Domain 5 (Development - 10%): exactly 6 questions
 * Total: 60 questions
 *
 * If the available pool per domain exceeds the target quota, it randomly samples from that domain.
 * If questions are less, it falls back gracefully to fill remaining slots from the general pool.
 * Every attempt is freshly dual-shuffled (question sequence and options array).
 */
export function generateTrackMockExam(
  trackId: string,
  targetCount?: number,
  options?: { isProUser?: boolean }
): PracticeQuestion[] {
  const config = getExamConfig(trackId);
  const neededCount = targetCount || config.totalQuestions || 60;
  const allPool = getExamQuestions(trackId);

  // If candidate is Pro, draw from the complete vault (including questions 61+); if free, draw from free 60
  const sourcePool = options?.isProUser
    ? allPool
    : getFreeTrackQuestions(trackId);

  if (sourcePool.length === 0) {
    return [];
  }

  // If no domains specified, do standard randomized shuffle
  if (!config.domains || config.domains.length === 0) {
    const randomized = shuffleQuestionsAndOptions(sourcePool);
    return randomized.slice(0, neededCount);
  }

  // Stratified Domain-Weighted Sampling
  const selectedQuestions: PracticeQuestion[] = [];
  const usedIds = new Set<string>();

  // 1. Group available questions by domain slug/name
  const domainGroups: Record<string, PracticeQuestion[]> = {};
  config.domains.forEach((d) => {
    domainGroups[d.slug] = [];
  });

  sourcePool.forEach((q) => {
    const matchedDomain = config.domains.find(
      (d) =>
        d.slug.toLowerCase() === q.domainSlug?.toLowerCase() ||
        d.name.toLowerCase() === q.domain?.toLowerCase()
    );
    if (matchedDomain && domainGroups[matchedDomain.slug]) {
      domainGroups[matchedDomain.slug].push(q);
    }
  });

  // 2. Sample exact quotas per domain based on weight percentage
  config.domains.forEach((d) => {
    const quota = Math.round(((d.weight || 20) / 100) * neededCount);
    const available = shuffleArray(domainGroups[d.slug] || []);
    const picked = available.slice(0, quota);
    picked.forEach((q) => {
      selectedQuestions.push(q);
      usedIds.add(q.id);
    });
  });

  // 3. If rounding caused off-by-one or domain had fewer questions, backfill from remaining unused
  if (selectedQuestions.length < neededCount) {
    const remainingUnused = shuffleArray(sourcePool.filter((q) => !usedIds.has(q.id)));
    for (const q of remainingUnused) {
      if (selectedQuestions.length >= neededCount) break;
      selectedQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  // 4. Final randomized shuffle of question order and option positions
  return shuffleQuestionsAndOptions(selectedQuestions.slice(0, neededCount));
}

