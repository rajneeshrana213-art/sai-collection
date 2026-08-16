import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const dbReviews = await prisma.productReview.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
          media: { select: { url: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const reviews = dbReviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.product?.name || "Product",
    productImage: r.product?.media?.[0]?.url || undefined,
    customerName: r.customerName,
    customerPhone: r.customerPhone || undefined,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    status: r.status,
    verifiedPurchase: r.verifiedPurchase,
    createdAt: new Date(r.createdAt).toLocaleDateString("en-IN"),
  }));

  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { productId, customerName, customerPhone, rating, title, comment, status } = body;

    if (!productId || !customerName || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "productId, customerName, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    const review = await prisma.productReview.create({
      data: {
        productId,
        customerName,
        customerPhone: customerPhone || null,
        rating: Number(rating) || 5,
        title,
        comment,
        status: status || "APPROVED",
        verifiedPurchase: true,
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            media: { select: { url: true }, take: 1 },
          },
        },
      },
    });

    if (review.status === "APPROVED") {
      const agg = await prisma.productReview.aggregate({
        where: { productId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
          reviewsCount: agg._count.id || 0,
        },
      });
    }

    const formatted = {
      id: review.id,
      productId: review.productId,
      productName: review.product?.name || "Product",
      productImage: review.product?.media?.[0]?.url || undefined,
      customerName: review.customerName,
      customerPhone: review.customerPhone || undefined,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      verifiedPurchase: review.verifiedPurchase,
      createdAt: "Just now",
    };

    return NextResponse.json({ success: true, review: formatted });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to create review" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { reviewId, status } = body;

    if (!reviewId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "reviewId and valid status (APPROVED/REJECTED) required" }, { status: 400 });
    }

    const review = await prisma.productReview.update({
      where: { id: reviewId },
      data: { status },
    });

    if (status === "APPROVED") {
      const agg = await prisma.productReview.aggregate({
        where: { productId: review.productId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
          reviewsCount: agg._count.id || 0,
        },
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to moderate review" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId query parameter is required" }, { status: 400 });
    }

    await prisma.productReview.delete({ where: { id: reviewId } });
    return NextResponse.json({ success: true, message: "Review deleted permanently" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to delete review" }, { status: 400 });
  }
}
