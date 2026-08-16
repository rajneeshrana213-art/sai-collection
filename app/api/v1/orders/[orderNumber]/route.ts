import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(_req: Request, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await context.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch order details" }, { status: 400 });
  }
}
