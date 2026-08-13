"use client";

import React, { useState } from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && emailOrPhone) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-zinc-900">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-widest">
            TRACK YOUR ORDER
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            ENTER YOUR ORDER NUMBER & EMAIL / PHONE TO SEE SHIPMENT STATUS
          </p>
          <div className="w-12 h-0.5 bg-zinc-900 mx-auto" />
        </div>

        <form onSubmit={handleTrack} className="bg-zinc-50 border border-zinc-200 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-800">
              Order Number (e.g. #LA-10852) *
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ENTER YOUR ORDER NUMBER"
              required
              className="w-full bg-white border border-zinc-300 p-3 text-xs uppercase font-semibold focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-800">
              Email Address or Phone Number *
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="ENTER EMAIL OR PHONE"
              required
              className="w-full bg-white border border-zinc-300 p-3 text-xs uppercase font-semibold focus:outline-none focus:border-zinc-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 text-xs uppercase tracking-widest transition-all"
          >
            TRACK SHIPMENT NOW →
          </button>
        </form>

        {searched && (
          <div className="bg-amber-50 border border-amber-300 p-6 text-center space-y-2 text-amber-950 font-semibold text-xs animate-fade-in">
            <p className="font-bold text-base text-zinc-900 uppercase">
              STATUS FOR ORDER {orderNumber}: DISPATCHED / IN-TRANSIT 🚚
            </p>
            <p className="text-zinc-700">
              Your parcel is currently processed for express shipping. Tracking link sent to {emailOrPhone}.
            </p>
            <p className="text-[11px] text-zinc-500 italic">
              (📌 Please check your email spam folder if update is not visible in inbox)
            </p>
          </div>
        )}
      </main>

      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
