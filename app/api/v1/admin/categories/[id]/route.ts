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
    const { name, slug, description, imageUrl, badge } = body;

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug, description, imageUrl, badge },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Category update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await context.params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Category deletion failed" }, { status: 400 });
  }
}
