import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getSession } from "@/lib/security/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId parameter required" }, { status: 400 });
    }

    const reviews = await prisma.productReview.findMany({
      where: { productId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch reviews" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { productId, rating, title, comment, customerName, customerPhone } = body;

    if (!productId || !rating || !title || !comment || !customerName) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    // Auto-verify if user/phone has purchased this product
    let verifiedPurchase = false;
    if (session?.userId) {
      const pastOrder = await prisma.order.findFirst({
        where: {
          userId: session.userId,
          items: { some: { productId } },
        },
      });
      if (pastOrder) verifiedPurchase = true;
    } else if (customerPhone) {
      const pastOrder = await prisma.order.findFirst({
        where: {
          shippingPhone: { contains: customerPhone },
          items: { some: { productId } },
        },
      });
      if (pastOrder) verifiedPurchase = true;
    }

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId: session?.userId || null,
        customerName,
        customerPhone,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title,
        comment,
        verifiedPurchase,
        status: "PENDING", // Requires admin moderation
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Thank you! Your review has been submitted for moderation.",
    }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Review submission failed" }, { status: 400 });
  }
}
