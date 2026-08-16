"use client";

import React, { useState, useEffect } from "react";
import { Coupon } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { apiClient } from "@/lib/api-client";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminCouponsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Create Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [value, setValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");

  // Edit Form State
  const [editCode, setEditCode] = useState("");
  const [editType, setEditType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [editValue, setEditValue] = useState("");
  const [editMinOrderValue, setEditMinOrderValue] = useState("");

  const showToast = (message: string, toastType: "success" | "error" | "info" = "success") => {
    setToasts((prev) => {
      const nextId = `toast-${prev.length + 1}`;
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== nextId));
      }, 3500);
      return [...prev, { id: nextId, message, type: toastType }];
    });
  };

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await apiClient.get<{ coupons: Coupon[] }>("/api/v1/admin/coupons");
        if (res && Array.isArray(res.coupons)) {
          setCoupons(res.coupons);
        } else if (Array.isArray(res)) {
          setCoupons(res as unknown as Coupon[]);
        }
      } catch (err) {
        console.warn("Admin coupons API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCoupons();
  }, []);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const codeUpper = code.trim().toUpperCase();
    const valNum = type === "PERCENT" ? parseFloat(value || "10") : Math.round(parseFloat(value || "100") * 100);
    const minOrderValNum = minOrderValue ? Math.round(parseFloat(minOrderValue) * 100) : undefined;

    try {
      const res = await apiClient.post<{ success: boolean; coupon: Coupon }>("/api/v1/admin/coupons", {
        code: codeUpper,
        type,
        value: valNum,
        minOrderValue: minOrderValNum,
      });
      const created = res?.coupon || {
        id: `coup-${coupons.length + 1}`,
        code: codeUpper,
        type,
        value: valNum,
        minOrderValue: minOrderValNum,
        usedCount: 0,
        isActive: true,
        expiresAt: "2026-12-31",
      };
      setCoupons([created, ...coupons]);
      showToast(`Coupon "${codeUpper}" generated successfully!`, "success");
      setIsAddModalOpen(false);
      setCode("");
      setValue("");
      setMinOrderValue("");
    } catch (err) {
      showToast((err as Error).message || "Failed to create coupon", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (coup: Coupon) => {
    setEditingCoupon(coup);
    setEditCode(coup.code);
    setEditType(coup.type);
    setEditValue(coup.type === "PERCENT" ? coup.value.toString() : (coup.value / 100).toString());
    setEditMinOrderValue(coup.minOrderValue ? (coup.minOrderValue / 100).toString() : "");
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    setIsSubmitting(true);

    const codeUpper = editCode.trim().toUpperCase();
    const valNum = editType === "PERCENT" ? parseFloat(editValue || "10") : Math.round(parseFloat(editValue || "100") * 100);
    const minOrderValNum = editMinOrderValue ? Math.round(parseFloat(editMinOrderValue) * 100) : null;

    try {
      await apiClient.put(`/api/v1/admin/coupons/${editingCoupon.id}`, {
        code: codeUpper,
        type: editType,
        value: valNum,
        minOrderValue: minOrderValNum,
      });

      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? { ...c, code: codeUpper, type: editType, value: valNum, minOrderValue: minOrderValNum || undefined }
            : c
        )
      );
      showToast(`Coupon "${codeUpper}" updated successfully!`, "success");
      setEditingCoupon(null);
    } catch (err) {
      showToast((err as Error).message || "Failed to update coupon", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deletingCoupon) return;
    try {
      await apiClient.delete(`/api/v1/admin/coupons/${deletingCoupon.id}`);
      setCoupons(coupons.filter((c) => c.id !== deletingCoupon.id));
      showToast(`Coupon "${deletingCoupon.code}" deleted permanently`, "info");
      setDeletingCoupon(null);
    } catch (err) {
      showToast((err as Error).message || "Failed to delete coupon", "error");
    }
  };

  const toggleCouponStatus = async (coup: Coupon) => {
    const newStatus = !coup.isActive;
    try {
      await apiClient.patch(`/api/v1/admin/coupons/${coup.id}`, { isActive: newStatus });
      setCoupons(coupons.map((c) => (c.id === coup.id ? { ...c, isActive: newStatus } : c)));
      showToast(`Coupon "${coup.code}" ${newStatus ? "enabled" : "disabled"}`, "info");
    } catch (err) {
      showToast((err as Error).message || "Failed to update coupon status", "error");
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const bgInput = isLight ? "bg-white border border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700 font-bold" : "bg-zinc-950 text-zinc-400 font-bold";
  const modalBg = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-white border-zinc-800";

  return (
    <div className="space-y-6 text-xs relative">
      {/* Toast Notifications */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none items-center">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
              t.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : t.type === "error"
                ? "bg-red-600 text-white border-red-500"
                : "bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-300"
            }`}
          >
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "⚠️" : "ℹ️"}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Discount Coupon Manager</h1>
          <p className={`${textSub} mt-0.5`}>Create, edit, and manage promotional discount codes for storefront checkout.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#9b1c31] hover:bg-[#b5223c] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>+ Create New Coupon</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={`${bgCard} p-4 rounded-2xl border flex items-center justify-between`}>
        <input
          type="text"
          placeholder="🔍 Search coupon codes (e.g. FESTIVE20)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full sm:w-80 rounded-xl px-3 py-2 text-xs focus:outline-none ${bgInput}`}
        />
        <span className={`text-xs font-bold ${textSub}`}>{filteredCoupons.length} Coupons Total</span>
      </div>

      {/* Coupons Table */}
      <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${tableHeadBg} uppercase text-[10px] tracking-wider`}>
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Type</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min. Order Value</th>
                <th className="p-4">Usage Stats</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-zinc-200 text-zinc-700" : "divide-zinc-800 text-zinc-300"}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⏳</span>
                      <span>Loading discount coupons from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    No discount coupons found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((coup) => (
                <tr key={coup.id} className={isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/40 transition-colors"}>
                  <td className="p-4">
                    <strong className="text-amber-600 dark:text-amber-300 font-mono text-sm font-bold block">{coup.code}</strong>
                  </td>

                  <td className={`p-4 font-bold ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>
                    {coup.type === "PERCENT" ? "Percentage Off" : "Flat Cash Off"}
                  </td>

                  <td className={`p-4 font-bold ${textTitle}`}>
                    {coup.type === "PERCENT" ? `${coup.value}% OFF` : formatCurrency(coup.value)}
                  </td>

                  <td className={`p-4 ${textSub}`}>
                    {coup.minOrderValue ? formatCurrency(coup.minOrderValue) : "No Minimum"}
                  </td>

                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{coup.usedCount} uses</td>

                  <td className="p-4">
                    {coup.isActive ? (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        isLight ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                      }`}>
                        Active
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        isLight ? "bg-zinc-100 text-zinc-600 border-zinc-300" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}>
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleCouponStatus(coup)}
                        className={`font-bold px-2.5 py-1 rounded-lg text-[10px] border transition-colors ${
                          isLight
                            ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                        }`}
                        title={coup.isActive ? "Disable Coupon" : "Enable Coupon"}
                      >
                        {coup.isActive ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => openEditModal(coup)}
                        className="p-1 px-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        title="Edit Coupon"
                      >
                        <span>✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingCoupon(coup)}
                        className="p-1 px-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        title="Delete Coupon"
                      >
                        <span>🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCoupons.length / itemsPerPage) || 1}
        totalItems={filteredCoupons.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        darkTheme={!isLight}
      />

      {/* Create Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCoupon} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Create Promo Coupon</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono font-bold uppercase ${bgInput}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "PERCENT" | "FLAT")}
                    className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                  >
                    <option value="PERCENT" className={isLight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}>Percentage Off (%)</option>
                    <option value="FLAT" className={isLight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}>Flat Cash Off (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder={type === "PERCENT" ? "20" : "200"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Minimum Order Value (₹ Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 999"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-medium ${bgInput}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Creating...</span>
                  </>
                ) : (
                  "Generate Coupon"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateCoupon} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Edit Promo Coupon</h3>
              <button type="button" onClick={() => setEditingCoupon(null)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono font-bold uppercase ${bgInput}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type *</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as "PERCENT" | "FLAT")}
                    className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                  >
                    <option value="PERCENT" className={isLight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}>Percentage Off (%)</option>
                    <option value="FLAT" className={isLight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}>Flat Cash Off (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder={editType === "PERCENT" ? "20" : "200"}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Minimum Order Value (₹ Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 999"
                  value={editMinOrderValue}
                  onChange={(e) => setEditMinOrderValue(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-medium ${bgInput}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
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

      {/* Delete Confirmation Modal */}
      {deletingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${modalBg} border rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl mx-auto font-bold">
              🗑️
            </div>
            <h3 className="font-serif text-base font-bold">Delete Discount Coupon?</h3>
            <p className={`text-xs ${textSub}`}>
              Are you sure you want to permanently delete coupon code <strong className="text-red-500 font-mono">{deletingCoupon.code}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingCoupon(null)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs shadow-md"
              >
                Delete Coupon
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
