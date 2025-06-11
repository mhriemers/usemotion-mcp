# Get statuses

Get a list of statuses for a particular workspace.

## Endpoint

```
GET /v1/statuses
```

## Authorization

### X-API-Key

**Type:** string  
**Required:** Yes  
**In:** Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | No | Get statuses for a particular workspace. |

## Response

### 200 - Success

**Content-Type:** application/json  
**Response Type:** array

#### Response Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | object | Yes | The status of the item. |

#### Status Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | The name of the status. |
| `isDefaultStatus` | boolean | No | Whether this status is a default status for the workspace. |
| `isResolvedStatus` | boolean | No | Whether this is a resolved (terminated) status for the workspace. |

## Example Request

```bash
curl -X GET "https://api.usemotion.com/v1/statuses?workspaceId=workspace123" \
  -H "X-API-Key: your-api-key"
```

## Example Response

```json
[
  {
    "status": {
      "name": "To Do",
      "isDefaultStatus": true,
      "isResolvedStatus": false
    }
  },
  {
    "status": {
      "name": "In Progress",
      "isDefaultStatus": false,
      "isResolvedStatus": false
    }
  },
  {
    "status": {
      "name": "Done",
      "isDefaultStatus": false,
      "isResolvedStatus": true
    }
  }
]
```

## Notes

- If `workspaceId` is not provided, the endpoint returns statuses for the default workspace
- Default statuses are typically created automatically for new workspaces
- Resolved statuses indicate that tasks with these statuses are considered complete
- The response is an array where each element contains a `status` object