import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { MotionClient } from "./motion-client";
import { registerAllTools } from "./tools";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport";

export class MotionMCPServer {
  private readonly server: McpServer;
  private readonly motionClient: MotionClient;

  constructor(apiKey: string) {
    this.motionClient = new MotionClient({ apiKey });

    this.server = new McpServer({
      name: "motion-mcp",
      version: "1.0.0",
    });

    registerAllTools(this.server, this.motionClient);
  }

  async connect(transport: Transport) {
    await this.server.connect(transport);
  }
}
