import { NextResponse } from "next/server";
import { getGuestOrderTracking } from "@/lib/services/order.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const contact = searchParams.get("contact");

    if (!orderNumber || !contact) {
      return NextResponse.json({ error: "orderNumber and contact parameters are required." }, { status: 400 });
    }

    const order = await getGuestOrderTracking(orderNumber, contact);
    return NextResponse.json({ order });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Order tracking failed" }, { status: 400 });
  }
}
