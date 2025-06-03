import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerUpdateTaskTool: ToolRegistrar = (server, client) => {
  server.tool(
    "update_motion_task",
    {
      taskId: z.string().describe("The ID of the task to update"),
      name: z.string().describe("Updated title of the task"),
      workspaceId: z.string().describe("Updated workspace ID for the task"),
      dueDate: z.string().optional().describe("Updated ISO 8601 due date. REQUIRED for scheduled tasks"),
      duration: z.union([z.string(), z.number()]).optional()
        .describe("Updated duration: 'NONE', 'REMINDER', or minutes as a number"),
      status: z.string().optional().describe("Updated task status"),
      autoScheduled: z.union([
        z.object({
          startDate: z.string().describe("ISO 8601 Date for scheduling start"),
          deadlineType: z.string().optional().describe("HARD, SOFT (default), or NONE"),
          schedule: z.string().optional().describe("Schedule name (defaults to 'Work Hours')"),
        }),
        z.null()
      ]).optional().describe("Updated auto-scheduling settings or null to disable"),
      projectId: z.string().optional().describe("Updated project ID for the task"),
      description: z.string().optional().describe("Updated description in GitHub Flavored Markdown"),
      priority: z.string().optional().describe("Updated priority: ASAP, HIGH, MEDIUM, or LOW"),
      labels: z.array(z.string()).optional().describe("Updated list of label names for the task"),
      assigneeId: z.string().optional().describe("Updated assignee user ID"),
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
        };
      }
    }
  );
};