import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerListUsersTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_users",
    {
      cursor: z.string().optional().describe("Pagination cursor for next page"),
      teamId: z.string().optional().describe("Filter users by team ID"),
      workspaceId: z
        .string()
        .optional()
        .describe("Filter users by workspace ID"),
    },
    async (params) => {
      try {
        const result = await client.listUsers(params);
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
