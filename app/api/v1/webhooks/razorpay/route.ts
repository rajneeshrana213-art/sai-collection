import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/services/payment.service";
import { prisma } from "@/lib/db/client";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      await prisma.order.updateMany({
        where: { razorpayOrderId },
        data: {
          paymentStatus: "PAID",
          razorpayPaymentId,
        },
      });
    } else if (event === "payment.failed") {
      const payment = payload.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await prisma.order.updateMany({
        where: { razorpayOrderId },
        data: {
          paymentStatus: "FAILED",
        },
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Webhook processing failed" }, { status: 500 });
  }
}
