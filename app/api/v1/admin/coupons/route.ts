import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { CreateCouponSchema } from "@/lib/validations/coupon.schema";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateCouponSchema.parse(body);

    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.code,
        type: parsed.type,
        value: parsed.value,
        minOrderValue: parsed.minOrderValue,
        maxDiscount: parsed.maxDiscount,
        validFrom: parsed.validFrom ? new Date(parsed.validFrom) : new Date(),
        validUntil: parsed.validUntil ? new Date(parsed.validUntil) : null,
        maxUses: parsed.maxUses,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to create coupon" }, { status: 400 });
  }
}
