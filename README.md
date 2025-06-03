# Motion MCP Server

A Model Context Protocol (MCP) server for integrating with Motion (usemotion.com) API. This server allows AI assistants to interact with Motion tasks through standardized MCP tools.

## Features

- List tasks from Motion with various filtering options
- Get individual task details by ID
- Create new tasks in Motion with full configuration support
- Update existing tasks with partial updates
- Move tasks between workspaces
- Unassign tasks by removing the assignee
- Delete tasks from Motion
- Built with TypeScript and the official MCP SDK
- Supports pagination for large task lists

## Prerequisites

- Node.js 18 or higher
- A Motion account with API access
- Motion API key (create one in Motion's Settings tab)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/mhriemers/usemotion-mcp.git
cd usemotion-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Set up your environment:
```bash
cp .env.example .env
```

5. Edit `.env` and add your Motion API key:
```
MOTION_API_KEY=your_actual_api_key_here
```

## Usage

### Running the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

### Available Tools

#### list_motion_tasks

Lists tasks from your Motion workspace with optional filters.

Parameters:
- `assigneeId` (optional): Filter tasks by assignee ID
- `cursor` (optional): Pagination cursor for fetching next page
- `includeAllStatuses` (optional): Boolean to include all task statuses
- `label` (optional): Filter tasks by label
- `name` (optional): Search tasks by name (case-insensitive)
- `projectId` (optional): Filter tasks by project ID
- `status` (optional): Filter tasks by status
- `workspaceId` (optional): Specify workspace ID for tasks

Example response includes:
- Task details (id, name, description, due date, etc.)
- Assignee information
- Project and workspace details
- Custom fields
- Pagination metadata

#### get_motion_task

Retrieves a single task from Motion by its ID.

Required Parameters:
- `taskId`: The ID of the task to retrieve

Example response includes:
- Complete task details including all properties
- Scheduling information (scheduled start/end times)
- Custom field values
- Project and workspace information
- Assignee details

#### create_motion_task

Creates a new task in Motion.

Required Parameters:
- `name`: Title of the task
- `workspaceId`: The workspace ID where the task should be created

Optional Parameters:
- `dueDate`: ISO 8601 due date (required for scheduled tasks)
- `duration`: Can be 'NONE', 'REMINDER', or minutes as a number
- `status`: Task status (defaults to workspace default)
- `autoScheduled`: Object with scheduling settings or null to disable
  - `startDate`: ISO 8601 date for scheduling start
  - `deadlineType`: 'HARD', 'SOFT' (default), or 'NONE'
  - `schedule`: Schedule name (defaults to 'Work Hours')
- `projectId`: Project ID to associate the task with
- `description`: Task description in GitHub Flavored Markdown
- `priority`: 'ASAP', 'HIGH', 'MEDIUM', or 'LOW'
- `labels`: Array of label names to add to the task
- `assigneeId`: User ID to assign the task to

Example response includes:
- Created task details with generated ID
- Scheduling information if auto-scheduled
- All task properties including status and assignees

#### update_motion_task

Updates an existing task in Motion.

Required Parameters:
- `taskId`: The ID of the task to update

Optional Parameters (all fields are optional for updates):
- `name`: Updated task title
- `workspaceId`: Updated workspace ID
- `dueDate`: Updated ISO 8601 due date
- `duration`: Updated duration ('NONE', 'REMINDER', or minutes)
- `status`: Updated task status
- `autoScheduled`: Updated scheduling settings or null to disable
  - `startDate`: ISO 8601 date for scheduling start
  - `deadlineType`: 'HARD', 'SOFT' (default), or 'NONE'
  - `schedule`: Schedule name (defaults to 'Work Hours')
- `projectId`: Updated project ID
- `description`: Updated description in GitHub Flavored Markdown
- `priority`: Updated priority ('ASAP', 'HIGH', 'MEDIUM', or 'LOW')
- `labels`: Updated array of label names
- `assigneeId`: Updated assignee user ID

Example response includes:
- Updated task with all current properties
- Scheduling information if auto-scheduled
- Custom field values if applicable

#### move_motion_task

Moves a task to a different workspace.

Required Parameters:
- `taskId`: The ID of the task to move
- `workspaceId`: The ID of the workspace to move the task to

Optional Parameters:
- `assigneeId`: User ID to assign the task to in the new workspace

Example response includes:
- Task details with updated workspace information
- New assignee if specified
- All task properties reflecting the move

#### unassign_motion_task

Removes the assignee from a task.

Required Parameters:
- `taskId`: The ID of the task to unassign

Example response:
- Success message confirming the assignee was removed

#### delete_motion_task

Deletes a task from Motion.

Required Parameters:
- `taskId`: The ID of the task to delete

Example response:
- Success message confirming task deletion

### Integration with MCP Clients

To use this server with an MCP client (like Claude Desktop), add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "motion": {
      "command": "node",
      "args": ["/path/to/usemotion-mcp/dist/index.js"],
      "env": {
        "MOTION_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Development

### Project Structure

```
usemotion-mcp/
├── src/
│   ├── index.ts        # Main server implementation with tools
│   ├── motion-client.ts # Motion API client
│   └── types.ts        # TypeScript type definitions
├── dist/               # Compiled JavaScript (generated)
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── .env.example        # Example environment configuration
└── README.md          # This file
```

### Adding New Tools

To add new Motion API endpoints as MCP tools:

1. Add type definitions in `src/types.ts` for the API request/response
2. Add a method to the `MotionClient` class in `src/motion-client.ts`
3. Add the tool in `src/index.ts` using the `server.tool()` method with Zod validation

## API Reference

This server implements tools based on the [Motion API documentation](https://docs.usemotion.com/).

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues with:
- This MCP server: Open an issue in this repository
- Motion API: Contact Motion support or consult their [documentation](https://docs.usemotion.com/)
- MCP SDK: Check the [MCP documentation](https://modelcontextprotocol.io/)