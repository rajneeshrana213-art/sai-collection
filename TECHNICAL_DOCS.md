# Sai Collection — Frontend Technical Documentation

> **Stack**: Next.js (App Router) · TypeScript · Tailwind CSS · React Context API  
> **Project Root**: `d:/sai-collection/`

---

## 1. Project Architecture Overview

```
d:/sai-collection/
├── app/                    # Next.js App Router — all routes & pages
│   ├── layout.tsx          # Root layout (fonts + global providers)
│   ├── globals.css         # Global CSS variables & base styles
│   ├── page.tsx            # Homepage (/)
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   │
│   ├── admin/              # 🔐 Admin Panel (separate layout)
│   ├── account/            # 👤 Customer Account Area
│   ├── api/                # 🔌 API Routes (webhooks)
│   │
│   ├── products/           # Product listing + detail
│   ├── categories/         # Category pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── order-confirmation/ # Post-order confirmation
│   ├── search/             # Search results
│   ├── login/              # Auth pages
│   ├── register/
│   ├── forgot-password/
│   ├── about/
│   ├── contact/
│   └── policies/           # Legal pages (privacy/returns/shipping/terms)
│
├── components/
│   ├── storefront/         # Customer-facing UI components
│   └── common/             # Shared utility components
│
├── context/
│   ├── CartContext.tsx      # Global cart + wishlist state
│   ├── SiteThemeContext.tsx # Theme/font preset system (shared admin↔storefront)
│   └── AdminThemeContext.tsx# Admin dark/light mode toggle
│
├── lib/
│   └── mock-data.ts        # Centralized mock data (products, categories, orders)
│
├── emails/                 # Transactional email templates
└── scripts/                # Utility/seed scripts
```

---

## 2. Global Providers & Layout

### Root Layout — `app/layout.tsx`

The top-level layout wrapping the **entire application** (both storefront and admin).

| Layer | Provider | Purpose |
|---|---|---|
| 1 (outer) | `SiteThemeProvider` | Theme color + font system for all pages |
| 2 (inner) | `CartProvider` | Global cart, wishlist, and search modal state |

**Fonts loaded via `next/font/google`:**
| CSS Variable | Font Family | Usage |
|---|---|---|
| `--font-playfair` | Playfair Display | Headings, brand text |
| `--font-inter` | Inter | Body text, UI elements |

---

## 3. Context API — State Management

### 3.1 CartContext — `context/CartContext.tsx`

Global client-side state for shopping cart and wishlist. Provided at root; accessible everywhere.

```typescript
const { cart, addToCart, totalItems, isCartOpen, openCart } = useCart();
```

**State:**

| Property | Type | Description |
|---|---|---|
| `cart` | `CartItem[]` | Items in cart (product + variant + qty) |
| `wishlist` | `string[]` | Array of wishlisted product IDs |
| `isCartOpen` | `boolean` | Cart drawer open/closed state |
| `isSearchOpen` | `boolean` | Quick search modal open/closed state |
| `totalItems` | `number` | Sum of all cart item quantities |
| `subtotal` | `number` | Total in paise (divide by 100 for ₹) |
| `freeShippingThreshold` | `number` | `99900` paise = ₹999 |

**Methods:**

| Method | Signature | Behavior |
|---|---|---|
| `addToCart` | `(product, variant?, qty?)` | Adds or increments item; auto-opens cart drawer |
| `removeFromCart` | `(cartItemId)` | Removes item by cart item ID |
| `updateQuantity` | `(cartItemId, qty)` | Updates qty; removes item if qty ≤ 0 |
| `toggleWishlist` | `(productId)` | Adds/removes product from wishlist |
| `isWishlisted` | `(productId) → boolean` | Returns `true` if product is in wishlist |
| `openCart` / `closeCart` | `() → void` | Controls cart drawer visibility |
| `openSearch` / `closeSearch` | `() → void` | Controls search modal visibility |

> **Note**: Cart initializes with a demo item (`"cart-item-demo"`) on mount via `useEffect` for immediate interactive showcase.

---

### 3.2 SiteThemeContext — `context/SiteThemeContext.tsx`

Shared theme system controlling colors and typography across **both storefront and admin panel**.

```typescript
const { themeId, setThemeId, currentTheme, fontId, setFontId, currentFont } = useSiteTheme();
```

| Export | Description |
|---|---|
| `THEME_PRESETS` | Object of predefined color palettes (id, name, primaryColor, colorDot, etc.) |
| `FONT_PRESETS` | Object of predefined font stacks |
| `themeId` / `setThemeId` | Active theme ID + setter |
| `fontId` / `setFontId` | Active font ID + setter |
| `currentTheme` | Full theme object for active preset |
| `customTheme` | Custom theme slot (user-defined) |
| `currentFont` | Full font object for active preset |

