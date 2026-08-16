import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch user orders" }, { status: 400 });
  }
}
