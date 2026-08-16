import { NextResponse } from "next/server";
import { CreateOrderSchema } from "@/lib/validations/order.schema";
import { processCheckoutOrder } from "@/lib/services/order.service";
import { getSession } from "@/lib/security/jwt";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = CreateOrderSchema.parse(body);

    const result = await processCheckoutOrder(parsed, session?.userId);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Checkout failed" }, { status: 400 });
  }
}
