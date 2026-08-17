"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useSiteTheme, THEME_PRESETS, FONT_PRESETS, ThemeId, FontId } from "@/context/SiteThemeContext";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";

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

interface HeroSlideItem {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  targetLinkUrl: string;
  title?: string;
}

const DEFAULT_NAV_MENU_ITEMS: NavMenuItem[] = [
  { id: "nav-1", label: "Home", href: "/", isVisible: true },
  { id: "nav-2", label: "Shop By Category", href: "/products", isVisible: true },
  { id: "nav-3", label: "New Arrivals", href: "/products?category=new-arrivals", isVisible: true },
  { id: "nav-4", label: "All Products", href: "/products", isVisible: true },
  { id: "nav-5", label: "Sale", href: "/products?onSale=true", badge: "HOT", isVisible: true },
  { id: "nav-6", label: "About Us", href: "/about", isVisible: true },
];

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
  const [storeTagline, setStoreTagline] = useState("Premium Ethnic Wear");
  const [brandLogoUrl, setBrandLogoUrl] = useState("/logo.png");
  const [faviconUrl, setFaviconUrl] = useState("/logo.png");

  // 2. HERO SECTION PURE IMAGE BANNERS CMS STATE
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([
    {
      id: "hero-slide-1",
      desktopImageUrl: "/cover-page.png",
      mobileImageUrl: "/cover-page.png",
      targetLinkUrl: "/products",
      title: "Festive Collection '26 Banner",
    },
  ]);

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
  const [navMenuItems, setNavMenuItems] = useState<NavMenuItem[]>(DEFAULT_NAV_MENU_ITEMS);

  const [editingNavItem, setEditingNavItem] = useState<NavMenuItem | null>(null);

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

  const [announcementsList, setAnnouncementsList] = useState<string[]>([
    "✨ Panipat's Premier Ethnic Wear — Handcrafted Suit Sets & Designer Cordsets",
    "📹 Please check size guide video before placing your order",
    "🚚 Cash On Delivery & Free Shipping Available Across India",
  ]);
  const [newAnnouncementInput, setNewAnnouncementInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettingsFromApi() {
      try {
        const res = await apiClient.get<{ settings?: Record<string, unknown> }>("/api/v1/admin/settings");
        if (res?.settings) {
          const s = res.settings;
          if (typeof s.storeName === "string" && s.storeName.trim()) setStoreName(s.storeName);
          if (typeof s.storeTagline === "string" && s.storeTagline.trim()) setStoreTagline(s.storeTagline);
          if (typeof s.brandLogoUrl === "string") setBrandLogoUrl(s.brandLogoUrl);
          if (typeof s.faviconUrl === "string") setFaviconUrl(s.faviconUrl);
          if (typeof s.announcement === "string") setAnnouncement(s.announcement);
          if (Array.isArray(s.announcements)) {
            setAnnouncementsList(s.announcements.map((a: unknown) => String(a)));
          }
          if (typeof s.freeShippingThreshold === "string") setFreeShippingThreshold(s.freeShippingThreshold);
          if (typeof s.supportEmail === "string") setSupportEmail(s.supportEmail);
          if (typeof s.supportPhone === "string") setSupportPhone(s.supportPhone);
          if (typeof s.isCodActive === "boolean") setIsCodActive(s.isCodActive);
          if (typeof s.codFee === "string") setCodFee(s.codFee);
          if (typeof s.warehouseAddress === "string") setWarehouseAddress(s.warehouseAddress);
          if (typeof s.warehouseCity === "string") setWarehouseCity(s.warehouseCity);
          if (typeof s.warehouseState === "string") setWarehouseState(s.warehouseState);
          if (typeof s.warehousePincode === "string") setWarehousePincode(s.warehousePincode);
          if (typeof s.metaTitle === "string") setMetaTitle(s.metaTitle);
          if (typeof s.metaDescription === "string") setMetaDescription(s.metaDescription);
          if (Array.isArray(s.heroSlides) && s.heroSlides.length > 0) {
            setHeroSlides(s.heroSlides as HeroSlideItem[]);
          }
          if (Array.isArray(s.navMenuItems) && s.navMenuItems.length > 0) {
            const hasOldMockData = (s.navMenuItems as Array<{ label: string }>).some(
              (i) => i.label === "All Suits & Sarees" || i.label === "Winter Velvet" || i.label === "Cotton Everyday"
            );
            if (hasOldMockData) {
              setNavMenuItems(DEFAULT_NAV_MENU_ITEMS);
              apiClient.put("/api/v1/admin/settings", { settings: { navMenuItems: DEFAULT_NAV_MENU_ITEMS } });
            } else {
              setNavMenuItems(s.navMenuItems as NavMenuItem[]);
            }
          } else {
            setNavMenuItems(DEFAULT_NAV_MENU_ITEMS);
            apiClient.put("/api/v1/admin/settings", { settings: { navMenuItems: DEFAULT_NAV_MENU_ITEMS } });
          }
        }
      } catch (err) {
        console.warn("Failed to load settings from API", err);
      }
    }
    loadSettingsFromApi();
  }, []);

  // Handlers
  const handleAddHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlide: HeroSlideItem = {
      id: `hero-${Date.now()}`,
      desktopImageUrl: "/cover-page.png",
      mobileImageUrl: "/cover-page.png",
      targetLinkUrl: "/products",
      title: `Hero Slide ${heroSlides.length + 1}`,
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleDeleteHeroSlide = (id: string) => {
    setHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const updateHeroSlide = (id: string, field: keyof HeroSlideItem, val: string) => {
    setHeroSlides(heroSlides.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updatedAnnouncements = [...announcementsList];
    if (newAnnouncementInput.trim()) {
      updatedAnnouncements.push(newAnnouncementInput.trim());
      setAnnouncementsList(updatedAnnouncements);
      setNewAnnouncementInput("");
    }

    let updatedNavItems = [...navMenuItems];
    if (newNavLabel.trim() && newNavHref.trim()) {
      const newItem: NavMenuItem = {
        id: `nav-${Date.now()}`,
        label: newNavLabel.trim(),
        href: newNavHref.trim(),
        badge: newNavBadge.trim() || undefined,
        isVisible: true,
      };
      updatedNavItems.push(newItem);
      setNavMenuItems(updatedNavItems);
      setNewNavLabel("");
      setNewNavHref("");
      setNewNavBadge("");
    }

    try {
      const payload = {
        settings: {
          storeName,
          storeTagline,
          brandLogoUrl,
          faviconUrl,
          announcement,
          announcements: updatedAnnouncements,
          heroSlides,
          freeShippingThreshold,
          supportEmail,
          supportPhone,
          navMenuItems: updatedNavItems,
          promoCards,
          isCodActive,
          codFee,
          warehouseAddress,
          warehouseCity,
          warehouseState,
          warehousePincode,
          defaultCourier,
          instagramHandle,
          metaTitle,
          metaDescription,
        },
      };
      await apiClient.put("/api/v1/admin/settings", payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save settings to API", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAnnouncement = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = newAnnouncementInput.trim();
    if (!trimmed) return;
    setAnnouncementsList((prev) => [...prev, trimmed]);
    setNewAnnouncementInput("");
  };

  const handleDeleteAnnouncement = (index: number) => {
    setAnnouncementsList(announcementsList.filter((_, i) => i !== index));
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

  const persistNavItems = async (updated: NavMenuItem[]) => {
    setNavMenuItems(updated);
    try {
      await apiClient.put("/api/v1/admin/settings", {
        settings: {
          navMenuItems: updated,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to persist nav items to DB", err);
    }
  };

  const handleAddNavItem = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!newNavLabel.trim() || !newNavHref.trim()) return;

    const newItem: NavMenuItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      href: newNavHref.trim(),
      badge: newNavBadge.trim() || undefined,
      isVisible: true,
    };

    const updated = [...navMenuItems, newItem];
    setNewNavLabel("");
    setNewNavHref("");
    setNewNavBadge("");
    await persistNavItems(updated);
  };

  const toggleNavItemVisibility = async (id: string) => {
    const updated = navMenuItems.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    await persistNavItems(updated);
  };

  const deleteNavItem = async (id: string) => {
    const updated = navMenuItems.filter((item) => item.id !== id);
    await persistNavItems(updated);
  };

  const handleOpenEditNavItem = (item: NavMenuItem) => {
    setEditingNavItem({ ...item });
  };

  const handleSaveEditNavItem = async () => {
    if (!editingNavItem) return;
    const updated = navMenuItems.map((item) =>
      item.id === editingNavItem.id ? editingNavItem : item
    );
    setEditingNavItem(null);
    await persistNavItems(updated);
  };

  const moveNavItem = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navMenuItems.length) return;
    const updated = [...navMenuItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    await persistNavItems(updated);
  };

  const handleResetDefaultNavItems = async () => {
    await persistNavItems(DEFAULT_NAV_MENU_ITEMS);
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

        {/* <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${
            isLight ? "bg-slate-100 text-zinc-800 border-zinc-200" : "bg-zinc-900 text-amber-200 border-zinc-800"
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Theme: {currentTheme.colorDot || "🎨"} {currentTheme.name} | Font: {currentFont.name}
          </span>
        </div> */}
      </div>

      {savedSuccess && (
        <div className={`p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg border ${isLight ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-emerald-950/90 border-emerald-500/80 text-emerald-300"
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
          className={`p-2.5 rounded-2xl border shadow-md shrink-0 transition-all active:scale-95 z-10 ${isLight
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
            { id: "BRANDING" as const, label: " Logo & Branding", desc: "Logo, Favicon & Brand Name" },
            { id: "HERO" as const, label: " Hero & Promo Banners", desc: "Homepage Slider & Promo Grid" },
            { id: "NAVBAR" as const, label: " Navbar & Menu Builder", desc: "Categories & Header Links" },
            { id: "PAYMENTS" as const, label: " Payment Gateways", desc: "Razorpay & Cash on Delivery" },
            { id: "WAREHOUSE" as const, label: " Panipat Logistics", desc: "Warehouse Address & Courier" },
            { id: "SEO" as const, label: " SEO & Socials", desc: "Meta descriptions & Instagram" },
            { id: "THEMES" as const, label: " Theme & Font Engine", desc: "Palettes & Site Typography" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? currentTheme.primaryColor : undefined,
              }}
              className={`px-4 py-3 rounded-2xl font-bold transition-all text-left flex flex-col shrink-0 min-w-[170px] ${activeTab === tab.id
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
          className={`p-2.5 rounded-2xl border shadow-md shrink-0 transition-all active:scale-95 z-10 ${isLight
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

            {/* Live Brand Preview Card */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className={`flex justify-between items-center pb-3 border-b ${borderDivider}`}>
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Live Brand Logo &amp; Header Preview</h2>
                  <p className={`text-xs ${textSub}`}>How your store name, tagline, and logo appear on the customer storefront header.</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold uppercase px-3 py-1 rounded-full border border-amber-300">
                  Live Preview
                </span>
              </div>

              <div className="bg-[#fdfbf7] p-5 rounded-xl border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {brandLogoUrl && brandLogoUrl !== "/logo.png" ? (
                    <Image
                      src={brandLogoUrl}
                      alt="Brand Logo Preview"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain bg-white p-1 rounded-lg border border-zinc-200 shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/logo.png";
                      }}
                    />
                  ) : null}
                  <div className="flex flex-col">
                    <span className="font-great-vibes text-3xl sm:text-4xl font-normal text-zinc-950 capitalize leading-none pt-1">
                      {storeName || "Sai Collection"}
                    </span>
                    <span className="text-[9px] font-sans font-extrabold tracking-[0.25em] text-[#b45309] uppercase mt-1">
                      {storeTagline || "PANIPAT ETHNIC WEAR"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span
                    style={{ backgroundColor: currentTheme.primaryColor }}
                    className="text-white px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-wider text-[11px]"
                  >
                    Cart (0)
                  </span>
                </div>
              </div>
            </div>

            {/* Brand Identity Form Controls */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-5`}>
              <div className={`border-b pb-3 ${borderDivider}`}>
                <h2 className={`font-serif text-base font-bold ${textTitle}`}>Brand Identity &amp; Logo Settings</h2>
                <p className={`text-xs ${textSub}`}>Configure your store name, tagline, custom brand logo image, and favicon icon.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Store / Brand Name */}
                <div>
                  <label className={`font-bold block mb-1.5 ${textTitle}`}>Store / Brand Name (Main Header Title) *</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Sai Collection"
                    className={`w-full rounded-xl p-3 font-bold text-xs ${bgInput}`}
                    required
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Main cursive header title displayed on top of the website.</p>
                </div>

                {/* 2. Store Tagline */}
                <div>
                  <label className={`font-bold block mb-1.5 ${textTitle}`}>Store Tagline (Sub-Logo Text) *</label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    placeholder="e.g. PANIPAT ETHNIC WEAR"
                    className={`w-full rounded-xl p-3 font-bold text-xs ${bgInput}`}
                    required
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Subtitle displayed in uppercase below store name (e.g. PANIPAT ETHNIC WEAR).</p>
                </div>

                {/* 3. Brand Logo Image URL & File Upload */}
                <div>
                  <label className={`font-bold block mb-1.5 ${textTitle}`}>Brand Logo Image (Optional Image File / URL)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={brandLogoUrl}
                      onChange={(e) => setBrandLogoUrl(e.target.value)}
                      placeholder="/logo.png or image URL"
                      className={`flex-1 rounded-xl p-3 font-medium text-xs ${bgInput}`}
                    />
                    <label className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-3 rounded-xl text-xs cursor-pointer shrink-0 transition-colors shadow">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, setBrandLogoUrl)}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">PNG or SVG transparent logo image file or URL.</p>
                </div>

                {/* 4. Favicon Icon Image URL & File Upload */}
                <div>
                  <label className={`font-bold block mb-1.5 ${textTitle}`}>Browser Favicon Icon (File / URL)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="/favicon.ico or image URL"
                      className={`flex-1 rounded-xl p-3 font-medium text-xs ${bgInput}`}
                    />
                    <label className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-3 rounded-xl text-xs cursor-pointer shrink-0 transition-colors shadow">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, setFaviconUrl)}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Icon displayed on browser tabs (.ico, .png).</p>
                </div>
              </div>
            </div>


            {/* Top Announcement Bar Configuration & Multi-Slide Ticker */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-5`}>
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Top Announcement Bar Ticker</h2>
                  <p className={`text-xs ${textSub}`}>Add or remove dynamic messages that auto-rotate at the top of every page.</p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {announcementsList.length} Active Slides
                </span>
              </div>

              {/* Announcements List Manager */}
              {announcementsList.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-2">
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    No active slides added yet. Type a message below and click &quot;+ Add Slide&quot; or press Enter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAnnouncementsList([
                      "✨ Panipat's Premier Ethnic Wear — Handcrafted Suit Sets & Designer Cordsets",
                      "📹 Please check size guide video before placing your order",
                      "🚚 Cash On Delivery & Free Shipping Available Across India",
                    ])}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                  >
                    ↺ Restore Default Slides
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcementsList.map((msg, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${innerCardBg}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-amber-900/10 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={msg}
                          onChange={(e) => {
                            const updated = [...announcementsList];
                            updated[idx] = e.target.value;
                            setAnnouncementsList(updated);
                          }}
                          className={`w-full bg-transparent font-medium text-xs focus:outline-none ${textTitle}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(idx)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors shrink-0"
                      >
                        Delete ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Announcement Slide */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newAnnouncementInput}
                  onChange={(e) => setNewAnnouncementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAnnouncement(e);
                    }
                  }}
                  placeholder="e.g. 📹 Please check size guide video before placing your order"
                  className={`flex-1 rounded-xl p-3 font-medium text-xs ${bgInput}`}
                />
                <button
                  type="button"
                  onClick={handleAddAnnouncement}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow shrink-0"
                >
                  + Add Slide
                </button>
              </div>
              {/* Additional General Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
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

            {/* Banner Dimensions & Image Specifications Guide */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
                <h2 className={`font-serif text-base font-bold ${textTitle}`}>Homepage Hero Banner Specifications</h2>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Pure Image Banners (No Text Overlay)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${innerCardBg} space-y-1.5`}>
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-600 dark:text-amber-400">
                    <span>🖥️ Desktop Banner Recommended Size</span>
                  </div>
                  <p className={`text-sm font-bold font-mono ${textTitle}`}>1920 × 600 px <span className="text-xs font-normal text-zinc-500">(16:5 Aspect Ratio)</span></p>
                  <p className={`text-[11px] ${textSub}`}>Landscape banner designed for wide desktop monitors &amp; laptop screens.</p>
                </div>

                <div className={`p-4 rounded-xl border ${innerCardBg} space-y-1.5`}>
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    <span>📱 Mobile Banner Recommended Size</span>
                  </div>
                  <p className={`text-sm font-bold font-mono ${textTitle}`}>800 × 800 px <span className="text-xs font-normal text-zinc-500">(1:1 Square Ratio)</span></p>
                  <p className={`text-[11px] ${textSub}`}>Square or portrait banner designed for mobile screens &amp; smartphones.</p>
                </div>
              </div>
            </div>

            {/* Hero Image Slides Manager */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-5`}>
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Hero Banner Image Slides ({heroSlides.length})</h2>
                  <p className={`text-xs ${textSub}`}>Add clickable banner photos and destination links. Clicking anywhere on the banner slide opens the target URL.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="bg-[#9b1c31] hover:bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow"
                >
                  + Add Hero Slide
                </button>
              </div>

              <div className="space-y-6">
                {heroSlides.map((slide, idx) => (
                  <div key={slide.id} className={`p-5 rounded-2xl border space-y-4 ${innerCardBg}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#9b1c31] text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <strong className={`font-bold text-xs ${textTitle}`}>Hero Slide #{idx + 1}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteHeroSlide(slide.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                      >
                        Delete Slide ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Thumbnail Preview */}
                      <div className="md:col-span-3 space-y-3">
                        <div>
                          <span className={`text-[11px] font-bold block ${textTitle} mb-1`}>🖥️ Desktop Preview (16:5)</span>
                          <div className="relative aspect-[16/5] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.desktopImageUrl || "/cover-page.png"}
                              alt={slide.title || "Desktop Banner Preview"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/cover-page.png";
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <span className={`text-[11px] font-bold block ${textTitle} mb-1`}>📱 Mobile Preview (1:1 Square)</span>
                          <div className="relative aspect-square w-24 rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.mobileImageUrl || slide.desktopImageUrl || "/cover-page.png"}
                              alt={slide.title || "Mobile Banner Preview"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/cover-page.png";
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Input Fields */}
                      <div className="md:col-span-9 space-y-3">
                        <div>
                          <label className={`font-bold block mb-1 ${textTitle}`}>Slide Reference Title / Alt Tag *</label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => updateHeroSlide(slide.id, "title", e.target.value)}
                            placeholder="e.g. Festive Anarkali Drop '26 Banner"
                            className={`w-full rounded-xl p-2.5 font-bold ${bgInput}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className={`font-bold block ${textTitle}`}>Desktop Image URL (1920x600 px) *</label>
                              <label className="text-[10px] font-bold text-amber-600 dark:text-amber-300 hover:underline cursor-pointer">
                                📁 Upload Image File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, (dataUrl) => updateHeroSlide(slide.id, "desktopImageUrl", dataUrl))}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={slide.desktopImageUrl}
                              onChange={(e) => updateHeroSlide(slide.id, "desktopImageUrl", e.target.value)}
                              placeholder="/cover-page.png or https://cdn.com/banner.png"
                              className={`w-full rounded-xl p-2.5 font-mono text-xs ${bgInput}`}
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className={`font-bold block ${textTitle}`}>Mobile Image URL (800x800 px)</label>
                              <label className="text-[10px] font-bold text-amber-600 dark:text-amber-300 hover:underline cursor-pointer">
                                📱 Upload Mobile File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, (dataUrl) => updateHeroSlide(slide.id, "mobileImageUrl", dataUrl))}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={slide.mobileImageUrl || ""}
                              onChange={(e) => updateHeroSlide(slide.id, "mobileImageUrl", e.target.value)}
                              placeholder="Optional mobile square image URL"
                              className={`w-full rounded-xl p-2.5 font-mono text-xs ${bgInput}`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`font-bold block mb-1 ${textTitle}`}>Banner Click Target URL *</label>
                          <input
                            type="text"
                            value={slide.targetLinkUrl}
                            onChange={(e) => updateHeroSlide(slide.id, "targetLinkUrl", e.target.value)}
                            placeholder="e.g. /products or /products?category=anarkali"
                            className={`w-full rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 text-xs ${bgInput}`}
                          />
                          <span className={`text-[10px] ${textSub} mt-1 block`}>Where the user is taken when clicking on this hero banner slide.</span>
                        </div>
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



            {/* Menu Items Table */}
            <div className={`${bgCard} p-6 rounded-2xl border space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className={`font-serif text-base font-bold ${textTitle}`}>Active Navigation Menu Items</h2>
                  <p className={`text-xs ${textSub}`}>Add, edit, reorder, or hide menu items displayed on the customer storefront header.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefaultNavItems}
                    className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
                    title="Reset to default 6 links (Home, Shop By Category, New Arrivals, All Products, Sale, About Us)"
                  >
                    ↺ Reset to Default 6 Links
                  </button>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {navMenuItems.length} Total Links
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`${isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-950 text-zinc-400"} font-bold uppercase text-[10px]`}>
                    <tr>
                      <th className="p-3 w-16">Order</th>
                      <th className="p-3">Label</th>
                      <th className="p-3">Target URL</th>
                      <th className="p-3">Highlight Badge</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderDivider}`}>
                    {navMenuItems.map((item, idx) => (
                      <tr key={item.id} className={isLight ? "hover:bg-zinc-50" : "hover:bg-zinc-800/40"}>
                        {/* Order Re-arrange */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveNavItem(idx, "up")}
                              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === navMenuItems.length - 1}
                              onClick={() => moveNavItem(idx, "down")}
                              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                        </td>
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
                        <td className="p-3 text-right space-x-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditNavItem(item)}
                            className="px-2.5 py-1 rounded font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-sm transition-colors"
                          >
                            ✏️ Edit
                          </button>

                          {/* Hide / Show Button */}
                          <button
                            type="button"
                            onClick={() => toggleNavItemVisibility(item.id)}
                            className={`px-2.5 py-1 rounded font-bold border text-xs ${
                              isLight
                                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                            }`}
                          >
                            {item.isVisible ? "Hide" : "Show"}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => deleteNavItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1 text-xs"
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
                <h3 className={`font-serif text-sm font-bold ${textTitle}`}>+ Add New Navbar Link</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Silk Sarees)"
                    value={newNavLabel}
                    onChange={(e) => setNewNavLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNavItem(e);
                      }
                    }}
                    className={`rounded-xl p-2.5 font-semibold ${bgInput}`}
                  />
                  <input
                    type="text"
                    placeholder="Target URL (e.g. /products?category=silk)"
                    value={newNavHref}
                    onChange={(e) => setNewNavHref(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNavItem(e);
                      }
                    }}
                    className={`rounded-xl p-2.5 font-mono text-amber-600 dark:text-amber-300 ${bgInput}`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Badge (Optional e.g. HOT)"
                      value={newNavBadge}
                      onChange={(e) => setNewNavBadge(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNavItem(e);
                        }
                      }}
                      className={`flex-1 rounded-xl p-2.5 font-bold ${bgInput}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddNavItem}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors shadow"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ✏️ Edit Navigation Item Modal Overlay */}
            {editingNavItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 ${
                  isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-zinc-100"
                }`}>
                  <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-serif text-lg font-bold">✏️ Edit Navigation Link</h3>
                    <button
                      type="button"
                      onClick={() => setEditingNavItem(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    {/* Label Input */}
                    <div>
                      <label className="block mb-1 font-bold">Link Label *</label>
                      <input
                        type="text"
                        value={editingNavItem.label}
                        onChange={(e) => setEditingNavItem({ ...editingNavItem, label: e.target.value })}
                        className={`w-full rounded-xl p-3 font-bold ${bgInput}`}
                        placeholder="e.g. Sale"
                      />
                    </div>

                    {/* Target URL Input */}
                    <div>
                      <label className="block mb-1 font-bold">Target URL / Route *</label>
                      <input
                        type="text"
                        value={editingNavItem.href}
                        onChange={(e) => setEditingNavItem({ ...editingNavItem, href: e.target.value })}
                        className={`w-full rounded-xl p-3 font-mono ${bgInput}`}
                        placeholder="e.g. /products?onSale=true"
                      />
                    </div>

                    {/* Highlight Badge Input */}
                    <div>
                      <label className="block mb-1 font-bold">Highlight Badge (Optional)</label>
                      <input
                        type="text"
                        value={editingNavItem.badge || ""}
                        onChange={(e) => setEditingNavItem({ ...editingNavItem, badge: e.target.value })}
                        className={`w-full rounded-xl p-3 font-bold ${bgInput}`}
                        placeholder="e.g. HOT or NEW"
                      />
                    </div>

                    {/* Visibility Switch */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <span className="font-bold">Display Status on Header</span>
                      <button
                        type="button"
                        onClick={() => setEditingNavItem({ ...editingNavItem, isVisible: !editingNavItem.isVisible })}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          editingNavItem.isVisible
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {editingNavItem.isVisible ? "✓ Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingNavItem(null)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditNavItem}
                      style={{ backgroundColor: currentTheme.primaryColor }}
                      className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
                    >
                      ✓ Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                  className={`px-4 py-2 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${isCodActive
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
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${isLight ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-emerald-950 text-emerald-300 border-emerald-800"
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

            <div className="flex justify-center sm:justify-start">
              <div className={`inline-flex p-1.5 rounded-2xl border shadow-sm ${isLight ? "bg-slate-200/80 border-zinc-300" : "bg-zinc-950 border-zinc-800"
                }`}>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("COLORS")}
                  style={{
                    backgroundColor: themeSubTab === "COLORS" ? currentTheme.primaryColor : undefined,
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${themeSubTab === "COLORS"
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${themeSubTab === "FONTS"
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

            {themeSubTab === "COLORS" && (
              <div className="space-y-8 animate-fade-in">

                <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${borderDivider}`}>
                    <div>
                      <h2 className={`font-serif text-lg font-bold ${textTitle}`}>Curated Storefront &amp; Admin Color Presets</h2>
                      <p className={`${textSub} text-xs mt-0.5`}>Choose a signature Panipat color palette. Re-colors buttons, active tabs, badges &amp; highlights end-to-end.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${isLight ? "bg-slate-100 text-zinc-900 border-zinc-200" : "bg-zinc-800 text-zinc-100 border-zinc-700"
                        }`}>
                        <span>{currentTheme.colorDot || "✨"}</span>
                        <span>{currentTheme.name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(THEME_PRESETS).map((t) => {
                      const isActive = themeId === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setThemeId(t.id as ThemeId)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${isActive
                            ? "border-[#9b1c31] bg-[#9b1c31]/5 ring-2 ring-[#9b1c31] shadow-md"
                            : isLight
                              ? "bg-white border-zinc-200 hover:border-zinc-300"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                            }`}
                        >
                          <div className="space-y-3">
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
                            className={`w-full font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-98 ${isActive
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

            {themeSubTab === "FONTS" && (
              <div className="space-y-8 animate-fade-in">

                <div className={`${bgCard} p-6 sm:p-8 rounded-3xl border space-y-6`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${borderDivider}`}>
                    <div>
                      <h2 className={`font-serif text-lg font-bold ${textTitle}`}>🔤 Global Storefront Typography &amp; Font Presets</h2>
                      <p className={`${textSub} text-xs mt-0.5`}>Change heading and body font pairings across the entire website end-to-end.</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${isLight ? "bg-slate-100 text-zinc-900 border-zinc-200" : "bg-zinc-800 text-zinc-100 border-zinc-700"
                      }`}>
                      Current Font: {currentFont.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(FONT_PRESETS).map((f) => {
                      const isActive = fontId === f.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => setFontId(f.id as FontId)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${isActive
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
                            className={`w-full font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-98 ${isActive
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
            disabled={isSaving}
            style={{ backgroundColor: currentTheme.primaryColor }}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-98 ${isSaving ? "opacity-75 cursor-not-allowed" : "hover:opacity-95"
              }`}
          >
            <span>{isSaving ? "⏳ Saving Configurations to Database..." : "💾 Save All CMS & Store Configurations"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
