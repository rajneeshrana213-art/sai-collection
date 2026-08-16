"use client";

import React from "react";
import Link from "next/link";
import { useAdminTheme } from "@/context/AdminThemeContext";

interface AdminHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const AdminHeroSection: React.FC<AdminHeroSectionProps> = ({
  title = "Dashboard Overview",
  subtitle = "Real-time metrics for Sai Collection storefront operations & fulfillment.",
}) => {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-colors ${
      isLight
        ? "bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-rose-50 border-amber-200/80 text-zinc-900 shadow-sm"
        : "bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-zinc-800 text-white"
    }`}>
      {/* Dynamic Background Glow Effect */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-200 dark:border-amber-700/50">
              ⚡ Control Center
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Panipat HQ • Live Store
            </span>
          </div>

          <h1 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${textTitle}`}>
            {title}
          </h1>
          <p className={`text-xs sm:text-sm ${textSub} mt-1.5 max-w-2xl`}>
            {subtitle}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#9b1c31] hover:bg-[#801728] text-white shadow-sm transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <span>👗</span>
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isLight
                ? "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            <span>📦</span>
            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
