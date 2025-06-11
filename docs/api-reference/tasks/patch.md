# Update task

Update a task.

## Endpoint

```
PATCH /v1/tasks/{id}
```

## Authorization

### X-API-Key

- **Type:** string
- **Required:** Yes
- **Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

### id

- **Type:** string
- **Required:** Yes

The id of the task to update.

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

The response follows the same schema as the [Get task](./get.md) endpoint, returning the complete updated task object with all its fields.

## Example

```bash
# Basic update
curl -X PATCH "https://api.usemotion.com/v1/tasks/123456" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Task Name",
    "workspaceId": "ws_123",
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59Z"
  }'

# Update with auto-scheduling
curl -X PATCH "https://api.usemotion.com/v1/tasks/123456" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Auto-scheduled Task",
    "workspaceId": "ws_123",
    "dueDate": "2024-12-31T23:59:59Z",
    "duration": 60,
    "autoScheduled": {
      "startDate": "2024-12-01T00:00:00Z",
      "deadlineType": "HARD",
      "schedule": "Work Hours"
    }
  }'

# Disable auto-scheduling
curl -X PATCH "https://api.usemotion.com/v1/tasks/123456" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manual Task",
    "workspaceId": "ws_123",
    "autoScheduled": null
  }'
```

## Notes

- Only the fields provided in the request body will be updated; all other fields remain unchanged
- To enable auto-scheduling, the task's status must support auto-scheduling
- When assigning to another user, the schedule must be set to "Work Hours"
- Setting `autoScheduled` to `null` disables auto-scheduling for the task