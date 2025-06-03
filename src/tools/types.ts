import { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface ToolHandler {
  definition: Tool;
  handler: (args: any) => Promise<{
    content: Array<{
      type: "text";
      text: string;
    }>;
  }>;
}