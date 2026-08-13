import { Header } from "@/components/storefront/Header";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { BrandStory } from "@/components/storefront/BrandStory";
import { ValueProps } from "@/components/storefront/ValueProps";
import { InstagramFeed } from "@/components/storefront/InstagramFeed";
import { Testimonials } from "@/components/storefront/Testimonials";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { Footer } from "@/components/storefront/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Home Content */}
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStory />
        <ValueProps />
        <InstagramFeed />
        <Testimonials />
      </main>

      {/* Interactive Overlays */}
      <CartDrawer />
      <QuickSearchModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
