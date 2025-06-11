import type { ToolRegistrar } from "./types.js";
import { listWorkspacesSchema } from "../schemas.js";

export const registerListWorkspacesTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_workspaces",
    "List all available workspaces with pagination support",
    listWorkspacesSchema.shape,
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
