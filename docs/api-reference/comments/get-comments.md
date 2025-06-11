# Get Comments

Get all comments on a task.

```
GET /v1/comments
```

## Authorization

### X-API-Key
**Type:** string  
**Required:** Yes  
**Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

### taskId
**Type:** string  
**Required:** Yes

The task for which all comments should be returned.

### cursor
**Type:** string  
**Required:** No

Use if a previous request returned a cursor. Will page through results.

## Response

**Status:** 200  
**Content-Type:** application/json

### Response Schema

```json
{
  "meta": {
    "nextCursor": "string",
    "pageSize": "number"
  },
  "comments": [
    {
      "id": "string",
      "taskId": "string",
      "content": "string",
      "createdAt": "datetime",
      "creator": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

### Response Fields

#### meta
**Type:** object  
**Required:** Yes

Contains the nextCursor, if one exists, along with the pageSize.

- **nextCursor** (string): Make the same query with the new cursor to get more results.
- **pageSize** (number): The number of results in this response.

#### comments
**Type:** array  
**Required:** Yes

The list of comments on a given task.

Each comment object contains:
- **id** (string, required): The ID of the comment.
- **taskId** (string, required): The ID of the task.
- **content** (string, required): The HTML content of the comment.
- **createdAt** (datetime, required): When this comment was created.
- **creator** (object, required): The user who created the comment.
  - **id** (string): The user id of the creator.
  - **name** (string): The name of the creator.
  - **email** (string): The email of the creator.