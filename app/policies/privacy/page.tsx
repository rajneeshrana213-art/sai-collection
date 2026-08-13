"use client";

import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-xs text-zinc-700 leading-relaxed">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Privacy Policy</h1>
        <p className="text-zinc-500 font-medium">Last updated: August 12, 2026</p>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900">1. Information We Collect</h2>
          <p>
            Sai Collection collects personal information when you browse our storefront, register an account, or place an order. This includes your name, shipping address, mobile phone number, email address, and order transaction details.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">2. Payment Gateway Security (Razorpay)</h2>
          <p>
            All online financial transactions are processed securely via <strong>Razorpay</strong> over 256-bit encrypted SSL connections. Sai Collection does not store your credit/debit card numbers, UPI PINs, or banking passwords on our servers.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">3. Use of Information</h2>
          <p>
            Your information is used strictly to process orders, calculate shipping rates, provide live delivery updates, send promotional discounts (if opted-in), and improve your shopping experience. We never sell your personal data to third parties.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900">4. Contacting Data Protection Officer</h2>
          <p>
            If you have questions regarding your personal data or wish to delete your account, please email us at <strong>privacy@saicollection.in</strong>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
