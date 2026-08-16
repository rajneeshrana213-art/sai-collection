import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

export const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid 10-digit phone number required"),
  line1: z.string().min(3, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid 6-digit pincode required"),
  isDefault: z.boolean().optional().default(false),
});

export const ToggleWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type ToggleWishlistInput = z.infer<typeof ToggleWishlistSchema>;
