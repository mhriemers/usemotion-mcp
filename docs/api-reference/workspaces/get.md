# List workspaces

Get a list of workspaces a user is a part of.

```
GET /v1/workspaces
```

## Authorization

### X-API-Key

- **Type**: `string`
- **Required**: Yes
- **In**: Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

### cursor

- **Type**: `string`
- **Required**: No

Use if a previous request returned a cursor. Will page through results.

### ids

- **Type**: `array<string>`
- **Required**: No

Expand details of specific workspaces, instead of getting all of them.

## Response

### 200 OK

**Content-Type**: `application/json`

#### Response Body

```json
{
  "meta": {
    "nextCursor": "string",
    "pageSize": number
  },
  "workspaces": [
    {
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
          "isDefaultStatus": boolean,
          "isResolvedStatus": boolean
        }
      ]
    }
  ]
}
```

#### Response Fields

##### meta (required)

Contains the nextCursor, if one exists, along with the pageSize.

- **nextCursor** (`string`): Make the same query with the new cursor to get more results.
- **pageSize** (`number`): The number of results in this response.

##### workspaces (required)

An array of workspace objects.

Each workspace object contains:

- **id** (`string`, required): The ID of the workspace.
- **name** (`string`, required): The name of the workspace.
- **teamId** (`string`, required): The ID of the team.
- **type** (`string`, required): Whether the workspace is a team or individual type.
- **labels** (`array<object>`, required): An array of labels.
  - **name** (`string`): The name of the label.
- **statuses** (`array<object>`, required): An array of statuses for the workspace.
  - **name** (`string`): The name of the status.
  - **isDefaultStatus** (`boolean`): Whether this status is a default status for the workspace.
  - **isResolvedStatus** (`boolean`): Whether this is a resolved (terminated) status for the workspace.

## Example Request

```bash
curl -X GET https://api.usemotion.com/v1/workspaces \
  -H "X-API-Key: YOUR_API_KEY"
```

## Example Response

```json
{
  "meta": {
    "pageSize": 2
  },
  "workspaces": [
    {
      "id": "workspace_123",
      "name": "My Personal Workspace",
      "teamId": "team_123",
      "type": "individual",
      "labels": [
        {
          "name": "urgent"
        },
        {
          "name": "important"
        }
      ],
      "statuses": [
        {
          "name": "To Do",
          "isDefaultStatus": true,
          "isResolvedStatus": false
        },
        {
          "name": "In Progress",
          "isDefaultStatus": false,
          "isResolvedStatus": false
        },
        {
          "name": "Done",
          "isDefaultStatus": false,
          "isResolvedStatus": true
        }
      ]
    },
    {
      "id": "workspace_456",
      "name": "Team Workspace",
      "teamId": "team_456",
      "type": "team",
      "labels": [
        {
          "name": "feature"
        },
        {
          "name": "bug"
        }
      ],
      "statuses": [
        {
          "name": "Backlog",
          "isDefaultStatus": true,
          "isResolvedStatus": false
        },
        {
          "name": "Working",
          "isDefaultStatus": false,
          "isResolvedStatus": false
        },
        {
          "name": "Complete",
          "isDefaultStatus": false,
          "isResolvedStatus": true
        }
      ]
    }
  ]
}
```

## Pagination

To paginate through results when there are more workspaces than the page size:

```bash
# First request
curl -X GET https://api.usemotion.com/v1/workspaces \
  -H "X-API-Key: YOUR_API_KEY"

# Subsequent request with cursor
curl -X GET https://api.usemotion.com/v1/workspaces?cursor=NEXT_CURSOR_VALUE \
  -H "X-API-Key: YOUR_API_KEY"
```

## Filtering by IDs

To get details for specific workspaces:

```bash
curl -X GET "https://api.usemotion.com/v1/workspaces?ids=workspace_123&ids=workspace_456" \
  -H "X-API-Key: YOUR_API_KEY"
```