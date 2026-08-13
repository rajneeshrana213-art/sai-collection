"use client";

import React from "react";

export const ValueProps: React.FC = () => {
  const trustBadges = [
    {
      title: "WORLDWIDE SHIPPING",
      subtitle: "(No Cash On Delivery)",
      icon: (
        <svg className="w-12 h-12 mx-auto text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 19.5l19-15m-19 7l19 8m-9.5-2.5l-.5 4.5" />
        </svg>
      ),
    },
    {
      title: "NO RETURN/ NO EXCHANGE/ NO REFUNDS",
      subtitle: "",
      icon: (
        <svg className="w-12 h-12 mx-auto text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8H4m0 0v5m0-5l4 4m7-7h5m0 0v5m0-5l-4 4" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
    },
    {
      title: "SECURE PAYMENT",
      subtitle: "(We accept Debit /Credit Card and UPI Payments)",
      icon: (
        <svg className="w-12 h-12 mx-auto text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="5" width="14" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h14" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 13.5l2 2 3-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 11.5a3.5 3.5 0 103.5 3.5" />
        </svg>
      ),
    },
  ];

  const notices = [
    "sai collection is not responsible for any payments made to WhatsApp numbers or DMs. Stay safe!",
    "Important Notice: We do not take orders on WhatsApp. Please place your orders only on our website.",
  ];

  return (
    <section className="font-sans border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="space-y-5">
              {badge.icon}
              <h3 className="text-[34px] leading-none sm:text-[38px] tracking-[0.1em] uppercase text-zinc-900 font-normal">
                {badge.title}
              </h3>
              {badge.subtitle && (
                <p className="text-[18px] sm:text-[20px] text-zinc-900">{badge.subtitle}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-rose-300 py-6 overflow-hidden border-t border-zinc-200">
        <div className="notice-marquee-track flex w-max items-center whitespace-nowrap text-zinc-900 text-[17px] sm:text-[20px]">
          {[...notices, ...notices].map((text, idx) => (
            <span key={`${text}-${idx}`} className="px-10 font-medium">
              <span className="font-semibold">📌</span> {text}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 text-white py-12 px-4 text-center">
        <p className="max-w-6xl mx-auto text-[17px] sm:text-[20px] font-semibold leading-relaxed">
          Note- After placing order all order related details are sent to your email and on whatsapp number you provided for parcel delivery. (📌 PLS CHECK SPAM FOLDER IN EMAIL ALSO)
        </p>
      </div>

      <style jsx>{`
        .notice-marquee-track {
          animation: notice-marquee 24s linear infinite;
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

