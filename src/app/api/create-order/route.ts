import { NextRequest, NextResponse } from "next/server";
import { getRazorpayServerInstance } from "@/lib/razorpay";
import { PRICING_PLANS } from "@/lib/pricing-plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let amount = body.amount;
    const currency = body.currency || "INR";
    const receipt = body.receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Support planId resolution if passed
    if (!amount && body.planId && body.planId in PRICING_PLANS) {
      amount = PRICING_PLANS[body.planId as keyof typeof PRICING_PLANS].amountPaise;
    }

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount must be at least 100 paise (₹1)." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 401 }
      );
    }

    const razorpay = getRazorpayServerInstance();
    if (!razorpay) {
      return NextResponse.json(
        { error: "Failed to initialize Razorpay client" },
        { status: 500 }
      );
    }

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount),
        currency,
        receipt,
        notes: body.notes || {},
      });

      return NextResponse.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        key_id: keyId,
      });
    } catch (rzpErr: any) {
      console.error("[Razorpay create-order] API Error:", rzpErr);
      return NextResponse.json(
        { error: rzpErr?.error?.description || rzpErr?.message || "Razorpay API error" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[create-order] Internal Error:", error);
    return NextResponse.json(
      { error: "Internal server error creating Razorpay order" },
      { status: 500 }
    );
  }
}
