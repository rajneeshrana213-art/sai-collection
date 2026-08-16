"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";

interface HeroSlideItem {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  targetLinkUrl: string;
  title?: string;
}

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    id: "default-slide-1",
    desktopImageUrl: "/cover-page.png",
    mobileImageUrl: "/cover-page.png",
    targetLinkUrl: "/products",
    title: "Sai Collection New Arrivals",
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlideItem[]>(DEFAULT_SLIDES);

  const SAFETY_NOTICES = [
    "📌 Pls Note: We don't take orders on any WhatsApp numbers.",
    "📌 हम किसी भी WhatsApp नंबर पर order नहीं लेते।",
    "Sai Collection is not responsible for any payments made to WhatsApp numbers or DMs. Stay safe! ✅",
  ];

  const MARQUEE_NOTICES = [...SAFETY_NOTICES, ...SAFETY_NOTICES];

  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const res = await apiClient.get<{ settings?: Record<string, unknown> }>("/api/v1/settings");
        if (res?.settings && Array.isArray(res.settings.heroSlides) && res.settings.heroSlides.length > 0) {
          const loadedSlides = (res.settings.heroSlides as HeroSlideItem[]).map((slide, idx) => ({
            id: slide.id || `slide-${idx}`,
            desktopImageUrl: slide.desktopImageUrl || "/cover-page.png",
            mobileImageUrl: slide.mobileImageUrl || slide.desktopImageUrl || "/cover-page.png",
            targetLinkUrl: slide.targetLinkUrl || "/products",
            title: slide.title || `Banner Slide ${idx + 1}`,
          }));
          setSlides(loadedSlides);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic hero slides", err);
      }
    }
    fetchHeroSettings();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlideIndex = currentSlide % (slides.length || 1);

  return (
    <section className="w-full flex flex-col font-sans">
      {/* 1. Clickable Image-First Hero Slider */}
      <div className="relative w-full overflow-hidden bg-zinc-950">
        <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] min-h-[220px] max-h-[640px]">
          {slides.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            const desktopImg = slide.desktopImageUrl || "/cover-page.png";
            const mobileImg = slide.mobileImageUrl || desktopImg;
            const targetUrl = slide.targetLinkUrl || "/products";

            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Link href={targetUrl} className="block w-full h-full relative group">
                  {/* Desktop Image */}
                  <div className="hidden sm:block w-full h-full relative">
                    <Image
                      src={desktopImg}
                      alt={slide.title || "Sai Collection Banner"}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>

                  {/* Mobile Image */}
                  <div className="block sm:hidden w-full h-full relative">
                    <Image
                      src={mobileImg}
                      alt={slide.title || "Sai Collection Banner"}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Carousel Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-30 flex justify-center items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeSlideIndex ? "w-8 bg-white shadow-md" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                title={`Slide ${i + 1}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Sai Collection WhatsApp Safety Notice Auto Slider */}
      <div className="bg-zinc-900 border-y border-zinc-700 px-3 sm:px-4 py-2.5 text-white">
        <div className="relative overflow-hidden h-7 sm:h-8 flex items-center">
          <div className="notice-marquee-track flex w-max items-center whitespace-nowrap">
            {MARQUEE_NOTICES.map((notice, idx) => (
              <span
                key={`${notice}-${idx}`}
                className="inline-flex items-center text-xs sm:text-sm font-semibold px-6"
              >
                {notice}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .notice-marquee-track {
          animation: notice-marquee 22s linear infinite;
          will-change: transform;
        }
        @keyframes notice-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export const HeroSection = HeroBanner;
