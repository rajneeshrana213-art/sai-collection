import { z } from "zod";

export const CreateOrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID required"),
  variantId: z.string().min(1, "Variant ID required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const CreateOrderSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1, "Cart cannot be empty"),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  couponCode: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().min(10).optional(),
  shippingAddress: z.object({
    fullName: z.string().min(2, "Full name required"),
    phone: z.string().min(10, "Phone number required"),
    line1: z.string().min(3, "Address line 1 required"),
    line2: z.string().optional(),
    city: z.string().min(2, "City required"),
    state: z.string().min(2, "State required"),
    pincode: z.string().min(6, "Valid 6-digit pincode required"),
  }),
});

export const TrackOrderQuerySchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  contact: z.string().min(5, "Email or phone number required"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type TrackOrderQueryInput = z.infer<typeof TrackOrderQuerySchema>;
