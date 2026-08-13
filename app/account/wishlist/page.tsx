"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const wishlistedProducts = MOCK_PRODUCTS.filter((p) => wishlist.includes(p.id));
  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Saved Wishlist ({wishlistedProducts.length})</h1>

        {/* Nav tabs */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold">
          <Link href="/account" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 space-y-3 max-w-md mx-auto">
            <div className="text-4xl">❤️</div>
            <h3 className="font-serif text-xl font-bold text-zinc-900">Your Wishlist is Empty</h3>
            <p className="text-xs text-zinc-500">Tap the heart icon on any product to save your favorite Anarkalis and suit sets here!</p>
            <Link href="/products" className="inline-block bg-[#9b1c31] text-white text-xs font-bold px-6 py-2.5 rounded-full">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm flex flex-col justify-between">
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                  <Link href={`/products/${product.slug}`}>
                    <img src={product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-red-500 shadow-md"
                  >
                    ❤️
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-amber-800 font-semibold block">{product.category}</span>
                    <h3 className="font-serif text-sm font-bold text-zinc-900 line-clamp-1">{product.name}</h3>
                    <span className="font-bold text-zinc-900 text-sm block mt-1">{formatCurrency(product.basePrice)}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0], 1)}
                    className="mt-3 w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold py-2.5 rounded-full"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
