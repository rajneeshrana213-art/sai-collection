"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, freeShippingThreshold } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAI10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponMsg("✓ Code SAI10 applied! You saved 10%");
    } else {
      setCouponMsg("Invalid coupon code. Use SAI10");
    }
  };

  const finalTotal = subtotal - discount;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mb-8">
          Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-amber-900/10 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-5xl">🛍️</div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900">Your Cart is Empty</h2>
            <p className="text-xs text-zinc-500">
              Browse our latest Panipat Anarkalis, Chanderi Silk Kurtas, and Phulkari Dupattas.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#9b1c31] text-white font-bold text-xs px-8 py-3 rounded-full shadow-md hover:bg-[#7d1324] transition-all"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">

              {/* Free Shipping Progress Meter */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                {isFreeShipping ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <span>🎉</span> You unlocked <strong>FREE Express Shipping</strong> across India!
                  </span>
                ) : (
                  <span className="text-xs text-amber-900 font-medium">
                    Add <strong>{formatCurrency(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>!
                  </span>
                )}
                <div className="w-full bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#9b1c31] h-full transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-2xl border border-amber-900/10 divide-y divide-zinc-100 overflow-hidden shadow-sm">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                    <Image
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      width={96}
                      height={128}
                      className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded-xl bg-zinc-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] text-amber-800 font-semibold uppercase">{item.product.category}</span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Size: <strong className="text-zinc-800">{item.variant.size}</strong> | Color: <strong className="text-zinc-800">{item.variant.color}</strong>
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-zinc-50 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-zinc-800 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-serif text-lg font-bold text-zinc-900">
                          {formatCurrency(item.variant.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm h-fit space-y-6">
              <h2 className="font-serif text-xl font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Apply Coupon Code:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Try SAI10"
                    className="flex-1 text-xs border border-zinc-300 rounded-lg px-3 py-2 uppercase font-semibold focus:outline-none focus:border-[#9b1c31]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && <p className="text-[11px] font-medium text-emerald-700">{couponMsg}</p>}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-700">{isFreeShipping ? "FREE" : "₹99"}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-900 border-t border-zinc-200 pt-3">
                  <span>Total Payable</span>
                  <span className="text-[#9b1c31]">{formatCurrency(finalTotal + (isFreeShipping ? 0 : 9900))}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-4 rounded-full text-center flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        )}
      </main>

      <QuickSearchModal />
      <Footer />
    </div>
  );
}
