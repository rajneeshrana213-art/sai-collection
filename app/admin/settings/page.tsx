"use client";

import React, { useState, useRef } from "react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme, THEME_PRESETS, FONT_PRESETS, ThemeId, FontId } from "@/context/SiteThemeContext";

interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isVisible: boolean;
}

interface PromoCardItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
}

export default function AdminSettingsPage() {
  const { theme } = useAdminTheme();
  const {
    themeId,
    fontId,
    setThemeId,
    setFontId,
    currentTheme,
    customTheme,
    currentFont,
    customFontName,
    updateCustomTheme,
    updateCustomFont,
  } = useSiteTheme();

  const isLight = theme === "light";

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [activeTab, setActiveTab] = useState<"BRANDING" | "HERO" | "NAVBAR" | "PAYMENTS" | "WAREHOUSE" | "SEO" | "THEMES">("BRANDING");
  const [themeSubTab, setThemeSubTab] = useState<"COLORS" | "FONTS">("COLORS");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Custom Theme Creator Form State
  const [customName, setCustomName] = useState(customTheme.name || "My Custom Palette");
  const [customPrimary, setCustomPrimary] = useState(customTheme.primaryColor || "#2563eb");
  const [customSecondary, setCustomSecondary] = useState(customTheme.secondaryColor || "#f59e0b");

  // Custom Font Input State
  const [inputCustomFont, setInputCustomFont] = useState(customFontName || "Bodoni Moda");

  // 1. BRANDING & LOGOS STATE
  const [storeName, setStoreName] = useState("Sai Collection");
  const [storeTagline, setStoreTagline] = useState("Panipat's Premium Ethnic Wear & Wholesale Hub");
  const [brandLogoUrl, setBrandLogoUrl] = useState("/logo.png");
  const [faviconUrl, setFaviconUrl] = useState("/logo.png");

  // 2. HERO SECTION CMS STATE
  const [heroTitle, setHeroTitle] = useState("Royal Velvet & Designer Ethnic Suits");
  const [heroSubtitle, setHeroSubtitle] = useState("Direct from the looms of Panipat. Experience handcrafted Zari work, unstitched dress materials & festive Anarkali sets with doorstep express delivery.");
  const [heroCtaLabel, setHeroCtaLabel] = useState("Shop Festive Collection");
  const [heroCtaLink, setHeroCtaLink] = useState("/products");
  const [heroSecondaryCtaLabel, setHeroSecondaryCtaLabel] = useState("Wholesale Bulk Inquiry");
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState("https://wa.me/919876543210");
  const [heroBgImage, setHeroBgImage] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600");

  // Hero Grid Banners CMS
  const [promoCards, setPromoCards] = useState<PromoCardItem[]>([
    {
      id: "card-1",
      title: "Handspun Chanderi Suits",
      subtitle: "Pure Silk & Gold Zari Weave",
      badge: "FLAT 20% OFF",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      linkUrl: "/products?category=chanderi-silk",
    },
    {
      id: "card-2",
      title: "Heavy Royal Velvet Sets",
      subtitle: "Winter Bridal Collection",
      badge: "HOT SELLER",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      linkUrl: "/products?category=velvet-suits",
    },
    {
      id: "card-3",
      title: "Authentic Phulkari Dupattas",
      subtitle: "Traditional Amritsari Embroidery",
      badge: "NEW DROP",
      imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
      linkUrl: "/products?category=dupattas",
    },
  ]);

  // 3. NAVBAR CATEGORIES CMS STATE
  const [navMenuItems, setNavMenuItems] = useState<NavMenuItem[]>([
    { id: "nav-1", label: "Home", href: "/", isVisible: true },
    { id: "nav-2", label: "All Suits & Sarees", href: "/products", badge: "POPULAR", isVisible: true },
    { id: "nav-3", label: "Winter Velvet", href: "/products?category=velvet-suits", badge: "NEW", isVisible: true },
    { id: "nav-4", label: "Chanderi Silk", href: "/products?category=chanderi-silk", isVisible: true },
    { id: "nav-5", label: "Cotton Everyday", href: "/products?category=daily-cotton", isVisible: true },
    { id: "nav-6", label: "Wholesale Contact", href: "/account", isVisible: true },
  ]);

  const [newNavLabel, setNewNavLabel] = useState("");
  const [newNavHref, setNewNavHref] = useState("");
  const [newNavBadge, setNewNavBadge] = useState("");

  // 4. ANNOUNCEMENT & GENERAL STATE
  const [announcement, setAnnouncement] = useState("✨ FREE Express Shipping on orders over ₹999 | Use Code SAI10 for 10% OFF");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999");
  const [supportEmail, setSupportEmail] = useState("care@saicollection.in");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");

  // 5. PAYMENT GATEWAYS STATE
  const [isCodActive, setIsCodActive] = useState(true);
  const [codOtpRequired, setCodOtpRequired] = useState(true);
  const [codFee, setCodFee] = useState("0");
  const [razorpayMode, setRazorpayMode] = useState<"LIVE" | "TEST">("LIVE");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_live_9a8b7c6d5e4f3a");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("••••••••••••••••••••••••");
  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState("whsec_9876543210");

  // 6. WAREHOUSE STATE
  const [warehouseAddress, setWarehouseAddress] = useState("Model Town Market, Near GT Road");
  const [warehouseCity, setWarehouseCity] = useState("Panipat");
  const [warehouseState, setWarehouseState] = useState("Haryana");
  const [warehousePincode, setWarehousePincode] = useState("132103");
  const [defaultCourier, setDefaultCourier] = useState("Delhivery Express");

  // 7. SEO & SOCIAL STATE
  const [instagramHandle, setInstagramHandle] = useState("@saicollectionpnp");
  const [metaTitle, setMetaTitle] = useState("Sai Collection — Panipat Ethnic Wear & Designer Suits");
  const [metaDescription, setMetaDescription] = useState("Shop handcrafted Anarkali suit sets, designer kurtas, Chanderi sarees & Phulkari dupattas direct from Panipat, Haryana.");

  // Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleApplyCustomTheme = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomTheme(customName, customPrimary, customSecondary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleApplyCustomFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCustomFont) return;
    updateCustomFont(inputCustomFont);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel || !newNavHref) return;

    const newItem: NavMenuItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel,
      href: newNavHref,
      badge: newNavBadge || undefined,
      isVisible: true,
    };

    setNavMenuItems([...navMenuItems, newItem]);
    setNewNavLabel("");
    setNewNavHref("");
    setNewNavBadge("");
  };

  const toggleNavItemVisibility = (id: string) => {
    setNavMenuItems(
      navMenuItems.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const deleteNavItem = (id: string) => {
    setNavMenuItems(navMenuItems.filter((item) => item.id !== id));
  };

  const updatePromoCard = (id: string, field: keyof PromoCardItem, val: string) => {
    setPromoCards(
      promoCards.map((card) => (card.id === id ? { ...card, [field]: val } : card))
    );
  };

  // Theme helper classes
  const bgCard = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-zinc-800";
  const innerCardBg = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-zinc-800";
  const bgInput = isLight ? "bg-white border-zinc-300 text-zinc-900 focus:border-[#9b1c31]" : "bg-zinc-950 border-zinc-800 text-white focus:border-amber-400";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textSub = isLight ? "text-zinc-600" : "text-zinc-400";
  const borderDivider = isLight ? "border-zinc-200" : "border-zinc-800";

  return (
    <div className="space-y-8 text-xs w-full">
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${borderDivider}`}>
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${textTitle}`}>Storefront CMS &amp; Theme Engine</h1>
          <p className={`${textSub} mt-1`}>Customize brand logos, header navbar items, hero promo section, payment gateways, custom color themes &amp; site fonts.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${
            isLight ? "bg-slate-100 text-zinc-800 border-zinc-200" : "bg-zinc-900 text-amber-200 border-zinc-800"
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Theme: {currentTheme.colorDot || "🎨"} {currentTheme.name} | Font: {currentFont.name}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className={`p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg border ${
          isLight ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-emerald-950/90 border-emerald-500/80 text-emerald-300"
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <div>
              <p className="text-sm font-bold">CMS &amp; Theme Settings Updated Live!</p>
              <p className="text-xs font-normal opacity-90">Brand logos, active color palette ({currentTheme.name}), site typography ({currentFont.name}) &amp; payment gateways updated end-to-end.</p>
            </div>
          </div>
          <span className="text-xs font-mono opacity-80">Just now</span>
        </div>
      )}

      {/* 🎠 Interactive Slider Tab Navigation with Left/Right Arrows */}
      <div className="relative flex items-center gap-2 group">
        
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs("left")}
          className={`p-2.5 rounded-2xl border shadow-md shrink-0 transition-all active:scale-95 z-10 ${
            isLight
              ? "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200 shadow-zinc-200/50"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
          }`}
          title="Scroll Tabs Left"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scroll Viewport Container */}
        <div
          ref={tabsContainerRef}
          className={`flex-1 flex gap-2 border-b pb-3 overflow-x-auto no-scrollbar scroll-smooth py-1 ${borderDivider}`}
        >
          {[
            { id: "BRANDING" as const, label: "✨ Logo & Branding", desc: "Logo, Favicon & Brand Name" },
            { id: "HERO" as const, label: "🖼️ Hero & Promo Banners", desc: "Homepage Slider & Promo Grid" },
            { id: "NAVBAR" as const, label: "🧭 Navbar & Menu Builder", desc: "Categories & Header Links" },
            { id: "PAYMENTS" as const, label: "💳 Payment Gateways", desc: "Razorpay & Cash on Delivery" },
            { id: "WAREHOUSE" as const, label: "📦 Panipat Logistics", desc: "Warehouse Address & Courier" },
            { id: "SEO" as const, label: "🌐 SEO & Socials", desc: "Meta descriptions & Instagram" },
            { id: "THEMES" as const, label: "🎨 Theme & Font Engine", desc: "Palettes & Site Typography" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? currentTheme.primaryColor : undefined,
              }}
              className={`px-4 py-3 rounded-2xl font-bold transition-all text-left flex flex-col shrink-0 min-w-[170px] ${
                activeTab === tab.id
                  ? "text-white shadow-lg border border-white/20"
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

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs("right")}
          className={`p-2.5 rounded-2xl border shadow-md shrink-0 transition-all active:scale-95 z-10 ${
            isLight
              ? "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200 shadow-zinc-200/50"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
          }`}
          title="Scroll Tabs Right"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* ==================== TAB 1: BRANDING & LOGO ==================== */}
        {activeTab === "BRANDING" && (
          <div className="space-y-6">
            
            {/* Live Brand Preview Header */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex justify-between items-center pb-3 border-b ${borderDivider}`}>
                <h2 className={`font-serif text-base font-bold ${textTitle}`}>Brand Logo &amp; Header Preview</h2>
                <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold uppercase tracking-wider">Live Store Preview</span>
              </div>

              <div className="bg-[#fdfbf7] p-4 rounded-xl border border-amber-900/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brandLogoUrl}
                    alt="Brand Logo Preview"
                    className="w-10 h-10 object-contain bg-white p-1 rounded-lg border border-zinc-200 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/80?text=SAI";
                    }}
                  />
                  <div>
                    <span className="font-serif text-lg font-bold text-zinc-900 tracking-wide block">{storeName}</span>
                    <span className="text-[9px] text-zinc-500 tracking-[0.15em] font-semibold uppercase">{storeTagline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span
                    style={{ backgroundColor: currentTheme.primaryColor }}
                    className="text-white px-3 py-1.5 rounded-full font-bold shadow-sm"
                  >
                    Shop Now
                  </span>
                </div>
              </div>
            </div>

            {/* Logo Image URLs & Brand Details Form */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Brand Identity Assets</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Header Brand Logo Image URL *</label>
                  <input
                    type="text"
                    value={brandLogoUrl}
                    onChange={(e) => setBrandLogoUrl(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono text-xs ${bgInput}`}
                    placeholder="e.g. /logo.png or https://cdn.site.com/logo.png"
                  />
                  <span className={`text-[10px] ${textSub} mt-1 block`}>Recommended size: 200x200 PNG with transparent background.</span>
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Browser Favicon Icon URL *</label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono text-xs ${bgInput}`}
                  />
                  <span className={`text-[10px] ${textSub} mt-1 block`}>Small 32x32 icon shown on browser tabs.</span>
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Store Brand Title *</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={`w-full rounded-xl p-3 font-bold ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Brand Tagline / Subtitle *</label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className={`w-full rounded-xl p-3 font-medium ${bgInput}`}
                  />
                </div>
              </div>
            </div>

            {/* Top Announcement Bar Configuration */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Top Announcement Bar Text</h2>
              <div>
                <label className={`font-bold block mb-1 ${textTitle}`}>Header Announcement Message *</label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className={`w-full rounded-xl p-3 font-medium ${bgInput}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Free Shipping Threshold (₹) *</label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className={`w-full rounded-xl p-3 font-bold ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Support Customer Email *</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Support WhatsApp Phone *</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: HERO & PROMO BANNERS ==================== */}
        {activeTab === "HERO" && (
          <div className="space-y-6">
            
            {/* Live Storefront Hero Preview */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex justify-between items-center pb-3 border-b ${borderDivider}`}>
                <h2 className={`font-serif text-base font-bold ${textTitle}`}>Homepage Hero Banner CMS</h2>
                <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold uppercase">Live Hero Preview</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden p-8 text-white bg-zinc-950 min-h-[220px] flex flex-col justify-center border border-zinc-800 shadow-md">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40"
                  style={{ backgroundImage: `url('${heroBgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                <div className="relative z-10 max-w-lg space-y-2">
                  <span
                    style={{ backgroundColor: currentTheme.primaryColor }}
                    className="inline-block text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-sm"
                  >
                    Festive Drop &apos;26
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">{heroTitle}</h1>
                  <p className="text-xs text-zinc-300 line-clamp-2">{heroSubtitle}</p>

                  <div className="flex gap-3 pt-2">
                    <span
                      style={{ backgroundColor: currentTheme.primaryColor }}
                      className="text-white px-4 py-2 rounded-full font-bold text-xs shadow-md"
                    >
                      {heroCtaLabel} →
                    </span>
                    <span className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full font-bold text-xs">
                      {heroSecondaryCtaLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Main Content Inputs */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Main Hero Slider Content</h2>

              <div className="space-y-4">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Hero Main Title Headline *</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className={`w-full rounded-xl p-3 font-serif text-sm font-bold ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Hero Subtitle / Description Text *</label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className={`w-full rounded-xl p-3 text-xs ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Hero Background Image URL *</label>
                  <input
                    type="text"
                    value={heroBgImage}
                    onChange={(e) => setHeroBgImage(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono text-xs ${bgInput}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Primary CTA Button Label *</label>
                    <input
                      type="text"
                      value={heroCtaLabel}
                      onChange={(e) => setHeroCtaLabel(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-bold ${bgInput}`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Primary CTA Target URL *</label>
                    <input
                      type="text"
                      value={heroCtaLink}
                      onChange={(e) => setHeroCtaLink(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Secondary Button Label *</label>
                    <input
                      type="text"
                      value={heroSecondaryCtaLabel}
                      onChange={(e) => setHeroSecondaryCtaLabel(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-bold ${bgInput}`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Secondary Button Target URL *</label>
                    <input
                      type="text"
                      value={heroSecondaryCtaLink}
                      onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Homepage Promo Category Cards Grid Manager */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Homepage Featured Promo Cards Grid</h2>

              <div className="space-y-4">
                {promoCards.map((card, idx) => (
                  <div key={card.id} className={`p-4 rounded-xl border space-y-3 ${innerCardBg}`}>
                    <div className={`flex justify-between items-center pb-2 border-b ${borderDivider}`}>
                      <strong className={`font-bold text-xs ${textTitle}`}>Promo Card #{idx + 1}</strong>
                      <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {card.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className={`block mb-0.5 font-bold ${textSub}`}>Title *</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updatePromoCard(card.id, "title", e.target.value)}
                          className={`w-full rounded-lg p-2 font-semibold ${bgInput}`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-0.5 font-bold ${textSub}`}>Subtitle *</label>
                        <input
                          type="text"
                          value={card.subtitle}
                          onChange={(e) => updatePromoCard(card.id, "subtitle", e.target.value)}
                          className={`w-full rounded-lg p-2 ${bgInput}`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-0.5 font-bold ${textSub}`}>Badge Text *</label>
                        <input
                          type="text"
                          value={card.badge}
                          onChange={(e) => updatePromoCard(card.id, "badge", e.target.value)}
                          className={`w-full rounded-lg p-2 font-bold text-amber-600 dark:text-amber-300 ${bgInput}`}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={`block mb-0.5 font-bold ${textSub}`}>Image URL *</label>
                        <input
                          type="text"
                          value={card.imageUrl}
                          onChange={(e) => updatePromoCard(card.id, "imageUrl", e.target.value)}
                          className={`w-full rounded-lg p-2 font-mono text-[11px] ${bgInput}`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-0.5 font-bold ${textSub}`}>Target Link *</label>
                        <input
                          type="text"
                          value={card.linkUrl}
                          onChange={(e) => updatePromoCard(card.id, "linkUrl", e.target.value)}
                          className={`w-full rounded-lg p-2 font-mono text-[11px] text-amber-600 dark:text-amber-300 ${bgInput}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: NAVBAR & MENU BUILDER ==================== */}
        {activeTab === "NAVBAR" && (
          <div className="space-y-6">
            
            {/* Header Navbar Preview */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex justify-between items-center pb-3 border-b ${borderDivider}`}>
                <h2 className={`font-serif text-base font-bold ${textTitle}`}>Navigation Bar Menu Manager</h2>
                <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold uppercase">Header Menu Preview</span>
              </div>

              <div className="bg-[#fdfbf7] p-3 rounded-xl border border-amber-900/10 flex items-center gap-3 overflow-x-auto">
                {navMenuItems
                  .filter((item) => item.isVisible)
                  .map((item) => (
                    <span key={item.id} className="text-xs font-bold text-zinc-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-white shadow-sm border border-zinc-200">
                      {item.label}
                      {item.badge && (
                        <span
                          style={{ backgroundColor: currentTheme.primaryColor }}
                          className="text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  ))}
              </div>
            </div>

            {/* Menu Items Table */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Active Navigation Menu Items</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`${isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-950 text-zinc-400"} font-bold uppercase text-[10px]`}>
                    <tr>
                      <th className="p-3">Label</th>
                      <th className="p-3">Target URL</th>
                      <th className="p-3">Highlight Badge</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderDivider}`}>
                    {navMenuItems.map((item) => (
                      <tr key={item.id} className={isLight ? "hover:bg-zinc-50" : "hover:bg-zinc-800/40"}>
                        <td className={`p-3 font-bold ${textTitle}`}>{item.label}</td>
                        <td className="p-3 font-mono text-amber-600 dark:text-amber-300">{item.href}</td>
                        <td className="p-3">
                          {item.badge ? (
                            <span
                              style={{ backgroundColor: currentTheme.primaryColor }}
                              className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <span className={`${textSub} italic`}>None</span>
                          )}
                        </td>
                        <td className="p-3">
                          {item.isVisible ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Visible</span>
                          ) : (
                            <span className={`${textSub} font-bold`}>Hidden</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => toggleNavItemVisibility(item.id)}
                            className={`px-2.5 py-1 rounded font-bold border ${
                              isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                            }`}
                          >
                            {item.isVisible ? "Hide" : "Show"}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteNavItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Nav Item Form */}
              <div className={`pt-4 border-t ${borderDivider} space-y-3`}>
                <h3 className={`font-serif text-sm font-bold ${textTitle}`}>+ Add New Navbar Category Link</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Silk Sarees)"
                    value={newNavLabel}
                    onChange={(e) => setNewNavLabel(e.target.value)}
                    className={`rounded-xl p-2.5 font-semibold ${bgInput}`}
                  />
                  <input
                    type="text"
                    placeholder="Target URL (e.g. /products?category=silk)"
                    value={newNavHref}
                    onChange={(e) => setNewNavHref(e.target.value)}
                    className={`rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Badge (Optional e.g. HOT)"
                      value={newNavBadge}
                      onChange={(e) => setNewNavBadge(e.target.value)}
                      className={`flex-1 rounded-xl p-2.5 font-bold ${bgInput}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddNavItem}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 border border-amber-500/40 font-bold px-4 py-2.5 rounded-xl shrink-0"
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: PAYMENTS & GATEWAYS ==================== */}
        {activeTab === "PAYMENTS" && (
          <div className="space-y-6">
            
            {/* Cash on Delivery (COD) Options */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex items-center justify-between border-b pb-3 ${borderDivider}`}>
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Cash on Delivery (COD) Options</h2>
                  <p className={`${textSub} text-[11px]`}>Enable doorstep cash payment for Tier-2/3 Indian shoppers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCodActive(!isCodActive)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                    isCodActive
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                      : "bg-zinc-200 text-zinc-700 border border-zinc-300"
                  }`}
                >
                  {isCodActive ? "Active ✓" : "Disabled"}
                </button>
              </div>

              {isCodActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${innerCardBg}`}>
                    <div>
                      <strong className={`block font-bold ${textTitle}`}>Require Phone OTP Verification</strong>
                      <span className={`${textSub} text-[10px]`}>Prevents fake or prank COD orders</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={codOtpRequired}
                      onChange={(e) => setCodOtpRequired(e.target.checked)}
                      className="w-5 h-5 accent-[#9b1c31] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Additional COD Charge (₹)</label>
                    <input
                      type="number"
                      value={codFee}
                      onChange={(e) => setCodFee(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-medium ${bgInput}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Razorpay Online Gateway */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex items-center justify-between border-b pb-3 ${borderDivider}`}>
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Razorpay Payment Gateway</h2>
                  <p className={`${textSub} text-[11px]`}>UPI (GPay/PhonePe/Paytm), Cards, Netbanking</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                    isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}>
                    KYC Verified
                  </span>
                  <select
                    value={razorpayMode}
                    onChange={(e) => setRazorpayMode(e.target.value as "LIVE" | "TEST")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-300 ${bgInput}`}
                  >
                    <option value="LIVE">Live Mode</option>
                    <option value="TEST">Test Sandbox</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Razorpay Key ID *</label>
                  <input
                    type="text"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    className={`w-full rounded-xl p-2.5 font-mono ${bgInput}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Razorpay Key Secret *</label>
                    <input
                      type="password"
                      value={razorpayKeySecret}
                      onChange={(e) => setRazorpayKeySecret(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-mono ${bgInput}`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1 ${textTitle}`}>Razorpay Webhook Secret *</label>
                    <input
                      type="text"
                      value={razorpayWebhookSecret}
                      onChange={(e) => setRazorpayWebhookSecret(e.target.value)}
                      className={`w-full rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 5: WAREHOUSE & LOGISTICS ==================== */}
        {activeTab === "WAREHOUSE" && (
          <div className="space-y-6">
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Panipat Primary Fulfillment Warehouse</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={`font-bold block mb-1 ${textTitle}`}>Street / Landmark Address *</label>
                  <input
                    type="text"
                    value={warehouseAddress}
                    onChange={(e) => setWarehouseAddress(e.target.value)}
                    className={`w-full rounded-xl p-3 font-medium ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>City *</label>
                  <input
                    type="text"
                    value={warehouseCity}
                    onChange={(e) => setWarehouseCity(e.target.value)}
                    className={`w-full rounded-xl p-3 ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>State *</label>
                  <input
                    type="text"
                    value={warehouseState}
                    onChange={(e) => setWarehouseState(e.target.value)}
                    className={`w-full rounded-xl p-3 ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Pincode *</label>
                  <input
                    type="text"
                    value={warehousePincode}
                    onChange={(e) => setWarehousePincode(e.target.value)}
                    className={`w-full rounded-xl p-3 font-mono font-bold text-amber-600 dark:text-amber-300 ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Default Courier Partner *</label>
                  <select
                    value={defaultCourier}
                    onChange={(e) => setDefaultCourier(e.target.value)}
                    className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                  >
                    <option value="Delhivery Express">Delhivery Express</option>
                    <option value="BlueDart Logistics">BlueDart Logistics</option>
                    <option value="Ecom Express">Ecom Express</option>
                    <option value="India Post SpeedPost">India Post SpeedPost</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: SEO & SOCIALS ==================== */}
        {activeTab === "SEO" && (
          <div className="space-y-6">
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <h2 className={`font-serif text-base font-bold ${textTitle}`}>Social Media &amp; SEO Meta Description</h2>

              <div className="space-y-4">
                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>Instagram Official Handle *</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className={`w-full rounded-xl p-3 font-bold text-amber-600 dark:text-amber-300 ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>SEO Homepage Title Tag *</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={`w-full rounded-xl p-3 font-semibold ${bgInput}`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${textTitle}`}>SEO Meta Description *</label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className={`w-full rounded-xl p-3 font-medium ${bgInput}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: ELEGANT LUXURY THEME PRESETS & TYPOGRAPHY STUDIO ==================== */}
        {activeTab === "THEMES" && (
          <div className="space-y-6">
            
            {/* 🔀 Sub-Tab Toggle Switcher: Color Themes vs Website Fonts */}
            <div className="flex justify-center sm:justify-start">
              <div className={`inline-flex p-1.5 rounded-2xl border shadow-sm ${
                isLight ? "bg-slate-200/80 border-zinc-300" : "bg-zinc-950 border-zinc-800"
              }`}>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("COLORS")}
                  style={{
                    backgroundColor: themeSubTab === "COLORS" ? currentTheme.primaryColor : undefined,
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    themeSubTab === "COLORS"
                      ? "text-white shadow-md"
                      : isLight
                      ? "text-zinc-700 hover:text-zinc-900"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>🎨 Color Theme Presets &amp; Custom Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeSubTab("FONTS")}
                  style={{
                    backgroundColor: themeSubTab === "FONTS" ? currentTheme.primaryColor : undefined,
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    themeSubTab === "FONTS"
                      ? "text-white shadow-md"
                      : isLight
                      ? "text-zinc-700 hover:text-zinc-900"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>🔤 Storefront Typography &amp; Google Fonts</span>
                </button>
              </div>
            </div>

            {/* SUB TAB 1: COLOR THEME PRESETS */}
            {themeSubTab === "COLORS" && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Curated Presets Grid Section */}
                <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${borderDivider}`}>
                    <div>
                      <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Curated Storefront &amp; Admin Color Presets</h2>
                      <p className={`${textSub} text-xs mt-0.5`}>Choose a signature Panipat color palette. Re-colors buttons, active tabs, badges &amp; highlights end-to-end.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                        isLight ? "bg-slate-100 text-zinc-900 border-zinc-200" : "bg-zinc-800 text-zinc-100 border-zinc-700"
                      }`}>
                        <span>{currentTheme.colorDot || "✨"}</span>
                        <span>{currentTheme.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Curated Theme Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(THEME_PRESETS).map((t) => {
                      const isActive = themeId === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setThemeId(t.id as ThemeId)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
                            isActive
                              ? "border-[#9b1c31] bg-[#9b1c31]/5 ring-2 ring-[#9b1c31] shadow-md"
                              : isLight
                              ? "bg-white border-zinc-200 hover:border-zinc-300"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Title & Emoji Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{t.colorDot}</span>
                                <h3 className={`font-serif font-bold text-base ${textTitle}`}>{t.name}</h3>
                              </div>
                              {isActive && (
                                <span className="bg-[#9b1c31] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Active
                                </span>
                              )}
                            </div>

                            {/* Dual Color Swatch Bar */}
                            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                              <div
                                style={{ backgroundColor: t.primaryColor }}
                                className="flex-1 h-7 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-mono font-bold text-white"
                              >
                                {t.primaryColor}
                              </div>
                              <div
                                style={{ backgroundColor: t.secondaryColor }}
                                className="flex-1 h-7 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-mono font-bold text-zinc-900"
                              >
                                {t.secondaryColor}
                              </div>
                            </div>

                            <p className={`${textSub} text-xs leading-relaxed`}>{t.description}</p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThemeId(t.id as ThemeId);
                            }}
                            style={{
                              backgroundColor: isActive ? t.primaryColor : undefined,
                            }}
                            className={`w-full font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-98 ${
                              isActive
                                ? "text-white shadow-md"
                                : isLight
                                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
                                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
                            }`}
                          >
                            {isActive ? "✓ Currently Active" : `Apply ${t.name}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ✨ Custom Theme Studio (Standalone Card) */}
                <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${borderDivider}`}>
                    <div>
                      <h2 className={`font-serif text-lg font-bold ${textTitle}`}>✨ Custom Color Theme Studio</h2>
                      <p className={`${textSub} text-xs mt-0.5`}>Design your own custom brand color palette with real-time button &amp; badge preview.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full w-fit">
                      Custom Studio Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Controls */}
                    <div className="space-y-4">
                      <div>
                        <label className={`font-bold block mb-1.5 ${textTitle}`}>Custom Theme Name *</label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className={`w-full rounded-xl p-3 font-bold text-sm ${bgInput}`}
                          placeholder="e.g. Royal Panipat Gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`font-bold block mb-1.5 ${textTitle}`}>Primary Color (Buttons &amp; Badges) *</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customPrimary}
                              onChange={(e) => setCustomPrimary(e.target.value)}
                              className="w-12 h-11 rounded-xl cursor-pointer p-0.5 border border-zinc-300 dark:border-zinc-700 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={customPrimary}
                              onChange={(e) => setCustomPrimary(e.target.value)}
                              className={`flex-1 rounded-xl p-3 font-mono font-bold text-xs uppercase ${bgInput}`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`font-bold block mb-1.5 ${textTitle}`}>Secondary Color (Gold / Accents) *</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customSecondary}
                              onChange={(e) => setCustomSecondary(e.target.value)}
                              className="w-12 h-11 rounded-xl cursor-pointer p-0.5 border border-zinc-300 dark:border-zinc-700 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={customSecondary}
                              onChange={(e) => setCustomSecondary(e.target.value)}
                              className={`flex-1 rounded-xl p-3 font-mono font-bold text-xs uppercase ${bgInput}`}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyCustomTheme}
                        style={{ backgroundColor: customPrimary }}
                        className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-98 text-xs flex items-center justify-center gap-2 mt-2"
                      >
                        <span>✨ Save &amp; Apply Custom Theme</span>
                      </button>
                    </div>

                    {/* Real-time Component Preview Mockup */}
                    <div className={`p-5 rounded-2xl border space-y-4 ${innerCardBg}`}>
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="font-bold text-xs">Live Storefront Preview</span>
                        <span
                          style={{ backgroundColor: customPrimary }}
                          className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                        >
                          Festive Offer
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: customPrimary }}
                            className="w-10 h-10 rounded-lg text-white font-bold flex items-center justify-center"
                          >
                            SAI
                          </div>
                          <div>
                            <strong className="font-bold text-xs block">{customName}</strong>
                            <span className="text-[10px] text-zinc-500 font-mono">Primary: {customPrimary}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          style={{ backgroundColor: customPrimary }}
                          className="text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                        >
                          Shop Collection →
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="font-semibold text-zinc-500">Accent Color Preview:</span>
                        <span
                          style={{ backgroundColor: customSecondary }}
                          className="px-3 py-1 rounded-full font-bold text-zinc-900 shadow-sm font-mono text-[10px]"
                        >
                          {customSecondary}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB TAB 2: STOREFRONT TYPOGRAPHY & GOOGLE FONTS */}
            {themeSubTab === "FONTS" && (
              <div className="space-y-8 animate-fade-in">
                
                {/* 🔤 Global Site Typography & Font Studio Section */}
                <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${borderDivider}`}>
                    <div>
                      <h2 className={`font-serif text-lg font-bold ${textTitle}`}>🔤 Global Storefront Typography &amp; Font Presets</h2>
                      <p className={`${textSub} text-xs mt-0.5`}>Change heading and body font pairings across the entire website end-to-end.</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${
                      isLight ? "bg-slate-100 text-zinc-900 border-zinc-200" : "bg-zinc-800 text-zinc-100 border-zinc-700"
                    }`}>
                      Current Font: {currentFont.name}
                    </span>
                  </div>

                  {/* Font Presets Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(FONT_PRESETS).map((f) => {
                      const isActive = fontId === f.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => setFontId(f.id as FontId)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
                            isActive
                              ? "border-[#9b1c31] bg-[#9b1c31]/5 ring-2 ring-[#9b1c31] shadow-md"
                              : isLight
                              ? "bg-white border-zinc-200 hover:border-zinc-300"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-serif font-bold text-base ${textTitle}`}>{f.name}</h3>
                              {isActive && (
                                <span className="bg-[#9b1c31] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Active Font
                                </span>
                              )}
                            </div>

                            {/* Live Font Sample Preview */}
                            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-1">
                              <span
                                style={{ fontFamily: f.headingFont }}
                                className="block font-bold text-sm text-zinc-900 dark:text-zinc-100"
                              >
                                Sai Collection Velvet
                              </span>
                              <span
                                style={{ fontFamily: f.bodyFont }}
                                className="block text-[11px] text-zinc-600 dark:text-zinc-400"
                              >
                                Panipat ethnic suit sets &amp; silk sarees.
                              </span>
                            </div>

                            <p className={`${textSub} text-xs leading-relaxed`}>{f.description}</p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFontId(f.id as FontId);
                            }}
                            style={{
                              backgroundColor: isActive ? currentTheme.primaryColor : undefined,
                            }}
                            className={`w-full font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-98 ${
                              isActive
                                ? "text-white shadow-md"
                                : isLight
                                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
                                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
                            }`}
                          >
                            {isActive ? "✓ Font Active" : `Apply ${f.name}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Google Font Loader Form */}
                  <div className={`p-6 rounded-2xl border space-y-4 pt-6 border-t ${borderDivider}`}>
                    <h3 className={`font-serif text-base font-bold ${textTitle}`}>✨ Custom Google Font Name Loader</h3>
                    <p className={`${textSub} text-xs`}>Type any font family from <a href="https://fonts.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-amber-600">Google Fonts</a> (e.g. <code>Bodoni Moda</code>, <code>Great Vibes</code>, <code>Cinzel</code>, <code>Italiana</code>) to load it live.</p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={inputCustomFont}
                        onChange={(e) => setInputCustomFont(e.target.value)}
                        placeholder="e.g. Bodoni Moda"
                        className={`flex-1 rounded-xl p-3 font-semibold ${bgInput}`}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomFont}
                        style={{ backgroundColor: currentTheme.primaryColor }}
                        className="text-white font-bold px-6 py-3 rounded-xl shadow-md text-xs shrink-0"
                      >
                        <span>Load Custom Google Font</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Save All Settings Action Bar */}
        <div className="pt-4">
          <button
            type="submit"
            style={{ backgroundColor: currentTheme.primaryColor }}
            className="w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <span>💾 Save All CMS &amp; Store Configurations</span>
          </button>
        </div>

      </form>

    </div>
  );
}
