import type { ToolRegistrar } from "./types.js";
import { updateTaskSchema } from "../schemas.js";

export const registerUpdateTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "update_motion_task",
    "Update a task's properties including name, status, assignee, or scheduling",
    updateTaskSchema.shape,
    async (params) => {
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
          isError: true,
        };
      }
    },
  );
};
