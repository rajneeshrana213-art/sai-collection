"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { MOCK_PRODUCTS, CATEGORIES, Product, Category } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DraftVariant {
  id: string;
  size: string;
  color: string;
  stock: string;
  price: string; // empty = same as base price
}

interface DraftImage {
  id: string;
  url: string; // data URL from FileReader
  altText: string;
}

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const BADGE_OPTIONS = ["", "NEW", "BEST SELLER", "SALE", "TRENDING"] as const;
type BadgeOption = (typeof BADGE_OPTIONS)[number];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatCurrency(paise: number) {
  return `â‚¹${(paise / 100).toLocaleString("en-IN")}`;
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AdminProductsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  // List state
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stock modal
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form â€” basic
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBadge, setNewBadge] = useState<BadgeOption>("");
  const [newCOD, setNewCOD] = useState(true);

  // Form â€” pricing
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");

  // Form â€” classification
  const [newCategoryId, setNewCategoryId] = useState(CATEGORIES[0].id);
  const [newSubCategoryId, setNewSubCategoryId] = useState("");

  // Form â€” material
  const [newFabric, setNewFabric] = useState("");
  const [newCraft, setNewCraft] = useState("");

  // Form â€” images
  const [draftImages, setDraftImages] = useState<DraftImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form â€” variants
  const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([
    { id: "v-s", size: "S", color: "", stock: "10", price: "" },
    { id: "v-m", size: "M", color: "", stock: "10", price: "" },
    { id: "v-l", size: "L", color: "", stock: "10", price: "" },
  ]);

  // Derived â€” subcategories from selected category
  const selectedCategory = CATEGORIES.find((c) => c.id === newCategoryId) ?? CATEGORIES[0];
  const subCategories: Category[] = selectedCategory.subCategories ?? [];

  // Filtered + paginated products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.categorySlug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Image upload helpers
  const handleImageFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setDraftImages((prev) => [
          ...prev,
          { id: `img-${Date.now()}-${Math.random()}`, url, altText: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleImageFiles(e.dataTransfer.files);
    },
    [handleImageFiles]
  );

  const removeImage = (id: string) =>
    setDraftImages((prev) => prev.filter((img) => img.id !== id));

  // Variant helpers
  const addVariant = () => {
    setDraftVariants((prev) => [
      ...prev,
      { id: `v-${Date.now()}`, size: "S", color: "", stock: "0", price: "" },
    ]);
  };

  const updateVariant = (id: string, field: keyof DraftVariant, value: string) => {
    setDraftVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) =>
    setDraftVariants((prev) => prev.filter((v) => v.id !== id));

  // Reset + open drawer
  const resetForm = () => {
    setNewTitle(""); setNewDescription(""); setNewBadge(""); setNewCOD(true);
    setNewPrice(""); setNewOriginalPrice("");
    setNewCategoryId(CATEGORIES[0].id); setNewSubCategoryId("");
    setNewFabric(""); setNewCraft("");
    setDraftImages([]);
    setDraftVariants([
      { id: "v-s", size: "S", color: "", stock: "10", price: "" },
      { id: "v-m", size: "M", color: "", stock: "10", price: "" },
      { id: "v-l", size: "L", color: "", stock: "10", price: "" },
    ]);
  };

  const openDrawer = () => { resetForm(); setIsDrawerOpen(true); };
  const closeDrawer = () => setIsDrawerOpen(false);

  // Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const basePricePaise = Math.round(parseFloat(newPrice || "0") * 100);
    const originalPricePaise = newOriginalPrice
      ? Math.round(parseFloat(newOriginalPrice) * 100)
      : undefined;
    const subCat = subCategories.find((s) => s.id === newSubCategoryId);
    const ts = crypto.randomUUID();

    const newProd: Product = {
      id: `prod-${ts}`,
      name: newTitle,
      slug: slugify(newTitle),
      description: newDescription || `Handcrafted ${newTitle} from Panipat.`,
      category: selectedCategory.name,
      categorySlug: selectedCategory.slug,
      subCategory: subCat?.name,
      subCategorySlug: subCat?.slug,
      basePrice: basePricePaise,
      originalPrice: originalPricePaise,
      badge: (newBadge as Product["badge"]) || undefined,
      rating: 5.0,
      reviewsCount: 0,
      fabric: newFabric || undefined,
      craft: newCraft || undefined,
      isAvailableForCOD: newCOD,
      images:
        draftImages.length > 0
          ? draftImages.map((img) => ({ id: img.id, url: img.url, altText: img.altText }))
          : [
              {
                id: `img-default-${ts}`,
                url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
                altText: newTitle,
              },
            ],
      variants: draftVariants
        .filter((v) => v.size)
        .map((v, i) => ({
          id: `v-${ts}-${i}`,
          size: v.size,
          color: v.color || "Default",
          sku: `SAI-${slugify(newTitle).toUpperCase().slice(0, 6)}-${v.size}-${ts}`,
          price: v.price ? Math.round(parseFloat(v.price) * 100) : basePricePaise,
          stock: parseInt(v.stock || "0", 10),
        })),
    };

    setProducts([newProd, ...products]);
    closeDrawer();
  };

  // Stock modal
  const handleStockUpdate = (variantId: string, delta: number) => {
    if (!selectedProductForStock) return;
    const updatedVariants = selectedProductForStock.variants.map((v) =>
      v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v
    );
    const updatedProd = { ...selectedProductForStock, variants: updatedVariants };
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    setSelectedProductForStock(updatedProd);
  };

  // Theme helpers
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const bgInput = isLight
    ? "bg-white border border-zinc-300 text-zinc-900 focus:border-[#9b1c31]"
    : "bg-zinc-950 border border-zinc-700 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-500" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-600 font-semibold" : "bg-zinc-950 text-zinc-400 font-semibold";
  const tableRowHover = isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/40 transition-colors";
  const modalBg = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-white border-zinc-800";
  const drawerBg = isLight ? "bg-white" : "bg-zinc-900";
  const divider = isLight ? "border-zinc-200" : "border-zinc-800";
  const sectionColor = isLight ? "text-[#9b1c31]" : "text-amber-400";

  return (
    <div className="space-y-6 text-xs">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>
            Products Catalog &amp; Inventory
          </h1>
          <p className={`${textSub} mt-0.5`}>
            Manage Panipat suit designs, SKU variants, prices, and stock levels.
          </p>
        </div>
        <button
          id="btn-add-product"
          onClick={openDrawer}
          className="bg-[#9b1c31] hover:bg-[#b5223c] active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Filter & Search */}
      <div className={`${bgCard} p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 items-center justify-between`}>
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or categoryâ€¦"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none ${bgInput}`}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className={`${textSub} font-medium whitespace-nowrap`}>Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`rounded-xl px-3 py-2 text-xs focus:outline-none ${bgInput}`}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${tableHeadBg} uppercase text-[10px] tracking-wider`}>
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category / Sub</th>
                <th className="p-4">Price</th>
                <th className="p-4">Variants / Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-zinc-100 text-zinc-700" : "divide-zinc-800 text-zinc-300"}`}>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`p-10 text-center ${textSub}`}>
                    No products found. Try adjusting filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
                  const isLowStock = totalStock < 10;
                  return (
                    <tr key={prod.id} className={tableRowHover}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`relative w-12 h-14 flex-shrink-0 rounded-lg overflow-hidden border ${isLight ? "border-zinc-200 bg-zinc-100" : "border-zinc-800 bg-zinc-950"}`}>
                            <Image
                              src={prod.images[0]?.url}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className={`font-serif font-bold text-sm line-clamp-1 max-w-[180px] ${textTitle}`}>
                              {prod.name}
                            </p>
                            {prod.badge && (
                              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                                prod.badge === "NEW" ? "bg-emerald-100 text-emerald-800" :
                                prod.badge === "BEST SELLER" ? "bg-amber-100 text-amber-800" :
                                prod.badge === "SALE" ? "bg-red-100 text-red-800" :
                                "bg-purple-100 text-purple-800"
                              }`}>
                                {prod.badge}
                              </span>
                            )}
                            <p className={`text-[10px] font-mono mt-0.5 ${textSub}`}>
                              Fabric: {prod.fabric ?? "â€”"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className={`font-medium ${textTitle}`}>{prod.category}</p>
                        {prod.subCategory && (
                          <p className={`text-[10px] ${textSub}`}>{prod.subCategory}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className={`font-bold ${textTitle}`}>{formatCurrency(prod.basePrice)}</p>
                        {prod.originalPrice && (
                          <p className={`text-[10px] line-through ${textSub}`}>{formatCurrency(prod.originalPrice)}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          isLowStock
                            ? isLight ? "bg-red-100 text-red-800 border border-red-200" : "bg-red-950 text-red-400 border border-red-800"
                            : isLight ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        }`}>
                          {totalStock} in stock
                        </span>
                        <p className={`text-[10px] ${textSub} mt-0.5`}>
                          {prod.variants.map((v) => v.size).join(" Â· ")}
                        </p>
                      </td>
                      <td className="p-4">
                        {prod.isAvailableForCOD ? (
                          <span className="text-emerald-600 font-bold text-[10px] block">âœ“ COD Active</span>
                        ) : (
                          <span className={`font-bold text-[10px] block ${textSub}`}>Prepaid Only</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedProductForStock(prod)}
                          className={`font-bold px-3 py-1.5 rounded-lg border transition-colors text-[10px] ${
                            isLight
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          Edit Stock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / itemsPerPage) || 1}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        darkTheme={!isLight}
      />

      {/* Stock Level Modal */}
      {selectedProductForStock && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${divider}`}>
              <h3 className="font-serif text-lg font-bold">Edit Variant Stock Levels</h3>
              <button onClick={() => setSelectedProductForStock(null)} className="font-bold opacity-60 hover:opacity-100">âœ•</button>
            </div>
            <p className={`text-xs ${textSub}`}>
              Adjusting stock for <strong>{selectedProductForStock.name}</strong>:
            </p>
            <div className="space-y-2">
              {selectedProductForStock.variants.map((v) => (
                <div key={v.id} className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800"}`}>
                  <div>
                    <strong className="block font-bold text-xs">
                      Size: {v.size}{v.color ? ` Â· ${v.color}` : ""}
                    </strong>
                    <span className={`text-[10px] font-mono ${textSub}`}>SKU: {v.sku}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStockUpdate(v.id, -1)}
                      className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 font-bold hover:bg-red-500 hover:text-white transition-colors"
                    >âˆ’</button>
                    <span className="font-mono font-bold text-sm w-6 text-center">{v.stock}</span>
                    <button
                      onClick={() => handleStockUpdate(v.id, 1)}
                      className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedProductForStock(null)}
              className="w-full bg-[#9b1c31] text-white font-bold py-2.5 rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create Product Drawer â€” Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
      />

      {/* Create Product Drawer â€” Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl ${drawerBg} shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${divider} flex-shrink-0`}>
          <div>
            <h2 className={`font-serif text-xl font-bold ${textTitle}`}>Create New Product</h2>
            <p className={`text-xs ${textSub} mt-0.5`}>Complete all sections to add to the catalog.</p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-zinc-100 text-zinc-500" : "hover:bg-zinc-800 text-zinc-400"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <form id="form-create-product" onSubmit={handleAddProduct} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-8">

            {/* â”€â”€ Images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Product Images
              </h3>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-8 ${
                  isLight
                    ? "border-zinc-300 hover:border-[#9b1c31] hover:bg-rose-50/50 text-zinc-500"
                    : "border-zinc-700 hover:border-amber-500 hover:bg-amber-500/5 text-zinc-400"
                }`}
              >
                <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium">Click or drag &amp; drop images here</p>
                <p className="text-[10px] opacity-60">PNG, JPG, WEBP â€” multiple allowed</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
              </div>
              {draftImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {draftImages.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <div className={`relative w-20 h-24 rounded-xl overflow-hidden border ${isLight ? "border-zinc-200" : "border-zinc-700"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-[#9b1c31] text-white text-[8px] font-bold text-center py-0.5">
                            COVER
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        âœ•
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* â”€â”€ Basic Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="field-product-title"
                    type="text"
                    required
                    placeholder="e.g. Kashmiri Embroidered Velvet Anarkali Suit"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>Description</label>
                  <textarea
                    id="field-product-description"
                    rows={3}
                    placeholder="Describe fabric, design details, occasions it suitsâ€¦"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none resize-none ${bgInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${textTitle}`}>Badge / Label</label>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_OPTIONS.map((b) => (
                      <button
                        key={b || "none"}
                        type="button"
                        onClick={() => setNewBadge(b)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                          newBadge === b
                            ? "bg-[#9b1c31] text-white border-[#9b1c31]"
                            : isLight
                              ? "bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-zinc-400"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        {b || "None"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* â”€â”€ Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Pricing
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    Selling Price (â‚¹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${textSub}`}>â‚¹</span>
                    <input
                      id="field-product-price"
                      type="number"
                      required
                      min="1"
                      step="1"
                      placeholder="2499"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className={`w-full rounded-xl pl-7 pr-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    MRP / Original Price (â‚¹)
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${textSub}`}>â‚¹</span>
                    <input
                      id="field-product-mrp"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="3499"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      className={`w-full rounded-xl pl-7 pr-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between p-3 rounded-xl border bg-transparent" style={{ borderColor: isLight ? "#e4e4e7" : "#27272a" }}>
                <div>
                  <p className={`font-semibold text-xs ${textTitle}`}>Cash on Delivery (COD)</p>
                  <p className={`text-[10px] ${textSub}`}>Allow customers to pay cash at delivery</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewCOD(!newCOD)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newCOD ? "bg-emerald-500" : isLight ? "bg-zinc-300" : "bg-zinc-700"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${newCOD ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </section>

            {/* â”€â”€ Classification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Classification
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="field-product-category"
                    value={newCategoryId}
                    onChange={(e) => {
                      setNewCategoryId(e.target.value);
                      setNewSubCategoryId("");
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    Subcategory
                    {subCategories.length === 0 && (
                      <span className={`ml-1 text-[10px] font-normal ${textSub}`}>(none)</span>
                    )}
                  </label>
                  <select
                    id="field-product-subcategory"
                    value={newSubCategoryId}
                    onChange={(e) => setNewSubCategoryId(e.target.value)}
                    disabled={subCategories.length === 0}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none disabled:opacity-40 ${bgInput}`}
                  >
                    <option value="">â€” Select subcategory â€”</option>
                    {subCategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* â”€â”€ Material & Craft â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Material &amp; Craft
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>Fabric Type</label>
                  <input
                    id="field-product-fabric"
                    type="text"
                    placeholder="e.g. Pure Velvet / Cotton Blend"
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>Craftsmanship</label>
                  <input
                    id="field-product-craft"
                    type="text"
                    placeholder="e.g. Zari Handwork / Phulkari"
                    value={newCraft}
                    onChange={(e) => setNewCraft(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none ${bgInput}`}
                  />
                </div>
              </div>
            </section>

            {/* â”€â”€ Size Variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section>
              <div className={`flex items-center justify-between pb-2 border-b ${divider} mb-3`}>
                <h3 className={`text-xs uppercase tracking-wider font-bold ${sectionColor}`}>
                  Size Variants &amp; Stock
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                    isLight
                      ? "border-[#9b1c31] text-[#9b1c31] hover:bg-rose-50"
                      : "border-amber-500 text-amber-400 hover:bg-amber-500/10"
                  }`}
                >
                  + Add Row
                </button>
              </div>

              {/* Quick-add size chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className={`text-[10px] font-medium self-center ${textSub}`}>Quick add:</span>
                {DEFAULT_SIZES.map((sz) => {
                  const exists = draftVariants.some((v) => v.size === sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        if (exists) return;
                        setDraftVariants((prev) => [
                          ...prev,
                          { id: `v-${sz}-${Date.now()}`, size: sz, color: "", stock: "10", price: "" },
                        ]);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        exists
                          ? "bg-[#9b1c31] text-white border-[#9b1c31] cursor-default"
                          : isLight
                            ? "bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {draftVariants.length === 0 ? (
                <p className={`text-xs italic ${textSub} text-center py-4`}>
                  No variants added. Use quick-add chips or &quot;+ Add Row&quot;.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className={`grid grid-cols-[72px_1fr_72px_80px_32px] gap-2 px-1 text-[10px] font-bold uppercase tracking-wider ${textSub}`}>
                    <span>Size</span>
                    <span>Color</span>
                    <span>Stock</span>
                    <span>Price (â‚¹)</span>
                    <span />
                  </div>
                  {draftVariants.map((v) => (
                    <div
                      key={v.id}
                      className={`grid grid-cols-[72px_1fr_72px_80px_32px] gap-2 items-center p-2 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800"}`}
                    >
                      <select
                        value={v.size}
                        onChange={(e) => updateVariant(v.id, "size", e.target.value)}
                        className={`rounded-lg px-2 py-1.5 text-xs focus:outline-none ${bgInput}`}
                      >
                        {DEFAULT_SIZES.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                        <option value="FREE">Free</option>
                      </select>
                      <input
                        type="text"
                        placeholder="e.g. Maroon"
                        value={v.color}
                        onChange={(e) => updateVariant(v.id, "color", e.target.value)}
                        className={`rounded-lg px-2 py-1.5 text-xs focus:outline-none ${bgInput}`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => updateVariant(v.id, "stock", e.target.value)}
                        className={`rounded-lg px-2 py-1.5 text-xs focus:outline-none ${bgInput}`}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Base"
                        value={v.price}
                        onChange={(e) => updateVariant(v.id, "price", e.target.value)}
                        className={`rounded-lg px-2 py-1.5 text-xs focus:outline-none ${bgInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center font-bold text-xs"
                      >
                        âœ•
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="h-4" />
          </div>
        </form>

        {/* Drawer Footer */}
        <div className={`flex gap-3 px-6 py-4 border-t ${divider} flex-shrink-0`}>
          <button
            type="button"
            onClick={closeDrawer}
            className={`flex-1 font-bold py-3 rounded-xl transition-colors text-sm ${
              isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="form-create-product"
            className="flex-[2] bg-[#9b1c31] hover:bg-[#b5223c] active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm"
          >
            Save Product to Catalog
          </button>
        </div>
      </div>

    </div>
  );
}
