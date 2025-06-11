import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { listTasksSchema } from "../schemas.js";

export const registerListTasksTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_tasks",
    "List tasks with filtering by assignee, project, workspace, status, label, or name",
    {
      ...listTasksSchema.shape,
      includeAllStatuses: listTasksSchema.shape.includeAllStatuses.default(false),
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
          isError: true,
        };
      }
    },
  );
};
