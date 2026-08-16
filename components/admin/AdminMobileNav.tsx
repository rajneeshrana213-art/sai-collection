"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { navItems } from "./AdminSidebar";

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  if (!isOpen) return null;

  return (
    <div className={`lg:hidden border-b p-4 space-y-2 text-xs font-semibold ${
      isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
    }`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
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
  );
};
