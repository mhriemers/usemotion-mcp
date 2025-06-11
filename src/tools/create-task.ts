import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { createTaskSchema } from "../schemas.js";

export const registerCreateTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "create_motion_task",
    "Create a new task with name, workspace, assignee, and auto-scheduling options",
    createTaskSchema.shape,
    async (params) => {
      try {
        const result = await client.createTask(params);
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
