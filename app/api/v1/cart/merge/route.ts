import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ success: true, message: "No guest sessionId provided." });
    }

    // Find guest cart
    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return NextResponse.json({ success: true, message: "No guest cart items to merge." });
    }

    // Find or create user cart
    let userCart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: { items: true },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId: session.userId },
        include: { items: true },
      });
    }

    // Merge guest cart items into user cart
    for (const item of guestCart.items) {
      const existing = userCart.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    const mergedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          include: {
            product: { include: { media: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, cart: mergedCart });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to merge cart" }, { status: 400 });
  }
}
