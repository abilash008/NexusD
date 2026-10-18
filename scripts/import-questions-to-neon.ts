import { db, questions, questionOptions, certifications, examDomains } from "../src/lib/db";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

export interface InputQuestionOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface InputPracticeQuestion {
  id?: string;
  certificationId: string; // 'csa' | 'cad' | 'cis-df' | 'cis-itsm'
  domain: string;
  domainSlug?: string;
  questionText: string;
  isMultiSelect?: boolean;
  options: InputQuestionOption[];
  explanation: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isFree?: boolean;
  releaseVersion?: string;
}

/**
 * Imports and verifies questions into Neon PostgreSQL
 * Usage:
 *   npx tsx --env-file=.env.local scripts/import-questions-to-neon.ts [path/to/questions.json]
 */
async function main() {
  console.log("=================================================");
  console.log("NexusD — ServiceNow Question Importer to Neon DB");
  console.log("=================================================\n");

  const args = process.argv.slice(2);
  const inputFilePath = args[0] || path.join(__dirname, "questions-input.json");

  if (!fs.existsSync(inputFilePath)) {
    console.log(`Input file not found at: ${inputFilePath}`);
    console.log("Creating template 'scripts/questions-input.json' with sample schema...\n");

    const template: InputPracticeQuestion[] = [
      {
        certificationId: "csa",
        domain: "User Interface & Navigation",
        domainSlug: "ui-nav",
        questionText: "Sample question: Which component of Next Experience houses the Application Navigator?",
        isMultiSelect: false,
        options: [
          { text: "Contextual App Bar", isCorrect: false },
          { text: "All Menu Header", isCorrect: true },
          { text: "Filter Navigator Pane", isCorrect: false },
          { text: "Global Search Banner", isCorrect: false },
        ],
        explanation: "Verified against ServiceNow Australia/Brazil documentation: The All menu on Unified Navigation provides access to the Application Navigator.",
        difficulty: "beginner",
        isFree: true,
      },
    ];

    fs.writeFileSync(inputFilePath, JSON.stringify(template, null, 2), "utf-8");
    console.log(`Template created at: ${inputFilePath}`);
    console.log("To import real questions, populate this JSON file or provide the file path as an argument.");
    return;
  }

  const raw = fs.readFileSync(inputFilePath, "utf-8");
  let items: InputPracticeQuestion[] = [];

  try {
    items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      throw new Error("Input JSON must contain an array of questions.");
    }
  } catch (err: any) {
    console.error("Failed to parse JSON input:", err.message);
    process.exit(1);
  }

  console.log(`Found ${items.length} questions to import from ${inputFilePath}.\n`);

  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemNum = i + 1;

    // Validation
    if (!item.questionText?.trim()) {
      console.warn(`[Row ${itemNum}] Skipped: Missing questionText.`);
      skipCount++;
      continue;
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      console.warn(`[Row ${itemNum}] Skipped: Question must have at least 2 options.`);
      skipCount++;
      continue;
    }

    const correctCount = item.options.filter((o) => o.isCorrect).length;
    if (correctCount === 0) {
      console.warn(`[Row ${itemNum}] Skipped: Question must have at least 1 correct option.`);
      skipCount++;
      continue;
    }

    const certId = (item.certificationId || "csa").toLowerCase().trim();
    const domainSlug = (item.domainSlug || item.domain || "general")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const qId = item.id || crypto.randomUUID();

    try {
      // 1. Ensure certification exists
      const existingCert = await db
        .select()
        .from(certifications)
        .where(eq(certifications.id, certId))
        .limit(1);

      if (existingCert.length === 0) {
        await db.insert(certifications).values({
          id: certId,
          code: certId.toUpperCase(),
          name: `ServiceNow ${certId.toUpperCase()} Certification`,
          description: "Authoritative exam track",
          totalQuestions: 60,
          examDurationMinutes: 90,
          passingScorePercentage: 70,
          isActive: true,
        });
      }

      // 2. Ensure examDomain exists
      const domainKey = `${certId}-${domainSlug}`;
      const existingDomain = await db
        .select()
        .from(examDomains)
        .where(eq(examDomains.id, domainKey))
        .limit(1);

      if (existingDomain.length === 0) {
        await db.insert(examDomains).values({
          id: domainKey,
          certificationId: certId,
          slug: domainSlug,
          title: item.domain || "General Domain",
          weightPercentage: 20,
        });
      }

      // 3. Insert question
      await db.insert(questions).values({
        id: qId,
        certificationId: certId,
        domainId: domainKey,
        questionText: item.questionText.trim(),
        questionType: item.isMultiSelect || correctCount > 1 ? "multi_choice" : "single_choice",
        explanation: item.explanation || "Official ServiceNow Documentation rationale.",
        difficulty: item.difficulty || "intermediate",
        isFreePreview: Boolean(item.isFree),
        isActive: true,
      });

      // 4. Insert options
      for (let optIdx = 0; optIdx < item.options.length; optIdx++) {
        const opt = item.options[optIdx];
        await db.insert(questionOptions).values({
          id: opt.id || crypto.randomUUID(),
          questionId: qId,
          optionText: opt.text.trim(),
          isCorrect: Boolean(opt.isCorrect),
          orderIndex: optIdx,
        });
      }

      successCount++;
      process.stdout.write(`\rImported ${successCount}/${items.length} questions...`);
    } catch (err: any) {
      console.error(`\n[Row ${itemNum}] Error inserting question:`, err.message);
      skipCount++;
    }
  }

  console.log("\n\n=================================================");
  console.log(`Import Complete!`);
  console.log(`Successfully inserted: ${successCount} questions`);
  console.log(`Skipped / Failed:     ${skipCount} questions`);
  console.log("=================================================\n");
}

main().catch((err) => {
  console.error("Unhandled script failure:", err);
  process.exit(1);
});
