import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          where: { paymentStatus: "PAID" },
          select: { total: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      customers: customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        joinedDate: c.createdAt,
        totalOrders: c._count.orders,
        totalSpentPaise: c.orders.reduce((acc, o) => acc + o.total, 0),
        totalSpentRupees: c.orders.reduce((acc, o) => acc + o.total, 0) / 100,
      })),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch customers" }, { status: 400 });
  }
}
