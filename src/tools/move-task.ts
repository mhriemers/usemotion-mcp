import type { ToolRegistrar } from "./types.js";
import { moveTaskSchema } from "../schemas.js";

export const registerMoveTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "move_motion_task",
    "Move a task to a different workspace with optional reassignment",
    moveTaskSchema.shape,
    async (params) => {
      const { taskId, ...moveParams } = params;

      try {
        const result = await client.moveTask(taskId, moveParams);
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
