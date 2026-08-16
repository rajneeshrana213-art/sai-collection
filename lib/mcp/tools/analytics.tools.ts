import { prisma } from "@/lib/db/client";

export async function getSalesAnalyticsTool() {
  const totalOrders = await prisma.order.count();
  const confirmedOrders = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { total: true },
  });

  const totalRevenuePaise = confirmedOrders._sum.total || 0;

  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lte: 5 } },
    include: { product: true },
    take: 10,
  });

  return {
    totalOrders,
    totalRevenueInRupees: totalRevenuePaise / 100,
    lowStockAlerts: lowStockVariants.map((v) => ({
      sku: v.sku,
      productName: v.product.name,
      size: v.size,
      color: v.color,
      remainingStock: v.stock,
    })),
  };
}
