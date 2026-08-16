"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "./AuthContext";

/** Raw shapes returned by the API — kept narrow to avoid `any` */
interface RawMedia {
  id: string;
  url: string;
  altText?: string;
}

interface RawCartItem {
  id: string;
  product: Product & { media?: RawMedia[]; name?: string };
  variant: ProductVariant & { price?: number };
  quantity: number;
}

interface RawWishlistItem {
  productId: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  isSearchOpen: boolean;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number; // in paise (e.g. ₹999 = 99900)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = "sai_guest_cart_v1";
const LOCAL_STORAGE_WISHLIST_KEY = "sai_guest_wishlist_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync / Load Initial Cart & Wishlist
  useEffect(() => {
    async function loadUserCartAndWishlist() {
      if (isAuthenticated) {
        try {
          // Fetch authenticated cart — API returns { cart: { items: [...] } }
          const cartRes = await apiClient.get("/api/v1/cart");
          const cartItems = cartRes?.cart?.items || cartRes?.items || [];
          if (cartItems.length > 0) {
            // Map DB cart items into CartItem shape
            setCart(cartItems.map((ci: RawCartItem) => ({
              id: ci.id,
              product: {
                ...ci.product,
                images: ci.product?.media?.map((m: RawMedia) => ({ id: m.id, url: m.url, altText: m.altText || ci.product?.name })) || [],
                variants: [],
                basePrice: ci.variant?.price || 0,
              },
              variant: ci.variant,
              quantity: ci.quantity,
            })));
          }
          // Fetch authenticated wishlist
          const wishlistRes = await apiClient.get("/api/v1/account/wishlist");
          if (wishlistRes && Array.isArray(wishlistRes.items)) {
            setWishlist(wishlistRes.items.map((item: RawWishlistItem) => item.productId));
          }
        } catch {
          // Fallback to local storage if API call fails
          loadLocalCartAndWishlist();
        }
      } else {
        loadLocalCartAndWishlist();
      }
    }

    function loadLocalCartAndWishlist() {
      try {
        const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          // Add default initial demo item for guest showcase if completely empty
          const defaultProduct = {
            id: "prod-1",
            name: "Panipat Royal Velvet Anarkali Suit Set",
            slug: "panipat-royal-velvet-anarkali-suit-set",
            description: "Exquisite dark maroon velvet Anarkali suit with zari embroidery.",
            category: "Women's Ethnic Suits",
            categorySlug: "womens-ethnic-suits",
            basePrice: 349900,
            originalPrice: 499900,
            badge: "BEST SELLER" as const,
            rating: 4.9,
            reviewsCount: 128,
            fabric: "Micro Velvet & Organza",
            craft: "Panipat Hand Zari",
            isAvailableForCOD: true,
            images: [
              {
                id: "img-1a",
                url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
                altText: "Panipat Royal Velvet Anarkali Suit"
              }
            ],
            variants: [
              { id: "v1-m", size: "M", color: "Maroon", sku: "SAI-ANR-MRN-M", price: 349900, stock: 18 }
            ]
          };
          setCart([
            {
              id: "cart-item-demo",
              product: defaultProduct,
              variant: defaultProduct.variants[0],
              quantity: 1
            }
          ]);
        }

        const savedWishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } catch (err) {
        console.warn("Could not load cart from localStorage", err);
      }
    }

    loadUserCartAndWishlist();
  }, [isAuthenticated, user]);

  // Persist guest cart in localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      } catch (err) {
        console.warn("Could not save cart to localStorage", err);
      }
    }
  }, [cart, isAuthenticated]);

  // Persist guest wishlist in localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
      } catch (err) {
        console.warn("Could not save wishlist to localStorage", err);
      }
    }
  }, [wishlist, isAuthenticated]);

  const addToCart = async (product: Product, selectedVariant?: ProductVariant, quantity = 1) => {
    const variant = selectedVariant || product.variants[0];
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.variant?.id === variant?.id
    );

    // ⚡ OPTIMISTIC UPDATE — update local state immediately so UI responds instantly
    updateLocalAddToCart(product, variant, quantity, existingIndex);
    setIsCartOpen(true);

    // Sync with backend in background (no await — fire and forget)
    if (isAuthenticated) {
      apiClient.post("/api/v1/cart", {
        productId: product.id,
        variantId: variant.id,
        quantity,
      });
    }
  };

  const updateLocalAddToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number,
    existingIndex: number
  ) => {
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${variant.id}-${Date.now()}`,
        product,
        variant,
        quantity,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (isAuthenticated) {
      try {
        await apiClient.delete(`/api/v1/cart?id=${cartItemId}`);
      } catch (err) {
        console.warn("API delete cart item failed", err);
      }
    }
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (isAuthenticated) {
      try {
        await apiClient.patch("/api/v1/cart", { id: cartItemId, quantity });
      } catch (err) {
        console.warn("API update cart quantity failed", err);
      }
    }

    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = async (productId: string) => {
    const isCurrentlyWishlisted = wishlist.includes(productId);
    const updated = isCurrentlyWishlisted
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updated);

    if (isAuthenticated) {
      try {
        if (isCurrentlyWishlisted) {
          await apiClient.delete(`/api/v1/account/wishlist?productId=${productId}`);
        } else {
          await apiClient.post("/api/v1/account/wishlist", { productId });
        }
      } catch (err) {
        console.warn("API wishlist toggle failed", err);
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.variant?.price || item.product?.basePrice || 0) * item.quantity,
    0
  );
  const freeShippingThreshold = 99900; // ₹999

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isWishlisted,
        openCart,
        closeCart,
        openSearch,
        closeSearch,
        totalItems,
        subtotal,
        freeShippingThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
