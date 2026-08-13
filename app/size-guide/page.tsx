"use client";

import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";

export default function SizeGuidePage() {
  const sizes = [
    { size: "S (36)", bust: '36"', waist: '32"', hip: '38"', shoulder: '14.5"' },
    { size: "M (38)", bust: '38"', waist: '34"', hip: '40"', shoulder: '15.0"' },
    { size: "L (40)", bust: '40"', waist: '36"', hip: '42"', shoulder: '15.5"' },
    { size: "XL (42)", bust: '42"', waist: '38"', hip: '44"', shoulder: '16.0"' },
    { size: "2XL (44)", bust: '44"', waist: '40"', hip: '46"', shoulder: '16.5"' },
    { size: "3XL (46)", bust: '46"', waist: '42"', hip: '48"', shoulder: '17.0"' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-zinc-900">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-widest">
            SIZE GUIDE & MEASUREMENT CHART
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold max-w-xl mx-auto">
            PLEASE REFER TO OUR DETAILED SIZE GUIDE BELOW BEFORE PLACING YOUR ORDER AT SAI COLLECTION.
          </p>
          <div className="w-12 h-0.5 bg-zinc-900 mx-auto" />
        </div>

        {/* Video Guide Alert Box */}
        <div className="bg-amber-50 border border-amber-300 p-6 text-center space-y-2 text-amber-950 font-semibold text-xs sm:text-sm">
          <p className="font-bold text-red-700 uppercase tracking-wider text-base">
            📌 PLEASE SEE SIZE GUIDE INSTRUCTIONS BEFORE ORDERING
          </p>
          <p className="text-zinc-700">
            For custom size queries or fitting assistance, feel free to reach our customer support at care@saicollection.in.
          </p>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto border border-zinc-200 shadow-sm">
          <table className="w-full text-left text-xs uppercase tracking-wider">
            <thead className="bg-zinc-900 text-white font-serif">
              <tr>
                <th className="p-4 border-b border-zinc-800">Size (Inches)</th>
                <th className="p-4 border-b border-zinc-800">Bust</th>
                <th className="p-4 border-b border-zinc-800">Waist</th>
                <th className="p-4 border-b border-zinc-800">Hip</th>
                <th className="p-4 border-b border-zinc-800">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-semibold text-zinc-800">
              {sizes.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 font-bold text-zinc-950 bg-zinc-50">{s.size}</td>
                  <td className="p-4">{s.bust}</td>
                  <td className="p-4">{s.waist}</td>
                  <td className="p-4">{s.hip}</td>
                  <td className="p-4">{s.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <CartDrawer />
      <QuickSearchModal />
      <Footer />
    </div>
  );
}
