# Motion MCP Server

A Model Context Protocol (MCP) server for integrating with Motion (usemotion.com) API. This server allows AI assistants to interact with Motion tasks through standardized MCP tools.

## Features

- **Task Management**: List, get, create, update, move, unassign, and delete tasks
- **User Management**: Get user info, list users in workspaces/teams
- **Workspace Management**: List workspaces with detailed configuration
- **Project Management**: List, get, and create projects
- **Schedule Management**: Get schedules with availability information
- Full TypeScript support with the official MCP SDK
- Pagination support for large datasets

## Prerequisites

- Node.js 18 or higher
- Motion account with API access
- Motion API key (create in Motion's Settings tab)

## Installation

```bash
git clone https://github.com/mhriemers/usemotion-mcp.git
cd usemotion-mcp
npm install
npm run build
```

Set up your environment:
```bash
cp .env.example .env
# Edit .env and add your MOTION_API_KEY
```

## Usage

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

### Integration with MCP Clients

Add to your MCP client configuration (e.g., Claude Desktop):

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

## Available Tools

### Task Management
- `list_motion_tasks` - List tasks with filtering options
- `get_motion_task` - Get task details by ID
- `create_motion_task` - Create new tasks
- `update_motion_task` - Update existing tasks
- `move_motion_task` - Move tasks between workspaces
- `unassign_motion_task` - Remove task assignee
- `delete_motion_task` - Delete tasks

### User & Workspace Management
- `get_motion_user` - Get authenticated user info
- `list_motion_users` - List users in workspaces/teams
- `list_motion_workspaces` - List accessible workspaces

### Project Management
- `list_motion_projects` - List projects in workspaces
- `get_motion_project` - Get project details by ID
- `create_motion_project` - Create new projects

### Schedule Management
- `get_motion_schedules` - Get schedules with availability

Each tool accepts specific parameters and returns detailed responses. Use the tools with appropriate parameters based on your needs.

## Development

### Project Structure

```
usemotion-mcp/
├── src/
│   ├── index.ts         # Main server
│   ├── motion-client.ts # API client
│   ├── types.ts         # Type definitions
│   └── tools/           # Tool implementations
├── dist/                # Compiled output
└── package.json
```

### Adding New Tools

1. Add type definitions in `src/types.ts`
2. Add method to `MotionClient` class
3. Create tool file in `src/tools/`
4. Export from `src/tools/index.ts`

## License

Apache License 2.0 - see [LICENSE](LICENSE) file

Copyright 2025 Martijn Riemers

## Contributing

Contributions welcome! Please submit a Pull Request.

## Support

- **This MCP server**: Open an issue in this repository
- **Motion API**: See [Motion documentation](https://docs.usemotion.com/)
- **MCP SDK**: See [MCP documentation](https://modelcontextprotocol.io/)