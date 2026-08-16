import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/media/cloudinary";
import { UploadSignatureSchema } from "@/lib/validations/media.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = UploadSignatureSchema.parse(body);
    const signatureData = generateUploadSignature(parsed.folder, parsed.tags);
    return NextResponse.json(signatureData);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to generate upload signature" }, { status: 400 });
  }
}
