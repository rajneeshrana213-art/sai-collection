import { NextResponse } from "next/server";
import { ProductQuerySchema, CreateProductSchema } from "@/lib/validations/product.schema";
import { prisma } from "@/lib/db/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const parsed = ProductQuerySchema.parse(queryObj);

    const where: Record<string, unknown> = { isActive: true };

    if (parsed.category) {
      where.category = { slug: parsed.category };
    }

    if (parsed.subCategory) {
      where.subCategorySlug = parsed.subCategory;
    }

    if (parsed.fabric) {
      where.fabric = { equals: parsed.fabric, mode: "insensitive" };
    }

    if (parsed.craft) {
      where.craft = { equals: parsed.craft, mode: "insensitive" };
    }

    if (parsed.badge) {
      where.badge = parsed.badge;
    }

    if (parsed.minPrice || parsed.maxPrice) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (parsed.minPrice) priceFilter.gte = parsed.minPrice * 100;
      if (parsed.maxPrice) priceFilter.lte = parsed.maxPrice * 100;
      where.basePrice = priceFilter;
    }

    if (parsed.search) {
      where.OR = [
        { name: { contains: parsed.search, mode: "insensitive" } },
        { description: { contains: parsed.search, mode: "insensitive" } },
        { fabric: { contains: parsed.search, mode: "insensitive" } },
        { craft: { contains: parsed.search, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (parsed.sort === "price_asc") orderBy = { basePrice: "asc" };
    if (parsed.sort === "price_desc") orderBy = { basePrice: "desc" };
    if (parsed.sort === "rating") orderBy = { rating: "desc" };

    const skip = (parsed.page - 1) * parsed.limit;

    const [rawProducts, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          subCategorySlug: true,
          basePrice: true,
          originalPrice: true,
          badge: true,
          rating: true,
          reviewsCount: true,
          fabric: true,
          craft: true,
          isAvailableForCOD: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          media: {
            select: {
              id: true,
              url: true,
              altText: true,
            },
            orderBy: { position: "asc" },
          },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              sku: true,
              price: true,
              stock: true,
            },
            where: { isActive: true },
          },
        },
        orderBy,
        skip,
        take: parsed.limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = rawProducts.map((p) => {
      const mediaImages = p.media.map((m) => ({
        id: m.id,
        url: m.url,
        altText: m.altText || p.name,
      }));
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category.name,
        categorySlug: p.category.slug,
        subCategorySlug: p.subCategorySlug || undefined,
        basePrice: p.basePrice,
        originalPrice: p.originalPrice || undefined,
        badge: p.badge || undefined,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        fabric: p.fabric || undefined,
        craft: p.craft || undefined,
        isAvailableForCOD: p.isAvailableForCOD,
        images: mediaImages,
        media: mediaImages,
        variants: p.variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
        })),
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total: totalCount,
        page: parsed.page,
        limit: parsed.limit,
        totalPages: Math.ceil(totalCount / parsed.limit),
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch products" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description,
        categoryId: parsed.categoryId,
        subCategorySlug: parsed.subCategorySlug,
        fabric: parsed.fabric,
        craft: parsed.craft,
        basePrice: parsed.basePrice,
        originalPrice: parsed.originalPrice,
        badge: parsed.badge,
        isAvailableForCOD: parsed.isAvailableForCOD ?? true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to create product" }, { status: 400 });
  }
}
