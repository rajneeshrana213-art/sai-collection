import { NextResponse } from "next/server";
import { ValidateCouponSchema } from "@/lib/validations/coupon.schema";
import { prisma } from "@/lib/db/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ValidateCouponSchema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: parsed.code.toUpperCase(), isActive: true },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code." }, { status: 400 });
    }

    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json({ valid: false, error: "Coupon code has expired." }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "Coupon code usage limit reached." }, { status: 400 });
    }

    if (coupon.minOrderValue && parsed.subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Coupon requires a minimum order subtotal of ₹${coupon.minOrderValue / 100}.`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "PERCENT") {
      discount = Math.round((parsed.subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountPaise: discount,
        discountFormatted: `₹${(discount / 100).toFixed(2)}`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ valid: false, error: (err as Error).message || "Validation failed" }, { status: 400 });
  }
}
