import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, userExamAttempts, userAnswers } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      certificationId = "csa",
      mode = "timed_mock",
      totalQuestions = 60,
      correctAnswersCount = 0,
      scorePercentage = 0,
      passed = false,
      timeSpentSeconds = 0,
      domainScores = {},
      answers = [],
    } = body;

    // Determine user ID if authenticated
    const userId = session?.user?.id || null;

    // If DATABASE_URL is configured, persist attempt to Neon PostgreSQL
    if (process.env.DATABASE_URL) {
      try {
        const [attempt] = await db
          .insert(userExamAttempts)
          .values({
            userId,
            certificationId,
            mode,
            totalQuestions,
            correctAnswersCount,
            scorePercentage,
            passed,
            timeSpentSeconds,
            domainScores,
            completedAt: new Date(),
          })
          .returning();

        // Persist question-by-question telemetry if answers provided
        if (attempt?.id && Array.isArray(answers) && answers.length > 0) {
          const answerRows = answers.map((ans: any) => ({
            attemptId: attempt.id,
            questionId: String(ans.questionId),
            selectedOptionIds: Array.isArray(ans.selectedOptionIds)
              ? ans.selectedOptionIds
              : [ans.selectedOptionId].filter(Boolean),
            isCorrect: Boolean(ans.isCorrect),
            isFlagged: Boolean(ans.isFlagged),
          }));

          await db.insert(userAnswers).values(answerRows);
        }

        return NextResponse.json({
          success: true,
          attemptId: attempt.id,
          savedToDb: true,
          userId,
        });
      } catch (dbErr: any) {
        console.warn("[NexusD API] Database insert skipped or failed:", dbErr?.message);
        // Fallback gracefully without breaking user UX
        return NextResponse.json({
          success: true,
          attemptId: `local-${Date.now()}`,
          savedToDb: false,
          fallback: "client-local-storage",
          userId,
        });
      }
    }

    // Zero-config / offline fallback
    return NextResponse.json({
      success: true,
      attemptId: `local-${Date.now()}`,
      savedToDb: false,
      fallback: "client-local-storage",
      userId,
    });
  } catch (error: any) {
    console.error("[NexusD API] Error submitting exam attempt:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record exam attempt" },
      { status: 500 }
    );
  }
}
