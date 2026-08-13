"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-50 text-zinc-800 border-t border-amber-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div>
            <h4 className="text-sm tracking-[0.14em] uppercase mb-6">Main Menu</h4>
            <ul className="space-y-3 text-[15px] text-zinc-700">
              <li><Link href="/" className="hover:text-zinc-950">Home</Link></li>
              <li><Link href="/about" className="hover:text-zinc-950">About Us</Link></li>
              <li><Link href="/products" className="hover:text-zinc-950">Shop By Category</Link></li>
              <li><Link href="/products" className="hover:text-zinc-950">All Products</Link></li>
              <li><Link href="/products?onSale=true" className="hover:text-zinc-950">Sale</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950">Contact us</Link></li>
              <li><Link href="/size-guide" className="hover:text-zinc-950">Size Guide</Link></li>
              <li><Link href="/track-order" className="hover:text-zinc-950">Track Order</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-zinc-950">Shipping & Delivery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.14em] uppercase mb-6">Support</h4>
            <ul className="space-y-3 text-[15px] text-zinc-700">
              <li><Link href="/contact" className="hover:text-zinc-950">Contact us</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950">FAQ</Link></li>
              <li><Link href="/track-order" className="hover:text-zinc-950">Track Order.</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.14em] uppercase mb-6">Policies</h4>
            <ul className="space-y-3 text-[15px] text-zinc-700">
              <li><Link href="/policies/returns" className="hover:text-zinc-950">No Exchange & Return</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-zinc-950">Shipping & Delivery</Link></li>
              <li><Link href="/policies/terms" className="hover:text-zinc-950">Terms & Conditions</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-zinc-950">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.14em] uppercase mb-6">Customer Care</h4>
            <a href="mailto:care@saicollection.in" className="text-[15px] font-semibold text-zinc-700 underline underline-offset-4 hover:text-zinc-950">
              Email: care@saicollection.in
            </a>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.14em] uppercase mb-6">Information</h4>
            <ul className="space-y-6 text-[15px] tracking-[0.06em] text-zinc-700 uppercase">
              <li>• Jail Road, Fateh Nagar, Delhi -110018</li>
              <li>• All disputes are subjected to Delhi jurisdiction only.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center lg:justify-start gap-6">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-[#1877F2] hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-[#E4405F] hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-[#FF0000] hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>

        <div className="mt-16 pt-6 border-t border-amber-200/80 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-1/3 justify-center lg:justify-start">

            <p className="text-[12px] sm:text-[14px] tracking-[0.08em] uppercase text-zinc-900 text-center sm:text-left">
              2026 © sai collection All Rights Reserved.
            </p>
          </div>

          <div className="w-full lg:w-1/3 flex justify-center items-center gap-1.5 text-[13px] text-zinc-600 tracking-wide text-center">
            Designed and managed by <span className="font-semibold text-zinc-800">learnxchain</span> <svg className="w-3.5 h-3.5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-1/3">
            {/* Mastercard */}
            <div className="h-[26px] w-10 bg-white border border-zinc-200 rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="Mastercard">
              <svg viewBox="0 0 36 22" width="22" height="14">
                <circle cx="11" cy="11" r="11" fill="#EB001B"/>
                <circle cx="25" cy="11" r="11" fill="#F79E1B"/>
              </svg>
            </div>
            {/* Visa */}
            <div className="h-[26px] w-10 bg-white border border-zinc-200 rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="Visa">
              <svg viewBox="0 0 50 16" width="26" height="10" fill="#1434CB">
                <path d="M21.92 0L20.45 10.36H16.89L18.36 0H21.92ZM12.01 0L9.42 7.02L8.99 4.96C8.6 3.19 6.64 1.1 3.51 0H0L3.5 10.36H7.13L13.79 0H12.01ZM36.19 10.36H39.53L36.93 0H34.02C32.88 0 32.61 0.81 32.14 1.93L27.42 10.36H31.13L31.87 8.27H35.43L36.19 10.36ZM32.93 5.48L34.34 1.54L35.14 5.48H32.93ZM26.44 2.92C26.39 2.08 25.64 1.57 24.3 1.57C22.25 1.57 20.89 2.66 20.89 4.17C20.89 5.3 22.06 5.92 22.95 6.35C23.86 6.8 24.16 7.08 24.16 7.49C24.16 8.1 23.37 8.39 22.65 8.39C21.05 8.39 20.17 7.95 19.46 7.61L18.96 7.37L18.49 10.22C19.29 10.61 20.46 10.94 21.68 10.94C23.86 10.94 25.21 9.87 25.21 8.26C25.21 7.34 24.63 6.66 23.01 5.89C22.18 5.49 21.72 5.24 21.72 4.81C21.72 4.25 22.34 3.96 22.95 3.96C24.08 3.96 24.96 4.24 25.54 4.54L25.8 4.67L26.44 2.92Z"/>
              </svg>
            </div>
            {/* Amex */}
            <div className="h-[26px] w-auto px-1.5 bg-[#227BBB] border border-[#227BBB] rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="Amex">
              <span className="text-white font-bold text-[9px] tracking-widest italic leading-none">AMEX</span>
            </div>
            {/* Diners */}
            <div className="h-[26px] w-auto px-1.5 bg-zinc-800 border border-zinc-800 rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="Diners Club">
              <span className="text-white font-bold text-[9px] tracking-widest leading-none">DINERS</span>
            </div>
            {/* Discover */}
            <div className="h-[26px] w-auto px-1.5 bg-[#FF6000] border border-[#FF6000] rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="Discover">
              <span className="text-white font-bold text-[9px] tracking-widest leading-none">DISCOVER</span>
            </div>
            {/* JCB */}
            <div className="h-[26px] w-auto px-1.5 bg-[#0039A6] border border-[#0039A6] rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default" title="JCB">
              <span className="text-white font-bold text-[9px] tracking-widest leading-none">JCB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

