import { Header } from "@/components/storefront/Header";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { PremiumCornerShowcase } from "@/components/storefront/PremiumCornerShowcase";
import { HappyCustomersSection } from "@/components/storefront/HappyCustomersSection";
import { ValueProps } from "@/components/storefront/ValueProps";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { Footer } from "@/components/storefront/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Home Content */}
      <main className="flex-1">
        <HeroBanner />
        <FeaturedProducts />
        <CategoryGrid />
        <PremiumCornerShowcase />
        <HappyCustomersSection />
        <ValueProps />
      </main>

      {/* Interactive Overlays */}
      <CartDrawer />
      <QuickSearchModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

