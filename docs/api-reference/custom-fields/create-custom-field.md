# Create Custom Field

Create a new custom field in a workspace.

## Endpoint

```
POST /beta/workspaces/{workspaceId}/custom-fields
```

## Authorization

**Header:** `X-API-Key`  
**Type:** string  
**Required:** Yes

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | Yes | The workspace in which a custom field should be created. |

## Request Body

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | The type of custom field. Valid options: `"text"`, `"url"`, `"date"`, `"person"`, `"multiPerson"`, `"phone"`, `"select"`, `"multiSelect"`, `"number"`, `"email"`, `"checkbox"`, `"relatedTo"` |
| `name` | string | Yes | The name of the custom field. |
| `metadata` | object | No | A configuration object used for advanced custom fields, like single-select, multi-select, checkboxes, and numbers. |

### Metadata Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `format` | string | Used only for number type custom fields. Valid options: `"plain"`, `"formatted"`, `"percent"` |
| `toggle` | boolean | Used for checkbox custom fields to specify whether the field is checked or not. |
| `options` | array | Used for single and multi select custom fields. Each object is a valid option. |

### Options Object Structure (for select/multiSelect)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The id of the specific option. |
| `value` | string | The actual option seen on screen to be selected. |
| `color` | string | A hex code (no alpha) representing the color of the option. |

## Response

**Status Code:** 200  
**Content-Type:** `application/json`

### Response Body

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The ID of the custom field. |
| `type` | string | The type of custom field. |

## Example Requests

### Text Field
```json
{
  "type": "text",
  "name": "Project Code"
}
```

### Number Field with Format
```json
{
  "type": "number",
  "name": "Budget",
  "metadata": {
    "format": "formatted"
  }
}
```

### Select Field with Options
```json
{
  "type": "select",
  "name": "Priority",
  "metadata": {
    "options": [
      {
        "id": "opt_1",
        "value": "High",
        "color": "#FF0000"
      },
      {
        "id": "opt_2",
        "value": "Medium",
        "color": "#FFA500"
      },
      {
        "id": "opt_3",
        "value": "Low",
        "color": "#00FF00"
      }
    ]
  }
}
```

## Example Response

```json
{
  "id": "cf_123456",
  "type": "select"
}
```