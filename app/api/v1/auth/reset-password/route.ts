import { NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/lib/validations/auth.schema";
import { resetPasswordWithToken } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.parse(body);
    const result = await resetPasswordWithToken(parsed);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Password reset failed" }, { status: 400 });
  }
}
