"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MOCK_ORDERS } from "@/lib/mock-data";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = (params.orderNumber as string) || "SAI-ORD-2026-8841";

  const order = MOCK_ORDERS.find((o) => o.orderNumber === orderNumber) || MOCK_ORDERS[0];
  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Success Banner */}
        <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-lg text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 text-3xl rounded-full flex items-center justify-center mx-auto shadow-inner">
            ✓
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
            Thank you for shopping with <strong>Sai Collection</strong>. Your order has been placed successfully and is being packed in our Panipat workshop.
          </p>

          <div className="inline-flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 text-xs font-bold text-amber-950">
            <span>Order Number: <strong>{orderNumber}</strong></span>
            <span>•</span>
            <span>Estimated Delivery: {order.estimatedDelivery || "Aug 16, 2026"}</span>
          </div>
        </div>

        {/* Order Details & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Order Items (2 Cols) */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Purchased Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center text-xs">
                  <img src={item.productImage} alt={item.productName} className="w-16 h-20 object-cover rounded-lg bg-zinc-100 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-zinc-900 text-sm">{item.productName}</h3>
                    <p className="text-zinc-500">Size: {item.variantSize} | Color: {item.variantColor} | Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-zinc-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-1 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 border-t border-zinc-200 pt-2">
                <span>Total Paid</span>
                <span className="text-[#9b1c31]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address & Status */}
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-4 h-fit text-xs">
            <div>
              <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">
                Delivery Address
              </h3>
              <p className="font-bold text-zinc-900">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-600">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="text-zinc-600">{order.shippingAddress.line2}</p>}
              <p className="text-zinc-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-zinc-600 font-bold mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-2">
              <Link
                href={`/account/orders/${orderNumber}`}
                className="w-full bg-zinc-900 text-white font-bold py-2.5 rounded-lg text-center block"
              >
                Track Shipment Live
              </Link>
              <Link
                href="/products"
                className="w-full border border-zinc-300 text-zinc-800 font-bold py-2.5 rounded-lg text-center block hover:border-[#9b1c31]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
