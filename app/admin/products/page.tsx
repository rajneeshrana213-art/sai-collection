"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Product, Category } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";

// --- Types --------------------------------------------------------------------

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

// ————————————————————————————————————————————————————————————————————————————————

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const BADGE_OPTIONS = ["", "NEW", "BEST SELLER", "SALE", "TRENDING"] as const;
type BadgeOption = (typeof BADGE_OPTIONS)[number];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatCurrency(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

// ————————————————————————————————————————————————————————————————————————————————

import { apiClient } from "@/lib/api-client";

export default function AdminProductsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  // List state
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form — classification
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newSubCategoryId, setNewSubCategoryId] = useState("");

  useEffect(() => {
    async function fetchAdminProducts() {
      try {
        const res = await apiClient.get<{ products: Product[] }>("/api/v1/admin/products");
        if (res && Array.isArray(res.products)) {
          setProducts(res.products);
        } else if (Array.isArray(res)) {
          setProducts(res as unknown as Product[]);
        }
      } catch (err) {
        console.warn("Admin products API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchAdminCategories() {
      try {
        const res = await apiClient.get<{ categories: Category[] }>("/api/v1/categories");
        if (res && Array.isArray(res.categories)) {
          setCategoriesList(res.categories);
          if (res.categories.length > 0) {
            setNewCategoryId(res.categories[0].id);
          }
        }
      } catch (err) {
        console.warn("Admin categories API fetch error", err);
      }
    }
    fetchAdminProducts();
    fetchAdminCategories();
  }, []);

  // Toast State
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToasts((prev) => {
      const id = `toast-${prev.length}-${message.slice(0, 5)}`;
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 4000);
      return [...prev, { id, type, message }];
    });
  }, []);

  // Stock modal
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  // Edit / Delete modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form — basic
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBadge, setNewBadge] = useState<BadgeOption>("");
  const [newCOD, setNewCOD] = useState(true);

  // Form — pricing
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");



  // Form — material
  const [newFabric, setNewFabric] = useState("");
  const [newCraft, setNewCraft] = useState("");

  // Form — images & video
  const [draftImages, setDraftImages] = useState<DraftImage[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setNewVideoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Form — variants
  const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([
    { id: "v-s", size: "S", color: "", stock: "10", price: "" },
    { id: "v-m", size: "M", color: "", stock: "10", price: "" },
    { id: "v-l", size: "L", color: "", stock: "10", price: "" },
  ]);

  // Derived — subcategories from selected category
  const selectedCategory = categoriesList.find((c) => c.id === newCategoryId) ?? categoriesList[0];
  const subCategories: Category[] = selectedCategory?.subCategories ?? [];

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
    setEditingProduct(null);
    setNewTitle(""); setNewDescription(""); setNewBadge(""); setNewCOD(true);
    setNewPrice(""); setNewOriginalPrice("");
    setNewCategoryId(categoriesList[0]?.id || ""); setNewSubCategoryId("");
    setNewFabric(""); setNewCraft("");
    setDraftImages([]);
    setNewVideoUrl("");
    setCustomImageUrl("");
    setDraftVariants([
      { id: "v-s", size: "S", color: "", stock: "10", price: "" },
      { id: "v-m", size: "M", color: "", stock: "10", price: "" },
      { id: "v-l", size: "L", color: "", stock: "10", price: "" },
    ]);
  };

  const openDrawer = () => { resetForm(); setIsDrawerOpen(true); };
  const closeDrawer = () => { setIsDrawerOpen(false); setEditingProduct(null); };

  const openEditDrawer = (prod: Product) => {
    setEditingProduct(prod);
    setNewTitle(prod.name);
    setNewDescription(prod.description || "");
    setNewBadge((prod.badge as BadgeOption) || "");
    setNewCOD(prod.isAvailableForCOD ?? true);
    setNewPrice((prod.basePrice / 100).toString());
    setNewOriginalPrice(prod.originalPrice ? (prod.originalPrice / 100).toString() : "");

    const catObj = categoriesList.find((c) => c.slug === prod.categorySlug || c.name === prod.category);
    if (catObj) {
      setNewCategoryId(catObj.id);
    }
    setNewSubCategoryId(prod.subCategorySlug || "");
    setNewFabric(prod.fabric || "");
    setNewCraft(prod.craft || "");

    const rawImages = (prod.images || []) as unknown as Array<{ url: string; type?: string }>;
    const foundVideo = (prod as unknown as { videoUrl?: string }).videoUrl ||
      rawImages.find((img) => img.type === "VIDEO")?.url || "";
    setNewVideoUrl(foundVideo);

    setDraftImages(
      (prod.images || []).map((img) => ({
        id: img.id || `img-${Math.random()}`,
        url: img.url,
        altText: img.altText || prod.name,
      }))
    );

    setDraftVariants(
      (prod.variants || []).map((v) => ({
        id: v.id || `v-${Math.random()}`,
        size: v.size,
        color: v.color || "",
        stock: (v.stock ?? 0).toString(),
        price: v.price ? (v.price / 100).toString() : "",
      }))
    );

    setIsDrawerOpen(true);
  };

  const addImageFromUrl = () => {
    if (!customImageUrl || !customImageUrl.trim()) return;
    const trimmed = customImageUrl.trim();
    setDraftImages((prev) => [
      ...prev,
      { id: `url-${Date.now()}-${Math.random()}`, url: trimmed, altText: newTitle || "Product Image" },
    ]);
    setCustomImageUrl("");
    showToast("Image URL added!", "success");
  };

  // Submit (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      showToast("Please provide product title and price", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const basePricePaise = Math.round(parseFloat(newPrice || "0") * 100);
      const originalPricePaise = newOriginalPrice
        ? Math.round(parseFloat(newOriginalPrice) * 100)
        : undefined;
      const subCat = subCategories.find((s) => s.id === newSubCategoryId);

      const payload = {
        name: newTitle,
        slug: slugify(newTitle),
        description: newDescription || `Handcrafted ${newTitle} from Panipat.`,
        categoryId: newCategoryId || selectedCategory?.id,
        subCategorySlug: subCat?.slug || newSubCategoryId || undefined,
        basePrice: basePricePaise,
        originalPrice: originalPricePaise,
        badge: (newBadge as Product["badge"]) || undefined,
        fabric: newFabric || undefined,
        craft: newCraft || undefined,
        isAvailableForCOD: newCOD,
        videoUrl: newVideoUrl || undefined,
        images:
          draftImages.length > 0
            ? draftImages.map((img) => ({ url: img.url, altText: img.altText }))
            : [
                {
                  url: selectedCategory.slug === "tops-tunics"
                    ? "https://images.unsplash.com/photo-1583391733975-ac9f78310c85?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "dresses"
                    ? "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "trending-cordsets"
                    ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "partywear"
                    ? "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "denim-wear"
                    ? "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "bottom-wear"
                    ? "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800"
                    : selectedCategory.slug === "night-suits"
                    ? "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800"
                    : "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
                  altText: newTitle,
                },
              ],
        variants: draftVariants
          .filter((v) => v.size)
          .map((v) => ({
            size: v.size,
            color: v.color || "Default",
            sku: `SAI-${slugify(newTitle).toUpperCase().slice(0, 6)}-${v.size}-${Math.floor(Math.random() * 1000)}`,
            price: v.price ? Math.round(parseFloat(v.price) * 100) : basePricePaise,
            stock: parseInt(v.stock || "0", 10),
          })),
      };

      if (editingProduct) {
        // UPDATE
        const res = await apiClient.put<{ product: Product }>(`/api/v1/products/${editingProduct.id}`, payload);
        const updatedProduct = res?.product || { ...editingProduct, ...payload };

        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? (updatedProduct as Product) : p)));
        showToast(`Product "${newTitle}" updated successfully!`, "success");
      } else {
        // CREATE
        const res = await apiClient.post<{ product: Product }>("/api/v1/admin/products", payload);
        const createdProduct = res?.product || res || {
          ...payload,
          id: `prod-${payload.slug}`,
          category: selectedCategory?.name || "Ethnic Wear",
          categorySlug: selectedCategory?.slug || "ethnic-wear",
          rating: 5.0,
          reviewsCount: 0,
          images: payload.images.map((img, idx) => ({ id: `img-${idx}`, ...img })),
          variants: payload.variants.map((v, idx) => ({ id: `v-${idx}`, ...v })),
        };

        setProducts([createdProduct as Product, ...products]);
        showToast(`Product "${newTitle}" created successfully!`, "success");
      }

      closeDrawer();
    } catch (err) {
      console.error("Save product error", err);
      showToast(editingProduct ? "Failed to update product" : "Failed to create product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);

    try {
      await apiClient.delete(`/api/v1/products/${deletingProduct.id}`);

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showToast(`Product "${deletingProduct.name}" deleted successfully!`, "info");
      setDeletingProduct(null);
    } catch (err) {
      console.error("Delete product error", err);
      showToast("Failed to delete product", "error");
    } finally {
      setIsSubmitting(false);
    }
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
    showToast("Stock updated", "success");
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
            placeholder="Search by name or category..."
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
            {categoriesList.map((c) => (
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⏳</span>
                      <span>Loading products catalog from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
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
                              Fabric: {prod.fabric ?? "—"}
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
                          {prod.variants.map((v) => v.size).join(" · ")}
                        </p>
                      </td>
                      <td className="p-4">
                        {prod.isAvailableForCOD ? (
                          <span className="text-emerald-600 font-bold text-[10px] block">✓ COD Active</span>
                        ) : (
                          <span className={`font-bold text-[10px] block ${textSub}`}>Prepaid Only</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProductForStock(prod)}
                            className={`font-bold px-2.5 py-1.5 rounded-lg border transition-colors text-[10px] ${
                              isLight
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                            }`}
                            title="Edit Stock Levels"
                          >
                            Stock
                          </button>

                          <button
                            onClick={() => openEditDrawer(prod)}
                            className="p-1.5 px-2.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-bold text-[10px] flex items-center gap-1 transition-colors"
                            title="Edit Product Details"
                          >
                            <span>✏️</span>
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => setDeletingProduct(prod)}
                            className="p-1.5 px-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-[10px] flex items-center gap-1 transition-colors"
                            title="Delete Product"
                          >
                            <span>🗑️</span>
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
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
              <button onClick={() => setSelectedProductForStock(null)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>
            <p className={`text-xs ${textSub}`}>
              Adjusting stock for <strong>{selectedProductForStock.name}</strong>:
            </p>
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {selectedProductForStock.variants.map((v) => {
                const displayColor = v.color && v.color !== "Default" && v.color.length <= 12 && !v.color.includes(" ") ? ` · ${v.color}` : "";
                return (
                  <div key={v.id} className={`flex items-center justify-between p-3.5 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800"}`}>
                    <div>
                      <strong className={`block font-bold text-xs ${textTitle}`}>
                        Size: {v.size}{displayColor}
                      </strong>
                      <span className={`text-[10px] font-mono block mt-0.5 ${textSub}`}>SKU: {v.sku}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleStockUpdate(v.id, -1)}
                        className={`w-8 h-8 rounded-lg font-extrabold text-base flex items-center justify-center transition-all ${
                          isLight
                            ? "bg-zinc-200 hover:bg-red-500 text-zinc-800 hover:text-white"
                            : "bg-zinc-800 hover:bg-red-600 text-zinc-100 hover:text-white"
                        }`}
                        title="Decrease Stock"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sm min-w-[28px] text-center">{v.stock}</span>
                      <button
                        type="button"
                        onClick={() => handleStockUpdate(v.id, 1)}
                        className={`w-8 h-8 rounded-lg font-extrabold text-base flex items-center justify-center transition-all ${
                          isLight
                            ? "bg-zinc-200 hover:bg-emerald-600 text-zinc-800 hover:text-white"
                            : "bg-zinc-800 hover:bg-emerald-600 text-zinc-100 hover:text-white"
                        }`}
                        title="Increase Stock"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* Create Product Drawer — Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
      />

      {/* Create Product Drawer — Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl ${drawerBg} shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${divider} flex-shrink-0`}>
          <div>
            <h2 className={`font-serif text-xl font-bold ${textTitle}`}>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h2>
            <p className={`text-xs ${textSub} mt-0.5`}>
              {editingProduct ? "Update product attributes and catalog settings." : "Complete all sections to add to the catalog."}
            </p>
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
        <form id="form-create-product" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-8">

            {/* -- Images ------------------------------------------ */}
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
                <p className="text-[10px] opacity-60">PNG, JPG, WEBP — multiple allowed</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
              </div>

              {/* Image URL Input Option */}
              <div className="mt-3 space-y-2">
                <label className="text-[11px] font-bold block text-zinc-500 dark:text-zinc-400">
                  OR Add Image via URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImageFromUrl();
                      }
                    }}
                    className={`flex-1 rounded-xl p-2.5 text-xs ${bgInput}`}
                  />
                  <button
                    type="button"
                    onClick={addImageFromUrl}
                    className="bg-[#9b1c31] hover:bg-[#801728] text-white font-bold px-4 py-2.5 rounded-xl text-xs shrink-0 transition-colors"
                  >
                    + Add URL
                  </button>
                </div>
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
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* -- Product Video ------------------------------------ */}
            <section className="space-y-2">
              <div className={`flex items-center justify-between pb-1 border-b ${divider}`}>
                <h3 className={`text-xs uppercase tracking-wider font-bold ${sectionColor}`}>
                  🎥 Product Showcase Video (MP4 / WebM)
                </h3>
                <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                  📁 Upload Video File
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoFileUpload}
                  />
                </label>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Paste video URL (e.g. https://domain.com/video.mp4 or data URL)"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono ${bgInput}`}
                />
                {newVideoUrl && (
                  <div className="relative rounded-xl overflow-hidden bg-black border border-zinc-700 max-h-40 flex items-center justify-center p-2">
                    <video controls src={newVideoUrl} className="max-h-36 w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setNewVideoUrl("")}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* -- Basic Info -------------------------------------- */}
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
                    placeholder="Describe fabric, design details, occasions it suits..."
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

            {/* -- Pricing ----------------------------------------- */}
            <section>
              <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 pb-2 border-b ${divider} ${sectionColor}`}>
                Pricing
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${textSub}`}>₹</span>
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
                    MRP / Original Price (₹)
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${textSub}`}>₹</span>
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

            {/* -- Classification ---------------------------------- */}
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
                    {categoriesList.map((c) => (
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
                    <option value="">— Select subcategory —</option>
                    {subCategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* -- Material & Craft -------------------------------- */}
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

            {/* -- Size Variants ----------------------------------- */}
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
                    <span>Price (₹)</span>
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
                        ✕
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
            disabled={isSubmitting}
            className="flex-[2] bg-[#9b1c31] hover:bg-[#b5223c] disabled:opacity-50 active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin text-base">⏳</span>
                <span>Saving Product...</span>
              </>
            ) : (
              "Save Product to Catalog"
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} border rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl mx-auto font-bold">
              ⚠️
            </div>
            <h3 className="font-serif text-lg font-bold">Delete Product?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">&quot;{deletingProduct.name}&quot;</strong>? This action will remove it from the store catalog.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Banner — Top Center */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none items-center">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2.5 border transition-all animate-bounce-short ${
              t.type === "success"
                ? "bg-emerald-900 text-emerald-100 border-emerald-700"
                : t.type === "error"
                ? "bg-red-900 text-red-100 border-red-700"
                : "bg-zinc-900 text-amber-200 border-zinc-700"
            }`}
          >
            <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
