"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MOCK_ORDERS } from "@/lib/mock-data";

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const orderNumber = (params.orderNumber as string) || "SAI-ORD-2026-8841";

  const order = MOCK_ORDERS.find((o) => o.orderNumber === orderNumber) || MOCK_ORDERS[0];
  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const steps = [
    { label: "Order Placed", done: true, date: order.date },
    { label: "Packed in Panipat", done: true, date: "Aug 11, 2026" },
    { label: "Shipped via Courier", done: order.status === "SHIPPED" || order.status === "DELIVERED", date: "Aug 12, 2026" },
    { label: "Out for Delivery", done: order.status === "DELIVERED", date: order.estimatedDelivery || "Aug 14, 2026" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/account/orders" className="hover:text-[#9b1c31]">My Orders</Link>
          <span>/</span>
          <span className="text-zinc-900 font-bold">{orderNumber}</span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-8">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
            <div>
              <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block">Live Shipment Tracking</span>
              <h1 className="font-serif text-2xl font-bold text-zinc-900">{order.orderNumber}</h1>
              <p className="text-xs text-zinc-500">Courier: <strong>{order.courierName || "Delhivery Express"}</strong> | AWB: <strong>{order.trackingNumber || "DELHIVERY8841920"}</strong></p>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
              <span className="text-zinc-500 block font-medium">Estimated Delivery:</span>
              <strong className="text-[#9b1c31] text-sm font-serif block">{order.estimatedDelivery || "Aug 14, 2026"}</strong>
            </div>
          </div>

          {/* Timeline Tracking Bar */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-bold text-zinc-900">Shipment Status Timeline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {steps.map((step, idx) => (
                <div key={idx} className={`p-4 rounded-xl border relative ${step.done ? "bg-emerald-50/60 border-emerald-300" : "bg-zinc-50 border-zinc-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step.done ? "bg-emerald-700 text-white" : "bg-zinc-300 text-zinc-600"}`}>
                      {step.done ? "✓" : idx + 1}
                    </span>
                    <strong className="text-xs text-zinc-900 font-bold">{step.label}</strong>
                  </div>
                  <span className="text-[11px] text-zinc-500 block pl-7">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="pt-6 border-t border-zinc-100 space-y-4">
            <h3 className="font-serif text-base font-bold text-zinc-900">Package Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center text-xs">
                  <img src={item.productImage} alt={item.productName} className="w-16 h-20 object-cover rounded-lg bg-zinc-100 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-zinc-900 text-sm">{item.productName}</h4>
                    <p className="text-zinc-500">Size: {item.variantSize} | Color: {item.variantColor} | Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-zinc-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
