"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminThemeProvider } from "@/context/AdminThemeContext";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

import { useAdminTheme } from "@/context/AdminThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme } = useAdminTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleAdminLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  const isDark = theme === "dark";

  return (
    <div className={`h-screen overflow-hidden flex font-sans transition-colors duration-300 ${
      isDark ? "dark bg-zinc-950 text-zinc-100" : "bg-slate-100 text-zinc-900"
    }`}>

      {/* Admin Sidebar Navigation */}
      <AdminSidebar onLogout={handleAdminLogout} />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Admin Top Header Bar */}
        <AdminHeader
          user={user}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          onLogout={handleAdminLogout}
        />

        {/* Mobile Drawer Menu */}
        <AdminMobileNav
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

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
