"use client";

import React, { useState } from "react";
import { MOCK_COUPONS, Coupon } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminCouponsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [value, setValue] = useState("");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = type === "PERCENT" ? parseFloat(value || "10") : Math.round(parseFloat(value || "100") * 100);

    const newCoup: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase(),
      type,
      value: valNum,
      usedCount: 0,
      isActive: true,
      expiresAt: "2026-12-31"
    };

    setCoupons([newCoup, ...coupons]);
    setIsAddModalOpen(false);
    setCode("");
    setValue("");
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700 font-bold" : "bg-zinc-950 text-zinc-400 font-bold";
  const modalBg = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-white border-zinc-800";

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Discount Coupon Manager</h1>
          <p className={`${textSub} mt-0.5`}>Create and manage promotional discount codes for storefront checkout.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#9b1c31] hover:bg-[#b5223c] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>+ Create New Coupon</span>
        </button>
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
              {coupons
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
                    <button
                      onClick={() => toggleCouponStatus(coup.id)}
                      className={`font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                        isLight
                          ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                      }`}
                    >
                      {coup.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(coupons.length / itemsPerPage) || 1}
        totalItems={coupons.length}
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
                    onChange={(e) => setType(e.target.value as any)}
                    className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                  >
                    <option value="PERCENT">Percentage Off (%)</option>
                    <option value="FLAT">Flat Cash Off (₹)</option>
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
                className="flex-1 bg-[#9b1c31] text-white font-bold py-2.5 rounded-xl shadow-md"
              >
                Generate Coupon
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
