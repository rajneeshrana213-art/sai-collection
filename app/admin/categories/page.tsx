"use client";

import React, { useState } from "react";
import { CATEGORIES, Category } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminCategoriesPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);
  const [activeTab, setActiveTab] = useState<"ALL" | "PARENTS" | "SUBCATS">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Form States for Main Category
  const [mainName, setMainName] = useState("");
  const [mainSlug, setMainSlug] = useState("");
  const [mainDesc, setMainDesc] = useState("");
  const [mainBadge, setMainBadge] = useState("");
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800");

  // Form States for Sub Category
  const [selectedParentId, setSelectedParentId] = useState(categoriesList[0]?.id || "");
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subImage, setSubImage] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800");

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

  const handleCreateMainCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainName) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: mainName,
      slug: mainSlug || mainName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: mainDesc || "Panipat designer collection.",
      imageUrl: mainImage,
      badge: mainBadge || undefined,
      itemCount: 0,
      subCategories: [],
    };

    setCategoriesList([newCat, ...categoriesList]);
    setIsMainModalOpen(false);
    setMainName("");
    setMainDesc("");
    setMainBadge("");
  };

  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName) return;

    const updated = categoriesList.map((cat) => {
      if (cat.id === selectedParentId) {
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
              {paginated.map((category) => (
                <div key={category.id} className={`${bgCard} rounded-2xl border p-6 space-y-6`}>
                  {/* Category Parent Header */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"} gap-4`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
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

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`font-bold px-3 py-1.5 rounded-lg border text-xs ${
                        isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-zinc-950 text-emerald-400 border-zinc-800"
                      }`}>
                        {category.itemCount} Total SKUs
                      </span>
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
                              <img
                                src={sub.imageUrl}
                                alt={sub.name}
                                className={`w-10 h-10 object-cover rounded-lg border ${isLight ? "border-zinc-300" : "border-zinc-800"}`}
                              />
                              <div>
                                <strong className={`text-xs block font-bold ${textTitle}`}>{sub.name}</strong>
                                <span className={`text-[10px] ${textSub} block line-clamp-1`}>{sub.description}</span>
                                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono">/{sub.slug}</span>
                              </div>
                            </div>

                            <span className={`text-[10px] border px-2 py-1 rounded font-bold ${
                              isLight ? "bg-white border-zinc-300 text-zinc-700" : "bg-zinc-900 border-zinc-800 text-zinc-300"
                            }`}>
                              {sub.itemCount} SKUs
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border text-xs italic ${
                        isLight ? "bg-zinc-50 border-zinc-200 text-zinc-500" : "bg-zinc-950/50 border-zinc-800/60 text-zinc-500"
                      }`}>
                        No sub-categories created under {category.name} yet. Click "+ Add Sub-Category" above.
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
              <button type="submit" className="flex-1 bg-[#9b1c31] text-white font-bold py-2.5 rounded-xl">
                Create Main Category
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
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-[#9b1c31] text-white font-bold py-2.5 rounded-xl">
                Create Sub-Category
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
