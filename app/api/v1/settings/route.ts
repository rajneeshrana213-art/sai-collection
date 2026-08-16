import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, unknown>);

    return NextResponse.json({ settings: settingsMap });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch public site settings" }, { status: 400 });
  }
}
