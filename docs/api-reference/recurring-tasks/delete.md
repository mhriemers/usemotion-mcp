# Delete recurring task

Deletes a recurring task based on the ID supplied.

## Endpoint

```
DELETE /v1/recurring-tasks/{id}
```

## Authorization

### X-API-Key
- **Type**: string
- **Required**: Yes
- **Description**: Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

### id
- **Type**: integer
- **Required**: Yes
- **Description**: ID of the recurring task to delete.

## Response

The endpoint returns a successful response when the recurring task is deleted.

## Example

```bash
curl -X DELETE https://api.usemotion.com/v1/recurring-tasks/123 \
  -H "X-API-Key: your-api-key"
```