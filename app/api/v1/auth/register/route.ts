import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validations/auth.schema";
import { registerUser } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.parse(body);
    const user = await registerUser(parsed);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Registration failed" }, { status: 400 });
  }
}
