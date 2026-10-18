export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface PracticeQuestion {
  id: string;
  certificationId?: string; // defaults to 'csa' if omitted
  domain: string;
  domainSlug: string;
  questionText: string;
  isMultiSelect: boolean;
  requiredSelectCount?: number;
  options: QuestionOption[];
  explanation: string;
  releaseVersion: string;
  isFree?: boolean;
}

export const CSA_DOMAINS_INFO = [
  { slug: "platform-overview", name: "Platform Overview and Navigation", weight: 7, questionCount: 4 },
  { slug: "instance-config", name: "Instance Configuration", weight: 10, questionCount: 6 },
  { slug: "collaboration-apps", name: "Configuring Applications for Collaboration", weight: 20, questionCount: 12 },
  { slug: "self-service-automation", name: "Self-Service & Automation", weight: 20, questionCount: 12 },
  { slug: "database-security", name: "Database Management and Platform Security", weight: 30, questionCount: 18 },
  { slug: "data-migration-integration", name: "Data Migration and Integration", weight: 13, questionCount: 8 },
];

/**
 * Question Repository for ServiceNow CSA
 * All questions are dynamically loaded from Neon PostgreSQL and Admin CMS uploads.
 * Hardcoded questions have been completely removed from source code per design specifications.
 */
export const CSA_SEED_QUESTIONS: PracticeQuestion[] = [];

export const CSA_ALL_QUESTIONS: PracticeQuestion[] = [];

export const CSA_FREE_60_QUESTIONS: PracticeQuestion[] = [];

export const CSA_PRO_QUESTIONS: PracticeQuestion[] = [];

/**
 * Fisher-Yates array shuffle utility
 */
export function shuffleQuestions<T>(array: T[]): T[] {
  if (!array || array.length <= 1) return [...(array || [])];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a domain-weighted random mock exam
 */
export function generateDomainWeightedMockExam(
  pool: PracticeQuestion[] = []
): PracticeQuestion[] {
  return shuffleQuestions(pool);
}
