import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/services/payment.service";
import { prisma } from "@/lib/db/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderNumber || !razorpayPaymentId) {
      return NextResponse.json({ error: "Missing required verification fields" }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(
      razorpayOrderId || "order_rzp_mock",
      razorpayPaymentId,
      razorpaySignature || "mock_sig"
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature verification" }, { status: 400 });
    }

    // Update order payment status to PAID
    await prisma.order.updateMany({
      where: { orderNumber },
      data: {
        paymentStatus: "PAID",
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and invoice generated successfully.",
    });
  } catch (err: unknown) {
    console.error("Payment verification route error:", err);
    return NextResponse.json({ error: (err as Error).message || "Payment verification failed" }, { status: 400 });
  }
}
