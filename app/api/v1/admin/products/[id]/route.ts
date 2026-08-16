import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { prisma } from "@/lib/db/client";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { name, slug, description, categoryId, basePrice, originalPrice, fabric, craft, badge, isActive, videoUrl } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : product.name,
        slug: slug !== undefined ? slug : product.slug,
        description: description !== undefined ? description : product.description,
        categoryId: categoryId !== undefined ? categoryId : product.categoryId,
        basePrice: basePrice !== undefined ? basePrice : product.basePrice,
        originalPrice: originalPrice !== undefined ? originalPrice : product.originalPrice,
        fabric: fabric !== undefined ? fabric : product.fabric,
        craft: craft !== undefined ? craft : product.craft,
        badge: badge !== undefined ? badge : product.badge,
        isActive: isActive !== undefined ? isActive : product.isActive,
      },
      include: { variants: true, media: true },
    });

    if (videoUrl !== undefined && typeof videoUrl === "string") {
      const existingVideo = await prisma.productMedia.findFirst({
        where: { productId: id, type: "VIDEO" },
      });

      if (videoUrl.trim()) {
        if (existingVideo) {
          await prisma.productMedia.update({
            where: { id: existingVideo.id },
            data: { url: videoUrl.trim() },
          });
        } else {
          await prisma.productMedia.create({
            data: {
              productId: id,
              type: "VIDEO",
              url: videoUrl.trim(),
              altText: `${updated.name} Video Showcase`,
            },
          });
        }
      } else if (existingVideo) {
        await prisma.productMedia.delete({
          where: { id: existingVideo.id },
        });
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, media: true },
    });

    return NextResponse.json({ success: true, product: finalProduct });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Product update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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

    // 4. Delete product row
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Product deletion failed" }, { status: 400 });
  }
}
