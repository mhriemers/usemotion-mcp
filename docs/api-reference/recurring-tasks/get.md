# List recurring tasks

Get all recurring tasks for a workspace.

## Endpoint

```
GET /v1/recurring-tasks
```

## Authorization

### X-API-Key
- **Type**: string
- **Required**: Yes
- **Description**: Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

### workspaceId
- **Type**: string
- **Required**: Yes
- **Description**: The workspace for which all recurring tasks should be returned.

### cursor
- **Type**: string
- **Required**: No
- **Description**: Use if a previous request returned a cursor. Will page through results.

## Response

**Status**: 200 - application/json

### Response Body

```json
{
  "meta": {
    "nextCursor": "string",
    "pageSize": 0
  },
  "tasks": [
    {
      "id": "string",
      "name": "string",
      "creator": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "assignee": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "project": {
        "id": "string",
        "name": "string",
        "description": "string",
        "workspaceId": "string",
        "status": {
          "name": "string",
          "isDefaultStatus": true,
          "isResolvedStatus": true
        },
        "createdTime": "datetime",
        "updatedTime": "datetime",
        "customFieldValues": {
          "fieldName": {
            "type": "text | number | url | date | select | multiSelect | person | multiPerson | email | phone | checkbox | relatedTo",
            "value": "varies by type"
          }
        }
      },
      "status": {
        "name": "string",
        "isDefaultStatus": true,
        "isResolvedStatus": true
      },
      "priority": "ASAP | HIGH | MEDIUM | LOW",
      "labels": [
        {
          "name": "string"
        }
      ],
      "workspace": {
        "id": "string",
        "name": "string",
        "teamId": "string",
        "type": "string",
        "labels": [
          {
            "name": "string"
          }
        ],
        "statuses": [
          {
            "name": "string",
            "isDefaultStatus": true,
            "isResolvedStatus": true
          }
        ]
      }
    }
  ]
}
```

### Field Descriptions

#### meta
- **nextCursor** (string): Make the same query with the new cursor to get more results.
- **pageSize** (number): The number of results in this response.

#### tasks
Array of recurring tasks for the workspace.

##### Task Object
- **id** (string, required): The ID of the recurring task.
- **name** (string, required): The name of the recurring task.
- **creator** (object, required): The user who created the recurring task.
  - **id** (string): The user id of the creator.
  - **name** (string): The name of the creator.
  - **email** (string): The email of the creator.
- **assignee** (object, required): The user assigned to the recurring task.
  - **id** (string): The user id of the assignee.
  - **name** (string): The name of the assignee.
  - **email** (string): The email of the assignee.
- **project** (object): The project data (if associated).
- **status** (object, required): The status of the recurring task.
  - **name** (string): The name of the status.
  - **isDefaultStatus** (boolean): Whether this status is a default status for the workspace.
  - **isResolvedStatus** (boolean): Whether this is a resolved (terminated) status for the workspace.
- **priority** (string, required): Valid options are ASAP, HIGH, MEDIUM, or LOW.
- **labels** (array, required): An array of labels.
- **workspace** (object, required): The workspace data.

## Custom Field Values

The `customFieldValues` property is a record where each key is the name of the custom field (not the ID). Each object contains a "type" discriminator and a "value" property that varies based on the field type:

- **text**: `{ type: "text", value: string | null }`
- **number**: `{ type: "number", value: number | null }`
- **url**: `{ type: "url", value: string | null }`
- **date**: `{ type: "date", value: string | null }` (ISO date string)
- **select**: `{ type: "select", value: string | null }`
- **multiSelect**: `{ type: "multiSelect", value: string[] | null }`
- **person**: `{ type: "person", value: { id: string, name: string, email: string } | null }`
- **multiPerson**: `{ type: "multiPerson", value: { id: string, name: string, email: string }[] | null }`
- **email**: `{ type: "email", value: string | null }`
- **phone**: `{ type: "phone", value: string | null }`
- **checkbox**: `{ type: "checkbox", value: boolean | null }`
- **relatedTo**: `{ type: "relatedTo", value: string | null }` (Related task ID)

## Example

```bash
curl -X GET "https://api.usemotion.com/v1/recurring-tasks?workspaceId=workspace123" \
  -H "X-API-Key: your-api-key"
```