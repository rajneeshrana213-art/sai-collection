"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<"EMAIL" | "OTP_PASSWORD" | "SUCCESS">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setStep("OTP_PASSWORD");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to send reset link/OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(otp, newPassword);
      setStep("SUCCESS");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Invalid or expired token/OTP.");
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
            <h1 className="font-serif text-3xl font-bold text-zinc-900">Reset Password</h1>
            <p className="text-xs text-zinc-500">
              {step === "EMAIL" && "Enter your email to receive a password reset OTP"}
              {step === "OTP_PASSWORD" && `Enter the 4-digit code sent to ${email}`}
              {step === "SUCCESS" && "Your password has been updated successfully!"}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          {step === "EMAIL" && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Registered Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg p-3 font-medium focus:outline-none focus:border-[#9b1c31]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9b1c31] text-white font-bold py-3 rounded-full shadow-md hover:bg-rose-900 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Email OTP Code →"}
              </button>

              <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                Remember your password?{" "}
                <Link href="/login" className="font-bold text-[#9b1c31] hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}

          {step === "OTP_PASSWORD" && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 text-center">
                OTP sent to <strong>{email}</strong> (Use <strong>1234</strong>)
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Enter 4-Digit Email OTP *</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#9b1c31]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-3.5 rounded-full shadow-md transition-all"
              >
                Reset Password &amp; Update →
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="text-xs text-zinc-500 hover:text-zinc-800 underline"
                >
                  ← Change Email Address
                </button>
              </div>
            </form>
          )}

          {step === "SUCCESS" && (
            <div className="space-y-4 text-center text-xs">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
                ✓
              </div>
              <p className="text-zinc-700 font-medium">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-[#9b1c31] hover:bg-[#7d1324] text-white font-bold py-3.5 rounded-full shadow-md"
              >
                Go to Sign In →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
