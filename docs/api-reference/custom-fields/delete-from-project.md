# Delete Custom Field from Project

Deletes a custom field value from a project.

## Endpoint

```
DELETE /beta/custom-field-values/project/{projectId}/custom-fields/{valueId}
```

## Authorization

**Header:** `X-API-Key`  
**Type:** string  
**Required:** Yes

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | string | Yes | The project from which a custom field value will be deleted. |
| `valueId` | string | Yes | The ID of the custom field value that will be deleted. |

## Request Body

No request body required.

## Response

**Status Code:** 204 (No Content)

The custom field value has been successfully deleted from the project. No response body is returned.

## Example Request

```
DELETE /beta/custom-field-values/project/proj_123456/custom-fields/cfv_789012
X-API-Key: your-api-key-here
```