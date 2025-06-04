import { z } from "zod";
import type { ToolRegistrar } from "./types.js";

export const registerGetSchedulesTool: ToolRegistrar = (server, client) => {
  server.tool(
    "get_motion_schedules",
    {},
    async () => {
      try {
        const result = await client.getSchedules();
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