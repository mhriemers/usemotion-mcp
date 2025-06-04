import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerGetStatusesTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_statuses",
    {
      workspaceId: z.string().describe("The workspace ID to get statuses for"),
    },
    async (params) => {
      try {
        const result = await client.getStatuses(params.workspaceId);
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
