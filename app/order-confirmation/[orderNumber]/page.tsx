"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Order } from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import { TaxInvoiceModal } from "@/components/common/TaxInvoiceModal";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await apiClient.get<{ order: Order } | Order>(`/api/v1/orders/${orderNumber}`);
        if (res && "order" in res && res.order) {
          setOrder(res.order);
        } else if (res && typeof res === "object" && "orderNumber" in res) {
          setOrder(res as Order);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.warn("Order confirmation API fetch error", err);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400 font-medium">
          Loading order details...
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="text-4xl">📦</div>
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Order Not Found</h2>
          <p className="text-xs text-zinc-500">We could not locate this order. Please verify your order number.</p>
          <Link href="/" className="inline-block bg-[#9b1c31] text-white text-xs font-bold px-6 py-2.5 rounded-full">
            Return to Storefront →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
              {order.items.map((item: { id: string; productImage: string; productName: string; variantSku?: string; variantSize?: string; variantColor?: string; quantity: number; price: number }) => (
                <div key={item.id} className="flex gap-4 items-center text-xs">
                  <Image src={item.productImage} alt={item.productName} width={64} height={80} className="w-16 h-20 object-cover rounded-lg bg-zinc-100 shrink-0" />
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
              {order.shippingAddress ? (
                <>
                  <p className="font-bold text-zinc-900">
                    {order.shippingAddress.fullName || (order.shippingAddress as unknown as { name?: string }).name || (order as unknown as { customerName?: string }).customerName || "Valued Customer"}
                  </p>
                  <p className="text-zinc-600">
                    {order.shippingAddress.line1 || (order.shippingAddress as unknown as { addressLine1?: string }).addressLine1 || ""}
                  </p>
                  {(order.shippingAddress.line2 || (order.shippingAddress as unknown as { addressLine2?: string }).addressLine2) && (
                    <p className="text-zinc-600">
                      {order.shippingAddress.line2 || (order.shippingAddress as unknown as { addressLine2?: string }).addressLine2}
                    </p>
                  )}
                  <p className="text-zinc-600">
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.pincode || (order.shippingAddress as unknown as { zipCode?: string }).zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-zinc-600 font-bold mt-1">Phone: {order.shippingAddress.phone}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold text-zinc-900">{(order as unknown as { customerName?: string }).customerName || "Valued Customer"}</p>
                  <p className="text-zinc-600">Standard Delivery (Panipat Warehouse)</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-2">
              {/* Payment Verification Status Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px]">
                  💳 Payment Gateway Status:
                </span>
                <span className="text-emerald-700 font-semibold text-[11px] block">
                  {order.paymentMethod === "COD" ? "Cash on Delivery (Pending Collection)" : "Razorpay Verified Online Payment ✓"}
                </span>
              </div>

              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-2.5 rounded-lg text-center block transition-colors shadow-sm"
              >
                🖨️ Download / Print Tax Invoice
              </button>

              <Link
                href={`/track-order?orderNumber=${orderNumber}`}
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

      {/* GST Tax Invoice Modal */}
      {showInvoiceModal && (
        <TaxInvoiceModal order={order} onClose={() => setShowInvoiceModal(false)} />
      )}

      <Footer />
    </div>
  );
}
