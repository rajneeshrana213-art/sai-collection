import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SiteThemeProvider } from "@/context/SiteThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sai Collection — Panipat Ethnic Wear & Designer Suits",
  description: "Shop handcrafted Anarkali suit sets, designer kurtas, Chanderi sarees & Phulkari dupattas direct from Panipat, Haryana. Cash on Delivery & Free Shipping Available.",
  keywords: "Sai Collection, Panipat ethnic wear, Anarkali suits, designer kurtas, Indian fashion D2C, saicollectionpnp, festive wear, COD ethnic wear",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Sai Collection — Panipat Handcrafted Indian Ethnic Wear",
    description: "Premium handcrafted suit sets & ethnic fashion delivered to your doorstep. Direct from Panipat.",
    url: "https://saicollection.in",
    siteName: "Sai Collection",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#fdfbf7] text-zinc-900 selection:bg-[#9b1c31] selection:text-white"
        suppressHydrationWarning
      >
        <SiteThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </SiteThemeProvider>
      </body>
    </html>
  );
}
