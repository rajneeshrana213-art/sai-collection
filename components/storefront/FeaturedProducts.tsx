"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

export const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ALL" | "BEST SELLER" | "NEW" | "SALE">("ALL");
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});

  const filteredProducts = activeTab === "ALL" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter((p) => p.badge === activeTab);

  const formatCurrency = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const chosenSize = selectedSizes[product.id];
    const selectedVariant = product.variants.find((v) => v.size === chosenSize) || product.variants[0];
    addToCart(product, selectedVariant, 1);
  };

  return (
    <section className="py-16 bg-[#f7f3eb]/60 border-y border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">Handcrafted Excellence</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1">
              Featured Collections
            </h2>
          </div>

          {/* Tab Filters */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {[
              { id: "ALL", label: "✨ All Collections" },
              { id: "BEST SELLER", label: "🔥 Best Sellers" },
              { id: "NEW", label: "🌸 New Arrivals" },
              { id: "SALE", label: "🏷️ Festive Sale" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "ALL" | "BEST SELLER" | "NEW" | "SALE")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#9b1c31] text-white shadow-md"
                    : "bg-white/80 hover:bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
            const discountPercent = hasDiscount
              ? Math.round(((product.originalPrice! - product.basePrice) / product.originalPrice!) * 100)
              : 0;

            const wishlisted = isWishlisted(product.id);
            const currentSize = selectedSizes[product.id] || product.variants[0]?.size || "M";

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Hover Swap */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                  <Link href={`/products/${product.slug}`}>
                    {/* Primary Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Secondary Image Preview on Hover */}
                    {product.images[1] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.images[1]?.url}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                  </Link>

                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.badge && (
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-white shadow-md ${
                        product.badge === "BEST SELLER" ? "bg-[#9b1c31]" :
                        product.badge === "NEW" ? "bg-amber-600" :
                        product.badge === "SALE" ? "bg-red-600" : "bg-zinc-900"
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Top Right Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-zinc-700 hover:text-red-500 transition-all shadow-md active:scale-90"
                    aria-label="Add to wishlist"
                  >
                    <svg
                      className={`w-5 h-5 transition-colors ${
                        wishlisted ? "fill-red-500 text-red-500" : "fill-none text-zinc-700"
                      }`}
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

                  {/* COD Tag */}
                  {product.isAvailableForCOD && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-medium">
                      ✓ COD Available
                    </div>
                  )}
                </div>

                {/* Product Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Craft */}
                    <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
                      <span>{product.category}</span>
                      {product.craft && <span className="text-zinc-500 font-normal">[{product.craft}]</span>}
                    </div>

                    {/* Product Name */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-zinc-900 hover:text-[#9b1c31] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-600">
                      <div className="flex text-amber-400">
                        {"★".repeat(Math.floor(product.rating))}
                      </div>
                      <span className="font-bold text-zinc-800">{product.rating}</span>
                      <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
                    </div>

                    {/* Size Selector Pills */}
                    {product.variants.length > 1 && (
                      <div className="mt-3">
                        <span className="text-[11px] text-zinc-500 block mb-1 font-medium">Select Size:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => handleSizeSelect(product.id, v.size || "")}
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-all ${
                                currentSize === v.size
                                  ? "bg-[#9b1c31] text-white border-[#9b1c31]"
                                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-amber-700"
                              }`}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Price & Add to Cart Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-zinc-900">
                          {formatCurrency(product.basePrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-zinc-400 line-through font-normal">
                            {formatCurrency(product.originalPrice!)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Inclusive of all taxes</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
