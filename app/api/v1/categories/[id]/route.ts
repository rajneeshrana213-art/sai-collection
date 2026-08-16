import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, slug, description, imageUrl, badge } = body;

    const generatedSlug = slug
      ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : name ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : undefined;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(generatedSlug && { slug: generatedSlug }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(badge !== undefined && { badge }),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Category update failed" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return PUT(req, context);
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Category deletion failed" }, { status: 400 });
  }
}
