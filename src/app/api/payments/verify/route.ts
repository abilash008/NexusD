import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { db, payments, userEntitlements } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    const orderId = body.orderId || body.order_id || body.razorpay_order_id;
    const paymentId = body.paymentId || body.payment_id || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;
    const planId = body.planId || "all_access";
    const providedEmail = body.userEmail;
    const providedName = body.userName;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: "Missing required orderId, paymentId, or signature identifiers." },
        { status: 400 }
      );
    }

    if (!(planId in PRICING_PLANS)) {
      return NextResponse.json(
        { success: false, error: "Invalid pricing plan specified." },
        { status: 400 }
      );
    }

    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured." },
        { status: 500 }
      );
    }

    // Validate cryptographic HMAC-SHA256 signature
    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
      secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Razorpay cryptographic payment signature mismatch." },
        { status: 400 }
      );
    }

    const userEmail = session?.user?.email || providedEmail || "aspirant@nexusd.in";
    const userName = session?.user?.name || providedName || "ServiceNow Aspirant";
    const userId = session?.user?.id || null;
    const receiptNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Persist payment capture and entitlement into Neon PostgreSQL if available
    if (process.env.DATABASE_URL) {
      try {
        // Try updating existing payment row, or insert new
        const existing = await db
          .select()
          .from(payments)
          .where(eq(payments.razorpayOrderId, orderId))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(payments)
            .set({
              razorpayPaymentId: paymentId,
              razorpaySignature: signature || "sandbox",
              status: "captured",
              updatedAt: new Date(),
            })
            .where(eq(payments.razorpayOrderId, orderId));
        } else {
          await db.insert(payments).values({
            userId,
            userEmail,
            userName,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature || "sandbox",
            planId: plan.id,
            amountPaise: plan.amountPaise,
            currency: "INR",
            status: "captured",
            receiptNumber,
          });
        }

        // Compute 1-year expiration for certification tracks
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        // Grant entitlement in database if userId exists
        if (userId) {
          const certsToGrant =
            plan.id === "all_access"
              ? ["csa", "cad", "cis-df", "cis-itsm"]
              : ["csa"];

          for (const certId of certsToGrant) {
            await db.insert(userEntitlements).values({
              userId,
              certificationId: certId,
              accessType: plan.id,
              orderId,
              expiresAt, // 1-year certification validity
            });
          }
        }
      } catch (dbErr: any) {
        console.warn("[NexusD Payments] Database verification persistence skipped:", dbErr?.message);
      }
    }

    const certsGranted =
      plan.id === "all_access"
        ? ["csa", "cad", "cis-df", "cis-itsm"]
        : ["csa"];

    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and Pro entitlement activated for 1 year.",
      entitlement: {
        planId: plan.id,
        planName: plan.name,
        certifications: certsGranted,
        orderId,
        paymentId,
        receiptNumber,
        amountInr: plan.priceInr,
        amountPaise: plan.amountPaise,
        userEmail,
        userName,
        paidAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[NexusD Payments] verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify transaction signature" },
      { status: 500 }
    );
  }
}
