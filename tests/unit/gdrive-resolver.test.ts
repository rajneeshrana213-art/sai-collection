import { describe, it, expect } from "vitest";
import { extractGDriveFileId, isGDriveUrl, resolveGDriveDirectUrl } from "@/lib/media/gdrive";

describe("Google Drive Media Link Parser & Direct Resolver", () => {
  it("should detect Google Drive URLs correctly", () => {
    expect(isGDriveUrl("https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing")).toBe(true);
    expect(isGDriveUrl("https://docs.google.com/uc?id=1A2B3C4D5E6F7G8H9I0J")).toBe(true);
    expect(isGDriveUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg")).toBe(false);
  });

  it("should extract file ID from standard Google Drive share links", () => {
    const url = "https://drive.google.com/file/d/1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P/view?usp=sharing";
    const fileId = extractGDriveFileId(url);
    expect(fileId).toBe("1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P");
  });

  it("should extract file ID from google drive query param link", () => {
    const url = "https://drive.google.com/open?id=1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P";
    const fileId = extractGDriveFileId(url);
    expect(fileId).toBe("1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P");
  });

  it("should resolve direct render and thumbnail URLs for Google Drive files", () => {
    const url = "https://drive.google.com/file/d/1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P/view";
    const resolved = resolveGDriveDirectUrl(url);

    expect(resolved.fileId).toBe("1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P");
    expect(resolved.directUrl).toBe("https://lh3.googleusercontent.com/d/1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P");
    expect(resolved.thumbnailUrl).toBe("https://lh3.googleusercontent.com/d/1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P=w400");
  });
});
