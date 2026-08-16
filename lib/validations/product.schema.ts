import { z } from "zod";

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  subCategory: z.string().optional(),
  fabric: z.string().optional(),
  craft: z.string().optional(),
  badge: z.enum(["NEW", "BEST_SELLER", "SALE", "TRENDING"]).optional(),
  minPrice: z.coerce.number().optional(), // in paise or rupees
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "rating"]).optional().default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const ProductVariantInputSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().int().min(0, "Price in paise"),
  stock: z.number().int().min(0, "Stock count"),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  subCategorySlug: z.string().optional(),
  fabric: z.string().optional(),
  craft: z.string().optional(),
  basePrice: z.number().int().min(0, "Base price in paise"),
  originalPrice: z.number().int().optional(),
  badge: z.enum(["NEW", "BEST_SELLER", "SALE", "TRENDING"]).optional(),
  isAvailableForCOD: z.boolean().optional().default(true),
  variants: z.array(ProductVariantInputSchema).min(1, "At least one variant required"),
  mediaUrls: z.array(z.string().url()).optional(),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
