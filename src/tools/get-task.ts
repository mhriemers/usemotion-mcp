import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerGetTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_task",
    "Get a specific task by its ID",
    {
      taskId: z.string().min(1).describe("The ID of the task to retrieve"),
    },
    async (params) => {
      try {
        const result = await client.getTask(params.taskId);
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
