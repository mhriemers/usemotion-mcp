import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MotionListTasksResponse } from "./types.js";

const MOTION_API_BASE_URL = "https://api.usemotion.com/v1";

interface MotionConfig {
  apiKey: string;
}

class MotionMCPServer {
  private server: Server;
  private config: MotionConfig;

  constructor() {
    this.config = {
      apiKey: process.env.MOTION_API_KEY || "",
    };

    if (!this.config.apiKey) {
      console.error("Error: MOTION_API_KEY environment variable is required");
      process.exit(1);
    }

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

  private async makeMotionRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${MOTION_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-API-Key": this.config.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Motion API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
          const args = request.params.arguments as any;
          
          // Build query parameters
          const queryParams = new URLSearchParams();
          if (args.assigneeId) queryParams.append("assigneeId", args.assigneeId);
          if (args.cursor) queryParams.append("cursor", args.cursor);
          if (args.includeAllStatuses !== undefined) {
            queryParams.append("includeAllStatuses", args.includeAllStatuses.toString());
          }
          if (args.label) queryParams.append("label", args.label);
          if (args.name) queryParams.append("name", args.name);
          if (args.projectId) queryParams.append("projectId", args.projectId);
          if (args.status) queryParams.append("status", args.status);
          if (args.workspaceId) queryParams.append("workspaceId", args.workspaceId);

          const endpoint = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
          
          try {
            const result: MotionListTasksResponse = await this.makeMotionRequest(endpoint);
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