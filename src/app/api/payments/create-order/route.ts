import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { db, payments } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    const {
      planId,
      userEmail: providedEmail,
      userName: providedName,
    } = body;

    if (!planId || !(planId in PRICING_PLANS)) {
      return NextResponse.json(
        { success: false, error: "Invalid or unsupported pricing plan selected." },
        { status: 400 }
      );
    }

    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    const userEmail = session?.user?.email || providedEmail || "aspirant@nexusd.in";
    const userName = session?.user?.name || providedName || "ServiceNow Aspirant";
    const userId = session?.user?.id || null;

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderData: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      isSandbox: boolean;
    };

    // If real Razorpay keys are configured, generate server order via Razorpay API
    if (keyId && keySecret && !keyId.includes("rzp_test_placeholder")) {
      try {
        const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: plan.amountPaise,
            currency: "INR",
            receipt,
            notes: {
              planId: plan.id,
              planName: plan.name,
              userEmail,
              userName,
            },
          }),
        });

        if (!rzpResponse.ok) {
          const errBody = await rzpResponse.text();
          console.warn("[Razorpay API] Live order failed, falling back to sandbox:", errBody);
          orderData = {
            id: `order_sandbox_${Date.now()}`,
            amount: plan.amountPaise,
            currency: "INR",
            receipt,
            isSandbox: true,
          };
        } else {
          const rzpOrder = await rzpResponse.json();
          orderData = {
            id: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            receipt: rzpOrder.receipt,
            isSandbox: false,
          };
        }
      } catch (err: any) {
        console.warn("[Razorpay API] Request error:", err?.message);
        orderData = {
          id: `order_sandbox_${Date.now()}`,
          amount: plan.amountPaise,
          currency: "INR",
          receipt,
          isSandbox: true,
        };
      }
    } else {
      // Sandbox mode for local dev or when keys are absent
      orderData = {
        id: `order_sandbox_${Date.now()}`,
        amount: plan.amountPaise,
        currency: "INR",
        receipt,
        isSandbox: true,
      };
    }

    // Persist pending order to database if configured
    if (process.env.DATABASE_URL) {
      try {
        await db.insert(payments).values({
          userId,
          userEmail,
          userName,
          razorpayOrderId: orderData.id,
          planId: plan.id,
          amountPaise: plan.amountPaise,
          currency: "INR",
          status: "created",
          receiptNumber: receipt,
        });
      } catch (dbErr: any) {
        console.warn("[NexusD Payments] Database write skipped:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      order: orderData,
      keyId: keyId || "rzp_test_nexusd_sandbox",
      plan: {
        id: plan.id,
        name: plan.name,
        priceInr: plan.priceInr,
        amountPaise: plan.amountPaise,
      },
      user: {
        name: userName,
        email: userEmail,
      },
    });
  } catch (error: any) {
    console.error("[NexusD Payments] create-order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
