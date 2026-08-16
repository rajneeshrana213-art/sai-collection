"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/mock-data";
import { Pagination } from "@/components/common/Pagination";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { apiClient } from "@/lib/api-client";
import { TaxInvoiceModal } from "@/components/common/TaxInvoiceModal";

export default function AdminOrdersPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAdminOrders() {
      try {
        const res = await apiClient.get<{ orders: Order[] }>("/api/v1/admin/orders");
        if (res && Array.isArray(res.orders)) {
          setOrders(res.orders);
        } else if (Array.isArray(res)) {
          setOrders(res as unknown as Order[]);
        }
      } catch (err) {
        console.warn("Admin orders API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdminOrders();
  }, []);

  // Status Updater Modal State
  const [newStatus, setNewStatus] = useState<Order["status"]>("SHIPPED");
  const [courierName, setCourierName] = useState("Delhivery Express");
  const [trackingNumber, setTrackingNumber] = useState("");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    return o.status === statusFilter;
  });

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      const orderId = (selectedOrder as unknown as { id?: string }).id || selectedOrder.orderNumber;
      await apiClient.patch(`/api/v1/admin/orders/${orderId}`, {
        status: newStatus,
        courierName,
        trackingNumber,
      });

      const updatedOrder: Order = {
        ...selectedOrder,
        status: newStatus,
        courierName,
        trackingNumber,
        estimatedDelivery: "August 16, 2026"
      };

      setOrders((prev) => prev.map((o) => o.orderNumber === selectedOrder.orderNumber ? updatedOrder : o));
      setSelectedOrder(null);
    } catch (err) {
      console.warn("API status update error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const tableHeadBg = isLight ? "bg-zinc-100 text-zinc-700 font-bold" : "bg-zinc-950 text-zinc-400 font-bold";
  const tableRowHover = isLight ? "hover:bg-zinc-50 transition-colors" : "hover:bg-zinc-800/40 transition-colors";
  const modalBg = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-white border-zinc-800";

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div>
        <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Order Fulfillment Queue</h1>
        <p className={`${textSub} mt-0.5`}>Manage customer dispatches, status transitions, and courier AWB numbers.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className={`flex gap-2 border-b pb-3 overflow-x-auto ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
        {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl font-bold transition-all text-xs ${
              statusFilter === st
                ? "bg-[#9b1c31] text-white shadow"
                : isLight
                ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className={`${bgCard} rounded-2xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${tableHeadBg} uppercase text-[10px] tracking-wider`}>
              <tr>
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer &amp; Address</th>
                <th className="p-4">Items Count</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Courier / Tracking</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-zinc-200 text-zinc-700" : "divide-zinc-800 text-zinc-300"}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⏳</span>
                      <span>Loading customer orders from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`p-12 text-center text-xs font-semibold ${textSub}`}>
                    No orders found matching status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((order) => (
                <tr key={order.orderNumber} className={tableRowHover}>
                  <td className="p-4">
                    <strong className={`text-sm font-bold block ${textTitle}`}>{order.orderNumber}</strong>
                    <span className={`text-[10px] ${textSub}`}>{order.date}</span>
                  </td>

                  <td className="p-4">
                    <strong className={`block ${isLight ? "text-zinc-900 font-bold" : "text-zinc-200"}`}>
                      {order.shippingAddress?.fullName || (order.shippingAddress as unknown as { name?: string })?.name || (order as unknown as { customerName?: string }).customerName || "Valued Customer"}
                    </strong>
                    <span className={`text-[10px] ${textSub} block`}>
                      {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(", ")}
                      {order.shippingAddress?.pincode ? ` (${order.shippingAddress.pincode})` : ""}
                    </span>
                    {order.shippingAddress?.phone && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-300 font-mono">{order.shippingAddress.phone}</span>
                    )}
                  </td>

                  <td className={`p-4 font-bold ${textTitle}`}>{order.items.length} item(s)</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold block w-fit border ${
                      isLight ? "bg-zinc-100 text-zinc-800 border-zinc-300" : "bg-zinc-800 text-zinc-200 border-zinc-700"
                    }`}>
                      {order.paymentMethod}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">{formatCurrency(order.total)}</span>
                  </td>

                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      order.status === "DELIVERED"
                        ? isLight ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : order.status === "SHIPPED"
                        ? isLight ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-blue-950 text-blue-300 border-blue-800"
                        : isLight ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    {order.trackingNumber ? (
                      <div>
                        <span className={`font-bold block ${isLight ? "text-zinc-900" : "text-zinc-300"}`}>{order.courierName}</span>
                        <span className="text-amber-600 dark:text-amber-400">{order.trackingNumber}</span>
                      </div>
                    ) : (
                      <span className={`${textSub} italic`}>Not Shipped Yet</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className={`font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          isLight
                            ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                        }`}
                      >
                        📄 Invoice
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setCourierName(order.courierName || "Delhivery Express");
                          setTrackingNumber(order.trackingNumber || ("DELHIVERY" + Math.floor(100000 + Math.random() * 900000)));
                        }}
                        className={`font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          isLight
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredOrders.length / itemsPerPage) || 1}
        totalItems={filteredOrders.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        darkTheme={!isLight}
      />

      {/* Order Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateOrderStatus} className={`${modalBg} border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isLight ? "border-zinc-200" : "border-zinc-800"}`}>
              <h3 className="font-serif text-lg font-bold">Update Order #{selectedOrder.orderNumber}</h3>
              <button type="button" onClick={() => setSelectedOrder(null)} className="font-bold opacity-60 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Select New Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Order["status"])}
                  className={`w-full rounded-lg p-2.5 font-bold ${bgInput}`}
                >
                  <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                  <option value="PROCESSING">PROCESSING (Packing in Panipat HQ)</option>
                  <option value="SHIPPED">SHIPPED (Handed over to Courier)</option>
                  <option value="DELIVERED">DELIVERED (Package Received by Customer)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Courier Logistics Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-semibold ${bgInput}`}
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="BlueDart Logistics">BlueDart Logistics</option>
                  <option value="Ecom Express">Ecom Express</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Tracking AWB Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className={`w-full rounded-lg p-2.5 font-mono ${bgInput}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#9b1c31] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Updating...</span>
                  </>
                ) : (
                  "Save Order Status"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GST Tax Invoice Modal */}
      {invoiceOrder && (
        <TaxInvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

    </div>
  );
}
