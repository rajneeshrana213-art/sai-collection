"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

interface CollectionSectionProps {
  title: string;
  viewMoreHref: string;
  products: Product[];
  layout?: "default" | "new-arrivals";
}

const CollectionCarouselSection: React.FC<CollectionSectionProps> = ({
  title,
  viewMoreHref,
  products,
  layout = "default",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isWishlisted } = useCart();
  const isNewArrivalsLayout = layout === "new-arrivals";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const formatCurrency = (paise: number) => {
    return `MRP: ₹${(paise / 100).toLocaleString("en-IN")}`;
  };

  return (
    <div className={isNewArrivalsLayout ? "py-6 font-sans" : "py-8 font-sans"}>
      {isNewArrivalsLayout ? (
        <div className="text-center mb-5">
          <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-[0.18em] text-zinc-800 uppercase">
            {title}
          </h2>
          <Link
            href={viewMoreHref}
            className="inline-block mt-1 text-[11px] sm:text-xs font-medium uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors underline underline-offset-4"
          >
            View More
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200">
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-zinc-900 uppercase">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href={viewMoreHref}
              className="text-xs font-bold uppercase tracking-widest text-zinc-800 hover:text-amber-800 transition-colors underline underline-offset-4"
            >
              VIEW MORE →
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-none border border-zinc-300 hover:bg-zinc-100 text-zinc-800 transition-colors"
                title="Scroll Left"
              >
                ‹
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-none border border-zinc-300 hover:bg-zinc-100 text-zinc-800 transition-colors"
                title="Scroll Right"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Product Carousel */}
      <div className={isNewArrivalsLayout ? "relative" : ""}>
        <div
          ref={scrollRef}
          className={
            isNewArrivalsLayout
              ? "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
              : "flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          }
        >
          {products.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
            const discountPercent = hasDiscount
              ? Math.round(((product.originalPrice! - product.basePrice) / product.originalPrice!) * 100)
              : 0;
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className={
                  isNewArrivalsLayout
                    ? "group shrink-0 w-64 sm:w-72 lg:w-80 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300"
                    : "group shrink-0 w-64 sm:w-72 bg-white border border-zinc-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
                }
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
                  <Link href={`/products/${product.slug}`}>
                    {/* Primary Image with Hover Zoom */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className={
                        isNewArrivalsLayout
                          ? "w-full h-full object-cover object-center"
                          : "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      }
                    />
                    {!isNewArrivalsLayout && product.images[1] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.images[1]?.url}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                  </Link>

                  {/* Top Left Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {!isNewArrivalsLayout && hasDiscount && (
                      <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm">
                        SAVE {discountPercent}%
                      </span>
                    )}
                    {product.variants.length > 0 && product.variants.every((v) => v.stock === 0) && (
                      <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                        SOLD OUT
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  {!isNewArrivalsLayout && (
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-zinc-800 hover:text-red-600 transition-colors shadow-sm"
                      aria-label="Wishlist"
                    >
                      <svg
                        className={`w-4 h-4 ${wishlisted ? "fill-red-600 text-red-600" : "fill-none text-zinc-700"}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Product Info */}
                <div className={isNewArrivalsLayout ? "px-3 pt-3 pb-2 text-center space-y-2" : "p-4 space-y-2 flex-1 flex flex-col justify-between"}>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className={isNewArrivalsLayout ? "font-sans text-[16px] leading-[1.35] text-zinc-700 line-clamp-2" : "font-serif text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-amber-900 transition-colors uppercase tracking-wider"}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className={isNewArrivalsLayout ? "text-[16px] sm:text-[18px] font-extrabold text-zinc-800" : "flex items-center gap-2 text-xs font-semibold"}>
                    <span className="text-zinc-900">{formatCurrency(product.basePrice)}</span>
                    {hasDiscount && (
                      <span className={isNewArrivalsLayout ? "hidden" : "text-zinc-400 line-through font-normal text-[11px]"}>
                        ₹{(product.originalPrice! / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isNewArrivalsLayout && (
          <>
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/95 border border-zinc-200 items-center justify-center text-zinc-500 hover:text-zinc-900 hover:shadow-lg transition-all z-10"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <span className="text-4xl leading-none pb-2 pl-0.5">‹</span>
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/95 border border-zinc-200 items-center justify-center text-zinc-500 hover:text-zinc-900 hover:shadow-lg transition-all z-10"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <span className="text-4xl leading-none pb-2 pr-0.5">›</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 w-full mx-auto space-y-8">
      {/* 1. NEW ARRIVALS */}
      <CollectionCarouselSection
        title="NEW ARRIVALS"
        viewMoreHref="/products?category=new-arrivals"
        products={MOCK_PRODUCTS.slice(0, 6)}
        layout="new-arrivals"
      />

      {/* 2. TRENDING */}
      <CollectionCarouselSection
        title="TRENDING"
        viewMoreHref="/products?tag=trending"
        products={MOCK_PRODUCTS.slice(1, 7)}
        layout="new-arrivals"
      />

      {/* 3. SALE */}
      <CollectionCarouselSection
        title="SALE"
        viewMoreHref="/products?onSale=true"
        products={MOCK_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.basePrice)}
        layout="new-arrivals"
      />

      {/* 4. STRAIGHT SUITS */}
      <CollectionCarouselSection
        title="STRAIGHT SUITS"
        viewMoreHref="/products?category=straight-suits"
        products={MOCK_PRODUCTS.slice(0, 5)}
        layout="new-arrivals"
      />

      {/* 5. INDO WESTERN */}
      <CollectionCarouselSection
        title="INDO WESTERN"
        viewMoreHref="/products?category=indo-westerns"
        products={MOCK_PRODUCTS.slice(2, 7)}
        layout="new-arrivals"
      />

      {/* 6. ANARKALI SUITS */}
      <CollectionCarouselSection
        title="ANARKALI SUITS"
        viewMoreHref="/products?category=anarkali"
        products={MOCK_PRODUCTS.slice(1, 6)}
        layout="new-arrivals"
      />

      {/* 7. SHARARA SUITS */}
      <CollectionCarouselSection
        title="SHARARA SUITS"
        viewMoreHref="/products?category=sharara-suits"
        products={MOCK_PRODUCTS.slice(0, 5)}
        layout="new-arrivals"
      />

      {/* 8. 3XL SIZE */}
      <CollectionCarouselSection
        title="3XL SIZE"
        viewMoreHref="/products?category=3xl"
        products={MOCK_PRODUCTS.slice(3, 7)}
        layout="new-arrivals"
      />
    </section>
  );
};

