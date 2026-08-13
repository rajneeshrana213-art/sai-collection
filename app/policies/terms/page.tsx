"use client";

import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-xs text-zinc-700 leading-relaxed">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Terms &amp; Conditions</h1>
        <p className="text-zinc-500 font-medium">Last updated: August 12, 2026</p>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900">1. Storefront Ownership</h2>
          <p>
            This website (saicollection.in) is owned and operated by <strong>Sai Collection</strong>, Panipat, Haryana (`@saicollectionpnp`). By accessing or purchasing from our platform, you agree to bound by these terms.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">2. Product Pricing &amp; Handcraft Disclaimer</h2>
          <p>
            All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST taxes. Because our suit sets and Phulkari dupattas feature handcrafted embroidery, minor variations in thread weave or color tone may occur, highlighting the authenticity of handloom craftsmanship.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">3. Orders &amp; Cancellations</h2>
          <p>
            Sai Collection reserves the right to cancel any order in case of stock unavailability or incorrect pricing errors. In such cases, online payments will be refunded in full immediately.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">4. Governing Law &amp; Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Panipat, Haryana.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
