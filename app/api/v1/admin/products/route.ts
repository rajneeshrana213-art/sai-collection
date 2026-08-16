import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        media: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = products.map((prod) => ({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      category: prod.category.name,
      categorySlug: prod.category.slug,
      subCategorySlug: prod.subCategorySlug || undefined,
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || undefined,
      badge: prod.badge || undefined,
      rating: prod.rating,
      reviewsCount: prod.reviewsCount,
      fabric: prod.fabric || undefined,
      craft: prod.craft || undefined,
      videoUrl: prod.media.find((m) => m.type === "VIDEO")?.url || undefined,
      images: prod.media.map((m) => ({
        id: m.id,
        url: m.url,
        type: m.type,
        altText: m.altText || prod.name,
      })),
      variants: prod.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
      })),
    }));

    return NextResponse.json({ products: formatted });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch admin products" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      categoryId,
      subCategorySlug,
      basePrice,
      originalPrice,
      badge,
      fabric,
      craft,
      isAvailableForCOD,
      videoUrl,
      images,
      variants,
    } = body;

    if (!name || !categoryId || basePrice === undefined) {
      return NextResponse.json({ error: "Name, categoryId, and basePrice are required" }, { status: 400 });
    }

    let generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existingSlug = await prisma.product.findUnique({ where: { slug: generatedSlug } });
    if (existingSlug) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    const mediaList: Array<{ url: string; type: "IMAGE" | "VIDEO"; altText: string }> = (images || []).map((img: { url: string; altText?: string }) => ({
      url: img.url,
      type: "IMAGE" as const,
      altText: img.altText || name,
    }));

    if (videoUrl && typeof videoUrl === "string" && videoUrl.trim()) {
      mediaList.push({
        url: videoUrl.trim(),
        type: "VIDEO" as const,
        altText: `${name} Video Showcase`,
      });
    }

    const newProd = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || `Handcrafted ${name} from Panipat.`,
        categoryId,
        subCategorySlug: subCategorySlug || null,
        basePrice: typeof basePrice === "number" ? basePrice : Math.round(parseFloat(basePrice) * 100),
        originalPrice: originalPrice ? (typeof originalPrice === "number" ? originalPrice : Math.round(parseFloat(originalPrice) * 100)) : null,
        badge: badge || null,
        fabric: fabric || null,
        craft: craft || null,
        isAvailableForCOD: isAvailableForCOD ?? true,
        media: {
          create: mediaList,
        },
        variants: {
          create: (variants || []).map((v: { size: string; color?: string; sku?: string; price?: number; stock?: number }) => ({
            size: v.size,
            color: v.color || "Default",
            sku: v.sku || `SAI-${generatedSlug.toUpperCase().slice(0, 6)}-${v.size}-${Math.floor(Math.random() * 1000)}`,
            price: v.price ?? (typeof basePrice === "number" ? basePrice : Math.round(parseFloat(basePrice) * 100)),
            stock: v.stock ?? 10,
          })),
        },
      },
      include: {
        category: true,
        media: true,
        variants: true,
      },
    });

    const formatted = {
      id: newProd.id,
      name: newProd.name,
      slug: newProd.slug,
      description: newProd.description,
      category: newProd.category.name,
      categorySlug: newProd.category.slug,
      subCategorySlug: newProd.subCategorySlug || undefined,
      basePrice: newProd.basePrice,
      originalPrice: newProd.originalPrice || undefined,
      badge: newProd.badge || undefined,
      rating: newProd.rating,
      reviewsCount: newProd.reviewsCount,
      fabric: newProd.fabric || undefined,
      craft: newProd.craft || undefined,
      isAvailableForCOD: newProd.isAvailableForCOD,
      images: newProd.media.map((m) => ({
        id: m.id,
        url: m.url,
        altText: m.altText || newProd.name,
      })),
      variants: newProd.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
      })),
    };

    return NextResponse.json({ product: formatted }, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin product creation error:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to create product" }, { status: 500 });
  }
}
