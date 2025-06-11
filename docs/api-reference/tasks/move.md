# Move task

Move a task to a different workspace.

## Endpoint

```
PATCH /v1/tasks/{id}/move
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

The ID of the task.

## Request Body

**Content-Type:** application/json

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `workspaceId` | string | Yes | The id of the workspace to which you want the task moved |
| `assigneeId` | string | No | The user id the task should be assigned to |

## Response

**Status:** 200 - application/json

### Response Schema

The response follows the same schema as the [Get task](./get.md) endpoint, returning the complete updated task object with all its fields.

## Example

```bash
curl -X PATCH "https://api.usemotion.com/v1/tasks/123456/move" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "ws_789",
    "assigneeId": "user_456"
  }'
```

## Notes

- When moving a task to a different workspace, the task will inherit the default status of the target workspace if not specified
- If an assignee is specified, they must be a member of the target workspace
- All other task properties (name, description, due date, etc.) remain unchanged