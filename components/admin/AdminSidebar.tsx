"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme } from "@/context/SiteThemeContext";

interface AdminSidebarProps {
  onLogout: () => void;
}

export const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Products Catalog", href: "/admin/products", icon: "👗" },
  { label: "Categories & Sub-Cats", href: "/admin/categories", icon: "📁" },
  { label: "Orders Queue", href: "/admin/orders", icon: "📦" },
  { label: "Customer List", href: "/admin/customers", icon: "👥" },
  { label: "Product Reviews", href: "/admin/reviews", icon: "⭐" },
  { label: "Discount Coupons", href: "/admin/coupons", icon: "🏷️" },
  { label: "Store Settings", href: "/admin/settings", icon: "⚙️" },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const { currentTheme } = useSiteTheme();
  const isLight = theme === "light";

  return (
    <aside className={`hidden lg:flex w-64 flex-col p-4 space-y-6 h-full shrink-0 overflow-y-auto border-r transition-colors duration-300 ${
      isLight ? "bg-white border-zinc-200 shadow-sm text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
    }`}>
      {/* Brand Header */}
      <div className={`px-2 py-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Sai Collection Admin Logo"
            width={40}
            height={40}
            className="object-contain bg-white p-0.5 rounded-lg border border-amber-500/30"
          />
          <div className="flex flex-col">
            <span className={`font-serif text-lg font-bold tracking-wider ${isLight ? "text-zinc-900" : "text-amber-200"}`}>
              SAI ADMIN
            </span>
            <span className={`text-[9px] tracking-[0.2em] font-semibold uppercase ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
              PANIPAT HQ PANEL
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 text-xs font-semibold">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                backgroundColor: isActive ? currentTheme.primaryColor : undefined,
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-white shadow-md font-bold"
                  : isLight
                  ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Storefront Link & Logout Footer */}
      <div className={`pt-4 border-t ${isLight ? "border-zinc-200" : "border-zinc-800"} space-y-2`}>
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            isLight
              ? "text-zinc-900 bg-amber-50 border-amber-200 hover:bg-amber-100"
              : "text-amber-300 hover:bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <span>🌐</span>
          <span>View Live Storefront</span>
          <span className="ml-auto text-[10px]">↗</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-red-600 dark:text-red-400 ${
            isLight ? "bg-red-50 border-red-200 hover:bg-red-100" : "bg-red-950/40 border-red-900/50 hover:bg-red-900/30"
          }`}
        >
          <span>🚪</span>
          <span>Sign Out / Logout</span>
        </button>
      </div>
    </aside>
  );
};
