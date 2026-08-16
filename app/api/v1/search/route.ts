import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { fabric: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { media: { where: { isPrimary: true }, take: 1 } },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        take: 4,
      }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        image: p.media[0]?.url || "/placeholder-saree.jpg",
      })),
      categories,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Search failed" }, { status: 400 });
  }
}
