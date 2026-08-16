import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { searchProductsTool } from "./tools/catalog.tools";
import { ingestMediaLinkTool, deleteMediaTool } from "./tools/media.tools";
import { getOrderStatusTool } from "./tools/orders.tools";
import { updateInventoryTool } from "./tools/inventory.tools";
import { getSalesAnalyticsTool } from "./tools/analytics.tools";

export function createMcpServer() {
  const server = new Server(
    {
      name: "sai-collection-backend-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register available MCP Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_products",
          description: "Search product catalog by keyword query, category, fabric, or price range.",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search keyword for product name or description" },
              categorySlug: { type: "string", description: "Filter by category slug e.g. banarasi-sarees" },
              fabric: { type: "string", description: "Filter by fabric e.g. Silk, Chiffon, Georgette" },
              minPrice: { type: "number", description: "Minimum price in INR" },
              maxPrice: { type: "number", description: "Maximum price in INR" },
            },
          },
        },
        {
          name: "ingest_media_link",
          description: "Ingest a Google Drive link, Cloudinary URL, or external Web URL into product media.",
          inputSchema: {
            type: "object",
            properties: {
              productId: { type: "string", description: "Product ID to attach media to" },
              url: { type: "string", description: "Google Drive view link or direct web URL" },
              type: { type: "string", enum: ["IMAGE", "VIDEO"], description: "Media type" },
              altText: { type: "string", description: "Alt text for SEO" },
              isPrimary: { type: "boolean", description: "Set as main product thumbnail" },
              autoMirror: { type: "boolean", description: "Auto-mirror file to Cloudinary CDN" },
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
              mediaId: { type: "string", description: "Media asset ID" },
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
              orderNumber: { type: "string", description: "Order number e.g. SAI-2026-8942" },
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
              sku: { type: "string", description: "Variant SKU string" },
              newStock: { type: "number", description: "New stock count" },
            },
            required: ["sku", "newStock"],
          },
        },
        {
          name: "get_sales_analytics",
          description: "Retrieve overall store sales analytics, total revenue, and low stock warnings.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    };
  });

  // Handle MCP Tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === "search_products") {
        const result = await searchProductsTool((args || {}) as Parameters<typeof searchProductsTool>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (name === "ingest_media_link") {
        const result = await ingestMediaLinkTool((args || {}) as Parameters<typeof ingestMediaLinkTool>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (name === "delete_media") {
        const result = await deleteMediaTool((args || {}) as Parameters<typeof deleteMediaTool>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (name === "get_order_status") {
        const result = await getOrderStatusTool((args || {}) as Parameters<typeof getOrderStatusTool>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (name === "update_inventory") {
        const result = await updateInventoryTool((args || {}) as Parameters<typeof updateInventoryTool>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      if (name === "get_sales_analytics") {
        const result = await getSalesAnalyticsTool();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      throw new Error(`Tool '${name}' not found.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "MCP Tool execution error";
      return {
        isError: true,
        content: [{ type: "text", text: msg }],
      };
    }
  });

  return server;
}
