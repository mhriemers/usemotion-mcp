import { z } from "zod";
import type { ToolRegistrar } from "./types.js";
import { createProjectSchema } from "../schemas.js";

export const registerCreateProjectTool: ToolRegistrar = (server, client) => {
  server.tool(
    "create_motion_project",
    "Create a new project with name, workspace, and optional template",
    {
      ...createProjectSchema.shape,
      priority: createProjectSchema.shape.priority.default("MEDIUM"),
    },
    async (params) => {
      try {
        const result = await client.createProject(params);
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
