import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerMoveTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "move_motion_task",
    {
      taskId: z.string().describe("The ID of the task to move"),
      workspaceId: z
        .string()
        .describe("The ID of the workspace to move the task to"),
      assigneeId: z
        .string()
        .optional()
        .describe(
          "Optional: The user ID to assign the task to in the new workspace",
        ),
    },
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
