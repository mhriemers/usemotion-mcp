import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { updateTaskSchema } from "../schemas.js";

export const registerUpdateTaskTool: ToolRegistrar = (server, client) => {
  const autoScheduledShape = updateTaskSchema.shape.autoScheduled;
  const autoScheduledWithDefaults = 
    autoScheduledShape instanceof z.ZodOptional && autoScheduledShape._def.innerType instanceof z.ZodUnion
      ? z.union([
          z.object({
            startDate: z.string().datetime({ offset: true }).describe("ISO 8601 Date for scheduling start"),
            deadlineType: z.enum(["HARD", "SOFT", "NONE"]).default("SOFT").describe("HARD, SOFT (default), or NONE"),
            schedule: z.string().default("Work Hours").describe("Schedule name (defaults to 'Work Hours')"),
          }),
          z.null(),
        ]).optional().describe("Updated auto-scheduling settings or null to disable")
      : autoScheduledShape;

  server.tool(
    "update_motion_task",
    "Update a task's properties including name, status, assignee, or scheduling",
    {
      ...updateTaskSchema.shape,
      autoScheduled: autoScheduledWithDefaults,
    },
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
