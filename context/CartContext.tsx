"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/lib/mock-data";

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
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initialize with sample cart item for immediate interactive demo
  useEffect(() => {
    // Add default initial item to showcase cart UI
    const defaultProduct = {
      id: "prod-1",
      name: "Panipat Royal Velvet Anarkali Suit Set",
      slug: "panipat-royal-velvet-anarkali-suit-set",
      description: "Exquisite dark maroon velvet Anarkali suit with intricate zari and gota patti embroidery.",
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
  }, []);

  const addToCart = (product: Product, selectedVariant?: ProductVariant, quantity = 1) => {
    const variant = selectedVariant || product.variants[0];
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.variant.id === variant.id
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${variant.id}-${Date.now()}`,
        product,
        variant,
        quantity
      };
      setCart([...cart, newItem]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
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
