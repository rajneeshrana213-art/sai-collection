"use client";

import React, { useState } from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#140e0e] text-zinc-300 pt-16 pb-8 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">

          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center group">
              <img
                src="/logo.png"
                alt="Sai Collection Logo"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-light">
              Panipat&apos;s leading D2C Indian ethnic wear brand. Crafting royal Velvet Anarkali suit sets, Chanderi silk kurtas, and traditional Phulkari dupattas delivered directly to your doorstep.
            </p>

            <div className="flex items-center space-x-3 text-xs text-amber-300 pt-2">
              <span className="font-bold">Follow us:</span>
              <a
                href="https://instagram.com/saicollectionpnp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                @saicollectionpnp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/products?category=womens-ethnic-suits" className="hover:text-amber-300 transition-colors">
                  Anarkali Suit Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=designer-kurta-sets" className="hover:text-amber-300 transition-colors">
                  Designer Kurta Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=royal-sarees-lehengas" className="hover:text-amber-300 transition-colors">
                  Royal Sarees &amp; Lehengas
                </Link>
              </li>
              <li>
                <Link href="/products?category=dupattas-stoles" className="hover:text-amber-300 transition-colors">
                  Phulkari Dupattas
                </Link>
              </li>
              <li>
                <Link href="/products?category=mens-kurta-pyjama" className="hover:text-amber-300 transition-colors">
                  Men&apos;s Kurta Pyjama
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/account/orders" className="hover:text-amber-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-amber-300 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-amber-300 transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-amber-300 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Get 10% Off
            </h4>
            <p className="text-xs text-zinc-400">
              Subscribe for VIP access to new Panipat drop releases &amp; secret discounts.
            </p>

            {subscribed ? (
              <div className="bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-lg font-medium">
                ✓ Thank you for subscribing! Use code <strong>SAI10</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full text-xs bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full bg-[#9b1c31] hover:bg-[#b5223c] text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Rights, Agency Credit & Payment Icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 text-center md:text-left">
          <div>
            © 2026 <strong>Sai Collection</strong> . All rights reserved.
          </div>

          {/* Center Credit */}
          <div className="text-zinc-400 font-medium">
            Designed and managed by{" "}
            <a
              href="https://www.learnxchain.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-white font-bold underline decoration-amber-500/50 underline-offset-2 transition-colors"
            >
              learnxchain ❤️ 
            </a>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Accepted Payments:</span>
            <div className="flex items-center gap-1.5 text-xs bg-white/5 px-3 py-1 rounded border border-white/10 text-zinc-300">
              <span>💳 Credit/Debit</span>
              <span>•</span>
              <span>📱 UPI (GPay/PhonePe)</span>
              <span>•</span>
              <span>💵 COD</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
