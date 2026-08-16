import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from "@/lib/services/email.service";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch admin orders" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, status, trackingNumber, courierName, estimatedDelivery } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      },
    });

    // Send email notifications if status changed
    const customerEmail = currentOrder.user?.email || currentOrder.guestEmail;
    if (customerEmail && status && status !== currentOrder.status) {
      if (status === "SHIPPED") {
        sendOrderShippedEmail(customerEmail, updatedOrder).catch(console.error);
      } else if (status === "DELIVERED") {
        sendOrderDeliveredEmail(customerEmail, updatedOrder).catch(console.error);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update order" }, { status: 400 });
  }
}
