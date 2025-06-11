import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerUnassignTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "unassign_motion_task",
    "Remove the assignee from a task",
    {
      taskId: z.string().min(1).describe("The ID of the task to unassign"),
    },
    async (params) => {
      try {
        await client.unassignTask(params.taskId);
        return {
          content: [
            {
              type: "text",
              text: `Task ${params.taskId} unassigned successfully`,
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
