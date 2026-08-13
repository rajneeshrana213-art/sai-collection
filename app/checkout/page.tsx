"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, freeShippingThreshold } = useCart();

  // Form State
  const [fullName, setFullName] = useState("Pooja Sharma");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("pooja.sharma@example.com");
  const [line1, setLine1] = useState("House No. 42, Sector 14");
  const [line2, setLine2] = useState("Near Model Town Market");
  const [pincode, setPincode] = useState("132103");
  const [city, setCity] = useState("Panipat");
  const [state, setState] = useState("Haryana");

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 9900;
  const totalPayable = subtotal + shippingFee;

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPincode(val);
    if (val === "110001") {
      setCity("New Delhi");
      setState("Delhi");
    } else if (val === "132103") {
      setCity("Panipat");
      setState("Haryana");
    } else if (val === "160017") {
      setCity("Chandigarh");
      setState("Punjab");
    }
  };

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setIsOtpSent(true);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderNumber = `SAI-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/order-confirmation/${generatedOrderNumber}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-amber-900/10 mb-8">
          <Link href="/" className="font-serif text-2xl font-bold text-zinc-900">
            SAI COLLECTION
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold">
            <span>🛡️ 256-bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Shipping Address & Payment Selection */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Customer Details & Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#9b1c31] text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                <span>Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Mobile Number (for COD / Tracking) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Email Address (Order Confirmation) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Flat, House No., Building Name *</label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Street Address, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#9b1c31]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 bg-zinc-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-zinc-300 rounded-lg p-2.5 bg-zinc-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full border border-zinc-300 rounded-lg p-2.5 bg-zinc-100 text-zinc-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Options Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#9b1c31] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Razorpay Online */}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "RAZORPAY" ? "border-[#9b1c31] bg-amber-50/40 ring-1 ring-[#9b1c31]" : "border-zinc-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="accent-[#9b1c31]"
                    />
                    <div>
                      <strong className="text-zinc-900 font-bold text-sm block">Razorpay Checkout (Instant Payment)</strong>
                      <span className="text-zinc-500 text-[11px]">Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Netbanking</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-[10px]">Recommended</span>
                </label>

                {/* Cash on Delivery */}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "COD" ? "border-[#9b1c31] bg-amber-50/40 ring-1 ring-[#9b1c31]" : "border-zinc-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-[#9b1c31]"
                    />
                    <div>
                      <strong className="text-zinc-900 font-bold text-sm block">Cash on Delivery (COD)</strong>
                      <span className="text-zinc-500 text-[11px]">Pay cash to courier executive upon delivery at your doorstep</span>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded text-[10px]">COD Available</span>
                </label>
              </div>

              {/* Optional Phone OTP Verification for COD */}
              {paymentMethod === "COD" && (
                <div className="p-4 bg-amber-100/50 rounded-xl border border-amber-300 space-y-2 mt-4">
                  <span className="text-xs font-bold text-amber-950 block">📱 Verify Mobile for COD Order:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP (Try 1234)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1 text-xs border border-amber-300 rounded-lg p-2 font-bold"
                    />
                    {!isOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="bg-amber-800 text-white text-xs font-bold px-3 py-2 rounded-lg"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-800 font-bold flex items-center">✓ Sent</span>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm h-fit space-y-4">
            <h3 className="font-serif text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Items in Order ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img src={item.product.images[0]?.url} alt={item.product.name} className="w-12 h-14 object-cover rounded bg-zinc-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <span className="text-zinc-500">Size: {item.variant.size} | Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-zinc-900">{formatCurrency(item.variant.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700">{isFreeShipping ? "FREE" : "₹99"}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 border-t border-zinc-200 pt-3">
                <span>Total Amount</span>
                <span className="text-[#9b1c31]">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-4 rounded-full text-center flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <span>Place Order ({formatCurrency(totalPayable)}) →</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
