# Motion MCP Server

A Model Context Protocol (MCP) server for integrating with Motion (usemotion.com) API. This server allows AI assistants to interact with Motion tasks through standardized MCP tools.

## Features

- List tasks from Motion with various filtering options
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

## Testing

To test the server is working correctly:

```bash
npm test
```

This will start the server and verify it can initialize properly. Make sure your `MOTION_API_KEY` is set before running the test.

## Development

### Project Structure

```
usemotion-mcp/
├── src/
│   ├── index.ts        # Main server implementation
│   └── types.ts        # TypeScript type definitions
├── dist/               # Compiled JavaScript (generated)
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── test-server.js      # Server test script
├── .env.example        # Example environment configuration
└── README.md          # This file
```

### Adding New Tools

To add new Motion API endpoints as MCP tools:

1. Add the tool definition in the `ListToolsRequestSchema` handler
2. Implement the tool logic in the `CallToolRequestSchema` handler
3. Use the `makeMotionRequest` method for API calls

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