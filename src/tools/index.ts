import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MotionClient } from "../motion-client.js";
import { registerListTasksTool } from "./list-tasks.js";
import { registerGetTaskTool } from "./get-task.js";
import { registerCreateTaskTool } from "./create-task.js";
import { registerUpdateTaskTool } from "./update-task.js";
import { registerMoveTaskTool } from "./move-task.js";
import { registerUnassignTaskTool } from "./unassign-task.js";
import { registerDeleteTaskTool } from "./delete-task.js";
import { registerGetUserTool } from "./get-user.js";
import { registerListUsersTool } from "./list-users.js";
import { registerListWorkspacesTool } from "./list-workspaces.js";
import { registerListProjectsTool } from "./list-projects.js";
import { registerGetProjectTool } from "./get-project.js";
import { registerCreateProjectTool } from "./create-project.js";
import { registerGetSchedulesTool } from "./get-schedules.js";

export function registerAllTools(server: McpServer, client: MotionClient) {
  registerListTasksTool(server, client);
  registerGetTaskTool(server, client);
  registerCreateTaskTool(server, client);
  registerUpdateTaskTool(server, client);
  registerMoveTaskTool(server, client);
  registerUnassignTaskTool(server, client);
  registerDeleteTaskTool(server, client);
  registerGetUserTool(server, client);
  registerListUsersTool(server, client);
  registerListWorkspacesTool(server, client);
  registerListProjectsTool(server, client);
  registerGetProjectTool(server, client);
  registerCreateProjectTool(server, client);
  registerGetSchedulesTool(server, client);
}