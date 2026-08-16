import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
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
    return NextResponse.json({ error: (err as Error).message || "Failed to fetch settings" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();

    // Support single key-value update OR batch settings object
    if (body.settings && typeof body.settings === "object") {
      const entries = Object.entries(body.settings as Record<string, unknown>);
      const upserts = entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as object },
          create: { key, value: value as object },
        })
      );
      await Promise.all(upserts);
      return NextResponse.json({ success: true, count: entries.length });
    }

    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true, setting });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to update setting" }, { status: 400 });
  }
}
