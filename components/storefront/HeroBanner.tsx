"use client";

import React from "react";
import Link from "next/link";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#171010] text-white">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-65 transform scale-105 transition-transform duration-10000 ease-out"
        style={{
          backgroundImage: `url('/cover-page.jpeg')`,
        }}
      />

      {/* Gradient Vignette & Mesh */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#171010] via-transparent to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col justify-center min-h-[580px]">
        <div className="max-w-2xl space-y-6">

          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Panipat Artisan Craftsmanship • Direct-to-Consumer</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight">
            Festive Elegance <br />
            <span className="italic font-normal text-amber-200">Redefined.</span>
          </h1>

          {/* Paragraph */}
          <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
            Discover royal Velvet Anarkali suit sets, Chanderi silk kurtas, and handcrafted Phulkari dupattas. Shipped directly from our master workshops in Panipat, Haryana.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Link
              href="/products"
              className="bg-[#9b1c31] hover:bg-[#b5223c] text-white font-medium px-8 py-4 rounded-full text-center shadow-lg hover:shadow-red-900/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Explore Collection</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/products?category=womens-ethnic-suits"
              className="border border-white/30 hover:border-amber-300 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-full text-center backdrop-blur-sm transition-all"
            >
              Shop Anarkalis
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">🚚</span>
              <span><strong>Free Shipping</strong> on ₹999+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">💵</span>
              <span><strong>COD Available</strong> All-India</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">✨</span>
              <span><strong>100% Inspected</strong> Quality</span>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Wave Divider */}
      <div className="absolute bottom-0 inset-x-0 h-6 bg-[#fdfbf7] [clip-path:polygon(0_100%,100%_100%,100%_0)]" />
    </section>
  );
};
