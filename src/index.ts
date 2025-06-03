import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MotionClient } from "./motion-client.js";
import { registerAllTools } from "./tools/index.js";

class MotionMCPServer {
  private server: McpServer;
  private motionClient: MotionClient;

  constructor() {
    const apiKey = process.env.MOTION_API_KEY || "";

    if (!apiKey) {
      console.error("Error: MOTION_API_KEY environment variable is required");
      process.exit(1);
    }

    this.motionClient = new MotionClient({ apiKey });
    
    this.server = new McpServer({
      name: "motion-mcp",
      version: "1.0.0",
    });

    this.setupTools();
  }

  private setupTools() {
    registerAllTools(this.server, this.motionClient);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Motion MCP server running on stdio");
  }
}

const server = new MotionMCPServer();
server.run().catch(console.error);