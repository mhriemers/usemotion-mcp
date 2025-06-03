import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MotionClient } from "./motion-client.js";
import { createTools } from "./tools/index.js";
import { ToolHandler } from "./tools/types.js";

class MotionMCPServer {
  private server: Server;
  private motionClient: MotionClient;
  private tools: ToolHandler[];

  constructor() {
    const apiKey = process.env.MOTION_API_KEY || "";

    if (!apiKey) {
      console.error("Error: MOTION_API_KEY environment variable is required");
      process.exit(1);
    }

    this.motionClient = new MotionClient({ apiKey });
    this.tools = createTools(this.motionClient);

    this.server = new Server(
      {
        name: "motion-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // Register all tool definitions
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools.map(tool => tool.definition),
    }));

    // Register tool handlers
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.find(t => t.definition.name === request.params.name);
      
      if (!tool) {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }
      
      return tool.handler(request.params.arguments);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Motion MCP server running on stdio");
  }
}

const server = new MotionMCPServer();
server.run().catch(console.error);