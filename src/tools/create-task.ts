import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerCreateTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "create_motion_task",
    {
      name: z.string().describe("Title of the task"),
      workspaceId: z.string().describe("The workspace ID the task should be associated with"),
      dueDate: z.string().optional().describe("ISO 8601 Due date on the task. REQUIRED for scheduled tasks"),
      duration: z.union([z.string(), z.number()]).optional()
        .describe("Duration can be 'NONE', 'REMINDER', or an integer greater than 0 (representing minutes)"),
      status: z.string().optional().describe("Defaults to workspace default status"),
      autoScheduled: z.union([
        z.object({
          startDate: z.string().describe("ISO 8601 Date which is trimmed to the start of the day passed"),
          deadlineType: z.string().optional().describe("HARD, SOFT (default), or NONE"),
          schedule: z.string().optional().describe("Schedule the task must adhere to. Defaults to 'Work Hours'"),
        }),
        z.null()
      ]).optional().describe("Set values to turn auto scheduling on, set value to null to turn off"),
      projectId: z.string().optional().describe("The project ID the task should be associated with"),
      description: z.string().optional().describe("Github Flavored Markdown for the description"),
      priority: z.string().optional().describe("ASAP, HIGH, MEDIUM, or LOW"),
      labels: z.array(z.string()).optional().describe("The names of the labels to be added to the task"),
      assigneeId: z.string().optional().describe("The user id the task should be assigned to"),
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
    }
  );
};