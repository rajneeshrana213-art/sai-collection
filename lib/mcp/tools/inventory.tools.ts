import { prisma } from "@/lib/db/client";

export async function updateInventoryTool(args: { sku: string; newStock: number }) {
  const variant = await prisma.productVariant.findUnique({
    where: { sku: args.sku },
    include: { product: true },
  });

  if (!variant) {
    return { error: `Variant with SKU '${args.sku}' not found.` };
  }

  const updated = await prisma.productVariant.update({
    where: { sku: args.sku },
    data: { stock: args.newStock },
  });

  return {
    success: true,
    sku: updated.sku,
    productName: variant.product.name,
    size: updated.size,
    color: updated.color,
    previousStock: variant.stock,
    updatedStock: updated.stock,
  };
}
