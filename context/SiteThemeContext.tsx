"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export type ThemeId = "crimson" | "emerald" | "sapphire" | "plum" | "rosegold" | "midnight" | "custom";
export type ThemeMode = "dark" | "light";
export type FontId = "playfair" | "cinzel" | "cormorant" | "prata" | "marcellus" | "lora" | "custom_font";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  primaryColor: string;      // HEX color for buttons, active badges & highlights
  primaryHoverColor: string; // Hover state
  secondaryColor: string;    // Gold / accent color
  badgeBg: string;
  badgeText: string;
  previewGradient: string;   // For color swatch picker UI
  colorDot?: string;         // Emoji dot for selector
}

export interface FontConfig {
  id: FontId;
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  googleFontUrl?: string;
}

export const THEME_PRESETS: Record<Exclude<ThemeId, "custom">, ThemeConfig> = {
  crimson: {
    id: "crimson",
    name: "Crimson Royal",
    description: "Panipat classic deep crimson & gold festive luxury.",
    primaryColor: "#9b1c31",
    primaryHoverColor: "#7d1324",
    secondaryColor: "#f59e0b",
    badgeBg: "bg-[#9b1c31]",
    badgeText: "text-amber-300",
    previewGradient: "from-[#9b1c31] via-[#7d1324] to-[#f59e0b]",
    colorDot: "🔴",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Velvet",
    description: "Imperial emerald green & rich gold bridal heritage.",
    primaryColor: "#047857",
    primaryHoverColor: "#065f46",
    secondaryColor: "#d97706",
    badgeBg: "bg-[#047857]",
    badgeText: "text-amber-200",
    previewGradient: "from-[#047857] via-[#065f46] to-[#d97706]",
    colorDot: "🟢",
  },
  sapphire: {
    id: "sapphire",
    name: "Royal Sapphire",
    description: "Majestic sapphire blue with saffron gold accents.",
    primaryColor: "#1d4ed8",
    primaryHoverColor: "#1e40af",
    secondaryColor: "#eab308",
    badgeBg: "bg-[#1d4ed8]",
    badgeText: "text-yellow-200",
    previewGradient: "from-[#1d4ed8] via-[#1e40af] to-[#eab308]",
    colorDot: "🔵",
  },
  plum: {
    id: "plum",
    name: "Plum Heritage",
    description: "Luxury deep royal purple & antique bronze weave.",
    primaryColor: "#7e22ce",
    primaryHoverColor: "#6b21a8",
    secondaryColor: "#ca8a04",
    badgeBg: "bg-[#7e22ce]",
    badgeText: "text-amber-200",
    previewGradient: "from-[#7e22ce] via-[#6b21a8] to-[#ca8a04]",
    colorDot: "🟣",
  },
  rosegold: {
    id: "rosegold",
    name: "Rose Maroon",
    description: "Elegant pastel rose maroon & champagne sparkle.",
    primaryColor: "#be123c",
    primaryHoverColor: "#9f1239",
    secondaryColor: "#f43f5e",
    badgeBg: "bg-[#be123c]",
    badgeText: "text-rose-100",
    previewGradient: "from-[#be123c] via-[#9f1239] to-[#f43f5e]",
    colorDot: "🌸",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Saffron",
    description: "Sleek obsidian black & high-contrast Panipat saffron.",
    primaryColor: "#ea580c",
    primaryHoverColor: "#c2410c",
    secondaryColor: "#f59e0b",
    badgeBg: "bg-[#ea580c]",
    badgeText: "text-amber-200",
    previewGradient: "from-[#ea580c] via-[#c2410c] to-[#f59e0b]",
    colorDot: "🟠",
  },
};

