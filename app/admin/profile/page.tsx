"use client";

import React, { useState } from "react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme } from "@/context/SiteThemeContext";

export default function AdminProfilePage() {
  const { theme } = useAdminTheme();
  const { currentTheme } = useSiteTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "PERMISSIONS" | "ACTIVITY">("PROFILE");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Information State
  const [firstName, setFirstName] = useState("Rajneesh");
  const [lastName, setLastName] = useState("Rana");
  const [email, setEmail] = useState("admin@saicollection.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [designation, setDesignation] = useState("Super Admin & Store Owner");
  const [bio, setBio] = useState("Managing Sai Collection Panipat wholesale & D2C retail operations.");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400");
  const [location, setLocation] = useState("Panipat, Haryana, India");

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setSavedSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSavedSuccess(false), 3500);
    } else {
      alert("New passwords do not match!");
    }
  };

  // Helper theme classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100";
  const innerCardBg = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const borderDivider = isLight ? "border-zinc-200" : "border-zinc-800";

  return (
    <div className="space-y-8 text-xs w-full max-w-6xl mx-auto">
      
      {/* Header Notification */}
      {savedSuccess && (
        <div className={`p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg border ${
          isLight ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-emerald-950/90 border-emerald-500/80 text-emerald-300"
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <div>
              <p className="text-sm font-bold">Admin Profile Updated Successfully!</p>
              <p className="text-xs font-normal opacity-90">Personal account details &amp; security preferences saved to system database.</p>
            </div>
          </div>
          <span className="text-xs font-mono opacity-80">Just now</span>
        </div>
      )}

      {/* Admin Profile Summary Hero Card */}
      <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-md`}>
        <div
          style={{ backgroundColor: currentTheme.primaryColor }}
          className="absolute top-0 left-0 right-0 h-28 opacity-15"
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Photo with Theme Badge */}
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={`${firstName} ${lastName}`}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150?text=ADMIN";
              }}
            />
            <span
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="absolute -bottom-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border-2 border-white dark:border-zinc-900"
            >
              ✓ Verified
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className={`font-serif text-2xl font-bold ${textTitle}`}>
                  {firstName} {lastName}
                </h1>
                <p className={`text-xs font-medium ${textSub}`}>{designation} • {location}</p>
              </div>

              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-xs border border-emerald-500/30 w-fit mx-auto sm:mx-0">
                ● Super Admin Role
              </span>
            </div>

            <p className={`text-xs max-w-xl ${textSub}`}>{bio}</p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${innerCardBg}`}>
                <span className={textSub}>Store Manager: </span>
                <strong className={textTitle}>Panipat HQ</strong>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${innerCardBg}`}>
                <span className={textSub}>2FA Auth: </span>
                <strong className="text-emerald-600 dark:text-emerald-400">Enabled ✓</strong>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${innerCardBg}`}>
                <span className={textSub}>Email: </span>
                <strong className="font-mono text-amber-600 dark:text-amber-300">{email}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className={`flex gap-2 border-b pb-3 overflow-x-auto no-scrollbar ${borderDivider}`}>
        {[
          { id: "PROFILE" as const, label: "👤 Personal Information", desc: "Name, Phone & HQ Address" },
          { id: "SECURITY" as const, label: "🔐 Security & 2FA Auth", desc: "Password & Two-Factor" },
          { id: "PERMISSIONS" as const, label: "🛡️ Staff Roles & Access", desc: "Permissions & Privileges" },
          { id: "ACTIVITY" as const, label: "📜 Admin Audit Log", desc: "Recent Logins & Actions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? currentTheme.primaryColor : undefined,
            }}
            className={`px-4 py-3 rounded-2xl font-bold transition-all text-left flex flex-col min-w-[180px] ${
              activeTab === tab.id
                ? "text-white shadow-lg"
                : isLight
                ? "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            <span className="text-xs font-bold">{tab.label}</span>
            <span className={`text-[10px] ${activeTab === tab.id ? "text-amber-200" : textSub}`}>{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: PERSONAL INFORMATION ==================== */}
      {activeTab === "PROFILE" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
          <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
            <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Personal Account Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Official Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl p-3 font-mono font-semibold ${bgInput}`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Support WhatsApp Phone *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded-xl p-3 font-mono font-bold text-amber-600 dark:text-amber-300 ${bgInput}`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Designation / Title *</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>HQ Location City *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`font-bold block mb-1 ${textTitle}`}>Profile Photo URL *</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className={`w-full rounded-xl p-3 font-mono text-xs ${bgInput}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`font-bold block mb-1 ${textTitle}`}>Admin Bio / About *</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full rounded-xl p-3 ${bgInput}`}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-98 text-xs flex items-center justify-center gap-2"
            >
              <span>💾 Save Profile Information</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== TAB 2: SECURITY & 2FA ==================== */}
      {activeTab === "SECURITY" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Password Change Card */}
          <form onSubmit={handlePasswordChange} className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
            <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Update Security Password</h2>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl p-3 font-mono ${bgInput}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl p-3 font-mono ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl p-3 font-mono ${bgInput}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: currentTheme.primaryColor }}
                className="text-white font-bold px-6 py-3 rounded-xl shadow-md text-xs"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication (2FA) */}
          <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Two-Factor Authentication (2FA)</h2>
                <p className={`${textSub} text-xs mt-0.5`}>Protect your admin account with Google Authenticator OTP code.</p>
              </div>
              <button
                type="button"
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  is2FAEnabled
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    : "bg-zinc-200 text-zinc-700 border border-zinc-300"
                }`}
              >
                {is2FAEnabled ? "2FA Active ✓" : "Enable 2FA"}
              </button>
            </div>

            {is2FAEnabled && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${innerCardBg}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xl">
                    📱
                  </div>
                  <div>
                    <strong className={`font-bold block text-xs ${textTitle}`}>Google Authenticator Connected</strong>
                    <span className={`${textSub} text-[11px]`}>OTP code required for Panipat HQ logins.</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">STATUS: PROTECTED</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================== TAB 3: STAFF PERMISSIONS ==================== */}
      {activeTab === "PERMISSIONS" && (
        <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6 animate-fade-in`}>
          <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Admin Role &amp; Module Permissions</h2>

          <div className="space-y-3">
            {[
              { module: "Products Catalog & Inventory", level: "Full Access (Create, Edit, Delete)" },
              { module: "Order Management & Shipping", level: "Full Access (Fulfill, Cancel, Refund)" },
              { module: "Customer Records & CRM", level: "Full Access (View, Export, Manage)" },
              { module: "Theme & CMS Customizer Engine", level: "Super Admin Exclusive" },
              { module: "Payment Gateways & Keys", level: "Super Admin Exclusive" },
            ].map((p, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${innerCardBg}`}>
                <strong className={`font-bold text-xs ${textTitle}`}>{p.module}</strong>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-[10px]">
                  {p.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: AUDIT LOG ==================== */}
      {activeTab === "ACTIVITY" && (
        <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6 animate-fade-in`}>
          <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Recent Admin Staff Activity Audit Log</h2>

          <div className="space-y-3">
            {[
              { action: "Updated Store Theme to Crimson Royal & Google Font", time: "10 minutes ago", ip: "103.21.124.5 (Panipat HQ)" },
              { action: "Logged in via Google 2FA Authenticator", time: "42 minutes ago", ip: "103.21.124.5 (Panipat HQ)" },
              { action: "Updated Product Catalog: Heavy Royal Velvet Suit", time: "2 hours ago", ip: "103.21.124.5 (Panipat HQ)" },
              { action: "Fulfilling Order #SAI-9842 (Delhivery Express)", time: "Yesterday at 4:15 PM", ip: "103.21.124.5 (Panipat HQ)" },
            ].map((log, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${innerCardBg}`}>
                <div>
                  <strong className={`font-bold text-xs block ${textTitle}`}>{log.action}</strong>
                  <span className={`${textSub} text-[10px] font-mono`}>{log.ip}</span>
                </div>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-300">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
