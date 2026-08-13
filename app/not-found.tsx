import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto my-16">
        <span className="font-serif text-7xl font-bold text-[#9b1c31]">404</span>
        <h1 className="font-serif text-2xl font-bold text-zinc-900">Page Not Found</h1>
        <p className="text-xs text-zinc-600 font-light leading-relaxed">
          The page or product you are looking for doesn&apos;t exist or may have been moved. Explore our latest Panipat Anarkalis &amp; designer kurta sets.
        </p>

        <div className="pt-4 flex gap-3">
          <Link
            href="/"
            className="bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="border border-zinc-300 text-zinc-800 text-xs font-bold px-6 py-3 rounded-full hover:border-[#9b1c31]"
          >
            Browse Products
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
