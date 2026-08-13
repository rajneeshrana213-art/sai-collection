"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MOCK_ADDRESSES, SavedAddress } from "@/lib/mock-data";

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(MOCK_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      line1,
      city,
      state,
      pincode,
      isDefault: false
    };
    setAddresses([...addresses, newAddr]);
    setIsAddingNew(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Saved Address Book</h1>

        {/* Nav tabs */}
        <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-8 overflow-x-auto text-xs font-bold">
          <Link href="/account" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Overview</Link>
          <Link href="/account/orders" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">My Orders</Link>
          <Link href="/account/addresses" className="bg-[#9b1c31] text-white px-4 py-2 rounded-full whitespace-nowrap">Address Book</Link>
          <Link href="/account/wishlist" className="bg-white text-zinc-700 hover:text-[#9b1c31] border border-zinc-200 px-4 py-2 rounded-full whitespace-nowrap">Wishlist</Link>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500 font-medium">Manage your delivery locations</span>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-[#9b1c31] text-white text-xs font-bold px-4 py-2 rounded-full"
            >
              + Add New Address
            </button>
          </div>

          {/* Add New Address Form Modal/Card */}
          {isAddingNew && (
            <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-zinc-900">Add New Delivery Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5"
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5"
                />
                <input
                  type="text"
                  placeholder="Flat / House No. / Building"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5 sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5"
                />
                <input
                  type="text"
                  placeholder="Pincode (e.g. 132103)"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border border-zinc-300 rounded-lg p-2.5"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-[#9b1c31] text-white font-bold px-5 py-2 rounded-lg">Save Address</button>
                <button type="button" onClick={() => setIsAddingNew(false)} className="bg-zinc-200 text-zinc-700 font-bold px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          {/* List of Saved Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm relative text-xs space-y-2">
                {addr.isDefault && (
                  <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                    Default Address
                  </span>
                )}
                <h4 className="font-bold text-zinc-900 text-sm">{addr.fullName}</h4>
                <p className="text-zinc-600">{addr.line1}</p>
                <p className="text-zinc-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="font-bold text-zinc-800 pt-1">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
