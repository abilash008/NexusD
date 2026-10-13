import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, userProfiles, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        profile: null,
      });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    let targetUserId = userId;
    if (!targetUserId && userEmail) {
      const [u] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, userEmail.toLowerCase()))
        .limit(1);
      if (u) {
        targetUserId = u.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        profile: null,
      });
    }

    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, targetUserId))
      .limit(1);

    return NextResponse.json({
      success: true,
      authenticated: true,
      profile: existing || null,
    });
  } catch (error: any) {
    console.error("[Profile GET API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to sync profile to cloud" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    let targetUserId = userId;
    if (!targetUserId && userEmail) {
      const [u] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, userEmail.toLowerCase()))
        .limit(1);
      if (u) {
        targetUserId = u.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "User record not found in system" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { backgroundSegment, targetRoles, targetSpecializations } = body;

    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, targetUserId))
      .limit(1);

    let result;
    if (existing) {
      [result] = await db
        .update(userProfiles)
        .set({
          backgroundSegment: backgroundSegment ?? existing.backgroundSegment,
          targetRoles: targetRoles ?? existing.targetRoles,
          targetSpecializations: targetSpecializations ?? existing.targetSpecializations,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, targetUserId))
        .returning();
    } else {
      [result] = await db
        .insert(userProfiles)
        .values({
          userId: targetUserId,
          backgroundSegment: backgroundSegment || "servicenow_trainee",
          targetRoles: targetRoles || ["ServiceNow System Administrator"],
          targetSpecializations: targetSpecializations || ["ITSM"],
          onboardingCompleted: true,
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      profile: result,
    });
  } catch (error: any) {
    console.error("[Profile POST API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to persist profile to cloud" },
      { status: 500 }
    );
  }
}
