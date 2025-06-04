import dotenv from "dotenv";

dotenv.config();

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MotionMCPServer } from "./motion-mcp-server";

const apiKey = process.env.MOTION_API_KEY;
if (!apiKey) {
  console.error("Error: MOTION_API_KEY environment variable is required");
  process.exit(1);
}

const server = new MotionMCPServer(apiKey);
const transport = new StdioServerTransport();
server.run(transport).catch(console.error);
console.error("Motion MCP server running on stdio");
