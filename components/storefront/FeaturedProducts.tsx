"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/api-client";

interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  badge?: string;
}

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

            const allMedia = [
              ...(Array.isArray(product.images) ? product.images : []),
              ...((product as unknown as { media?: Array<{ url: string; type?: string }> }).media || []),
            ].filter((m) => m && m.url && !m.url.includes("photo-1583391733975"));

            const checkIsVideoUrl = (item?: { url?: string; type?: string }) => {
              if (!item?.url) return false;
              if ((item as { type?: string }).type === "VIDEO") return true;
              const clean = item.url.toLowerCase().split("?")[0];
              return (
                clean.includes("data:video") ||
                clean.endsWith(".mp4") ||
                clean.endsWith(".webm") ||
                clean.endsWith(".mov") ||
                clean.endsWith(".m4v") ||
                clean.endsWith(".ogg") ||
                clean.includes("/video/upload/") ||
                clean.includes("commondatastorage.googleapis.com")
              );
            };

            const videoItem = allMedia.find((m) => checkIsVideoUrl(m));
            const primaryItem = videoItem || allMedia[0];
            const secondaryItem = allMedia.find((m) => m !== primaryItem) || allMedia[1];

            const primaryUrl = primaryItem?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
            const secondaryUrl = secondaryItem?.url;

            const isPrimaryVideo = checkIsVideoUrl(primaryItem);
            const isSecondaryVideo = checkIsVideoUrl(secondaryItem);

            return (
              <div
                key={product.id}
                className={
                  isNewArrivalsLayout
                    ? "group shrink-0 w-64 sm:w-72 lg:w-80 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300"
                    : "group shrink-0 w-64 sm:w-72 bg-white border border-zinc-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
                }
              >
                {/* Product Image / Video & Badges */}
                <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {/* Primary Media (Video or Image) */}
                    {isPrimaryVideo ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.muted = true;
                            el.play().catch(() => {});
                          }
                        }}
                        src={primaryUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label={product.name}
                        className={
                          isNewArrivalsLayout
                            ? "w-full h-full object-cover object-center"
                            : "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        }
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={primaryUrl}
                        alt={product.name}
                        className={
                          isNewArrivalsLayout
                            ? "w-full h-full object-cover object-center"
                            : "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        }
                      />
                    )}

                    {/* Secondary Media on Hover */}
                    {!isNewArrivalsLayout && secondaryUrl && (
                      isSecondaryVideo ? (
                        <video
                          src={secondaryUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          aria-label={`${product.name} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={secondaryUrl}
                          alt={`${product.name} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )
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
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 ${wishlisted ? "bg-rose-500 text-white" : "bg-white/80 text-zinc-700 hover:bg-white"
                        }`}
                      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <svg className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Product Title & Details */}
                <div className="p-3 text-center space-y-1">
                  <h3 className="font-sans font-medium text-xs sm:text-sm text-zinc-900 truncate uppercase tracking-wider">
                    <Link href={`/products/${product.slug}`} className="hover:text-amber-800 transition-colors">
                      {product.name}
                    </Link>
                  </h3>

                  <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                    <span className="text-zinc-900 font-bold">{formatCurrency(product.basePrice)}</span>
                    {hasDiscount && (
                      <span className="text-zinc-400 line-through text-[11px] font-normal">
                        ₹{(product.originalPrice! / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Carousel Navigation Arrows */}
        {isNewArrivalsLayout && products.length > 4 && (
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiClient.get<{ products: Product[] }>("/api/v1/products?limit=24"),
          apiClient.get<{ categories: StoreCategory[] }>("/api/v1/categories"),
        ]);

        if (prodRes && Array.isArray(prodRes.products)) {
          setProducts(prodRes.products);
        } else if (Array.isArray(prodRes)) {
          setProducts(prodRes as unknown as Product[]);
        }

        if (catRes && Array.isArray(catRes.categories)) {
          setCategories(catRes.categories);
        } else if (Array.isArray(catRes)) {
          setCategories(catRes as unknown as StoreCategory[]);
        }
      } catch (err) {
        console.warn("Featured products API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const onSaleProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.basePrice);

  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 w-full mx-auto space-y-12">
        {["NEW ARRIVALS", "TRENDING", "SALE"].map((title) => (
          <div key={title} className="py-6 font-sans">
            <div className="text-center mb-5">
              <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-[0.18em] text-zinc-300 animate-pulse uppercase">
                {title}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-3/4 bg-zinc-200/80 rounded-xl"></div>
                  <div className="h-4 bg-zinc-200/80 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-zinc-200/80 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 w-full mx-auto space-y-8">
      {/* 1. NEW ARRIVALS */}
      <CollectionCarouselSection
        title="NEW ARRIVALS"
        viewMoreHref="/products?category=new-arrivals"
        products={products.slice(0, 6)}
        layout="new-arrivals"
      />

      {/* 2. TRENDING */}
      <CollectionCarouselSection
        title="TRENDING"
        viewMoreHref="/products?tag=trending"
        products={products.slice(1, 7)}
        layout="new-arrivals"
      />

      {/* 3. SALE */}
      <CollectionCarouselSection
        title="SALE"
        viewMoreHref="/products?onSale=true"
        products={onSaleProducts.length > 0 ? onSaleProducts : products.slice(0, 6)}
        layout="new-arrivals"
      />

      {/* Dynamic Store Categories Sections fetched from database */}
      {categories
        .filter((cat) => cat.slug !== "new-arrivals")
        .map((cat, idx) => {
          const categoryProducts = products.filter(
            (p) =>
              p.categorySlug === cat.slug ||
              (typeof p.category === "string" && p.category.toLowerCase() === cat.name.toLowerCase()) ||
              p.subCategorySlug === cat.slug
          );
          // If no specific products assigned to this category yet, fallback to balanced product slice
          const displayProducts =
            categoryProducts.length > 0
              ? categoryProducts
              : products.slice(idx % 4, (idx % 4) + 6);

          return (
            <CollectionCarouselSection
              key={cat.id || cat.slug}
              title={cat.name.toUpperCase()}
              viewMoreHref={`/products?category=${cat.slug}`}
              products={displayProducts}
              layout="new-arrivals"
            />
          );
        })}
    </section>
  );
};
