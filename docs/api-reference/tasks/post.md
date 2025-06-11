# Create task

Create a task.

## Endpoint

```
POST /v1/tasks
```

## Authorization

### X-API-Key

- **Type:** string
- **Required:** Yes
- **Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Request Body

**Content-Type:** application/json

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Title of the task |
| `workspaceId` | string | Yes | The workspace ID the task should be associated with |
| `dueDate` | datetime | No | ISO 8601 Due date on the task. REQUIRED for scheduled tasks |
| `duration` | string \| number | No | A duration can be one of the following... "NONE", "REMINDER", or an integer greater than 0 (representing minutes) |
| `status` | string | No | Defaults to workspace default status |
| `autoScheduled` | object \| null | No | Set values to turn auto scheduling on, set value to null if you want to turn auto scheduling off. The status for the task must have auto scheduling enabled |
| `projectId` | string | No | The project ID the task should be associated with |
| `description` | string | No | Github Flavored Markdown for the input |
| `priority` | string | No | ASAP, HIGH, MEDIUM, and LOW are valid values |
| `labels` | array<string> | No | The names of the labels to be added to the task |
| `assigneeId` | string | No | The user id the task should be assigned to |

### AutoScheduled Object

When enabling auto-scheduling, provide an object with these fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `startDate` | datetime | - | ISO 8601 Date which is trimmed to the start of the day passed |
| `deadlineType` | string | SOFT | HARD, SOFT, or NONE are valid options |
| `schedule` | string | Work Hours | Schedule the task must adhere to. Schedule MUST be 'Work Hours' if scheduling the task for another user |

## Response

**Status:** 200 - application/json

### Response Schema

The response follows the same schema as the [Get task](./get.md) endpoint, returning the complete created task object with all its fields.

## Example

```bash
# Create a basic task
curl -X POST "https://api.usemotion.com/v1/tasks" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Task",
    "workspaceId": "ws_123",
    "description": "This is a new task created via API",
    "priority": "MEDIUM"
  }'

# Create a scheduled task
curl -X POST "https://api.usemotion.com/v1/tasks" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Scheduled Task",
    "workspaceId": "ws_123",
    "dueDate": "2024-12-31T17:00:00Z",
    "duration": 120,
    "priority": "HIGH",
    "assigneeId": "user_456"
  }'

# Create an auto-scheduled task
curl -X POST "https://api.usemotion.com/v1/tasks" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Auto-Scheduled Task",
    "workspaceId": "ws_123",
    "dueDate": "2024-12-31T17:00:00Z",
    "duration": 90,
    "autoScheduled": {
      "startDate": "2024-12-15T00:00:00Z",
      "deadlineType": "SOFT",
      "schedule": "Work Hours"
    },
    "projectId": "proj_789",
    "labels": ["important", "api-created"]
  }'
```

## Notes

- If no status is provided, the task will be created with the workspace's default status
- For scheduled tasks (tasks with a specific time), a `dueDate` is required
- When creating auto-scheduled tasks, ensure the status supports auto-scheduling
- Labels must already exist in the workspace before they can be applied to tasks
- The assignee must be a member of the specified workspace