import { NextRequest, NextResponse } from "next/server";
import { db, questions, questionOptions, examDomains, certifications } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cert = (searchParams.get("cert") || "csa").toLowerCase().trim();

    // Query questions from Neon PostgreSQL
    const dbQuestions = await db
      .select()
      .from(questions)
      .where(cert === "all" ? undefined : eq(questions.certificationId, cert));

    if (dbQuestions.length === 0) {
      return NextResponse.json({ questions: [], total: 0 });
    }

    const questionIds = dbQuestions.map((q) => q.id);

    // Query all options for these questions
    const dbOptions = await db
      .select()
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, questionIds));

    // Map options by questionId
    const optionsMap: Record<string, any[]> = {};
    for (const opt of dbOptions) {
      if (!optionsMap[opt.questionId]) {
        optionsMap[opt.questionId] = [];
      }
      optionsMap[opt.questionId].push({
        id: opt.id,
        text: opt.optionText,
        isCorrect: opt.isCorrect,
      });
    }

    // Format into standard PracticeQuestion shape
    const formatted = dbQuestions.map((q) => ({
      id: q.id,
      certificationId: q.certificationId,
      domain: q.domainId,
      domainSlug: q.domainId,
      questionText: q.questionText,
      isMultiSelect: q.questionType === "multi_choice",
      options: optionsMap[q.id] || [],
      explanation: q.explanation,
      releaseVersion: "Australia & Brazil 2026",
      isFree: q.isFreePreview,
    }));

    return NextResponse.json({ questions: formatted, total: formatted.length });
  } catch (error: any) {
    console.error("[API /api/questions GET error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions from database", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const items = Array.isArray(body) ? body : [body];

    if (items.length === 0) {
      return NextResponse.json({ error: "No question items provided" }, { status: 400 });
    }

    let insertedCount = 0;

    for (const item of items) {
      if (!item.questionText || !item.options || item.options.length === 0) {
        continue;
      }

      const qId = item.id || crypto.randomUUID();
      const certId = (item.certificationId || "csa").toLowerCase();
      const domainId = item.domainSlug || item.domain || "general";

      // Insert question record
      await db.insert(questions).values({
        id: qId,
        certificationId: certId,
        domainId,
        questionText: item.questionText,
        questionType: item.isMultiSelect ? "multi_choice" : "single_choice",
        explanation: item.explanation || "Official ServiceNow Product Documentation rationale.",
        difficulty: item.difficulty || "intermediate",
        isFreePreview: Boolean(item.isFree),
        isActive: true,
      });

      // Insert option records
      for (let i = 0; i < item.options.length; i++) {
        const opt = item.options[i];
        await db.insert(questionOptions).values({
          id: opt.id || crypto.randomUUID(),
          questionId: qId,
          optionText: opt.text,
          isCorrect: Boolean(opt.isCorrect),
          orderIndex: i,
        });
      }

      insertedCount++;
    }

    return NextResponse.json({
      success: true,
      insertedCount,
      message: `Successfully uploaded ${insertedCount} questions to Neon PostgreSQL.`,
    });
  } catch (error: any) {
    console.error("[API /api/questions POST error]:", error);
    return NextResponse.json(
      { error: "Failed to insert questions into database", details: error?.message },
      { status: 500 }
    );
  }
}