export const FONT_PRESETS: Record<Exclude<FontId, "custom_font">, FontConfig> = {
  playfair: {
    id: "playfair",
    name: "Playfair Display & Inter",
    description: "Panipat classic serif heading with clean modern body typography.",
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap",
  },
  cinzel: {
    id: "cinzel",
    name: "Cinzel & Outfit",
    description: "Imperial Roman serif headline with sleek geometric Outfit body.",
    headingFont: "'Cinzel', Georgia, serif",
    bodyFont: "'Outfit', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Outfit:wght@400;600;700&display=swap",
  },
  cormorant: {
    id: "cormorant",
    name: "Cormorant Garamond & Plus Jakarta",
    description: "High-fashion French Garamond with crisp Jakarta Sans body.",
    headingFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap",
  },
  prata: {
    id: "prata",
    name: "Prata & Montserrat",
    description: "Vogue Didone luxury fashion heading with clean Montserrat.",
    headingFont: "'Prata', Georgia, serif",
    bodyFont: "'Montserrat', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Prata&display=swap",
  },
  marcellus: {
    id: "marcellus",
    name: "Marcellus & Poppins",
    description: "Classical Indian ethnic heritage serif with modern Poppins.",
    headingFont: "'Marcellus', Georgia, serif",
    bodyFont: "'Poppins', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@400;600;700&display=swap",
  },
  lora: {
    id: "lora",
    name: "Lora & Roboto",
    description: "Sophisticated literary serif with trusted universal Roboto.",
    headingFont: "'Lora', Georgia, serif",
    bodyFont: "'Roboto', system-ui, sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700&display=swap",
  },
};

interface SiteThemeContextType {
  themeId: ThemeId;
  fontId: FontId;
  mode: ThemeMode;
  currentTheme: ThemeConfig;
  customTheme: ThemeConfig;
  currentFont: FontConfig;
  customFontName: string;
  setThemeId: (id: ThemeId) => void;
  setFontId: (id: FontId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  updateCustomTheme: (name: string, primaryColor: string, secondaryColor: string) => void;
  updateCustomFont: (fontName: string) => void;
}

const defaultCustomTheme: ThemeConfig = {
  id: "custom",
  name: "Custom Theme",
  description: "User-defined custom color theme.",
  primaryColor: "#2563eb",
  primaryHoverColor: "#1d4ed8",
  secondaryColor: "#f59e0b",
  badgeBg: "bg-blue-600",
  badgeText: "text-white",
  previewGradient: "from-blue-600 via-indigo-600 to-amber-500",
  colorDot: "✨",
};



const SiteThemeContext = createContext<SiteThemeContextType>({
  themeId: "crimson",
  fontId: "playfair",
  mode: "dark",
  currentTheme: THEME_PRESETS.crimson,
  customTheme: defaultCustomTheme,
  currentFont: FONT_PRESETS.playfair,
  customFontName: "Bodoni Moda",
  setThemeId: () => { },
  setFontId: () => { },
  setMode: () => { },
  toggleMode: () => { },
  updateCustomTheme: () => { },
  updateCustomFont: () => { },
});

// All localStorage-derived theme state lives in a single reducer so that the
// post-mount hydration effect can issue ONE dispatch (one re-render) instead of
// multiple setState calls — satisfying the lint rule and React best practices.
type ThemeSlice = {
  themeId: ThemeId;
  fontId: FontId;
  customFontName: string;
  mode: ThemeMode;
  customTheme: ThemeConfig;
};

type ThemeAction =
  | { type: "INIT"; payload: Partial<ThemeSlice> }
  | { type: "SET_THEME_ID"; themeId: ThemeId }
  | { type: "SET_FONT_ID"; fontId: FontId }
  | { type: "SET_CUSTOM_FONT_NAME"; customFontName: string }
  | { type: "SET_MODE"; mode: ThemeMode }
  | { type: "SET_CUSTOM_THEME"; customTheme: ThemeConfig };

const SERVER_SAFE_DEFAULTS: ThemeSlice = {
  themeId: "crimson",
  fontId: "playfair",
  customFontName: "Bodoni Moda",
  mode: "dark",
  customTheme: defaultCustomTheme,
};

function themeReducer(state: ThemeSlice, action: ThemeAction): ThemeSlice {
  switch (action.type) {
    case "INIT":          return { ...state, ...action.payload };
    case "SET_THEME_ID":  return { ...state, themeId: action.themeId };
    case "SET_FONT_ID":   return { ...state, fontId: action.fontId };
    case "SET_CUSTOM_FONT_NAME": return { ...state, customFontName: action.customFontName };
    case "SET_MODE":      return { ...state, mode: action.mode };
    case "SET_CUSTOM_THEME": return { ...state, customTheme: action.customTheme };
    default:              return state;
  }
}

export const SiteThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with server-safe defaults — SSR and the first client hydration
  // render will match, preventing the hydration mismatch error.
  const [{ themeId, fontId, customFontName, mode, customTheme }, dispatch] = useReducer(
    themeReducer,
    SERVER_SAFE_DEFAULTS
  );

