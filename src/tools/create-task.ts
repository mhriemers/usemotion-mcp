import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { createTaskSchema } from "../schemas.js";

export const registerCreateTaskTool: ToolRegistrar = (server, client) => {
  const autoScheduledShape = createTaskSchema.shape.autoScheduled;
  const autoScheduledWithDefaults = 
    autoScheduledShape instanceof z.ZodOptional && autoScheduledShape._def.innerType instanceof z.ZodUnion
      ? z.union([
          z.object({
            startDate: z.string().datetime({ offset: true }).describe("ISO 8601 Date which is trimmed to the start of the day passed"),
            deadlineType: z.enum(["HARD", "SOFT", "NONE"]).default("SOFT").describe("HARD, SOFT (default), or NONE"),
            schedule: z.string().default("Work Hours").describe("Schedule the task must adhere to. Defaults to 'Work Hours'"),
          }),
          z.null(),
        ]).optional().describe("Set values to turn auto scheduling on, set value to null to turn off")
      : autoScheduledShape;

  server.tool(
    "create_motion_task",
    "Create a new task with name, workspace, assignee, and auto-scheduling options",
    {
      ...createTaskSchema.shape,
      autoScheduled: autoScheduledWithDefaults,
    },
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
