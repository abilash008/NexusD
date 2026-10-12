import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, userEntitlements, users } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        entitlement: null,
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
        entitlement: null,
      });
    }

    const now = new Date();
    // Query active entitlements
    const activeRows = await db
      .select()
      .from(userEntitlements)
      .where(
        and(
          eq(userEntitlements.userId, targetUserId),
          gt(userEntitlements.expiresAt, now)
        )
      );

    if (activeRows.length === 0) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        entitlement: null,
      });
    }

    const hasAllAccess = activeRows.some((r) => r.accessType === "all_access");
    const activeCerts = Array.from(new Set(activeRows.map((r) => r.certificationId)));

    // Pick latest expiry date
    const latestExpiry = activeRows.reduce((latest, r) => {
      const exp = r.expiresAt ? new Date(r.expiresAt) : new Date(0);
      return exp > latest ? exp : latest;
    }, new Date(0));

    return NextResponse.json({
      success: true,
      authenticated: true,
      entitlement: {
        planId: hasAllAccess ? "all_access" : "csa_pass",
        certifications: hasAllAccess ? ["csa", "cad", "cis-df", "cis-itsm"] : activeCerts,
        grantedAt: activeRows[0].createdAt ? new Date(activeRows[0].createdAt).toISOString() : new Date().toISOString(),
        expiresAt: latestExpiry.toISOString(),
        orderId: activeRows[0].orderId || undefined,
      },
    });
  } catch (error: any) {
    console.error("[GET /api/user/entitlements error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user entitlements" },
      { status: 500 }
    );
  }
}
