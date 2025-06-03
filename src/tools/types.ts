import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MotionClient } from "../motion-client.js";

export type ToolRegistrar = (server: McpServer, client: MotionClient) => void;