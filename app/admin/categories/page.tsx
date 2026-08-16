"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

export default function AdminCategoriesPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PARENTS" | "SUBCATS">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiClient.get<{ categories: Category[] }>("/api/v1/categories");
        if (res && Array.isArray(res.categories)) {
          setCategoriesList(res.categories);
        } else if (Array.isArray(res)) {
          setCategoriesList(res as unknown as Category[]);
        }
      } catch (err) {
        console.warn("Categories API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Toast State
  interface ToastMessage {
    id: string;
    type: "success" | "error" | "info";
    message: string;
  }
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editImage, setEditImage] = useState("");

  // Delete Modal State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form States for Main Category
  const [mainName, setMainName] = useState("");
  const [mainSlug, setMainSlug] = useState("");
  const [mainDesc, setMainDesc] = useState("");
  const [mainBadge, setMainBadge] = useState("");
  const [mainImage, setMainImage] = useState("");

  // Form States for Sub Category
  const [selectedParentId, setSelectedParentId] = useState(categoriesList[0]?.id || "");
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subImage, setSubImage] = useState("");

  // File Upload Helper
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImage(reader.result as string);
        showToast("Image uploaded successfully!", "success");
      }
    };
    reader.onerror = () => {
      showToast("Failed to read image file", "error");
    };
    reader.readAsDataURL(file);
  };

  // Auto generate slug
  const handleNameChange = (val: string, type: "main" | "sub") => {
    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    if (type === "main") {
      setMainName(val);
      setMainSlug(slugVal);
    } else {
      setSubName(val);
      setSubSlug(slugVal);
    }
  };

  const handleCreateMainCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainName) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: mainName,
        slug: mainSlug || mainName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: mainDesc || "Panipat designer collection.",
        imageUrl: mainImage,
        badge: mainBadge || undefined,
      };

      const res = await apiClient.post<{ category: Category }>("/api/v1/categories", payload);
      const newCat: Category = res?.category || res || {
        ...payload,
        id: `cat-${Date.now()}`,
        itemCount: 0,
        subCategories: [],
      };

      setCategoriesList([newCat, ...categoriesList]);
      setIsMainModalOpen(false);
      setMainName("");
      setMainDesc("");
      setMainBadge("");
      setMainImage("");
      showToast(`Main category "${mainName}" created successfully!`, "success");
    } catch (err) {
      console.warn("Main category creation error", err);
      showToast("Failed to create main category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName) return;
    setIsSubmitting(true);

    try {
      const parentId = selectedParentId || categoriesList[0]?.id;
      const payload = {
        parentId,
        name: subName,
        slug: subSlug || subName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: subDesc || "Sub-category collection.",
        imageUrl: subImage,
      };

      await apiClient.post("/api/v1/categories", payload);

      const updated = categoriesList.map((cat) => {
        if (cat.id === parentId) {
          const newSub = {
            id: `sub-${Date.now()}`,
            name: subName,
            slug: subSlug || subName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: subDesc || "Sub-category collection.",
            imageUrl: subImage,
            itemCount: 0,
          };
          return {
            ...cat,
            subCategories: [...(cat.subCategories || []), newSub],
          };
        }
        return cat;
      });

      setCategoriesList(updated);
      setIsSubModalOpen(false);
      setSubName("");
      setSubDesc("");
      setSubImage("");
      showToast(`Sub-category "${subName}" created successfully!`, "success");
    } catch (err) {
      console.warn("Sub category creation error", err);
      showToast("Failed to create sub-category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDesc(cat.description || "");
    setEditBadge(cat.badge || "");
    setEditImage(cat.imageUrl || "");
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: editName,
        slug: editSlug || editName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: editDesc,
        imageUrl: editImage,
        badge: editBadge || undefined,
      };

      await apiClient.put(`/api/v1/categories/${editingCategory.id}`, payload);

      setCategoriesList((prev) =>
        prev.map((c) => {
          if (c.id === editingCategory.id) {
            return { ...c, ...payload };
          }
          if (c.subCategories) {
            return {
              ...c,
              subCategories: c.subCategories.map((sub) =>
                sub.id === editingCategory.id ? { ...sub, ...payload } : sub
              ),
            };
          }
          return c;
        })
      );

      showToast(`Category "${editName}" updated successfully!`, "success");
      setEditingCategory(null);
    } catch (err) {
      console.error("Update category failed", err);
      showToast("Failed to update category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);

    try {
      await apiClient.delete(`/api/v1/categories/${deletingCategory.id}`);

      setCategoriesList((prev) =>
        prev
          .filter((c) => c.id !== deletingCategory.id)
          .map((c) => ({
            ...c,
            subCategories: c.subCategories?.filter((sub) => sub.id !== deletingCategory.id),
          }))
      );

      showToast(`Category "${deletingCategory.name}" deleted successfully!`, "info");
      setDeletingCategory(null);
    } catch (err) {
      console.error("Delete category failed", err);
      showToast("Failed to delete category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const innerCardBg = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const modalBg = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-white border-zinc-800";

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Taxonomy &amp; Categories</h1>
          <p className={`${textSub} mt-0.5`}>Manage main ethnic categories and nested sub-categories for navigation filters.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMainModalOpen(true)}
            className="bg-[#9b1c31] hover:bg-[#b5223c] text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <span>+ Add Main Category</span>
          </button>

          <button
            onClick={() => setIsSubModalOpen(true)}
            className={`font-bold px-4 py-2.5 rounded-xl border transition-all ${
              isLight ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100" : "bg-zinc-900 text-amber-300 border-amber-500/30 hover:bg-zinc-800"
            }`}
          >
            <span>+ Add Sub-Category</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${bgCard} p-4 rounded-2xl border`}>
        <div className="flex gap-2">
          {(["ALL", "PARENTS", "SUBCATS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#9b1c31] text-white shadow"
                  : isLight
                  ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab === "ALL" ? "All Taxonomy" : tab === "PARENTS" ? "Parent Categories" : "Sub-Categories"}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter categories by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full sm:w-64 rounded-xl px-3 py-2 text-xs focus:outline-none ${bgInput}`}
        />
      </div>

      {/* Category Hierarchy Cards & Sub-Category Nested Lists */}
      {(() => {
        const filtered = categoriesList.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
          <>
            <div className="space-y-6">
              {isLoading ? (
                <div className={`${bgCard} rounded-2xl border p-12 text-center text-xs font-semibold ${textSub}`}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin text-base">⏳</span>
                    <span>Loading category taxonomy from database...</span>
                  </div>
                </div>
              ) : paginated.length === 0 ? (
                <div className={`${bgCard} rounded-2xl border p-12 text-center text-xs font-semibold ${textSub}`}>
                  No categories found. Click &quot;+ Add Main Category&quot; above to create one.
                </div>
              ) : (
                paginated.map((category) => (
                <div key={category.id} className={`${bgCard} rounded-2xl border p-6 space-y-6`}>
                  {/* Category Parent Header */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"} gap-4`}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={56}
                        height={56}
                        className={`w-14 h-14 object-cover rounded-xl border shrink-0 ${isLight ? "border-zinc-300" : "border-zinc-800"}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-serif text-lg font-bold ${textTitle}`}>{category.name}</h3>
                          {category.badge && (
                            <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                              {category.badge}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-mono block ${isLight ? "text-amber-700" : "text-zinc-400"}`}>/{category.slug}</span>
                        <p className={`${textSub} text-xs mt-1`}>{category.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`font-bold px-3 py-1.5 rounded-lg border text-xs ${
                        isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-zinc-950 text-emerald-400 border-zinc-800"
                      }`}>
                        {category.itemCount} Total SKUs
                      </span>

                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 px-2.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="Edit Category"
                      >
                        <span>✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="p-1.5 px-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="Delete Category"
                      >
                        <span>🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Nested Sub-Categories Section */}
                  <div>
                    <h4 className={`text-[11px] font-bold ${textSub} uppercase tracking-wider mb-3`}>
                      Nested Sub-Categories ({category.subCategories?.length || 0})
                    </h4>

                    {category.subCategories && category.subCategories.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            className={`${innerCardBg} p-3.5 rounded-xl border flex items-center justify-between gap-3`}
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={sub.imageUrl}
                                alt={sub.name}
                                width={40}
                                height={40}
                                className={`w-10 h-10 object-cover rounded-lg border ${isLight ? "border-zinc-300" : "border-zinc-800"}`}
                              />
                              <div>
                                <strong className={`text-xs block font-bold ${textTitle}`}>{sub.name}</strong>
                                <span className={`text-[10px] ${textSub} block line-clamp-1`}>{sub.description}</span>
                                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono">/{sub.slug}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[10px] border px-2 py-1 rounded font-bold ${
                                isLight ? "bg-white border-zinc-300 text-zinc-700" : "bg-zinc-900 border-zinc-800 text-zinc-300"
                              }`}>
                                {sub.itemCount} SKUs
                              </span>
                              <button
                                onClick={() => openEditModal(sub)}
                                className="p-1.5 rounded bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs transition-colors"
                                title="Edit Sub-Category"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setDeletingCategory(sub)}
                                className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs transition-colors"
                                title="Delete Sub-Category"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border text-xs italic ${
                        isLight ? "bg-zinc-50 border-zinc-200 text-zinc-500" : "bg-zinc-950/50 border-zinc-800/60 text-zinc-500"
                      }`}>
                        No sub-categories created under {category.name} yet. Click &quot;+ Add Sub-Category&quot; above.
                      </div>
                    )}
                  </div>
                </div>
              )))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / itemsPerPage) || 1}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              darkTheme={!isLight}
            />
          </>
        );
      })()}

      {/* Modal 1: Create Main Category */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateMainCategory} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Create Main Category</h3>
              <button type="button" onClick={() => setIsMainModalOpen(false)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Velvet Suits"
                  value={mainName}
                  onChange={(e) => handleNameChange(e.target.value, "main")}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={mainSlug}
                  onChange={(e) => setMainSlug(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Badge Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. HOT, NEW, SALE"
                  value={mainBadge}
                  onChange={(e) => setMainBadge(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Category Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      className={`flex-1 rounded-lg p-2.5 text-xs ${bgInput}`}
                    />
                    <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-2.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <span>📁</span>
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setMainImage)}
                      />
                    </label>
                  </div>

                  {mainImage && (
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700">
                        <Image
                          src={mainImage}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-[11px]">
                        <span className="font-bold block text-emerald-600 dark:text-emerald-400">✓ Image Ready</span>
                        <span className="text-zinc-400 truncate block">{mainImage.slice(0, 45)}...</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMainImage("")}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary for catalog banner..."
                  value={mainDesc}
                  onChange={(e) => setMainDesc(e.target.value)}
                  className={`w-full rounded-lg p-2.5 ${bgInput}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsMainModalOpen(false)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Main Category"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Create Sub Category */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubCategory} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Create Sub-Category</h3>
              <button type="button" onClick={() => setIsSubModalOpen(false)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Parent Category *</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Sub-Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unstitched Velvet Suits"
                  value={subName}
                  onChange={(e) => handleNameChange(e.target.value, "sub")}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Sub-Category Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={subImage}
                      onChange={(e) => setSubImage(e.target.value)}
                      className={`flex-1 rounded-lg p-2.5 text-xs ${bgInput}`}
                    />
                    <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-2.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <span>📁</span>
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setSubImage)}
                      />
                    </label>
                  </div>

                  {subImage && (
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700">
                        <Image
                          src={subImage}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-[11px]">
                        <span className="font-bold block text-emerald-600 dark:text-emerald-400">✓ Image Ready</span>
                        <span className="text-zinc-400 truncate block">{subImage.slice(0, 45)}...</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubImage("")}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Sub-Category"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUpdateCategory} className={`${modalBg} border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Edit Category</h3>
              <button type="button" onClick={() => setEditingCategory(null)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                  }}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Badge Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. HOT, NEW, SALE"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Category Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className={`flex-1 rounded-lg p-2.5 text-xs ${bgInput}`}
                    />
                    <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-2.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <span>📁</span>
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setEditImage)}
                      />
                    </label>
                  </div>

                  {editImage && (
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700">
                        <Image
                          src={editImage}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-[11px]">
                        <span className="font-bold block text-emerald-600 dark:text-emerald-400">✓ Image Ready</span>
                        <span className="text-zinc-400 truncate block">{editImage.slice(0, 45)}...</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditImage("")}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className={`w-full rounded-lg p-2.5 ${bgInput}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Delete Confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} border rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl mx-auto font-bold">
              ⚠️
            </div>
            <h3 className="font-serif text-lg font-bold">Delete Category?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">&quot;{deletingCategory.name}&quot;</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
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
