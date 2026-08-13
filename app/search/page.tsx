"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { Pagination } from "@/components/common/Pagination";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const results = query.trim() === ""
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm mb-8 space-y-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
          Search Sai Collection Catalog
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Type 'Anarkali', 'Silk', 'Chanderi', 'Saree'..."
            className="flex-1 border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9b1c31]"
          />
          <button
            onClick={() => {}}
            className="bg-[#9b1c31] text-white font-bold px-6 py-3 rounded-xl text-xs"
          >
            Search
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Showing <strong>{results.length}</strong> results {query && <span>for &quot;{query}&quot;</span>}
        </p>
      </div>

      {/* Grid of Results */}
      {results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 space-y-2">
          <div className="text-4xl">🔍</div>
          <h3 className="font-serif text-lg font-bold text-zinc-800">No matching items found</h3>
          <p className="text-xs text-zinc-500">Try searching for &quot;Velvet&quot;, &quot;Kurta&quot;, or &quot;Phulkari&quot;.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
              const wishlisted = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                    <Link href={`/products/${product.slug}`}>
                      <img src={product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                    </Link>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-zinc-700 hover:text-red-500 shadow-md"
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

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-amber-800 font-medium block mb-1">{product.category}</span>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-base font-bold text-zinc-900 hover:text-[#9b1c31] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
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
                        onClick={() => addToCart(product, product.variants[0], 1)}
                        className="bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(results.length / itemsPerPage) || 1}
              totalItems={results.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              darkTheme={false}
            />
          </div>
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading search...</div>}>
        <SearchContent />
      </Suspense>
      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
