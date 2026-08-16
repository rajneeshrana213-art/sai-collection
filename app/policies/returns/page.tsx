"use client";

import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-xs text-zinc-700 leading-relaxed">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Return &amp; Exchange Policy</h1>
        <p className="text-zinc-500 font-medium">Last updated: August 12, 2026</p>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900">1. 7-Day Easy Return &amp; Exchange Window</h2>
          <p>
            At <strong>Sai Collection</strong>, customer satisfaction is paramount. If you are not satisfied with the size, color, or fit of your Anarkali suit set, designer kurta, or saree, you may request a return or size exchange within <strong>7 days of delivery</strong>.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">2. Eligibility Conditions for Return</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Item must be unused, unwashed, unaltered, and in its original condition.</li>
            <li>Original brand tags, embroidery protectors, and packaging must be intact.</li>
            <li>Proof of purchase (Order Number or Email) is required.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-zinc-900">3. How to Initiate a Return or Exchange</h2>
          <p>
            To request a reverse doorstep pickup, please contact our support team on WhatsApp at <strong>+91 98765 43210</strong> or email <strong>support@saicollection.in</strong> with your Order Number and photos of the garment.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">4. Refund Process</h2>
          <p>
            Once the returned item is inspected at our Panipat workshop, refunds for online payments (Razorpay UPI / Cards) will be credited to the original payment source within 3-5 business days. For COD orders, refund will be transferred via UPI or direct bank transfer.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
