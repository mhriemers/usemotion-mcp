# Create Comment

Creates a new comment on a task.

```
POST /v1/comments
```

## Authorization

### X-API-Key
**Type:** string  
**Required:** Yes  
**Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Request Body

**Content-Type:** application/json

### Body Parameters

#### taskId
**Type:** string  
**Required:** Yes

The task on which to place a comment.

#### content
**Type:** string  
**Required:** No

Github Flavored Markdown representing the comment.

### Request Example

```json
{
  "taskId": "task_123456",
  "content": "This is a **comment** with _markdown_ formatting."
}
```

## Response

**Status:** 200  
**Content-Type:** application/json

### Response Schema

```json
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
```

### Response Fields

#### id
**Type:** string  
**Required:** Yes

The ID of the comment.

#### taskId
**Type:** string  
**Required:** Yes

The ID of the task.

#### content
**Type:** string  
**Required:** Yes

The HTML contents of the comment.

#### createdAt
**Type:** datetime  
**Required:** Yes

When the comment was created.

#### creator
**Type:** object  
**Required:** Yes

The user who created this comment.

- **id** (string, required): The user ID.
- **name** (string): The name of the user.
- **email** (string, required): The email of the user.