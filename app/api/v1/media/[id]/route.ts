import { NextResponse } from "next/server";
import { UpdateMediaSchema } from "@/lib/validations/media.schema";
import { updateMediaMetadata, deleteProductMedia } from "@/lib/services/media.service";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const parsed = UpdateMediaSchema.parse(body);
    const updated = await updateMediaMetadata(id, parsed);
    return NextResponse.json({ success: true, media: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update media" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const result = await deleteProductMedia(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to delete media" }, { status: 400 });
  }
}
