# Get task

Get a task.

## Endpoint

```
GET /v1/tasks/{id}
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

The id of the task to fetch.

## Response

**Status:** 200 - application/json

### Response Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the task |
| `name` | string | Yes | The name of the task |
| `description` | string | Yes | The HTML contents of the description |
| `duration` | string \| number | No | An integer greater than 0 (representing minutes), "NONE", or "REMINDER" |
| `dueDate` | datetime | No | When the task is due |
| `deadlineType` | string | Yes | Values are HARD, SOFT (default) or NONE |
| `parentRecurringTaskId` | string | Yes | If this is an instance of a recurring task, this field will be the parent recurring task id |
| `completed` | boolean | Yes | Whether the task is completed or not |
| `completedTime` | datetime | No | The timestamp when the task was completed |
| `updatedTime` | datetime | No | The timestamp when the task was last updated |
| `startOn` | string | No | Date indicating when a task should start, in YYYY-MM-DD format |
| `creator` | object | Yes | The user who created the task |
| `project` | object | No | The project data |
| `workspace` | object | Yes | The workspace data |
| `status` | object | Yes | The status of the task |
| `priority` | string | Yes | Valid options are ASAP, HIGH, MEDIUM, or LOW |
| `labels` | array | Yes | An array of labels |
| `assignees` | array | Yes | An array of assignees |
| `scheduledStart` | datetime | No | The time that motion has scheduled this task to start |
| `createdTime` | datetime | Yes | The time that the task was created |
| `scheduledEnd` | datetime | No | The time that motion has scheduled this task to end |
| `schedulingIssue` | boolean | Yes | Returns true if Motion was unable to schedule this task. Check Motion directly to address |
| `lastInteractedTime` | datetime | No | The timestamp when the task was last interacted with |
| `customFieldValues` | record | No | Record of custom field values for the entity |
| `chunks` | array | No | Array of scheduling chunks for the task |

### Nested Objects

#### Creator Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The user id of the creator |
| `name` | string | The name of the creator |
| `email` | string | The email of the creator |

#### Project Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the project |
| `name` | string | Yes | The name of the project |
| `description` | string | Yes | The HTML contents of the description |
| `workspaceId` | string | Yes | The ID of the workspace |
| `status` | object | No | The status of the project |
| `createdTime` | datetime | No | The timestamp when the project was created |
| `updatedTime` | datetime | No | The timestamp when the project was last updated |
| `customFieldValues` | record | No | Record of custom field values for the entity |

#### Workspace Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the workspace |
| `name` | string | Yes | The name of the workspace |
| `teamId` | string | Yes | The ID of the team |
| `type` | string | Yes | Whether the workspace is a team or individual type |
| `labels` | array | Yes | An array of labels |
| `statuses` | array | Yes | An array of statuses for the workspace |

#### Status Object

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | The name of the status |
| `isDefaultStatus` | boolean | Whether this status is a default status for the workspace |
| `isResolvedStatus` | boolean | Whether this is a resolved (terminated) status for the workspace |

#### Label Object

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | The name of the label |

#### Assignee Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The user ID |
| `name` | string | No | The name of the user |
| `email` | string | Yes | The email of the user |

#### Chunk Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The ID of the chunk |
| `duration` | number | The duration of the chunk in minutes |
| `scheduledStart` | datetime | The scheduled start time of the chunk |
| `scheduledEnd` | datetime | The scheduled end time of the chunk |
| `completedTime` | datetime | The time when the chunk was completed |
| `isFixed` | boolean | Whether the chunk is fixed or not |

#### Custom Field Values

Custom field values are returned as a record where each key is the name of the custom field (not the ID). Each object contains a "type" discriminator and a "value" property that varies based on the field type:

- **text**: `{ type: "text", value: string | null }`
- **number**: `{ type: "number", value: number | null }`
- **url**: `{ type: "url", value: string | null }`
- **date**: `{ type: "date", value: string | null }` (ISO date string)
- **select**: `{ type: "select", value: string | null }`
- **multiSelect**: `{ type: "multiSelect", value: string[] | null }`
- **person**: `{ type: "person", value: { id: string, name: string, email: string } | null }`
- **multiPerson**: `{ type: "multiPerson", value: Array<{ id: string, name: string, email: string }> | null }`
- **email**: `{ type: "email", value: string | null }`
- **phone**: `{ type: "phone", value: string | null }`
- **checkbox**: `{ type: "checkbox", value: boolean | null }`
- **relatedTo**: `{ type: "relatedTo", value: string | null }` (Related task ID)

## Example

```bash
curl "https://api.usemotion.com/v1/tasks/123456" \
  -H "X-API-Key: your-api-key"
```