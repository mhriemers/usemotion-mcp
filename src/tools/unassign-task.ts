import type { ToolRegistrar } from "./types.js";
import { unassignTaskSchema } from "../schemas.js";

export const registerUnassignTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "unassign_motion_task",
    "Remove the assignee from a task",
    unassignTaskSchema.shape,
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
