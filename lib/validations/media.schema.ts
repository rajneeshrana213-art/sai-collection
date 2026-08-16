import { z } from "zod";

export const UploadSignatureSchema = z.object({
  folder: z.string().optional().default("products"),
  tags: z.array(z.string()).optional(),
});

export const IngestMediaLinkSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  url: z.string().url("Must be a valid web URL or Google Drive link"),
  type: z.enum(["IMAGE", "VIDEO"]).optional().default("IMAGE"),
  altText: z.string().optional().default(""),
  isPrimary: z.boolean().optional().default(false),
  autoMirror: z.boolean().optional().default(true),
});

export const UpdateMediaSchema = z.object({
  altText: z.string().optional(),
  position: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export type UploadSignatureInput = z.infer<typeof UploadSignatureSchema>;
export type IngestMediaLinkInput = z.infer<typeof IngestMediaLinkSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
