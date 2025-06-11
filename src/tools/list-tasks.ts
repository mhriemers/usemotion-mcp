import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { listTasksToolSchema } from "../schemas.js";

export const registerListTasksTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_tasks",
    "List tasks with filtering by assignee, project, workspace, status, label, or name",
    listTasksToolSchema.shape,
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
