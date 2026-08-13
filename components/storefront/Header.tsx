"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useSiteTheme } from "@/context/SiteThemeContext";

export const Header: React.FC = () => {
  const { totalItems, wishlist, openCart, openSearch } = useCart();
  const { currentTheme } = useSiteTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useSyncExternalStore returns undefined on the server and the subscriber
  // value on the client — the React-recommended way to detect hydration
  // without calling setState inside an effect.
  const isClient = useSyncExternalStore(
    () => () => {},          // no-op subscribe (value never changes)
    () => true,              // client snapshot → true
    () => undefined,         // server snapshot → undefined
  );

  // Use default crimson on the server; switch to saved theme after hydration
  const primaryColor = isClient ? currentTheme.primaryColor : "#9b1c31";

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-900/10 transition-all">
      {/* Top Announcement Bar */}
      <div
        style={{ backgroundColor: primaryColor }}
        className="text-white text-xs py-2 px-4 text-center font-medium tracking-wide transition-colors duration-300 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="inline-block bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Festive Drop &apos;26
          </span>
          <span>
            ✨ FREE Express Shipping on orders over ₹999 | Use Code{" "}
            <strong className="underline underline-offset-2 decoration-amber-300">SAI10</strong> for 10% OFF
          </span>
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-zinc-700 hover:text-[#9b1c31] hover:bg-amber-100/50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/logo.png"
                alt="Sai Collection Logo"
                width={160}
                height={56}
                priority
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-zinc-800">
            <Link href="/products?category=new-arrivals" className="hover:text-[#9b1c31] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b1c31] hover:after:w-full after:transition-all">
              New Arrivals
            </Link>
            <Link href="/products?category=womens-ethnic-suits" className="hover:text-[#9b1c31] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b1c31] hover:after:w-full after:transition-all">
              Anarkalis & Suits
            </Link>
            <Link href="/products?category=designer-kurta-sets" className="hover:text-[#9b1c31] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b1c31] hover:after:w-full after:transition-all">
              Kurta Sets
            </Link>
            <Link href="/products?category=royal-sarees-lehengas" className="hover:text-[#9b1c31] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b1c31] hover:after:w-full after:transition-all">
              Sarees
            </Link>
            <Link href="/products?category=mens-kurta-pyjama" className="hover:text-[#9b1c31] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b1c31] hover:after:w-full after:transition-all">
              Men&apos;s Wear
            </Link>
            <Link href="/products?sale=true" className="text-[#9b1c31] font-bold hover:text-amber-800 transition-colors">
              Festive Sale 🔥
            </Link>
          </nav>

          {/* Right Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 text-zinc-700 hover:text-[#9b1c31] transition-colors rounded-full hover:bg-amber-100/50"
              aria-label="Search storefront"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-zinc-700 hover:text-[#9b1c31] transition-colors relative rounded-full hover:bg-amber-100/50 hidden sm:block"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#9b1c31] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/login"
              className="p-2 text-zinc-700 hover:text-[#9b1c31] transition-colors rounded-full hover:bg-amber-100/50 hidden sm:block"
              aria-label="User Account"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              style={{ backgroundColor: primaryColor }}
              className="text-white px-3.5 py-2 rounded-full flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
              aria-label="Open Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-bold bg-white text-zinc-900 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#fdfbf7] border-b border-amber-900/10 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
          <Link
            href="/products?category=new-arrivals"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-800 hover:text-[#9b1c31] border-b border-zinc-200/60"
          >
            🔥 New Arrivals
          </Link>
          <Link
            href="/products?category=womens-ethnic-suits"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-800 hover:text-[#9b1c31] border-b border-zinc-200/60"
          >
            Anarkalis & Suit Sets
          </Link>
          <Link
            href="/products?category=designer-kurta-sets"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-800 hover:text-[#9b1c31] border-b border-zinc-200/60"
          >
            Designer Kurta Sets
          </Link>
          <Link
            href="/products?category=royal-sarees-lehengas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-800 hover:text-[#9b1c31] border-b border-zinc-200/60"
          >
            Royal Sarees & Lehengas
          </Link>
          <Link
            href="/products?category=mens-kurta-pyjama"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-800 hover:text-[#9b1c31] border-b border-zinc-200/60"
          >
            Men&apos;s Kurta Pyjama
          </Link>
          <div className="pt-2 flex items-center justify-between text-sm">
            <Link
              href="/account/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-600 hover:text-[#9b1c31] flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Track Order
            </Link>
            <span className="text-zinc-400">|</span>
            <span className="text-amber-800 font-semibold">
              Instagram: @saicollectionpnp
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
