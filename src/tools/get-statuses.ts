import type { ToolRegistrar } from "./types.js";
import { getStatusesSchema } from "../schemas.js";

export const registerGetStatusesTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_statuses",
    "Get available task statuses for a specific workspace",
    getStatusesSchema.shape,
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
