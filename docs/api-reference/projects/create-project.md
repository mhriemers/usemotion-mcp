# Create project

Creates a new project.

## Endpoint

```
POST /v1/projects
```

## Authorization

### X-API-Key

- **Type:** string
- **Required:** Yes
- **Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Request Body

**Content-Type:** application/json

### Body Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | - | The name of the project. |
| `workspaceId` | string | Yes | - | The workspace to which the project belongs. |
| `dueDate` | ISO 8601 date | No | - | ISO 8601 Due date on the project, like 2024-03-12T10:52:55.714-06:00. |
| `description` | string | No | - | The description of the project. HTML input accepted. |
| `labels` | array<string> | No | - | The list of labels by name the project should have. |
| `priority` | string | No | MEDIUM | Options are ASAP, HIGH, MEDIUM, and LOW. |
| `projectDefinitionId` | string | No | - | Optional ID of the project definition (template) to use. If provided, the `stages` array must also be included. |
| `stages` | array<object> | No* | - | Required if `projectDefinitionId` is provided. Array of stage objects defining project stages. |

*Note: `stages` is required when `projectDefinitionId` is provided.

### Stage Object

When using a project definition template, each stage in the `stages` array must have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stageDefinitionId` | string | Yes | ID of the stage definition. |
| `dueDate` | string (ISO 8601) | Yes | Due date for this stage. |
| `variableInstances` | array<object> | No | Optional array to assign values to variables specific to this stage. |

### Variable Instance Object

Each variable instance in the `variableInstances` array must have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `variableName` | string | Yes | Name of the variable definition (e.g., the "role" name being assigned). |
| `value` | string | Yes | The value for the variable (e.g., the user ID if the variable type is "person"). |

## Response

**Status:** 200 - OK  
**Content-Type:** application/json

### Response Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the project. |
| `name` | string | Yes | The name of the project. |
| `description` | string | Yes | The HTML contents of the description. |
| `workspaceId` | string | Yes | The ID of the workspace. |
| `status` | object | Yes | The status of the project. |
| `status.name` | string | No | The name of the status. |
| `status.isDefaultStatus` | boolean | No | Whether this status is a default status for the workspace. |
| `status.isResolvedStatus` | boolean | No | Whether this is a resolved (terminated) status for the workspace. |

## Important Notes

- **Project Definition Templates**: When using `projectDefinitionId`, you must provide the correct number of stages that match the project definition. Providing the wrong number results in a 400 error with the message: "The number of stages in the project does not match the number of stages in the definition. Expected stages: [...]"

- **Variable Names**: If an invalid variable name is provided in `variableInstances`, a 400 error is returned with a message indicating the valid variable names for that stage: "Variable name '[invalid name]' not found for stage definition ID '[stage def ID]'. Valid names are: [[valid names list]]"

## Example Request (Simple Project)

```bash
curl -X POST https://api.usemotion.com/v1/projects \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Product Launch",
    "workspaceId": "ws_789012",
    "description": "<p>Launch new product line for Q1 2024</p>",
    "dueDate": "2024-03-31T23:59:59.000Z",
    "priority": "HIGH",
    "labels": ["product", "launch", "q1"]
  }'
```

## Example Request (With Project Definition)

```bash
curl -X POST https://api.usemotion.com/v1/projects \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign Project",
    "workspaceId": "ws_789012",
    "description": "<p>Complete website redesign using our standard web project template</p>",
    "projectDefinitionId": "projdef_abc123",
    "stages": [
      {
        "stageDefinitionId": "stagedef_001",
        "dueDate": "2024-04-15T17:00:00.000Z",
        "variableInstances": [
          {
            "variableName": "Tech Lead",
            "value": "usr_john123"
          },
          {
            "variableName": "Designer",
            "value": "usr_jane456"
          }
        ]
      },
      {
        "stageDefinitionId": "stagedef_002",
        "dueDate": "2024-05-01T17:00:00.000Z",
        "variableInstances": [
          {
            "variableName": "QA Lead",
            "value": "usr_bob789"
          }
        ]
      }
    ]
  }'
```

## Example Response

```json
{
  "id": "proj_new123",
  "name": "Q1 Product Launch",
  "description": "<p>Launch new product line for Q1 2024</p>",
  "workspaceId": "ws_789012",
  "status": {
    "name": "Not Started",
    "isDefaultStatus": true,
    "isResolvedStatus": false
  }
}
```

## Error Responses

### 400 Bad Request - Wrong Number of Stages

```json
{
  "error": "The number of stages in the project does not match the number of stages in the definition. Expected stages: ['Planning', 'Development', 'Testing', 'Launch']"
}
```

### 400 Bad Request - Invalid Variable Name

```json
{
  "error": "Variable name 'Project Manager' not found for stage definition ID 'stagedef_001'. Valid names are: ['Tech Lead', 'Designer', 'Developer']"
}
```