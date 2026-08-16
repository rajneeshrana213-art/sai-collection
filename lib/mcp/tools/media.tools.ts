import { ingestAndAttachMedia, deleteProductMedia } from "@/lib/services/media.service";

export async function ingestMediaLinkTool(args: {
  productId: string;
  url: string;
  type?: "IMAGE" | "VIDEO";
  altText?: string;
  isPrimary?: boolean;
  autoMirror?: boolean;
}) {
  const media = await ingestAndAttachMedia({
    productId: args.productId,
    url: args.url,
    type: args.type || "IMAGE",
    altText: args.altText || "",
    isPrimary: args.isPrimary || false,
    autoMirror: args.autoMirror !== undefined ? args.autoMirror : true,
  });

  return {
    success: true,
    mediaId: media.id,
    provider: media.provider,
    type: media.type,
    renderUrl: media.url,
    isPrimary: media.isPrimary,
  };
}

export async function deleteMediaTool(args: { mediaId: string }) {
  await deleteProductMedia(args.mediaId);
  return { success: true, message: `Media asset ${args.mediaId} deleted.` };
}
