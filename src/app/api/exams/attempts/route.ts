import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, userExamAttempts, users } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const certificationId = searchParams.get("certificationId") || "csa";

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        attempts: [],
      });
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const [u] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, session.user.email.toLowerCase()))
        .limit(1);
      if (u) userId = u.id;
    }

    if (!userId) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        attempts: [],
      });
    }

    const attempts = await db
      .select()
      .from(userExamAttempts)
      .where(
        and(
          eq(userExamAttempts.userId, userId),
          eq(userExamAttempts.certificationId, certificationId)
        )
      )
      .orderBy(desc(userExamAttempts.completedAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      authenticated: true,
      certificationId,
      attempts: attempts.map((a) => ({
        id: a.id,
        date: a.completedAt
          ? new Date(a.completedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        scorePercentage: a.scorePercentage,
        passed: a.passed,
        timeSpentSeconds: a.timeSpentSeconds,
        correctAnswersCount: a.correctAnswersCount,
        totalQuestions: a.totalQuestions,
        mode: a.mode,
        domainScores: a.domainScores,
      })),
    });
  } catch (error: any) {
    console.error("[GET /api/exams/attempts error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam attempts", attempts: [] },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const certificationId = searchParams.get("certificationId");

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const [u] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, session.user.email.toLowerCase()))
        .limit(1);
      if (u) userId = u.id;
    }

    if (userId) {
      if (certificationId) {
        await db
          .delete(userExamAttempts)
          .where(
            and(
              eq(userExamAttempts.userId, userId),
              eq(userExamAttempts.certificationId, certificationId)
            )
          );
      } else {
        await db
          .delete(userExamAttempts)
          .where(eq(userExamAttempts.userId, userId));
      }
    }

    return NextResponse.json({ success: true, message: "Attempts successfully cleared" });
  } catch (error: any) {
    console.error("[DELETE /api/exams/attempts error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exam attempts" },
      { status: 500 }
    );
  }
}
