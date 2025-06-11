import type { ToolRegistrar } from "./types.js";
import { listUsersSchema } from "../schemas.js";

export const registerListUsersTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_users",
    "List users in the workspace with optional filtering",
    listUsersSchema.shape,
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
