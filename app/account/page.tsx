"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Order, SavedAddress } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

export default function AccountOverviewPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<SavedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const orderRes = await apiClient.get<{ orders: Order[] }>("/api/v1/orders/user");
        if (orderRes && Array.isArray(orderRes.orders) && orderRes.orders.length > 0) {
          setRecentOrder(orderRes.orders[0]);
        } else if (Array.isArray(orderRes) && orderRes.length > 0) {
          setRecentOrder(orderRes[0]);
        } else {
          setRecentOrder(null);
        }

        const addrRes = await apiClient.get<{ addresses: SavedAddress[] }>("/api/v1/addresses");
        if (addrRes && Array.isArray(addrRes.addresses) && addrRes.addresses.length > 0) {
          setDefaultAddress(addrRes.addresses.find((a) => a.isDefault) || addrRes.addresses[0]);
        } else if (Array.isArray(addrRes) && addrRes.length > 0) {
          setDefaultAddress(addrRes[0]);
        }
      } catch (err) {
        console.warn("Failed to fetch user overview data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-zinc-900">My Account Dashboard</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Welcome back, <strong>{user?.name || "Customer"}</strong> ({user?.email || "Guest"})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm"
          >
            <span>🚪</span>
            <span>Sign Out / Logout</span>
          </button>
        </div>

        {/* Account Nav Sub-bar */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold items-center">
          <Link href="/account" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
          <button
            onClick={handleLogout}
            className="bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 px-4 py-2 rounded-full whitespace-nowrap ml-auto"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Order Summary Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h2 className="font-serif text-lg font-bold text-zinc-900">Latest Active Order</h2>
              <Link href="/account/orders" className="text-xs text-[#9b1c31] font-bold hover:underline">View All Orders →</Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                Loading your active order details...
              </div>
            ) : recentOrder ? (
              <div className="space-y-4">
                <div className="flex justify-between text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <div>
                    <span className="font-bold text-zinc-900 block">{recentOrder.orderNumber}</span>
                    <span className="text-zinc-500 text-[11px]">Placed on {getOrderDate(recentOrder)}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full self-center">
                    {recentOrder.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {recentOrder.items?.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs items-center">
                      <Image src={item.productImage} alt={item.productName} width={48} height={56} className="w-12 h-14 object-cover rounded bg-zinc-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-zinc-900 truncate">{item.productName}</h4>
                        <span className="text-zinc-500">Size: {item.variantSize}</span>
                      </div>
                      <span className="font-bold text-zinc-900">₹{(item.price / 100).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/account/orders/${recentOrder.orderNumber}`}
                  className="bg-[#9b1c31] text-white text-xs font-bold px-5 py-2.5 rounded-full inline-block hover:bg-[#801627] transition-colors"
                >
                  Track Shipment Live
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="text-3xl">📦</div>
                <h3 className="font-serif font-bold text-sm text-zinc-900">No Active Orders Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  You haven&apos;t placed any orders yet. Discover our latest Panipat handcrafted collection!
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-[#9b1c31] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-[#801627] transition-colors"
                >
                  Explore Collection →
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
            {defaultAddress ? (
              <div className="space-y-1 text-zinc-600">
                <p className="font-bold text-zinc-900">{defaultAddress.fullName}</p>
                <p>{defaultAddress.line1}</p>
                <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                <p className="font-bold pt-1">Phone: {defaultAddress.phone}</p>
              </div>
            ) : (
              <p className="text-zinc-400">No default shipping address saved yet.</p>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
