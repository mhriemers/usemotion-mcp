import type { ToolRegistrar } from "./types.js";
import { listProjectsSchema } from "../schemas.js";

export const registerListProjectsTool: ToolRegistrar = (server, client) => {
  server.tool(
    "list_motion_projects",
    "List all projects with optional workspace filtering",
    listProjectsSchema.shape,
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
    },
  );
};
