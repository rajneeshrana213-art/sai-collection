"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useAuth } from "@/context/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/account";

  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: fullName, email, password, phone });
      router.push(callbackUrl);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-serif text-3xl font-bold text-zinc-900">Create Account</h1>
            <p className="text-xs text-zinc-500">Join Sai Collection for faster checkout &amp; VIP drops</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Pooja Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Mobile Number (for COD updates) *</label>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
              />
            </div>

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
              <label className="font-bold text-zinc-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 font-medium focus:outline-none focus:border-[#9b1c31]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-3.5 rounded-full shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            Already have an account?{" "}
            <Link
              href={callbackUrl !== "/account" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
              className="font-bold text-[#9b1c31] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold">Loading Register...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
