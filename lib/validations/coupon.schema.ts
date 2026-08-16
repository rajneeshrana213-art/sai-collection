import { z } from "zod";

export const ValidateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().int().min(0, "Subtotal in paise"),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().int().min(1, "Discount value"),
  minOrderValue: z.number().int().optional(),
  maxDiscount: z.number().int().optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  maxUses: z.number().int().optional(),
});

export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;
export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
