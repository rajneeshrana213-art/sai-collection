"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { Pagination } from "@/components/common/Pagination";
import { MOCK_PRODUCTS, CATEGORIES, Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  // Filter Logic
  let filtered = MOCK_PRODUCTS.filter((product) => {
    // Category Filter
    if (selectedCategory !== "ALL" && selectedCategory !== "new-arrivals") {
      if (product.categorySlug !== selectedCategory) return false;
    }

    // Size Filter
    if (selectedSize !== "ALL") {
      const hasSize = product.variants.some((v) => v.size === selectedSize);
      if (!hasSize) return false;
    }

    // Price Filter
    if (priceRange === "UNDER_2000") {
      if (product.basePrice >= 200000) return false;
    } else if (priceRange === "2000_3500") {
      if (product.basePrice < 200000 || product.basePrice > 350000) return false;
    } else if (priceRange === "ABOVE_3500") {
      if (product.basePrice <= 350000) return false;
    }

    return true;
  });

  // Sort Logic
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "PRICE_LOW") return a.basePrice - b.basePrice;
    if (sortBy === "PRICE_HIGH") return b.basePrice - a.basePrice;
    if (sortBy === "RATING") return b.rating - a.rating;
    return 0; // Default NEWEST
  });

  const handleAddToCart = (product: Product) => {
    const chosenSize = selectedSizes[product.id];
    const selectedVariant = product.variants.find((v) => v.size === chosenSize) || product.variants[0];
    addToCart(product, selectedVariant, 1);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Breadcrumb & Header Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <Link href="/" className="hover:text-[#9b1c31]">Home</Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">Store Catalog</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900">
          Handcrafted Ethnic Collection
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-2xl">
          Browse authentic Panipat Anarkali suits, Chanderi silk kurtas, designer sarees, and Phulkari dupattas. Direct from workshops with Cash on Delivery available.
        </p>
      </div>

      {/* Top Filter Bar for Desktop & Mobile Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-amber-900/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden bg-white border border-zinc-300 text-zinc-800 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>⚙️ Filters</span>
            {selectedCategory !== "ALL" && <span className="w-2 h-2 rounded-full bg-[#9b1c31]" />}
          </button>
          <span className="text-xs text-zinc-500 font-medium">
            Showing <strong>{filtered.length}</strong> products
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#9b1c31]"
          >
            <option value="NEWEST">Newest Arrivals</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RATING">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters (Desktop + Responsive Drawer) */}
        <aside className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"} space-y-6 bg-white p-6 rounded-2xl border border-amber-900/10 h-fit sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar`}>
          
          {/* Category Filter */}
          <div>
            <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "ALL"
                    ? "bg-[#9b1c31] text-white font-bold"
                    : "text-zinc-700 hover:bg-amber-50"
                }`}
              >
                All Collections
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex justify-between items-center ${
                    selectedCategory === cat.slug
                      ? "bg-[#9b1c31] text-white font-bold"
                      : "text-zinc-700 hover:bg-amber-50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    selectedCategory === cat.slug ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {cat.itemCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Filter by Size
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["ALL", "S", "M", "L", "XL", "XXL"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1 rounded border font-semibold transition-all ${
                    selectedSize === sz
                      ? "bg-[#9b1c31] text-white border-[#9b1c31]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-amber-600"
                  }`}
                >
                  {sz === "ALL" ? "All Sizes" : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Price Range
            </h3>
            <div className="space-y-1 text-xs">
              {[
                { id: "ALL", label: "All Prices" },
                { id: "UNDER_2000", label: "Under ₹2,000" },
                { id: "2000_3500", label: "₹2,000 – ₹3,500" },
                { id: "ABOVE_3500", label: "Above ₹3,500" }
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer py-1 text-zinc-700 hover:text-[#9b1c31]">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="accent-[#9b1c31]"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory !== "ALL" || selectedSize !== "ALL" || priceRange !== "ALL") && (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedSize("ALL");
                setPriceRange("ALL");
              }}
              className="w-full text-xs font-bold text-red-600 hover:text-red-800 py-2 border border-red-200 rounded-lg bg-red-50 text-center block"
            >
              Reset All Filters
            </button>
          )}

        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 space-y-3">
              <div className="text-4xl">🛍️</div>
              <h3 className="font-serif text-xl font-bold text-zinc-800">No products match your selected filters</h3>
              <p className="text-xs text-zinc-500">Try adjusting your category or size filters to view available Panipat collections.</p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedSize("ALL");
                  setPriceRange("ALL");
                }}
                className="mt-2 bg-[#9b1c31] text-white text-xs font-bold px-6 py-2.5 rounded-full"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((product) => {
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
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                      <Link href={`/products/${product.slug}`}>
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.images[1] && (
                          <img
                            src={product.images[1]?.url}
                            alt={`${product.name} preview`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        )}
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {product.badge && (
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-white shadow-md ${
                            product.badge === "BEST SELLER" ? "bg-[#9b1c31]" : "bg-amber-600"
                          }`}>
                            {product.badge}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-zinc-700 hover:text-red-500 shadow-md transition-all active:scale-90"
                      >
                        <svg
                          className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-zinc-700"}`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">{product.category}</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            ★ {product.rating} <span className="text-zinc-400 font-normal">({product.reviewsCount})</span>
                          </span>
                        </div>

                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-serif font-bold text-sm text-zinc-900 line-clamp-1 group-hover:text-[#9b1c31] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Quick Size Selector */}
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-zinc-400 block mb-1">SELECT SIZE:</span>
                        <div className="flex gap-1 overflow-x-auto">
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: v.size }))}
                              className={`text-[10px] font-bold w-7 h-7 rounded-md border flex items-center justify-center transition-all ${
                                currentSize === v.size
                                  ? "bg-zinc-900 text-white border-zinc-900"
                                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                              }`}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-zinc-900">{formatCurrency(product.basePrice)}</span>
                          {hasDiscount && (
                            <span className="text-xs text-zinc-400 line-through block font-normal">
                              {formatCurrency(product.originalPrice!)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-sm transition-all active:scale-95"
                        >
                          Add to Cart
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Storefront PLP Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / itemsPerPage) || 1}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              darkTheme={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading Catalog...</div>}>
        <ProductsContent />
      </Suspense>
      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
