import { ToolHandler } from "./types.js";
import { MotionClient } from "../motion-client.js";
import { CreateTaskRequest } from "../types.js";

export function createCreateTaskTool(client: MotionClient): ToolHandler {
  return {
    definition: {
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
    handler: async (args: unknown) => {
      const params = args as CreateTaskRequest;
      
      if (!params || !params.name || !params.workspaceId) {
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
        const result = await client.createTask(params);
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