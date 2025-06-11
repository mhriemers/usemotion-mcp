# Delete task

Deletes a task based on the ID supplied.

## Endpoint

```
DELETE /v1/tasks/{id}
```

## Authorization

### X-API-Key

- **Type:** string
- **Required:** Yes
- **Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

### id

- **Type:** integer
- **Required:** Yes

ID of the task to delete.

## Response

This endpoint returns no content on successful deletion.

## Example

```bash
curl -X DELETE "https://api.usemotion.com/v1/tasks/123456" \
  -H "X-API-Key: your-api-key"
```