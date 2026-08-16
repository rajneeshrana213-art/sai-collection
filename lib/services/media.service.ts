import { prisma } from "@/lib/db/client";
import { resolveAndIngestMediaUrl } from "@/lib/media/url-resolver";
import { deleteAsset } from "@/lib/media/cloudinary";
import { IngestMediaLinkInput, UpdateMediaInput } from "@/lib/validations/media.schema";

export async function ingestAndAttachMedia(input: IngestMediaLinkInput) {
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
  });

  if (!product) {
    throw new Error(`Product with ID '${input.productId}' not found.`);
  }

  const resolved = await resolveAndIngestMediaUrl(input.url, {
    autoMirror: input.autoMirror,
    mediaTypeHint: input.type,
    folder: `products/${product.slug}`,
  });

  if (input.isPrimary) {
    // Reset existing primary flags for this product
    await prisma.productMedia.updateMany({
      where: { productId: product.id },
      data: { isPrimary: false },
    });
  }

  const mediaCount = await prisma.productMedia.count({
    where: { productId: product.id },
  });

  const mediaRecord = await prisma.productMedia.create({
    data: {
      productId: product.id,
      type: resolved.type,
      provider: resolved.provider,
      url: resolved.renderUrl,
      originalUrl: resolved.originalUrl,
      thumbnailUrl: resolved.thumbnailUrl,
      publicId: resolved.publicId,
      altText: input.altText || product.name,
      durationSec: resolved.durationSec,
      position: mediaCount + 1,
      isPrimary: input.isPrimary || mediaCount === 0,
    },
  });

  return mediaRecord;
}

export async function updateMediaMetadata(mediaId: string, input: UpdateMediaInput) {
  const media = await prisma.productMedia.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media asset not found.");

  if (input.isPrimary) {
    await prisma.productMedia.updateMany({
      where: { productId: media.productId },
      data: { isPrimary: false },
    });
  }

  const updated = await prisma.productMedia.update({
    where: { id: mediaId },
    data: {
      altText: input.altText ?? media.altText,
      position: input.position ?? media.position,
      isPrimary: input.isPrimary ?? media.isPrimary,
    },
  });

  return updated;
}

export async function deleteProductMedia(mediaId: string) {
  const media = await prisma.productMedia.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media asset not found.");

  if (media.provider === "CLOUDINARY" && media.publicId) {
    try {
      await deleteAsset(media.publicId, media.type === "VIDEO" ? "video" : "image");
    } catch (err) {
      console.warn("Failed to delete Cloudinary asset:", err);
    }
  }

  await prisma.productMedia.delete({ where: { id: mediaId } });

  // If deleted media was primary, assign primary to the first remaining asset
  if (media.isPrimary) {
    const nextPrimary = await prisma.productMedia.findFirst({
      where: { productId: media.productId },
      orderBy: { position: "asc" },
    });
    if (nextPrimary) {
      await prisma.productMedia.update({
        where: { id: nextPrimary.id },
        data: { isPrimary: true },
      });
    }
  }

  return { success: true };
}
