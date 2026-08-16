"use client";

import React from "react";
import Link from "next/link";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme } from "@/context/SiteThemeContext";

interface AdminUser {
  name?: string;
  email?: string;
}

interface AdminHeaderProps {
  user: AdminUser | null;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  onLogout,
}) => {
  const { theme, toggleTheme } = useAdminTheme();
  const { currentTheme } = useSiteTheme();
  const isLight = theme === "light";

  return (
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

        <span className={`text-xs font-bold px-3 py-1 rounded-full hidden sm:flex items-center gap-1.5 border ${
          isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-emerald-950/80 text-emerald-400 border-emerald-800/50"
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Panipat HQ Online
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
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
                    <h4 className="font-bold text-xs truncate">{user?.name || "Admin Staff"}</h4>
                    <p className="text-[10px] text-zinc-500 truncate">{user?.email || "admin@demo.com"}</p>
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
                    onClick={onLogout}
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
  );
};
