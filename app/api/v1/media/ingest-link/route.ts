import { NextResponse } from "next/server";
import { IngestMediaLinkSchema } from "@/lib/validations/media.schema";
import { ingestAndAttachMedia } from "@/lib/services/media.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = IngestMediaLinkSchema.parse(body);
    const media = await ingestAndAttachMedia(parsed);
    return NextResponse.json({ success: true, media }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to ingest media link" }, { status: 400 });
  }
}
