"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme, THEME_PRESETS, FONT_PRESETS, ThemeId, FontId } from "@/context/SiteThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAdminTheme();
  const { themeId, fontId, setThemeId, setFontId, currentTheme, customTheme, currentFont } = useSiteTheme();

  const isLight = theme === "light";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Products Catalog", href: "/admin/products", icon: "👗" },
    { label: "Categories & Sub-Cats", href: "/admin/categories", icon: "📁" },
    { label: "Orders Queue", href: "/admin/orders", icon: "📦" },
    { label: "Customer List", href: "/admin/customers", icon: "👥" },
    { label: "Product Reviews", href: "/admin/reviews", icon: "⭐" },
    { label: "Discount Coupons", href: "/admin/coupons", icon: "🏷️" },
    { label: "Store Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className={`h-screen overflow-hidden flex font-sans transition-colors duration-300 ${
      isLight ? "bg-slate-100 text-zinc-900" : "bg-zinc-950 text-zinc-100"
    }`}>

      {/* Sidebar (Desktop) */}
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

        {/* View Storefront Link Footer */}
        <div className={`pt-4 border-t ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
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
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Admin Top Header Bar */}
        <header className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 ${
          isLight ? "bg-white border-zinc-200 shadow-sm text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
        }`}>

          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className={`lg:hidden p-2 rounded-lg ${isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800"}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
              isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-emerald-950/80 text-emerald-400 border-emerald-800/50"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Panipat HQ Online
            </span> */}
          </div>

          <div className="flex items-center gap-3 text-xs">
            
            {/* 🎨 Multi-Theme Preset Dropdown Selector */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-sm transition-all ${
              isLight
                ? "bg-slate-100/90 text-zinc-900 border-zinc-200 hover:border-zinc-300"
                : "bg-zinc-900 text-zinc-100 border-zinc-700 hover:border-zinc-600"
            }`}>
              <span className="text-sm shrink-0">{currentTheme.colorDot || "🎨"}</span>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value as ThemeId)}
                className="bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-1 text-inherit"
                title="Select Theme Preset for Admin & Customer Storefront"
              >
                {Object.values(THEME_PRESETS).map((t) => (
                  <option
                    key={t.id}
                    value={t.id}
                    className={isLight ? "bg-white text-zinc-900 font-semibold" : "bg-zinc-900 text-zinc-100 font-semibold"}
                  >
                    {t.colorDot} {t.name}
                  </option>
                ))}
                <option
                  value="custom"
                  className={isLight ? "bg-white text-zinc-900 font-semibold" : "bg-zinc-900 text-zinc-100 font-semibold"}
                >
                  ✨ {customTheme?.name || "Custom Theme"}
                </option>
              </select>
            </div>

            {/* 🔤 Font Preset Dropdown Selector */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-sm transition-all ${
              isLight
                ? "bg-slate-100/90 text-zinc-900 border-zinc-200 hover:border-zinc-300"
                : "bg-zinc-900 text-zinc-100 border-zinc-700 hover:border-zinc-600"
            }`}>
              <span className="text-sm shrink-0">🔤</span>
              <select
                value={fontId}
                onChange={(e) => setFontId(e.target.value as FontId)}
                className="bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-1 text-inherit max-w-[130px] truncate"
                title="Select Typography Font for Entire Website"
              >
                {Object.values(FONT_PRESETS).map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                    className={isLight ? "bg-white text-zinc-900 font-semibold" : "bg-zinc-900 text-zinc-100 font-semibold"}
                  >
                    {f.name}
                  </option>
                ))}
                <option
                  value="custom_font"
                  className={isLight ? "bg-white text-zinc-900 font-semibold" : "bg-zinc-900 text-zinc-100 font-semibold"}
                >
                  ✨ {currentFont?.name || "Custom Font"}
                </option>
              </select>
            </div>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all active:scale-95 shadow-sm ${
                isLight
                  ? "bg-zinc-900 text-amber-300 border-zinc-800 hover:bg-zinc-800"
                  : "bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30"
              }`}
              title="Toggle Dark / Light Admin Interface Theme"
            >
              <span>{isLight ? "🌙 Dark" : "☀️ Light"}</span>
            </button>

            {/* Admin User Profile Badge with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all hover:shadow-md cursor-pointer ${
                  isLight
                    ? "bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200/80"
                    : "bg-zinc-800/60 border-zinc-700 text-zinc-100 hover:bg-zinc-800"
                }`}
              >
                <div
                  style={{ backgroundColor: currentTheme.primaryColor }}
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm"
                >
                  A
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-bold leading-tight text-[11px]">Admin Staff</span>
                  <span className={`text-[9px] ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                    {currentTheme.name}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 ml-0.5">▾</span>
              </button>

              {/* Dropdown Menu Popover */}
              {isProfileMenuOpen && (
                <>
                  {/* Backdrop overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />

                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl z-50 p-3 space-y-3 animate-fade-in ${
                    isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
                  }`}>
                    {/* User Info Header */}
                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                      isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800"
                    }`}>
                      <div
                        style={{ backgroundColor: currentTheme.primaryColor }}
                        className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0"
                      >
                        SA
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs truncate">Super Admin</h4>
                        <p className="text-[10px] text-zinc-500 truncate">admin@saicollection.in</p>
                        <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          ● Super Admin Access
                        </span>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="space-y-1 text-xs font-semibold">
                      <Link
                        href="/admin/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isLight ? "hover:bg-zinc-100 text-zinc-700" : "hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <span>👤</span>
                        <span>My Admin Profile</span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isLight ? "hover:bg-zinc-100 text-zinc-700" : "hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <span>⚙️</span>
                        <span>Store CMS &amp; Settings</span>
                      </Link>

                      <Link
                        href="/"
                        target="_blank"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isLight ? "hover:bg-zinc-100 text-zinc-700" : "hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <span>🌐</span>
                        <span>View Live Storefront</span>
                        <span className="ml-auto text-[10px] text-zinc-400">↗</span>
                      </Link>

                      <div className={`my-1 border-t ${isLight ? "border-zinc-200" : "border-zinc-800"}`} />

                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          alert("Admin Logged Out Successfully. Redirecting to Storefront...");
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 font-bold transition-all text-left"
                      >
                        <span>🚪</span>
                        <span>Sign Out / Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* Mobile Drawer Menu */}
        {isMobileSidebarOpen && (
          <div className={`lg:hidden border-b p-4 space-y-2 text-xs font-semibold ${
            isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
          }`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                  pathname === item.href
                    ? "bg-[#9b1c31] text-white"
                    : isLight
                    ? "text-zinc-600 hover:bg-zinc-100"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminThemeProvider>
  );
}
