import { NextResponse } from "next/server";
import { ForgotPasswordSchema } from "@/lib/validations/auth.schema";
import { requestPasswordReset } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.parse(body);
    const result = await requestPasswordReset(parsed);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Password reset request failed" }, { status: 400 });
  }
}
