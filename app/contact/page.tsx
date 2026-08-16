"use client";

import React, { useState } from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { apiClient } from "@/lib/api-client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Inquiry from Website");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/api/v1/contact", { name, email, subject, message });
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-bold">
                    {error}
                  </div>
                )}
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pooja Sharma"
                    className="w-full border border-zinc-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Mobile / Email *</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pooja@example.com"
                    className="w-full border border-zinc-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Inquiry from Website"
                    className="w-full border border-zinc-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Message / Question *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask us about sizing, custom fabric requirements, or delivery..."
                    className="w-full border border-zinc-300 rounded-lg p-2.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#9b1c31] text-white font-bold py-3 rounded-full shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry →"}
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
