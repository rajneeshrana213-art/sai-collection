"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isVisible: boolean;
}

export interface SubCategoryItem {
  id?: string;
  label: string;
  slug: string;
  badge?: string;
}

export interface CategoryItem {
  id?: string;
  label: string;
  slug: string;
  badge?: string;
  subCategories?: SubCategoryItem[];
}

interface NavbarProps {
  storeName: string;
  storeTagline: string;
  navMenuItems: NavMenuItem[];
  categoriesList: CategoryItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  storeName,
  storeTagline,
  navMenuItems,
  categoriesList,
}) => {
  const { totalItems, wishlist, openCart, openSearch } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number>(0);

  // Filter visible items from Site Settings and exclude duplicate Home link if present
  const visibleNavItems = navMenuItems.filter(
    (item) => item.isVisible && item.href !== "/" && item.label.toLowerCase() !== "home"
  );

  // Lock body & html scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Main Navigation Header Bar */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-3">

          {/* Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-1 lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-zinc-800 hover:text-black hover:bg-zinc-100 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={openSearch}
              className="p-2 text-zinc-800 hover:text-black transition-colors rounded-lg hover:bg-zinc-100"
              aria-label="Search products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex items-center justify-center lg:justify-start min-w-0 flex-1 lg:flex-initial">
            <Link href="/" className="group flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="font-great-vibes text-3xl sm:text-4xl lg:text-5xl font-normal tracking-normal text-zinc-950 capitalize group-hover:text-amber-900 transition-colors leading-none pt-1 whitespace-nowrap">
                {storeName || "Sai Collection"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#b45309] uppercase mt-1 whitespace-nowrap">
                {storeTagline || "PANIPAT ETHNIC WEAR"}
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold text-zinc-900 uppercase tracking-widest">
            {/* Always visible HOME Link */}
            <Link href="/" className="hover:text-amber-800 transition-colors py-2 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
            </Link>

            {/* SHOP BY CATEGORY Hover Dropdown */}
            <div className="relative group py-2">
              <Link
                href="/products"
                className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
              >
                <span>Shop By Category</span>
                <svg
                  className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-800 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Rich Dropdown Panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] max-h-[80vh] overflow-y-auto bg-white border border-zinc-200/90 shadow-2xl rounded-2xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 mt-1 space-y-4">
                <div className="pb-2.5 border-b border-zinc-100 flex items-center justify-between px-1">
                  <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Explore Collections
                  </span>
                  <Link
                    href="/products"
                    className="text-[11px] font-bold text-amber-800 hover:underline capitalize tracking-normal"
                  >
                    View All Categories →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                  {categoriesList.map((item, idx) => {
                    const hasSubs = Array.isArray(item.subCategories) && item.subCategories.length > 0;

                    return (
                      <div key={idx} className="group/item relative rounded-xl transition-all">
                        <Link
                          href={`/products?category=${item.slug}`}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-800 hover:text-amber-900 hover:bg-amber-50/80 transition-all tracking-wide"
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {hasSubs && (
                              <span className="text-[10px] text-amber-700 font-extrabold transition-transform group-hover/item:translate-y-0.5">
                                ▾
                              </span>
                            )}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </Link>

                        {/* Sub-categories expand on hover directly under the item */}
                        {hasSubs && (
                          <div className="hidden group-hover/item:flex flex-wrap gap-1 px-3 pb-2.5 pt-0.5 animate-fade-in">
                            {item.subCategories!.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                href={`/products?category=${sub.slug}`}
                                className="text-[10px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-800 hover:text-white border border-amber-200/80 px-2 py-0.5 rounded-full transition-all shadow-2xs"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Nav Items from Site Settings or Default fallback menu items */}
            {visibleNavItems.length > 0 ? (
              visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="hover:text-amber-800 transition-colors py-2 relative group flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-50 text-[#e52e2e] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-red-200/60">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
                </Link>
              ))
            ) : (
              <>
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
                  className="text-[#e52e2e] font-bold hover:text-red-700 transition-colors py-2 flex items-center gap-1.5 relative group"
                >
                  <span>Sale</span>
                  <span className="bg-red-50 text-[#e52e2e] text-[10px] px-1.5 py-0.5 rounded font-extrabold tracking-tight border border-red-200/60">
                    HOT
                  </span>
                </Link>

                <Link href="/about" className="hover:text-amber-800 transition-colors py-2 relative group">
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all duration-200 group-hover:w-full" />
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">

            {/* Search Icon */}
            <button
              onClick={openSearch}
              className="hidden sm:flex p-2 text-zinc-800 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
              aria-label="Search"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Heart Icon */}
            <Link
              href="/account/wishlist"
              className="p-2 text-zinc-800 hover:text-black transition-colors relative rounded-full hover:bg-zinc-100"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / Login Link */}
            <Link
              href={isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : "/account") : "/login"}
              className="hidden sm:flex items-center gap-1.5 p-2 text-zinc-800 hover:text-black transition-colors rounded-full hover:bg-zinc-100 text-xs font-semibold uppercase tracking-wider"
              aria-label={isAuthenticated ? "My Account" : "Account Login"}
              title={isAuthenticated ? "My Account" : "Account Login"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden xl:inline">{isAuthenticated ? "My Account" : "Login"}</span>
            </Link>

            {/* Cart Pill Button */}
            <button
              onClick={openCart}
              className="bg-black hover:bg-zinc-900 text-white px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 transition-all transform active:scale-95 text-xs font-bold uppercase tracking-wider shadow-sm"
              aria-label="Open Shopping Cart"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart ({totalItems})</span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay & Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in touch-none"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMobileCategoryOpen(false);
            }}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 h-screen h-[100dvh] w-[85vw] max-w-xs bg-white shadow-2xl flex flex-col font-sans z-50 animate-slide-right overflow-hidden">

            {/* Drawer Header (Fixed at Top) */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex flex-col">
                <span className="font-great-vibes text-3xl font-normal tracking-wide text-zinc-950 capitalize pt-1">
                  {storeName || "Sai Collection"}
                </span>
                <span className="text-[9px] font-sans font-semibold text-[#b45309] uppercase tracking-wider">
                  {storeTagline || "PANIPAT ETHNIC WEAR"}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="p-2 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-200 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Drawer Menu Links (Scrollable Body) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1 text-xs font-semibold uppercase tracking-wider text-zinc-800">
              <Link
                href="/"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Home
              </Link>

              {/* Category Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-left uppercase font-semibold"
                >
                  <span>Shop By Category</span>
                  <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isMobileCategoryOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMobileCategoryOpen && (
                  <div className="ml-3 pl-3 border-l border-amber-200 my-1 space-y-1.5 text-zinc-600 font-normal">
                    {categoriesList.map((item, idx) => {
                      const hasSubs = Array.isArray(item.subCategories) && item.subCategories.length > 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <Link
                            href={`/products?category=${item.slug}`}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsMobileCategoryOpen(false);
                            }}
                            className="flex items-center justify-between py-1.5 px-2 text-xs font-bold text-zinc-800 hover:text-amber-900 transition-colors"
                          >
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                                {item.badge}
                              </span>
                            )}
                          </Link>

                          {hasSubs && (
                            <div className="ml-3 pl-2 border-l border-zinc-200 space-y-1">
                              {item.subCategories!.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={`/products?category=${sub.slug}`}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileCategoryOpen(false);
                                  }}
                                  className="block py-1 px-2 text-[11px] font-medium text-zinc-500 hover:text-amber-800 transition-colors"
                                >
                                  › {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {visibleNavItems.length > 0 ? (
                visibleNavItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileCategoryOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-50 text-[#e52e2e] text-[9px] px-1.5 py-0.5 rounded font-extrabold border border-red-200/60">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/products?category=new-arrivals"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileCategoryOpen(false);
                    }}
                    className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    New Arrivals
                  </Link>

                  <Link
                    href="/products"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileCategoryOpen(false);
                    }}
                    className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    All Products
                  </Link>

                  <Link
                    href="/products?onSale=true"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileCategoryOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-3 rounded-lg text-red-600 font-bold hover:bg-red-50 transition-colors"
                  >
                    <span>Sale</span>
                    <span className="bg-red-50 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-extrabold border border-red-200/60">
                      HOT
                    </span>
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileCategoryOpen(false);
                    }}
                    className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    About Us
                  </Link>
                </>
              )}

              <Link
                href="/track-order"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
              >
                Track Order
              </Link>

              <Link
                href="/size-guide"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
              >
                Size Guide
              </Link>

              <Link
                href="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="block px-3 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
              >
                Contact Us
              </Link>
            </div>

            {/* Drawer Footer Actions (Fixed at Bottom) */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 space-y-2 shrink-0">
              <Link
                href={isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : "/account") : "/login"}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileCategoryOpen(false);
                }}
                className="block bg-zinc-950 text-white text-center w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                {isAuthenticated ? "My Account" : "Login / Register"}
              </Link>
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    setIsMobileCategoryOpen(false);
                    await logout();
                  }}
                  className="block bg-rose-50 border border-rose-200 text-rose-700 text-center w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-rose-100 transition-colors"
                >
                  Sign Out / Logout
                </button>
              )}
              <div className="text-[10px] text-center text-zinc-400 tracking-wide font-medium">
                📍 Panipat, Haryana • Call/WhatsApp Support
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
