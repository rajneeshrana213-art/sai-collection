"use client";

import React from "react";
import { TESTIMONIALS } from "@/lib/mock-data";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-[#f7f3eb]/60 border-y border-amber-900/10">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">Real Customer Feedback</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1">
            Loved By Women Across India
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex text-amber-400 text-sm">★★★★★</div>
            <span className="text-xs text-zinc-600 font-medium">4.9/5 Overall Rating from 1,200+ Verified Buyers</span>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(t.rating)}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">{t.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed font-light">
                  &quot;{t.comment}&quot;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-zinc-900">{t.name}</h4>
                  <span className="text-[11px] text-zinc-500 font-medium">{t.location}</span>
                </div>
                {t.verifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-full border border-emerald-200">
                    <span>✓</span> Verified Buyer
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
