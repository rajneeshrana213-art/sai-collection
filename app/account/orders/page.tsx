"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Pagination } from "@/components/common/Pagination";
import { Order } from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TaxInvoiceModal } from "@/components/common/TaxInvoiceModal";

export default function OrderHistoryPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    async function fetchUserOrders() {
      try {
        const res = await apiClient.get<{ orders: Order[] }>("/api/v1/orders/user");
        if (res && Array.isArray(res.orders)) {
          setOrders(res.orders);
        } else if (Array.isArray(res)) {
          setOrders(res as Order[]);
        }
      } catch (err) {
        console.warn("User orders API fetch fallback", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserOrders();
  }, []);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const getOrderDate = (order: Order & { createdAt?: string }) => {
    if (order.date) return order.date;
    if (order.createdAt) {
      return new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return "Recent";
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Order History</h1>

        {/* Nav tabs */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold items-center">
          <Link href="/account" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
          <button
            onClick={handleLogout}
            className="bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 px-4 py-2 rounded-full whitespace-nowrap ml-auto"
          >
            Sign Out
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 text-xs text-zinc-400 font-medium">
            Fetching your order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 space-y-4 max-w-md mx-auto shadow-sm">
            <div className="text-4xl">🛍️</div>
            <h3 className="font-serif text-xl font-bold text-zinc-900">No Orders Found</h3>
            <p className="text-xs text-zinc-500">
              You haven&apos;t placed any orders yet. Discover our latest Panipat handcrafted Anarkalis, Suit Sets, and Cordsets!
            </p>
            <Link href="/products" className="inline-block bg-[#9b1c31] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#801627] transition-colors shadow-md">
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div key={order.orderNumber} className="bg-white rounded-2xl border border-amber-900/10 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-zinc-900">{order.orderNumber}</h3>
                    <p className="text-xs text-zinc-500">Ordered on {getOrderDate(order)}</p>
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
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center text-xs">
                      <Image src={item.productImage} alt={item.productName} width={56} height={64} className="w-14 h-16 object-cover rounded-lg bg-zinc-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-zinc-900 text-sm truncate">{item.productName}</h4>
                        <p className="text-zinc-500">Size: {item.variantSize} | Color: {item.variantColor} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="bg-amber-50 text-amber-900 border border-amber-300 font-bold px-3.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                    >
                      📄 Tax Invoice
                    </button>
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="bg-zinc-900 text-white font-bold px-4 py-2 rounded-lg hover:bg-[#9b1c31] transition-colors"
                    >
                      Track Package →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* User Order History Pagination */}
            {orders.length > itemsPerPage && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(orders.length / itemsPerPage)}
                  totalItems={orders.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  darkTheme={false}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* GST Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      <Footer />
    </div>
  );
}
