"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const product: Product | undefined = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"DESCRIPTION" | "SPECS" | "REVIEWS">("DESCRIPTION");

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.basePrice) / product.originalPrice!) * 100)
    : 0;

  const wishlisted = isWishlisted(product.id);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryResult("✓ Delivery available! Estimated delivery in 3-4 business days via Express Courier.");
    } else {
      setDeliveryResult("Please enter a valid 6-digit Indian Pincode.");
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-[#9b1c31]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#9b1c31]">Store</Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
        </div>

        {/* Top Detail Section: Image Gallery (Left) + Product Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 border border-amber-900/10 shadow-md">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-[#9b1c31] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/90 backdrop-blur-md text-zinc-700 hover:text-red-500 shadow-lg transition-transform active:scale-90"
              >
                <svg
                  className={`w-6 h-6 ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-zinc-700"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? "border-[#9b1c31] scale-105 shadow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying Options */}
          <div className="space-y-6">
            <div>
              <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block mb-1">
                {product.category} • {product.craft}
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400 text-sm">
                  {"★".repeat(Math.floor(product.rating))}
                </div>
                <span className="font-bold text-zinc-900 text-sm">{product.rating}</span>
                <span className="text-zinc-400 text-xs">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-baseline gap-4">
              <span className="font-serif text-3xl font-bold text-[#9b1c31]">
                {formatCurrency(selectedVariant ? selectedVariant.price : product.basePrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-zinc-400 line-through font-normal">
                  {formatCurrency(product.originalPrice!)}
                </span>
              )}
              <span className="text-xs text-emerald-800 font-bold ml-auto bg-emerald-100 px-2.5 py-1 rounded">
                Inclusive of all taxes
              </span>
            </div>

            {/* Variant Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900">Select Size:</span>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-[#9b1c31] font-bold underline hover:text-amber-800"
                >
                  📏 View Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedVariant.id === variant.id
                        ? "bg-[#9b1c31] text-white border-[#9b1c31] shadow-md"
                        : "bg-white text-zinc-800 border-zinc-300 hover:border-amber-700"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium pt-1">
                ✓ In Stock ({selectedVariant.stock} available in Panipat warehouse)
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-900 block">Quantity:</span>
              <div className="flex items-center border border-zinc-300 rounded-lg w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-zinc-800 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="flex-1 bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-4 rounded-full text-center flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-4 rounded-full text-center transition-all shadow-md active:scale-98"
              >
                ⚡ Buy Now (Express Checkout)
              </button>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
              <span className="text-xs font-bold text-zinc-900 block">Check Delivery Pincode:</span>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="flex-1 text-xs border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#9b1c31]"
                />
                <button type="submit" className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-lg">
                  Check
                </button>
              </form>
              {deliveryResult && <p className="text-xs text-zinc-700 font-medium pt-1">{deliveryResult}</p>}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓ COD Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓ 7-Day Easy Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mt-16 bg-white rounded-2xl border border-amber-900/10 p-6 sm:p-8">
          <div className="flex border-b border-zinc-200 gap-6 text-sm font-bold mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("DESCRIPTION")}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "DESCRIPTION" ? "border-[#9b1c31] text-[#9b1c31]" : "border-transparent text-zinc-500"
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab("SPECS")}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "SPECS" ? "border-[#9b1c31] text-[#9b1c31]" : "border-transparent text-zinc-500"
              }`}
            >
              Fabric &amp; Care Details
            </button>
            <button
              onClick={() => setActiveTab("REVIEWS")}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "REVIEWS" ? "border-[#9b1c31] text-[#9b1c31]" : "border-transparent text-zinc-500"
              }`}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          {activeTab === "DESCRIPTION" && (
            <div className="text-sm text-zinc-700 leading-relaxed font-light space-y-4">
              <p>{product.description}</p>
              <p>
                Crafted in Panipat, Haryana, this suit set combines centuries of weaving tradition with contemporary fashion aesthetics. Ideal for wedding celebrations, festive gatherings, and special occasions.
              </p>
            </div>
          )}

          {activeTab === "SPECS" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-700">
              <div className="p-3 bg-zinc-50 rounded-lg">
                <strong className="block text-zinc-900 font-bold mb-1">Fabric Composition:</strong>
                {product.fabric || "Pure Cotton & Chanderi Silk"}
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg">
                <strong className="block text-zinc-900 font-bold mb-1">Embroidery &amp; Craft:</strong>
                {product.craft || "Handcrafted Zari & Thread Work"}
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg">
                <strong className="block text-zinc-900 font-bold mb-1">Wash &amp; Care Instructions:</strong>
                Dry clean recommended for first wash. Gentle hand wash in cold water thereafter.
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg">
                <strong className="block text-zinc-900 font-bold mb-1">Origin:</strong>
                Panipat, Haryana, India
              </div>
            </div>
          )}

          {activeTab === "REVIEWS" && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-serif text-2xl font-bold text-zinc-900">{product.rating} / 5.0</span>
                  <p className="text-xs text-zinc-600">Based on {product.reviewsCount} verified customer reviews</p>
                </div>
                <div className="text-amber-400 text-lg">★★★★★</div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-900">Radhika M. (Verified Buyer)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs text-zinc-600 font-light">
                    &quot;The embroidery on this set is absolutely divine! The fabric is so soft and comfortable. Fast delivery from Panipat to Delhi.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold text-zinc-900 mb-6">Complete Your Festive Look</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-amber-900/10 p-3 hover:shadow-md transition-shadow group"
                >
                  <img src={rel.images[0]?.url} alt={rel.name} className="w-full aspect-[3/4] object-cover rounded-lg bg-zinc-100" />
                  <h4 className="font-serif text-sm font-bold text-zinc-900 mt-2 group-hover:text-[#9b1c31] transition-colors truncate">
                    {rel.name}
                  </h4>
                  <span className="text-xs font-bold text-[#9b1c31] block mt-1">{formatCurrency(rel.basePrice)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-zinc-900">Standard Size Guide (Inches)</h3>
              <button onClick={() => setIsSizeChartOpen(false)} className="text-zinc-400 hover:text-zinc-700 font-bold">✕</button>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-amber-50 text-amber-900">
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Bust</th>
                  <th className="p-2 border">Waist</th>
                  <th className="p-2 border">Hip</th>
                  <th className="p-2 border">Kurta Length</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                <tr><td className="p-2 border font-bold">S</td><td className="p-2 border">36&quot;</td><td className="p-2 border">32&quot;</td><td className="p-2 border">38&quot;</td><td className="p-2 border">46&quot;</td></tr>
                <tr><td className="p-2 border font-bold">M</td><td className="p-2 border">38&quot;</td><td className="p-2 border">34&quot;</td><td className="p-2 border">40&quot;</td><td className="p-2 border">46&quot;</td></tr>
                <tr><td className="p-2 border font-bold">L</td><td className="p-2 border">40&quot;</td><td className="p-2 border">36&quot;</td><td className="p-2 border">42&quot;</td><td className="p-2 border">47&quot;</td></tr>
                <tr><td className="p-2 border font-bold">XL</td><td className="p-2 border">42&quot;</td><td className="p-2 border">38&quot;</td><td className="p-2 border">44&quot;</td><td className="p-2 border">47&quot;</td></tr>
                <tr><td className="p-2 border font-bold">XXL</td><td className="p-2 border">44&quot;</td><td className="p-2 border">40&quot;</td><td className="p-2 border">46&quot;</td><td className="p-2 border">48&quot;</td></tr>
              </tbody>
            </table>
            <button onClick={() => setIsSizeChartOpen(false)} className="w-full bg-[#9b1c31] text-white text-xs font-bold py-2.5 rounded-lg">Close Size Guide</button>
          </div>
        </div>
      )}

      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
