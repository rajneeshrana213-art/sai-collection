"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ReelItem {
  id: string;
  title: string;
  category: string;
  price: string;
  productSlug: string;
  posterUrl: string;
  videoUrl: string;
}

const REEL_SHOWCASE: ReelItem[] = [
  {
    id: "reel-1",
    title: "Heavy Kashmiri Zari Velvet Anarkali",
    category: "Royal Velvet Suits",
    price: "₹3,499",
    productSlug: "heavy-kashmiri-zari-velvet-anarkali",
    posterUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "reel-2",
    title: "Handcrafted Chanderi Gold Dupatta Set",
    category: "Chanderi Silk",
    price: "₹2,899",
    productSlug: "handcrafted-chanderi-gold-dupatta-set",
    posterUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "reel-3",
    title: "Bridal Embroidered Georgette Sharara",
    category: "Partywear Gowns",
    price: "₹4,199",
    productSlug: "bridal-embroidered-georgette-sharara",
    posterUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: "reel-4",
    title: "Amritsari Phulkari Handworked Suit",
    category: "Phulkari Suits",
    price: "₹2,499",
    productSlug: "amritsari-phulkari-handworked-suit",
    posterUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

export function ProductVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<ReelItem | null>(null);

  return (
    <section className="py-12 bg-gradient-to-b from-[#fdfbf7] via-amber-50/40 to-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-amber-900/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9b1c31] animate-ping" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9b1c31]">
                Live Showcase Reels
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
              Watch Fabric &amp; Fit Videos
            </h2>
          </div>
          <p className="text-xs text-zinc-600 max-w-md">
            Experience real flare, fabric movement, and zari embroidery close-ups before placing your order.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {REEL_SHOWCASE.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveVideo(reel)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Image
                src={reel.posterUrl}
                alt={reel.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-[#9b1c31] backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Reel Info */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 block">
                  {reel.category}
                </span>
                <h3 className="font-serif text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {reel.title}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-extrabold text-white">{reel.price}</span>
                  <span className="text-[10px] font-bold text-amber-300 group-hover:underline">
                    Watch Reel →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-400">📹 Product Reel</span>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <video
                controls
                autoPlay
                loop
                playsInline
                src={activeVideo.videoUrl}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-1 space-y-2">
              <h3 className="font-serif text-sm font-bold text-white">{activeVideo.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-amber-400">{activeVideo.price}</span>
                <Link
                  href={`/products/${activeVideo.productSlug}`}
                  className="bg-[#9b1c31] hover:bg-amber-900 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                >
                  Shop This Dress →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
