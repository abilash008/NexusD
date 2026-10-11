import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { db, payments, userEntitlements, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (webhookSecret) {
      const isValid = verifyWebhookSignature({
        rawBody,
        signature,
        secret: webhookSecret,
      });

      if (!isValid) {
        console.warn("[Razorpay Webhook] Invalid webhook signature detected.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    const payload = event?.payload;

    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const amount = paymentEntity?.amount;
      const email = paymentEntity?.email;
      const notes = paymentEntity?.notes || {};
      const planId = notes.planId || "csa_pass";

      if (process.env.DATABASE_URL && orderId) {
        try {
          // Find matching payment row or create captured entry
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
                status: "captured",
                updatedAt: new Date(),
              })
              .where(eq(payments.razorpayOrderId, orderId));
          } else {
            await db.insert(payments).values({
              userEmail: email || "customer@nexusd.in",
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              planId,
              amountPaise: amount || 49900,
              currency: "INR",
              status: "captured",
              receiptNumber: `WH-${Date.now()}`,
            });
          }

          // Grant entitlement if email matches an existing user
          if (email) {
            const matchedUser = await db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);

            if (matchedUser.length > 0) {
              const uId = matchedUser[0].id;
              const certs =
                planId === "all_access"
                  ? ["csa", "cad", "cis-df", "cis-itsm"]
                  : ["csa"];

              const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
              for (const c of certs) {
                await db.insert(userEntitlements).values({
                  userId: uId,
                  certificationId: c,
                  accessType: planId,
                  orderId,
                  expiresAt, // 1-year certification validity
                });
              }
            }
          }
        } catch (dbErr: any) {
          console.warn("[Razorpay Webhook] Database processing error:", dbErr?.message);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[Razorpay Webhook] Handler error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
