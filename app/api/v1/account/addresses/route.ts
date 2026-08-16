import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { AddressSchema } from "@/lib/validations/account.schema";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = AddressSchema.parse(body);

    if (parsed.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        ...parsed,
      },
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Failed to add address" }, { status: 400 });
  }
}
