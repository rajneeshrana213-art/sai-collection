"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const CategoryCard = ({ cat }: { cat: { id: string; name: string; slug: string; images: string[] } }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % cat.images.length);
    }, 3000 + Math.random() * 1000);
    return () => clearInterval(timer);
  }, [cat.images.length]);

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group flex flex-col items-center text-center shrink-0 w-44 sm:w-48 lg:w-52"
    >
      <div className="relative w-44 h-72 sm:w-48 sm:h-80 lg:w-52 lg:h-84 rounded-t-[999px] rounded-b-[999px] overflow-hidden bg-zinc-100 transition-transform duration-300 group-hover:scale-[1.03] shadow-sm hover:shadow-xl">
        {cat.images.map((img, idx) => (
          /* eslint-disable-next-line @next/next/no-img-element */
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

      <div className="mt-6 lg:mt-7 space-y-3">
        <h3 className="font-sans text-[13px] sm:text-[14px] lg:text-base font-medium text-zinc-800 uppercase tracking-[0.18em] truncate max-w-full">
          {cat.name}
        </h3>
        <span className="inline-block text-[12px] sm:text-13px lg:text-sm font-normal text-zinc-700 uppercase tracking-[0.06em] underline underline-offset-8 group-hover:text-amber-800 transition-colors">
          SHOP NOW +
        </span>
      </div>
    </Link>
  );
};

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; images: string[] }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiClient.get<{ categories: Array<{ id?: string; slug: string; name: string; imageUrl?: string }> }>("/api/v1/categories");
        if (res && Array.isArray(res.categories)) {
          const formatted = res.categories.map((c) => ({
            id: c.id || c.slug,
            name: c.name.toUpperCase(),
            slug: c.slug,
            images: [
              c.imageUrl || "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
            ],
          }));
          setCategories(formatted);
        } else if (Array.isArray(res)) {
          const formatted = (res as unknown as Array<{ id?: string; slug: string; name: string; imageUrl?: string }>).map((c) => ({
            id: c.id || c.slug,
            name: c.name.toUpperCase(),
            slug: c.slug,
            images: [
              c.imageUrl || "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
            ],
          }));
          setCategories(formatted);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.warn("CategoryGrid API fetch error", err);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 lg:py-18 px-4 sm:px-6 lg:px-8 w-full font-sans bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title Header */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.2em] text-zinc-800 uppercase">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* Category Carousel Slider Container */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 px-2"
          >
            {categories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>

          {/* Slider Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 border border-zinc-300 shadow-md items-center justify-center text-zinc-700 hover:text-black hover:scale-110 hover:shadow-xl transition-all z-20"
            title="Scroll Left"
            aria-label="Scroll Left"
          >
            <span className="text-3xl leading-none pb-1 pr-0.5">‹</span>
          </button>

          {/* Slider Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 border border-zinc-300 shadow-md items-center justify-center text-zinc-700 hover:text-black hover:scale-110 hover:shadow-xl transition-all z-20"
            title="Scroll Right"
            aria-label="Scroll Right"
          >
            <span className="text-3xl leading-none pb-1 pl-0.5">›</span>
          </button>
        </div>
      </div>
    </section>
  );
};
