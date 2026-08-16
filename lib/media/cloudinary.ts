import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "sai-collection-cloud";
const apiKey = process.env.CLOUDINARY_API_KEY || "1234567890";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "secret_key_12345";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function generateUploadSignature(folder: string = "products", tags: string[] = []) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };
  if (tags.length > 0) {
    paramsToSign.tags = tags.join(",");
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

export async function deleteAsset(publicId: string, resourceType: "image" | "video" = "image") {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete asset error:", error);
    throw error;
  }
}

export async function uploadUrlToCloudinary(url: string, folder: string = "products") {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: "auto",
    });
    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      resourceType: result.resource_type === "video" ? ("VIDEO" as const) : ("IMAGE" as const),
      width: result.width,
      height: result.height,
      duration: result.duration ? Math.round(result.duration) : undefined,
    };
  } catch (error) {
    console.error("Cloudinary upload URL error:", error);
    throw error;
  }
}

export { cloudinary };
