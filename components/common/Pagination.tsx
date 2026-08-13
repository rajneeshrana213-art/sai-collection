"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  darkTheme?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  darkTheme = false,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const textMuted = darkTheme ? "text-zinc-400" : "text-zinc-500";
  const bgCard = darkTheme ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const btnBase = darkTheme
    ? "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900";
  const activeBtn = darkTheme
    ? "bg-[#9b1c31] text-white border-[#9b1c31] font-bold"
    : "bg-[#9b1c31] text-white border-[#9b1c31] font-bold";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${bgCard} text-xs font-medium`}>
      <div className={textMuted}>
        Showing <strong className={darkTheme ? "text-white" : "text-zinc-900"}>{startItem}</strong> to{" "}
        <strong className={darkTheme ? "text-white" : "text-zinc-900"}>{endItem}</strong> of{" "}
        <strong className={darkTheme ? "text-white" : "text-zinc-900"}>{totalItems}</strong> entries
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${btnBase}`}
        >
          ← Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
              currentPage === page ? activeBtn : btnBase
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${btnBase}`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
