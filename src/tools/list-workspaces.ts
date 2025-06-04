import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerListWorkspacesTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_workspaces",
    {
      cursor: z.string().optional().describe("Pagination cursor for next page"),
      ids: z
        .array(z.string())
        .optional()
        .describe("Expand details of specific workspace IDs"),
    },
    async (params) => {
      try {
        const result = await client.listWorkspaces(params);
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
