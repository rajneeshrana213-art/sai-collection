"use client";

import React, { useState, useEffect } from "react";

const HERO_SLIDES = [
  {
    id: 1,
    title: "NEW ARRIVALS",
    subtitle: "BUY DESIGNER ETHNIC WEAR & INDO-WESTERN AT SAI COLLECTION",
    image: "/cover-page.png",
    link: "/products",
    badge: "Festive Collection '26",
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const SAFETY_NOTICES = [
    "📌 Pls Note: We don't take orders on any WhatsApp numbers.",
    "📌 हम किसी भी WhatsApp नंबर पर order नहीं लेते।",
    "Sai Collection is not responsible for any payments made to WhatsApp numbers or DMs. Stay safe! ✅",
  ];

  const MARQUEE_NOTICES = [...SAFETY_NOTICES, ...SAFETY_NOTICES];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full flex flex-col font-sans">


      {/* 1. Side Animation Slide Carousel Banner */}
      <div className="relative overflow-hidden bg-zinc-950 min-h-[420px] sm:min-h-[550px] flex items-center">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out flex items-center justify-center ${isActive
                  ? "translate-x-0 opacity-100 z-10"
                  : idx < currentSlide
                    ? "-translate-x-full opacity-0 z-0"
                    : "translate-x-full opacity-0 z-0"
                }`}
            >
              {/* Background Image Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-10000"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 " />

              {/* Text & Button Content Overlay */}
              {/* <div className="relative z-20 max-w-5xl mx-auto px-4 text-center text-white space-y-4 sm:space-y-6">
                <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-widest">
                  {slide.badge}
                </span>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-widest leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-zinc-200 uppercase tracking-widest font-medium max-w-xl mx-auto">
                  {slide.subtitle}
                </p>

                <div className="pt-2">
                  <Link
                    href={slide.link}
                    className="inline-block bg-white hover:bg-zinc-100 text-zinc-950 font-bold px-8 py-3.5 text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    SHOP NOW →
                  </Link>
                </div>
              </div> */}
            </div>
          );
        })}

        {/* Carousel Indicators / Controls */}
        <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
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
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .notice-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

