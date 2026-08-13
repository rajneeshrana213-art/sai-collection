"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  if (!isCartOpen) return null;

  const formatCurrency = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  };

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.toUpperCase() === "SAI10") {
      const discountAmount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discountAmount);
      setCouponSuccess("Code SAI10 applied! You saved 10%");
    } else {
      setCouponError("Invalid coupon code. Try SAI10");
    }
  };

  const finalTotal = subtotal - appliedDiscount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col justify-between animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 border-b border-amber-900/10 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-zinc-900">Your Shopping Cart</span>
              <span className="bg-[#9b1c31] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-50 p-4 border-b border-amber-200">
            {isFreeShipping ? (
              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <span>🎉</span> You unlocked <strong>FREE Express Shipping!</strong>
              </div>
            ) : (
              <div className="text-xs text-amber-900 font-medium">
                Add <strong>{formatCurrency(remainingForFreeShipping)}</strong> more to get <strong>FREE Express Delivery</strong> across India!
              </div>
            )}
            <div className="w-full bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#9b1c31] h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 space-y-3">
                <div className="text-4xl">🛍️</div>
                <p className="font-serif text-lg font-bold text-zinc-800">Your Cart is Empty</p>
                <p className="text-xs">Explore our latest festive Anarkali suit sets &amp; kurtas.</p>
                <button
                  onClick={closeCart}
                  className="mt-4 bg-[#9b1c31] text-white text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-zinc-200 shadow-sm relative group"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg bg-zinc-100 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-bold text-zinc-900 line-clamp-1 pr-4">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
                        Size: <span className="text-zinc-800 font-bold">{item.variant.size}</span> | Color: <span className="text-zinc-800 font-bold">{item.variant.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-300 rounded-md overflow-hidden bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-zinc-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-zinc-900">
                        {formatCurrency(item.variant.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-amber-900/10 bg-white space-y-4">
              
              {/* Coupon Form */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. SAI10)"
                    className="flex-1 text-xs border border-zinc-300 rounded-lg px-3 py-2 uppercase font-medium focus:outline-none focus:border-[#9b1c31]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-zinc-900 hover:bg-[#9b1c31] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-700 font-medium">{couponSuccess}</p>}
              </div>

              {/* Subtotal & Discounts */}
              <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount (SAI10)</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {isFreeShipping ? "FREE" : "₹99"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 border-t border-zinc-200 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-[#9b1c31]">{formatCurrency(finalTotal + (isFreeShipping ? 0 : 9900))}</span>
                </div>
              </div>

              {/* Trust Badges in Footer */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                <span>🛡️ Razorpay 256-bit Secure</span>
                <span>💵 COD Available</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-3.5 rounded-full text-center flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
