# Unassign task

Remove the assignee of a task.

## Endpoint

```
DELETE /v1/tasks/{id}/assignee
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

## Response

This endpoint returns no content on successful unassignment.

## Example

```bash
curl -X DELETE "https://api.usemotion.com/v1/tasks/123456/assignee" \
  -H "X-API-Key: your-api-key"
```

## Notes

- This endpoint removes all assignees from the task
- The task remains in the workspace but becomes unassigned
- After unassignment, the task can be reassigned using the [Update task](./patch.md) endpoint