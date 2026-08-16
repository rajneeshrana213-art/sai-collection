import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!session && !sessionId) {
      return NextResponse.json({ cart: null, items: [] });
    }

    const cart = await prisma.cart.findFirst({
      where: session
        ? { userId: session.userId }
        : { sessionId: sessionId || undefined },
      include: {
        items: {
          include: {
            product: {
              include: { media: { where: { isPrimary: true }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ cart });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch cart" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { productId, variantId, quantity = 1, sessionId } = body;

    if (!productId || !variantId) {
      return NextResponse.json({ error: "productId and variantId are required" }, { status: 400 });
    }

    // Ensure cart exists
    let cart = await prisma.cart.findFirst({
      where: session
        ? { userId: session.userId }
        : { sessionId: sessionId || undefined },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session?.userId || null,
          sessionId: !session ? sessionId || `sess_${Date.now()}` : null,
        },
      });
    }

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: { media: { where: { isPrimary: true }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update cart" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    }

    // Clear whole cart
    const cart = await prisma.cart.findFirst({
      where: session ? { userId: session.userId } : {},
    });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to clear cart" }, { status: 400 });
  }
}
