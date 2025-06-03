import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MotionClient, ListTasksParams } from "./motion-client.js";

class MotionMCPServer {
  private server: Server;
  private motionClient: MotionClient;

  constructor() {
    const apiKey = process.env.MOTION_API_KEY || "";

    if (!apiKey) {
      console.error("Error: MOTION_API_KEY environment variable is required");
      process.exit(1);
    }

    this.motionClient = new MotionClient({ apiKey })

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
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_motion_tasks",
          description: "List tasks from Motion",
          inputSchema: {
            type: "object",
            properties: {
              assigneeId: {
                type: "string",
                description: "Limit tasks to a specific assignee",
              },
              cursor: {
                type: "string",
                description: "Pagination cursor for next page",
              },
              includeAllStatuses: {
                type: "boolean",
                description: "Include all task statuses",
              },
              label: {
                type: "string",
                description: "Filter tasks by label",
              },
              name: {
                type: "string",
                description: "Case-insensitive task name search",
              },
              projectId: {
                type: "string",
                description: "Limit tasks to a specific project",
              },
              status: {
                type: "string",
                description: "Filter tasks by status",
              },
              workspaceId: {
                type: "string",
                description: "Specify workspace for tasks",
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        if (request.params.name === "list_motion_tasks") {
          const args = request.params.arguments as ListTasksParams;
          
          try {
            const result = await this.motionClient.listTasks(args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: "text",
                  text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
              ],
            };
          }
        }

        throw new Error(`Unknown tool: ${request.params.name}`);
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Motion MCP server running on stdio");
  }
}

const server = new MotionMCPServer();
server.run().catch(console.error);