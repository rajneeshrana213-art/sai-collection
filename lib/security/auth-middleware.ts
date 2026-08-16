import { NextResponse } from "next/server";
import { getSession, SessionPayload } from "./jwt";

export async function requireAuth(
  options: { requireAdmin?: boolean } = {}
): Promise<{ session: SessionPayload } | { errorResponse: NextResponse }> {
  const session = await getSession();

  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Please log in to access this resource." },
        { status: 401 }
      ),
    };
  }

  if (options.requireAdmin && session.role !== "ADMIN") {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden: Admin privileges required." },
        { status: 403 }
      ),
    };
  }

  return { session };
}
