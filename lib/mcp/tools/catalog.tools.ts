import { prisma } from "@/lib/db/client";

export async function searchProductsTool(args: {
  query?: string;
  categorySlug?: string;
  fabric?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const { query, categorySlug, fabric, minPrice, maxPrice } = args;

  const where: Record<string, unknown> = { isActive: true };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (fabric) {
    where.fabric = { equals: fabric, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    const priceFilter: { gte?: number; lte?: number } = {};
    if (minPrice) priceFilter.gte = minPrice * 100;
    if (maxPrice) priceFilter.lte = maxPrice * 100;
    where.basePrice = priceFilter;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      media: { orderBy: { position: "asc" } },
      variants: true,
    },
    take: 10,
  });

  return {
    count: products.length,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      fabric: p.fabric,
      basePrice: p.basePrice / 100,
      badge: p.badge,
      rating: p.rating,
      media: p.media.map((m) => ({ url: m.url, type: m.type, provider: m.provider })),
      variants: p.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock, sku: v.sku })),
    })),
  };
}
