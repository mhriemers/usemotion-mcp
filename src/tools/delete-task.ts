import type { ToolRegistrar } from "./types.js";
import { deleteTaskSchema } from "../schemas.js";

export const registerDeleteTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "delete_motion_task",
    "Delete a task by its ID",
    deleteTaskSchema.shape,
    async (params) => {
      try {
        await client.deleteTask(params.taskId);
        return {
          content: [
            {
              type: "text",
              text: `Task ${params.taskId} deleted successfully`,
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
