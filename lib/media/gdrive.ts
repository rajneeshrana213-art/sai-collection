/**
 * Google Drive Media Link Parser & Direct URL Generator
 * Supports:
 * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 * - https://drive.google.com/file/d/{FILE_ID}/edit
 */

export function extractGDriveFileId(url: string): string | null {
  if (!url) return null;

  // Pattern 1: /file/d/{FILE_ID}/
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id={FILE_ID}
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return null;
}

export function isGDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export function resolveGDriveDirectUrl(url: string): {
  fileId: string | null;
  directUrl: string;
  thumbnailUrl: string;
} {
  const fileId = extractGDriveFileId(url);
  if (!fileId) {
    return {
      fileId: null,
      directUrl: url,
      thumbnailUrl: url,
    };
  }

  // Google User Content CDN direct image link
  const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
  const thumbnailUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400`;

  return {
    fileId,
    directUrl,
    thumbnailUrl,
  };
}
