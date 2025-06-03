# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build the TypeScript project:**
```bash
npm run build
```

**Run in development mode (with hot reload):**
```bash
npm run dev
```


**Run the production server:**
```bash
npm start
```

## Architecture Overview

This is a Model Context Protocol (MCP) server that integrates with Motion's API (usemotion.com). The server architecture:

1. **MCP Server Pattern**: The server (`src/index.ts`) uses the latest MCP SDK pattern with `McpServer` class. It communicates over stdio transport.

2. **Motion API Client**: The `MotionClient` class (`src/motion-client.ts`) handles all Motion API interactions:
   - Centralizes API request logic with the `makeRequest` method
   - Adds the required `X-API-Key` header from the `MOTION_API_KEY` environment variable
   - Prepends the base URL `https://api.usemotion.com/v1` to endpoints
   - Handles error responses uniformly
   - Provides typed methods for each API endpoint (e.g., `listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`)

3. **Tool Implementation Pattern**: Tools are registered directly with the server using the `server.tool()` method:
   - Each tool uses Zod schemas for input validation
   - Parameter descriptions are included with `.describe()` for better documentation
   - Tools return a standardized response format with `content` array
   - All validation is handled automatically by the MCP SDK

## Adding New Motion API Tools

When implementing new Motion API endpoints:

1. Check the Motion API docs at https://docs.usemotion.com/api-reference/
2. Add type definitions in `src/types.ts` for the API request/response
3. Add a new method to `MotionClient` class in `src/motion-client.ts`
4. Add a new tool in the `setupTools()` method using `server.tool()`:
   ```typescript
   this.server.tool(
     "tool_name",
     {
       param1: z.string().describe("Parameter description"),
       param2: z.number().optional().describe("Optional parameter")
     },
     async (params) => {
       // Implementation
     }
   );
   ```

## Environment Requirements

- **MOTION_API_KEY**: Required environment variable containing the Motion API key
- The server will exit with an error if this is not set

## Motion API Notes

- API key is created in Motion's Settings tab
- All API endpoints are prefixed with `/v1`
- The API uses standard HTTP status codes and returns JSON responses
- Pagination is handled via `cursor` and `nextCursor` in responses