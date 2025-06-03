import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerListProjectsTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_projects",
    {
      cursor: z.string().optional().describe("Pagination cursor for next page"),
      workspaceId: z.string().optional().describe("Filter projects by workspace ID"),
    },
    async (params) => {
      try {
        const result = await client.listProjects(params);
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