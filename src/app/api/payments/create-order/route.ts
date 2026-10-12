import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { db, payments } from "@/lib/db";
import { getRazorpayServerInstance } from "@/lib/razorpay";

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
    if (plan.amountPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least 100 paise." },
        { status: 400 }
      );
    }

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

    const razorpay = getRazorpayServerInstance();
    // If real Razorpay keys are configured, generate server order via Razorpay SDK
    if (razorpay && keyId && !keyId.includes("placeholder")) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: plan.amountPaise,
          currency: "INR",
          receipt,
          notes: {
            planId: plan.id,
            planName: plan.name,
            userEmail,
            userName,
          },
        });

        orderData = {
          id: rzpOrder.id,
          amount: typeof rzpOrder.amount === "number" ? rzpOrder.amount : parseInt(String(rzpOrder.amount)),
          currency: rzpOrder.currency,
          receipt: rzpOrder.receipt || receipt,
          isSandbox: false,
        };
      } catch (err: any) {
        console.warn("[Razorpay API] Live order failed, falling back to sandbox:", err?.message);
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
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
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
