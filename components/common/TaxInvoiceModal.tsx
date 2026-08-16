"use client";

import React from "react";
import { Order } from "@/lib/mock-data";

interface TaxInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export function TaxInvoiceModal({ order, onClose }: TaxInvoiceModalProps) {
  if (!order) return null;

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const subtotalPaise = order.items.reduce((acc, item) => acc + (item.price || (item as unknown as { unitPrice?: number }).unitPrice || 0) * item.quantity, 0);
  const taxPaise = Math.round(subtotalPaise * 0.05); // 5% GST on Ethnic Apparel

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-zinc-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border border-amber-900/10">
        
        {/* Top Controls (Hidden during print) */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-200 print:hidden">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
            📄 Official GST Tax Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="bg-[#9b1c31] hover:bg-[#7d1324] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-3 py-2 rounded-lg text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div id="printable-invoice" className="space-y-6 text-xs">
          
          {/* Header & Company Brand */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#9b1c31]">Sai Collection</h1>
              <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">Panipat Ethnic Wear & Designer Suits</p>
              <p className="text-zinc-500 text-[10px] mt-1">GT Road Industrial Area, Panipat, Haryana - 132103</p>
              <p className="text-zinc-500 text-[10px]">GSTIN: 06AAACS9876F1Z5 | Support: care@saicollection.com</p>
            </div>
            <div className="text-right space-y-1">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Tax Invoice
              </span>
              <p className="font-mono text-sm font-bold text-zinc-900 mt-1">{order.orderNumber}</p>
              <p className="text-zinc-500 text-[10px]">Date: {order.date || new Date().toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-6 bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <div>
              <h3 className="font-serif font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1">Billed & Shipped To:</h3>
              <p className="font-bold text-zinc-900">
                {order.shippingAddress?.fullName || (order.shippingAddress as unknown as { name?: string })?.name || "Valued Customer"}
              </p>
              <p className="text-zinc-600">
                {order.shippingAddress?.line1 || (order.shippingAddress as unknown as { addressLine1?: string })?.addressLine1 || ""}
              </p>
              {(order.shippingAddress?.line2 || (order.shippingAddress as unknown as { addressLine2?: string })?.addressLine2) && (
                <p className="text-zinc-600">
                  {order.shippingAddress?.line2 || (order.shippingAddress as unknown as { addressLine2?: string })?.addressLine2}
                </p>
              )}
              <p className="text-zinc-600">
                {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {order.shippingAddress?.phone && (
                <p className="text-zinc-600 font-semibold mt-1">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>

            <div className="text-right space-y-1">
              <h3 className="font-serif font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1">Payment Details:</h3>
              <p className="text-zinc-700 font-medium">Method: <strong>{order.paymentMethod}</strong></p>
              <p className="text-zinc-700 font-medium">Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
              <p className="text-zinc-500 text-[10px] mt-2">Logistics Partner: {order.courierName || "Delhivery Express"}</p>
              {order.trackingNumber && (
                <p className="text-zinc-500 text-[10px] font-mono">AWB: {order.trackingNumber}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Size / Color</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-800">
                {order.items.map((item) => {
                  const itemUnitPrice = item.price || (item as unknown as { unitPrice?: number }).unitPrice || 0;
                  return (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold">{item.productName}</td>
                      <td className="p-3 text-zinc-600">{item.variantSize} / {item.variantColor}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(itemUnitPrice)}</td>
                      <td className="p-3 text-right font-bold font-mono">{formatCurrency(itemUnitPrice * item.quantity)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-right font-medium">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>GST (5% Apparel):</span>
                <span className="font-mono">{formatCurrency(taxPaise)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping Charges:</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-900 border-t border-zinc-300 pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-[#9b1c31] font-mono">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Declaration Footer */}
          <div className="border-t border-zinc-200 pt-4 text-[10px] text-zinc-500 space-y-1">
            <p className="font-semibold text-zinc-700">Terms & Declaration:</p>
            <p>1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            <p>2. Handcrafted Panipat products are eligible for 7-day easy returns/replacements per our store policy.</p>
            <p className="text-center text-zinc-400 pt-2">Thank you for shopping with Sai Collection!</p>
          </div>

        </div>

      </div>
    </div>
  );
}
