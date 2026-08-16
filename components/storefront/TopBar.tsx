"use client";

import React from "react";
import Link from "next/link";

interface TopBarProps {
  announcements: string[];
  currentSlideIndex: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  announcements,
  currentSlideIndex,
  onPrevSlide,
  onNextSlide,
}) => {
  return (
    <div className="bg-zinc-950 text-white text-xs py-2 px-4 select-none border-b border-zinc-800">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left spacer for layout balance on desktop */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* Center Announcement Carousel */}
        {announcements.length > 0 ? (
          <div className="flex items-center gap-4 justify-center min-w-0 md:justify-self-center md:w-full md:max-w-2xl">
            {announcements.length > 1 && (
              <button
                onClick={onPrevSlide}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Previous Announcement"
                aria-label="Previous Announcement"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="overflow-hidden relative h-5 flex-1 max-w-xl flex items-center justify-center">
              <span
                key={currentSlideIndex}
                className="animate-fade-in inline-block w-full text-center font-medium text-[11px] sm:text-xs text-amber-200 tracking-wide truncate"
              >
                {announcements[currentSlideIndex % announcements.length]}
              </span>
            </div>

            {announcements.length > 1 && (
              <button
                onClick={onNextSlide}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Next Announcement"
                aria-label="Next Announcement"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="hidden md:block" aria-hidden="true" />
        )}

        {/* Right Utility Quick Links */}
        <div className="hidden md:flex items-center gap-5 text-[11px] font-medium text-zinc-400 tracking-wide justify-self-end">
          <Link href="/track-order" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Track Order
          </Link>
          <span className="text-zinc-700">|</span>
          <Link href="/size-guide" className="hover:text-amber-300 transition-colors">
            Size Guide
          </Link>
          <span className="text-zinc-700">|</span>
          <Link href="/contact" className="hover:text-amber-300 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};
