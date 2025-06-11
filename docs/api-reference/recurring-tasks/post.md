# Create recurring task

Creates a new recurring task.

## Endpoint

```
POST /v1/recurring-tasks
```

## Authorization

### X-API-Key
- **Type**: string
- **Required**: Yes
- **Description**: Header with the name `X-API-Key` where the value is your API key.

## Request Body

**Content-Type**: application/json

### Required Fields

- **frequency** (Frequency): Frequency in which the task should be scheduled.
- **name** (string): The name of the recurring task.
- **workspaceId** (string): The workspace in which to create the recurring task.
- **assigneeId** (string): To whom the recurring task should be assigned.

### Optional Fields

- **deadlineType** (string): "HARD" or "SOFT" are the two values allowed. Default: "SOFT"
- **duration** (number): An integer greater than 0 or "REMINDER" for a reminder task.
- **startingOn** (string): ISO 8601 Date which is trimmed to the start of the day passed, like 2024-03-12 or 2024-03-12T06:00:00.000Z (default).
- **idealTime** (string): If possible, schedule at the ideal time if free (HH:mm).
- **schedule** (string): Schedule the task must adhere to. Default: "Work Hours" (which is a schedule all users have).
- **description** (string): The description of the task.
- **priority** (string): "HIGH" or "MEDIUM". Default: "MEDIUM"

### Request Body Example

```json
{
  "frequency": "DAILY",
  "name": "Daily standup",
  "workspaceId": "workspace123",
  "assigneeId": "user456",
  "deadlineType": "SOFT",
  "duration": 30,
  "startingOn": "2024-03-12",
  "idealTime": "09:00",
  "schedule": "Work Hours",
  "description": "Daily team standup meeting",
  "priority": "HIGH"
}
```

## Response

**Status**: 200 - application/json

### Response Body

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
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
  },
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
  ]
}
```

### Field Descriptions

- **id** (string, required): The ID of the recurring task.
- **name** (string, required): The name of the recurring task.
- **description** (string, required): The HTML contents of the description.
- **workspace** (object, required): The workspace data.
  - **id** (string, required): The ID of the workspace.
  - **name** (string, required): The name of the workspace.
  - **teamId** (string, required): The ID of the team.
  - **type** (string, required): Whether the workspace is a team or individual type.
  - **labels** (array, required): An array of labels.
  - **statuses** (array, required): An array of statuses for the workspace.
- **creator** (object, required): The user who created the recurring task.
  - **id** (string): The user id of the creator.
  - **name** (string): The name of the creator.
  - **email** (string): The email of the creator.
- **assignee** (object, required): The user assigned to the recurring task.
  - **id** (string): The user id of the assignee.
  - **name** (string): The name of the assignee.
  - **email** (string): The email of the assignee.
- **project** (object): The project data (if associated).
- **status** (object, required): The status of the task.
  - **name** (string): The name of the status.
  - **isDefaultStatus** (boolean): Whether this status is a default status for the workspace.
  - **isResolvedStatus** (boolean): Whether this is a resolved (terminated) status for the workspace.
- **priority** (string, required): Valid options are ASAP, HIGH, MEDIUM, or LOW.
- **labels** (array, required): An array of labels.

## Custom Field Values

The `customFieldValues` property in the project object is a record where each key is the name of the custom field (not the ID). Each object contains a "type" discriminator and a "value" property that varies based on the field type:

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
curl -X POST https://api.usemotion.com/v1/recurring-tasks \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "frequency": "WEEKLY",
    "name": "Weekly Review",
    "workspaceId": "workspace123",
    "assigneeId": "user456",
    "priority": "HIGH",
    "duration": 60,
    "description": "Weekly project review meeting"
  }'
```