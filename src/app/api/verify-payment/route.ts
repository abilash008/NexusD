import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, payments, userEntitlements } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const order_id = body.order_id || body.razorpay_order_id;
    const payment_id = body.payment_id || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;

    // Missing fields: return 400
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: order_id, payment_id, and signature are mandatory." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured on server" },
        { status: 500 }
      );
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    const isMatch = expectedSignature.toLowerCase() === signature.toLowerCase();

    // Signature mismatch: return 400, do NOT mark as paid
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // Mark as paid in Neon Database if configured
    if (process.env.DATABASE_URL) {
      try {
        const existing = await db
          .select()
          .from(payments)
          .where(eq(payments.razorpayOrderId, order_id))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(payments)
            .set({
              razorpayPaymentId: payment_id,
              razorpaySignature: signature,
              status: "captured",
              updatedAt: new Date(),
            })
            .where(eq(payments.razorpayOrderId, order_id));
        } else {
          const userEmail = body.email || body.userEmail || "customer@nexusd.in";
          const planId = body.planId || "all_access";
          const amountPaise = body.amount || body.amountPaise || 0;

          await db.insert(payments).values({
            userEmail,
            planId,
            razorpayOrderId: order_id,
            razorpayPaymentId: payment_id,
            razorpaySignature: signature,
            amountPaise,
            currency: "INR",
            status: "captured",
            receiptNumber: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          });
        }
      } catch (dbErr: any) {
        console.warn("[verify-payment] Database update note:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment signature verified successfully.",
      order_id,
      payment_id,
    });
  } catch (error: any) {
    console.error("[verify-payment] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during signature verification" },
      { status: 500 }
    );
  }
}
