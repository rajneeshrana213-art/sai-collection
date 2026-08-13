"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const BrandStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#fdfbf7] relative overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Visual Showcase Stack */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000"
                alt="Sai Collection Panipat Artisan Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay Accent Card */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 z-20 bg-[#9b1c31] text-white p-6 rounded-2xl shadow-xl max-w-xs border border-amber-400/30">
              <div className="text-3xl font-serif font-bold text-amber-200">Panipat, HR</div>
              <p className="text-xs text-zinc-200 mt-1 font-light">
                India&apos;s celebrated textile city — bringing heritage embroidery &amp; pure fabrics straight to your doorstep.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-amber-300 tracking-wider uppercase flex items-center gap-1">
                <span>Follow @saicollectionpnp</span>
                <span>→</span>
              </div>
            </div>

            {/* Decorative Backdrop Square */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-amber-800/20 rounded-2xl -z-0 hidden sm:block" />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Our Panipat Heritage
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Crafted With Passion. <br />
              <span className="text-[#9b1c31] italic font-normal">Priced Without Middlemen.</span>
            </h2>

            <p className="text-zinc-600 text-base leading-relaxed font-light">
              Sai Collection started as a boutique Indian ethnic wear label on Instagram (<strong>@saicollectionpnp</strong>), serving thousands of women looking for royal Anarkalis, breathable Chanderi kurtas, and traditional Phulkari dupattas.
            </p>

            <p className="text-zinc-600 text-base leading-relaxed font-light">
              Rooted in Panipat — the textile heart of North India — every garment is designed in-house, inspected for perfection, and delivered directly to your doorstep. We skip retail markups so you get authentic, hand-embroidered luxury at honest prices.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200">
              <div>
                <span className="font-serif text-2xl font-bold text-[#9b1c31]">50,000+</span>
                <span className="block text-xs text-zinc-500 font-medium">Happy Customers across India</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#9b1c31]">100%</span>
                <span className="block text-xs text-zinc-500 font-medium">Authentic Panipat Weaves</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#9b1c31] hover:text-amber-800 transition-colors group"
              >
                <span>Read Full Brand Story</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
