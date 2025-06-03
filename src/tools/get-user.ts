import type { ToolRegistrar } from "./types.js";

export const registerGetUserTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_user",
    {},
    async () => {
      try {
        const result = await client.getUser();
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