> Admin changes apply **live** to the storefront — same React context tree.

---

### 3.3 AdminThemeContext — `context/AdminThemeContext.tsx`

Admin-only dark/light mode toggle, independent from storefront theme.

```typescript
const { theme, toggleTheme } = useAdminTheme();
// theme: "dark" | "light"
```

Provided only inside the admin layout (`app/admin/layout.tsx`).

---

## 4. Customer / Storefront User Flow

### 4.1 Route Map

```
/ ────────────────────────── Homepage
├── /products ──────────────── Product Listing (all products + filters)
│   └── /products/[slug] ───── Product Detail Page (PDP)
├── /categories/[slug] ──────── Category Filtered Listing
├── /search ────────────────── Search Results Page
├── /cart ──────────────────── Cart Review Page
├── /checkout ──────────────── Checkout (address → payment → confirm)
│   └── /order-confirmation/[orderNumber] ── Order Success Screen
├── /account ───────────────── Account Dashboard
│   ├── /account/orders ──────── Order History List
│   │   └── /account/orders/[orderNumber] ─ Order Detail View
│   ├── /account/addresses ────── Saved Delivery Addresses
│   └── /account/wishlist ──────── Wishlist Page
├── /login ─────────────────── Login
├── /register ──────────────── New Customer Registration
├── /forgot-password ────────── Password Reset
├── /about ─────────────────── About / Brand Story
├── /contact ───────────────── Contact Form
└── /policies/
    ├── /policies/privacy ────── Privacy Policy
    ├── /policies/returns ────── Return & Refund Policy
    ├── /policies/shipping ───── Shipping Policy
    └── /policies/terms ──────── Terms & Conditions
```

---

### 4.2 Page File Mapping

| URL Pattern | File | Key Features |
|---|---|---|
| `/` | `app/page.tsx` | Hero, featured products, category grid, brand story, testimonials |
| `/products` | `app/products/page.tsx` | Product grid with filter/sort sidebar, pagination |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | Image gallery, variant selector, add-to-cart, reviews |
| `/categories/[slug]` | `app/categories/[slug]/page.tsx` | Category-filtered product grid |
| `/search` | `app/search/page.tsx` | Full-text search results |
| `/cart` | `app/cart/page.tsx` | Cart item list, qty controls, order summary, checkout CTA |
| `/checkout` | `app/checkout/page.tsx` | Multi-step: address → payment method → place order |
| `/order-confirmation/[orderNumber]` | `app/order-confirmation/[orderNumber]/page.tsx` | Success screen, order summary |
| `/account` | `app/account/page.tsx` | Account dashboard — profile overview, quick links |
| `/account/orders` | `app/account/orders/page.tsx` | Paginated order history list |
| `/account/orders/[orderNumber]` | `app/account/orders/[orderNumber]/page.tsx` | Single order detail — items, status, tracking |
| `/account/addresses` | `app/account/addresses/page.tsx` | Add/edit/delete saved addresses |
| `/account/wishlist` | `app/account/wishlist/page.tsx` | Wishlist grid with move-to-cart |
| `/login` | `app/login/page.tsx` | Email/password login form |
| `/register` | `app/register/page.tsx` | New customer sign-up form |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password reset request form |
| `/about` | `app/about/page.tsx` | Brand story, Panipat origin, team |
| `/contact` | `app/contact/page.tsx` | Contact form + store details |
| `/policies/privacy` | `app/policies/privacy/page.tsx` | Privacy policy |
| `/policies/returns` | `app/policies/returns/page.tsx` | Returns & refund policy |
| `/policies/shipping` | `app/policies/shipping/page.tsx` | Shipping policy |
| `/policies/terms` | `app/policies/terms/page.tsx` | Terms & conditions |

---

### 4.3 Storefront Components — `components/storefront/`

| File | Used On | Purpose |
|---|---|---|
| `Header.tsx` | All storefront pages | Top nav — logo, search icon, cart icon, wishlist, nav links, mobile menu |
| `Footer.tsx` | All storefront pages | Site footer — links, social media, newsletter signup |
| `CartDrawer.tsx` | Global (via CartContext) | Slide-in cart drawer — items, qty controls, totals, checkout CTA |
| `QuickSearchModal.tsx` | Header | Full-screen search modal with live suggestions |
| `HeroBanner.tsx` | Homepage | Hero section with headline + CTA buttons |
| `FeaturedProducts.tsx` | Homepage | Featured product cards grid/carousel |
| `CategoryGrid.tsx` | Homepage | Visual category navigation tiles |
| `BrandStory.tsx` | Homepage | Panipat craftsmanship origin section |
| `Testimonials.tsx` | Homepage | Customer review testimonial cards |
| `ValueProps.tsx` | Homepage | USP badges — COD, Free shipping, Handcrafted |
| `InstagramFeed.tsx` | Homepage | Instagram-style lifestyle photo feed |

