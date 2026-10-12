import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Returns an authenticated Razorpay instance on the server
 */
export function getRazorpayServerInstance(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Dynamically loads the Razorpay Standard Checkout script on the client
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay checkout script.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Validates Razorpay Payment Signature using HMAC-SHA256
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;

  // Sandbox simulation token bypass
  if (orderId.startsWith("order_sandbox_") && signature.startsWith("sig_sandbox_")) {
    return true;
  }

  if (!secret) {
    // If secret is not set, allow dev mode testing
    return true;
  }

  try {
    const payload = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return generatedSignature.toLowerCase() === signature.toLowerCase();
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

/**
 * Validates Razorpay Webhook Signature using HMAC-SHA256
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
  secret,
}: {
  rawBody: string;
  signature: string;
  secret: string;
}): boolean {
  if (!rawBody || !signature || !secret) return false;

  try {
    const generated = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return generated.toLowerCase() === signature.toLowerCase();
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}
