"use client";

import React, { useState } from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">We Are Here To Help</span>
          <h1 className="font-serif text-4xl font-bold text-zinc-900">Get In Touch</h1>
          <p className="text-xs text-zinc-600">Have questions about suit sizes, fabric details, or order tracking?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-6 text-xs">
            <h2 className="font-serif text-xl font-bold text-zinc-900">Sai Collection Workshop</h2>

            <div className="space-y-4 text-zinc-600">
              <div className="flex gap-3 items-start">
                <span className="text-amber-800 text-base">📍</span>
                <div>
                  <strong className="text-zinc-900 block font-bold">Panipat Workshop &amp; Studio:</strong>
                  <span>Model Town Market, Near GT Road, Panipat, Haryana 132103, India</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-amber-800 text-base">📞</span>
                <div>
                  <strong className="text-zinc-900 block font-bold">WhatsApp &amp; Phone Support:</strong>
                  <span>+91 98765 43210 (Mon - Sat, 10:00 AM - 7:00 PM IST)</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-amber-800 text-base">✉️</span>
                <div>
                  <strong className="text-zinc-900 block font-bold">Email Support:</strong>
                  <span>support@saicollection.in</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-amber-800 text-base">📷</span>
                <div>
                  <strong className="text-zinc-900 block font-bold">Instagram DM:</strong>
                  <a href="https://instagram.com/saicollectionpnp" target="_blank" rel="noopener noreferrer" className="text-[#9b1c31] underline font-bold">
                    @saicollectionpnp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-sm">
            {submitted ? (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-emerald-800 text-center space-y-2 text-xs">
                <div className="text-3xl">✓</div>
                <h3 className="font-serif text-lg font-bold text-zinc-900">Message Sent!</h3>
                <p>Thank you for contacting Sai Collection. Our team in Panipat will reply to your inquiry within 2-4 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h2 className="font-serif text-xl font-bold text-zinc-900">Send Us a Message</h2>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Your Name *</label>
                  <input type="text" required placeholder="Pooja Sharma" className="w-full border border-zinc-300 rounded-lg p-2.5" />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Mobile / Email *</label>
                  <input type="text" required placeholder="pooja@example.com" className="w-full border border-zinc-300 rounded-lg p-2.5" />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Message / Question *</label>
                  <textarea rows={4} required placeholder="Ask us about sizing, custom fabric requirements, or delivery..." className="w-full border border-zinc-300 rounded-lg p-2.5" />
                </div>
                <button type="submit" className="w-full bg-[#9b1c31] text-white font-bold py-3 rounded-full shadow-md">
                  Send Inquiry →
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