### Shared Components — `components/common/`

| File | Purpose |
|---|---|
| `Pagination.tsx` | Reusable pagination controls used in product listing, order history, admin tables |

---

### 4.4 Customer Happy Path Flow

```
Visitor lands on Homepage (/)
    │
    ├─► Browses Hero / Featured Products / Category Grid
    │
    ├─► Navigates to /categories/[slug] or /products
    │       │
    │       └─► Clicks product card → /products/[slug] (PDP)
    │               │
    │               ├─► Selects size/color variant
    │               ├─► Clicks "Add to Cart" → CartDrawer opens
    │               └─► Clicks "Add to Wishlist" → saved in CartContext
    │
    ├─► Opens Quick Search (Header icon) → QuickSearchModal → /search
    │
    └─► From CartDrawer or /cart:
            │
            └─► "Proceed to Checkout" → /checkout
                    │
                    ├─► Fills delivery address
                    ├─► Selects payment (COD / UPI / Card)
                    ├─► Places order
                    └─► Redirected to /order-confirmation/[orderNumber]
                                │
                                └─► Can view at /account/orders/[orderNumber]
```

---

## 5. Admin Panel Flow

### 5.1 Admin Layout Structure — `app/admin/layout.tsx`

All `/admin/*` routes share a dedicated layout **separate from the storefront layout**.

```
AdminLayout (app/admin/layout.tsx)
└── AdminThemeProvider              ← dark/light mode for admin UI
    └── AdminLayoutContent
        ├── <aside> Sidebar (Desktop, lg+)
        │   ├── Brand Logo + "SAI ADMIN" header
        │   ├── <nav> Nav items (8 links, active highlighted with theme color)
        │   └── "View Live Storefront" link (opens / in new tab)
        │
        ├── <header> Top Header Bar (sticky, h-16)
        │   ├── Mobile hamburger toggle
        │   ├── 🎨 Theme Preset Dropdown  → setThemeId() in SiteThemeContext
        │   ├── 🔤 Font Preset Dropdown   → setFontId() in SiteThemeContext
        │   ├── 🌙/☀️ Dark/Light Toggle   → toggleTheme() in AdminThemeContext
        │   └── 👤 Profile Dropdown
        │       ├── Link → /admin/profile
        │       ├── Link → /admin/settings
        │       ├── Link → / (live storefront, new tab)
        │       └── Logout button → router.push("/")
        │
        ├── Mobile Sidebar Drawer (shown when hamburger clicked)
        │   └── Same nav items as desktop sidebar
        │
        └── <main> Page Content ({children})
```

---

### 5.2 Admin Route Map

```
/admin ──────────────────────── Dashboard (KPIs, charts, recent orders)
├── /admin/products ──────────── Product Catalog — CRUD, variants, images
├── /admin/categories ───────── Categories & Sub-categories — tree view, CRUD
├── /admin/orders ───────────── Orders Queue — filter by status, update status
├── /admin/customers ────────── Customer Directory — search, view order history
├── /admin/reviews ──────────── Review Moderation — approve / reject
├── /admin/coupons ──────────── Discount Coupons — create / edit / expire codes
├── /admin/settings ─────────── Store CMS & Config — branding, shipping, payments, SEO
└── /admin/profile ──────────── Admin User Profile — name, email, password
```

---

### 5.3 Admin Page File Mapping

| URL | File | Key Features |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | KPI cards (revenue, orders, customers), recent orders table, top-selling products list |
| `/admin/products` | `app/admin/products/page.tsx` | Full product CRUD — list view, add/edit modal, variant management, image upload |
| `/admin/categories` | `app/admin/categories/page.tsx` | Category tree, add/edit/delete categories and sub-categories |
| `/admin/orders` | `app/admin/orders/page.tsx` | Orders queue with status filters (Pending/Confirmed/Shipped/Delivered/Cancelled), bulk update |
| `/admin/customers` | `app/admin/customers/page.tsx` | Customer list — search by name/email, view account details |
| `/admin/reviews` | `app/admin/reviews/page.tsx` | Product review moderation — approve, reject, flag reviews |
| `/admin/coupons` | `app/admin/coupons/page.tsx` | Coupon management — create codes, set discount type/value/expiry/usage limit |
| `/admin/settings` | `app/admin/settings/page.tsx` | Store CMS: branding config, shipping rules, payment methods, email notifications, SEO meta |
| `/admin/profile` | `app/admin/profile/page.tsx` | Admin profile — name, email, password change, avatar |

