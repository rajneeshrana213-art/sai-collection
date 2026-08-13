"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 text-center">
      <div className="bg-white p-8 rounded-3xl border border-amber-900/10 shadow-xl max-w-md w-full space-y-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900">Something went wrong!</h1>
        <p className="text-xs text-zinc-600">
          An unexpected error occurred while loading this page. Our technical team has been notified.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => reset()}
            className="w-full bg-[#9b1c31] text-white text-xs font-bold py-3 rounded-full shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full border border-zinc-300 text-zinc-800 text-xs font-bold py-3 rounded-full hover:border-[#9b1c31]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
