import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerDeleteTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "delete_motion_task",
    "Delete a task by its ID",
    {
      taskId: z.string().describe("The ID of the task to delete"),
    },
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