---

### 5.4 Admin Sidebar Navigation Items

Defined as `navItems` array in `app/admin/layout.tsx` (lines 20–29):

| Icon | Label | Route | Notes |
|---|---|---|---|
| 📊 | Dashboard | `/admin` | Exact match active state |
| 👗 | Products Catalog | `/admin/products` | Largest page (~44KB) |
| 📁 | Categories & Sub-Cats | `/admin/categories` | Hierarchical category editor |
| 📦 | Orders Queue | `/admin/orders` | Primary day-to-day admin screen |
| 👥 | Customer List | `/admin/customers` | Read-only customer directory |
| ⭐ | Product Reviews | `/admin/reviews` | Moderation workflow |
| 🏷️ | Discount Coupons | `/admin/coupons` | Coupon code generator |
| ⚙️ | Store Settings | `/admin/settings` | Largest settings page (~69KB) |

Active link background color = `currentTheme.primaryColor` from `SiteThemeContext`.

---

### 5.5 Admin → Storefront Live Theme Data Flow

```
Admin Header (app/admin/layout.tsx)
    │
    ├── Theme Dropdown onChange
    │       └─► setThemeId(newId)  ──────► SiteThemeContext (shared React state)
    │                                           │
    │                                           └─► currentTheme.primaryColor
    │                                               injected as CSS vars on storefront
    │
    └── Font Dropdown onChange
            └─► setFontId(newId)   ──────► SiteThemeContext (shared React state)
                                                │
                                                └─► currentFont.family
                                                    applied to --font-* CSS variables
```

**Result**: Admin changes colors/fonts → storefront updates **instantly** without page reload,  
because both panels consume the same `SiteThemeContext` instance.

---

## 6. Data Layer

### Mock Data — `lib/mock-data.ts`

Central data source (~17KB). All pages import from here until a real backend is connected.

| Export | Contents |
|---|---|
| `products` | Array of Product objects with variants, images, prices in paise, badges, ratings |
| `categories` | Array of Category objects with slugs |
| `orders` | Sample orders for account + admin order pages |
| `customers` | Sample customers for admin customer list |
| `reviews` | Sample reviews for admin review moderation |
| `coupons` | Sample discount codes for admin coupon page |

**Core TypeScript Types:**

```typescript
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  basePrice: number;        // in paise (÷100 = ₹)
  originalPrice: number;    // in paise
  badge?: "BEST SELLER" | "NEW" | "LIMITED" | ...;
  rating: number;
  reviewsCount: number;
  fabric: string;
  craft: string;
  isAvailableForCOD: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;   // in paise
  stock: number;
};
```

---

### API Routes — `app/api/`

```
app/api/
└── webhooks/     # Webhook endpoint handlers (e.g., payment gateway callbacks)
```

---

### Email Templates — `emails/`

Transactional email templates for order lifecycle events (e.g., `order-delivered.ejs`).

---

## 7. Component → Page Dependency Matrix

| Component | `/` | `/products/[slug]` | `/cart` | `/checkout` | `/admin/*` |
|---|:---:|:---:|:---:|:---:|:---:|
| `Header.tsx` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `Footer.tsx` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `CartDrawer.tsx` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `QuickSearchModal.tsx` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `HeroBanner.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `FeaturedProducts.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `CategoryGrid.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `BrandStory.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `Testimonials.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `ValueProps.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `InstagramFeed.tsx` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `Pagination.tsx` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `CartContext` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `SiteThemeContext` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `AdminThemeContext` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 8. Key Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Dynamic segments | Folder name in `[brackets]` | `[slug]`, `[orderNumber]` |
| Page files | Always `page.tsx` inside route folder | `app/products/page.tsx` |
| Layout files | `layout.tsx` inside route folder | `app/admin/layout.tsx` |
| Context hooks | `use` prefix + context name | `useCart()`, `useSiteTheme()` |
| Price storage | Integer paise (÷100 = ₹) | `349900` = ₹3,499 |
| Product URLs | `/products/{slug}` | `/products/panipat-royal-velvet-anarkali-suit-set` |
| Category URLs | `/categories/{slug}` | `/categories/womens-ethnic-suits` |
| Order URLs (account) | `/account/orders/{orderNumber}` | `/account/orders/ORD-2025-001` |
| Order URLs (confirm) | `/order-confirmation/{orderNumber}` | `/order-confirmation/ORD-2025-001` |
| Components | PascalCase `.tsx` | `CartDrawer.tsx`, `FeaturedProducts.tsx` |
| Context files | PascalCase + `Context.tsx` suffix | `CartContext.tsx`, `SiteThemeContext.tsx` |
