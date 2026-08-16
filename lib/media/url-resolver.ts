import { isGDriveUrl, resolveGDriveDirectUrl } from "./gdrive";
import { uploadUrlToCloudinary } from "./cloudinary";

export interface ResolvedMediaInfo {
  provider: "CLOUDINARY" | "GOOGLE_DRIVE" | "EXTERNAL_URL";
  type: "IMAGE" | "VIDEO";
  renderUrl: string;
  originalUrl: string;
  thumbnailUrl: string;
  publicId?: string;
  aspectRatio?: string;
  durationSec?: number;
}

export async function resolveAndIngestMediaUrl(
  inputUrl: string,
  options: {
    autoMirror?: boolean;
    folder?: string;
    mediaTypeHint?: "IMAGE" | "VIDEO";
  } = {}
): Promise<ResolvedMediaInfo> {
  const { autoMirror = false, folder = "products", mediaTypeHint } = options;

  // 1. Google Drive Link Check
  if (isGDriveUrl(inputUrl)) {
    const { fileId, directUrl, thumbnailUrl } = resolveGDriveDirectUrl(inputUrl);
    
    if (autoMirror && fileId) {
      try {
        const cloudMedia = await uploadUrlToCloudinary(directUrl, folder);
        return {
          provider: "CLOUDINARY",
          type: mediaTypeHint || cloudMedia.resourceType,
          renderUrl: cloudMedia.url,
          originalUrl: inputUrl,
          thumbnailUrl: cloudMedia.url,
          publicId: cloudMedia.publicId,
          durationSec: cloudMedia.duration,
        };
      } catch (err) {
        console.warn("Auto-mirroring Google Drive link failed, falling back to direct GDrive CDN:", err);
      }
    }

    return {
      provider: "GOOGLE_DRIVE",
      type: mediaTypeHint || "IMAGE",
      renderUrl: directUrl,
      originalUrl: inputUrl,
      thumbnailUrl,
      publicId: fileId || undefined,
    };
  }

  // 2. External Web URL
  const isVideo = mediaTypeHint === "VIDEO" || /\.(mp4|mov|webm|m3u8)(\?.*)?$/i.test(inputUrl);
  
  if (autoMirror) {
    try {
      const cloudMedia = await uploadUrlToCloudinary(inputUrl, folder);
      return {
        provider: "CLOUDINARY",
        type: mediaTypeHint || cloudMedia.resourceType,
        renderUrl: cloudMedia.url,
        originalUrl: inputUrl,
        thumbnailUrl: cloudMedia.url,
        publicId: cloudMedia.publicId,
        durationSec: cloudMedia.duration,
      };
    } catch (err) {
      console.warn("Auto-mirroring external URL failed, using direct URL:", err);
    }
  }

  return {
    provider: "EXTERNAL_URL",
    type: isVideo ? "VIDEO" : "IMAGE",
    renderUrl: inputUrl,
    originalUrl: inputUrl,
    thumbnailUrl: inputUrl,
  };
}
