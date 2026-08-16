import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { AddressSchema } from "@/lib/validations/account.schema";
import { prisma } from "@/lib/db/client";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const parsed = AddressSchema.parse(body);

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.userId) {
      return NextResponse.json({ error: "Address not found or forbidden" }, { status: 404 });
    }

    if (parsed.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Address update failed" }, { status: 400 });
  }
}

export async function PATCH(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.userId) {
      return NextResponse.json({ error: "Address not found or forbidden" }, { status: 404 });
    }

    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    });

    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to set default address" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.userId) {
      return NextResponse.json({ error: "Address not found or forbidden" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Address deletion failed" }, { status: 400 });
  }
}
