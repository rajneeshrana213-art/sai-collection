"use client";

import React, { useState, useEffect } from "react";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { apiClient } from "@/lib/api-client";

interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

export default function AdminCustomersPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await apiClient.get<{ customers: Customer[] } | Customer[]>("/api/v1/admin/customers");
        if (res && !Array.isArray(res) && Array.isArray((res as { customers: Customer[] }).customers)) {
          setCustomers((res as { customers: Customer[] }).customers);
        } else if (Array.isArray(res)) {
          setCustomers(res as Customer[]);
        }
      } catch (err) {
        console.warn("Admin customers API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || "").includes(searchTerm) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700 font-bold" : "bg-zinc-950 text-zinc-400 font-bold";

  return (
    <div className="space-y-6 text-xs">

      {/* Header */}
      <div>
        <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Customer Database</h1>
        <p className={`${textSub} mt-0.5`}>Directory of registered shoppers, contact info, and lifetime purchase metrics.</p>
      </div>

      {/* Search Input */}
      <div className={`${bgCard} p-4 rounded-2xl border max-w-sm`}>
        <input
          type="text"
          placeholder="Search by customer name, phone or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full rounded-xl px-3 py-2 focus:outline-none text-xs ${bgInput}`}
        />
      </div>

      {/* Customer Directory Table */}
      <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${tableHeadBg} uppercase text-[10px] tracking-wider`}>
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">City</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-zinc-200 text-zinc-700" : "divide-zinc-800 text-zinc-300"}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⏳</span>
                      <span>Loading customer directory from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                <tr key={c.id} className={isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/40 transition-colors"}>
                  <td className={`p-4 font-bold ${textTitle}`}>{c.name}</td>
                  <td className="p-4 font-mono text-amber-600 dark:text-amber-300 font-bold">{c.phone}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.city}</td>
                  <td className={`p-4 font-bold ${textTitle}`}>{c.totalOrders} orders</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(c.totalSpent)}</td>
                  <td className={`p-4 ${textSub}`}>{c.joinedDate}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCustomers.length / itemsPerPage) || 1}
        totalItems={filteredCustomers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        darkTheme={!isLight}
      />

    </div>
  );
}