  // After the first render (client-only), read localStorage and apply all saved
  // preferences in a single dispatch — one re-render, linter-compliant.
  useEffect(() => {
    const savedThemeId = localStorage.getItem("sai_site_theme_id") as ThemeId | null;
    const savedFontId = localStorage.getItem("sai_site_font_id") as FontId | null;
    const savedCustomFontName = localStorage.getItem("sai_custom_font_name");
    const savedMode = localStorage.getItem("sai_admin_mode") as ThemeMode | null;
    const savedCustomConfig = localStorage.getItem("sai_custom_theme_config");

    let parsedCustomTheme: ThemeConfig | undefined;
    if (savedCustomConfig) {
      try {
        const parsed = JSON.parse(savedCustomConfig);
        parsedCustomTheme = {
          ...defaultCustomTheme,
          name: parsed.name || "Custom Theme",
          primaryColor: parsed.primaryColor || "#2563eb",
          primaryHoverColor: parsed.primaryColor || "#1d4ed8",
          secondaryColor: parsed.secondaryColor || "#f59e0b",
          previewGradient: `from-[${parsed.primaryColor}] to-[${parsed.secondaryColor}]`,
        };
      } catch (err) {
        console.error("Failed to parse custom theme config", err);
      }
    }

    // Single dispatch — all values set atomically, only one re-render triggered.
    dispatch({
      type: "INIT",
      payload: {
        ...(savedThemeId        && { themeId: savedThemeId }),
        ...(savedFontId         && { fontId: savedFontId }),
        ...(savedCustomFontName && { customFontName: savedCustomFontName }),
        ...(savedMode           && { mode: savedMode }),
        ...(parsedCustomTheme   && { customTheme: parsedCustomTheme }),
      },
    });
  }, []);

  const getThemeConfig = (id: ThemeId): ThemeConfig => {
    if (id === "custom") return customTheme;
    return THEME_PRESETS[id] || THEME_PRESETS.crimson;
  };

