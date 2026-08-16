import { NextResponse } from "next/server";
import { ChangePasswordSchema } from "@/lib/validations/auth.schema";
import { changePassword } from "@/lib/services/auth.service";
import { getSession } from "@/lib/security/jwt";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ChangePasswordSchema.parse(body);
    const result = await changePassword(session.userId, parsed);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Change password failed" }, { status: 400 });
  }
}
