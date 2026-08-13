"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MOCK_ORDERS, MOCK_ADDRESSES } from "@/lib/mock-data";

export default function AccountOverviewPage() {
  const recentOrder = MOCK_ORDERS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-zinc-900">My Account Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-1">Welcome back, <strong>Pooja Sharma</strong> (pooja.sharma@example.com)</p>
        </div>

        {/* Account Nav Sub-bar */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold">
          <Link href="/account" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Order Summary Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h2 className="font-serif text-lg font-bold text-zinc-900">Latest Active Order</h2>
              <Link href="/account/orders" className="text-xs text-[#9b1c31] font-bold hover:underline">View All Orders →</Link>
            </div>

            {recentOrder && (
              <div className="space-y-4">
                <div className="flex justify-between text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <div>
                    <span className="font-bold text-zinc-900 block">{recentOrder.orderNumber}</span>
                    <span className="text-zinc-500 text-[11px]">Placed on {recentOrder.date}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full self-center">
                    {recentOrder.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {recentOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs items-center">
                      <img src={item.productImage} alt={item.productName} className="w-12 h-14 object-cover rounded bg-zinc-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-zinc-900 truncate">{item.productName}</h4>
                        <span className="text-zinc-500">Size: {item.variantSize}</span>
                      </div>
                      <span className="font-bold text-zinc-900">₹{(item.price / 100).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/account/orders/${recentOrder.orderNumber}`}
                  className="bg-[#9b1c31] text-white text-xs font-bold px-5 py-2.5 rounded-full inline-block"
                >
                  Track Shipment Live
                </Link>
              </div>
            )}
          </div>

          {/* Saved Default Address Quick Card */}
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-3 h-fit text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
              <h3 className="font-serif text-base font-bold text-zinc-900">Default Shipping Address</h3>
              <Link href="/account/addresses" className="text-[#9b1c31] font-bold">Edit</Link>
            </div>
            {MOCK_ADDRESSES[0] && (
              <div className="space-y-1 text-zinc-600">
                <p className="font-bold text-zinc-900">{MOCK_ADDRESSES[0].fullName}</p>
                <p>{MOCK_ADDRESSES[0].line1}</p>
                <p>{MOCK_ADDRESSES[0].city}, {MOCK_ADDRESSES[0].state} - {MOCK_ADDRESSES[0].pincode}</p>
                <p className="font-bold pt-1">Phone: {MOCK_ADDRESSES[0].phone}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
