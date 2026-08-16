import { NextResponse } from "next/server";
import { getSession } from "@/lib/security/jwt";
import { ProfileUpdateSchema } from "@/lib/validations/account.schema";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = ProfileUpdateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: parsed,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Profile update failed" }, { status: 400 });
  }
}
