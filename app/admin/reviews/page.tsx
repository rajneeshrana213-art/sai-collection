"use client";

import React, { useState } from "react";
import { MOCK_REVIEWS, MOCK_PRODUCTS, ProductReview } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminReviewsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [reviews, setReviews] = useState<ProductReview[]>(MOCK_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // New Manual Review Form State
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0]?.id || "");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const filteredReviews = reviews.filter((rev) => {
    const matchesStatus = statusFilter === "ALL" || rev.status === statusFilter;
    const matchesSearch =
      rev.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setReviews(
      reviews.map((rev) => (rev.id === id ? { ...rev, status: newStatus } : rev))
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter((rev) => rev.id !== id));
  };

  const handleAddManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = MOCK_PRODUCTS.find((p) => p.id === selectedProductId) || MOCK_PRODUCTS[0];

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      productImage: prod.images[0]?.url,
      customerName,
      customerPhone: customerPhone || undefined,
      rating,
      title,
      comment,
      verifiedPurchase: true,
      status: "APPROVED",
      createdAt: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setIsAddModalOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setTitle("");
    setComment("");
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
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Customer Reviews &amp; Moderation</h1>
          <p className={`${textSub} mt-0.5`}>Approve verified customer ratings, moderate feedback, or manually publish shop reviews.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#9b1c31] hover:bg-[#b5223c] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>+ Add Manual Review</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${bgCard} p-4 rounded-2xl border flex items-center justify-between`}>
          <div>
            <span className={`text-[11px] font-semibold ${textSub} uppercase tracking-wider block mb-1`}>Pending Approval</span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-300">{pendingCount} Reviews</span>
          </div>
          <span className="text-2xl">⏳</span>
        </div>

        <div className={`${bgCard} p-4 rounded-2xl border flex items-center justify-between`}>
          <div>
            <span className={`text-[11px] font-semibold ${textSub} uppercase tracking-wider block mb-1`}>Approved &amp; Live</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approvedCount} Reviews</span>
          </div>
          <span className="text-2xl">✓</span>
        </div>

        <div className={`${bgCard} p-4 rounded-2xl border flex items-center justify-between`}>
          <div>
            <span className={`text-[11px] font-semibold ${textSub} uppercase tracking-wider block mb-1`}>Average Rating</span>
            <span className={`text-2xl font-bold ${textTitle}`}>★ {avgRating} / 5.0</span>
          </div>
          <span className="text-2xl">⭐</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`${bgCard} p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 items-center justify-between`}>
        <div className="flex gap-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                statusFilter === tab
                  ? "bg-[#9b1c31] text-white shadow"
                  : isLight
                  ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by customer, product or review content..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full sm:w-72 rounded-xl px-3 py-2 text-xs focus:outline-none ${bgInput}`}
        />
      </div>

      {/* Reviews Table */}
      <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${tableHeadBg} uppercase text-[10px] tracking-wider`}>
              <tr>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Product Reviewed</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Content</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-zinc-200 text-zinc-700" : "divide-zinc-800 text-zinc-300"}`}>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`p-8 text-center ${textSub}`}>
                    No reviews found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((rev) => (
                  <tr key={rev.id} className={isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/40 transition-colors"}>
                    <td className="p-4">
                      <strong className={`text-xs font-bold block ${textTitle}`}>{rev.customerName}</strong>
                      {rev.customerPhone && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-300 font-mono block">{rev.customerPhone}</span>
                      )}
                      <span className={`text-[10px] ${textSub}`}>{rev.createdAt}</span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {rev.productImage && (
                          <img
                            src={rev.productImage}
                            alt={rev.productName}
                            style={{
                              width: "40px",
                              height: "48px",
                              minWidth: "40px",
                              minHeight: "48px",
                              maxWidth: "40px",
                              maxHeight: "48px",
                              objectFit: "cover",
                            }}
                            className={`rounded-lg shrink-0 border ${isLight ? "bg-zinc-100 border-zinc-300" : "bg-zinc-800 border-zinc-700"}`}
                          />
                        )}
                        <span className={`font-semibold line-clamp-2 ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{rev.productName}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        {"★".repeat(rev.rating)}
                        <span className={`text-[10px] ${textSub}`}>({rev.rating}/5)</span>
                      </div>
                    </td>

                    <td className="p-4 max-w-md">
                      <strong className={`block font-semibold mb-0.5 ${textTitle}`}>{rev.title}</strong>
                      <p className={`${textSub} text-[11px] leading-relaxed line-clamp-2`}>{rev.comment}</p>
                      {rev.verifiedPurchase && (
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1.5 border ${
                          isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-400 border-emerald-800/50"
                        }`}>
                          ✓ Verified Buyer
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        rev.status === "APPROVED"
                          ? isLight ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : rev.status === "REJECTED"
                          ? isLight ? "bg-red-100 text-red-800 border-red-300" : "bg-red-950 text-red-300 border-red-800"
                          : isLight ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}>
                        {rev.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {rev.status !== "APPROVED" && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Approve ✓
                        </button>
                      )}
                      {rev.status !== "REJECTED" && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                          className="bg-zinc-200 dark:bg-zinc-800 hover:bg-red-600 text-zinc-800 dark:text-zinc-300 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                        >
                          Reject ✗
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 opacity-60 hover:opacity-100 text-sm"
                        title="Delete Review"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredReviews.length / itemsPerPage) || 1}
        totalItems={filteredReviews.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        darkTheme={!isLight}
      />

      {/* Add Manual Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddManualReview} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Post Manual Store Review</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Select Target Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                >
                  {MOCK_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meenakshi Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full rounded-lg p-2.5 font-semibold ${bgInput}`}
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Star Rating *</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className={`w-full rounded-lg p-2.5 font-bold text-amber-500 ${bgInput}`}
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gorgeous Velvet Embroidery!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Customer Feedback Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed feedback regarding fabric quality, fit, and delivery speed..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`w-full rounded-lg p-2.5 ${bgInput}`}
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
                className="flex-1 bg-[#9b1c31] text-white font-bold py-2.5 rounded-xl shadow-md"
              >
                Publish Review Live
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
