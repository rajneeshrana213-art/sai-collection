"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { apiClient } from "@/lib/api-client";

import { AdminHeroSection } from "@/components/admin/AdminHeroSection";

interface LowStockVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  shippingFullName: string;
  shippingCity: string;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

interface WeeklySalesItem {
  day: string;
  totalPaise: number;
  dateStr: string;
}

interface AnalyticsPayload {
  totalRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  totalCustomers: number;
  totalProducts: number;
  pendingReviewsCount: number;
  lowStockVariants: LowStockVariant[];
  recentOrders: RecentOrder[];
  weeklySales: WeeklySalesItem[];
}

export default function AdminDashboardPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiClient.get<{ analytics: AnalyticsPayload }>("/api/v1/admin/analytics");
        if (res && res.analytics) {
          setAnalytics(res.analytics);
        } else if (res && typeof res === "object" && "totalRevenue" in res) {
          setAnalytics(res as unknown as AnalyticsPayload);
        }
      } catch (err) {
        console.warn("Analytics API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const cardBg = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const innerCardBg = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-950 text-zinc-400";
  const divideBorder = isLight ? "divide-zinc-200" : "divide-zinc-800";

  const maxWeeklySalesPaise = analytics?.weeklySales?.reduce((max, item) => Math.max(max, item.totalPaise), 0) || 1;

  const kpis = [
    {
      label: "Total Sales Revenue",
      value: analytics ? formatCurrency(analytics.totalRevenue) : "₹0",
      change: "Live store orders sum",
      icon: "💰",
    },
    {
      label: "Total Orders",
      value: analytics ? `${analytics.totalOrders} Orders` : "0 Orders",
      change: `${analytics?.pendingOrdersCount || 0} Processing / Queue`,
      icon: "📦",
    },
    {
      label: "Catalog & Customers",
      value: analytics ? `${analytics.totalProducts} Items` : "0 Items",
      change: `${analytics?.totalCustomers || 0} Registered Users`,
      icon: "👥",
    },
    {
      label: "Low Stock Inventory",
      value: analytics ? `${analytics.lowStockCount} SKUs` : "0 SKUs",
      change: "Less than 10 units left",
      icon: "⚠️",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Hero / Header Section */}
      <AdminHeroSection
        title="Dashboard Overview"
        subtitle="Real-time metrics for Sai Collection storefront operations & fulfillment."
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`${cardBg} p-5 rounded-2xl border space-y-2`}>
            <div className={`flex justify-between items-center text-xs ${textSub}`}>
              <span>{kpi.label}</span>
              <span className="text-base">{kpi.icon}</span>
            </div>
            <div className={`font-serif text-2xl font-bold ${textTitle}`}>{isLoading ? "..." : kpi.value}</div>
            <span className="text-[11px] text-emerald-600 font-medium block">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Revenue Performance & Low Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Chart Bar Preview (2 Cols) */}
        <div className={`lg:col-span-2 ${cardBg} p-6 rounded-2xl border space-y-4`}>
          <div className="flex justify-between items-center">
            <h2 className={`font-serif text-base font-bold ${textTitle}`}>7-Day Revenue Performance</h2>
            <span className={`text-xs font-semibold ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>Live Database Sync</span>
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-400">
              Loading sales chart data...
            </div>
          ) : (
            <div className={`h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"} px-2`}>
              {analytics?.weeklySales?.map((bar, i) => {
                const percentage = maxWeeklySalesPaise > 0 ? Math.max(12, Math.round((bar.totalPaise / maxWeeklySalesPaise) * 100)) : 12;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className={`text-[10px] ${textSub} opacity-0 group-hover:opacity-100 transition-opacity font-mono`}>
                      {formatCurrency(bar.totalPaise)}
                    </span>
                    <div
                      className="w-full bg-[#9b1c31] hover:bg-amber-500 rounded-t-lg transition-all"
                      style={{ height: `${percentage}%` }}
                    />
                    <span className={`text-[11px] ${textSub} font-medium`}>{bar.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock SKU Alerts Panel */}
        <div className={`${cardBg} p-6 rounded-2xl border space-y-4 h-fit`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-serif text-base font-bold ${textTitle}`}>Low Stock Inventory</h3>
            <Link href="/admin/products" className={`text-xs font-semibold hover:underline ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>
              Manage All →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-zinc-400">Loading stock alerts...</div>
            ) : analytics?.lowStockVariants && analytics.lowStockVariants.length > 0 ? (
              analytics.lowStockVariants.map((item) => (
                <div key={item.id} className={`p-3 ${innerCardBg} rounded-xl border flex justify-between items-center gap-2`}>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-bold ${isLight ? "text-zinc-800" : "text-zinc-200"} truncate`}>
                      {item.product?.name || "Product SKU"}
                    </h4>
                    <span className={`text-[10px] ${textSub} block truncate`}>
                      Size: {item.size} | Color: {item.color} ({item.sku})
                    </span>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded border border-red-200 shrink-0">
                    {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <div className={`p-4 ${innerCardBg} rounded-xl text-center text-xs ${textSub}`}>
                ✨ All inventory SKUs are well stocked!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Queue */}
      <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
        <div className="flex justify-between items-center">
          <h2 className={`font-serif text-base font-bold ${textTitle}`}>Recent Store Orders</h2>
          <Link href="/admin/orders" className={`text-xs font-bold hover:underline ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>
            View Fulfillment Queue →
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading recent store orders...</div>
        ) : analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`${tableHeadBg} font-bold uppercase text-[10px] tracking-wider`}>
                <tr>
                  <th className="p-3">Order No.</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideBorder} ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id} className={isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/50 transition-colors"}>
                    <td className={`p-3 font-bold ${textTitle}`}>{order.orderNumber}</td>
                    <td className="p-3">
                      {order.shippingFullName || "Customer"} ({order.shippingCity || "India"})
                    </td>
                    <td className="p-3">
                      <span className={isLight ? "bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold" : "bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-semibold"}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className={`p-3 font-bold ${textTitle}`}>{formatCurrency(order.total)}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-800 border border-blue-300" : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href="/admin/orders"
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-block ${
                          isLight ? "bg-zinc-900 text-white hover:bg-[#9b1c31]" : "text-amber-300 hover:text-white bg-zinc-800"
                        }`}
                      >
                        Update Status
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`p-8 ${innerCardBg} rounded-xl text-center text-xs ${textSub}`}>
            📦 No orders placed yet in database.
          </div>
        )}
      </div>

    </div>
  );
}
