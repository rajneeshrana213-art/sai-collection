"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/account";
  const urlError = searchParams.get("error");

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "auth_required"
      ? "Please sign in to access this page."
      : urlError === "admin_required"
      ? "Admin access required."
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-xl max-w-md w-full space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Welcome Back</h1>
        <p className="text-xs text-zinc-500">Sign in to track orders, saved addresses &amp; wishlist</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-zinc-700 block mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-zinc-700">Password *</label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-bold text-[#9b1c31] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-3.5 rounded-full shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Signing In..." : "Sign In →"}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        Don&apos;t have an account?{" "}
        <Link
          href={callbackUrl !== "/account" ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
          className="font-bold text-[#9b1c31] hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense fallback={<div className="text-xs text-zinc-500 font-bold">Loading Login...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


