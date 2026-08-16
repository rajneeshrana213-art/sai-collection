"use client";


import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">Panipat, Haryana</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900">Our Panipat Story</h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
            From an Instagram-native boutique (<strong>@saicollectionpnp</strong>) to a full-stack Indian D2C fashion destination.
          </p>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <Image
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000"
            alt="Sai Collection Panipat Weaving Heritage"
            width={800}
            height={600}
            className="rounded-3xl shadow-xl object-cover aspect-[4/3] w-full"
          />
          <div className="space-y-4 text-xs sm:text-sm text-zinc-700 font-light leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-zinc-900">The Handloom Capital of North India</h2>
            <p>
              Panipat has long been celebrated across India for its rich textile tradition, master weavers, and intricate handloom embroidery. Sai Collection was founded with a singular mission: to bring authentic Panipat suit sets, Anarkalis, and Phulkari dupattas directly to customers across India without retail markups.
            </p>
            <p>
              By bypassing distributors and middlemen, we invest directly in premium fabrics (Micro Velvet, Chanderi Silk, Tissue Silk, Pure Muslin) and pay fair wages to our local master artisans.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-amber-900/10">
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
            <div className="text-2xl font-serif font-bold text-[#9b1c31]">01</div>
            <h3 className="font-serif text-base font-bold text-zinc-900">Direct From Workshops</h3>
            <p className="text-xs text-zinc-500">Every garment is stitched and quality-inspected in our Panipat facilities.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
            <div className="text-2xl font-serif font-bold text-[#9b1c31]">02</div>
            <h3 className="font-serif text-base font-bold text-zinc-900">Customer First D2C</h3>
            <p className="text-xs text-zinc-500">COD available across 19,000+ pincodes in India with easy 7-day exchanges.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
            <div className="text-2xl font-serif font-bold text-[#9b1c31]">03</div>
            <h3 className="font-serif text-base font-bold text-zinc-900">Instagram Community</h3>
            <p className="text-xs text-zinc-500">Join 35,000+ fashion lovers on Instagram @saicollectionpnp.</p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
