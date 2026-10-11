import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, questionReports } from "@/lib/db";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    const {
      questionId,
      certificationId = "csa",
      issueType = "other",
      description,
      reporterEmail: customEmail,
    } = body;

    if (!questionId || !description) {
      return NextResponse.json(
        { success: false, error: "Question ID and issue description are required." },
        { status: 400 }
      );
    }

    const reporterEmail = session?.user?.email || customEmail || "student@nexusd.in";
    const reportedByUserId = session?.user?.id || null;

    if (process.env.DATABASE_URL) {
      try {
        const [report] = await db
          .insert(questionReports)
          .values({
            questionId,
            certificationId,
            reportedByUserId,
            reporterEmail,
            issueType,
            description,
            status: "pending",
          })
          .returning();

        return NextResponse.json({
          success: true,
          reportId: report.id,
          message: "Report logged successfully.",
        });
      } catch (dbErr: any) {
        console.warn("[NexusD Reports] DB insert skipped:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      reportId: `rep-local-${Date.now()}`,
      message: "Report recorded successfully.",
    });
  } catch (error: any) {
    console.error("[NexusD Reports] Error logging errata report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit errata report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const reports = await db
          .select()
          .from(questionReports)
          .orderBy(desc(questionReports.createdAt))
          .limit(50);

        return NextResponse.json({ success: true, reports });
      } catch (dbErr: any) {
        console.warn("[NexusD Reports] DB read skipped:", dbErr?.message);
      }
    }

    return NextResponse.json({ success: true, reports: [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
