import { prisma } from "@/lib/db/client";

export async function getOrderStatusTool(args: { orderNumber: string }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: args.orderNumber },
    include: { items: true },
  });

  if (!order) {
    return { error: `Order ${args.orderNumber} not found.` };
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    total: order.total / 100,
    trackingNumber: order.trackingNumber,
    courierName: order.courierName,
    estimatedDelivery: order.estimatedDelivery,
    itemsCount: order.items.length,
    items: order.items.map((i) => ({ name: i.productName, size: i.variantSize, color: i.variantColor, qty: i.quantity })),
  };
}
