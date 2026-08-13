"use client";

import React from "react";

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#9b1c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Cash On Delivery (COD)",
      description: "Pay conveniently at your doorstep upon delivery across India."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#9b1c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "100% Quality Inspected",
      description: "Every suit set is hand-checked for stitching, thread work & fabric feel."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#9b1c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "7-Day Easy Returns",
      description: "Hassle-free size exchange and return policy for complete peace of mind."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#9b1c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secured Payments",
      description: "Protected online payments via Razorpay (UPI, Credit/Debit, Netbanking)."
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[#fdfbf7] transition-colors"
            >
              <div className="p-3 bg-amber-100/60 rounded-xl shrink-0">
                {prop.icon}
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-zinc-900">
                  {prop.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
