import type { ToolRegistrar } from "./types.js";
import { getProjectSchema } from "../schemas.js";

export const registerGetProjectTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_project",
    "Get a specific project by its ID",
    getProjectSchema.shape,
    async (params) => {
      try {
        const result = await client.getProject(params.projectId);
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
