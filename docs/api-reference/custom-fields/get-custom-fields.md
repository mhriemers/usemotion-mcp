# Get Custom Fields

Get all custom fields for a given workspace.

## Endpoint

```
GET /beta/workspaces/{workspaceId}/custom-fields
```

## Authorization

**Header:** `X-API-Key`  
**Type:** string  
**Required:** Yes

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | Yes | The workspace for which all custom fields should be retrieved. |

## Request Body

No request body required.

## Response

**Status Code:** 200  
**Content-Type:** `application/json`

### Response Body

Returns an array of custom field objects:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The ID of the custom field. |
| `field` | string | The type of custom field. Valid options: `"text"`, `"url"`, `"date"`, `"person"`, `"multiPerson"`, `"phone"`, `"select"`, `"multiSelect"`, `"number"`, `"email"`, `"checkbox"`, `"relatedTo"` |

## Example Request

```
GET /beta/workspaces/ws_123456/custom-fields
X-API-Key: your-api-key-here
```

## Example Response

```json
[
  {
    "id": "cf_123456",
    "field": "text"
  },
  {
    "id": "cf_789012",
    "field": "number"
  },
  {
    "id": "cf_345678",
    "field": "select"
  }
]
```