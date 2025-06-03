import { ToolHandler } from "./types.js";
import { MotionClient } from "../motion-client.js";
import { UpdateTaskRequest } from "../types.js";

export function createUpdateTaskTool(client: MotionClient): ToolHandler {
  return {
    definition: {
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
    handler: async (args: unknown) => {
      const params = args as UpdateTaskRequest & { taskId: string };
      
      if (!params || !params.taskId) {
        return {
          content: [
            {
              type: "text",
              text: "Error: 'taskId' is a required field for updating a task",
            },
          ],
        };
      }
      
      const { taskId, ...updateParams } = params;
      
      try {
        const result = await client.updateTask(taskId, updateParams);
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
    },
  };
}