  const getFontConfig = (id: FontId): FontConfig => {
    if (id === "custom_font") {
      const name = customFontName || "Bodoni Moda";
      return {
        id: "custom_font",
        name: `Custom: ${name}`,
        description: `Custom Google Font (${name}).`,
        headingFont: `'${name}', Georgia, serif`,
        bodyFont: "'Inter', system-ui, sans-serif",
        googleFontUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;600;700&display=swap`,
      };
    }
    return FONT_PRESETS[id] || FONT_PRESETS.playfair;
  };

  const currentTheme = getThemeConfig(themeId);
  const currentFont = getFontConfig(fontId);

  // Helper to inject high-priority CSS rules and Google Font link into DOM
  const applyFontToDOM = (fConfig: FontConfig) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.style.setProperty("--font-serif-dynamic", fConfig.headingFont);
    root.style.setProperty("--font-sans-dynamic", fConfig.bodyFont);
    root.style.setProperty("--font-playfair", fConfig.headingFont);
    root.style.setProperty("--font-inter", fConfig.bodyFont);

    // Google Fonts link stylesheet
    if (fConfig.googleFontUrl) {
      let fontLink = document.getElementById("sai_dynamic_font") as HTMLLinkElement;
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = "sai_dynamic_font";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      }
      fontLink.href = fConfig.googleFontUrl;
    }

    // Dynamic style tag to override any Tailwind / Next.js font classes
    let dynamicStyle = document.getElementById("sai_dynamic_font_style") as HTMLStyleElement;
    if (!dynamicStyle) {
      dynamicStyle = document.createElement("style");
      dynamicStyle.id = "sai_dynamic_font_style";
      document.head.appendChild(dynamicStyle);
    }

    dynamicStyle.textContent = `
      :root {
        --font-serif-dynamic: ${fConfig.headingFont} !important;
        --font-sans-dynamic: ${fConfig.bodyFont} !important;
        --font-playfair: ${fConfig.headingFont} !important;
        --font-inter: ${fConfig.bodyFont} !important;
      }

      body, html, button, input, select, textarea {
        font-family: ${fConfig.bodyFont}, system-ui, -apple-system, sans-serif !important;
      }

      h1, h2, h3, h4, h5, h6, .font-serif, .font-playfair, [class*="font-serif"] {
        font-family: ${fConfig.headingFont}, Georgia, serif !important;
      }

      .font-sans, .font-inter, [class*="font-sans"] {
        font-family: ${fConfig.bodyFont}, system-ui, -apple-system, sans-serif !important;
      }
    `;
  };

  // Apply CSS root variables for colors
  useEffect(() => {
    const config = themeId === "custom" ? customTheme : THEME_PRESETS[themeId] || THEME_PRESETS.crimson;
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", config.primaryColor);
      root.style.setProperty("--theme-primary-hover", config.primaryHoverColor);
      root.style.setProperty("--theme-secondary", config.secondaryColor);
    }
  }, [themeId, customTheme]);

  // Apply CSS root variables for typography & inject Google Font stylesheet
  useEffect(() => {
    let fConfig: FontConfig;
    if (fontId === "custom_font") {
      const name = customFontName || "Bodoni Moda";
      fConfig = {
        id: "custom_font",
        name: `Custom: ${name}`,
        description: `Custom Google Font (${name}).`,
        headingFont: `'${name}', Georgia, serif`,
        bodyFont: "'Inter', system-ui, sans-serif",
        googleFontUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;600;700&display=swap`,
      };
    } else {
      fConfig = FONT_PRESETS[fontId] || FONT_PRESETS.playfair;
    }

    applyFontToDOM(fConfig);
  }, [fontId, customFontName]);

  const setThemeId = (newThemeId: ThemeId) => {
    dispatch({ type: "SET_THEME_ID", themeId: newThemeId });
    localStorage.setItem("sai_site_theme_id", newThemeId);

    const config = getThemeConfig(newThemeId);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", config.primaryColor);
      root.style.setProperty("--theme-primary-hover", config.primaryHoverColor);
      root.style.setProperty("--theme-secondary", config.secondaryColor);
    }

    window.dispatchEvent(new Event("sai_theme_changed"));
  };

  const setFontId = (newFontId: FontId) => {
    dispatch({ type: "SET_FONT_ID", fontId: newFontId });
    localStorage.setItem("sai_site_font_id", newFontId);

    const fConfig = getFontConfig(newFontId);
    applyFontToDOM(fConfig);

    window.dispatchEvent(new Event("sai_font_changed"));
  };

  const updateCustomFont = (fontName: string) => {
    dispatch({ type: "SET_CUSTOM_FONT_NAME", customFontName: fontName });
    localStorage.setItem("sai_custom_font_name", fontName);
    setFontId("custom_font");
  };

  const updateCustomTheme = (name: string, primaryColor: string, secondaryColor: string) => {
    const updated: ThemeConfig = {
      ...defaultCustomTheme,
      name: name || "My Custom Theme",
      primaryColor: primaryColor || "#2563eb",
      primaryHoverColor: primaryColor || "#1d4ed8",
      secondaryColor: secondaryColor || "#f59e0b",
      previewGradient: `from-[${primaryColor}] to-[${secondaryColor}]`,
    };

    dispatch({ type: "SET_CUSTOM_THEME", customTheme: updated });
    localStorage.setItem(
      "sai_custom_theme_config",
      JSON.stringify({ name: updated.name, primaryColor: updated.primaryColor, secondaryColor: updated.secondaryColor })
    );

    setThemeId("custom");
  };

  const setMode = (newMode: ThemeMode) => {
    dispatch({ type: "SET_MODE", mode: newMode });
    localStorage.setItem("sai_admin_mode", newMode);
  };

  const toggleMode = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
  };

  return (
    <SiteThemeContext.Provider
      value={{
        themeId,
        fontId,
        mode,
        currentTheme,
        customTheme,
        currentFont,
        customFontName,
        setThemeId,
        setFontId,
        setMode,
        toggleMode,
        updateCustomTheme,
        updateCustomFont,
      }}
    >
      {children}
    </SiteThemeContext.Provider>
  );
};

export const useSiteTheme = () => useContext(SiteThemeContext);
