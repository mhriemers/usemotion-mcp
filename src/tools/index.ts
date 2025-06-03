import { MotionClient } from "../motion-client.js";
import { ToolHandler } from "./types.js";
import { createListTasksTool } from "./list-tasks.js";
import { createCreateTaskTool } from "./create-task.js";
import { createUpdateTaskTool } from "./update-task.js";

export function createTools(client: MotionClient): ToolHandler[] {
  return [
    createListTasksTool(client),
    createCreateTaskTool(client),
    createUpdateTaskTool(client),
  ];
}