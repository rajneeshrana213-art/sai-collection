"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-xs text-zinc-700 leading-relaxed">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Shipping &amp; Delivery Policy</h1>
        <p className="text-zinc-500 font-medium">Last updated: August 12, 2026</p>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900">1. Order Processing &amp; Dispatch</h2>
          <p>
            All orders placed on <strong>Sai Collection</strong> (saicollection.in) are processed and dispatched from our primary warehouse in Panipat, Haryana. Dispatch occurs within 1 to 2 business days after order confirmation (or COD mobile verification).
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">2. Delivery Timelines across India</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chandigarh):</strong> 2 to 4 business days.</li>
            <li><strong>Tier-2 &amp; Tier-3 Cities:</strong> 3 to 6 business days.</li>
            <li><strong>North-East &amp; Jammu-Kashmir:</strong> 5 to 7 business days.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-zinc-900">3. Shipping Charges</h2>
          <p>
            We offer <strong>FREE Express Delivery</strong> on all orders equal to or exceeding ₹999 across India. For orders below ₹999, a flat shipping fee of ₹99 applies.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">4. Cash on Delivery (COD) Rules</h2>
          <p>
            Cash on Delivery is available for 19,000+ pincodes across India. For security and to prevent fraudulent orders, COD orders may require a quick SMS OTP verification during checkout.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">5. Shipment Tracking</h2>
          <p>
            Once dispatched, a tracking number and courier link (Delhivery / BlueDart / Shiprocket) will be emailed and sent via SMS to your registered mobile number. You can also track live order status in your <Link href="/account/orders" className="text-[#9b1c31] font-bold underline">Order History</Link>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
