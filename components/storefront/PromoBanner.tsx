"use client";

import React from "react";
import Link from "next/link";

export const PromoBanner: React.FC = () => {
  return (
    <section className="py-12 bg-zinc-950 text-white border-y border-zinc-800 font-sans">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-amber-300 text-xs font-extrabold uppercase tracking-widest">
          CURATED ETHNIC LUXURY
        </span>

        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-widest max-w-4xl mx-auto leading-tight text-white">
          You can&apos;t Miss ! Premium Retails Indian outfit corner
        </h2>

        <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mx-auto uppercase tracking-wider font-medium">
          HANDCRAFTED DESIGNER SUIT SETS, ANARKALIS & INDO-WESTERN WEAR DELIVERED DIRECTLY TO YOUR DOORSTEP.
        </p>

        <div className="pt-2">
          <Link
            href="/products"
            className="inline-block bg-white hover:bg-zinc-100 text-zinc-950 font-bold px-8 py-3.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
          >
            DISCOVER ALL COLLECTIONS →
          </Link>
        </div>
      </div>
    </section>
  );
};
