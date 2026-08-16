import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { ToggleWishlistSchema } from "@/lib/validations/account.schema";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    include: {
      product: {
        include: { media: { where: { isPrimary: true }, take: 1 } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wishlist });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = ToggleWishlistSchema.parse(body);

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId: parsed.productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, added: false, message: "Removed from wishlist" });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: session.userId,
          productId: parsed.productId,
        },
      });
      return NextResponse.json({ success: true, added: true, message: "Added to wishlist" });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Wishlist toggle failed" }, { status: 400 });
  }
}
