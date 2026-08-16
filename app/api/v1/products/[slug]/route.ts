import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

async function findProduct(idOrSlug: string) {
  return await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
      media: { orderBy: { position: "asc" } },
      variants: true,
    },
  });
}

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const raw = await prisma.product.findFirst({
      where: {
        OR: [{ id: slug }, { slug: slug }],
        isActive: true,
      },
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
            type: true,
            thumbnailUrl: true,
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
        reviews: {
          select: {
            id: true,
            customerName: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
          },
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!raw) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const mediaImages = raw.media.map((m) => ({
      id: m.id,
      url: m.url,
      altText: m.altText || raw.name,
    }));

    const product = {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      category: raw.category.name,
      categorySlug: raw.category.slug,
      subCategorySlug: raw.subCategorySlug || undefined,
      basePrice: raw.basePrice,
      originalPrice: raw.originalPrice || undefined,
      badge: raw.badge || undefined,
      rating: raw.rating,
      reviewsCount: raw.reviewsCount,
      fabric: raw.fabric || undefined,
      craft: raw.craft || undefined,
      isAvailableForCOD: raw.isAvailableForCOD,
      images: mediaImages,
      media: mediaImages,
      variants: raw.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
      })),
      reviews: raw.reviews.map((r) => ({
        id: r.id,
        author: r.customerName,
        customerName: r.customerName,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: new Date(r.createdAt).toLocaleDateString("en-IN"),
      })),
    };

    return NextResponse.json({ product });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch product" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: idOrSlug } = await context.params;
    const body = await req.json();

    const product = await findProduct(idOrSlug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      name,
      slug,
      description,
      categoryId,
      subCategorySlug,
      basePrice,
      originalPrice,
      fabric,
      craft,
      badge,
      isAvailableForCOD,
      isActive,
      images,
      variants,
    } = body;

    const generatedSlug = slug
      ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : name
        ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : product.slug;

    if (Array.isArray(images) && images.length > 0) {
      await prisma.productMedia.deleteMany({ where: { productId: product.id } });
    }
    if (Array.isArray(variants) && variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(name !== undefined && { name }),
        slug: generatedSlug,
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(subCategorySlug !== undefined && { subCategorySlug }),
        ...(basePrice !== undefined && {
          basePrice: typeof basePrice === "number" ? basePrice : Math.round(parseFloat(basePrice) * 100),
        }),
        ...(originalPrice !== undefined && {
          originalPrice: originalPrice
            ? typeof originalPrice === "number"
              ? originalPrice
              : Math.round(parseFloat(originalPrice) * 100)
            : null,
        }),
        ...(fabric !== undefined && { fabric: fabric || null }),
        ...(craft !== undefined && { craft: craft || null }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(isAvailableForCOD !== undefined && { isAvailableForCOD }),
        ...(isActive !== undefined && { isActive }),
        ...(Array.isArray(images) && images.length > 0 && {
          media: {
            create: images.map((img: { url: string; altText?: string }) => ({
              url: img.url,
              altText: img.altText || name || product.name,
            })),
          },
        }),
        ...(Array.isArray(variants) && variants.length > 0 && {
          variants: {
            create: variants.map((v: { size: string; color?: string; sku?: string; price?: number; stock?: number }) => ({
              size: v.size,
              color: v.color || "Default",
              sku: v.sku || `SAI-${generatedSlug.toUpperCase().slice(0, 6)}-${v.size}-${Math.floor(Math.random() * 1000)}`,
              price: v.price ?? (typeof basePrice === "number" ? basePrice : Math.round(parseFloat(basePrice) * 100)),
              stock: v.stock ?? 10,
            })),
          },
        }),
      },
      include: {
        category: true,
        media: true,
        variants: true,
      },
    });

    const mediaImages = updated.media.map((m) => ({
      id: m.id,
      url: m.url,
      altText: m.altText || updated.name,
    }));

    const formatted = {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      category: updated.category.name,
      categorySlug: updated.category.slug,
      subCategorySlug: updated.subCategorySlug || undefined,
      basePrice: updated.basePrice,
      originalPrice: updated.originalPrice || undefined,
      badge: updated.badge || undefined,
      rating: updated.rating,
      reviewsCount: updated.reviewsCount,
      fabric: updated.fabric || undefined,
      craft: updated.craft || undefined,
      isAvailableForCOD: updated.isAvailableForCOD,
      images: mediaImages,
      media: mediaImages,
      variants: updated.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
      })),
    };

    return NextResponse.json({ success: true, product: formatted });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Product update failed" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return PUT(req, context);
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: idOrSlug } = await context.params;
    const product = await findProduct(idOrSlug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const id = product.id;
    const variantIds = product.variants.map((v) => v.id);

    // 1. Clear cart and wishlist references
    await prisma.cartItem.deleteMany({
      where: {
        OR: [{ productId: id }, { variantId: { in: variantIds } }],
      },
    });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });

    // 2. Clear reviews, media, and order items referencing product or variants
    await prisma.productReview.deleteMany({ where: { productId: id } });
    await prisma.productMedia.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({
      where: {
        OR: [{ productId: id }, { variantId: { in: variantIds } }],
      },
    });

    // 3. Clear product variants
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    // 4. Finally delete product row
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Product deletion failed" }, { status: 400 });
  }
}
