"use client";

import React from "react";
import Link from "next/link";
import { MOCK_ORDERS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminDashboardPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const kpis = [
    { label: "Today's Sales Revenue", value: "₹42,500", change: "+18.4% vs yesterday", icon: "💰" },
    { label: "Total Orders Placed", value: "14 Orders", change: "12 paid via Razorpay", icon: "📦" },
    { label: "Pending Fulfillment", value: "3 Orders", change: "Awaiting courier pickup", icon: "⏳" },
    { label: "Low Stock Alert", value: "3 SKUs", change: "Less than 5 items left", icon: "⚠️" },
  ];

  const cardBg = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const innerCardBg = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-950 text-zinc-400";
  const divideBorder = isLight ? "divide-zinc-200" : "divide-zinc-800";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Dashboard Overview</h1>
        <p className={`text-xs ${textSub} mt-1`}>Real-time metrics for Sai Collection storefront operations &amp; fulfillment.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`${cardBg} p-5 rounded-2xl border space-y-2`}>
            <div className={`flex justify-between items-center text-xs ${textSub}`}>
              <span>{kpi.label}</span>
              <span className="text-base">{kpi.icon}</span>
            </div>
            <div className={`font-serif text-2xl font-bold ${textTitle}`}>{kpi.value}</div>
            <span className="text-[11px] text-emerald-600 font-medium block">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Revenue Performance & Low Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart Bar Preview (2 Cols) */}
        <div className={`lg:col-span-2 ${cardBg} p-6 rounded-2xl border space-y-4`}>
          <div className="flex justify-between items-center">
            <h2 className={`font-serif text-base font-bold ${textTitle}`}>Weekly Sales Performance</h2>
            <span className={`text-xs font-semibold ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>August 2026</span>
          </div>

          <div className={`h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"} px-2`}>
            {[
              { day: "Mon", height: "40%", val: "₹18k" },
              { day: "Tue", height: "65%", val: "₹28k" },
              { day: "Wed", height: "50%", val: "₹22k" },
              { day: "Thu", height: "85%", val: "₹39k" },
              { day: "Fri", height: "70%", val: "₹31k" },
              { day: "Sat", height: "95%", val: "₹42.5k" },
              { day: "Sun", height: "60%", val: "₹26k" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className={`text-[10px] ${textSub} opacity-0 group-hover:opacity-100 transition-opacity`}>{bar.val}</span>
                <div
                  className="w-full bg-[#9b1c31] hover:bg-amber-500 rounded-t-lg transition-all"
                  style={{ height: bar.height }}
                />
                <span className={`text-[11px] ${textSub} font-medium`}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock SKU Alerts Panel */}
        <div className={`${cardBg} p-6 rounded-2xl border space-y-4 h-fit`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-serif text-base font-bold ${textTitle}`}>Low Stock Inventory</h3>
            <Link href="/admin/products" className={`text-xs font-semibold hover:underline ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>Manage All →</Link>
          </div>

          <div className="space-y-3 text-xs">
            {MOCK_PRODUCTS.slice(0, 3).map((prod) => {
              const lowestStockVariant = prod.variants[0];
              return (
                <div key={prod.id} className={`p-3 ${innerCardBg} rounded-xl border flex justify-between items-center`}>
                  <div className="min-w-0 pr-2">
                    <h4 className={`font-bold ${isLight ? "text-zinc-800" : "text-zinc-200"} truncate`}>{prod.name}</h4>
                    <span className={`text-[10px] ${textSub}`}>SKU: {lowestStockVariant.sku}</span>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded border border-red-200 shrink-0">
                    {lowestStockVariant.stock} left
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Orders Queue */}
      <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
        <div className="flex justify-between items-center">
          <h2 className={`font-serif text-base font-bold ${textTitle}`}>Recent Store Orders</h2>
          <Link href="/admin/orders" className={`text-xs font-bold hover:underline ${isLight ? "text-[#9b1c31]" : "text-amber-300"}`}>View Fulfillment Queue →</Link>
        </div>

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
              {MOCK_ORDERS.map((order) => (
                <tr key={order.orderNumber} className={isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/50 transition-colors"}>
                  <td className={`p-3 font-bold ${textTitle}`}>{order.orderNumber}</td>
                  <td className="p-3">{order.shippingAddress.fullName} ({order.shippingAddress.city})</td>
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
      </div>

    </div>
  );
}
