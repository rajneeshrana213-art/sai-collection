"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Navbar } from "./Navbar";
import { apiClient } from "@/lib/api-client";

export const Header: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [storeName, setStoreName] = useState("Sai Collection");
  const [storeTagline, setStoreTagline] = useState("Premium Ethnic Wear");
  const [navMenuItems, setNavMenuItems] = useState<Array<{ id: string; label: string; href: string; badge?: string; isVisible: boolean }>>([]);
  const [categoriesList, setCategoriesList] = useState<
    Array<{
      id?: string;
      label: string;
      slug: string;
      badge?: string;
      subCategories?: Array<{ id?: string; label: string; slug: string; badge?: string }>;
    }>
  >([]);

  useEffect(() => {
    async function fetchSiteSettingsAndCategories() {
      try {
        const [catRes, setRes] = await Promise.all([
          apiClient.get<{
            categories: Array<{
              id: string;
              name: string;
              slug: string;
              badge?: string;
              subCategories?: Array<{ id: string; name: string; slug: string; badge?: string }>;
            }>;
          }>("/api/v1/categories"),
          apiClient.get<{ settings?: Record<string, unknown> }>("/api/v1/settings"),
        ]);

        if (catRes && Array.isArray(catRes.categories)) {
          setCategoriesList(
            catRes.categories.map((c) => ({
              id: c.id,
              label: c.name,
              slug: c.slug,
              badge: c.badge,
              subCategories: Array.isArray(c.subCategories)
                ? c.subCategories.map((sub) => ({
                    id: sub.id,
                    label: sub.name,
                    slug: sub.slug,
                    badge: sub.badge,
                  }))
                : [],
            }))
          );
        } else if (Array.isArray(catRes)) {
          const rawCats = catRes as unknown as Array<{
            id?: string;
            name: string;
            slug: string;
            badge?: string;
            subCategories?: Array<{ id?: string; name: string; slug: string; badge?: string }>;
          }>;
          setCategoriesList(
            rawCats.map((c) => ({
              id: c.id,
              label: c.name,
              slug: c.slug,
              badge: c.badge,
              subCategories: Array.isArray(c.subCategories)
                ? c.subCategories.map((sub) => ({
                    id: sub.id,
                    label: sub.name,
                    slug: sub.slug,
                    badge: sub.badge,
                  }))
                : [],
            }))
          );
        }

        if (setRes?.settings) {
          const s = setRes.settings;
          if (Array.isArray(s.announcements)) {
            const filtered = s.announcements.map((item) => String(item).trim()).filter(Boolean);
            setAnnouncements(filtered);
          } else if (typeof s.announcement === "string" && s.announcement.trim()) {
            const lines = s.announcement.split("\n").map((l) => l.trim()).filter(Boolean);
            setAnnouncements(lines);
          }

          if (typeof s.storeName === "string" && s.storeName.trim()) setStoreName(s.storeName);
          if (typeof s.storeTagline === "string" && s.storeTagline.trim()) setStoreTagline(s.storeTagline);
          if (Array.isArray(s.navMenuItems) && s.navMenuItems.length > 0) {
            setNavMenuItems(s.navMenuItems as Array<{ id: string; label: string; href: string; badge?: string; isVisible: boolean }>);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch header settings or categories", err);
      }
    }
    fetchSiteSettingsAndCategories();
  }, []);

  // Auto-rotate announcement slides
  useEffect(() => {
    if (announcements.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handlePrevSlide = () => {
    if (announcements.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNextSlide = () => {
    if (announcements.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all font-sans">
      {/* 1. Top Announcement & Utility Bar */}
      <TopBar
        announcements={announcements}
        currentSlideIndex={currentSlideIndex}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
      />

      {/* 2. Main Navbar & Mobile Drawer */}
      <Navbar
        storeName={storeName}
        storeTagline={storeTagline}
        navMenuItems={navMenuItems}
        categoriesList={categoriesList}
      />
    </header>
  );
};
