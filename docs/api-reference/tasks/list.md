# List tasks

Get all tasks for a given query.

## Endpoint

```
GET /v1/tasks
```

## Authorization

### X-API-Key

- **Type:** string
- **Required:** Yes
- **Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `assigneeId` | string | Limit tasks returned to a specific assignee |
| `cursor` | string | Use if a previous request returned a cursor. Will page through results |
| `includeAllStatuses` | boolean | Limit tasks returned by statuses that exist on tasks, cannot specify this AND status in the same request |
| `label` | string | Limit tasks returned by label on the task |
| `name` | string | Limit tasks returned to those that contain this string. Case in-sensitive |
| `projectId` | string | Limit tasks returned to a given project |
| `status` | array<string> | Limit tasks returned by statuses that exist on tasks, cannot specify this AND includeAllStatuses in the same request |
| `workspaceId` | string | The id of the workspace you want tasks from. If not provided, will return tasks from all workspaces the user is a member of |

## Response

**Status:** 200 - application/json

### Response Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meta` | object | Yes | Contains the nextCursor, if one exists, along with the pageSize |
| `tasks` | array | Yes | The tasks returned |

### Meta Object

| Field | Type | Description |
|-------|------|-------------|
| `nextCursor` | string | Make the same query with the new cursor to get more results |
| `pageSize` | number | The number of results in this response |

### Task Object

Each task in the array contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the task |
| `name` | string | Yes | The name of the task |
| `description` | string | Yes | The HTML contents of the description |
| `duration` | string \| number | No | An integer greater than 0 (representing minutes), "NONE", or "REMINDER" |
| `dueDate` | datetime | No | When the task is due |
| `deadlineType` | string | Yes | Values are HARD, SOFT (default) or NONE |
| `parentRecurringTaskId` | string | Yes | If this is an instance of a recurring task, this field will be the parent recurring task id |
| `completed` | boolean | Yes | Whether the task is completed or not |
| `completedTime` | datetime | No | The timestamp when the task was completed |
| `updatedTime` | datetime | No | The timestamp when the task was last updated |
| `startOn` | string | No | Date indicating when a task should start, in YYYY-MM-DD format |
| `creator` | object | Yes | The user who created the task |
| `project` | object | No | The project data |
| `workspace` | object | Yes | The workspace data |
| `status` | object | Yes | The status of the task |
| `priority` | string | Yes | Valid options are ASAP, HIGH, MEDIUM, or LOW |
| `labels` | array | Yes | An array of labels |
| `assignees` | array | Yes | An array of assignees |
| `scheduledStart` | datetime | No | The time that motion has scheduled this task to start |
| `createdTime` | datetime | Yes | The time that the task was created |
| `scheduledEnd` | datetime | No | The time that motion has scheduled this task to end |
| `schedulingIssue` | boolean | Yes | Returns true if Motion was unable to schedule this task. Check Motion directly to address |
| `lastInteractedTime` | datetime | No | The timestamp when the task was last interacted with |
| `customFieldValues` | record | No | Record of custom field values for the entity |
| `chunks` | array | No | Array of scheduling chunks for the task |

### Nested Objects

The nested objects (creator, project, workspace, status, labels, assignees, chunks, and customFieldValues) follow the same structure as described in the [Get task](./get.md) endpoint.

## Example

```bash
# Get all tasks
curl "https://api.usemotion.com/v1/tasks" \
  -H "X-API-Key: your-api-key"

# Get tasks with filters
curl "https://api.usemotion.com/v1/tasks?workspaceId=ws_123&status=To%20Do&assigneeId=user_456" \
  -H "X-API-Key: your-api-key"

# Paginate through results
curl "https://api.usemotion.com/v1/tasks?cursor=next_page_cursor" \
  -H "X-API-Key: your-api-key"
```

## Pagination

When the response contains more results than can be returned in a single request, the `meta.nextCursor` field will contain a cursor value. Use this cursor in subsequent requests to retrieve the next page of results.