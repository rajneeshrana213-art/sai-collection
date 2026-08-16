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
    const { code, type, value, minOrderValue, maxDiscount, validFrom, validUntil, maxUses, isActive } = body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        type: type || undefined,
        value: value !== undefined ? value : undefined,
        minOrderValue: minOrderValue !== undefined ? minOrderValue : undefined,
        maxDiscount: maxDiscount !== undefined ? maxDiscount : undefined,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        maxUses: maxUses !== undefined ? maxUses : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update coupon" }, { status: 400 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { isActive } = body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update coupon" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await context.params;
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to delete coupon" }, { status: 400 });
  }
}
