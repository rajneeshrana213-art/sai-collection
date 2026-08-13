"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSiteTheme } from "@/context/SiteThemeContext";

const ANNOUNCEMENTS = [
  "✨ Panipat's Premier Ethnic Wear — Handcrafted Suit Sets & Designer Cordsets",
  "📹 Please check size guide video before placing your order",
  "🚚 Cash On Delivery & Free Shipping Available Across India",
];

const CATEGORIES = [
  { label: "New Arrivals", slug: "new-arrivals", badge: "HOT" },
  { label: "Trending Cordsets", slug: "trending-cordsets", badge: "POPULAR" },
  { label: "S / M / L Section", slug: "s-m-l-section" },
  { label: "Dresses & Gowns", slug: "dresses" },
  { label: "Plus-Size Collection", slug: "plus-size" },
  { label: "Partywear Suits", slug: "partywear" },
  { label: "Denim Wear", slug: "denim-wear" },
  { label: "Bottom Wear & Salwars", slug: "bottom-wear" },
  { label: "Ethnic Wear", slug: "ethnic-wear" },
  { label: "Night Suits", slug: "night-suits" },
  { label: "Tops, Tunics & T-Shirts", slug: "tops-tunics" },
  { label: "Sale Articles", slug: "sale-articles", badge: "UP TO 40% OFF" },
];

export const Header: React.FC = () => {
  const { totalItems, wishlist, openCart, openSearch } = useCart();
  const { currentTheme } = useSiteTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-rotate announcement slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const isClient = useSyncExternalStore(
    () => () => { },
    () => true,
    () => undefined
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all font-sans">
      {/* 1. Top Announcement & Utility Bar */}
      <div className="bg-zinc-950 text-white text-xs py-2 px-4 select-none border-b border-zinc-800">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">

          {/* Left spacer keeps center column visually centered on desktop */}
          <div className="hidden md:block" aria-hidden="true" />

          {/* Announcement Carousel */}
          <div className="flex items-center gap-4 justify-center min-w-0 md:justify-self-center md:w-full md:max-w-2xl">
            <button
              onClick={handlePrevSlide}
              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Previous Announcement"
              aria-label="Previous Announcement"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="overflow-hidden relative h-5 flex-1 max-w-xl flex items-center justify-center">
              <span
                key={currentSlideIndex}
                className="animate-fade-in inline-block w-full text-center font-medium text-[11px] sm:text-xs text-amber-200 tracking-wide truncate"
              >
                {ANNOUNCEMENTS[currentSlideIndex]}
              </span>
            </div>

            <button
              onClick={handleNextSlide}
              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Next Announcement"
              aria-label="Next Announcement"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Quick Links (Desktop right side) */}
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

      {/* 2. Main Navigation Header */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">

          {/* Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-lg text-zinc-800 hover:text-black hover:bg-zinc-100 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={openSearch}
              className="p-2.5 text-zinc-800 hover:text-black transition-colors rounded-lg hover:bg-zinc-100"
              aria-label="Search products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <Link href="/" className="group flex flex-col items-center lg:items-start">
              <span className="font-great-vibes text-4xl sm:text-5xl font-normal tracking-wide text-zinc-950 capitalize group-hover:text-amber-900 transition-colors leading-tight pt-1">
                Sai Collection
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.3em] text-amber-800 uppercase -mt-0.5">
                Panipat Ethnic Wear
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-zinc-800 uppercase tracking-wider">
            <Link href="/" className="hover:text-amber-800 transition-colors py-2 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
            </Link>

            {/* Shop By Category Hover Dropdown */}
            <div className="relative group flex items-center h-full py-2">
              <Link
                href="/products"
                className="hover:text-amber-800 transition-colors flex items-center gap-1.5"
              >
                <span>Shop By Category</span>
                <svg
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-800 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Rich Dropdown Panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white border border-zinc-200/90 shadow-2xl rounded-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 mt-1 grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="col-span-2 pb-2 mb-2 border-b border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    Explore Collections
                  </span>
                  <Link
                    href="/products"
                    className="text-[11px] font-bold text-amber-800 hover:underline capitalize tracking-normal"
                  >
                    View All Categories →
                  </Link>
                </div>

                {CATEGORIES.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/products?category=${item.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:text-amber-900 hover:bg-amber-50/60 transition-all tracking-wide"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/products?category=new-arrivals" className="hover:text-amber-800 transition-colors py-2 relative group">
              New Arrivals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
            </Link>

            <Link href="/products" className="hover:text-amber-800 transition-colors py-2 relative group">
              All Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
            </Link>

            <Link
              href="/products?onSale=true"
              className="text-red-600 font-bold hover:text-red-700 transition-colors py-2 flex items-center gap-1 relative group"
            >
              <span>Sale</span>
              <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-extrabold tracking-tight animate-pulse">
                HOT
              </span>
            </Link>

            <Link href="/about" className="hover:text-amber-800 transition-colors py-2 relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* Desktop Search Button */}
            <button
              onClick={openSearch}
              className="hidden lg:flex p-2.5 text-zinc-700 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
              aria-label="Search"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Button */}
            <Link
              href="/account/wishlist"
              className="p-2.5 text-zinc-700 hover:text-black transition-colors relative rounded-full hover:bg-zinc-100"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / Login Link */}
            <Link
              href="/login"
              className="p-2.5 text-zinc-700 hover:text-black transition-colors rounded-full hover:bg-zinc-100 hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              aria-label="Account"
              title="Account Login"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden xl:inline">Login</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="bg-zinc-950 hover:bg-black text-white px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all transform active:scale-95 text-xs font-bold uppercase tracking-widest shadow-sm ml-1"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span>Cart ({totalItems})</span>
            </button>

          </div>

        </div>
      </div>

      {/* 3. Mobile Navigation Drawer Overlay & Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans z-10 animate-slide-right">

            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <div className="flex flex-col">
                  <span className="font-great-vibes text-3xl font-normal tracking-wide text-zinc-950 capitalize pt-1">
                    Sai Collection
                  </span>
                  <span className="text-[9px] font-sans font-semibold text-amber-800 uppercase tracking-wider">
                    Panipat Ethnic Wear
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-200 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Drawer Menu Links */}
              <div className="p-4 space-y-1 text-xs font-semibold uppercase tracking-wider text-zinc-800">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Home
                </Link>

                <Link
                  href="/products?category=new-arrivals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  New Arrivals
                </Link>

                {/* Category Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-left uppercase font-semibold"
                  >
                    <span>Shop By Category</span>
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform ${isMobileCategoryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMobileCategoryOpen && (
                    <div className="ml-3 pl-3 border-l border-zinc-200 my-1 space-y-1 text-zinc-600 font-normal">
                      {CATEGORIES.map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/products?category=${item.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 px-2 text-[11px] font-medium hover:text-amber-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  All Products
                </Link>

                <Link
                  href="/products?onSale=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-red-600 font-bold hover:bg-red-50 transition-colors"
                >
                  <span>Sale</span>
                  <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                    HOT
                  </span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
                >
                  Track Order
                </Link>

                <Link
                  href="/size-guide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
                >
                  Size Guide
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-zinc-950 text-white text-center w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                Login / Register
              </Link>
              <div className="text-[10px] text-center text-zinc-400 tracking-wide font-medium">
                📍 Panipat, Haryana • Call/WhatsApp Support
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};


