# Get project

Get a single project, given an ID.

## Endpoint

```
GET /v1/projects/{id}
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

The ID of the project to return.

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
| `status` | object | No | The status of the project. |
| `status.name` | string | No | The name of the status. |
| `status.isDefaultStatus` | boolean | No | Whether this status is a default status for the workspace. |
| `status.isResolvedStatus` | boolean | No | Whether this is a resolved (terminated) status for the workspace. |
| `createdTime` | datetime | No | The timestamp when the project was created. |
| `updatedTime` | datetime | No | The timestamp when the project was last updated. |
| `customFieldValues` | record<object> | No | Record of custom field values for the entity, where each key is the name of the custom field (not the ID). |

### Custom Field Values

The `customFieldValues` field is a record where each key is the name of a custom field. Each value is an object containing a `type` discriminator and a `value` property that varies based on the field type:

#### Text Field
```json
{
  "type": "text",
  "value": "string | null"
}
```

#### Number Field
```json
{
  "type": "number",
  "value": "number | null"
}
```

#### URL Field
```json
{
  "type": "url",
  "value": "string | null"
}
```

#### Date Field
```json
{
  "type": "date",
  "value": "ISO date string | null"
}
```

#### Select Field
```json
{
  "type": "select",
  "value": "string | null"
}
```

#### Multi-Select Field
```json
{
  "type": "multiSelect",
  "value": ["string"] | null
}
```

#### Person Field
```json
{
  "type": "person",
  "value": {
    "id": "string",
    "name": "string",
    "email": "string"
  } | null
}
```

#### Multi-Person Field
```json
{
  "type": "multiPerson",
  "value": [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ] | null
}
```

#### Email Field
```json
{
  "type": "email",
  "value": "string | null"
}
```

#### Phone Field
```json
{
  "type": "phone",
  "value": "string | null"
}
```

#### Checkbox Field
```json
{
  "type": "checkbox",
  "value": "boolean | null"
}
```

#### Related To Field
```json
{
  "type": "relatedTo",
  "value": "string | null"
}
```

## Example Request

```bash
curl -X GET https://api.usemotion.com/v1/projects/proj_123456 \
  -H "X-API-Key: your-api-key"
```

## Example Response

```json
{
  "id": "proj_123456",
  "name": "Q4 Marketing Campaign",
  "description": "<p>Launch new product marketing campaign for Q4</p>",
  "workspaceId": "ws_789012",
  "status": {
    "name": "In Progress",
    "isDefaultStatus": false,
    "isResolvedStatus": false
  },
  "createdTime": "2024-01-15T10:30:00.000Z",
  "updatedTime": "2024-03-20T14:45:30.000Z",
  "customFieldValues": {
    "Budget": {
      "type": "number",
      "value": 50000
    },
    "Project Lead": {
      "type": "person",
      "value": {
        "id": "usr_abc123",
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    }
  }
}
```