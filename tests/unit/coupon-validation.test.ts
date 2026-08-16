import { describe, it, expect } from "vitest";
import { ValidateCouponSchema } from "@/lib/validations/coupon.schema";

describe("Coupon Zod Validation Schema", () => {
  it("should validate a correct coupon validation request", () => {
    const input = {
      code: "FESTIVE20",
      subtotal: 350000, // ₹3,500
    };

    const parsed = ValidateCouponSchema.parse(input);
    expect(parsed.code).toBe("FESTIVE20");
    expect(parsed.subtotal).toBe(350000);
  });

  it("should throw validation error on negative subtotal or empty code", () => {
    expect(() => ValidateCouponSchema.parse({ code: "", subtotal: 100 })).toThrow();
    expect(() => ValidateCouponSchema.parse({ code: "SAVE10", subtotal: -50 })).toThrow();
  });
});
