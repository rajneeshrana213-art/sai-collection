"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      } else if (requireAdmin && !isAdmin) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}&error=admin_required`);
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-stone-700 dark:text-stone-300 text-sm tracking-wider">
          Verifying Session Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
