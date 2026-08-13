"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const CATEGORIES_DATA = [
  {
    id: "straight-suits",
    name: "STRAIGHT SUITS",
    slug: "straight-suits",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=900",
    ],
  },
  {
    id: "indo-westerns",
    name: "INDO WESTERNS",
    slug: "indo-westerns",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=900",
    ],
  },
  {
    id: "anarkali",
    name: "ANARKALI",
    slug: "anarkali",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=900",
    ],
  },
  {
    id: "sharara-suits",
    name: "SHARARA SUITS",
    slug: "sharara-suits",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=900",
    ],
  },
  {
    id: "3xl-suits",
    name: "3XL SUITS",
    slug: "3xl",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
    ],
  },
];

const CategoryCard = ({ cat }: { cat: typeof CATEGORIES_DATA[0] }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % cat.images.length);
    }, 3000 + Math.random() * 1000); // Randomize slight delay so they don't all flip exactly at the same time
    return () => clearInterval(timer);
  }, [cat.images.length]);

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-44 h-72 sm:w-48 sm:h-80 lg:w-48 lg:h-80 rounded-t-[999px] rounded-b-[999px] overflow-hidden bg-zinc-100 transition-transform duration-300 group-hover:scale-[1.03] shadow-sm hover:shadow-xl">
        {cat.images.map((img, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={idx}
            src={img}
            alt={`${cat.name} image ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              idx === currentImageIdx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        {/* Progress dots at the bottom */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {cat.images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="mt-7 lg:mt-8 space-y-4">
        <h3 className="font-sans text-[14px] sm:text-[15px] lg:text-base font-medium text-zinc-800 uppercase tracking-[0.18em]">
          {cat.name}
        </h3>
        <span className="inline-block text-[13px] sm:text-sm lg:text-[15px] font-normal text-zinc-700 uppercase tracking-[0.06em] underline underline-offset-8 group-hover:text-amber-800 transition-colors">
          SHOP NOW +
        </span>
      </div>
    </Link>
  );
};

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 w-full font-sans bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title Header */}
        <div className="text-center mb-12 lg:mb-14">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.2em] text-zinc-800 uppercase">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* 5 Categories Pill Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 place-items-center gap-y-12 lg:gap-y-14 gap-x-4 sm:gap-x-6 lg:gap-x-7">
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};



