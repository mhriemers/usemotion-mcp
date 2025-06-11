# Add Custom Field to Task

Add a custom field value to a task.

## Endpoint

```
POST /beta/custom-field-values/task/{taskId}
```

## Authorization

**Header:** `X-API-Key`  
**Type:** string  
**Required:** Yes

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Yes | The task for which a new custom field value will be added. |

## Request Body

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customFieldInstanceId` | string | Yes | The custom field on the workspace that is being set on the task. |
| `value` | object | Yes | The value of the custom field on the workspace that is being set. |

### Value Object Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | The type of custom field. Valid options: `"text"`, `"url"`, `"date"`, `"person"`, `"multiPerson"`, `"phone"`, `"select"`, `"multiSelect"`, `"number"`, `"email"`, `"checkbox"`, `"relatedTo"` |
| `value` | string \| number | No | The actual value being set. |

## Response

**Status Code:** 200  
**Content-Type:** `application/json`

### Response Body

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | The type of custom field. Valid options: `"text"`, `"url"`, `"date"`, `"person"`, `"multiPerson"`, `"phone"`, `"select"`, `"multiSelect"`, `"number"`, `"email"`, `"checkbox"`, `"relatedTo"` |
| `value` | string \| number | The actual value being set. |

## Example Request

```json
{
  "customFieldInstanceId": "cf_789012",
  "value": {
    "type": "number",
    "value": 42
  }
}
```

## Example Response

```json
{
  "type": "number",
  "value": 42
}
```