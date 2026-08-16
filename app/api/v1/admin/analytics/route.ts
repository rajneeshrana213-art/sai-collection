import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dailyQueries = [];
    for (let i = 6; i >= 0; i--) {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59);

      dailyQueries.push({
        startOfDay,
        query: prisma.order.aggregate({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          _sum: { total: true },
        }),
      });
    }

    // Run ALL analytics queries in parallel in a single Promise.all
    const [
      totalOrders,
      pendingOrdersCount,
      totalCustomers,
      totalProducts,
      revenueResult,
      pendingReviewsCount,
      lowStockVariants,
      lowStockCount,
      recentOrders,
      ...dailyResults
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.productReview.count({ where: { status: "PENDING" } }),
      prisma.productVariant.findMany({
        where: { stock: { lt: 10 } },
        take: 5,
        select: {
          id: true,
          sku: true,
          size: true,
          color: true,
          stock: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { stock: "asc" },
      }),
      prisma.productVariant.count({ where: { stock: { lt: 10 } } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingFullName: true,
          shippingCity: true,
          createdAt: true,
        },
      }),
      ...dailyQueries.map((dq) => dq.query),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    const weeklySales = dailyQueries.map((dq, idx) => {
      const res = dailyResults[idx] as { _sum: { total: number | null } };
      const totalPaise = res._sum.total || 0;
      return {
        day: days[dq.startOfDay.getDay()],
        totalPaise,
        dateStr: dq.startOfDay.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      };
    });

    return NextResponse.json({
      analytics: {
        totalRevenue,
        totalOrders,
        pendingOrdersCount,
        lowStockCount,
        totalCustomers,
        totalProducts,
        pendingReviewsCount,
        lowStockVariants,
        recentOrders,
        weeklySales,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Analytics query failed" }, { status: 400 });
  }
}
