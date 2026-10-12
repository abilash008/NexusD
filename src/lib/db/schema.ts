import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ==========================================
// 1. NextAuth / Auth.js v5 Standard Tables
// ==========================================

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  username: text("username"),
  email: text("email").unique(),
  password: text("password"), // Secure bcrypt hash
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("user").notNull(), // 'user' | 'admin' | 'mentor'
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

// ==========================================
// 2. User Profile & Onboarding Context
// (Decoupled from security permissions)
// ==========================================

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  // Segment: 'fresher' | 'career_switcher' | 'servicenow_trainee'
  backgroundSegment: text("background_segment"),
  // Structured target roles: e.g. ["System Administrator", "Application Developer"]
  targetRoles: jsonb("target_roles").$type<string[]>().default([]),
  // Specialized tracks: e.g. ["ITSM", "ITOM", "HRSD"]
  targetSpecializations: jsonb("target_specializations").$type<string[]>().default([]),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ==========================================
// 3. Certifications & Practice Question Bank
// (Foundation for Epic 2 & Epic 3)
// ==========================================

export const certifications = pgTable("certifications", {
  id: text("id").primaryKey(), // 'csa', 'cad', 'cis-itsm'
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  totalQuestions: integer("total_questions").default(60).notNull(),
  examDurationMinutes: integer("exam_duration_minutes").default(90).notNull(),
  passingScorePercentage: integer("passing_score_percentage").default(70).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const examDomains = pgTable("exam_domains", {
  id: text("id").primaryKey(), // e.g. 'csa-ui-nav'
  certificationId: text("certification_id")
    .notNull()
    .references(() => certifications.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  weightPercentage: integer("weight_percentage").notNull(), // e.g. 20 (for 20%)
  description: text("description"),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificationId: text("certification_id")
    .notNull()
    .references(() => certifications.id, { onDelete: "cascade" }),
  domainId: text("domain_id")
    .notNull()
    .references(() => examDomains.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").default("single_choice").notNull(), // 'single_choice' | 'multi_choice'
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").default("intermediate").notNull(), // 'beginner' | 'intermediate' | 'advanced'
  isFreePreview: boolean("is_free_preview").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const questionOptions = pgTable("question_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const userExamAttempts = pgTable("user_exam_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  certificationId: text("certification_id").notNull(),
  mode: text("mode").notNull(), // 'timed_mock' | 'practice'
  totalQuestions: integer("total_questions").notNull(),
  correctAnswersCount: integer("correct_answers_count").default(0).notNull(),
  scorePercentage: integer("score_percentage").default(0).notNull(),
  passed: boolean("passed").default(false).notNull(),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
  domainScores: jsonb("domain_scores").$type<Record<string, { total: number; correct: number }>>(),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userAnswers = pgTable("user_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => userExamAttempts.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  selectedOptionIds: jsonb("selected_option_ids").$type<string[]>().default([]).notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  isFlagged: boolean("is_flagged").default(false).notNull(),
});

// ==========================================
// 4. Payments & Entitlements (Epic 6)
// ==========================================

export const userEntitlements = pgTable("user_entitlements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  certificationId: text("certification_id").notNull(), // 'csa' | 'cad' | 'cis-df' | 'cis-itsm'
  accessType: text("access_type").notNull(), // 'csa_pass' | 'all_access'
  orderId: text("order_id"),
  expiresAt: timestamp("expires_at", { mode: "date" }), // timestamp for 1-year certification access expiration
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email").notNull(),
  userName: text("user_name"),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  planId: text("plan_id").notNull(), // 'csa_pass' | 'all_access'
  amountPaise: integer("amount_paise").notNull(), // e.g. 49900 = ₹499
  currency: text("currency").default("INR").notNull(),
  status: text("status").default("created").notNull(), // 'created' | 'captured' | 'failed'
  receiptNumber: text("receipt_number").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ==========================================
// 5. Admin CMS & Errata Reports (Epic 7)
// ==========================================

export const questionReports = pgTable("question_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: text("question_id").notNull(),
  certificationId: text("certification_id").default("csa").notNull(),
  reportedByUserId: text("reported_by_user_id").references(() => users.id, { onDelete: "set null" }),
  reporterEmail: text("reporter_email"),
  issueType: text("issue_type").notNull(), // 'incorrect_answer' | 'outdated_syllabus' | 'typo_wording' | 'explanation_unclear' | 'other'
  description: text("description").notNull(),
  status: text("status").default("pending").notNull(), // 'pending' | 'resolved' | 'dismissed'
  adminNotes: text("admin_notes"),
  resolvedAt: timestamp("resolved_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});


