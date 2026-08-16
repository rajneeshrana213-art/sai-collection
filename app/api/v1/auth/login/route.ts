import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { loginUser } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.parse(body);
    const user = await loginUser(parsed);
    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Login failed" }, { status: 400 });
  }
}
