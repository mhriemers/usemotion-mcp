import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { MotionClient } from "./motion-client.js";

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
    // List tasks tool
    this.server.tool(
      "list_motion_tasks",
      {
        assigneeId: z.string().optional().describe("Limit tasks to a specific assignee"),
        cursor: z.string().optional().describe("Pagination cursor for next page"),
        includeAllStatuses: z.boolean().optional().describe("Include all task statuses"),
        label: z.string().optional().describe("Filter tasks by label"),
        name: z.string().optional().describe("Case-insensitive task name search"),
        projectId: z.string().optional().describe("Limit tasks to a specific project"),
        status: z.string().optional().describe("Filter tasks by status"),
        workspaceId: z.string().optional().describe("Specify workspace for tasks"),
      },
      async (params) => {
        try {
          const result = await this.motionClient.listTasks(params);
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
    );

    // Create task tool
    this.server.tool(
      "create_motion_task",
      {
        name: z.string().describe("Title of the task"),
        workspaceId: z.string().describe("The workspace ID the task should be associated with"),
        dueDate: z.string().optional().describe("ISO 8601 Due date on the task. REQUIRED for scheduled tasks"),
        duration: z.union([z.string(), z.number()]).optional()
          .describe("Duration can be 'NONE', 'REMINDER', or an integer greater than 0 (representing minutes)"),
        status: z.string().optional().describe("Defaults to workspace default status"),
        autoScheduled: z.union([
          z.object({
            startDate: z.string().describe("ISO 8601 Date which is trimmed to the start of the day passed"),
            deadlineType: z.string().optional().describe("HARD, SOFT (default), or NONE"),
            schedule: z.string().optional().describe("Schedule the task must adhere to. Defaults to 'Work Hours'"),
          }),
          z.null()
        ]).optional().describe("Set values to turn auto scheduling on, set value to null to turn off"),
        projectId: z.string().optional().describe("The project ID the task should be associated with"),
        description: z.string().optional().describe("Github Flavored Markdown for the description"),
        priority: z.string().optional().describe("ASAP, HIGH, MEDIUM, or LOW"),
        labels: z.array(z.string()).optional().describe("The names of the labels to be added to the task"),
        assigneeId: z.string().optional().describe("The user id the task should be assigned to"),
      },
      async (params) => {
        try {
          const result = await this.motionClient.createTask(params);
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
    );

    // Update task tool
    this.server.tool(
      "update_motion_task",
      {
        taskId: z.string().describe("The ID of the task to update"),
        name: z.string().optional().describe("Updated title of the task"),
        workspaceId: z.string().optional().describe("Updated workspace ID for the task"),
        dueDate: z.string().optional().describe("Updated ISO 8601 due date. REQUIRED for scheduled tasks"),
        duration: z.union([z.string(), z.number()]).optional()
          .describe("Updated duration: 'NONE', 'REMINDER', or minutes as a number"),
        status: z.string().optional().describe("Updated task status"),
        autoScheduled: z.union([
          z.object({
            startDate: z.string().describe("ISO 8601 Date for scheduling start"),
            deadlineType: z.string().optional().describe("HARD, SOFT (default), or NONE"),
            schedule: z.string().optional().describe("Schedule name (defaults to 'Work Hours')"),
          }),
          z.null()
        ]).optional().describe("Updated auto-scheduling settings or null to disable"),
        projectId: z.string().optional().describe("Updated project ID for the task"),
        description: z.string().optional().describe("Updated description in GitHub Flavored Markdown"),
        priority: z.string().optional().describe("Updated priority: ASAP, HIGH, MEDIUM, or LOW"),
        labels: z.array(z.string()).optional().describe("Updated list of label names for the task"),
        assigneeId: z.string().optional().describe("Updated assignee user ID"),
      },
      async (params) => {
        const { taskId, ...updateParams } = params;
        
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