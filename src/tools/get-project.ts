import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerGetProjectTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_project",
    {
      projectId: z.string().describe("The ID of the project to retrieve"),
    },
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
        };
      }
    }
  );
};