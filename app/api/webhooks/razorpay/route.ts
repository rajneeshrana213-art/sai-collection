import { NextResponse } from "next/server";
import crypto from "crypto";

function verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_default_secret";

    if (signature && !verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody || "{}");
    const event = payload.event;

    console.log(`[Razorpay Webhook Received] Event: ${event}`, payload);

    if (event === "payment.captured" || event === "order.paid") {
      // Reconcile Order status to CONFIRMED / Payment status to PAID
      console.log(`Payment verified for Razorpay Order: ${payload.payload?.payment?.entity?.order_id}`);
    } else if (event === "payment.failed") {
      console.log(`Payment failed for Razorpay Order: ${payload.payload?.payment?.entity?.order_id}`);
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}
