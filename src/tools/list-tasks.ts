import { ToolHandler } from "./types.js";
import { MotionClient, ListTasksParams } from "../motion-client.js";

export function createListTasksTool(client: MotionClient): ToolHandler {
  return {
    definition: {
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
    handler: async (args: unknown) => {
      const params = args as ListTasksParams;
      
      try {
        const result = await client.listTasks(params);
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