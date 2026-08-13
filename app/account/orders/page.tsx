"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Pagination } from "@/components/common/Pagination";
import { MOCK_ORDERS } from "@/lib/mock-data";

export default function OrderHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const paginatedOrders = MOCK_ORDERS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Order History</h1>

        {/* Nav tabs */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold">
          <Link href="/account" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
        </div>

        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div key={order.orderNumber} className="bg-white rounded-2xl border border-amber-900/10 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-zinc-900">{order.orderNumber}</h3>
                  <p className="text-xs text-zinc-500">Ordered on {order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                    }`}>
                    {order.status}
                  </span>
                  <span className="font-serif font-bold text-base text-zinc-900">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center text-xs">
                    <img src={item.productImage} alt={item.productName} className="w-14 h-16 object-cover rounded-lg bg-zinc-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-zinc-900 text-sm truncate">{item.productName}</h4>
                      <p className="text-zinc-500">Size: {item.variantSize} | Color: {item.variantColor} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="bg-zinc-900 text-white font-bold px-4 py-2 rounded-lg hover:bg-[#9b1c31] transition-colors"
                >
                  Track Package →
                </Link>
              </div>
            </div>
          ))}

          {/* User Order History Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(MOCK_ORDERS.length / itemsPerPage) || 1}
              totalItems={MOCK_ORDERS.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              darkTheme={false}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
