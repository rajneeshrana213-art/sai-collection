import { NextResponse } from "next/server";
import { searchProductsTool } from "@/lib/mcp/tools/catalog.tools";
import { ingestMediaLinkTool, deleteMediaTool } from "@/lib/mcp/tools/media.tools";
import { getOrderStatusTool } from "@/lib/mcp/tools/orders.tools";
import { updateInventoryTool } from "@/lib/mcp/tools/inventory.tools";
import { getSalesAnalyticsTool } from "@/lib/mcp/tools/analytics.tools";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, method, params } = body;

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id || 1,
        result: {
          tools: [
            {
              name: "search_products",
              description: "Search product catalog by keyword query, category, fabric, or price range.",
              inputSchema: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  categorySlug: { type: "string" },
                  fabric: { type: "string" },
                  minPrice: { type: "number" },
                  maxPrice: { type: "number" },
                },
              },
            },
            {
              name: "ingest_media_link",
              description: "Ingest a Google Drive link, Cloudinary URL, or external Web URL into product media.",
              inputSchema: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  url: { type: "string" },
                  type: { type: "string", enum: ["IMAGE", "VIDEO"] },
                  altText: { type: "string" },
                  isPrimary: { type: "boolean" },
                  autoMirror: { type: "boolean" },
                },
                required: ["productId", "url"],
              },
            },
            {
              name: "delete_media",
              description: "Delete product media asset by media ID.",
              inputSchema: {
                type: "object",
                properties: {
                  mediaId: { type: "string" },
                },
                required: ["mediaId"],
              },
            },
            {
              name: "get_order_status",
              description: "Retrieve order status, delivery estimate, and courier tracking info by order number.",
              inputSchema: {
                type: "object",
                properties: {
                  orderNumber: { type: "string" },
                },
                required: ["orderNumber"],
              },
            },
            {
              name: "update_inventory",
              description: "Update stock count for a variant by SKU.",
              inputSchema: {
                type: "object",
                properties: {
                  sku: { type: "string" },
                  newStock: { type: "number" },
                },
                required: ["sku", "newStock"],
              },
            },
            {
              name: "get_sales_analytics",
              description: "Retrieve overall store sales analytics, total revenue, and low stock warnings.",
              inputSchema: { type: "object", properties: {} },
            },
          ],
        },
      });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      let toolResult: unknown;

      if (name === "search_products") {
        toolResult = await searchProductsTool(args || {});
      } else if (name === "ingest_media_link") {
        toolResult = await ingestMediaLinkTool(args || {});
      } else if (name === "delete_media") {
        toolResult = await deleteMediaTool(args || {});
      } else if (name === "get_order_status") {
        toolResult = await getOrderStatusTool(args || {});
      } else if (name === "update_inventory") {
        toolResult = await updateInventoryTool(args || {});
      } else if (name === "get_sales_analytics") {
        toolResult = await getSalesAnalyticsTool();
      } else {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id || null,
          error: { code: -32601, message: `Tool '${name}' not found` },
        }, { status: 400 });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id: id || 1,
        result: {
          content: [{ type: "text", text: JSON.stringify(toolResult, null, 2) }],
        },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32601, message: "Method not found" },
    }, { status: 400 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal MCP error";
    return NextResponse.json({
      jsonrpc: "2.0",
      error: { code: -32603, message: errorMessage },
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    server: "Sai Collection MCP Backend Server",
    protocol: "Model Context Protocol v1.0",
    toolsAvailable: [
      "search_products",
      "ingest_media_link",
      "delete_media",
      "get_order_status",
      "update_inventory",
      "get_sales_analytics",
    ],
  });
}
