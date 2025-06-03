import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerListTasksTool: ToolRegistrar = (server, client) => {
  server.tool(
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
    }
  );
};