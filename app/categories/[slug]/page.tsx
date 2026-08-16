"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { Pagination } from "@/components/common/Pagination";
import { Product, Category } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        const catRes = await apiClient.get<Category>(`/api/v1/categories/${slug}`);
        if (catRes && catRes.id) {
          setCategory(catRes);
        }
        const prodRes = await apiClient.get<{ products: Product[] }>(`/api/v1/products?category=${slug}`);
        if (prodRes && Array.isArray(prodRes.products)) {
          setProducts(prodRes.products);
        } else if (Array.isArray(prodRes)) {
          setProducts(prodRes as unknown as Product[]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn("Category API fetch error", err);
        setProducts([]);
      }
    }
    fetchCategoryAndProducts();
  }, [slug]);

  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const categoryName = category?.name || slug.replace(/-/g, " ").toUpperCase();
  const categoryImage = category?.imageUrl || "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800";
  const categoryDesc = category?.description || `Explore our exclusive ${categoryName} collection direct from Panipat.`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-8 sm:p-12 mb-10 border border-amber-900/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${categoryImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span>Category</span>
              <span>/</span>
              <span className="font-semibold capitalize text-white">{categoryName}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">{categoryName}</h1>
            <p className="text-xs sm:text-sm text-zinc-300">{categoryDesc}</p>
            <span className="inline-block bg-[#9b1c31] text-white text-xs font-bold px-3 py-1 rounded-full">
              {products.length} Designs Available
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                  <Link href={`/products/${product.slug}`}>
                    <Image src={product.images[0]?.url} alt={product.name} fill className="w-full h-full object-cover" />
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

        {/* Category Page Pagination */}
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / itemsPerPage) || 1}
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            darkTheme={false}
          />
        </div>
      </main>

      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
