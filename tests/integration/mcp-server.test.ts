import { describe, it, expect } from "vitest";
import { createMcpServer } from "@/lib/mcp/server";

describe("MCP Server Engine & Tool Registry", () => {
  it("should initialize MCP server instance with required capabilities", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
  });
});
