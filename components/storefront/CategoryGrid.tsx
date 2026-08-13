"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-amber-900/10 pb-4">
        <div>
          <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">Curated Collections</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1">
            Shop By Category
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-[#9b1c31] hover:text-amber-800 flex items-center gap-1 mt-2 sm:mt-0 transition-colors group"
        >
          <span>View All Categories</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-amber-900/5 flex flex-col h-72 sm:h-80"
          >
            {/* Background Image with Zoom */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url('${cat.imageUrl}')` }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-95" />

            {/* Top Badge */}
            {cat.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#9b1c31] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-md">
                  {cat.badge}
                </span>
              </div>
            )}

            {/* Bottom Content Container */}
            <div className="relative z-10 mt-auto p-4 text-white flex flex-col justify-end">
              <span className="text-[11px] text-amber-300 font-medium tracking-wide uppercase">
                {cat.itemCount} Designs
              </span>
              <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-amber-200 transition-colors mt-0.5">
                {cat.name}
              </h3>
              <p className="text-[11px] text-zinc-300 line-clamp-1 mt-1 font-light opacity-90">
                {cat.description}
              </p>

              {/* Action Prompt */}
              <div className="mt-3 flex items-center text-xs font-semibold text-amber-200 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
