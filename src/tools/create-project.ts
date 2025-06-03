import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerCreateProjectTool: ToolRegistrar = (server, client) => {
  server.tool(
    "create_motion_project",
    {
      name: z.string().describe("The name of the project"),
      workspaceId: z.string().describe("The workspace ID where the project should be created"),
      dueDate: z.string().optional().describe("ISO 8601 due date for the project"),
      description: z.string().optional().describe("The description of the project (HTML input accepted)"),
      labels: z.array(z.string()).optional().describe("Array of label names for the project"),
      priority: z.enum(["ASAP", "HIGH", "MEDIUM", "LOW"]).optional().describe("Project priority (defaults to MEDIUM)"),
      projectDefinitionId: z.string().optional().describe("Optional ID of the project definition (template) to use"),
      stages: z.array(z.object({
        stageDefinitionId: z.string().describe("ID of the stage definition"),
        dueDate: z.string().describe("Due date for this stage (ISO 8601)"),
        variableInstances: z.array(z.object({
          variableName: z.string().describe("Name of the variable definition"),
          value: z.string().describe("The value for the variable")
        })).optional().describe("Optional array to assign values to variables specific to this stage")
      })).optional().describe("Optional array of stage objects (required if projectDefinitionId is provided)")
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
    }
  );
};