# List users

Get a list of users for a given workspace or team.

## Endpoint

```
GET /v1/users
```

## Authorization

### X-API-Key

**Type:** string  
**Required:** Yes  
**Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cursor` | string | No | Use if a previous request returned a cursor. Will page through results. |
| `teamId` | string | No | The ID of the team for which all members will be returned. |
| `workspaceId` | string | No | The ID of the workspace for which all members will be returned. |

## Response

**Status:** 200 OK  
**Content-Type:** application/json

### Response Schema

```json
{
  "meta": {
    "nextCursor": "string",
    "pageSize": "number"
  },
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ]
}
```

### Response Fields

#### meta (object, required)
Contains the nextCursor, if one exists, along with the pageSize.

- **nextCursor** (string): Make the same query with the new cursor to get more results.
- **pageSize** (number): The number of results in this response.

#### users (array\<object\>, required)
An array of user objects.

Each user object contains:
- **id** (string, required): The user ID.
- **name** (string): The name of the user.
- **email** (string, required): The email of the user.

## Example Request

```bash
curl -X GET https://api.usemotion.com/v1/users \
  -H "X-API-Key: YOUR_API_KEY" \
  -G \
  -d "workspaceId=WORKSPACE_ID"
```

## Example Response

```json
{
  "meta": {
    "nextCursor": null,
    "pageSize": 2
  },
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    {
      "id": "user_456",
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    }
  ]
}
```