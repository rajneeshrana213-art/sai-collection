import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      badge: cat.badge || undefined,
      itemCount: cat._count.products,
      subCategories: cat.children.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description || "",
        imageUrl: sub.imageUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        itemCount: sub._count.products,
      })),
    }));

    return NextResponse.json({ categories: formatted });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch categories" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, badge, parentId } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || null,
        imageUrl: imageUrl || null,
        badge: badge || null,
        parentId: parentId || null,
      },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });

    const formatted = {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description || "",
      imageUrl: newCategory.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      badge: newCategory.badge || undefined,
      itemCount: newCategory._count.products,
      subCategories: newCategory.children.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description || "",
        imageUrl: sub.imageUrl || "",
        itemCount: sub._count.products,
      })),
    };

    return NextResponse.json({ category: formatted }, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin category creation error:", err);
    return NextResponse.json({ error: (err as Error).message || "Failed to create category" }, { status: 500 });
  }
}
