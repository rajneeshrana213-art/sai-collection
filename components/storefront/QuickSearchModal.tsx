"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const QuickSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useCart();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const results = query.trim() === ""
    ? []
    : MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeSearch}
      />

      <div className="relative min-h-screen px-4 pt-16 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-amber-900/10 z-50 relative">
          
          {/* Search Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Anarkalis, Kurta Sets, Sarees, Dupattas..."
              className="w-full text-base sm:text-lg font-medium text-zinc-900 placeholder-zinc-400 border-none outline-none focus:ring-0"
              autoFocus
            />
            <button
              onClick={closeSearch}
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Suggestions Tags */}
          <div className="bg-amber-50/60 px-6 py-3 border-b border-amber-200/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-amber-900 font-bold uppercase tracking-wider text-[10px]">Popular Search:</span>
            {["Anarkali", "Chanderi", "Phulkari", "Velvet", "Saree", "Men's Kurta"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="bg-white hover:bg-[#9b1c31] hover:text-white text-zinc-700 border border-amber-900/10 px-2.5 py-1 rounded-full text-xs transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="max-h-96 overflow-y-auto p-6 space-y-3">
            {query.trim() === "" ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                Start typing to search across all Panipat handcrafted collections.
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 space-y-2">
                <div className="text-3xl">🔍</div>
                <p className="font-serif text-base font-bold text-zinc-800">No matching products found</p>
                <p className="text-xs">Try searching for &quot;Anarkali&quot;, &quot;Kurta&quot;, or &quot;Saree&quot;</p>
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 p-3 hover:bg-amber-50/60 rounded-xl transition-colors group border border-transparent hover:border-amber-200"
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-lg bg-zinc-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-800 uppercase font-semibold block">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-[#9b1c31] transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-600">
                      <span className="font-bold text-zinc-900">{formatCurrency(product.basePrice)}</span>
                      {product.originalPrice && (
                        <span className="line-through text-zinc-400 text-[11px]">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#9b1c31] opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </Link>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
