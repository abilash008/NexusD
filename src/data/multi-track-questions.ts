import { PracticeQuestion } from "./csa-questions";

/**
 * Multi-Track Question Repositories
 * (CAD, CIS-DF, CIS-ITSM)
 * All questions are dynamically loaded from Neon PostgreSQL and Admin CMS uploads.
 * Hardcoded questions have been completely removed from source code per design specifications.
 */

// CAD — Certified Application Developer Seed Questions
export const CAD_SEED_QUESTIONS: PracticeQuestion[] = [];

// CIS-DF — Certified Implementation Specialist - Data Foundations (CMDB and CSDM - KB0012913)
export const CIS_DF_SEED_QUESTIONS: PracticeQuestion[] = [];

// CIS-ITSM — Certified Implementation Specialist - IT Service Management (KB0011560)
export const CIS_ITSM_SEED_QUESTIONS: PracticeQuestion[] = [];
