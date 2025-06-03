import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MotionClient, ListTasksParams } from "./motion-client.js";
import { CreateTaskRequest, UpdateTaskRequest } from "./types.js";

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
        {
          name: "create_motion_task",
          description: "Create a new task in Motion",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Title of the task (required)",
              },
              workspaceId: {
                type: "string",
                description: "The workspace ID the task should be associated with (required)",
              },
              dueDate: {
                type: "string",
                description: "ISO 8601 Due date on the task. REQUIRED for scheduled tasks",
              },
              duration: {
                type: ["string", "number"],
                description: "Duration can be 'NONE', 'REMINDER', or an integer greater than 0 (representing minutes)",
              },
              status: {
                type: "string",
                description: "Defaults to workspace default status",
              },
              autoScheduled: {
                type: ["object", "null"],
                description: "Set values to turn auto scheduling on, set value to null to turn off",
                properties: {
                  startDate: {
                    type: "string",
                    description: "ISO 8601 Date which is trimmed to the start of the day passed",
                  },
                  deadlineType: {
                    type: "string",
                    description: "HARD, SOFT (default), or NONE",
                  },
                  schedule: {
                    type: "string",
                    description: "Schedule the task must adhere to. Defaults to 'Work Hours'",
                  },
                },
              },
              projectId: {
                type: "string",
                description: "The project ID the task should be associated with",
              },
              description: {
                type: "string",
                description: "Github Flavored Markdown for the description",
              },
              priority: {
                type: "string",
                description: "ASAP, HIGH, MEDIUM, or LOW",
              },
              labels: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "The names of the labels to be added to the task",
              },
              assigneeId: {
                type: "string",
                description: "The user id the task should be assigned to",
              },
            },
            required: ["name", "workspaceId"],
          },
        },
        {
          name: "update_motion_task",
          description: "Update an existing task in Motion",
          inputSchema: {
            type: "object",
            properties: {
              taskId: {
                type: "string",
                description: "The ID of the task to update (required)",
              },
              name: {
                type: "string",
                description: "Updated title of the task",
              },
              workspaceId: {
                type: "string",
                description: "Updated workspace ID for the task",
              },
              dueDate: {
                type: "string",
                description: "Updated ISO 8601 due date. REQUIRED for scheduled tasks",
              },
              duration: {
                type: ["string", "number"],
                description: "Updated duration: 'NONE', 'REMINDER', or minutes as a number",
              },
              status: {
                type: "string",
                description: "Updated task status",
              },
              autoScheduled: {
                type: ["object", "null"],
                description: "Updated auto-scheduling settings or null to disable",
                properties: {
                  startDate: {
                    type: "string",
                    description: "ISO 8601 Date for scheduling start",
                  },
                  deadlineType: {
                    type: "string",
                    description: "HARD, SOFT (default), or NONE",
                  },
                  schedule: {
                    type: "string",
                    description: "Schedule name (defaults to 'Work Hours')",
                  },
                },
              },
              projectId: {
                type: "string",
                description: "Updated project ID for the task",
              },
              description: {
                type: "string",
                description: "Updated description in GitHub Flavored Markdown",
              },
              priority: {
                type: "string",
                description: "Updated priority: ASAP, HIGH, MEDIUM, or LOW",
              },
              labels: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Updated list of label names for the task",
              },
              assigneeId: {
                type: "string",
                description: "Updated assignee user ID",
              },
            },
            required: ["taskId"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        if (request.params.name === "list_motion_tasks") {
          const args = request.params.arguments as unknown as ListTasksParams;
          
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

        if (request.params.name === "create_motion_task") {
          const args = request.params.arguments as unknown as CreateTaskRequest;
          
          if (!args || !args.name || !args.workspaceId) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: 'name' and 'workspaceId' are required fields for creating a task",
                },
              ],
            };
          }
          
          try {
            const result = await this.motionClient.createTask(args);
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

        if (request.params.name === "update_motion_task") {
          const args = request.params.arguments as unknown as (UpdateTaskRequest & { taskId: string });
          
          if (!args || !args.taskId) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: 'taskId' is a required field for updating a task",
                },
              ],
            };
          }
          
          const { taskId, ...updateParams } = args;
          
          try {
            const result = await this.motionClient.updateTask(taskId, updateParams);
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